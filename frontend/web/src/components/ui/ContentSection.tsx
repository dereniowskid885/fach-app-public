import { ReactNode } from 'react';
import Typography from './Typography';
import { cn } from '@/lib/utils';
import { Badge } from '../shadcn/badge';

export interface IContentSection {
  title?: string;
  Icon?: JSX.ElementType;
  children: ReactNode;
  bgTransparent?: boolean;
  className?: string;
  amount?: number;
}

export default function ContentSection({
  bgTransparent = false,
  title,
  Icon,
  children,
  className,
  amount
}: IContentSection) {
  return (
    <div
      className={cn(
        'space-y-4 p-4',
        bgTransparent ? 'bg-transparent' : 'rounded-2xl border shadow-md',
        className
      )}
    >
      {Icon || title ? (
        <div className="flex items-center gap-2">
          {Icon ? <Icon size={16} strokeWidth={2.5} /> : null}

          {title ? <Typography variant="note-wide">{title}</Typography> : null}

          {amount !== undefined ? (
            <Badge variant="amount" className="px-2 text-xs">
              {amount}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {children}
    </div>
  );
}
