'use client';

import { TicketDetailsDialogContext } from '@/contexts/TicketDetailsDialogContext';
import TicketDetailsDialog from '@/components/features/ticket/TicketDetailsDialog';
import { useState } from 'react';
import ClientOnlyWrapper from '../wrappers/ClientOnlyWrapper';

interface ITicketDetailsDialogState {
  ticketId: string | null;
  scrollToInput: boolean;
}

export interface IOpenDialogOptions {
  scrollToInput?: boolean;
}

export const TicketDetailsDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ITicketDetailsDialogState>({
    ticketId: null,
    scrollToInput: false
  });

  const openDialog = (ticketId?: string, options?: IOpenDialogOptions) => {
    if (!ticketId) return;

    setState({ ticketId, scrollToInput: options?.scrollToInput ?? false });
  };

  const closeDialog = () => {
    setState({ ticketId: null, scrollToInput: false });
  };

  return (
    <TicketDetailsDialogContext.Provider
      value={{ openTicketDetailsDialog: openDialog, closeTicketDetailsDialog: closeDialog }}
    >
      {children}

      <ClientOnlyWrapper>
        <TicketDetailsDialog
          open={!!state.ticketId}
          ticketId={state.ticketId ?? undefined}
          scrollToInput={state.scrollToInput}
        />
      </ClientOnlyWrapper>
    </TicketDetailsDialogContext.Provider>
  );
};
