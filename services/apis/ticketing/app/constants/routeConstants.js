const BASE_ROUTE = '/api';
const TICKETS_ROUTE = `${BASE_ROUTE}/tickets`;
const CATEGORY_ROUTE = `${BASE_ROUTE}/categories`;

const ROUTES = {
  BASE: BASE_ROUTE,
  TICKETS: {
    BASE: TICKETS_ROUTE,
    SPECIALIST: `${TICKETS_ROUTE}/specialist`,
  },
  CATEGORY: {
    BASE: CATEGORY_ROUTE,
  },
};

module.exports = ROUTES;
