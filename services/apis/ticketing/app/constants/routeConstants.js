const BASE_ROUTE = '/api';
const TICKETS_ROUTE = `${BASE_ROUTE}/tickets`;

const ROUTES = {
  BASE: BASE_ROUTE,
  TICKETS: {
    BASE: TICKETS_ROUTE,
    SPECIALIST: `${TICKETS_ROUTE}/specialist`,
  },
};

module.exports = ROUTES;
