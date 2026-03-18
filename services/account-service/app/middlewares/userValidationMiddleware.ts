import { NextFunction } from 'express';
import { Response, Request } from 'express';
import { z } from 'zod';
import { handleZodError } from '@shared/helpers/handleZodError';
import { EUserRole } from '@shared/enums/role';
import { EThemeType } from '@shared/enums/theme';
import { cities } from '@shared/constants/mocks';

const createUserSchema = z
  .object({
    email: z.email().min(7).max(48),
    password: z.string().min(7).max(64),
    name: z.string().min(2).max(20),
    surname: z.string().min(3).max(25),
    city: z.enum(cities),
    role: z.enum(EUserRole),
    categoryName: z.string().min(1).optional(),
  })
  .strict();

export const validateCreateUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createUserSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const updateUserRoleSchema = z.object({
  role: z.enum(EUserRole),
});

export const validateUserRoleUpdateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateUserRoleSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};

const updateUserSchema = z
  .object({
    email: z.email().optional(),
    city: z.enum(cities).optional(),
    isVerified: z.boolean().optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    theme: z.enum(EThemeType).optional(),
  })
  .strict();

export const validateUserUpdateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateUserSchema.parse(req.body);

    next();
  } catch (err) {
    handleZodError(res, err);
  }
};
