import { ZodError } from "zod";
import { Response } from "express";
import { handleAppError } from "./handleAppError";
import { EResponseStatus } from "../constants/responseStatus";

export const handleZodError = (res: Response, error: any) => {
  let message = "Invalid data provided.";

  if (error instanceof ZodError) {
    const zodErrorMessage = error.issues
      .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
      .join("; ");

    message = zodErrorMessage;
  }

  handleAppError(res, {
    code: 400,
    status: EResponseStatus.ERROR_INVALID_DATA,
    message: message,
  });
};
