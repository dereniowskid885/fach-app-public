import React, { useState } from 'react';
import DialogComponent from '@/components/ui/DialogComponent';
import { usePatchTicketsByIdMutation } from '@/services/api/generated/accountApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ETicketStatus } from 'shared-types';
import { XCircle } from 'lucide-react';

export interface ITicketCancelDialog {
  open: boolean;
  ticketId: string;
  closeDialog: () => void;
}

export const TicketCancelDialog = ({ open, ticketId, closeDialog }: ITicketCancelDialog) => {
  const t = useTranslations();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [triggerUpdate, { isLoading, error: errorDelete }] = usePatchTicketsByIdMutation();

  useErrorHandler(errorDelete, {
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

    toast.success(t('ticketCancelDialog.toastTitle'));
  };

  return (
    <DialogComponent
      open={open}
      headerContent={<XCircle size={24} />}
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
