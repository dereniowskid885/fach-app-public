import type { Request, Response } from 'express';
import { IAppError } from '@shared/utils/AppError';
import { handleAppError } from '@shared/helpers/handleAppError';
import { CategoryManager } from '@managers/categoryManager';
import { FilterBuilder } from '@utils/filterBuilder';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryManager.createCategory(req.body.name);

    return res.status(201).json({ success: true, message: 'Category created successfully.', data: category });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const filter = FilterBuilder.getCategories(req);
    const categories = await CategoryManager.getCategories(filter);

    return res.status(200).json({ success: true, dataLength: categories.length, data: categories });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await CategoryManager.getCategoryById(req.params.id);

    return res.status(200).json({ success: true, data: category });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await CategoryManager.deleteCategory(req.params.id);

    return res.status(200).json({ success: true, message: 'Category successfully removed.' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryManager.updateCategory(req.params.id, req.body.name);

    return res.status(200).json({ success: true, message: 'Category updated successfully.', data: category });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const assignSpecialistToCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryManager.assignSpecialistToCategory(req.params.id, req.body.userId);

    return res
      .status(200)
      .json({ success: true, message: 'Specialist successfully assigned to a category.', data: category });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const removeSpecialistFromCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryManager.removeSpecialistFromCategory(req.params.id, req.body.userId);

    return res
      .status(200)
      .json({ success: true, message: 'Specialist succesfully removed from category', data: category });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
