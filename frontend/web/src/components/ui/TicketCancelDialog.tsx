import React, { useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { accountApi, usePatchTicketsByIdMutation } from '@/api/accountApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ETicketStatus } from '@shared/enums/ticket';

export interface ITicketCancelDialog {
  open: boolean;
  ticketId: string;
  closeDialog: () => void;
}

export const TicketCancelDialog = ({ open, ticketId, closeDialog }: ITicketCancelDialog) => {
  const t = useTranslations();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [triggerUpdate, { isLoading, error: errorDelete }] = usePatchTicketsByIdMutation();

  const [triggerTicketsRefetch, { error: errorTicketsRefetch }] =
    accountApi.endpoints.getTicketsMy.useLazyQuery({});

  useErrorHandler(errorDelete || errorTicketsRefetch, {
    setInlineError: message => setErrorMessage(message)
  });

  const submitHandler = async () => {
    const { error } = await triggerUpdate({
      id: ticketId,
      body: {
        status: ETicketStatus.CANCELED
      }
    });

    if (error) return;

    triggerTicketsRefetch({});
    toast.success(t('ticketCancelDialog.toastTitle'));
  };

  return (
    <DialogComponent
      open={open}
      title={t('ticketCancelDialog.title')}
      cancelButtonText={t('common.back')}
      confirmButtonText={t('common.confirm')}
      confirmButtonHandler={submitHandler}
      isLoadingConfirmButton={isLoading}
      cancelButtonHandler={closeDialog}
      errorMessage={errorMessage}
    />
  );
};
