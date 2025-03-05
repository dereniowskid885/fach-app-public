'use client';

import React, { useState } from 'react';
import { Button } from '../shadcn/button';
import { useDeleteTicketsByIdMutation, useGetTicketsQuery } from '@/api/ticketingApi';
import { useToast } from '@/hooks/use-toast';
import DialogComponent from '../common/DialogComponent';
import { ETicketStatus } from '@/constants/ticket';
import { parseQueryError } from '@/lib/helpers';

type TStatusActionButton = Partial<{
  [key in ETicketStatus]: {
    title: string;
    handler: () => void;
  };
}>;

export interface ITicketCarouselCardButtons {
  ticketId: string;
  ticketStatus: ETicketStatus;
}

export const TicketCarouselCardButtons = ({
  ticketId,
  ticketStatus
}: ITicketCarouselCardButtons) => {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const { refetch } = useGetTicketsQuery();
  const [trigger, { isLoading: isDeleteLoading }] = useDeleteTicketsByIdMutation();

  const ticketDeleteHandler = async () => {
    if (!ticketId) return;

    const result = await trigger({
      id: ticketId
    });
    const isSuccess = !result.error;

    if (isSuccess) {
      refetch();
      toast({
        title: 'Sprawa anulowana pomyślnie',
        duration: 2000
      });
    } else {
      const { message } = parseQueryError(result.error);

      setErrorMessage(message);
    }
  };

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.PENDING_PAYMENT]: {
      title: 'Opłać',
      handler: () => null
    },
    [ETicketStatus.PRICE_USER_ACCEPTATION]: {
      title: 'Zaakceptuj wycenę',
      handler: () => null
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {statusActionButton[ticketStatus] ? (
          <Button variant="default" onClick={statusActionButton[ticketStatus].handler}>
            {statusActionButton[ticketStatus].title}
          </Button>
        ) : null}
        <div className="flex gap-3">
          <Button variant="outline" className="w-full bg-primary-200">
            Edytuj
          </Button>
          <Button variant="destructive" className="w-full" onClick={() => setDeleteDialog(true)}>
            Anuluj
          </Button>
        </div>
      </div>
      <DialogComponent
        open={deleteDialog}
        isLoadingConfirmButton={isDeleteLoading}
        title="Czy na pewno chcesz anulować sprawę?"
        cancelButtonText="Wstecz"
        cancelButtonHandler={() => setDeleteDialog(false)}
        confirmButtonText="Potwierdź"
        confirmButtonHandler={ticketDeleteHandler}
        errorMessage={errorMessage}
      />
    </>
  );
};
