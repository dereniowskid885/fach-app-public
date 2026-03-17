import { useLocale, useTranslations } from 'next-intl';
import { DataTable } from '../common/DataTable';
import { Ticket } from '@/api/accountApi';
import Typography from '../common/Typography';
import TicketStatusBadge from './TicketStatusBadge';
import { getLocaleDateString } from '@/lib/dateUtils';
import UserCard from './UserCard';
import { ETicketStatus, EUserRole } from '@shared/constants/enums';
import TicketUserActionButtons from './TicketUserActionButtons';
import TicketDropdownMenu from './TicketDropdownMenu';
import { ChartColumn, Clock, MessageSquare, Layers } from 'lucide-react';
import TicketSummaryInfo from './TicketSummaryInfo';
import { TicketSpecialistActionButtons } from './TicketSpecialistActionButtons';

export interface IDataTableMyTicketsPage {
  tableData: Ticket[];
  role: EUserRole;
}

export default function DataTableMyTicketsPage({ tableData, role }: IDataTableMyTicketsPage) {
  const t = useTranslations();
  const currentLocale = useLocale();

  return (
    <DataTable
      data={tableData}
      columns={[
        {
          id: 'ticket',
          accessorKey: 'ticket',
          header: t('ticketDataTable.ticketHeader'),
          cell: item => {
            const ticket = item.row.original as Ticket;

            return <TicketSummaryInfo ticket={ticket} className="max-w-xs" showStatusIcon={true} />;
          }
        },
        {
          id: 'status',
          accessorKey: 'status',
          header: t('ticketDataTable.statusHeader'),
          cell: item => {
            const ticket = item.row.original as Ticket;

            return (
              <div className="flex items-center justify-center">
                <TicketStatusBadge status={ticket.status} />
              </div>
            );
          }
        },
        {
          id: 'category',
          accessorKey: 'category',
          header: t('ticketDataTable.categoryHeader'),
          cell: item => {
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
        },
        {
          id: 'createdAt',
          accessorKey: 'createdAt',
          header: t('ticketDataTable.createdAtHeader'),
          cell: item => {
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
        },
        {
          id: 'assignee',
          accessorKey: 'assignee',
          header: t('ticketDataTable.assigneeHeader'),
          cell: item => {
            const ticket = item.row.original as Ticket;

            return <UserCard user={ticket.assignee} />;
          }
        },
        {
          id: 'conversation',
          accessorKey: 'conversation',
          header: t('ticketDataTable.conversationHeader'),
          cell: item => {
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
        },
        {
          id: 'action',
          cell: item => {
            const ticket = item.row.original as Ticket;

            switch (role) {
              case EUserRole.SPECIALIST:
                return <TicketSpecialistActionButtons ticket={ticket} />;
              case EUserRole.USER:
                return <TicketUserActionButtons ticket={ticket} />;
            }
          }
        },
        {
          id: 'dropdownMenu',
          cell: item => <TicketDropdownMenu ticket={item.row.original as Ticket} />
        }
      ]}
    />
  );
}
