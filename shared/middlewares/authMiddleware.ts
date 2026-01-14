import { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { EResponseStatus } from "../constants/responseStatus";

// checks if request has valid cookie with access token and saves it on req.user for further use in endpoints
export const checkAndParseAccessToken = async (req: Request, ACCESS_TOKEN_SECRET: string) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new AppError(401, EResponseStatus.ERROR_TOKEN_NOT_FOUND, "No access token provided");
  }

  try {
    const payload = verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = payload as JwtPayload;
  } catch (err) {
    throw new AppError(403, EResponseStatus.ERROR_INVALID_TOKEN, "Invalid access token");
  }
};

export const checkRefreshToken = async (req: Request, REFRESH_TOKEN_SECRET: string) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(401, EResponseStatus.ERROR_TOKEN_NOT_FOUND, "No refresh token provided");
  }

  try {
    verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new AppError(403, EResponseStatus.ERROR_INVALID_TOKEN, "Invalid refresh token");
  }
};

export const checkUserRole = async (req: Request, roles: string[]) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError(
      403,
      EResponseStatus.ERROR_USER_INVALID_ROLE,
      "Required role that allows this action is missing"
    );
  }
};
