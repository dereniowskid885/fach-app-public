import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ticketingBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_TICKETS_API,
  credentials: 'include'
});

export const api = createApi({
  reducerPath: 'ticketingApi',
  baseQuery: ticketingBaseQuery,
  endpoints: () => ({})
});
