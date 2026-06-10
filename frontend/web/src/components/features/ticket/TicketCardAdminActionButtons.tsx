import { useState } from 'react';
import TicketDetailsDialog from './TicketDetailsDialog';
import { Ticket } from '@/services/api/generated/accountApi';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/shadcn/button';
import { ETicketStatus } from 'shared-types';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketAdminStatusChangeDialog from './TicketAdminStatusChangeDialog';

export interface ITicketCardAdminActionButtons {
  ticket: Ticket;
}

export default function TicketCardAdminActionButtons({ ticket }: ITicketCardAdminActionButtons) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();
  const { userId } = useSelector(selectUserData);

  const [ticketStatusChangeDialog, setTicketStatusChangeDialog] = useState<boolean>(false);
  const [ticketDetailsDialog, setTicketDetailsDialog] = useState<boolean>(false);

  const isCurrentUserAssigned = ticket.assignee?._id === userId;
  const isStatusChangeAvailable =
    isCurrentUserAssigned &&
    ![ETicketStatus.CANCELED, ETicketStatus.COMPLETED].includes(ticketStatus);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setTicketDetailsDialog(true)}>{t('common.showDetails')}</Button>

        {isStatusChangeAvailable ? (
          <Button variant="destructive" onClick={() => setTicketStatusChangeDialog(true)}>
            {t('ticketDetailsAdminActionButtons.changeStatus')}
          </Button>
        ) : null}
      </div>

      <TicketAdminStatusChangeDialog
        open={ticketStatusChangeDialog}
        closeDialog={() => setTicketStatusChangeDialog(false)}
        ticket={ticket}
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
