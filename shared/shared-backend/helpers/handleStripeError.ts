import { EResponseStatus } from "../../shared-types/enums/responseStatus";
import { AppError } from "../utils/AppError";

export const handleStripeError = (error: any) => {
  let errorCode = 400;
  let errorStatus = EResponseStatus.ERROR_INVALID_DATA;
  let errorMessage = "Error occured on ticket payment";

  if ("statusCode" in error) errorCode = error.statusCode as number;
  if ("rawType" in error) errorStatus = error.rawType as EResponseStatus;
  if ("message" in error) errorMessage = error.message as string;

  throw new AppError(errorCode, errorStatus, errorMessage);
};
