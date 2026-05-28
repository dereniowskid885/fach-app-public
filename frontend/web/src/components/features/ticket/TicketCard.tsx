import Typography from '@/components/ui/Typography';
import { Separator } from '@/components/shadcn/separator';
import { Clock, Layers, MapPin } from 'lucide-react';
import { getFormattedDate, getRelativeTime } from '@/utils/date';
import { Ticket } from '@/services/api/generated/accountApi';
import TicketStatusIcon from './TicketStatusIcon';
import TicketDropdownMenu from './TicketDropdownMenu';
import ContentCard from '@/components/ui/ContentCard';
import UserCard from '../user/UserCard';
import TicketSummaryInfo from './TicketSummaryInfo';
import TicketCardActionButtons from './TicketCardActionButtons';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { EUserRole } from 'shared-types';
import { useTranslations } from 'next-intl';

export interface ITicketCard {
  ticket: Ticket;
  index?: number;
}

export default function TicketCard({ ticket, index }: ITicketCard) {
  const t = useTranslations();
  const { role, userId } = useSelector(selectUserData);

  return (
    <ContentCard index={index}>
      <div className="relative flex cursor-pointer flex-col gap-12">
        <div className="flex items-center gap-4">
          <TicketStatusIcon status={ticket.status} showStatusText={true} />

          <Separator orientation="vertical" className="h-4 bg-tertiary" />

          {role !== EUserRole.SPECIALIST ? (
            <div className="flex items-center gap-2">
              <Layers size={14} strokeWidth={2.5} className="text-tertiary" />

              <Typography variant="note" className="font-bold text-tertiary">
                {ticket.category?.name}
              </Typography>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin size={14} strokeWidth={2.5} className="text-tertiary" />

              <Typography variant="note" className="font-bold text-tertiary">
                {ticket.city}
              </Typography>
            </div>
          )}

          {ticket.updatedAt ? (
            <>
              <Separator orientation="vertical" className="h-4 bg-tertiary" />

              <div className="flex items-center gap-2">
                <Clock size={14} strokeWidth={2.5} className="text-tertiary" />

                <Typography
                  variant="note"
                  className="font-bold text-tertiary"
                  title={getFormattedDate(ticket.updatedAt)}
                >
                  {getRelativeTime(t, ticket.updatedAt)}
                </Typography>
              </div>
            </>
          ) : null}

          <div className="ml-auto">
            <TicketDropdownMenu ticket={ticket} />
          </div>
        </div>

        <TicketSummaryInfo ticket={ticket} />

        <div className="flex items-center justify-between gap-4">
          <TicketCardActionButtons ticket={ticket} role={role} userId={userId} />

          <UserCard
            className="ml-auto"
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
        </div>
      </div>
    </ContentCard>
  );
}
