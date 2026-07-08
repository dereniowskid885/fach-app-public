import { EResponseStatus } from "../../shared-types/enums/responseStatus";
import type { Response } from "express";
import { IAppError } from "../utils/AppError";

export const handleAppError = (res: Response, error: IAppError) => {
  return res.status(error.code || 500).json({
    success: false,
    status: error.status ?? EResponseStatus.SERVER_ERROR,
    message: error.message ?? "Server error",
  });
};
