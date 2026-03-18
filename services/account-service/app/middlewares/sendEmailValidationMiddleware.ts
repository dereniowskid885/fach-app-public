import { handleZodError } from '@shared/helpers/handleZodError';
import z from 'zod';
import { NextFunction, Request, Response } from 'express';
import { ESupportedLanguages } from '@shared/enums/language';

const sendEmailSchema = z
  .object({
    email: z.email().min(7).max(48),
    lang: z.enum(ESupportedLanguages).optional().default(ESupportedLanguages.PL),
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
