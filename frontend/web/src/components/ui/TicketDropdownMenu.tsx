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
import { Ticket } from '@/api/accountApi';
import { useTranslations } from 'next-intl';
import { ETicketStatus } from '@shared/constants/enums';
import { TicketDeleteDialog } from './TicketDeleteDialog';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketFormDialog from './TicketFormDialog';
import { EActionType } from '@/constants/enums';

export interface ITicketDropdownMenu {
  ticket: Ticket;
}

export default function TicketDropdownMenu({ ticket }: ITicketDropdownMenu) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();
  const { userId } = useSelector(selectUserData);
  const isTicketOwner = ticket.createdBy?._id === userId;
  const isEligibleForEdit = ticketStatus === ETicketStatus.AWAITING_EVALUATION;

  const [ticketDeleteDialog, setTicketDeleteDialog] = useState<boolean>(false);
  const [ticketEditDialog, setTicketEditDialog] = useState<boolean>(false);

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
          <DropdownMenuItem className="cursor-pointer" onSelect={() => null}>
            <Info size={16} />

            {t('ticketDropdownMenu.showDetails')}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {isTicketOwner ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTicketEditDialog(true)}
              disabled={!isEligibleForEdit}
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
              onSelect={() => setTicketDeleteDialog(true)}
            >
              <div className="flex w-full items-center gap-2 text-destructive">
                <TrashIcon size={16} />

                {t('common.cancel')}
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}
      </DropdownMenuContent>

      <TicketDeleteDialog
        open={ticketDeleteDialog}
        closeDialog={() => setTicketDeleteDialog(false)}
        ticketId={ticket._id}
      />

      <TicketFormDialog
        open={ticketEditDialog}
        closeDialog={() => setTicketEditDialog(false)}
        currentTicketData={ticket}
        mode={EActionType.EDIT}
      />
    </DropdownMenu>
  ) : null;
}
