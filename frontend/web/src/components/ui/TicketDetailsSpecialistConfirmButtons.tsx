'use client';

import { Button } from '../shadcn/button';
import { Dispatch, SetStateAction, useState } from 'react';
import TicketSpecialistEvaluationDialog from './TicketSpecialistEvaluationDialog';
import { ETicketStatus } from 'shared-types';
import {
  Evaluation,
  Ticket,
  usePatchTicketsByIdMutation
} from '@/services/api/generated/accountApi';
import { useTranslations } from 'next-intl';
import { EActionType } from '@/enums/ui';
import { TStatusActionButton } from '@/types/ticket';
import TicketDetailsDialog from './TicketDetailsDialog';
import { toast } from 'sonner';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ITicketDetailsSpecialistConfirmButtons {
  ticket: Ticket;
  currentUserEvaluation?: Evaluation;
  setDialogErrorMessage?: Dispatch<SetStateAction<string | undefined>>;
}

export const TicketDetailsSpecialistConfirmButtons = ({
  ticket,
  currentUserEvaluation,
  setDialogErrorMessage
}: ITicketDetailsSpecialistConfirmButtons) => {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();

  const [evaluationDialogMode, setEvaluationDialogMode] = useState<EActionType>(
    EActionType.CREATION
  );
  const [priceEvaluationDialog, setPriceEvaluationDialog] = useState<boolean>(false);
  const [ticketDetailsDialog, setTicketDetailsDialog] = useState<boolean>(false);

  const [triggerUpdateTicket, { isLoading: isLoadingTicketUpdate, error: errorTicketUpdate }] =
    usePatchTicketsByIdMutation();

  useErrorHandler(errorTicketUpdate, {
    setInlineError: message => setDialogErrorMessage?.(message)
  });

  const sendTicketForSolutionReview = async () => {
    if (!ticket._id) return;

    const result = await triggerUpdateTicket({
      id: ticket._id,
      body: {
        status: ETicketStatus.SOLUTION_REVIEW
      }
    });

    const { error } = result;
    if (error) return;

    setDialogErrorMessage?.('');
    toast.success(t('ticketDetailsDialog.toastTitle.sendForReview'));
  };

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.IN_PROGRESS]: {
      title: t('ticketSpecialistActionButtons.sendForReview'),
      handler: sendTicketForSolutionReview,
      isLoading: isLoadingTicketUpdate,
      isDisabled: ticket.specialistCommentsCount === 0
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
          variant="default"
          className={
            statusActionButton[ticketStatus].isLoading !== undefined ? 'min-w-[120px]' : ''
          }
          onClick={statusActionButton[ticketStatus].handler}
          loading={statusActionButton[ticketStatus].isLoading ?? false}
          disabled={statusActionButton[ticketStatus].isDisabled ?? false}
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

      <TicketDetailsDialog
        open={ticketDetailsDialog}
        ticket={ticket}
        closeDialog={() => setTicketDetailsDialog(false)}
        scrollToInput={true}
      />
    </>
  );
};
