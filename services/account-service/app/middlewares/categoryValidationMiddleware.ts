import { NextFunction, Request, Response } from 'express';
import { handleZodError } from 'shared-backend';
import { z } from 'zod';

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
