import { useErrorHandler } from '@/hooks/useErrorHandler';
import { enhancedAccountApi } from '@/services/api/enhanced/enhancedAccountApi';
import React from 'react';
import { ETicketStatus } from 'shared-types';
import { toast } from 'sonner';
import DialogComponent from '@/components/ui/DialogComponent';
import { Ticket } from '@/services/api/generated/accountApi';
import { useTranslations } from 'next-intl';

export interface ITicketSpecialistSendForReviewDialog {
  open: boolean;
  closeDialog: () => void;
  ticket: Ticket;
}

export default function TicketSpecialistSendForReviewDialog({
  open,
  closeDialog,
  ticket
}: ITicketSpecialistSendForReviewDialog) {
  const t = useTranslations();

  const [triggerUpdateTicket, { isLoading: isLoadingTicketUpdate, error: errorTicketUpdate }] =
    enhancedAccountApi.endpoints.patchTicketsById.useMutation();

  useErrorHandler(errorTicketUpdate);

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

    toast.success(t('ticketSpecialistSendForReviewDialog.toastTitle'));
  };

  return (
    <DialogComponent
      open={open}
      title={t('ticketSpecialistSendForReviewDialog.title')}
      confirmButtonText={t('ticketSpecialistSendForReviewDialog.confirmButtonText')}
      confirmButtonHandler={sendTicketForSolutionReview}
      cancelButtonText={t('common.cancel')}
      cancelButtonHandler={closeDialog}
      isLoadingConfirmButton={isLoadingTicketUpdate}
    />
  );
}
