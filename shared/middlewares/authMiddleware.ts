import { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { AppError } from "../helpers/AppError";

// checks if request has valid cookie with access token and saves it on req.user for further use in endpoints
export const checkAndParseAccessToken = async (req: Request, ACCESS_TOKEN_SECRET: string) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new AppError("Unauthorized: No access token provided", 401);
  }

  try {
    const payload = verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = payload as JwtPayload;
  } catch (err) {
    throw new AppError("Forbidden: Invalid access token", 403);
  }
};

export const checkRefreshToken = async (req: Request, REFRESH_TOKEN_SECRET: string) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Unauthorized: No refresh token provided", 401);
  }

  try {
    verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new AppError("Forbidden: Invalid refresh token", 403);
  }
};

export const checkUserRole = async (req: Request, roles: string[]) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError("Forbidden: Required role is missing", 403);
  }
};
