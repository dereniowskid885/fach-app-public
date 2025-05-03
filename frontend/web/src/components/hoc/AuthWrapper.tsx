'use client';

import { ITokenPayload } from '@/constants/interfaces';
import { useAppDispatch } from '@/redux/hooks';
import { setUserData } from '@/redux/slices/UserDataSlice';
import { ReactNode } from 'react';

export interface IAuthWrapper {
  children: ReactNode;
  userData: ITokenPayload | null;
}

export default function AuthWrapper({ children, userData }: IAuthWrapper) {
  if (!userData) {
    return;
  }

  const dispatch = useAppDispatch();
  dispatch(setUserData(userData));

  return <>{children}</>;
}
