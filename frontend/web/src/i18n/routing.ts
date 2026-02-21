import { ROUTES } from '@/constants/routes';
import { ESupportedLanguages } from '@shared/constants/enums';
import { defineRouting } from 'next-intl/routing';

export const locales = Object.values(ESupportedLanguages);
export const defaultLocale = ESupportedLanguages.PL;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames: ROUTES
});
