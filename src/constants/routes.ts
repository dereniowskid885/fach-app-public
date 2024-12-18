export const HOME_PATH = '/';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const PASSWORD_RESET_PATH = '/password-reset';
export const THEME_PATH = '/theme';
export const TYPOGRAPHY_PATH = '/typography';
export const TICKETS_PATH = '/tickets';
export const FAVORITES_PATH = '/favorites';
export const PROFILE_PATH = '/profile';

export const protectedRoutes = [HOME_PATH, TICKETS_PATH, FAVORITES_PATH, PROFILE_PATH];
export const publicRoutes = [
  LOGIN_PATH,
  REGISTER_PATH,
  PASSWORD_RESET_PATH,
  THEME_PATH,
  TYPOGRAPHY_PATH
];
