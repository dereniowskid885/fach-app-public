import { ROUTES } from '@/constants/routes';
import { defineRouting } from 'next-intl/routing';
import { ESupportedLanguages } from '@shared/enums/language';

export const locales = Object.values(ESupportedLanguages);
export const defaultLocale = ESupportedLanguages.PL;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames: ROUTES
});
