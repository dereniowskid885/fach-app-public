'use client';

import { useGetAuthMeQuery } from '@/api/accountApi';
import { useAppDispatch } from '@/redux/hooks';
import { clearUserData, setUserData } from '@/redux/slices/UserDataSlice';
import { ReactNode, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface IAuthWrapper {
  children: ReactNode;
}

export default function AuthWrapper({ children }: IAuthWrapper) {
  const dispatch = useAppDispatch();

  const { data: userData, error } = useGetAuthMeQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  useErrorHandler(error);

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData.data));
    } else {
      dispatch(clearUserData());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return <>{children}</>;
}
