// API Base URLs
const USER_SERVICE_API = process.env.NEXT_PUBLIC_USER_API + '/auth';

export const API = {
  REFRESH_TOKEN: `${USER_SERVICE_API}/refresh-token`
};
