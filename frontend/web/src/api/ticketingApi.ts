import { api } from './services/ticketing/index';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    postTickets: build.mutation<PostTicketsApiResponse, PostTicketsApiArg>({
      query: queryArg => ({ url: `/tickets`, method: 'POST', body: queryArg.body })
    }),
    getTickets: build.query<GetTicketsApiResponse, GetTicketsApiArg>({
      query: () => ({ url: `/tickets` })
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
  /** Ticket category */
  category?: any;
  /** Ticket status */
  status?: any;
  /** Currently assigned user */
  assignee?: string;
  /** Author of the ticket */
  createdBy?: string;
  /** Date of ticket creation */
  createdAt?: any;
  /** Date of ticket last update */
  updatedAt?: any;
  /** Price set by specialist and accepted by ticket author */
  price?: string;
  /** Title of the ticket */
  title?: string;
  /** Description of the ticket */
  description?: string;
}[];
export type GetTicketsApiArg = void;
export const { usePostTicketsMutation, useGetTicketsQuery } = injectedRtkApi;
