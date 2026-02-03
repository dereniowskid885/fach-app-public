import React, { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps<T extends ElementType> extends React.HTMLAttributes<HTMLElement> {
  as?: T;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'lead' | 'large' | 'small' | 'muted' | 'note';
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
    h2: 'scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    p: 'text-sm leading-6 md:text-base md:leading-7',
    lead: 'text-base text-muted-foreground sm:text-lg md:text-xl',
    large: 'text-base font-semibold sm:text-lg md:text-xl',
    small: 'text-xs font-medium sm:text-sm',
    muted: 'text-muted-foreground text-sm',
    note: 'text-xs'
  };

  const defaultElement =
    variant === 'p' || variant === 'lead'
      ? 'p'
      : variant === 'large' || variant === 'small' || variant === 'muted' || variant === 'note'
        ? 'span'
        : (variant as ElementType);

  const Component = as || defaultElement;

  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
