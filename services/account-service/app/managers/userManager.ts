import { safeUserProjection } from '@constants/projections';
import UserModel, { IUserModel } from '@models/User';
import { EResponseStatus } from '@shared/constants/responseStatus';
import { AppError } from '@shared/utils/AppError';
import { EUserRole } from '@shared/constants/enums';
import { CategoryManager } from './categoryManager';
import User from '@models/User';
import { printMongooseValidationErrors } from '@helpers/printMongooseValidationErrors';
import { FilterQuery, Error as MongooseError } from 'mongoose';
import { IUpdateUserData } from '@interfaces/user';
import { JwtPayload } from 'jsonwebtoken';

export const UserManager = {
  getUsers: async (filter: FilterQuery<IUserModel>) => {
    const users = await UserModel.find(filter, safeUserProjection);

    return users;
  },
  getUserById: async (userId: string, projection = true) => {
    try {
      const user = await UserModel.findById(userId, projection ? safeUserProjection : null);

      if (!user) {
        throw new AppError(404, EResponseStatus.ERROR_USER_NOT_FOUND, 'User with provided id not found');
      }

      return user;
    } catch {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'Invalid user id provided');
    }
  },
  getUserByEmail: async (email: string) => {
    if (!email) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'Email is not provided');
    }

    const user = await UserModel.findOne({ email });

    return user;
  },
  updateUser: async (requestUser: JwtPayload, userId: string, updateData: Partial<IUpdateUserData>) => {
    const updateDataKeys = Object.keys(updateData);

    if (!updateData || updateDataKeys.length === 0) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'No data provided for update');
    }

    const isAdmin = requestUser.role === EUserRole.ADMIN;

    if (!isAdmin) {
      const isUpdatingSelf = requestUser.userId === userId;

      if (!isUpdatingSelf) {
        throw new AppError(403, EResponseStatus.ERROR_USER_INVALID_ROLE, 'You can update only your own account');
      }

      const isUpdatingRestrictedField = updateDataKeys.includes('isVerified');

      if (isUpdatingRestrictedField) {
        throw new AppError(
          403,
          EResponseStatus.ERROR_USER_INVALID_ROLE,
          'You are not allowed to modify verification status',
        );
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true }).select(safeUserProjection);

    if (!updatedUser) {
      throw new AppError(404, EResponseStatus.ERROR_USER_NOT_FOUND, 'User with provided id not found');
    }

    await updatedUser.save();

    return updatedUser;
  },
  updateUserRole: async (userId: string, role: EUserRole) => {
    // TODO: to be changed in superadmin role addition ticket
    // https://github.com/dereniowskid885/fach-app/issues/7
    const user = await UserManager.getUserById(userId);

    if (user.role === role) {
      return user.toSafeObject();
    }

    user.role = role;
    await user.save();

    return user.toSafeObject();
  },
  updateUserRefreshToken: async (userId: string, refreshToken: string) => {
    // Find user and delete the specific existing refresh token
    await UserModel.findOneAndUpdate(
      {
        _id: userId,
        'refreshTokens.token': refreshToken,
      },
      {
        $pull: { refreshTokens: { token: refreshToken } },
      },
      { new: true },
    );
  },
  deleteUser: async (userId: string) => {
    const user = await UserManager.getUserById(userId);

    if (!user) {
      throw new AppError(404, EResponseStatus.ERROR_USER_NOT_FOUND, 'User with provided id not found');
    }

    await user.deleteOne();
  },
  createUser: async ({
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
    const userExists = await UserManager.getUserByEmail(email);

    if (userExists) {
      throw new AppError(409, EResponseStatus.ERROR_USER_ALREADY_EXIST, 'User with this email already exists');
    }

    // TODO: to be changed in superadmin role addition ticket
    // https://github.com/dereniowskid885/fach-app/issues/7
    if (role === EUserRole.ADMIN) {
      throw new AppError(403, EResponseStatus.ERROR_INVALID_DATA, 'Cannot register user with admin role');
    }

    const isSpecialistCreation = role === EUserRole.SPECIALIST;

    if (isSpecialistCreation && !categoryName) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_INVALID_DATA,
        'Field categoryName is required while creating specialist',
      );
    }

    try {
      const user = new User({
        email,
        password,
        role,
        name,
        surname,
        city,
        isVerified: true,
      });

      if (isSpecialistCreation && categoryName) {
        const category = await CategoryManager.getOrCreateNewCategory(categoryName);

        user.category = category.id;

        // assign new specialist to the category
        category.specialists.push(user.id);
        await category.save();
      }

      user.populate({ path: 'category', select: 'name' });
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
};
