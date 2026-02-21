import { UserRole } from '@/api/accountApi';

export interface IResult {
  success: boolean;
  status?: number;
  error?: string;
}

export interface IErrorData {
  message: string;
  status: string;
  success: boolean;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
