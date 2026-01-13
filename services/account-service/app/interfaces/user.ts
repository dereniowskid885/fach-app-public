import { EUserRole } from '@shared/constants/enums';

export interface IGetUsersFilter {
  email?: string;
  role?: string;
  category?: string;
  city?: string;
  isVerified?: boolean;
}

export interface ISafeUserObject {
  _id: string;
  email: string;
  role: EUserRole;
  category?: string;
  name: string;
  surname: string;
  city?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
