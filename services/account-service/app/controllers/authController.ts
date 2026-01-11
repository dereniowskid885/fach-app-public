import { TokenManager } from '@managers/tokenManager';
import type { Request, Response } from 'express';
import { AuthManager } from '@managers/authManager';
import { EResponseStatus } from '@shared/constants/responseStatus';
import { IAppError } from '@shared/utils/AppError';
import { handleAppError } from '@shared/helpers/handleAppError';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthManager.register(req.body);
    await AuthManager.sendEmailVerificationLink(req.body.email);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: user,
    });
  } catch (err) {
    const error = err as IAppError;

    if (error.status === EResponseStatus.ERROR_EMAIL_SEND_FAILED) {
      return res.status(201).json({
        success: true,
        status: EResponseStatus.ERROR_EMAIL_SEND_FAILED,
        message: 'User registered successfully, error occured while sending verification link.',
      });
    }

    handleAppError(res, err as IAppError);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await AuthManager.login(req.body);

    const { accessToken, refreshToken } = await TokenManager.handleUserTokens(req, res, user);

    return res.status(200).json({
      success: true,
      message: 'User logged in succesfully.',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const accessToken = await TokenManager.handleTokenRefresh(req, res);

    return res
      .status(200)
      .json({ success: true, message: 'Access token refreshed succesfully.', data: { accessToken } });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await AuthManager.logout(req.cookies.refreshToken);

    TokenManager.clearAllTokens(res);

    return res.status(200).json({ success: true, message: 'User logged out succesfully.' });
  } catch (err) {
    TokenManager.clearAllTokens(res);

    handleAppError(res, err as IAppError);
  }
};

export const requestEmailVerificationLink = async (req: Request, res: Response) => {
  try {
    await AuthManager.sendEmailVerificationLink(req.body.email);

    return res.status(200).json({
      success: true,
      message: 'If this email is registered, a verification link has been sent.',
    });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const requestPasswordResetLink = async (req: Request, res: Response) => {
  try {
    await AuthManager.sendPasswordResetLink(req.body.email);

    return res.status(200).json({
      success: true,
      message: 'If this email is registered, a password reset link has been sent.',
    });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const data = await AuthManager.handleUserVerification(req.body.token);

    return res.status(200).json({ success: true, status: data?.status, message: data?.message });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const passwordReset = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    await AuthManager.handlePasswordReset(token, newPassword);

    return res.status(200).json({ success: true, message: 'Password reset successful.' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  requestPasswordResetLink,
  requestEmailVerificationLink,
  verifyEmail,
  passwordReset,
};
