import { UserRole } from '@/api/accountApi';

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
