// API Base URLs
const USER_SERVICE_API = process.env.NEXT_PUBLIC_USER_API + '/auth';
const TICKETS_SERVICE_API = process.env.NEXT_PUBLIC_TICKETS_API;

// Auth service URLs
export const AuthAPI = {
  LOGIN: `${USER_SERVICE_API}/login`,
  LOGOUT: `${USER_SERVICE_API}/logout`,
  REFRESH_TOKEN: `${USER_SERVICE_API}/refresh`,
  REGISTER: `${USER_SERVICE_API}/register`,
  PASSWORD_RESET: `${USER_SERVICE_API}/password-reset`,
  PASSWORD_RESET_REQUEST: `${USER_SERVICE_API}/password-reset-link`,
  EMAIL_VERIFY_REQUEST: `${USER_SERVICE_API}/email-verify-link`,
  EMAIL_VERIFY: `${USER_SERVICE_API}/email-verify`
};

// Ticketing service URLs
export const TicketsAPI = {
  BASE: `${TICKETS_SERVICE_API}/tickets`
};
