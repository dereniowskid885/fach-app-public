import User from '@models/User';
import { CategoryManager } from './categoryManager';
import { AppError } from '@shared/helpers/AppError';
import { UserManager } from './userManager';
import { EUserRole } from '@shared/constants/enums';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendMail } from '@utils/sendMail';
import { IAppError } from '@shared/constants/interfaces';
import { Request, Response } from 'express';
import { TokenManager } from './tokenManager';
import Logger from '@shared/helpers/Logger';

export const AuthManager = {
  handlePasswordReset: async (accessToken: string, newPassword: string) => {
    if (!accessToken || !newPassword) {
      throw new AppError('Access token or new password not provided', 400);
    }

    try {
      const payload = jwt.verify(accessToken, process.env.RESET_PASSWORD_TOKEN_SECRET ?? '') as JwtPayload;
      const user = await UserManager.getUserByEmail(payload.email);

      if (!user) {
        throw new AppError('User not found - invalid password reset link', 400);
      }

      user.password = newPassword;
      await user.save();
    } catch (err) {
      const error = err as IAppError;

      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Access token expired', 401);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid access token', 401);
      }

      throw new AppError(`Error occured on password reset: ${err}`, 500);
    }
  },
  handleUserVerification: async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      throw new AppError('Access token not provided', 404);
    }

    try {
      const payload = jwt.verify(token, process.env.VERIFY_EMAIL_TOKEN_SECRET ?? '') as JwtPayload;
      const user = await UserManager.getUserByEmail(payload.email);

      if (!user) {
        throw new AppError('User not found - invalid verification link', 400);
      }

      if (user.isVerified) {
        throw new AppError('User is already verified', 409);
      }

      await TokenManager.addTokenToDB(req, res, user);
      await UserManager.updateUserAsVerified(user.id);
    } catch (err) {
      const error = err as IAppError;

      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Access token expired', 401);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid access token', 401);
      }

      throw new AppError(`Error occured on user verification: ${err}`, 500);
    }
  },
  sendPasswordResetLink: async (email: string) => {
    if (!email) {
      throw new AppError('Email not provided', 400);
    }

    try {
      const user = await UserManager.getUserByEmail(email);

      if (!user) {
        throw new AppError('Account with the given email address does not exist', 404);
      }

      const resetToken = jwt.sign(
        {
          email: email,
        },
        process.env.RESET_PASSWORD_TOKEN_SECRET ?? '',
        { expiresIn: '30m' },
      );

      const appBaseUrl = process.env.FRONTEND_BASE_URL;
      const resetLink = `${appBaseUrl}/password-reset/${resetToken}`;

      await sendMail({
        email,
        subject: `${process.env.APP_NAME} - Password Reset`,
        html: `<div>Here is your password reset link: <a href="${resetLink}">CLICK</a></div>`,
      });
    } catch (err) {
      Logger.error('Error occured while sending password reset link: ' + err);

      throw new AppError(`Error occured while sending password reset link: ${err}`, 500);
    }
  },
  sendEmailVerificationLink: async (email: string) => {
    if (!email) {
      throw new AppError('Email not provided', 400);
    }

    try {
      const verificationToken = jwt.sign(
        {
          email,
        },
        process.env.VERIFY_EMAIL_TOKEN_SECRET ?? '',
        { expiresIn: '24h' },
      );

      const baseUrl = process.env.FRONTEND_BASE_URL;
      const verificationLink = `${baseUrl}/verify/${verificationToken}`;

      const result = await sendMail({
        email,
        subject: `${process.env.APP_NAME} - Email Verification`,
        html: `<div>Here is your verification link: <a href="${verificationLink}">CLICK</a></div>`,
      });

      return result;
    } catch (err) {
      Logger.error('Error occured while sending email verification link: ' + err);

      throw new AppError(`Error occured while sending email verification link: ${err}`, 500);
    }
  },
  register: async ({
    email,
    password,
    role,
    name,
    surname,
    city,
    categoryName,
  }: {
    email: string;
    password: string;
    role?: EUserRole;
    name: string;
    surname: string;
    city: string;
    categoryName?: string;
  }) => {
    if (!email || !password || !city || !name || !surname) {
      throw new AppError('Email, password, name, surname and city are required', 400);
    }

    const userExists = await UserManager.getUserByEmail(email);

    if (userExists) {
      throw new AppError('Email already registered', 400);
    }

    const isSpecialistCreation = role === EUserRole.SPECIALIST;

    if (isSpecialistCreation && !categoryName) {
      throw new AppError('categoryName must be provided while creating specialist', 400);
    }

    try {
      const user = new User({
        email,
        password,
        role,
        name,
        surname,
        city,
      });

      if (isSpecialistCreation && categoryName) {
        const category = await CategoryManager.getOrCreateNewCategory(categoryName);

        user.category = category.id;

        // assign new specialist to the category
        category.specialists.push(user.id);
        await category.save();
      }

      await user.save();
    } catch (err) {
      throw new AppError(`User registration failed: ${err}`, 500);
    }
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const user = await UserManager.getUserByEmail(email);

      if (!user) {
        throw new AppError('User with provided e-mail does not exist', 404);
      }

      if (!user.isVerified) {
        throw new AppError('Email not verified', 403);
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        throw new AppError('Invalid credentials', 400);
      }

      return user;
    } catch (err) {
      throw new AppError(`User login failed: ${err}`, 500);
    }
  },
  logout: async (refreshToken: string) => {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET ?? '') as JwtPayload;

      await UserManager.updateUserRefreshToken(payload.userId, refreshToken);
    } catch (err) {
      const error = err as IAppError;

      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Refresh token expired', 401);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid refresh token', 400);
      }

      throw new AppError('Error occured on logout', 500);
    }
  },
};
