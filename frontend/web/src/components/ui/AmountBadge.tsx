import { cn } from '@/lib/utils';
import { Badge } from '../shadcn/badge';
import { ReactNode } from 'react';

export interface IAmountBadge {
  children: ReactNode;
  className?: string;
}

export default function AmountBadge({ children, className }: IAmountBadge) {
  return (
    <Badge
      variant="secondary"
      className={cn('bg-secondary text-muted-foreground hover:bg-secondary', className)}
    >
      {children}
    </Badge>
  );
}
