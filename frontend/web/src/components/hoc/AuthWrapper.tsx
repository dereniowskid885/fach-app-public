'use client';

import { useGetAuthMeQuery } from '@/api/accountApi';
import { toast } from 'sonner';
import { parseQueryError } from '@/lib/utils';
import { useAppDispatch } from '@/redux/hooks';
import { clearUserData, setUserData } from '@/redux/slices/UserDataSlice';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { LOGIN_PATH } from '@/constants/routes';

export interface IAuthWrapper {
  children: ReactNode;
}

export default function AuthWrapper({ children }: IAuthWrapper) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: userData, error } = useGetAuthMeQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData.data));
    } else {
      dispatch(clearUserData());
    }

    if (!error) return;

    const { message } = parseQueryError(error);

    toast.error(message);

    router.push(LOGIN_PATH);
  }, [dispatch, userData, error, router]);

  return <>{children}</>;
}
