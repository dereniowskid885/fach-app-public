import { EUserRole } from './enums';

export interface IResult {
  success: boolean;
  status?: number;
  error?: string;
}

export interface ITokenPayload {
  userId: string;
  role: EUserRole;
  email: string;
  name: string;
  surname: string;
  fullName: string;
  city: string;
  iat: number;
  exp: number;
}
