import { PASSWORD_RESET_PATH, VERIFY_PATH } from '@/constants/routes';
import { ESupportedLanguages } from '@shared/constants/enums';
import { PROTECTED_ROUTES } from '@/constants/routes';
import { HOME_PATH } from '@/constants/routes';
import { supportedLanguages } from '@/constants/supportedLanguages';
import { routing } from '@/i18n/routing';

export const normalizePathname = (pathname: string, locale: string) => {
  const skipMiddleware = isMiddlewareExcludedPath(pathname);
  const isLocaleInvalid = !supportedLanguages.includes(locale as ESupportedLanguages);
  const isDefaultLocale = locale === routing.defaultLocale;

  const shouldKeepLocale = !skipMiddleware && (isLocaleInvalid || isDefaultLocale);

  if (shouldKeepLocale) {
    return pathname;
  }

  const localePrefix = `/${locale}`;

  if (!pathname.startsWith(localePrefix)) {
    return pathname;
  }

  return pathname.slice(localePrefix.length) || HOME_PATH;
};

export const getLastPathSegment = (pathname: string) => {
  const splittedPath = pathname.split('/');
  return splittedPath[splittedPath.length - 1];
};

export const isProtectedPath = (pathname: string, locale: string) => {
  const normalized = normalizePathname(pathname, locale);

  return PROTECTED_ROUTES.some(route => route === normalized);
};

export const isMiddlewareExcludedPath = (pathname: string) => {
  const plPrefix = `/${ESupportedLanguages.PL}`;
  const excludedPaths = [PASSWORD_RESET_PATH, VERIFY_PATH];

  return excludedPaths.some(path => pathname.startsWith(`${plPrefix}${path}`));
};
