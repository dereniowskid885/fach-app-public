import { TicketManager } from '@managers/ticketManager';
import { IAppError } from '@shared/utils/AppError';
import { handleAppError } from '@shared/helpers/handleAppError';
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

export const getTicketByID = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.getTicketByID(req.params.id);

    return res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.updateTicket(req.params.id, req.body, req.user);

    return res.status(200).json({ success: true, message: 'Ticket updated successfully', data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    await TicketManager.deleteTicket(req.params.id);

    return res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const ticketEvaluationHandler = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.ticketEvaluationHandler(
      req.params.id,
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
    const ticket = await TicketManager.ticketEvaluationAcceptHandler(req.params.id, req.body.evaluationId, req.user);

    return res.status(200).json({ success: true, message: 'Ticket evaluation accepted successfully', data: ticket });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const ticketEvaluationEdit = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketManager.ticketEvaluationEditHandler(
      req.params.id,
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
    const result = await PaymentManager.ticketPaymentHandler(req.user, req.params.id, amount, currency);

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
