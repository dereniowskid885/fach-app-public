import { IAppError } from "../constants/interfaces";
import type { Response } from "express";

export const handleAppError = (res: Response, error: IAppError) => {
  return res.status(error.code || 500).json({ message: error.message ?? "Server error" });
};
