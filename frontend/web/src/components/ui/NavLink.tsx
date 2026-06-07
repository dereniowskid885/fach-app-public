import Link from 'next/link';
import React, { ReactNode } from 'react';
import Typography from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import AnimateCollapse from '@/components/ui/AnimateCollapse';

export interface INavLink {
  href: string;
  children?: ReactNode;
  className?: string;
  title: string;
  isCurrentPath?: boolean;
  isSidebarCollapsed?: boolean;
}

export default function NavLink({
  children,
  href,
  isCurrentPath = false,
  className,
  title,
  isSidebarCollapsed = false
}: INavLink) {
  const classNames = cn(
    `flex items-center px-3 py-2 rounded-2xl text-sm animation-hover group ${className ?? ''}`,
    isCurrentPath ? 'animation-active' : ''
  );

  return (
    <Link href={href} className={classNames} title={title}>
      <div className="flex w-full items-center gap-3">
        {children ? children : null}

        <AnimateCollapse isHidden={isSidebarCollapsed}>
          <Typography
            variant="small"
            className={cn('text-nowrap', isCurrentPath ? 'font-semibold' : '')}
          >
            {title}
          </Typography>
        </AnimateCollapse>
      </div>
    </Link>
  );
}
