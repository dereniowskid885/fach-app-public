import { UserManager } from '@managers/userManager';
import { IAppError, handleAppError } from 'shared-backend';
import type { Request, Response } from 'express';
import { FilterBuilder } from '@utils/filterBuilder';
import { TokenManager } from '@managers/tokenManager';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const filter = FilterBuilder.getUsers(req);
    const users = await UserManager.getUsers(filter);

    res.status(200).json({ success: true, dataLength: users.length, data: users });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserManager.getUserById(req.params.id as string);

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserManager.updateUser(req.user, req.params.id as string, req.body);

    return res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await UserManager.updateUserRole(req.params.id as string, req.body.role);

    return res.status(200).json({ success: true, message: 'User role updated successfully', data: user });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserManager.deleteUser(req.user.userId, req.params.id as string);

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserManager.createUser(req.user.userId, req.body);

    return res.status(200).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    await UserManager.handlePasswordChange(req.user.userId, req.body.currentPassword, req.body.newPassword);
    await TokenManager.removeAllTokensForUser(req.user.userId);
    TokenManager.clearAllTokens(res);

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
