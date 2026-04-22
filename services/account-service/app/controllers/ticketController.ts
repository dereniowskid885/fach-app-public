import { TicketManager } from '@managers/ticketManager';
import { IAppError, handleAppError } from 'shared-backend';
import type { Request, Response } from 'express';
import { FilterBuilder } from '@utils/filterBuilder';
import { PaymentManager } from '@managers/paymentManager';
import { UserManager } from '@managers/userManager';

export const createTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.createTicket(req.body, req.user);

    return res.status(200).json({ success: true, message: 'Ticket created successfully', data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const createTicketComment = async (req: Request, res: Response) => {
  try {
    const comment = await TicketManager.createTicketComment(req.user, req.params.id as string, req.body);

    return res.status(200).json({ success: true, message: 'Ticket comment created successfully', data: comment });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const filter = FilterBuilder.getTickets(req);
    const tickets = await TicketManager.getTickets(filter);

    return res.status(200).json({ success: true, dataLength: tickets.length, data: tickets });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getMyTickets = async (req: Request, res: Response) => {
  try {
    const filter = FilterBuilder.getMyTickets(req, req.user);
    const tickets = await TicketManager.getTickets(filter);

    return res.status(200).json({ success: true, dataLength: tickets.length, data: tickets });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getCompletedTickets = async (req: Request, res: Response) => {
  try {
    const filter = FilterBuilder.getCompletedTickets(req, req.user);
    const tickets = await TicketManager.getTickets(filter);

    return res.status(200).json({ success: true, dataLength: tickets.length, data: tickets });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getSpecialistAvailableTickets = async (req: Request, res: Response) => {
  try {
    const categoryId = (await UserManager.getUserById(req.user.userId)).category?._id.toString();

    const filter = FilterBuilder.getSpecialistAvailableTickets(req, categoryId);
    const tickets = await TicketManager.getTickets(filter);

    return res.status(200).json({ success: true, dataLength: tickets.length, data: tickets });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getSpecialistTicketsEvaluations = async (req: Request, res: Response) => {
  try {
    const categoryId = (await UserManager.getUserById(req.user.userId)).category?._id.toString();

    const filter = FilterBuilder.getSpecialistTicketsEvaluations(req, req.user.userId, categoryId);
    const tickets = await TicketManager.getTickets(filter);

    return res.status(200).json({ success: true, dataLength: tickets.length, data: tickets });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getTicketByID = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.getTicketByID(req.params.id as string);

    return res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getTicketComments = async (req: Request, res: Response) => {
  try {
    const comments = await TicketManager.getTicketComments(req.user, req.params.id as string);

    return res.status(200).json({ success: true, dataLength: comments.length, data: comments });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.updateTicket(req.params.id as string, req.body, req.user);

    return res.status(200).json({ success: true, message: 'Ticket updated successfully', data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    await TicketManager.deleteTicket(req.params.id as string);

    return res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteTicketComment = async (req: Request, res: Response) => {
  try {
    await TicketManager.deleteTicketComment(req.user, req.params.id as string);

    return res.status(200).json({ success: true, message: 'Ticket comment deleted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const ticketEvaluationHandler = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.ticketEvaluationHandler(
      req.params.id as string,
      req.body.price,
      req.body.minutes,
      req.user,
    );

    return res.status(200).json({ success: true, message: 'Ticket evaluated successfully', data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const ticketEvaluationAccept = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.ticketEvaluationAcceptHandler(
      req.params.id as string,
      req.body.evaluationId,
      req.user,
    );

    return res.status(200).json({ success: true, message: 'Ticket evaluation accepted successfully', data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const ticketEvaluationEdit = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.ticketEvaluationEditHandler(
      req.params.id as string,
      req.body.evaluationId,
      req.body.price,
      req.body.minutes,
      req.user,
    );

    return res.status(200).json({ success: true, message: 'Ticket evaluation updated successfully', data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const ticketPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const result = await PaymentManager.ticketPaymentHandler(req.user, req.params.id as string, amount, currency);

    return res.status(200).json({
      success: true,
      message: 'Ticket payment successfull',
      data: {
        clientSecret: result?.clientSecret,
        payment: result?.payment,
      },
    });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
