import { EResponseStatus } from "../../shared-types/enums/responseStatus";
import { AppError } from "../utils/AppError";

export const handleJwtError = (errorTitle: string, errorMessage: string) => {
  throw new AppError(400, EResponseStatus.ERROR_INVALID_TOKEN, `${errorTitle}: ${errorMessage}`);
};

export const handleRefreshTokenError = (error: any) => {
  handleJwtError("Refresh token error", error.message);
};

export const handleAccessTokenError = (error: any) => {
  handleJwtError("Access token error", error.message);
};
