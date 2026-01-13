import User from '@models/User';
import { AppError } from '@shared/utils/AppError';
import { UserManager } from './userManager';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { sendMail } from '@helpers/sendMail';
import { EResponseStatus } from '@shared/constants/responseStatus';
import { printMongooseValidationErrors } from '@helpers/printMongooseValidationErrors';
import { Error as MongooseError } from 'mongoose';
import { handleAccessTokenError, handleRefreshTokenError } from '@shared/helpers/handleJwtError';

export const AuthManager = {
  handlePasswordReset: async (accessToken: string, newPassword: string) => {
    try {
      const payload = jwt.verify(accessToken, process.env.RESET_PASSWORD_TOKEN_SECRET ?? '') as JwtPayload;
      const user = await UserManager.getUserByEmail(payload.email);

      if (!user) {
        throw new AppError(400, EResponseStatus.ERROR_INVALID_LINK, 'User not found - invalid password reset link');
      }

      user.password = newPassword;
      await user.save();
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        handleAccessTokenError(err);
      }

      throw err;
    }
  },
  handleUserVerification: async (accessToken: string) => {
    try {
      const payload = jwt.verify(accessToken, process.env.VERIFY_EMAIL_TOKEN_SECRET ?? '') as JwtPayload;
      const user = await UserManager.getUserByEmail(payload.email);

      if (!user) {
        throw new AppError(400, EResponseStatus.ERROR_INVALID_LINK, 'User not found - invalid verification link');
      }

      if (!user.isVerified) {
        await UserManager.updateUser(user.id, { isVerified: true });

        return {
          message: 'User verified successfully.',
        };
      }

      return {
        status: EResponseStatus.USER_ALREADY_VERIFIED,
        message: 'User is already verified',
      };
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        handleAccessTokenError(err);
      }

      throw err;
    }
  },
  sendPasswordResetLink: async (email: string) => {
    const user = await UserManager.getUserByEmail(email);

    if (!user) {
      return;
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
  },
  sendEmailVerificationLink: async (email: string) => {
    const user = await UserManager.getUserByEmail(email);

    if (!user || user.isVerified) {
      return;
    }

    const verificationToken = jwt.sign(
      {
        email,
      },
      process.env.VERIFY_EMAIL_TOKEN_SECRET ?? '',
      { expiresIn: '24h' },
    );

    const baseUrl = process.env.FRONTEND_BASE_URL;
    const verificationLink = `${baseUrl}/verify/${verificationToken}`;

    await sendMail({
      email,
      subject: `${process.env.APP_NAME} - Email Verification`,
      html: `<div>Here is your verification link: <a href="${verificationLink}">CLICK</a></div>`,
    });
  },
  register: async ({
    email,
    password,
    name,
    surname,
    city,
  }: {
    email: string;
    password: string;
    name: string;
    surname: string;
    city: string;
  }) => {
    const userExists = await UserManager.getUserByEmail(email);

    if (userExists) {
      throw new AppError(409, EResponseStatus.ERROR_USER_ALREADY_EXIST, 'User with this email already exists');
    }

    try {
      const user = new User({
        email,
        password,
        name,
        surname,
        city,
      });

      await user.save();

      return user.toSafeObject();
    } catch (err) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_INVALID_DATA,
        printMongooseValidationErrors(err as MongooseError.ValidationError),
      );
    }
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await UserManager.getUserByEmail(email);

    if (!user) {
      throw new AppError(404, EResponseStatus.ERROR_USER_NOT_FOUND, 'User with provided e-mail does not exist');
    }

    if (!user.isVerified) {
      throw new AppError(403, EResponseStatus.ERROR_USER_NOT_VERIFIED, 'Email is not verified');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_CREDENTIALS, 'Invalid credentials');
    }

    return user;
  },
  logout: async (refreshToken: string) => {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET ?? '') as JwtPayload;

      await UserManager.updateUserRefreshToken(payload.userId, refreshToken);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        handleRefreshTokenError(err);
      }

      throw err;
    }
  },
};
