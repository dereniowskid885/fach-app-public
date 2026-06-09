'use client';

import { selectUserData } from '@/redux/slices/UserDataSlice';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { isSpecialist } from 'shared-types';

export interface ISpecialistLayout {
  children: ReactNode;
}

export default function SpecialistLayout({ children }: ISpecialistLayout) {
  const { role, isInitialized: isUserStateInitialized } = useSelector(selectUserData);

  const isInvalidRole = isUserStateInitialized && !isSpecialist(role);
  if (isInvalidRole) {
    notFound();
  }

  return children;
}
