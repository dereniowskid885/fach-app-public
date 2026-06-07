'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData, setUserTheme } from '@/redux/slices/UserDataSlice';
import {
  PatchUsersByIdApiArg,
  ThemeType,
  usePatchUsersByIdMutation
} from '@/services/api/generated/accountApi';
import { useErrorHandler } from './useErrorHandler';

export const useThemeHandler = () => {
  const dispatch = useDispatch();
  const { userId, theme: userTheme } = useSelector(selectUserData);
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (userTheme && userTheme !== theme) {
      setTheme(userTheme);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTheme]);

  const [trigger, { error }] = usePatchUsersByIdMutation();

  useErrorHandler(error);

  const handleThemeChange = async (themeClass: string, triggerPatchUserMutation = true) => {
    if (triggerPatchUserMutation) {
      const payload: PatchUsersByIdApiArg = {
        id: userId,
        body: {
          theme: themeClass as ThemeType
        }
      };

      await trigger(payload);
    }

    dispatch(setUserTheme(themeClass as ThemeType));
  };

  return { theme: mounted ? theme : undefined, handleThemeChange };
};
