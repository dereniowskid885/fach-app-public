import { TFunction } from '@/types/i18n';

export const getLocaleDateString = (date?: string, locale?: string) => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric'
  });
};

export const getFormattedDate = (isoString?: string) => {
  if (!isoString) return '-';

  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const getRelativeTime = (t: TFunction, isoString?: string): string => {
  if (!isoString) return '-';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMs < 0) return getFormattedDate(isoString);

  if (diffSeconds < 60) return t('getRelativeTime.justNow');

  if (diffMinutes < 60) return t('getRelativeTime.minutesAgo', { minutes: diffMinutes });

  if (diffHours < 24) {
    const remainingMinutes = diffMinutes % 60;
    return remainingMinutes > 0
      ? t('getRelativeTime.minutesAndHoursAgo', { hours: diffHours, minutes: remainingMinutes })
      : t('getRelativeTime.hoursAgo', { hours: diffHours });
  }

  return getFormattedDate(isoString);
};
