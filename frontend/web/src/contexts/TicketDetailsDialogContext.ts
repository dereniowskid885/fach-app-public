import { IOpenDialogOptions } from '@/components/providers/TicketDetailsDialogContextProvider';
import { createContext, useContext } from 'react';

export interface ITicketDetailsDialogContext {
  openTicketDetailsDialog: (ticketId?: string, options?: IOpenDialogOptions) => void;
  closeTicketDetailsDialog: () => void;
}

export const TicketDetailsDialogContext = createContext<ITicketDetailsDialogContext | null>(null);

export const useTicketDetailsDialogContext = () => {
  const context = useContext(TicketDetailsDialogContext);

  if (!context)
    throw new Error('useTicketDetailsDialog must be used within TicketDetailsDialogProvider');

  return context;
};
