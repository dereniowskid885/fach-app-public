import Typography from '../common/Typography';
import { Separator } from '../shadcn/separator';
import { Clock, Layers, MapPin } from 'lucide-react';
import { getLocaleDateString } from '@/utils/date';
import { Ticket } from '@/api/accountApi';
import TicketStatusIcon from './TicketStatusIcon';
import { useLocale } from 'next-intl';
import DashboardTicketDropdownMenu from './TicketDropdownMenu';
import ContentCard from '../common/ContentCard';
import UserCard from './UserCard';
import TicketSummaryInfo from './TicketSummaryInfo';
import TicketActionButtons from './TicketActionButtons';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { EUserRole } from '@shared/enums/role';

export interface IDashboardTicketCard {
  ticket: Ticket;
  index?: number;
}

export default function DashboardTicketCard({ ticket, index }: IDashboardTicketCard) {
  const currentLocale = useLocale();
  const { role, userId } = useSelector(selectUserData);

  return (
    <ContentCard index={index}>
      <div className="group relative flex cursor-pointer flex-col gap-12">
        <div className="flex items-center gap-4">
          <TicketStatusIcon status={ticket.status} showStatusText={true} />

          <Separator orientation="vertical" className="h-4 bg-tertiary" />

          {role !== EUserRole.SPECIALIST ? (
            <div className="flex items-center gap-2">
              <Layers size={14} strokeWidth={2.5} className="text-tertiary" />

              <Typography variant="note" className="font-bold uppercase text-tertiary">
                {ticket.category?.name}
              </Typography>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin size={14} strokeWidth={2.5} className="text-tertiary" />

              <Typography variant="note" className="font-bold uppercase text-tertiary">
                {ticket.city}
              </Typography>
            </div>
          )}

          {ticket.updatedAt ? (
            <>
              <Separator orientation="vertical" className="h-4 bg-tertiary" />

              <div className="flex items-center gap-2">
                <Clock size={14} strokeWidth={2.5} className="text-tertiary" />

                <Typography variant="note" className="font-bold uppercase text-tertiary">
                  {getLocaleDateString(ticket.updatedAt, currentLocale)}
                </Typography>
              </div>
            </>
          ) : null}

          <div className="ml-auto">
            <DashboardTicketDropdownMenu ticket={ticket} />
          </div>
        </div>

        <TicketSummaryInfo ticket={ticket} />

        <div className="flex items-center justify-between gap-4">
          <TicketActionButtons ticket={ticket} role={role as EUserRole} userId={userId} />

          <UserCard
            user={{
              name: ticket.assignee?.name,
              surname: ticket.assignee?.surname,
              role: ticket.assignee?.role
            }}
          />
        </div>
      </div>
    </ContentCard>
  );
}
