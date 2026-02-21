import { UserManager } from '@managers/userManager';
import { IAppError } from '@shared/utils/AppError';
import { handleAppError } from '@shared/helpers/handleAppError';
import type { Request, Response } from 'express';
import { FilterBuilder } from '@utils/filterBuilder';

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
    const user = await UserManager.getUserById(req.params.id);

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserManager.updateUser(req.user, req.params.id, req.body);

    return res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await UserManager.updateUserRole(req.params.id, req.body.role);

    return res.status(200).json({ success: true, message: 'User role updated successfully', data: user });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserManager.deleteUser(req.params.id);

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserManager.createUser(req.body);

    return res.status(200).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
