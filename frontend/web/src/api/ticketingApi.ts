import { api } from './services/ticketing/index';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getCategories: build.query<GetCategoriesApiResponse, GetCategoriesApiArg>({
      query: () => ({ url: `/categories` })
    }),
    getCategoriesById: build.query<GetCategoriesByIdApiResponse, GetCategoriesByIdApiArg>({
      query: queryArg => ({ url: `/categories/${queryArg.id}` })
    }),
    getCategoriesByName: build.query<GetCategoriesByNameApiResponse, GetCategoriesByNameApiArg>({
      query: queryArg => ({ url: `/categories/${queryArg.name}` })
    }),
    patchCategoriesByIdSpecialistAssign: build.mutation<
      PatchCategoriesByIdSpecialistAssignApiResponse,
      PatchCategoriesByIdSpecialistAssignApiArg
    >({
      query: queryArg => ({
        url: `/categories/${queryArg.id}/specialist/assign`,
        method: 'PATCH',
        body: queryArg.body
      })
    }),
    patchCategoriesByIdSpecialistRemove: build.mutation<
      PatchCategoriesByIdSpecialistRemoveApiResponse,
      PatchCategoriesByIdSpecialistRemoveApiArg
    >({
      query: queryArg => ({
        url: `/categories/${queryArg.id}/specialist/remove`,
        method: 'PATCH',
        body: queryArg.body
      })
    }),
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
    }),
    getTicketsById: build.query<GetTicketsByIdApiResponse, GetTicketsByIdApiArg>({
      query: queryArg => ({ url: `/tickets/${queryArg.id}` })
    }),
    getTicketsByCategoryId: build.query<
      GetTicketsByCategoryIdApiResponse,
      GetTicketsByCategoryIdApiArg
    >({
      query: queryArg => ({ url: `/tickets/${queryArg.categoryId}` })
    })
  }),
  overrideExisting: false
});
export { injectedRtkApi as ticketingApi };
export type GetCategoriesApiResponse = /** status 200 Categories */ {
  /** Unique category ID */
  _id?: string;
  /** Unique category name */
  name?: string;
}[];
export type GetCategoriesApiArg = void;
export type GetCategoriesByIdApiResponse = /** status 200 Category */ {
  /** Unique category ID */
  _id?: string;
  /** Unique category name */
  name?: string;
};
export type GetCategoriesByIdApiArg = {
  /** Category id */
  id: string;
};
export type GetCategoriesByNameApiResponse = /** status 200 Category */ {
  /** Unique category ID */
  _id?: string;
  /** Unique category name */
  name?: string;
};
export type GetCategoriesByNameApiArg = {
  /** Category name */
  name: string;
};
export type PatchCategoriesByIdSpecialistAssignApiResponse =
  /** status 200 Specialist assigned to category successfully */ {
    message?: string;
  };
export type PatchCategoriesByIdSpecialistAssignApiArg = {
  /** Category ID */
  id: string;
  body: {
    userId: string;
  };
};
export type PatchCategoriesByIdSpecialistRemoveApiResponse =
  /** status 200 Specialist succesfully removed from category */ {
    message?: string;
  };
export type PatchCategoriesByIdSpecialistRemoveApiArg = {
  /** Category ID */
  id: string;
  body: {
    userId: string;
  };
};
export type PostTicketsApiResponse = /** status 200 Ticket creation ended with success */ {
  message?: string;
};
export type PostTicketsApiArg = {
  body: {
    city?: string;
    category: {
      /** Unique category ID */
      _id?: string;
      /** Category name */
      name?: string;
    };
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
  category?: {
    /** Unique category ID */
    _id?: string;
    /** Category name */
    name?: string;
  };
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
    category?: {
      /** Unique category ID */
      _id?: string;
      /** Category name */
      name?: string;
    };
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
export type GetTicketsByIdApiResponse = /** status 200 Successfully retrieved the ticket */ {
  /** Unique ticket ID */
  _id?: string;
  city?: string;
  category?: {
    /** Unique category ID */
    _id?: string;
    /** Category name */
    name?: string;
  };
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
};
export type GetTicketsByIdApiArg = {
  /** Unique id of the ticket */
  id: string;
};
export type GetTicketsByCategoryIdApiResponse =
  /** status 200 Tickets found by provided categoryId */ {
    /** Unique ticket ID */
    _id?: string;
    city?: string;
    category?: {
      /** Unique category ID */
      _id?: string;
      /** Category name */
      name?: string;
    };
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
export type GetTicketsByCategoryIdApiArg = {
  /** Unique categoryId */
  categoryId: string;
};
export const {
  useGetCategoriesQuery,
  useGetCategoriesByIdQuery,
  useGetCategoriesByNameQuery,
  usePatchCategoriesByIdSpecialistAssignMutation,
  usePatchCategoriesByIdSpecialistRemoveMutation,
  usePostTicketsMutation,
  useGetTicketsQuery,
  useGetTicketsSpecialistQuery,
  useDeleteTicketsByIdMutation,
  useGetTicketsByIdQuery,
  useGetTicketsByCategoryIdQuery
} = injectedRtkApi;
