import { UserManager } from '@managers/userManager';
import { IAppError } from '@shared/constants/interfaces';
import { handleAppError } from '@shared/helpers/handleAppError';
import type { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserManager.getAllUsers();

    res.status(200).json(users);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserManager.getUserById(req.params.userId);

    return res.status(200).json(user);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { userId, newRole } = req.body;

  try {
    await UserManager.updateUserRole(userId, newRole);

    return res.status(200).json({ message: `User role updated to ${newRole}.` });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserManager.deleteUser(req.params.userId);

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
