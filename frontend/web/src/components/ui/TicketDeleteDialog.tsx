import React, { useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { parseQueryError } from '@/lib/helpers';
import { useDeleteTicketsByIdMutation } from '@/api/accountApi';
import { toast } from '@/hooks/use-toast';

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
      toast({
        title: 'Sprawa anulowana pomyślnie',
        duration: 3000
      });
    } else {
      const { message } = parseQueryError(result.error);

      setErrorMessage(message);
    }
  };

  return (
    <DialogComponent
      open={open}
      title="Czy na pewno chcesz anulować sprawę?"
      cancelButtonText="Wstecz"
      confirmButtonText="Potwierdź"
      confirmButtonHandler={submitHandler}
      isLoadingConfirmButton={isLoading}
      cancelButtonHandler={closeDialog}
      errorMessage={errorMessage}
    />
  );
};
