import { useCallback, useState } from 'react';
import { Button } from '../shadcn/button';
import { Ticket } from '@/services/api/generated/accountApi';
import { ETicketStatus } from 'shared-types';
import AmountIcon from './AmountIcon';
import TicketUserEvaluationsListDialog from './TicketUserEvaluationsListDialog';
import TicketUserPaymentDialog from './TicketUserPaymentDialog';
import { useTranslations } from 'next-intl';
import { TStatusActionButton } from '@/types/ticket';
import TicketDetailsDialog from './TicketDetailsDialog';

export interface ITicketUserActionButtons {
  ticket: Ticket;
}

export default function TicketUserActionButtons({ ticket }: ITicketUserActionButtons) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();

  const [evaluationListDialog, setEvaluationListDialog] = useState<boolean>(false);
  const [ticketPaymentDialog, setTicketPaymentDialog] = useState<boolean>(false);
  const [ticketPaymentDialogLoading, setTicketPaymentDialogLoading] = useState<boolean>(false);
  const [ticketDetailsDialog, setTicketDetailsDialog] = useState<boolean>(false);

  const paymentDialogLoadingStart = useCallback(() => setTicketPaymentDialogLoading(true), []);
  const paymentDialogLoadingEnd = useCallback(() => setTicketPaymentDialogLoading(false), []);

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.IN_PROGRESS]: {
      title: t('ticketUserActionButtons.addComment'),
      handler: () => setTicketDetailsDialog(true)
    },
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
      {statusActionButton[ticketStatus] ? (
        <Button
          variant="outline"
          className={
            statusActionButton[ticketStatus].isLoading !== undefined ? 'min-w-[120px]' : ''
          }
          onClick={statusActionButton[ticketStatus].handler}
          loading={statusActionButton[ticketStatus].isLoading ?? false}
        >
          {statusActionButton[ticketStatus].title}
          {statusActionButton[ticketStatus].element}
        </Button>
      ) : null}

      <TicketUserPaymentDialog
        open={ticketPaymentDialog}
        closeDialog={() => setTicketPaymentDialog(false)}
        loadingStartHandler={paymentDialogLoadingStart}
        loadingEndHandler={paymentDialogLoadingEnd}
        ticketId={ticket._id}
        amount={ticket.acceptedEvaluation?.price?.amountInCents}
        currency={ticket.acceptedEvaluation?.price?.currency}
      />

      <TicketUserEvaluationsListDialog
        open={evaluationListDialog}
        closeDialog={() => setEvaluationListDialog(false)}
        ticketId={ticket._id}
        ticketEvaluations={ticket.evaluations}
      />

      <TicketDetailsDialog
        open={ticketDetailsDialog}
        ticket={ticket}
        closeDialog={() => setTicketDetailsDialog(false)}
        scrollToInput={true}
      />
    </>
  );
}
