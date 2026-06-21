import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/slices/notificationSlice';
import { API } from '@/constants/api';

export const useNotificationStream = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const source = new EventSource(API.NOTIFICATION_STREAM, {
      withCredentials: true
    });

    source.onmessage = event => {
      const notification = JSON.parse(event.data);
      dispatch(addNotification(notification));
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
