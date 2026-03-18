import User from '@models/User';
import { AppError } from '@shared/utils/AppError';
import { UserManager } from './userManager';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { sendMail } from '@helpers/sendMail';
import { EResponseStatus } from '@shared/enums/responseStatus';
import { printMongooseValidationErrors } from '@helpers/printMongooseValidationErrors';
import { Error as MongooseError } from 'mongoose';
import { handleAccessTokenError, handleRefreshTokenError } from '@shared/helpers/handleJwtError';
import { VERIFY_PATH, PASSWORD_RESET_PATH } from '@web/constants/routes';
import { ESupportedLanguages } from '@shared/enums/language';

export const AuthManager = {
  handlePasswordReset: async (accessToken: string, newPassword: string) => {
    try {
      const payload = jwt.verify(accessToken, process.env.RESET_PASSWORD_TOKEN_SECRET ?? '') as JwtPayload;
      const user = await UserManager.getUserByEmail(payload.email);

      if (!user) {
        throw new AppError(400, EResponseStatus.ERROR_INVALID_LINK, 'Invalid password reset link');
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
        throw new AppError(400, EResponseStatus.ERROR_INVALID_LINK, 'Invalid verification link');
      }

      if (!user.isVerified) {
        await User.findByIdAndUpdate(user._id, { isVerified: true });
      }

      return;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        handleAccessTokenError(err);
      }

      throw err;
    }
  },
  sendPasswordResetLink: async (email: string, lang: ESupportedLanguages) => {
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

    const passwordResetPath = `/${lang}${PASSWORD_RESET_PATH}`;
    const resetLink = `${process.env.FRONTEND_BASE_URL}${passwordResetPath}/${resetToken}`;

    await sendMail({
      email,
      subject: `${process.env.APP_NAME} - Password Reset`,
      html: `<div>Here is your password reset link: <a href="${resetLink}">CLICK</a></div>`,
    });
  },
  sendEmailVerificationLink: async (email: string, lang: ESupportedLanguages) => {
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

    const verifyPath = `/${lang}${VERIFY_PATH}`;
    const verificationLink = `${process.env.FRONTEND_BASE_URL}${verifyPath}/${verificationToken}`;

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
      throw new AppError(
        409,
        EResponseStatus.ERROR_INVALID_CREDENTIALS,
        'Unable to create account with provided credentials',
      );
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
      throw new AppError(401, EResponseStatus.ERROR_INVALID_CREDENTIALS, 'Invalid credentials or e-mail not verified');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new AppError(401, EResponseStatus.ERROR_INVALID_CREDENTIALS, 'Invalid credentials or e-mail not verified');
    }

    if (!user.isVerified) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_VERIFIED, 'Email address not verified');
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
