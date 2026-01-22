'use client';

import { ReactElement, useCallback, useState } from 'react';
import { Button } from '../shadcn/button';
import { Ticket, useGetTicketsQuery } from '@/api/accountApi';
import { ETicketStatus } from '@/constants/ticketStatus';
import AmountIcon from './AmountIcon';
import { TicketDeleteDialog } from './TicketDeleteDialog';
import { EvaluationsListDialog } from './EvaluationsListDialog';
import { buildDashboardTicketsQueryFilters } from '@/helpers/buildDashboardTicketsQueryFilters';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useAppSelector } from '@/redux/hooks';
import { TicketPaymentDialog } from './TicketPaymentDialog';
import { ESupportedCurrency } from '@/constants/supportedCurrency';

export type TStatusActionButton = Partial<{
  [key in ETicketStatus]: {
    title: string;
    handler: () => void;
    element?: ReactElement;
    isLoading?: boolean;
  };
}>;

export interface IUserTicketCarouselCardButtons {
  ticket: Ticket;
}

export const UserTicketCarouselCardButtons = ({ ticket }: IUserTicketCarouselCardButtons) => {
  const ticketStatus = ticket.status as ETicketStatus;

  const [ticketDeleteDialog, setTicketDeleteDialog] = useState<boolean>(false);
  const [evaluationListDialog, setEvaluationListDialog] = useState<boolean>(false);

  const [ticketPaymentDialog, setTicketPaymentDialog] = useState<boolean>(false);
  const [ticketPaymentDialogLoading, setTicketPaymentDialogLoading] = useState<boolean>(false);

  const paymentDialogLoadingStart = useCallback(() => setTicketPaymentDialogLoading(true), []);
  const paymentDialogLoadingEnd = useCallback(() => setTicketPaymentDialogLoading(false), []);

  const isEligibleForEdit = [
    ETicketStatus.PRICE_EVALUATION,
    ETicketStatus.PRICE_USER_ACCEPTATION
  ].includes(ticketStatus);

  const { role, userId } = useAppSelector(selectUserData);
  const filters = buildDashboardTicketsQueryFilters(role, userId);
  const { refetch } = useGetTicketsQuery(filters ?? {});

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.PENDING_PAYMENT]: {
      title: 'Opłać',
      handler: () => setTicketPaymentDialog(true),
      isLoading: ticketPaymentDialogLoading
    },
    [ETicketStatus.PRICE_USER_ACCEPTATION]: {
      title: 'Zobacz wyceny',
      handler: () => setEvaluationListDialog(true),
      element: (
        <AmountIcon
          className="top-0 -translate-y-[50%] translate-x-[50%]"
          amount={ticket.evaluations?.length}
        />
      )
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          {isEligibleForEdit ? (
            <Button variant="outline" className="w-full bg-primary-200">
              Edytuj
            </Button>
          ) : null}

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setTicketDeleteDialog(true)}
          >
            Anuluj
          </Button>
        </div>

        {statusActionButton[ticketStatus] ? (
          <Button
            variant="default"
            onClick={statusActionButton[ticketStatus].handler}
            loading={statusActionButton[ticketStatus].isLoading ?? false}
          >
            {statusActionButton[ticketStatus].title}
            {statusActionButton[ticketStatus].element}
          </Button>
        ) : null}
      </div>

      <TicketDeleteDialog
        open={ticketDeleteDialog}
        refetchTickets={refetch}
        closeDialog={() => setTicketDeleteDialog(false)}
        ticketId={ticket._id}
      />

      <TicketPaymentDialog
        open={ticketPaymentDialog}
        closeDialog={() => setTicketPaymentDialog(false)}
        loadingStartHandler={paymentDialogLoadingStart}
        loadingEndHandler={paymentDialogLoadingEnd}
        ticketId={ticket._id}
        amount={ticket.acceptedEvaluation?.price?.value}
        currency={ticket.acceptedEvaluation?.price?.currency as ESupportedCurrency}
      />

      <EvaluationsListDialog
        open={evaluationListDialog}
        refetchTickets={refetch}
        closeDialog={() => setEvaluationListDialog(false)}
        ticketId={ticket._id}
        ticketEvaluations={ticket.evaluations}
      />
    </>
  );
};
