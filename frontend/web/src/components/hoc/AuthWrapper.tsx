'use client';

import { ITokenPayload } from '@/constants/interfaces';
import { useAppDispatch } from '@/redux/hooks';
import { clearUserData, setUserData } from '@/redux/slices/UserDataSlice';
import { ReactNode, useEffect } from 'react';

export interface IAuthWrapper {
  children: ReactNode;
  userData: ITokenPayload | null;
}

export default function AuthWrapper({ children, userData }: IAuthWrapper) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData));
    } else {
      dispatch(clearUserData());
    }
  }, [dispatch, userData]);

  return <>{children}</>;
}
