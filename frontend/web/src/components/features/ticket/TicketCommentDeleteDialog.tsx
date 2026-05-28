import React, { useState } from 'react';
import DialogComponent from '@/components/ui/DialogComponent';
import { useDeleteTicketsCommentByIdMutation } from '@/services/api/generated/accountApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ITicketCommentDeleteDialog {
  open: boolean;
  commentId: string;
  closeDialog: () => void;
}

export const TicketCommentDeleteDialog = ({
  open,
  commentId,
  closeDialog
}: ITicketCommentDeleteDialog) => {
  const t = useTranslations();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [triggerDelete, { isLoading, error: errorDelete }] = useDeleteTicketsCommentByIdMutation();

  useErrorHandler(errorDelete, {
    setInlineError: message => setErrorMessage(message)
  });

  const submitHandler = async () => {
    const { error } = await triggerDelete({
      id: commentId
    });

    if (error) return;

    toast.success(t('ticketCommentDeleteDialog.toastTitle'));
  };

  return (
    <DialogComponent
      open={open}
      title={t('ticketCommentDeleteDialog.title')}
      cancelButtonText={t('common.back')}
      confirmButtonText={t('common.confirm')}
      confirmButtonHandler={submitHandler}
      isLoadingConfirmButton={isLoading}
      cancelButtonHandler={closeDialog}
      errorMessage={errorMessage}
    />
  );
};
