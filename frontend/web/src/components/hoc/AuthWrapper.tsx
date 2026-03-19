'use client';

import { useGetAuthMeQuery } from '@/api/accountApi';
import { useAppDispatch } from '@/redux/hooks';
import { clearUserData, setUserData, setUserLoading } from '@/redux/slices/UserDataSlice';
import { ReactNode, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface IAuthWrapper {
  children: ReactNode;
}

export default function AuthWrapper({ children }: IAuthWrapper) {
  const dispatch = useAppDispatch();

  const {
    data: userData,
    isLoading,
    error
  } = useGetAuthMeQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  useErrorHandler(error);

  useEffect(() => {
    dispatch(setUserLoading(isLoading));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData.data));
    } else if (!isLoading) {
      dispatch(clearUserData());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return <>{children}</>;
}
