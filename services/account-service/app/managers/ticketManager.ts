import { AppError } from '@shared/utils/AppError';
import Ticket, { ITicketModel } from '@models/Ticket';
import { JwtPayload } from 'jsonwebtoken';
import { ETicketStatus } from '@shared/enums/ticket';
import { ESupportedCurrency } from '@shared/enums/currency';
import { EUserRole } from '@shared/enums/role';
import { EResponseStatus } from '@shared/enums/responseStatus';
import { CategoryManager } from './categoryManager';
import { UserManager } from './userManager';
import { FilterQuery } from 'mongoose';
import { IEvaluationSchema } from '@schemas/evaluationSchema';
import { safeUserProjection } from '@constants/projections';
import { checkTicketStatusTransition } from '@helpers/checkTicketStatusTransition';
import { isAdmin } from '@shared/utils/role';

export const TicketManager = {
  getTicketByID: async (ticketId: string) => {
    const ticket = await Ticket.findOne({ _id: ticketId }).populate([
      { path: 'category' },
      { path: 'assignee', select: safeUserProjection },
      { path: 'createdBy', select: safeUserProjection },
      { path: 'updatedBy', select: safeUserProjection },
      {
        path: 'acceptedEvaluation',
        populate: {
          path: 'user',
          select: safeUserProjection,
        },
      },
      {
        path: 'evaluations',
        populate: {
          path: 'user',
          select: safeUserProjection,
        },
      },
    ]);

    if (!ticket) {
      throw new AppError(404, EResponseStatus.ERROR_TICKET_NOT_FOUND, 'Ticket with provided id not found');
    }

    return ticket;
  },
  getTickets: async (filter: FilterQuery<ITicketModel>) => {
    const tickets = await Ticket.find(filter)
      .populate([
        { path: 'category' },
        { path: 'assignee', select: safeUserProjection },
        { path: 'createdBy', select: safeUserProjection },
        { path: 'updatedBy', select: safeUserProjection },
        {
          path: 'acceptedEvaluation',
          populate: {
            path: 'user',
            select: safeUserProjection,
          },
        },
        {
          path: 'evaluations',
          populate: {
            path: 'user',
            select: safeUserProjection,
          },
        },
      ])
      .sort({ updatedAt: -1 });

    return tickets;
  },
  createTicket: async (
    ticketData: {
      title: string;
      description: string;
      categoryId: string;
      city: string;
    },
    user: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = new Ticket({
      createdBy: user.userId,
      assignee: user.userId,
      city: ticketData.city,
      category: ticketData.categoryId,
      title: ticketData.title,
      description: ticketData.description,
    });

    await ticket.save();

    return ticket;
  },
  deleteTicket: async (ticketId: string, user: JwtPayload) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    // TODO: modify while doing superadmin role ticket
    // https://github.com/dereniowskid885/fach-app/issues/7
    if (user.role !== EUserRole.ADMIN) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'Not enough permissions to delete the ticket');
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    if (!ticket) {
      throw new AppError(404, EResponseStatus.ERROR_TICKET_NOT_FOUND, 'Ticket with provided id not found');
    }

    await Ticket.deleteOne({ _id: ticketId });
  },
  ticketEvaluationHandler: async (
    ticketId: string,
    evaluatedPrice: { amountInCents: number; currency: ESupportedCurrency },
    evaluatedMinutes: number,
    user: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    const isTicketAlreadyEvaluatedByCurrentUser = ticket.evaluations.some(
      (evaluation) => evaluation.user?.id === user?.userId,
    );

    if (isTicketAlreadyEvaluatedByCurrentUser) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_TICKET_ALREADY_EVALUATED_BY_USER,
        'You have already put an evaluation on this ticket',
      );
    }

    if (evaluatedMinutes < 30 || evaluatedPrice.amountInCents < 200) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_INVALID_DATA,
        'Ticket response duration (minutes) cannot be lower than 30 and price amount in cents cannot be lower than 200',
      );
    }

    const currentDate = new Date();
    // create date of response by adding minutes (as miliseconds) to current date
    const dateOfResponse = new Date(currentDate.getTime() + evaluatedMinutes * 60000);

    ticket.updatedBy = user.userId;
    ticket.updatedAt = currentDate;

    ticket.evaluations.push({
      user: user.userId,
      price: evaluatedPrice,
      dateOfResponse,
    } as IEvaluationSchema);

    await ticket.save();

    return ticket.populate({ path: 'updatedBy', select: 'email' });
  },
  ticketEvaluationAcceptHandler: async (ticketId: string, evaluationId: string, user: JwtPayload) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    const isEligibleForEvaluation = checkTicketStatusTransition(ticket.status, ETicketStatus.AWAITING_PAYMENT);

    if (!isEligibleForEvaluation) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_TICKET_INVALID_STATUS,
        'Ticket does not have proper status for evaluation accept by user',
      );
    }

    // TODO: modify while doing superadmin role ticket
    // https://github.com/dereniowskid885/fach-app/issues/7
    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdmin(user.role) && !isOwner) {
      throw new AppError(
        403,
        EResponseStatus.ERROR_USER_INVALID_ROLE,
        'Missing permissions to accept ticket evaluation',
      );
    }

    const evaluation = ticket.evaluations.find((evaluation) => evaluation._id.toString() === evaluationId);

    if (!evaluation) {
      throw new AppError(404, EResponseStatus.ERROR_EVALUATION_NOT_FOUND, 'Evaluation with provided id does not exist');
    }

    ticket.acceptedEvaluation = evaluation;
    ticket.updatedBy = user.userId;
    ticket.updatedAt = new Date();
    ticket.status = ETicketStatus.AWAITING_PAYMENT;
    await ticket.save();

    return ticket.populate({ path: 'updatedBy', select: 'email' });
  },
  updateTicket: async (
    ticketId: string,
    updateData: Partial<{
      categoryId: string;
      city: string;
      status: ETicketStatus;
      assigneeId: string;
      title: string;
      description: string;
    }>,
    user: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    // TODO: modify while doing superadmin role ticket
    // https://github.com/dereniowskid885/fach-app/issues/7
    const isAdminRole = isAdmin(user.role);
    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdminRole && !isOwner) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'Not enough permissions to update ticket');
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'No data provided for update');
    }

    const { city, assigneeId } = updateData;

    const hasAdminOnlyFields = city !== undefined || assigneeId !== undefined;

    if (!isAdminRole && hasAdminOnlyFields) {
      throw new AppError(
        403,
        EResponseStatus.ERROR_USER_INVALID_ROLE,
        'Not enough permissions to update ticket city, or assignee',
      );
    }

    if (hasAdminOnlyFields) {
      if (city !== undefined) {
        ticket.city = city;
      }

      if (assigneeId !== undefined) {
        const assignee = await UserManager.getUserById(assigneeId);

        ticket.assignee = assignee._id;
      }
    }

    const { title, description, categoryId, status } = updateData;

    const isInvalidUpdate = !isAdminRole && ticket.status !== ETicketStatus.AWAITING_EVALUATION;

    if (title !== undefined) {
      if (isInvalidUpdate) {
        throw new AppError(
          400,
          EResponseStatus.ERROR_TICKET_INVALID_STATUS,
          'Ticket title cannot be updated in current status',
        );
      }

      ticket.title = title;
    }

    if (description !== undefined) {
      if (isInvalidUpdate) {
        throw new AppError(
          400,
          EResponseStatus.ERROR_TICKET_INVALID_STATUS,
          'Ticket description cannot be updated in current status',
        );
      }

      ticket.description = description;
    }

    if (categoryId !== undefined) {
      if (isInvalidUpdate) {
        throw new AppError(
          400,
          EResponseStatus.ERROR_TICKET_INVALID_STATUS,
          'Ticket category cannot be updated in current status',
        );
      }

      const category = await CategoryManager.getCategoryById(categoryId);

      // TODO: sent notification to specialists who evaluated the ticket
      ticket.evaluations = [];
      ticket.category = category._id;
    }

    if (status !== undefined) {
      const isTicketCancellation =
        ticket.status === ETicketStatus.AWAITING_EVALUATION && status === ETicketStatus.CANCELED;

      if (isAdminRole || isTicketCancellation) {
        ticket.status = status;
      } else {
        throw new AppError(400, EResponseStatus.ERROR_TICKET_INVALID_STATUS, 'Wrong ticket status transition');
      }
    }

    ticket.updatedBy = user.userId;
    ticket.updatedAt = new Date();
    await ticket.save();

    return ticket.populate({ path: 'updatedBy', select: 'email' });
  },
  ticketEvaluationEditHandler: async (
    ticketId: string,
    evaluationId: string,
    price: { amountInCents: number; currency: ESupportedCurrency },
    minutes: number,
    user: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    if (ticket.status !== ETicketStatus.AWAITING_EVALUATION) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_TICKET_INVALID_STATUS,
        'Evaluation edit is not allowed in current ticket status',
      );
    }

    const evaluation = ticket.evaluations.find((evaluation) => evaluation._id.toString() === evaluationId);

    if (!evaluation) {
      throw new AppError(
        404,
        EResponseStatus.ERROR_EVALUATION_NOT_FOUND,
        'Evaluation with provided id does not belong to provided ticket or does not exist',
      );
    }

    if (evaluation.user._id.toString() !== user.userId) {
      throw new AppError(
        403,
        EResponseStatus.ERROR_USER_INVALID_ROLE,
        'Current user is not a specialist who has made an evaluation',
      );
    }

    if (minutes) {
      const currentDate = new Date();
      // create date of response by adding minutes (as miliseconds) to current date
      const dateOfResponse = new Date(currentDate.getTime() + minutes * 60000);

      evaluation.dateOfResponse = dateOfResponse;
    }

    if (price) {
      evaluation.price = price;
    }

    ticket.updatedBy = user.userId;
    ticket.updatedAt = new Date();

    await ticket.save();

    return ticket;
  },
  handleSuccessfulPayment: async (ticketId: string) => {
    const ticket = await Ticket.findById(ticketId).populate('acceptedEvaluation');

    if (!ticket) {
      throw new AppError(
        404,
        EResponseStatus.ERROR_TICKET_NOT_FOUND,
        'Ticket not found - wrong ticketId associated with payment',
      );
    }

    const isInvalidStatus = checkTicketStatusTransition(ticket.status, ETicketStatus.IN_PROGRESS);

    if (isInvalidStatus) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_TICKET_INVALID_STATUS,
        'Ticket has wrong status to perform this action',
      );
    }

    const acceptedEvaluation = ticket.acceptedEvaluation;

    if (!acceptedEvaluation) {
      throw new AppError(
        404,
        EResponseStatus.ERROR_INVALID_DATA,
        'Wrong ticket data - ticket does not have acceptedEvaluation',
      );
    }

    ticket.updatedBy = ticket.createdBy;
    ticket.updatedAt = new Date();
    ticket.assignee = acceptedEvaluation.user;
    ticket.status = ETicketStatus.IN_PROGRESS;

    await ticket.save();
  },
};
