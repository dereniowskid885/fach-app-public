'use client';

import { Button } from '../shadcn/button';
import { TStatusActionButton } from './UserTicketCarouselCardButtons';
import { useState } from 'react';
import SpecialistTicketEvaluationDialog from './SpecialistTicketEvaluationDialog';
import { ETicketStatus } from '@/constants/ticketStatus';
import { EActionType } from '@/constants/enums';
import { Evaluation, Ticket } from '@/api/accountApi';

export interface ISpecialistTicketCarouselCardButtons {
  ticket: Ticket;
  userEvaluation?: Evaluation;
  isEvaluatedByLoggedSpecialist: boolean;
}

export const SpecialistTicketCarouselCardButtons = ({
  ticket,
  userEvaluation,
  isEvaluatedByLoggedSpecialist
}: ISpecialistTicketCarouselCardButtons) => {
  const ticketStatus = ticket.status as ETicketStatus;

  const [evaluationDialogMode, setEvaluationDialogMode] = useState<EActionType>(
    EActionType.CREATION
  );
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
          handler: () => {
            setEvaluationDialogMode(EActionType.EDIT);
            setPriceEvaluationDialog(true);
          }
        }
      : {
          title: 'Wyceń',
          handler: () => {
            setEvaluationDialogMode(EActionType.CREATION);
            setPriceEvaluationDialog(true);
          }
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
        mode={evaluationDialogMode}
        ticket={ticket}
        userEvaluation={userEvaluation}
        closeDialog={() => setPriceEvaluationDialog(false)}
      />
    </>
  );
};
