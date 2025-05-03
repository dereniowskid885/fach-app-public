// API Base URLs
const ACCOUNT_SERVICE_API = process.env.NEXT_PUBLIC_ACCOUNT_API + '/auth';

export const API = {
  REFRESH_TOKEN: `${ACCOUNT_SERVICE_API}/refresh-token`
};
