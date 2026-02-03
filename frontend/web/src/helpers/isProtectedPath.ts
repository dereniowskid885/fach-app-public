import { PROTECTED_ROUTES } from '@/constants/routes';
import { normalizePathname } from './normalizePathname';

export const isProtectedPath = (pathname: string, locale: string) => {
  const normalized = normalizePathname(pathname, locale);

  return PROTECTED_ROUTES.some(route => route === normalized);
};
