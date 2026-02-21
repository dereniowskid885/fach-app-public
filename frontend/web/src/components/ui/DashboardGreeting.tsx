import { useTranslations } from 'next-intl';
import { Typography } from '../common/Typography';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { Skeleton } from '../shadcn/skeleton';
import TicketCreateButton from './TicketCreateButton';

export default function DashboardGreeting() {
  const t = useTranslations();
  const { name } = useSelector(selectUserData);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('timeOfDay.morning');
    if (hour < 18) return t('timeOfDay.afternoon');
    return t('timeOfDay.evening');
  };

  return name ? (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <Typography variant="h3" className="font-bold">
          {t('dashboard.greeting', {
            timeOfDayGreeting: getTimeOfDayGreeting(),
            userName: name
          })}
        </Typography>

        <Typography variant="muted">{t('dashboard.greetingMessage')}</Typography>
      </div>

      <TicketCreateButton />
    </div>
  ) : (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-[32px] w-[200px]" />
      <Skeleton className="h-[20px] w-[180px]" />
    </div>
  );
}
