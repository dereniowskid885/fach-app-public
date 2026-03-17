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
