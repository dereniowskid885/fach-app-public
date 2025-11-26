import type { NextFunction, Request, Response } from "express";
import { IAppError } from "../constants/interfaces";
import { handleAppError } from "./handleAppError";

// method for using common middleware functions across services
export const createMiddleware = (
  handlerFunction: (req: Request, ...params: any[]) => Promise<void>,
  ...params: any[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerFunction(req, ...params);

      next();
    } catch (err) {
      handleAppError(res, err as IAppError);
    }
  };
};
