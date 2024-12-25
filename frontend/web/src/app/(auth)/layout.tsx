import LicenseNote from '@/components/ui/LicenseNote';
import React, { ReactNode } from 'react';

export interface IAuthLayout {
  children: ReactNode;
}

export default function AuthLayout({ children }: IAuthLayout) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[50%] top-[50%] z-[2] translate-x-[-50%] translate-y-[-50%]">
        {children}
      </div>
      <LicenseNote />
    </div>
  );
}
