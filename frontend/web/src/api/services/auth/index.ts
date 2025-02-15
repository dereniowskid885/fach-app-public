import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_USER_API,
  credentials: 'include'
});

export const api = createApi({
  reducerPath: 'authApi',
  baseQuery: authBaseQuery,
  endpoints: () => ({})
});
