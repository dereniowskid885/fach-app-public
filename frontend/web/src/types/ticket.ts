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

// undefined = not yet initialized
// null      = user selected "All"
// string    = specific city selected
export type TTicketCityFilter = string | null | undefined;
