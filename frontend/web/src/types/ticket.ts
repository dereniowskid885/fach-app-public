import { ETicketStatus } from '@shared/enums/ticket';
import { ReactElement } from 'react';

export type TStatusActionButton = Partial<{
  [key in ETicketStatus]: {
    title: string;
    handler: () => void;
    element?: ReactElement;
    isLoading?: boolean;
  };
}>;
