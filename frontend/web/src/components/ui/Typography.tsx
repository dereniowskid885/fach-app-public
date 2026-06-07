import React, { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps<T extends ElementType> extends React.HTMLAttributes<HTMLElement> {
  as?: T;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'lead' | 'large' | 'small' | 'muted' | 'note' | 'note-wide';
}

export default function Typography<T extends ElementType = 'p'>({
  children,
  variant = 'p',
  className,
  as,
  ...props
}: TypographyProps<T> & React.ComponentPropsWithoutRef<T>) {
  const variantStyles = {
    h1: 'scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl',
    h2: 'scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-xl font-semibold tracking-tight',
    p: 'text-sm leading-6 md:text-base md:leading-7',
    lead: 'text-base md:text-lg',
    large: 'text-base font-semibold md:text-lg',
    small: 'text-xs sm:text-sm font-medium',
    muted: 'text-sm',
    note: 'text-xs',
    'note-wide': 'text-xs font-bold uppercase tracking-wide'
  };

  const defaultElement =
    variant === 'p' ||
    variant === 'lead' ||
    variant === 'large' ||
    variant === 'small' ||
    variant === 'muted'
      ? 'p'
      : variant === 'note' || variant === 'note-wide'
        ? 'span'
        : (variant as ElementType);

  const Component = as || defaultElement;

  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
