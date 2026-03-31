import { EUserRole } from 'shared-types';

export interface ITokenPayload {
  userId: string;
  email: string;
  role: EUserRole;
  iat: number;
  exp: number;
}
