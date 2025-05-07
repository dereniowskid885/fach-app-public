'use client';

import { Button } from '../shadcn/button';
import { TStatusActionButton } from './UserTicketCarouselCardButtons';
import { useState } from 'react';
import SpecialistTicketEvaluationDialog from './SpecialistTicketEvaluationDialog';
import { ETicketStatus } from '@/constants/ticketStatus';

export interface ISpecialistTicketCarouselCardButtons {
  ticketId?: string;
  ticketCity?: string;
  ticketStatus: ETicketStatus;
  isEvaluatedByLoggedSpecialist: boolean;
}

export const SpecialistTicketCarouselCardButtons = ({
  ticketId,
  ticketCity,
  ticketStatus,
  isEvaluatedByLoggedSpecialist
}: ISpecialistTicketCarouselCardButtons) => {
  const [priceEvaluationDialog, setPriceEvaluationDialog] = useState<boolean>(false);

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.IN_PROGRESS]: {
      title: 'Odpowiedz',
      handler: () => null
    },
    [ETicketStatus.PRICE_EVALUATION]: {
      title: 'Wyceń',
      handler: () => setPriceEvaluationDialog(true)
    },
    [ETicketStatus.PRICE_USER_ACCEPTATION]: isEvaluatedByLoggedSpecialist
      ? {
          title: 'Edytuj wycenę',
          handler: () => setPriceEvaluationDialog(false)
        }
      : {
          title: 'Wyceń',
          handler: () => setPriceEvaluationDialog(true)
        }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {statusActionButton[ticketStatus] ? (
          <Button variant="default" onClick={statusActionButton[ticketStatus].handler}>
            {statusActionButton[ticketStatus].title}
          </Button>
        ) : null}
      </div>
      <SpecialistTicketEvaluationDialog
        open={priceEvaluationDialog}
        ticketId={ticketId}
        ticketCity={ticketCity}
        closeDialog={() => setPriceEvaluationDialog(false)}
      />
    </>
  );
};
