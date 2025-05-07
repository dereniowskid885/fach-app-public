'use client';

import { ReactElement, useState } from 'react';
import { Button } from '../shadcn/button';
import { GetTicketsByIdByIdApiResponse, useGetTicketsQuery } from '@/api/accountApi';
import { ETicketStatus } from '@/constants/ticketStatus';
import AmountIcon from './AmountIcon';
import { TicketDeleteDialog } from './TicketDeleteDialog';
import { EvaluationsListDialog } from './EvaluationsListDialog';

export type TStatusActionButton = Partial<{
  [key in ETicketStatus]: {
    title: string;
    handler: () => void;
    element?: ReactElement;
  };
}>;

export interface IUserTicketCarouselCardButtons {
  ticketId?: string;
  ticketStatus: ETicketStatus;
  ticketEvaluations?: GetTicketsByIdByIdApiResponse['evaluations'];
}

export const UserTicketCarouselCardButtons = ({
  ticketId,
  ticketStatus,
  ticketEvaluations
}: IUserTicketCarouselCardButtons) => {
  const [ticketDeleteDialog, setTicketDeleteDialog] = useState<boolean>(false);
  const [evaluationListDialog, setEvaluationListDialog] = useState<boolean>(false);

  const { refetch } = useGetTicketsQuery();

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.PENDING_PAYMENT]: {
      title: 'Opłać',
      handler: () => null
    },
    [ETicketStatus.PRICE_USER_ACCEPTATION]: {
      title: 'Zobacz wyceny',
      handler: () => setEvaluationListDialog(true),
      element: (
        <AmountIcon
          className="top-0 -translate-y-[50%] translate-x-[50%]"
          amount={ticketEvaluations?.length}
        />
      )
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <Button variant="outline" className="w-full bg-primary-200">
            Edytuj
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setTicketDeleteDialog(true)}
          >
            Anuluj
          </Button>
        </div>
        {statusActionButton[ticketStatus] ? (
          <Button variant="default" onClick={statusActionButton[ticketStatus].handler}>
            {statusActionButton[ticketStatus].title}
            {statusActionButton[ticketStatus].element}
          </Button>
        ) : null}
      </div>
      <TicketDeleteDialog
        open={ticketDeleteDialog}
        refetchTickets={refetch}
        closeDialog={() => setTicketDeleteDialog(false)}
        ticketId={ticketId}
      />
      <EvaluationsListDialog
        open={evaluationListDialog}
        refetchTickets={refetch}
        closeDialog={() => setEvaluationListDialog(false)}
        ticketEvaluations={ticketEvaluations}
      />
    </>
  );
};
