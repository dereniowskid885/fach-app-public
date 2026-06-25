'use client';

import { Button } from '@/components/shadcn/button';
import { useState } from 'react';
import TicketSpecialistEvaluationDialog from './TicketSpecialistEvaluationDialog';
import { ETicketStatus } from 'shared-types';
import { Ticket } from '@/services/api/generated/accountApi';
import { useTranslations } from 'next-intl';
import { TStatusActionButton } from '@/types/ticket';
import TicketSpecialistSendForReviewDialog from './TicketSpecialistSendForReviewDialog';
import { Spinner } from '@/components/shadcn/spinner';

export interface ITicketDetailsSpecialistActionButtons {
  ticket: Ticket;
}

export const TicketDetailsSpecialistActionButtons = ({
  ticket
}: ITicketDetailsSpecialistActionButtons) => {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();

  const [priceEvaluationDialog, setPriceEvaluationDialog] = useState<boolean>(false);
  const [ticketSendForReviewDialog, setTicketSendForReviewDialog] = useState<boolean>(false);

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.IN_PROGRESS]: {
      title: t('ticketSpecialistActionButtons.sendForReview'),
      handler: () => setTicketSendForReviewDialog(true)
    },
    [ETicketStatus.AWAITING_EVALUATION]: {
      title: t('ticketSpecialistActionButtons.evaluate'),
      handler: () => setPriceEvaluationDialog(true)
    }
  };

  return (
    <>
      {statusActionButton[ticketStatus] ? (
        <Button
          variant="default"
          className={statusActionButton[ticketStatus].isLoading !== undefined ? 'min-w-30' : ''}
          onClick={statusActionButton[ticketStatus].handler}
          disabled={statusActionButton[ticketStatus].isDisabled ?? false}
        >
          {statusActionButton[ticketStatus].isLoading ? <Spinner /> : null}
          {statusActionButton[ticketStatus].title}
        </Button>
      ) : null}

      <TicketSpecialistEvaluationDialog
        open={priceEvaluationDialog}
        ticket={ticket}
        closeDialog={() => setPriceEvaluationDialog(false)}
      />

      <TicketSpecialistSendForReviewDialog
        open={ticketSendForReviewDialog}
        ticket={ticket}
        closeDialog={() => setTicketSendForReviewDialog(false)}
      />
    </>
  );
};
