import User, { IUserModel } from '@models/User';
import { EEnvironmentType } from '@shared/constants/enums';
import { Request, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import Logger from '@shared/utils/Logger';
import { AppError } from '@shared/utils/AppError';
import { Types } from 'mongoose';
import { UserManager } from './userManager';
import { EResponseStatus } from '@shared/constants/responseStatus';
import { handleRefreshTokenError } from '@shared/helpers/handleJwtError';

export const TokenManager = {
  handleTokenRefresh: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.headers['refresh-token'];

    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET ?? '') as JwtPayload;
      const user = await UserManager.getUserById(payload.userId, false);

      if (!user) {
        throw new AppError(404, EResponseStatus.ERROR_USER_NOT_FOUND, 'User not found');
      }

      if (!user.refreshTokens || user.refreshTokens.length === 0) {
        throw new AppError(401, EResponseStatus.ERROR_INVALID_TOKEN, 'No refresh tokens found for user');
      }

      // For Next.js purposes it checks for custom header first
      const deviceInfo = req.headers['customuaheader'] || req.headers['user-agent'];
      const tokenIndex = user.refreshTokens.findIndex((t) => t.token === refreshToken && t.deviceInfo === deviceInfo);

      if (tokenIndex === -1) {
        throw new AppError(401, EResponseStatus.ERROR_INVALID_TOKEN, 'Invalid refresh token');
      }

      const accessToken = TokenManager.generateAccessToken(req, res, user);

      await user.save();
      await TokenManager.removeExpiredTokens(user._id);

      return accessToken;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        handleRefreshTokenError(err);
      }

      throw err;
    }
  },
  generateRandomToken: () => {
    return crypto.randomBytes(32).toString('hex');
  },
  generateAccessToken: (req: Request, res: Response, user: IUserModel) => {
    const { _id, role, email, name, surname, city } = user;
    const fullName = `${name} ${surname}`;
    const accessToken = jwt.sign(
      { userId: _id, role, email, name, surname, fullName, city },
      process.env.ACCESS_TOKEN_SECRET ?? '',
      {
        expiresIn: '15m',
      },
    );

    const expirationTime = 900000; // 15 minutes - 15 * 60 * 1000

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === EEnvironmentType.PRODUCTION,
      sameSite: 'strict',
      maxAge: expirationTime,
      expires: new Date(Date.now() + expirationTime),
    });

    return accessToken;
  },
  generateRefreshToken: (req: Request, res: Response, user: IUserModel) => {
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET ?? '', { expiresIn: '7d' });
    const expirationTime = 604800000; // 7 days - 7 * 24 * 60 * 60 * 1000

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === EEnvironmentType.PRODUCTION,
      sameSite: 'strict',
      maxAge: expirationTime,
      expires: new Date(Date.now() + expirationTime),
    });

    const refreshTokenData = {
      token: refreshToken,
      deviceInfo: req.headers['user-agent'] ?? '',
      expiresAt: new Date(Date.now() + expirationTime),
      createdAt: new Date(),
    };

    return { refreshToken, refreshTokenData };
  },
  generateTokens: (req: Request, res: Response, user: IUserModel) => {
    const accessToken = TokenManager.generateAccessToken(req, res, user);
    const { refreshToken, refreshTokenData } = TokenManager.generateRefreshToken(req, res, user);

    return { accessToken, refreshToken, refreshTokenData };
  },
  handleUserTokens: async (req: Request, res: Response, user: IUserModel) => {
    try {
      const { refreshTokenData, accessToken, refreshToken } = TokenManager.generateTokens(req, res, user);

      user.refreshTokens = [refreshTokenData];

      await user.save();

      Logger.info('Refresh token successfully added');

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      Logger.warn('User not found or refresh token not added');

      throw err;
    }
  },
  clearAllTokens: (res: Response) => {
    res.clearCookie('accessToken', {
      httpOnly: false,
      secure: process.env.NODE_ENV === EEnvironmentType.PRODUCTION,
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === EEnvironmentType.PRODUCTION,
      sameSite: 'strict',
    });

    Logger.info('Access and refresh tokens removed from cookies');
  },
  removeExpiredTokens: async (userId: Types.ObjectId) => {
    await User.updateOne({ _id: userId }, { $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } } });

    Logger.info('Expired tokens deleted');
  },
};
