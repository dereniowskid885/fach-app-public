'use client';

import { selectUserData } from '@/redux/slices/UserDataSlice';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { isAdmin } from 'shared-types';

export interface IAdminLayout {
  children: ReactNode;
}

export default function AdminLayout({ children }: IAdminLayout) {
  const { role, isInitialized: isUserStateInitialized } = useSelector(selectUserData);

  const isInvalidRole = isUserStateInitialized && !isAdmin(role);
  if (isInvalidRole) {
    notFound();
  }

  return children;
}
