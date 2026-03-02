import { MoreVertical, PencilIcon, TrashIcon } from 'lucide-react';
import { Button } from '../shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../shadcn/dropdown-menu';
import { Ticket } from '@/api/accountApi';
import { useTranslations } from 'next-intl';
import { ETicketStatus } from '@shared/constants/enums';
import { TicketDeleteDialog } from './TicketDeleteDialog';
import { useState } from 'react';

export interface IDashboardTicketDropdownMenu {
  ticket: Ticket;
}

export default function DashboardTicketDropdownMenu({ ticket }: IDashboardTicketDropdownMenu) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();

  const [ticketDeleteDialog, setTicketDeleteDialog] = useState<boolean>(false);

  const isEligibleForEdit = [
    ETicketStatus.PRICE_EVALUATION,
    ETicketStatus.PRICE_USER_ACCEPTATION
  ].includes(ticketStatus);

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
          <DropdownMenuItem className="cursor-pointer" disabled={!isEligibleForEdit}>
            <PencilIcon size={16} />

            {t('common.edit')}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onSelect={() => setTicketDeleteDialog(true)}>
            <div className="flex w-full items-center gap-2 text-destructive">
              <TrashIcon size={16} />

              {t('common.cancel')}
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <TicketDeleteDialog
        open={ticketDeleteDialog}
        closeDialog={() => setTicketDeleteDialog(false)}
        ticketId={ticket._id}
      />
    </DropdownMenu>
  ) : null;
}
