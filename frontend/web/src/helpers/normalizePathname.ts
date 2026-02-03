import { HOME_PATH } from '@/constants/routes';
import { ESupportedLanguages, supportedLanguages } from '@/constants/supportedLanguages';
import { routing } from '@/i18n/routing';

export const normalizePathname = (pathname: string, locale: string) => {
  const isLocaleInvalid = !supportedLanguages.includes(locale as ESupportedLanguages);

  if (isLocaleInvalid || locale === routing.defaultLocale) {
    return pathname;
  }

  const localePrefix = `/${locale}`;

  return pathname.startsWith(localePrefix)
    ? pathname.slice(localePrefix.length) || HOME_PATH
    : pathname;
};
