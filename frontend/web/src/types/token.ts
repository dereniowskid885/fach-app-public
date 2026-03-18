import { EUserRole } from '@shared/enums/role';

export interface ITokenPayload {
  userId: string;
  email: string;
  role: EUserRole;
  iat: number;
  exp: number;
}
