import { safeUserProjection } from '@constants/projections';
import { CategoryManager } from './categoryManager';
import User, { IUserModel } from '@models/User';
import { printMongooseValidationErrors } from '@helpers/mongoose';
import mongoose, { FilterQuery, Error as MongooseError } from 'mongoose';
import { IUpdateUserData } from '@interfaces/user';
import { JwtPayload } from 'jsonwebtoken';
import Ticket from '@models/Ticket';
import Category from '@models/Category';
import { EResponseStatus, ETicketStatus, EUserRole, isAdmin } from 'shared-types';
import { AppError, handleTransactionError } from 'shared-backend';

export const UserManager = {
  getUsers: async (filter: FilterQuery<IUserModel>) => {
    const users = await User.find(filter, safeUserProjection).populate('category');

    return users;
  },
  getUserById: async (userId: string, projection = true) => {
    try {
      const user = await User.findById(userId, projection ? safeUserProjection : null).populate('category');

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

    const user = await User.findOne({ email });

    return user;
  },
  updateUser: async (currentUser: JwtPayload, userId: string, updateData: Partial<IUpdateUserData>) => {
    const updateDataKeys = Object.keys(updateData);

    if (!updateData || updateDataKeys.length === 0) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'No data provided for update');
    }

    if (!isAdmin(currentUser.role)) {
      const isUpdatingSelf = currentUser.userId === userId;

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

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select(safeUserProjection);

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
    await User.findOneAndUpdate(
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
  deleteUser: async (currentUserId: string, userId: string) => {
    if (currentUserId === userId) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'You cannot delete yourself');
    }

    const userToDelete = await UserManager.getUserById(userId);

    if (!userToDelete) {
      throw new AppError(404, EResponseStatus.ERROR_USER_NOT_FOUND, 'User with provided id not found');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      switch (userToDelete.role) {
        case EUserRole.USER:
          await Ticket.updateMany(
            { $or: [{ assignee: userToDelete._id }, { createdBy: userToDelete._id }] },
            [
              {
                $set: {
                  status: ETicketStatus.MODERATOR_INVESTIGATION,
                  assignee: null,
                },
              },
            ],
            { session },
          );
          break;

        case EUserRole.SPECIALIST:
          // remove deleted user (specialist) evaluations from tickets
          await Ticket.updateMany(
            { 'evaluations.user': userToDelete._id },
            {
              $pull: { evaluations: { user: userToDelete._id } },
              $set: {
                updatedAt: new Date(),
                updatedBy: currentUserId,
              },
            },
            { session },
          );

          // change ticket status and assignee, where deleted specialist is assigned or has his evaluation accepted
          await Ticket.updateMany(
            { $or: [{ assignee: userToDelete._id }, { 'acceptedEvaluation.user': userToDelete._id }] },
            [
              {
                $set: {
                  status: ETicketStatus.MODERATOR_INVESTIGATION,
                  assignee: null,
                  updatedBy: currentUserId,
                  updatedAt: new Date(),
                },
              },
            ],
            { session },
          );

          // remove deleted user (specialist) from category
          if (userToDelete.category) {
            await Category.updateOne(
              { _id: userToDelete.category._id, specialists: userToDelete._id },
              {
                $pull: { specialists: userToDelete._id },
                $set: {
                  updatedAt: new Date(),
                  updatedBy: currentUserId,
                },
              },
              { session },
            );
          }
          break;

        case EUserRole.ADMIN:
          await Ticket.updateMany(
            { assignee: userToDelete._id },
            [
              {
                $set: {
                  status: ETicketStatus.MODERATOR_INVESTIGATION,
                  assignee: null,
                  updatedBy: currentUserId,
                  updatedAt: new Date(),
                },
              },
            ],
            { session },
          );
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      handleTransactionError(err, session, 'Failed to delete user');
    }

    await userToDelete.deleteOne();
  },
  createUser: async (
    currentUserId: string,
    {
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
    },
  ) => {
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
        const category = await CategoryManager.getOrCreateNewCategory(currentUserId, categoryName);

        user.category = category.id;

        // assign new specialist to the category
        category.specialists.push(user.id);
        await category.save();
      }

      user.populate('category');
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
  handlePasswordChange: async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await UserManager.getUserById(userId, false);

    if (!user) {
      throw new AppError(404, EResponseStatus.ERROR_USER_NOT_FOUND, 'User with provided id not found');
    }

    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      throw new AppError(400, EResponseStatus.ERROR_INVALID_DATA, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
  },
};
