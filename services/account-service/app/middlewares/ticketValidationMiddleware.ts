import { NextFunction, Request, Response } from 'express';
import { handleZodError } from 'shared-backend';
import { cities, ESupportedCurrency, ETicketStatus } from 'shared-types';
import { z } from 'zod';

const createTicketSchema = z
  .object({
    title: z.string().min(4).max(60),
    description: z.string().min(7).max(3000),
    categoryId: z.string().length(24),
    city: z.enum(cities),
  })
  .strict();

export const validateCreateTicketMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createTicketSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const createTicketCommentSchema = z
  .object({
    content: z.string().min(7).max(3000),
    attatchments: z.array(z.string()).optional(),
  })
  .strict();

export const validateCreateTicketCommentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createTicketCommentSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const ticketEvaluationSchema = z
  .object({
    price: z.object({
      amountInCents: z.number().min(0),
      currency: z.enum(ESupportedCurrency),
    }),
    minutes: z.number().int().positive(),
  })
  .strict();

export const validateTicketEvaluationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = ticketEvaluationSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const ticketEvaluationAcceptSchema = z
  .object({
    evaluationId: z.string().length(24),
  })
  .strict();

export const validateTicketEvaluationAcceptMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = ticketEvaluationAcceptSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

// TODO: remove cities mock when city API is ready
const updateTicketSchema = z
  .object({
    categoryId: z.string().length(24).optional(),
    city: z.enum(cities).optional(),
    status: z.enum(ETicketStatus).optional(),
    assigneeId: z.string().length(24).optional(),
    title: z.string().min(7).optional(),
    description: z.string().min(7).optional(),
  })
  .strict();

export const validateTicketUpdateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateTicketSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const ticketEvaluationEditSchema = z
  .object({
    evaluationId: z.string().length(24).optional(),
    price: z
      .object({
        amountInCents: z.number().min(0),
        currency: z.enum(ESupportedCurrency),
      })
      .optional(),
    minutes: z.number().int().positive().optional(),
  })
  .strict();

export const validateTicketEvaluationEditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = ticketEvaluationEditSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const ticketPaymentSchema = z
  .object({
    amount: z.number().min(0),
    currency: z.enum(ESupportedCurrency),
  })
  .strict();

export const validateTicketPaymentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = ticketPaymentSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};
