import React, { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps<T extends ElementType> extends React.HTMLAttributes<HTMLElement> {
  as?: T;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'lead' | 'large' | 'small' | 'muted';
}

export function Typography<T extends ElementType = 'p'>({
  children,
  variant = 'p',
  className,
  as,
  ...props
}: TypographyProps<T> & React.ComponentPropsWithoutRef<T>) {
  const variantStyles = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    p: 'leading-7',
    lead: 'text-xl text-muted-foreground',
    large: 'text-lg font-semibold',
    small: 'text-sm font-medium leading-none',
    muted: 'text-sm text-muted-foreground'
  };

  const defaultElement =
    variant === 'p' || variant === 'lead'
      ? 'p'
      : variant === 'large' || variant === 'small' || variant === 'muted'
        ? 'span'
        : (variant as ElementType);

  const Component = as || defaultElement;

  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
