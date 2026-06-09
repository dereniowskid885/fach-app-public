'use client';

import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketCreateButton from '@/components/features/ticket/TicketCreateButton';
import PageHeader from '@/components/ui/PageHeader';
import { isUser } from 'shared-types';
import { Skeleton } from '@/components/shadcn/skeleton';

export default function DashboardGreeting() {
  const t = useTranslations();
  const { name, role, isInitialized: isUserStateInitialized } = useSelector(selectUserData);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('timeOfDay.morning');
    if (hour < 18) return t('timeOfDay.afternoon');
    return t('timeOfDay.evening');
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <PageHeader
        isDataLoaded={isUserStateInitialized}
        title={t('dashboard.greeting', {
          timeOfDayGreeting: getTimeOfDayGreeting(),
          userName: name
        })}
        description={t('dashboard.greetingMessage')}
      />

      {!isUserStateInitialized ? (
        <Skeleton className="h-10 w-41.5 rounded-full" />
      ) : isUser(role) ? (
        <TicketCreateButton />
      ) : null}
    </div>
  );
}
