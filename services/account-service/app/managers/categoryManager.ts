import Category, { ICategoryModel } from '@models/Category';
import { AppError } from '@shared/utils/AppError';
import { UserManager } from './userManager';
import { EUserRole } from '@shared/constants/enums';
import { EResponseStatus } from '@shared/constants/responseStatus';
import { FilterQuery } from 'mongoose';

const USER_KEYS = ['email', 'role', 'name', 'surname', 'city', 'isVerified'];

export const CategoryManager = {
  createCategory: async (categoryName: string) => {
    let category = await Category.findOne({ name: categoryName });

    if (category) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_CATEGORY_ALREADY_EXISTS,
        'Category with provided name already exists',
      );
    }

    category = new Category({ name: categoryName });
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
  getOrCreateNewCategory: async (categoryName: string) => {
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      category = new Category({ name: categoryName });
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
  updateCategory: async (categoryId: string, newName: string) => {
    const category = await CategoryManager.getCategoryById(categoryId);

    category.name = newName;
    await category.save();

    return category;
  },
  assignSpecialistToCategory: async (categoryId: string, userId: string) => {
    const user = await UserManager.getUserById(userId);

    if (user.role !== EUserRole.SPECIALIST) {
      throw new AppError(400, EResponseStatus.ERROR_USER_INVALID_ROLE, 'User is not a specialist');
    }

    const category = await CategoryManager.getCategoryById(categoryId);

    if (user.category) {
      const userCategoryId = user.category.toString();
      const userCategory = await Category.findById(userCategoryId);

      if (!userCategory) {
        throw new AppError(500, EResponseStatus.ERROR_CATEGORY_NOT_FOUND, 'Specialist category not found');
      }

      if (userCategoryId === categoryId) {
        const updatedCategory = await Category.findByIdAndUpdate(
          { _id: categoryId },
          { $addToSet: { specialists: userId } },
        );

        return updatedCategory?.populate('specialists');
      }

      const indexToRemove = userCategory.specialists.findIndex((id) => id.equals(user._id));
      const userIdFound = indexToRemove !== -1;

      if (userIdFound) {
        userCategory.specialists.splice(indexToRemove, 1);

        await userCategory.save();
      }
    }

    user.category = category._id;
    await user.save();

    category.specialists.push(user.id);
    await category.save();

    return category.populate('specialists');
  },
  removeSpecialistFromCategory: async (categoryId: string, userId: string) => {
    const user = await UserManager.getUserById(userId);

    if (user.role !== EUserRole.SPECIALIST) {
      throw new AppError(400, EResponseStatus.ERROR_USER_INVALID_ROLE, 'User is not a specialist');
    }

    const category = await CategoryManager.getCategoryById(categoryId);
    const indexToRemove = category.specialists.findIndex((id) => id.equals(userId));
    const userIdNotFound = indexToRemove === -1;

    if (userIdNotFound) {
      throw new AppError(
        400,
        EResponseStatus.ERROR_USER_NOT_ASSIGNED_TO_CATEGORY,
        'Specialist is not assigned to provided category',
      );
    }

    category.specialists.splice(indexToRemove, 1);
    await category.save();

    return category;
  },
};
