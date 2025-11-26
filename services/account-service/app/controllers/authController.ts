import { TokenManager } from '@managers/tokenManager';
import type { Request, Response } from 'express';
import { IAppError } from '@shared/constants/interfaces';
import { AuthManager } from '@managers/authManager';
import { handleAppError } from '@shared/helpers/handleAppError';

export const register = async (req: Request, res: Response) => {
  try {
    await AuthManager.register(req.body);
    await AuthManager.sendEmailVerificationLink(req.body.email);

    return res.status(201).json({ message: 'User registered in database' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await AuthManager.login(req.body);

    await TokenManager.addTokenToDB(req, res, user);

    return res.status(200).json({ message: 'User logged in succesfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const accessToken = await TokenManager.handleTokenRefresh(req, res);

    return res.status(200).json({ message: 'Access token refreshed', accessToken: accessToken });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await AuthManager.logout(req.cookies.refreshToken);

    TokenManager.clearAllTokens(res);

    return res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    TokenManager.clearAllTokens(res);

    handleAppError(res, err as IAppError);
  }
};

export const requestEmailVerificationLink = async (req: Request, res: Response) => {
  try {
    await AuthManager.sendEmailVerificationLink(req.body.email);

    return res.status(200).json({ message: 'Email verification link sent on provided email' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    await AuthManager.sendPasswordResetLink(req.body.email);

    return res.status(200).json({ message: 'Password reset link has been sent to your email' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    await AuthManager.handleUserVerification(req, res);

    return res.status(200).json({ message: 'User has been verified' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const passwordReset = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    await AuthManager.handlePasswordReset(token, newPassword);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  requestEmailVerificationLink,
  verifyEmail,
  passwordReset,
};
