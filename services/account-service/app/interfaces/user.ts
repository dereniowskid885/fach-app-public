import { EThemeType, EUserRole } from '@shared/constants/enums';

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
