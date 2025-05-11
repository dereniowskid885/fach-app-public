import { isCookie } from '@/lib/isCookie';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_ACCOUNT_API,
  credentials: 'include'
});

// custom method which retries the request once after a 401 error, if a new access token is detected (e.g., after silent refresh).
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const accessToken = await isCookie('accessToken');

    // if accessToken exist after 401 error has occured, call initial request again
    if (accessToken) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'accountApi',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
});
