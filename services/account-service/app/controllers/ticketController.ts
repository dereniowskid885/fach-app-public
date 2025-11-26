import { TicketManager } from '@managers/ticketManager';
import { IAppError } from '@shared/constants/interfaces';
import { handleAppError } from '@shared/helpers/handleAppError';
import type { Request, Response } from 'express';

export const getTicketByID = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.getTicketByID(req.params.id);

    return res.status(200).json(ticket);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getTicketsByCategoryID = async (req: Request, res: Response) => {
  try {
    const tickets = await TicketManager.getTicketsByCategoryID(req.params.categoryId);

    return res.status(200).json(tickets);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getUserTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await TicketManager.getUserTickets(req.user);

    return res.status(200).json(tickets);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getSpecialistAvailableTickets = async (req: Request, res: Response) => {
  try {
    const city = req.params.city ?? req.user?.city;
    const tickets = await TicketManager.getAvailableTicketsForSpecialist(city);

    return res.status(200).json(tickets);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    await TicketManager.createNewTicket(req.body, req.user);

    return res.status(200).json({ message: 'Ticket created successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    await TicketManager.deleteTicket(req.params.id, req.user);

    return res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const ticketEvaluationHandler = async (req: Request, res: Response) => {
  try {
    await TicketManager.ticketSpecialistEvaluationHandler(req.params.id, req.body.price, req.body.minutes, req.user);

    return res.status(200).json({ message: 'Ticket evaluated successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const ticketEvaluationAccept = async (req: Request, res: Response) => {
  try {
    await TicketManager.ticketEvaluationAcceptHandler(req.params.id, req.body.evaluationId, req.user);

    return res.status(200).json({ message: 'Ticket evaluation accepted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
