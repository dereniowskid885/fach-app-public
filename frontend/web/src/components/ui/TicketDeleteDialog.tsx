import React, { useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { useDeleteTicketsByIdMutation } from '@/api/accountApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ITicketDeleteDialog {
  open: boolean;
  ticketId?: string;
  refetchTickets: () => void;
  closeDialog: () => void;
}

export const TicketDeleteDialog = ({
  open,
  ticketId,
  refetchTickets,
  closeDialog
}: ITicketDeleteDialog) => {
  const t = useTranslations();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [trigger, { isLoading, error }] = useDeleteTicketsByIdMutation();

  useErrorHandler(error, {
    setInlineError: message => setErrorMessage(message)
  });

  const submitHandler = async () => {
    if (!ticketId) return;

    const { error } = await trigger({
      id: ticketId
    });

    if (error) return;

    refetchTickets();
    toast.success(t('ticketDeleteDialog.toastTitle'));
  };

  return (
    <DialogComponent
      open={open}
      title={t('ticketDeleteDialog.title')}
      cancelButtonText={t('common.back')}
      confirmButtonText={t('common.confirm')}
      confirmButtonHandler={submitHandler}
      isLoadingConfirmButton={isLoading}
      cancelButtonHandler={closeDialog}
      errorMessage={errorMessage}
    />
  );
};
