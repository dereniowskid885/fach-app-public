import UserModel from '@models/User';
import { EUserRole } from '@shared/constants/enums';
import { IAppError } from '@shared/constants/interfaces';
import { AppError } from '@shared/helpers/AppError';

export const UserManager = {
  getAllUsers: async () => {
    const users = await UserModel.find({});

    return users;
  },
  getUserById: async (userId: string) => {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('User with provided id not found', 404);
    }

    return user;
  },
  getUserByEmail: async (email: string) => {
    const user = await UserModel.findOne({ email });

    return user;
  },
  updateUserAsVerified: async (userId: string) => {
    const user = await UserModel.findByIdAndUpdate(userId, { isVerified: true });

    if (!user) {
      throw new AppError('User with provided id not found', 404);
    }

    try {
      user.isVerified = true;
      await user.save();
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error occured on user verification: ${error}`, 500);
    }
  },
  updateUserRole: async (userId: string, newRole: EUserRole) => {
    if (!Object.values(EUserRole).includes(newRole)) {
      throw new AppError('Invalid role provided', 400);
    }

    try {
      const user = await UserManager.getUserById(userId);
      user.role = newRole;
      await user.save();
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error occured on user role update: ${error}`, 500);
    }
  },
  updateUserRefreshToken: async (userId: string, refreshToken: string) => {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $pull: { refreshTokens: { token: refreshToken } } },
        { new: true },
      );

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await user.save();
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error occured on user refresh token update: ${error}`, 500);
    }
  },
  deleteUser: async (userId: string) => {
    const user = await UserManager.getUserById(userId);

    try {
      await user.deleteOne();
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error occured on user delete: ${error}`, 500);
    }
  },
};
