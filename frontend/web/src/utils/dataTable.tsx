import { Ticket } from '@/api/accountApi';
import Typography from '@/components/common/Typography';
import TicketStatusBadge from '@/components/ui/TicketStatusBadge';
import TicketSummaryInfo from '@/components/ui/TicketSummaryInfo';
import { TFunction } from '@/types/i18n';
import { CellContext } from '@tanstack/react-table';
import { ChartColumn, Clock, Layers, MessageSquare } from 'lucide-react';
import { getLocaleDateString } from './date';
import UserCard from '@/components/ui/UserCard';
import { ETicketStatus } from '@shared/enums/ticket';
import { EUserRole } from '@shared/enums/role';
import { TicketSpecialistActionButtons } from '@/components/ui/TicketSpecialistActionButtons';
import TicketUserActionButtons from '@/components/ui/TicketUserActionButtons';
import TicketDropdownMenu from '@/components/ui/TicketDropdownMenu';

/**
 * Shared column definition factories for ticket-related data tables.
 * Each function returns a TanStack Table column config.
 */

export const getTicketColumn = (t: TFunction) => ({
  id: 'ticket',
  accessorKey: 'ticket',
  header: t('ticketDataTable.ticketHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    return <TicketSummaryInfo ticket={ticket} className="max-w-xs" showStatusIcon={true} />;
  }
});

export const getStatusColumn = (t: TFunction) => ({
  id: 'status',
  accessorKey: 'status',
  header: t('ticketDataTable.statusHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    return (
      <div className="flex items-center justify-center">
        <TicketStatusBadge status={ticket.status} />
      </div>
    );
  }
});

export const getCategoryColumn = (t: TFunction) => ({
  id: 'category',
  accessorKey: 'category',
  header: t('ticketDataTable.categoryHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    return (
      <div className="flex items-center gap-2">
        <Layers size={18} strokeWidth={2.5} className="text-muted-foreground" />

        <Typography variant="note" className="font-bold uppercase text-muted-foreground">
          {ticket.category?.name}
        </Typography>
      </div>
    );
  }
});

export const getCreatedAtColumn = (t: TFunction, currentLocale: string) => ({
  id: 'createdAt',
  accessorKey: 'createdAt',
  header: t('ticketDataTable.createdAtHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    return (
      <div className="flex items-center justify-center gap-2 text-center">
        <Clock size={18} strokeWidth={2.5} className="text-muted-foreground" />

        <Typography
          variant="note"
          className="font-bold uppercase tracking-tighter text-muted-foreground"
        >
          {getLocaleDateString(ticket.createdAt, currentLocale)}
        </Typography>
      </div>
    );
  }
});

export const getAssigneeColumn = (t: TFunction) => ({
  id: 'assignee',
  accessorKey: 'assignee',
  header: t('ticketDataTable.assigneeHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    return <UserCard user={ticket.assignee} />;
  }
});

export const getConversationColumn = (t: TFunction) => ({
  id: 'conversation',
  accessorKey: 'conversation',
  header: t('ticketDataTable.conversationHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    let ConversationIcon = MessageSquare;
    let conversationAmount = t('ticket.messagesAmount', { count: 0 });

    switch (ticket.status) {
      case ETicketStatus.AWAITING_EVALUATION:
        conversationAmount = t('ticket.evaluationsAmount', {
          count: ticket.evaluations?.length ?? 0
        });
        ConversationIcon = ChartColumn;
        break;
      default:
        conversationAmount = t('ticket.messagesAmount', { count: 5 });
        break;
    }

    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        {<ConversationIcon size={18} strokeWidth={2.5} />}

        <Typography variant="note" className="font-bold">
          {conversationAmount}
        </Typography>
      </div>
    );
  }
});

export const getActionColumn = (role: EUserRole, userId?: string) => ({
  id: 'action',
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    switch (role) {
      case EUserRole.SPECIALIST: {
        const currentUserEvaluation = ticket.evaluations?.find(
          evaluation => evaluation.user?._id === userId
        );

        return (
          <TicketSpecialistActionButtons
            ticket={ticket}
            currentUserEvaluation={currentUserEvaluation}
          />
        );
      }

      case EUserRole.USER:
        return <TicketUserActionButtons ticket={ticket} />;
    }
  }
});

export const getDropdownMenuColumn = () => ({
  id: 'dropdownMenu',
  cell: (item: CellContext<Ticket, unknown>) => (
    <TicketDropdownMenu ticket={item.row.original as Ticket} />
  )
});

export const getCityColumn = (t: TFunction) => ({
  id: 'city',
  accessorKey: 'city',
  header: t('ticketDataTable.cityHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    return (
      <Typography variant="note" className="font-bold text-muted-foreground">
        {ticket.city}
      </Typography>
    );
  }
});

export const getCreatedByColumn = (t: TFunction) => ({
  id: 'createdBy',
  accessorKey: 'createdBy',
  header: t('ticketDataTable.createdByHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    return <UserCard user={ticket.createdBy} />;
  }
});
