'use client';

import { Button } from '../shadcn/button';
import { useState } from 'react';
import TicketSpecialistEvaluationDialog from './TicketSpecialistEvaluationDialog';
import { ETicketStatus } from '@shared/enums/ticket';
import { Evaluation, Ticket } from '@/services/api/generated/accountApi';
import { useTranslations } from 'next-intl';
import { EActionType } from '@/enums/ui';
import { TStatusActionButton } from '@/types/ticket';

export interface ITicketSpecialistActionButtons {
  ticket: Ticket;
  currentUserEvaluation?: Evaluation;
}

export const TicketSpecialistActionButtons = ({
  ticket,
  currentUserEvaluation
}: ITicketSpecialistActionButtons) => {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();

  const [evaluationDialogMode, setEvaluationDialogMode] = useState<EActionType>(
    EActionType.CREATION
  );
  const [priceEvaluationDialog, setPriceEvaluationDialog] = useState<boolean>(false);

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.IN_PROGRESS]: {
      title: t('ticketSpecialistActionButtons.reply'),
      handler: () => null
    },
    [ETicketStatus.AWAITING_EVALUATION]: currentUserEvaluation
      ? {
          title: t('ticketSpecialistActionButtons.editEvaluation'),
          handler: () => {
            setEvaluationDialogMode(EActionType.EDIT);
            setPriceEvaluationDialog(true);
          }
        }
      : {
          title: t('ticketSpecialistActionButtons.evaluate'),
          handler: () => {
            setEvaluationDialogMode(EActionType.CREATION);
            setPriceEvaluationDialog(true);
          }
        }
  };

  return (
    <>
      {statusActionButton[ticketStatus] ? (
        <Button
          variant="outline"
          className={
            statusActionButton[ticketStatus].isLoading !== undefined ? 'min-w-[120px]' : ''
          }
          onClick={statusActionButton[ticketStatus].handler}
        >
          {statusActionButton[ticketStatus].title}
        </Button>
      ) : null}

      <TicketSpecialistEvaluationDialog
        open={priceEvaluationDialog}
        mode={evaluationDialogMode}
        ticket={ticket}
        currentUserEvaluation={currentUserEvaluation}
        closeDialog={() => setPriceEvaluationDialog(false)}
      />
    </>
  );
};
