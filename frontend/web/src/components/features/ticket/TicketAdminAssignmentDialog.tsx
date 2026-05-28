import React from 'react';
import DialogComponent from '@/components/ui/DialogComponent';
import { useTranslations } from 'next-intl';
import { enhancedAccountApi } from '@/services/api/enhanced/enhancedAccountApi';
import { Ticket } from '@/services/api/generated/accountApi';
import { toast } from 'sonner';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ITicketAdminAssignmentDialog {
  open: boolean;
  closeDialog: () => void;
  ticket: Ticket;
  userId: string;
}

export default function TicketAdminAssignmentDialog({
  open,
  closeDialog,
  ticket,
  userId
}: ITicketAdminAssignmentDialog) {
  const t = useTranslations();

  const [triggerUpdateTicket, { isLoading: isLoadingTicketUpdate, error: errorTicketUpdate }] =
    enhancedAccountApi.endpoints.patchTicketsById.useMutation();

  useErrorHandler(errorTicketUpdate);

  const updateTicketHandler = async () => {
    if (!ticket._id) return;

    const result = await triggerUpdateTicket({
      id: ticket._id,
      body: {
        assigneeId: userId
      }
    });

    const { error } = result;
    if (error) return;

    closeDialog();
    toast.success(t('ticketAdminAssignmentDialog.toastTitle'));
  };

  return (
    <DialogComponent
      open={open}
      title={t('ticketAdminAssignmentDialog.title')}
      confirmButtonText={t('ticketAdminAssignmentDialog.confirmButtonText')}
      confirmButtonHandler={updateTicketHandler}
      cancelButtonText={t('common.cancel')}
      cancelButtonHandler={closeDialog}
      isLoadingConfirmButton={isLoadingTicketUpdate}
    />
  );
}
