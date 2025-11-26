import type { Request, Response } from 'express';
import { IAppError } from '@shared/constants/interfaces';
import { handleAppError } from '@shared/helpers/handleAppError';
import { CategoryManager } from '@managers/categoryManager';

export const getCategoryByName = async (req: Request, res: Response) => {
  try {
    const category = await CategoryManager.getOrCreateNewCategory(req.params.name.trim());

    return res.status(200).json(category);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await CategoryManager.getCategoryById(req.params.id);

    return res.status(200).json(category);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryManager.getAllCategories();

    return res.status(200).json(categories);
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const assignSpecialistToCategory = async (req: Request, res: Response) => {
  try {
    await CategoryManager.assignSpecialistToCategory(req.params.id, req.body.userId);

    return res.status(200).json({ message: 'Specialist successfully assigned to a category' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const removeSpecialistFromCategory = async (req: Request, res: Response) => {
  try {
    const resultMessage = await CategoryManager.removeSpecialistFromCategory(req.params.id, req.body.userId);

    return res.status(200).json({ message: resultMessage });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
