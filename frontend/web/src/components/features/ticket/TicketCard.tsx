import Typography from '@/components/ui/Typography';
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
    <ContentCard index={index} className="bg-popover">
      <div className="relative flex cursor-pointer flex-col gap-12 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <TicketStatusIcon status={ticket.status} showStatusText={true} />

            {role !== EUserRole.SPECIALIST ? (
              <div className="flex items-center gap-2">
                <Layers size={14} strokeWidth={2.5} />

                <Typography variant="note" className="font-bold">
                  {ticket.category?.name}
                </Typography>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MapPin size={14} strokeWidth={2.5} />

                <Typography variant="note" className="font-bold">
                  {ticket.city}
                </Typography>
              </div>
            )}
          </div>

          {ticket.updatedAt ? (
            <div className="hidden items-center gap-2 md:flex">
              <Clock size={14} strokeWidth={2.5} />

              <Typography
                variant="note"
                className="font-bold"
                title={getFormattedDate(ticket.updatedAt)}
              >
                {getRelativeTime(t, ticket.updatedAt)}
              </Typography>
            </div>
          ) : null}

          <div className="ml-auto">
            <TicketDropdownMenu ticket={ticket} />
          </div>
        </div>

        <TicketSummaryInfo ticket={ticket} />

        <div className="flex items-center justify-between gap-4">
          <TicketCardActionButtons ticket={ticket} role={role} userId={userId} />

          <UserCard
            className="ml-auto p-0"
            titleClass="hidden md:block"
            descriptionClass="hidden md:block"
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
            userNameTextWrap={true}
          />
        </div>
      </div>
    </ContentCard>
  );
}
