import { EUserRole } from '@shared/constants/enums';

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
