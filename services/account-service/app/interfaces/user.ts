import { EUserRole } from '@shared/enums/role';
import { EThemeType } from '@shared/enums/theme';

export interface ISafeUserObject {
  _id: string;
  email: string;
  role: EUserRole;
  category?: string;
  name: string;
  surname: string;
  city?: string;
  isVerified: boolean;
  theme: EThemeType;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUserData {
  email: string;
  name: string;
  surname: string;
  city: string;
  isVerified: boolean;
  theme: EThemeType;
}
