const BASE_ROUTE = '/api';
const AUTH_ROUTE = `${BASE_ROUTE}/auth`;
const USERS_ROUTE = `${BASE_ROUTE}/users`;
const TICKETS_ROUTE = `${BASE_ROUTE}/tickets`;
const CATEGORY_ROUTE = `${BASE_ROUTE}/categories`;

const ROUTES = {
  BASE: BASE_ROUTE,
  AUTH: {
    BASE: AUTH_ROUTE,
    LOGIN: `${AUTH_ROUTE}/login`,
    REGISTER: `${AUTH_ROUTE}/register`,
    REFRESH: `${AUTH_ROUTE}/refresh`,
    LOGOUT: `${AUTH_ROUTE}/logout`,
  },
  USERS: {
    BASE: USERS_ROUTE,
    PROFILE: `${USERS_ROUTE}/profile`,
    UPDATE: `${USERS_ROUTE}/update`,
  },
  TICKETS: {
    BASE: TICKETS_ROUTE,
    SPECIALIST: `${TICKETS_ROUTE}/specialist`,
  },
  CATEGORY: {
    BASE: CATEGORY_ROUTE,
  },
};

module.exports = ROUTES;
