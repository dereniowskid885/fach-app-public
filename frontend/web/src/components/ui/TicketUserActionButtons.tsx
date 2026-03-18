import { useCallback, useState } from 'react';
import { Button } from '../shadcn/button';
import { accountApi, Ticket } from '@/api/accountApi';
import { ETicketStatus } from '@shared/enums/ticket';
import AmountIcon from './AmountIcon';
import TicketUserEvaluationsListDialog from './TicketUserEvaluationsListDialog';
import TicketUserPaymentDialog from './TicketUserPaymentDialog';
import { ESupportedCurrency } from '@shared/enums/currency';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useTranslations } from 'next-intl';
import { TStatusActionButton } from '@/types/ticket';

export interface ITicketUserActionButtons {
  ticket: Ticket;
}

export default function TicketUserActionButtons({ ticket }: ITicketUserActionButtons) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();

  const [evaluationListDialog, setEvaluationListDialog] = useState<boolean>(false);

  const [ticketPaymentDialog, setTicketPaymentDialog] = useState<boolean>(false);
  const [ticketPaymentDialogLoading, setTicketPaymentDialogLoading] = useState<boolean>(false);

  const paymentDialogLoadingStart = useCallback(() => setTicketPaymentDialogLoading(true), []);
  const paymentDialogLoadingEnd = useCallback(() => setTicketPaymentDialogLoading(false), []);

  const [triggerTicketsRefetch, { error }] = accountApi.endpoints.getTicketsMy.useLazyQuery({});

  useErrorHandler(error);

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.AWAITING_PAYMENT]: {
      title: t('ticketUserActionButtons.pay'),
      handler: () => setTicketPaymentDialog(true),
      isLoading: ticketPaymentDialogLoading
    },
    [ETicketStatus.AWAITING_EVALUATION]: {
      title: t('ticketUserActionButtons.showEvaluations'),
      handler: () => setEvaluationListDialog(true),
      element: (
        <div className="mt-[1px] pr-4">
          <AmountIcon
            className="top-0 -translate-y-[50%] translate-x-[50%]"
            amount={ticket.evaluations?.length ?? 0}
            showZeroAmount={true}
          />
        </div>
      )
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {statusActionButton[ticketStatus] ? (
          <Button
            variant="outline"
            onClick={statusActionButton[ticketStatus].handler}
            loading={statusActionButton[ticketStatus].isLoading ?? false}
          >
            {statusActionButton[ticketStatus].title}
            {statusActionButton[ticketStatus].element}
          </Button>
        ) : null}
      </div>

      <TicketUserPaymentDialog
        open={ticketPaymentDialog}
        closeDialog={() => setTicketPaymentDialog(false)}
        loadingStartHandler={paymentDialogLoadingStart}
        loadingEndHandler={paymentDialogLoadingEnd}
        ticketId={ticket._id}
        amount={ticket.acceptedEvaluation?.price?.amountInCents}
        currency={ticket.acceptedEvaluation?.price?.currency as ESupportedCurrency}
      />

      <TicketUserEvaluationsListDialog
        open={evaluationListDialog}
        refetchTickets={() => triggerTicketsRefetch({})}
        closeDialog={() => setEvaluationListDialog(false)}
        ticketId={ticket._id}
        ticketEvaluations={ticket.evaluations}
      />
    </>
  );
}
