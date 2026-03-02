import React, { useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { useDeleteTicketsByIdMutation, useGetTicketsQuery } from '@/api/accountApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { buildDashboardTicketsQueryFilters } from '@/helpers/buildDashboardTicketsQueryFilters';

export interface ITicketDeleteDialog {
  open: boolean;
  ticketId: string;
  closeDialog: () => void;
}

export const TicketDeleteDialog = ({ open, ticketId, closeDialog }: ITicketDeleteDialog) => {
  const t = useTranslations();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [triggerDelete, { isLoading, error: errorDelete }] = useDeleteTicketsByIdMutation();

  const { role, userId } = useAppSelector(selectUserData);
  const filters = buildDashboardTicketsQueryFilters(role, userId);
  const { refetch: refetchTickets, error: errorTicketsRefetch } = useGetTicketsQuery(filters ?? {});

  useErrorHandler(errorDelete || errorTicketsRefetch, {
    setInlineError: message => setErrorMessage(message)
  });

  const submitHandler = async () => {
    const { error } = await triggerDelete({
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
