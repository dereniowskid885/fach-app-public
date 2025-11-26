import Category from '@models/Category';
import { AppError } from '@shared/helpers/AppError';
import { UserManager } from './userManager';
import { IAppError } from '@shared/constants/interfaces';
import { EUserRole } from '@shared/constants/enums';

export const CategoryManager = {
  getAllCategories: async () => {
    const categories = await Category.find().populate('specialists', 'email');

    return categories;
  },
  getCategoryById: async (categoryId: string) => {
    const category = await Category.findOne({ _id: categoryId }).populate('specialists', 'email');

    if (!category) {
      throw new AppError('Category with provided id does not exist', 404);
    }

    return category;
  },
  getCategoryByName: async (categoryName: string) => {
    const category = await Category.findOne({ name: categoryName }).populate('specialists', 'email');

    return category;
  },
  getOrCreateNewCategory: async (categoryName: string) => {
    let category = await CategoryManager.getCategoryByName(categoryName);

    if (!category) {
      category = new Category({ name: categoryName });
    }

    category.populate('specialists', 'email');
    await category.save();

    return category;
  },
  assignSpecialistToCategory: async (categoryId: string, userId: string) => {
    const category = await CategoryManager.getCategoryById(categoryId);
    const user = await UserManager.getUserById(userId);

    if (user.role !== EUserRole.SPECIALIST) {
      throw new AppError('User is not a specialist', 400);
    }

    if (user.category) {
      throw new AppError('User has category assigned', 400);
    }

    try {
      category.specialists.push(user.id);
      await category.save();
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error occurred while assigning the specialist to a category: ${error}`, 500);
    }
  },
  removeSpecialistFromCategory: async (categoryId: string, userId: string) => {
    const category = await CategoryManager.getCategoryById(categoryId);
    const indexToRemove = category.specialists.findIndex((id) => id.equals(userId));
    const userIdNotFound = indexToRemove === -1;

    if (userIdNotFound) {
      throw new AppError('Specialist is not assigned to provided category', 400);
    }

    try {
      // delete category if provided specialist was only one assigned
      if (category.specialists.length === 1) {
        await category.deleteOne();

        return `Category ${category.name} was removed because of lack of specialists`;
      }

      category.specialists.splice(indexToRemove, 1);
      await category.save();

      return 'Specialist succesfully removed from category';
    } catch (err) {
      const error = err as IAppError;

      throw new AppError(`Error occurred while removing specialist from category: ${error}`, 500);
    }
  },
};
