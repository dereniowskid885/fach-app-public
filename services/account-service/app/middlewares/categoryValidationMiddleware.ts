import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { handleZodError } from '@shared/helpers/handleZodError';

const categorySchema = z
  .object({
    name: z.string().min(1).max(64),
  })
  .strict();

export const validateCategoryBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = categorySchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};
