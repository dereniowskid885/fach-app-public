'use client';

import { Button } from '@/components/shadcn/button';
import { useState } from 'react';
import TicketSpecialistEvaluationDialog from './TicketSpecialistEvaluationDialog';
import { ETicketStatus } from 'shared-types';
import { Ticket } from '@/services/api/generated/accountApi';
import { useTranslations } from 'next-intl';
import { TStatusActionButton } from '@/types/ticket';
import { useTicketDetailsDialogContext } from '@/contexts/TicketDetailsDialogContext';

export interface ITicketCardSpecialistActionButtons {
  ticket: Ticket;
  hideDetailsButton?: boolean;
}

export default function TicketCardSpecialistActionButtons({
  ticket,
  hideDetailsButton = false
}: ITicketCardSpecialistActionButtons) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();
  const { openTicketDetailsDialog } = useTicketDetailsDialogContext();

  const [priceEvaluationDialog, setPriceEvaluationDialog] = useState<boolean>(false);

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.IN_PROGRESS]: {
      title: t('ticketSpecialistActionButtons.reply'),
      handler: () => openTicketDetailsDialog(ticket._id, { scrollToInput: true })
    },
    [ETicketStatus.AWAITING_EVALUATION]: {
      title: t('ticketSpecialistActionButtons.evaluate'),
      handler: () => setPriceEvaluationDialog(true)
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {!hideDetailsButton ? (
          <Button onClick={() => openTicketDetailsDialog(ticket._id)}>
            {t('common.showDetails')}
          </Button>
        ) : null}

        {statusActionButton[ticketStatus] ? (
          <Button
            className={statusActionButton[ticketStatus].isLoading !== undefined ? 'min-w-30' : ''}
            onClick={statusActionButton[ticketStatus].handler}
          >
            {statusActionButton[ticketStatus].title}
          </Button>
        ) : null}
      </div>

      <TicketSpecialistEvaluationDialog
        open={priceEvaluationDialog}
        ticket={ticket}
        closeDialog={() => setPriceEvaluationDialog(false)}
      />
    </>
  );
}
