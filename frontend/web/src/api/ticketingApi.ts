import { api } from './services/ticketing/index';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    postTickets: build.mutation<PostTicketsApiResponse, PostTicketsApiArg>({
      query: queryArg => ({ url: `/tickets`, method: 'POST', body: queryArg.body })
    }),
    getTickets: build.query<GetTicketsApiResponse, GetTicketsApiArg>({
      query: () => ({ url: `/tickets` })
    }),
    getTicketsSpecialist: build.query<GetTicketsSpecialistApiResponse, GetTicketsSpecialistApiArg>({
      query: () => ({ url: `/tickets/specialist` })
    }),
    deleteTicketsById: build.mutation<DeleteTicketsByIdApiResponse, DeleteTicketsByIdApiArg>({
      query: queryArg => ({ url: `/tickets/${queryArg.id}`, method: 'DELETE' })
    })
  }),
  overrideExisting: false
});
export { injectedRtkApi as ticketingApi };
export type PostTicketsApiResponse = /** status 200 Ticket creation ended with success */ {
  message?: string;
};
export type PostTicketsApiArg = {
  body: {
    city?: string;
    /** Ticket category */
    category: 'Mechanika pojazdowa' | 'Elektronika' | 'Dom';
    /** Ticket status */
    status?:
      | 'Wycena'
      | 'Akceptacja wyceny'
      | 'Oczekiwanie na p\u0142atno\u015B\u0107'
      | 'W trakcie'
      | 'Akceptacja rozwi\u0105zania'
      | 'Badanie przez moderatora'
      | 'Uko\u0144czony';
    /** Currently assigned user */
    assignee?: string;
    /** Author of the ticket */
    createdBy?: string;
    /** Date of ticket creation */
    createdAt?: string;
    /** Date of ticket last update */
    updatedAt?: string;
    /** Price set by specialist and accepted by ticket author */
    price?: string;
    /** Title of the ticket */
    title: string;
    /** Description of the ticket */
    description: string;
  };
};
export type GetTicketsApiResponse = /** status 200 Tickets created by logged user */ {
  /** Unique ticket ID */
  _id?: string;
  city?: string;
  /** Ticket category */
  category?: 'Mechanika pojazdowa' | 'Elektronika' | 'Dom';
  /** Ticket status */
  status?:
    | 'Wycena'
    | 'Akceptacja wyceny'
    | 'Oczekiwanie na p\u0142atno\u015B\u0107'
    | 'W trakcie'
    | 'Akceptacja rozwi\u0105zania'
    | 'Badanie przez moderatora'
    | 'Uko\u0144czony';
  /** Currently assigned user */
  assignee?: string;
  /** Author of the ticket */
  createdBy?: string;
  /** Date of ticket creation */
  createdAt?: string;
  /** Date of ticket last update */
  updatedAt?: string;
  /** Price set by specialist and accepted by ticket author */
  price?: string;
  /** Title of the ticket */
  title?: string;
  /** Description of the ticket */
  description?: string;
}[];
export type GetTicketsApiArg = void;
export type GetTicketsSpecialistApiResponse =
  /** status 200 Pending tickets - ready to be taken by specialist */ {
    /** Unique ticket ID */
    _id?: string;
    city?: string;
    /** Ticket category */
    category?: 'Mechanika pojazdowa' | 'Elektronika' | 'Dom';
    /** Ticket status */
    status?:
      | 'Wycena'
      | 'Akceptacja wyceny'
      | 'Oczekiwanie na p\u0142atno\u015B\u0107'
      | 'W trakcie'
      | 'Akceptacja rozwi\u0105zania'
      | 'Badanie przez moderatora'
      | 'Uko\u0144czony';
    /** Currently assigned user */
    assignee?: string;
    /** Author of the ticket */
    createdBy?: string;
    /** Date of ticket creation */
    createdAt?: string;
    /** Date of ticket last update */
    updatedAt?: string;
    /** Price set by specialist and accepted by ticket author */
    price?: string;
    /** Title of the ticket */
    title?: string;
    /** Description of the ticket */
    description?: string;
  }[];
export type GetTicketsSpecialistApiArg = void;
export type DeleteTicketsByIdApiResponse = /** status 200 Ticket deletion ended with success */ {
  message?: string;
};
export type DeleteTicketsByIdApiArg = {
  /** Ticket ID */
  id: string;
};
export const {
  usePostTicketsMutation,
  useGetTicketsQuery,
  useGetTicketsSpecialistQuery,
  useDeleteTicketsByIdMutation
} = injectedRtkApi;
