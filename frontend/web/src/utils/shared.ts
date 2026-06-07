import { Currency, User } from '@/services/api/generated/accountApi';
import { ESupportedCurrency } from 'shared-types';
import { TFunction } from '@/types/i18n';

export const getFormattedPriceAmount = (
  amountInCents = 0,
  currency?: Currency | ESupportedCurrency
) => (amountInCents / 100).toFixed(2) + (currency ? ` ${currency}` : '');

export const getUserFullName = (user?: User | null, nameFallback = 'Unknown') => {
  return user?.name && user?.surname ? `${user.name} ${user.surname}` : nameFallback;
};

export const getFormattedResponseTime = (minutesValue = 0, t: TFunction) => {
  // divide total minutes by 1440 (minutes in a day) to get the number of full days.
  const days = Math.floor(minutesValue / 1440);
  // first get the remaining minutes after full days using modulo, then divide by 60 to get full hours.
  const hours = Math.floor((minutesValue % 1440) / 60);
  // return the remaining minutes after full hours using modulo 60.
  const minutes = minutesValue % 60;

  const result = [];

  if (days > 0) result.push(t('responseTime.days', { count: days }));
  if (hours > 0) result.push(t('responseTime.hours', { count: hours }));
  if (minutes > 0) result.push(t('responseTime.minutes', { count: minutes }));

  return result.join(' ');
};
