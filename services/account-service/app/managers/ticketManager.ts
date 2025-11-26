import { AppError } from '@shared/helpers/AppError';
import Ticket from '@models/Ticket';
import { JwtPayload } from 'jsonwebtoken';
import { ESupportedCurrency, ETicketStatus, EUserRole } from '@shared/constants/enums';
import { ICategoryModel } from '@models/Category';
import { IAppError } from '@shared/constants/interfaces';
import Evaluation from '@models/Evaluation';
import { getTicketsWithAcceptedEvaluation } from '@aggregations/getTicketsWithAcceptedEvaluation';

export const TicketManager = {
  getTicketByID: async (ticketId: string) => {
    const ticket = await Ticket.findOne({ _id: ticketId }).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
      { path: 'evaluations.user', select: 'email name surname city' },
    ]);

    if (!ticket) {
      throw new AppError('Ticket with provided id not found', 404);
    }

    return ticket;
  },
  getTicketsByCategoryID: async (categoryId: string) => {
    const tickets = await Ticket.find({ category: categoryId }).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
    ]);

    return tickets;
  },
  getUserTickets: async (user?: JwtPayload) => {
    if (!user) {
      throw new AppError('Missing user data', 401);
    }

    let tickets = [];
    const isSpecialist = user.role === EUserRole.SPECIALIST;

    if (isSpecialist) {
      tickets = await getTicketsWithAcceptedEvaluation(user.userId);
    } else {
      tickets = await Ticket.find({ createdBy: user.userId }).populate([
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
    }

    return tickets;
  },
  getAvailableTicketsForSpecialist: async (city: string) => {
    const allowedStatuses = [ETicketStatus.PRICE_EVALUATION, ETicketStatus.PRICE_USER_ACCEPTATION];
    const tickets = await Ticket.find({
      city,
      status: {
        $in: allowedStatuses,
      },
    }).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
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
  createNewTicket: async (
    ticketData: {
      title: string;
      description: string;
      category: ICategoryModel;
    },
    user?: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError('Missing user data', 401);
    }

    const ticket = new Ticket({
      createdBy: user.userId,
      assignee: user.userId,
      city: user.city,
      ...ticketData,
    });

    try {
      await ticket.save();
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error while creating new ticket: ${error}`, 500);
    }
  },
  deleteTicket: async (ticketId: string, user?: JwtPayload) => {
    if (!user) {
      throw new AppError('Missing user data', 401);
    }

    const ticket = await TicketManager.getTicketByID(ticketId);
    const isAdmin = user.role === EUserRole.ADMIN;
    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdmin && !isOwner) {
      throw new AppError('Not enough permissions to delete the ticket', 403);
    }

    try {
      await Ticket.deleteOne({ _id: ticketId });
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error on ticket delete: ${error}`, 500);
    }
  },
  ticketSpecialistEvaluationHandler: async (
    ticketId: string,
    evaluatedPrice: { value: number; currency: ESupportedCurrency },
    evaluatedMinutes: number,
    user?: JwtPayload,
  ) => {
    if (!user) {
      throw new AppError('Missing user data', 401);
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    // PRICE_USER_ACCEPTATION status is also here to allow other specialists to evaluate a ticket
    const isEligibleForEvaluation = [ETicketStatus.PRICE_EVALUATION, ETicketStatus.PRICE_USER_ACCEPTATION].includes(
      ticket.status,
    );

    if (!isEligibleForEvaluation) {
      throw new AppError('Ticket does not have proper status for evaluation', 400);
    }

    const isAdmin = user?.role === EUserRole.ADMIN;
    const isSpecialist = user?.role === EUserRole.SPECIALIST;

    if (!isAdmin && !isSpecialist) {
      throw new AppError('Missing permissions to evaluate a ticket', 403);
    }

    try {
      const currentDate = new Date();
      // create date of response by adding minutes (as miliseconds) to current date
      const dateOfResponse = new Date(currentDate.getTime() + evaluatedMinutes * 60000);

      if (ticket.status === ETicketStatus.PRICE_EVALUATION) {
        ticket.status = ETicketStatus.PRICE_USER_ACCEPTATION;
      }

      ticket.updatedBy = user.userId;
      ticket.updatedAt = currentDate;

      const evaluation = await Evaluation.create({
        user: user.userId,
        price: evaluatedPrice,
        dateOfResponse,
      });

      ticket.evaluations.push(evaluation._id);
      await ticket.save();
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error on ticket evaluation: ${error}`, 500);
    }
  },
  ticketEvaluationAcceptHandler: async (ticketId: string, evaluationId: string, user?: JwtPayload) => {
    if (!user) {
      throw new AppError('Missing user data', 401);
    }

    const ticket = await TicketManager.getTicketByID(ticketId);

    const isEligibleForEvaluation = ticket.status === ETicketStatus.PRICE_USER_ACCEPTATION;

    if (!isEligibleForEvaluation) {
      throw new AppError('Ticket does not have proper status for evaluation accept by user', 400);
    }

    const isAdmin = user.role === EUserRole.ADMIN;
    const isOwner = user.userId === ticket.createdBy.id.toString();

    if (!isAdmin && !isOwner) {
      throw new AppError('Missing permissions to accept ticket evaluation', 403);
    }

    const evaluation = ticket.evaluations.find((evaluationObjectId) => evaluationObjectId.toString() === evaluationId);

    if (!evaluation) {
      throw new AppError('Evaluation with provided id does not exist', 404);
    }

    try {
      ticket.acceptedEvaluation = evaluation;
      ticket.updatedBy = user.userId;
      ticket.status = ETicketStatus.PENDING_PAYMENT;

      await ticket.save();
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error on ticket evaluation accept: ${error}`, 500);
    }
  },
};
