import { Evaluation, Ticket } from '@/services/api/generated/accountApi';
import Typography from '@/components/ui/Typography';
import TicketStatusBadge from '@/components/features/ticket/TicketStatusBadge';
import TicketSummaryInfo from '@/components/features/ticket/TicketSummaryInfo';
import { TFunction } from '@/types/i18n';
import { CellContext, HeaderContext } from '@tanstack/react-table';
import { ArrowUpDown, ChartColumn, Layers, MessageSquare } from 'lucide-react';
import { getLocaleDateString } from './date';
import UserCard from '@/components/features/user/UserCard';
import { ETicketStatus, EUserRole } from 'shared-types';
import TicketDropdownMenu from '@/components/features/ticket/TicketDropdownMenu';
import TicketCardActionButtons from '@/components/features/ticket/TicketCardActionButtons';
import { getFormattedPriceAmount, getFormattedResponseTime, getUserFullName } from './shared';
import { Button } from '@/components/shadcn/button';

/**
 * Shared column definition factories for ticket-related data tables.
 * Each function returns a TanStack Table column config.
 */

export const getTicketColumn = (t: TFunction) => ({
  id: 'ticket',
  accessorKey: 'ticket',
  header: t('ticketDataTable.ticketHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original;

    return (
      <TicketSummaryInfo
        ticket={ticket}
        className="h-15 max-w-xs overflow-hidden"
        showStatusIcon={true}
      />
    );
  }
});

export const getStatusColumn = (t: TFunction) => ({
  id: 'status',
  accessorKey: 'status',
  header: t('ticketDataTable.statusHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original;

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
    const ticket = item.row.original;

    return (
      <div className="flex items-center justify-center gap-2">
        <Layers size={14} strokeWidth={2.5} className="text-muted-foreground" />

        <Typography variant="note" className="text-muted-foreground font-bold">
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
    const ticket = item.row.original;

    return (
      <div className="text-center">
        <Typography variant="note" className="text-muted-foreground font-bold">
          {getLocaleDateString(ticket.createdAt, currentLocale)}
        </Typography>
      </div>
    );
  }
});

export const getAssigneeColumn = (t: TFunction) => ({
  id: 'assignee',
  accessorKey: 'assignee',
  header: t('common.assignee'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original;

    return (
      <UserCard
        user={
          ticket.assignee
            ? {
                name: ticket.assignee.name,
                surname: ticket.assignee.surname,
                role: ticket.assignee.role
              }
            : null
        }
        userNameFallback={t('common.unassigned')}
      />
    );
  }
});

export const getConversationColumn = (t: TFunction) => ({
  id: 'conversation',
  accessorKey: 'conversation',
  header: t('ticketDataTable.conversationHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original;

    let ConversationIcon = MessageSquare;
    let conversationAmount = t('ticket.messagesAmount', { count: ticket.commentsCount ?? 0 });

    switch (ticket.status) {
      case ETicketStatus.AWAITING_EVALUATION:
        conversationAmount = t('ticket.evaluationsAmount', {
          count: ticket.evaluationsCount ?? 0
        });
        ConversationIcon = ChartColumn;
        break;
      default:
        conversationAmount = t('ticket.messagesAmount', { count: ticket.commentsCount ?? 0 });
        break;
    }

    return (
      <div className="text-muted-foreground flex items-center justify-center gap-1">
        <ConversationIcon size={14} strokeWidth={2.5} />

        <Typography variant="note" className="font-bold">
          {conversationAmount}
        </Typography>
      </div>
    );
  }
});

export const getActionColumn = (role: EUserRole | string) => ({
  id: 'action',
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original;

    return (
      <div className="text-center">
        <TicketCardActionButtons ticket={ticket} role={role} isTableView={true} />
      </div>
    );
  }
});

export const getDropdownMenuColumn = () => ({
  id: 'dropdownMenu',
  cell: (item: CellContext<Ticket, unknown>) => <TicketDropdownMenu ticket={item.row.original} />
});

export const getCityColumn = (t: TFunction) => ({
  id: 'city',
  accessorKey: 'city',
  header: t('ticketDataTable.cityHeader'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;
    const evaluation = item.row.original as Evaluation;

    const city = ticket.city ?? evaluation.user?.city;

    return (
      <div className="text-center">
        <Typography variant="note" className="text-muted-foreground font-bold">
          {city}
        </Typography>
      </div>
    );
  }
});

export const getCreatedByColumn = (t: TFunction) => ({
  id: 'createdBy',
  accessorKey: 'createdBy',
  header: t('common.createdBy'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const ticket = item.row.original as Ticket;

    return (
      <div className="flex items-center justify-center">
        <UserCard
          user={{
            name: ticket.createdBy?.name,
            surname: ticket.createdBy?.surname,
            role: ticket.createdBy?.role
          }}
        />
      </div>
    );
  }
});

/**
 * Evaluation type data columns
 **/

export const getSpecialistColumn = (t: TFunction) => ({
  id: 'specialist',
  accessorKey: 'specialist',
  header: t('userRole.specialist'),
  cell: (item: CellContext<Evaluation, unknown>) => {
    const evaluation = item.row.original;

    return (
      <div className="flex flex-col items-center gap-1">
        <Typography variant="note" className="font-bold text-nowrap">
          {getUserFullName(evaluation.user, t('common.unknownUser'))}
        </Typography>

        <Typography variant="note" className="text-muted-foreground font-semibold">
          {evaluation.user?.email}
        </Typography>
      </div>
    );
  }
});

export const getResponseTimeColumn = (t: TFunction) => ({
  id: 'responseTime',
  accessorFn: (row: Evaluation) => row.minutes,
  header: (item: HeaderContext<Evaluation, unknown>) => {
    const column = item.column;

    return (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {t('evaluation.responseTime')}

        <ArrowUpDown className="h-4 w-4" />
      </Button>
    );
  },
  cell: (item: CellContext<Evaluation, unknown>) => {
    const evaluation = item.row.original;

    return (
      <div className="text-center">
        <Typography variant="note" className="text-muted-foreground font-bold">
          {getFormattedResponseTime(evaluation.minutes, t)}
        </Typography>
      </div>
    );
  }
});

export const getDateOfResponseColumn = (t: TFunction, currentLocale: string) => ({
  id: 'dateOfResponse',
  accessorKey: 'dateOfResponse',
  header: t('evaluation.dateOfResponse'),
  cell: (item: CellContext<Ticket, unknown>) => {
    const evaluation = item.row.original as Evaluation;

    return (
      <div className="text-center">
        <Typography variant="note" className="text-muted-foreground font-bold">
          {getLocaleDateString(evaluation.dateOfResponse, currentLocale)}
        </Typography>
      </div>
    );
  }
});

export const getPriceColumn = (t: TFunction) => ({
  id: 'price',
  accessorFn: (row: Evaluation) => row.price?.amountInCents,
  header: (item: HeaderContext<Evaluation, unknown>) => {
    const column = item.column;

    return (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {t('evaluation.price')}

        <ArrowUpDown className="h-4 w-4" />
      </Button>
    );
  },
  cell: (item: CellContext<Evaluation, unknown>) => {
    const evaluation = item.row.original;

    return (
      <div className="text-center">
        <Typography variant="note" className="text-muted-foreground font-bold">
          {getFormattedPriceAmount(evaluation.price?.amountInCents, evaluation.price?.currency)}
        </Typography>
      </div>
    );
  }
});
