import { NextFunction } from 'express';
import { Response, Request } from 'express';
import { z } from 'zod';
import { handleZodError } from '@shared/helpers/handleZodError';
import { cities } from '@shared/constants/mocks';
import { ESupportedLanguages } from '@shared/enums/language';

const registerUserSchema = z
  .object({
    email: z.email().min(7).max(48),
    password: z.string().min(7).max(64),
    name: z.string().min(2).max(20),
    surname: z.string().min(3).max(25),
    city: z.enum(cities),
    lang: z.enum(ESupportedLanguages).optional().default(ESupportedLanguages.PL),
  })
  .strict();

export const validateUserRegisterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = registerUserSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const loginUserSchema = z
  .object({
    email: z.string().min(7).max(48),
    password: z.string().min(7).max(64),
  })
  .strict();

export const validateUserLoginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = loginUserSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const emailVerificationSchema = z
  .object({
    token: z.string().min(1, 'Verification token is required'),
  })
  .strict();

export const validateEmailVerificationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = emailVerificationSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const passwordResetSchema = z
  .object({
    token: z.string().min(1, 'Password reset token is required'),
    newPassword: z.string().min(7).max(64),
  })
  .strict();

export const validatePasswordResetMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = passwordResetSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};
