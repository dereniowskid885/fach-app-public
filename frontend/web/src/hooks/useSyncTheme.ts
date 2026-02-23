'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';

export const useSyncTheme = () => {
  const { theme: userTheme } = useSelector(selectUserData);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (userTheme && userTheme !== theme) {
      setTheme(userTheme);
    }
  }, [theme, setTheme, userTheme]);

  return { theme, setTheme };
};
