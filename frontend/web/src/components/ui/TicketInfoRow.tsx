import { ReactNode } from 'react';
import { Typography } from '../common/Typography';

export interface TicketInfoRow {
  children: ReactNode;
  className?: string;
}

export function TicketInfoRow({ children, className }: TicketInfoRow) {
  return (
    <Typography variant="muted" className={`text-neutral-500 ${className}`}>
      {children}
    </Typography>
  );
}
