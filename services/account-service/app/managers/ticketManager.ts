import Ticket, { ITicketModel } from '@models/Ticket';
import Comment from '@models/Comment';
import { JwtPayload } from 'jsonwebtoken';
import { CategoryManager } from './categoryManager';
import { UserManager } from './userManager';
import { FilterQuery, Types } from 'mongoose';
import { IEvaluationSchema } from '@schemas/evaluationSchema';
import { basicUserProjection } from '@projections/user';
import { AppError } from 'shared-backend';
import {
  EResponseStatus,
  ESupportedCurrency,
  ETicketStatus,
  isAdmin,
  isSpecialist,
  checkTicketStatusTransition,
  ENotificationType,
} from 'shared-types';
import { canDeleteTicketComment, canViewTicketComments, resolveAssigneeOnStatusChange } from '@helpers/ticket';
import { NotificationManager } from './notificationManager';
import { IUserModel } from '@models/User';
import { IPaymentModel } from '@models/Payment';
import { basicCategoryProjection } from '@projections/category';
import { basicTicketProjection } from '@projections/ticket';
import { IPaginationOptions } from '@utils/filterBuilder';

export const TicketManager = {
  getTicketByID: async (ticketId: string, projection?: Partial<Record<keyof ITicketModel, number>>) => {
    const ticket = await Ticket.findOne({ _id: ticketId })
      .select(projection ?? {})
      .populate([
        { path: 'category', select: basicCategoryProjection },
        { path: 'assignee', select: basicUserProjection },
        { path: 'createdBy', select: basicUserProjection },
        { path: 'updatedBy', select: basicUserProjection },
        { path: 'payment' },
        {
          path: 'acceptedEvaluation',
          populate: {
            path: 'user',
            select: basicUserProjection,
          },
        },
      ]);

    if (!ticket) {
      throw new AppError(404, EResponseStatus.ERROR_TICKET_NOT_FOUND, 'Ticket with provided id not found');
    }

    return ticket;
  },
  getTickets: async (filter: FilterQuery<ITicketModel>, pagination?: IPaginationOptions) => {
    const filterObj = filter;

    const totalLength = await Ticket.countDocuments(filterObj);

    if (pagination?.cursor) {
      filterObj._id = { $lt: new Types.ObjectId(pagination.cursor) };
    }

    let query = Ticket.find(filterObj)
      .select(basicTicketProjection)
      .populate([
        { path: 'category', select: basicCategoryProjection },
        { path: 'assignee', select: basicUserProjection },
        { path: 'createdBy', select: basicUserProjection },
        { path: 'updatedBy', select: basicUserProjection },
        { path: 'payment' },
      ])
      .sort({ updatedAt: -1 });

    if (pagination?.limit) {
      query.limit(pagination.limit + 1);
    }

    const tickets = await query;

    const hasNextPage = tickets.length > (pagination?.limit || 0);
    const data = hasNextPage ? tickets.slice(0, pagination?.limit || 0) : tickets;
    const nextCursor = hasNextPage ? data[data.length - 1]._id.toString() : null;

    return { data, nextCursor, hasNextPage, totalLength };
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
  deleteTicket: async (ticketId: string, userId: string) => {
    const ticket = await TicketManager.getTicketByID(ticketId, { _id: 1, title: 1, acceptedEvaluation: 1 });
    const ticketTitle = ticket.title;

    await ticket.deleteOne();

    const ticketOwner = ticket.createdBy as IUserModel;
    const recipients = [ticketOwner];

    if (ticket.acceptedEvaluation) {
      const specialist = ticket.acceptedEvaluation.user as IUserModel;

      recipients.push(specialist);
    }

    const actorId = userId; // admin
    await Promise.all(
      recipients.map((recipient) => {
        NotificationManager.handleSingleNotificationByType(
          ENotificationType.ADMIN_TICKET_DELETED,
          ticketId,
          recipient,
          actorId,
          ticketTitle,
        );
      }),
    );
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

    const ticket = await TicketManager.getTicketByID(ticketId, { ...basicTicketProjection, evaluations: 1 });

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

    ticket.evaluations.push({
      user: user.userId,
      price: evaluatedPrice,
      minutes: evaluatedMinutes,
      dateOfResponse,
    } as IEvaluationSchema);

    await ticket.save();

    const recipient = ticket.createdBy as IUserModel; // user
    const actorId = user.userId; // specialist
    await NotificationManager.handleSingleNotificationByType(
      ENotificationType.SPECIALIST_EVALUATION_ADDED,
      ticketId,
      recipient,
      actorId,
    );

    return ticket;
  },
  ticketEvaluationAcceptHandler: async (ticketId: string, evaluationId: string, user: JwtPayload) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = await TicketManager.getTicketByID(ticketId, { ...basicTicketProjection, evaluations: 1 });

    if (ticket.status !== ETicketStatus.AWAITING_EVALUATION) {
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
    ticket.status = ETicketStatus.AWAITING_PAYMENT;
    await ticket.save();

    const recipient = evaluation.user as IUserModel; // specialist
    const actorId = user.userId; // user
    await NotificationManager.handleSingleNotificationByType(
      ENotificationType.USER_EVALUATION_ACCEPTED,
      ticketId,
      recipient,
      actorId,
    );

    return ticket;
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

    const ticket = await TicketManager.getTicketByID(ticketId, basicTicketProjection);
    const ticketTitle = ticket.title;
    const specialist = ticket.acceptedEvaluation?.user as IUserModel;

    // TODO: modify while doing superadmin role ticket
    // https://github.com/dereniowskid885/fach-app/issues/7
    const isAdminRole = isAdmin(user.role);
    const isSpecialistRole = isSpecialist(user.role);
    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdminRole && !isSpecialistRole && !isOwner) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'Not enough permissions to update ticket');
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'No data provided for update');
    }

    const { city, assigneeId } = updateData;

    const isAdminOnlyFields = city !== undefined || assigneeId !== undefined;

    if (!isAdminRole && isAdminOnlyFields) {
      throw new AppError(
        403,
        EResponseStatus.ERROR_USER_INVALID_ROLE,
        'Not enough permissions to update ticket city, or assignee',
      );
    }

    if (isAdminOnlyFields) {
      if (city !== undefined) ticket.city = city;
      if (assigneeId !== undefined) {
        const assignee = await UserManager.getUserById(assigneeId);

        ticket.assignee = assignee._id;
      }
    }

    const { title, description, categoryId, status } = updateData;

    const isEditableFields = title !== undefined || description !== undefined || categoryId !== undefined;
    const isInvalidUpdate = !isAdminRole && (!isOwner || ticket.status !== ETicketStatus.AWAITING_EVALUATION);

    if (isEditableFields && isInvalidUpdate) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_TICKET_INVALID_STATUS,
        'Ticket cannot be updated in current status',
      );
    }

    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (categoryId !== undefined) {
      const category = await CategoryManager.getCategoryById(categoryId);

      ticket.evaluations = [];
      ticket.evaluationsCount = 0;
      ticket.category = category._id;
    }

    if (status !== undefined) {
      if (!checkTicketStatusTransition(ticket.status, status, user.role)) {
        throw new AppError(400, EResponseStatus.ERROR_TICKET_INVALID_STATUS_CHANGE, 'Wrong ticket status transition');
      }

      if (!isAdminRole && status === ETicketStatus.SOLUTION_REVIEW && ticket.specialistCommentsCount === 0) {
        throw new AppError(
          400,
          EResponseStatus.ERROR_TICKET_SPECIALIST_COMMENT_NOT_FOUND,
          'Specialist must comment before submitting for review',
        );
      }

      if (
        (status === ETicketStatus.AWAITING_PAYMENT || status === ETicketStatus.IN_PROGRESS) &&
        ticket.acceptedEvaluation === null
      ) {
        throw new AppError(
          400,
          EResponseStatus.ERROR_TICKET_INVALID_STATUS_CHANGE,
          'You cannot move ticket to awaiting_payment or in_progress without accepted evaluation',
        );
      }

      if (
        ticket.status === ETicketStatus.MODERATOR_INVESTIGATION &&
        status === ETicketStatus.AWAITING_PAYMENT &&
        ticket.payment !== null
      ) {
        throw new AppError(
          400,
          EResponseStatus.ERROR_TICKET_INVALID_STATUS_CHANGE,
          'Cannot revert to status awaiting_payment after successful payment',
        );
      }

      if (status === ETicketStatus.AWAITING_EVALUATION) {
        ticket.acceptedEvaluation = null;
        // TODO: also evaluations should be cleared ?
      }

      ticket.assignee = resolveAssigneeOnStatusChange(status, ticket);
      ticket.status = status;
    }

    ticket.updatedBy = user.userId;
    await ticket.save();

    await NotificationManager.handleTicketUpdate(updateData, ticket, user.userId, ticketTitle, specialist);

    return ticket;
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

    const ticket = await TicketManager.getTicketByID(ticketId, { ...basicTicketProjection, evaluations: 1 });

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
      evaluation.minutes = minutes;
    }

    if (price) {
      evaluation.price = price;
    }

    ticket.updatedBy = user.userId;
    await ticket.save();

    const recipient = ticket.createdBy as IUserModel; // user
    const actorId = user.userId; // specialist
    await NotificationManager.handleSingleNotificationByType(
      ENotificationType.SPECIALIST_EVALUATION_EDITED,
      ticketId,
      recipient,
      actorId,
    );

    return ticket;
  },
  handleSuccessfulPayment: async (payment: IPaymentModel, ticketId: string) => {
    const ticket = await Ticket.findById(ticketId).populate('acceptedEvaluation');

    if (!ticket) {
      throw new AppError(
        404,
        EResponseStatus.ERROR_TICKET_NOT_FOUND,
        'Ticket not found - wrong ticketId associated with payment',
      );
    }

    if (ticket.status !== ETicketStatus.AWAITING_PAYMENT) {
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

    ticket.payment = payment;
    ticket.updatedBy = ticket.createdBy;
    ticket.assignee = acceptedEvaluation.user;
    ticket.status = ETicketStatus.IN_PROGRESS;

    await ticket.save();

    const recipient = acceptedEvaluation.user as IUserModel; // specialist
    const actorId = ticket.createdBy._id.toString(); // user
    await NotificationManager.handleSingleNotificationByType(
      ENotificationType.USER_TICKET_PAYMENT_DONE,
      ticketId,
      recipient,
      actorId,
    );
  },
  createTicketComment: async (
    user: JwtPayload,
    ticketId: string,
    commentData: {
      content: string;
      attachments: string[];
    },
  ) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const ticket = await TicketManager.getTicketByID(ticketId, basicTicketProjection);

    const hasAccessToComments = canViewTicketComments(user, ticket);

    if (!hasAccessToComments) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'You cannot create a ticket comment');
    }

    const { content, attachments } = commentData;

    const comment = new Comment({
      user: user.userId,
      userRole: user.role,
      ticket: ticket._id,
      content,
      attachments,
    });

    await comment.save();

    await NotificationManager.handleNewTicketComment(ticket, content, user.userId);

    return comment;
  },
  deleteTicketComment: async (user: JwtPayload, commentId: string) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    const comment = await Comment.findById({ _id: commentId }).populate('user');

    if (!comment) {
      throw new AppError(404, EResponseStatus.ERROR_INVALID_DATA, 'Comment does not exist');
    }

    const isEligibleToDelete = canDeleteTicketComment(user, comment);

    if (!isEligibleToDelete) {
      throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'You cannot delete this ticket comment');
    }

    await comment.deleteOne();
  },
  getTicketComments: async (user: JwtPayload, ticketId: string, pagination: IPaginationOptions) => {
    const ticket = await TicketManager.getTicketByID(ticketId, basicTicketProjection);

    const hasAccessToComments = canViewTicketComments(user, ticket);

    if (!hasAccessToComments) {
      return { data: [], totalLength: 0, nextCursor: null, hasNextPage: false };
    }

    const query = { ticket: ticket._id, _id: { $lt: new Types.ObjectId(pagination.cursor) } };
    const totalLength = await Comment.countDocuments({ ticket: ticket._id });

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .limit(pagination.limit + 1)
      .populate([{ path: 'user', select: basicUserProjection }]);

    const hasNextPage = comments.length > pagination.limit;
    const data = hasNextPage ? comments.slice(0, pagination.limit) : comments;
    const nextCursor = hasNextPage ? data[data.length - 1]._id.toString() : null;

    return { data, totalLength, nextCursor, hasNextPage };
  },
  getTicketEvaluations: async (user: JwtPayload, ticketId: string) => {
    const ticket = await TicketManager.getTicketByID(ticketId, { ...basicTicketProjection, evaluations: 1 });

    await ticket.populate({
      path: 'evaluations',
      populate: {
        path: 'user',
        select: basicUserProjection,
      },
    });

    if (isSpecialist(user.role)) {
      const currentUserEvaluation = ticket.evaluations.find((evaluation) => evaluation.user?.id === user?.userId);

      return [currentUserEvaluation];
    }

    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdmin(user.role) && !isOwner) {
      throw new AppError(
        403,
        EResponseStatus.ERROR_USER_INVALID_ROLE,
        'Missing permissions to view ticket evaluations',
      );
    }

    return ticket.evaluations;
  },
};
