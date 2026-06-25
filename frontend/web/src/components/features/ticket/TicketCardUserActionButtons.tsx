import { useCallback, useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Ticket } from '@/services/api/generated/accountApi';
import { ETicketStatus } from 'shared-types';
import AmountIcon from '@/components/ui/AmountIcon';
import TicketUserEvaluationsListDialog from './TicketUserEvaluationsListDialog';
import TicketUserPaymentDialog from './TicketUserPaymentDialog';
import { useTranslations } from 'next-intl';
import { TStatusActionButton } from '@/types/ticket';
import { Spinner } from '@/components/shadcn/spinner';
import { useTicketDetailsDialogContext } from '@/contexts/TicketDetailsDialogContext';

export interface ITicketCardUserActionButtons {
  ticket: Ticket;
  hideDetailsButton?: boolean;
}

export default function TicketCardUserActionButtons({
  ticket,
  hideDetailsButton = false
}: ITicketCardUserActionButtons) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();
  const { openTicketDetailsDialog } = useTicketDetailsDialogContext();

  const [evaluationListDialog, setEvaluationListDialog] = useState<boolean>(false);
  const [ticketPaymentDialog, setTicketPaymentDialog] = useState<boolean>(false);
  const [ticketPaymentDialogLoading, setTicketPaymentDialogLoading] = useState<boolean>(false);

  const paymentDialogLoadingStart = useCallback(() => setTicketPaymentDialogLoading(true), []);
  const paymentDialogLoadingEnd = useCallback(() => setTicketPaymentDialogLoading(false), []);

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.IN_PROGRESS]: {
      title: t('ticketUserActionButtons.addComment'),
      handler: () => openTicketDetailsDialog(ticket._id, { scrollToInput: true })
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
        <div className="mt-px pr-4">
          <AmountIcon
            className="top-0 translate-x-[50%] translate-y-[-50%]"
            amount={ticket.evaluationsCount ?? 0}
            showZeroAmount={true}
          />
        </div>
      )
    },
    [ETicketStatus.SOLUTION_REVIEW]: {
      title: t('ticketUserActionButtons.checkSolution'),
      handler: () => openTicketDetailsDialog(ticket._id)
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {!hideDetailsButton ? (
          <Button onClick={() => openTicketDetailsDialog(ticket._id)}>
            {t('common.showDetails')}
          </Button>
        ) : null}

        {statusActionButton[ticketStatus] ? (
          <Button
            className={statusActionButton[ticketStatus].isLoading !== undefined ? 'min-w-30' : ''}
            onClick={statusActionButton[ticketStatus].handler}
          >
            {statusActionButton[ticketStatus].isLoading ? <Spinner /> : null}
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
        currency={ticket.acceptedEvaluation?.price?.currency}
      />

      <TicketUserEvaluationsListDialog
        open={evaluationListDialog}
        closeDialog={() => setEvaluationListDialog(false)}
        ticketId={ticket._id}
      />
    </>
  );
}
