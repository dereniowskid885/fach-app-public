'use client';

import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketCreateButton from './TicketCreateButton';
import PageHeader from '../common/PageHeader';
import { isUser } from '@shared/utils/role';

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
    <div className="flex items-center justify-between">
      <PageHeader
        isDataLoaded={isUserStateInitialized}
        title={t('dashboard.greeting', {
          timeOfDayGreeting: getTimeOfDayGreeting(),
          userName: name
        })}
        description={t('dashboard.greetingMessage')}
      />

      {isUser(role) ? <TicketCreateButton /> : null}
    </div>
  );
}
