const ACCOUNT_SERVICE_API = process.env.NEXT_PUBLIC_ACCOUNT_API;

export const API = {
  REFRESH_TOKEN: `${ACCOUNT_SERVICE_API}/auth/refresh-token`,
  NOTIFICATION_STREAM: `${ACCOUNT_SERVICE_API}/notifications/stream`
};
