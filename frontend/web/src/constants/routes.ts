export const HOME_PATH = '/';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const PASSWORD_RESET_PATH = '/password-reset';
export const TICKETS_PATH = '/tickets';
export const FAVORITES_PATH = '/favorites';
export const PROFILE_PATH = '/profile';

export const ROUTES = {
  [HOME_PATH]: {
    pl: HOME_PATH,
    en: HOME_PATH
  },
  [LOGIN_PATH]: {
    pl: '/logowanie',
    en: LOGIN_PATH
  },
  [REGISTER_PATH]: {
    pl: '/rejestracja',
    en: REGISTER_PATH
  },
  [PASSWORD_RESET_PATH]: {
    pl: '/reset-hasla',
    en: PASSWORD_RESET_PATH
  },
  [TICKETS_PATH]: {
    pl: '/sprawy',
    en: TICKETS_PATH
  },
  [FAVORITES_PATH]: {
    pl: '/ulubione',
    en: FAVORITES_PATH
  },
  [PROFILE_PATH]: {
    pl: '/profil',
    en: PROFILE_PATH
  }
};

const {
  [LOGIN_PATH]: login,
  [REGISTER_PATH]: register,
  [PASSWORD_RESET_PATH]: reset,
  ...rest
} = ROUTES;

export const PUBLIC_ROUTES = [login, register, reset].flatMap(r => Object.values(r));
export const PROTECTED_ROUTES = Object.values(rest).flatMap(r => Object.values(r));
