import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './routing';
import { hasLocale } from 'next-intl';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(locales, requested) ? requested : defaultLocale;
  const messages = (await import(`./translations/${locale}.json`)).default;

  return {
    locale,
    messages
  };
});
