export const HOME_PATH = '/';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const PASSWORD_RESET_PATH = '/password-reset';
export const PASSWORD_RESET_FORM_PATH = `${PASSWORD_RESET_PATH}/[token]`;
export const TICKETS_PATH = '/tickets';
export const AVAILABLE_TICKETS_PATH = '/available-tickets';
export const VERIFY_PATH = '/verify';
export const ALL_TICKETS_PATH = '/all-tickets';

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
  [PASSWORD_RESET_FORM_PATH]: {
    pl: PASSWORD_RESET_FORM_PATH,
    en: PASSWORD_RESET_FORM_PATH
  },
  [TICKETS_PATH]: {
    pl: '/sprawy',
    en: TICKETS_PATH
  },
  [AVAILABLE_TICKETS_PATH]: {
    pl: '/dostepne-sprawy',
    en: AVAILABLE_TICKETS_PATH
  },
  [ALL_TICKETS_PATH]: {
    pl: '/wszystkie-sprawy',
    en: ALL_TICKETS_PATH
  },
  [VERIFY_PATH]: {
    pl: '/weryfikacja',
    en: VERIFY_PATH
  }
};

const {
  [LOGIN_PATH]: login,
  [REGISTER_PATH]: register,
  [PASSWORD_RESET_PATH]: passwordReset,
  [VERIFY_PATH]: verify,
  ...rest
} = ROUTES;

export const PUBLIC_ROUTES = [login, register, passwordReset, verify].flatMap(r =>
  Object.values(r)
);
export const PROTECTED_ROUTES = Object.values(rest).flatMap(r => Object.values(r));
