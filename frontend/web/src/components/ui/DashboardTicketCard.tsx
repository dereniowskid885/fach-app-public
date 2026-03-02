import { motion } from 'framer-motion';
import { TbCategory } from 'react-icons/tb';
import { Typography } from '../common/Typography';
import { Separator } from '../shadcn/separator';
import { Clock } from 'lucide-react';
import { getLocaleDateString } from '@/lib/dateUtils';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar';
import { getUserFullName } from '@/lib/utils';
import { Ticket } from '@/api/accountApi';
import TicketStatusIcon from './TicketStatusIcon';
import { useTranslations } from 'next-intl';
import { UserTicketCarouselCardButtons } from './UserTicketCarouselCardButtons';
import DashboardTicketDropdownMenu from './DashboardTicketDropdownMenu';

export interface IDashboardTicketCard {
  transitionDelay?: number;
  ticket: Ticket;
}

export default function DashboardTicketCard({ ticket, transitionDelay }: IDashboardTicketCard) {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: transitionDelay }}
      key={ticket._id}
      className="group relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <TicketStatusIcon status={ticket.status} showStatusText={true} />

        <Separator orientation="vertical" className="h-4 bg-tertiary" />

        <div className="flex items-center gap-2">
          <TbCategory size={12} className="text-tertiary" />

          <Typography
            variant="note"
            className="font-mono font-bold uppercase tracking-widest text-tertiary"
          >
            {ticket.category?.name}
          </Typography>
        </div>

        {ticket.updatedAt ? (
          <>
            <Separator orientation="vertical" className="h-4 bg-tertiary" />

            <div className="flex items-center gap-2">
              <Clock size={12} className="text-tertiary" />

              <Typography
                variant="note"
                className="font-bold uppercase tracking-tighter text-tertiary"
              >
                {getLocaleDateString(ticket.updatedAt)}
              </Typography>
            </div>
          </>
        ) : null}

        <div className="ml-auto">
          <DashboardTicketDropdownMenu ticket={ticket} />
        </div>
      </div>

      <div className="mt-1 space-y-0.5">
        <Typography variant="muted" className="line-clamp-1 font-semibold text-primary">
          {ticket.title}
        </Typography>

        <Typography variant="small" className="line-clamp-2 text-muted-foreground">
          {ticket.description}
        </Typography>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <UserTicketCarouselCardButtons ticket={ticket} />

        <div className="mr-3 flex items-center gap-2 rounded-xl">
          <div className="h-8 w-8 overflow-hidden rounded-full border">
            <Avatar className="h-full w-full">
              <AvatarImage src="https://github.com/shadcn.png" className="object-cover" />
              <AvatarFallback>{t('common.avatar')}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col gap-0.5">
            <Typography variant="note" className="font-bold text-primary">
              {getUserFullName(ticket.assignee, t('common.unassigned'))}
            </Typography>

            <Typography variant="note" className="text-muted-foreground">
              {t(`userRole.${ticket.assignee?.role}`)}
            </Typography>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
