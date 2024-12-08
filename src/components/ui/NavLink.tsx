'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';
import { Typography } from './Typography';

export interface INavLink {
  href: string;
  children?: ReactNode;
  className?: string;
  title: string;
}

export default function NavLink({ children, href, className, title }: INavLink) {
  const currentPath = usePathname();
  const isCurrentPath = href === currentPath;
  className = isCurrentPath ? className + ' active' : className;

  return (
    <Link href={href} className={className} title={title}>
      {children ? children : null}
      <Typography variant="small">{title}</Typography>
    </Link>
  );
}
