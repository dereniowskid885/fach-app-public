'use client';

import { MoreVertical, PencilIcon, TrashIcon, Info } from 'lucide-react';
import { Button } from '../shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../shadcn/dropdown-menu';
import { Ticket } from '@/services/api/generated/accountApi';
import { useTranslations } from 'next-intl';
import { ETicketStatus, isAdmin } from 'shared-types';
import { TicketDeleteDialog } from './TicketDeleteDialog';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketFormDialog from './TicketFormDialog';
import { EActionType } from '@/enums/ui';
import { TicketCancelDialog } from './TicketCancelDialog';
import TicketDetailsDialog from './TicketDetailsDialog';

export interface ITicketDropdownMenu {
  ticket: Ticket;
}

export default function TicketDropdownMenu({ ticket }: ITicketDropdownMenu) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();
  const { userId, role } = useSelector(selectUserData);

  const isTicketOwner = ticket.createdBy?._id === userId;
  const isEligibleForModification =
    isAdmin(role) || ticketStatus === ETicketStatus.AWAITING_EVALUATION;

  const [ticketDeleteDialog, setTicketDeleteDialog] = useState<boolean>(false);
  const [ticketCancelDialog, setTicketCancelDialog] = useState<boolean>(false);
  const [ticketEditDialog, setTicketEditDialog] = useState<boolean>(false);
  const [ticketDetailsDialog, setTicketDetailsDialog] = useState<boolean>(false);

  return ticket._id ? (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="animation-base animation-idle animation-interactive h-8 w-8 rounded-lg"
        >
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setTicketDetailsDialog(true)}
          >
            <Info size={16} />

            {t('ticketDropdownMenu.showDetails')}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {isAdmin(role) || isTicketOwner ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTicketEditDialog(true)}
              disabled={!isEligibleForModification}
            >
              <PencilIcon size={16} />

              {t('common.edit')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}

        {isTicketOwner ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTicketCancelDialog(true)}
              disabled={!isEligibleForModification}
            >
              <div className="flex w-full items-center gap-2 text-destructive">
                <TrashIcon size={16} />

                {t('common.cancel')}
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}

        {isAdmin(role) ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTicketDeleteDialog(true)}
            >
              <div className="flex w-full items-center gap-2 text-destructive">
                <TrashIcon size={16} />

                {t('common.delete')}
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}
      </DropdownMenuContent>

      {isAdmin(role) ? (
        <TicketDeleteDialog
          open={ticketDeleteDialog}
          closeDialog={() => setTicketDeleteDialog(false)}
          ticketId={ticket._id}
        />
      ) : null}

      {isTicketOwner ? (
        <TicketCancelDialog
          open={ticketCancelDialog}
          closeDialog={() => setTicketCancelDialog(false)}
          ticketId={ticket._id}
        />
      ) : null}

      {isAdmin(role) || isTicketOwner ? (
        <TicketFormDialog
          open={ticketEditDialog}
          closeDialog={() => setTicketEditDialog(false)}
          currentTicketData={ticket}
          mode={EActionType.EDIT}
        />
      ) : null}

      <TicketDetailsDialog
        open={ticketDetailsDialog}
        ticket={ticket}
        closeDialog={() => setTicketDetailsDialog(false)}
      />
    </DropdownMenu>
  ) : null;
}
