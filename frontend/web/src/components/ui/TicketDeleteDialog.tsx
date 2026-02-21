import React, { useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { parseQueryError } from '@/lib/utils';
import { useDeleteTicketsByIdMutation } from '@/api/accountApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

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

  const [trigger, { isLoading }] = useDeleteTicketsByIdMutation();

  const submitHandler = async () => {
    if (!ticketId) return;

    const result = await trigger({
      id: ticketId
    });
    const isSuccess = !result.error;

    if (isSuccess) {
      refetchTickets();
      toast.success(t('ticketDeleteDialog.toastTitle'));
    } else {
      const { message } = parseQueryError(result.error);

      setErrorMessage(message);
    }
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
