import TicketDropdownMenu from './TicketDropdownMenu';
import { TicketSpecialistActionButtons } from './TicketSpecialistActionButtons';
import Typography from '../common/Typography';
import { ETicketStatus } from '@shared/constants/enums';
import UserCard from './UserCard';
import { getLocaleDateString } from '@/lib/dateUtils';
import { DataTable } from '../common/DataTable';
import { Ticket } from '@/api/accountApi';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, MessageSquare, ChartColumn } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketSummaryInfo from './TicketSummaryInfo';

export interface IDataTableSpecialistAvailableTicketsPage {
  tableData: Ticket[];
}

export default function DataTableSpecialistAvailableTicketsPage({
  tableData
}: IDataTableSpecialistAvailableTicketsPage) {
  const t = useTranslations();
  const currentLocale = useLocale();
  const { userId } = useSelector(selectUserData);

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
          id: 'city',
          accessorKey: 'city',
          header: t('ticketDataTable.cityHeader'),
          cell: item => {
            const ticket = item.row.original as Ticket;

            return (
              <Typography variant="note" className="font-bold text-muted-foreground">
                {ticket.city}
              </Typography>
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
              <div className="flex items-center gap-2">
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
          id: 'createdBy',
          accessorKey: 'createdBy',
          header: t('ticketDataTable.createdByHeader'),
          cell: item => {
            const ticket = item.row.original as Ticket;

            return <UserCard user={ticket.createdBy} />;
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
        },
        {
          id: 'dropdownMenu',
          cell: item => <TicketDropdownMenu ticket={item.row.original as Ticket} />
        }
      ]}
    />
  );
}
