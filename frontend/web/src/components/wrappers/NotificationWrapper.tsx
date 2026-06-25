'use client';

import { useGetNotificationsQuery } from '@/services/api/generated/accountApi';
import { useAppDispatch } from '@/redux/hooks';
import { ReactNode, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { setNotifications } from '@/redux/slices/notificationSlice';
import { useNotificationStream } from '@/hooks/useNotificationStream';

export interface INotificationWrapper {
  children: ReactNode;
}

export default function NotificationWrapper({ children }: INotificationWrapper) {
  const dispatch = useAppDispatch();

  const { data: notificationData, error } = useGetNotificationsQuery();

  useErrorHandler(error);

  useNotificationStream();

  useEffect(() => {
    if (!notificationData) return;

    dispatch(setNotifications(notificationData));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationData]);

  return <>{children}</>;
}
