'use client';

import { Button } from '../shadcn/button';
import { Ticket } from '@/services/api/generated/accountApi';
import { useState } from 'react';
import TicketAdminStatusChangeDialog from './TicketAdminStatusChangeDialog';
import { useTranslations } from 'next-intl';
import { ETicketStatus } from 'shared-types';
import { TStatusActionButton } from '@/types/ticket';
import TicketAdminAssignmentDialog from './TicketAdminAssignmentDialog';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';

export interface ITicketDetailsAdminConfirmButtons {
  ticket: Ticket;
}

export const TicketDetailsAdminConfirmButtons = ({ ticket }: ITicketDetailsAdminConfirmButtons) => {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();
  const { userId } = useSelector(selectUserData);

  const [ticketStatusChangeDialog, setTicketStatusChangeDialog] = useState<boolean>(false);
  const [ticketAssignmentDialog, setTicketAssignmentDialog] = useState<boolean>(false);

  const isCurrentUserAssigned = ticket.assignee?._id === userId;
  const isStatusChangeAvailable =
    isCurrentUserAssigned &&
    ![ETicketStatus.CANCELED, ETicketStatus.COMPLETED].includes(ticketStatus);

  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.MODERATOR_INVESTIGATION]: !isCurrentUserAssigned
      ? {
          title: t('ticketDetailsAdminConfirmButtons.assigneeChange'),
          handler: () => setTicketAssignmentDialog(true)
        }
      : undefined
  };

  return (
    <>
      {statusActionButton[ticketStatus] ? (
        <Button
          variant="default"
          className={
            statusActionButton[ticketStatus].isLoading !== undefined ? 'min-w-[120px]' : ''
          }
          onClick={statusActionButton[ticketStatus].handler}
          disabled={statusActionButton[ticketStatus].isDisabled}
        >
          {statusActionButton[ticketStatus].title}
          {statusActionButton[ticketStatus].element}
        </Button>
      ) : null}

      {isStatusChangeAvailable ? (
        <Button variant="special-1" onClick={() => setTicketStatusChangeDialog(true)}>
          {t('ticketDetailsAdminConfirmButtons.changeStatus')}
        </Button>
      ) : null}

      <TicketAdminStatusChangeDialog
        open={ticketStatusChangeDialog}
        closeDialog={() => setTicketStatusChangeDialog(false)}
        ticket={ticket}
      />

      <TicketAdminAssignmentDialog
        open={ticketAssignmentDialog}
        closeDialog={() => setTicketAssignmentDialog(false)}
        ticket={ticket}
        userId={userId}
      />
    </>
  );
};
