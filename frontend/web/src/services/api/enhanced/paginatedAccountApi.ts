import { accountApi } from '@/services/api/generated/accountApi';
import type {
  GetNotificationsApiArg,
  GetNotificationsApiResponse,
  GetTicketsApiArg,
  GetTicketsApiResponse,
  GetTicketsByIdCommentsApiArg,
  GetTicketsByIdCommentsApiResponse,
  GetTicketsCompletedApiArg,
  GetTicketsCompletedApiResponse,
  GetTicketsMyApiArg,
  GetTicketsMyApiResponse,
  GetTicketsSpecialistAvailableApiArg,
  GetTicketsSpecialistAvailableApiResponse,
  GetTicketsSpecialistEvaluationsApiArg,
  GetTicketsSpecialistEvaluationsApiResponse
} from '@/services/api/generated/accountApi';

export const paginatedAccountApi = accountApi
  .enhanceEndpoints({
    addTagTypes: ['Notifications', 'Ticketing', 'Comments']
  })
  .injectEndpoints({
    endpoints: build => ({
      getNotificationsInfinite: build.infiniteQuery<
        GetNotificationsApiResponse,
        GetNotificationsApiArg,
        string | undefined
      >({
        query: ({ queryArg, pageParam }) => ({
          url: `/notifications`,
          params: {
            cursor: pageParam ?? queryArg?.cursor,
            limit: queryArg?.limit
          }
        }),
        providesTags: ['Notifications'],
        infiniteQueryOptions: {
          getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
          initialPageParam: undefined
        }
      }),
      getTicketsInfinite: build.infiniteQuery<
        GetTicketsApiResponse,
        GetTicketsApiArg,
        string | undefined
      >({
        query: ({ queryArg, pageParam }) => ({
          url: `/tickets`,
          params: {
            cursor: pageParam ?? queryArg?.cursor,
            limit: queryArg?.limit,
            status: queryArg?.status,
            categoryId: queryArg?.categoryId,
            city: queryArg?.city
          }
        }),
        providesTags: ['Ticketing'],
        infiniteQueryOptions: {
          getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
          initialPageParam: undefined
        }
      }),
      getTicketsCompletedInfinite: build.infiniteQuery<
        GetTicketsCompletedApiResponse,
        GetTicketsCompletedApiArg,
        string | undefined
      >({
        query: ({ queryArg, pageParam }) => ({
          url: `/tickets/completed`,
          params: {
            cursor: pageParam ?? queryArg?.cursor,
            limit: queryArg?.limit,
            status: queryArg?.status,
            categoryId: queryArg?.categoryId,
            city: queryArg?.city
          }
        }),
        providesTags: ['Ticketing'],
        infiniteQueryOptions: {
          getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
          initialPageParam: undefined
        }
      }),
      getTicketsMyInfinite: build.infiniteQuery<
        GetTicketsMyApiResponse,
        GetTicketsMyApiArg,
        string | undefined
      >({
        query: ({ queryArg, pageParam }) => ({
          url: `/tickets/my`,
          params: {
            cursor: pageParam ?? queryArg?.cursor,
            limit: queryArg?.limit,
            status: queryArg?.status,
            categoryId: queryArg?.categoryId,
            city: queryArg?.city
          }
        }),
        providesTags: ['Ticketing'],
        infiniteQueryOptions: {
          getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
          initialPageParam: undefined
        }
      }),
      getTicketsSpecialistAvailableInfinite: build.infiniteQuery<
        GetTicketsSpecialistAvailableApiResponse,
        GetTicketsSpecialistAvailableApiArg,
        string | undefined
      >({
        query: ({ queryArg, pageParam }) => ({
          url: `/tickets/specialist/available`,
          params: {
            cursor: pageParam ?? queryArg?.cursor,
            limit: queryArg?.limit,
            city: queryArg?.city
          }
        }),
        providesTags: ['Ticketing'],
        infiniteQueryOptions: {
          getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
          initialPageParam: undefined
        }
      }),
      getTicketsSpecialistEvaluationsInfinite: build.infiniteQuery<
        GetTicketsSpecialistEvaluationsApiResponse,
        GetTicketsSpecialistEvaluationsApiArg,
        string | undefined
      >({
        query: ({ queryArg, pageParam }) => ({
          url: `/tickets/specialist/evaluations`,
          params: {
            cursor: pageParam ?? queryArg?.cursor,
            limit: queryArg?.limit,
            city: queryArg?.city
          }
        }),
        providesTags: ['Ticketing'],
        infiniteQueryOptions: {
          getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
          initialPageParam: undefined
        }
      }),
      getTicketsByIdCommentsInfinite: build.infiniteQuery<
        GetTicketsByIdCommentsApiResponse,
        GetTicketsByIdCommentsApiArg,
        string | undefined
      >({
        query: ({ queryArg, pageParam }) => ({
          url: `/tickets/${queryArg.id}/comments`,
          params: {
            cursor: pageParam ?? queryArg?.cursor,
            limit: queryArg?.limit
          }
        }),
        providesTags: ['Comments'],
        infiniteQueryOptions: {
          getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
          initialPageParam: undefined
        }
      })
    }),
    overrideExisting: false
  });
