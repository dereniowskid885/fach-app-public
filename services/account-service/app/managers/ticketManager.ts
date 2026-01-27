import { AppError } from '@shared/utils/AppError';
import Ticket, { ITicketModel } from '@models/Ticket';
import { JwtPayload } from 'jsonwebtoken';
import { ESupportedCurrency, ETicketStatus, EUserRole } from '@shared/constants/enums';
import { EResponseStatus } from '@shared/constants/responseStatus';
import { CategoryManager } from './categoryManager';
import { UserManager } from './userManager';
import { checkTicketStatusTransition } from '@helpers/checkTicketStatusTransition';
import { FilterQuery } from 'mongoose';
import { IEvaluationSchema } from '@schemas/evaluationSchema';

export const TicketManager = {
  getTicketByID: async (ticketId: string) => {
    const ticket = await Ticket.findOne({ _id: ticketId }).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
      { path: 'acceptedEvaluation' },
      {
        path: 'evaluations',
        populate: {
          path: 'user',
          select: 'email name surname city',
        },
      },
    ]);

    if (!ticket) {
      throw new AppError(404, EResponseStatus.ERROR_TICKET_NOT_FOUND, 'Ticket with provided id not found');
    }

    return ticket;
  },
  getTickets: async (filter: FilterQuery<ITicketModel>, user: JwtPayload) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const tickets = await Ticket.find(filter).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
      { path: 'acceptedEvaluation' },
      {
        path: 'evaluations',
        populate: {
          path: 'user',
          select: 'email name surname city',
        },
      },
    ]);

    return tickets;
  },
  createTicket: async (
    ticketData: {
      title: string;
      description: string;
      categoryId: string;
    },
    user: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = new Ticket({
      createdBy: user.userId,
      assignee: user.userId,
      city: user.city,
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

    const ticket = await TicketManager.getTicketByID(ticketId);

    if (!ticket) {
      throw new AppError(404, EResponseStatus.ERROR_TICKET_NOT_FOUND, 'Ticket with provided id not found');
    }

    // TODO: modify while doing superadmin role ticket
    // https://github.com/dereniowskid885/fach-app/issues/7
    const isAdmin = user.role === EUserRole.ADMIN;
    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdmin && !isOwner) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'Not enough permissions to delete the ticket');
    }

    await Ticket.deleteOne({ _id: ticketId });
  },
  ticketEvaluationHandler: async (
    ticketId: string,
    evaluatedPrice: { value: number; currency: ESupportedCurrency },
    evaluatedMinutes: number,
    user: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    const isStatusTransitionAllowed = checkTicketStatusTransition(ticket.status, ETicketStatus.PRICE_USER_ACCEPTATION);

    if (!isStatusTransitionAllowed) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_TICKET_INVALID_STATUS,
        'Ticket does not have proper status for evaluation',
      );
    }

    const isUserAllowedToEvaluate = [EUserRole.ADMIN, EUserRole.SPECIALIST].includes(user.role);

    if (!isUserAllowedToEvaluate) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'Missing permissions to evaluate a ticket');
    }

    const isTicketAlreadyEvaluatedByCurrentUser = ticket.evaluations.some(
      (evaluation) => evaluation.user.id === user.userId,
    );

    if (isTicketAlreadyEvaluatedByCurrentUser) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_TICKET_ALREADY_EVALUATED_BY_USER,
        'You have already put an evaluation on this ticket',
      );
    }

    if (evaluatedMinutes < 30 || evaluatedPrice.value < 200) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_INVALID_DATA,
        'Ticket response duration (minutes) cannot be lower than 30 and price (price.value) cannot be lower than 2.00',
      );
    }

    const currentDate = new Date();
    // create date of response by adding minutes (as miliseconds) to current date
    const dateOfResponse = new Date(currentDate.getTime() + evaluatedMinutes * 60000);

    if (ticket.status === ETicketStatus.PRICE_EVALUATION) {
      ticket.status = ETicketStatus.PRICE_USER_ACCEPTATION;
    }

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

    const isEligibleForEvaluation = ticket.status === ETicketStatus.PRICE_USER_ACCEPTATION;

    if (!isEligibleForEvaluation) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_TICKET_INVALID_STATUS,
        'Ticket does not have proper status for evaluation accept by user',
      );
    }

    // TODO: modify while doing superadmin role ticket
    // https://github.com/dereniowskid885/fach-app/issues/7
    const isAdmin = user.role === EUserRole.ADMIN;
    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdmin && !isOwner) {
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
    ticket.status = ETicketStatus.PENDING_PAYMENT;
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
    const isAdmin = user.role === EUserRole.ADMIN;
    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdmin && !isOwner) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'Not enough permissions to update ticket');
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'No data provided for update');
    }

    const { categoryId, city, status, assigneeId, title, description } = updateData;

    if (categoryId !== undefined || city !== undefined || status !== undefined || assigneeId !== undefined) {
      if (!isAdmin) {
        throw new AppError(
          403,
          EResponseStatus.ERROR_USER_INVALID_ROLE,
          'Not enough permissions to update ticket category, city, status or assignee',
        );
      }

      if (categoryId !== undefined) {
        const category = await CategoryManager.getCategoryById(categoryId);

        ticket.category = category._id;
      }

      if (city !== undefined) {
        ticket.city = city;
      }

      if (status !== undefined) {
        const isStatusTransitionAllowed = checkTicketStatusTransition(ticket.status, status);

        if (!isStatusTransitionAllowed) {
          throw new AppError(400, EResponseStatus.ERROR_TICKET_INVALID_STATUS, 'Invalid status transition attempted');
        }

        ticket.status = status;
      }

      if (assigneeId !== undefined) {
        const assignee = await UserManager.getUserById(assigneeId);

        ticket.assignee = assignee._id;
      }
    }

    if (title !== undefined) {
      ticket.title = title;
    }

    if (description !== undefined) {
      ticket.description = description;
    }

    ticket.updatedBy = user.userId;
    ticket.updatedAt = new Date();
    await ticket.save();

    return ticket.populate({ path: 'updatedBy', select: 'email' });
  },
  ticketEvaluationEditHandler: async (
    ticketId: string,
    evaluationId: string,
    price: { value: number; currency: ESupportedCurrency },
    minutes: number,
    user: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    if (user.role !== EUserRole.SPECIALIST) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'Missing permissions to edit an evaluation');
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    if (ticket.status !== ETicketStatus.PRICE_USER_ACCEPTATION) {
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
