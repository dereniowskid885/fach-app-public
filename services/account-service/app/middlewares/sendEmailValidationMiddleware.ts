import { handleZodError } from '@shared/helpers/handleZodError';
import z from 'zod';
import { NextFunction, Request, Response } from 'express';

const sendEmailSchema = z
  .object({
    email: z.email().min(7).max(48),
  })
  .strict();

export const validateSendEmailMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = sendEmailSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};
