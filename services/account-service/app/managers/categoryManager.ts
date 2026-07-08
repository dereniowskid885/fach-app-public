import Category, { ICategoryModel } from '@models/Category';
import { UserManager } from './userManager';
import mongoose, { FilterQuery, Types } from 'mongoose';
import { EResponseStatus, EUserRole } from 'shared-types';
import { AppError, handleTransactionError } from 'shared-backend';

const USER_KEYS = ['email', 'role', 'name', 'surname', 'city', 'isVerified'];

export const CategoryManager = {
  createCategory: async (currentUserId: string, categoryName: string) => {
    let category = await Category.findOne({ name: categoryName });

    if (category) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_CATEGORY_ALREADY_EXISTS,
        'Category with provided name already exists',
      );
    }

    category = new Category({ name: categoryName, updatedBy: currentUserId });
    await category.save();

    return category;
  },
  getCategories: async (filter: FilterQuery<ICategoryModel>) => {
    const categories = await Category.find(filter).populate('specialists', USER_KEYS);

    return categories;
  },
  getCategoryById: async (categoryId: string) => {
    const category = await Category.findOne({ _id: categoryId }).populate('specialists', USER_KEYS);

    if (!category) {
      throw new AppError(404, EResponseStatus.ERROR_CATEGORY_NOT_FOUND, 'Category with provided id does not exist');
    }

    return category;
  },
  getOrCreateNewCategory: async (currentUserId: string, categoryName: string) => {
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      category = new Category({ name: categoryName, updatedBy: currentUserId });
    }

    category.populate('specialists', 'email');
    await category.save();

    return category;
  },
  deleteCategory: async (categoryId: string) => {
    const category = await CategoryManager.getCategoryById(categoryId);

    if (category.specialists.length > 0) {
      throw new AppError(
        409,
        EResponseStatus.ERROR_CATEGORY_HAS_ASSIGNED_SPECIALISTS,
        'Cannot remove category with assigned specialists',
      );
    }

    await category.deleteOne();
  },
  updateCategory: async (currentUserId: string, categoryId: string, newName: string) => {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        name: newName,
        updatedAt: new Date(),
        updatedBy: currentUserId,
      },
      { new: true },
    );

    return updatedCategory;
  },
  assignSpecialistToCategory: async (currentUserId: string, categoryId: string, userId: string) => {
    const user = await UserManager.getUserById(userId);

    if (user.role !== EUserRole.SPECIALIST) {
      throw new AppError(400, EResponseStatus.ERROR_USER_INVALID_ROLE, 'User is not a specialist');
    }

    if (user.category?._id.toString() === categoryId) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_USER_ALREADY_ASSIGNED_TO_CATEGORY,
        'User is already assigned to this category',
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (user.category) {
        await Category.updateOne(
          { _id: user.category },
          {
            $pull: {
              specialists: user._id,
            },
            $set: {
              updatedAt: new Date(),
              updatedBy: currentUserId,
            },
          },
          { session },
        );
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
          $addToSet: { specialists: user._id },
          $set: {
            updatedAt: new Date(),
            updatedBy: currentUserId,
          },
        },
        { new: true, session },
      );

      if (!updatedCategory) {
        throw new AppError(404, EResponseStatus.ERROR_CATEGORY_NOT_FOUND, 'Category with provided id does not exist');
      }

      user.category = new Types.ObjectId(categoryId);
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return updatedCategory;
    } catch (err) {
      handleTransactionError(err, session, 'Failed to assign specialist to a category');
    }
  },
  removeSpecialistFromCategory: async (currentUserId: string, categoryId: string, userId: string) => {
    const user = await UserManager.getUserById(userId);

    if (user.role !== EUserRole.SPECIALIST) {
      throw new AppError(400, EResponseStatus.ERROR_USER_INVALID_ROLE, 'User is not a specialist');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
          $pull: { specialists: user._id },
          $set: {
            updatedAt: new Date(),
            updatedBy: currentUserId,
          },
        },
        { new: true, session },
      );

      if (!updatedCategory) {
        throw new AppError(404, EResponseStatus.ERROR_CATEGORY_NOT_FOUND, 'Category with provided id does not exist');
      }

      if (user.category?._id.toString() === categoryId) {
        user.category = undefined;
        await user.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return updatedCategory;
    } catch (err) {
      handleTransactionError(err, session, 'Failed to remove specialist from category');
    }
  },
};
