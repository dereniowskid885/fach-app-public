import { api } from './services/account/index';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
      query: () => ({ url: `/users` })
    }),
    getUsersByUserId: build.query<GetUsersByUserIdApiResponse, GetUsersByUserIdApiArg>({
      query: queryArg => ({ url: `/users/${queryArg.userId}` })
    }),
    deleteUsersByUserId: build.mutation<DeleteUsersByUserIdApiResponse, DeleteUsersByUserIdApiArg>({
      query: queryArg => ({ url: `/users/${queryArg.userId}`, method: 'DELETE' })
    }),
    putUsersUpdateRole: build.mutation<PutUsersUpdateRoleApiResponse, PutUsersUpdateRoleApiArg>({
      query: queryArg => ({ url: `/users/update-role`, method: 'PUT', body: queryArg.body })
    }),
    postAuthRegister: build.mutation<PostAuthRegisterApiResponse, PostAuthRegisterApiArg>({
      query: queryArg => ({ url: `/auth/register`, method: 'POST', body: queryArg.body })
    }),
    postAuthLogin: build.mutation<PostAuthLoginApiResponse, PostAuthLoginApiArg>({
      query: queryArg => ({ url: `/auth/login`, method: 'POST', body: queryArg.body })
    }),
    postAuthRefreshToken: build.mutation<
      PostAuthRefreshTokenApiResponse,
      PostAuthRefreshTokenApiArg
    >({
      query: () => ({ url: `/auth/refresh-token`, method: 'POST' })
    }),
    postAuthLogout: build.mutation<PostAuthLogoutApiResponse, PostAuthLogoutApiArg>({
      query: () => ({ url: `/auth/logout`, method: 'POST' })
    }),
    postAuthRequestEmailVerification: build.mutation<
      PostAuthRequestEmailVerificationApiResponse,
      PostAuthRequestEmailVerificationApiArg
    >({
      query: queryArg => ({
        url: `/auth/request-email-verification`,
        method: 'POST',
        body: queryArg.body
      })
    }),
    postAuthEmailVerification: build.mutation<
      PostAuthEmailVerificationApiResponse,
      PostAuthEmailVerificationApiArg
    >({
      query: queryArg => ({ url: `/auth/email-verification`, method: 'POST', body: queryArg.body })
    }),
    postAuthRequestPasswordReset: build.mutation<
      PostAuthRequestPasswordResetApiResponse,
      PostAuthRequestPasswordResetApiArg
    >({
      query: queryArg => ({
        url: `/auth/request-password-reset`,
        method: 'POST',
        body: queryArg.body
      })
    }),
    postAuthPasswordReset: build.mutation<
      PostAuthPasswordResetApiResponse,
      PostAuthPasswordResetApiArg
    >({
      query: queryArg => ({ url: `/auth/password-reset`, method: 'POST', body: queryArg.body })
    }),
    getCategories: build.query<GetCategoriesApiResponse, GetCategoriesApiArg>({
      query: () => ({ url: `/categories` })
    }),
    getCategoriesByIdById: build.query<
      GetCategoriesByIdByIdApiResponse,
      GetCategoriesByIdByIdApiArg
    >({
      query: queryArg => ({ url: `/categories/by-id/${queryArg.id}` })
    }),
    getCategoriesByNameByName: build.query<
      GetCategoriesByNameByNameApiResponse,
      GetCategoriesByNameByNameApiArg
    >({
      query: queryArg => ({ url: `/categories/by-name/${queryArg.name}` })
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
    getTicketsSpecialistByCity: build.query<
      GetTicketsSpecialistByCityApiResponse,
      GetTicketsSpecialistByCityApiArg
    >({
      query: queryArg => ({ url: `/tickets/specialist/${queryArg.city}` })
    }),
    deleteTicketsById: build.mutation<DeleteTicketsByIdApiResponse, DeleteTicketsByIdApiArg>({
      query: queryArg => ({ url: `/tickets/${queryArg.id}`, method: 'DELETE' })
    }),
    getTicketsByIdById: build.query<GetTicketsByIdByIdApiResponse, GetTicketsByIdByIdApiArg>({
      query: queryArg => ({ url: `/tickets/by-id/${queryArg.id}` })
    }),
    getTicketsByCategoryidByCategoryId: build.query<
      GetTicketsByCategoryidByCategoryIdApiResponse,
      GetTicketsByCategoryidByCategoryIdApiArg
    >({
      query: queryArg => ({ url: `/tickets/by-categoryid/${queryArg.categoryId}` })
    }),
    patchTicketsByIdEvaluation: build.mutation<
      PatchTicketsByIdEvaluationApiResponse,
      PatchTicketsByIdEvaluationApiArg
    >({
      query: queryArg => ({
        url: `/tickets/${queryArg.id}/evaluation`,
        method: 'PATCH',
        body: queryArg.body
      })
    })
  }),
  overrideExisting: false
});
export { injectedRtkApi as accountApi };
export type GetUsersApiResponse = /** status 200 A list of users */ {
  /** The unique identifier of the user */
  userId?: string;
  /** The user's email address */
  email?: string;
  /** The user's role in the system */
  role?: string;
}[];
export type GetUsersApiArg = void;
export type GetUsersByUserIdApiResponse = /** status 200 Successfully retrieved user data */ {
  /** User's unique ID */
  userId?: string;
  /** User's email address */
  email?: string;
  /** User's role in the system */
  role?: string;
};
export type GetUsersByUserIdApiArg = {
  /** Unique identifier of the user */
  userId: string;
};
export type DeleteUsersByUserIdApiResponse = /** status 200 Successfully deleted the user */ {
  message?: string;
};
export type DeleteUsersByUserIdApiArg = {
  /** Unique identifier of the user */
  userId: string;
};
export type PutUsersUpdateRoleApiResponse = /** status 200 Successfully updated user role */ {
  message?: string;
};
export type PutUsersUpdateRoleApiArg = {
  body: {
    /** Unique identifier of the user */
    userId?: string;
    /** New role to assign to the user */
    newRole?: 'user' | 'specialist' | 'admin';
  };
};
export type PostAuthRegisterApiResponse =
  /** status 201 User successfully registered in the database */
    | {
        message?: string;
      }
    | /** status 207 Server error while sending the email verification link */ {
        message?: string;
      };
export type PostAuthRegisterApiArg = {
  body: {
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
    role?: 'user' | 'specialist' | 'admin';
    /** Specialist category name */
    categoryName?: string;
    /** User's first name */
    name?: string;
    /** User's last name */
    surname?: string;
    /** User's city */
    city: string;
  };
};
export type PostAuthLoginApiResponse = /** status 200 Successfully authenticated user */ {
  message?: string;
};
export type PostAuthLoginApiArg = {
  body: {
    /** User's email address */
    email?: string;
    /** User's password */
    password?: string;
  };
};
export type PostAuthRefreshTokenApiResponse =
  /** status 200 Successfully refreshed access token */ {
    message?: string;
    accessToken?: string;
  };
export type PostAuthRefreshTokenApiArg = void;
export type PostAuthLogoutApiResponse = /** status 200 Successfully logged out */ {
  message?: string;
};
export type PostAuthLogoutApiArg = void;
export type PostAuthRequestEmailVerificationApiResponse =
  /** status 200 Email verification link sent successfully */ {
    message?: string;
  };
export type PostAuthRequestEmailVerificationApiArg = {
  body: {
    /** User's email address */
    email?: string;
  };
};
export type PostAuthEmailVerificationApiResponse =
  /** status 200 User has been verified successfully */ {
    message?: string;
  };
export type PostAuthEmailVerificationApiArg = {
  body: {
    /** Verification token sent via email */
    token?: string;
  };
};
export type PostAuthRequestPasswordResetApiResponse =
  /** status 200 Password reset link sent successfully */ {
    message?: string;
  };
export type PostAuthRequestPasswordResetApiArg = {
  body: {
    /** User's email address */
    email?: string;
  };
};
export type PostAuthPasswordResetApiResponse = /** status 200 Password reset successful */ {
  message?: string;
};
export type PostAuthPasswordResetApiArg = {
  body: {
    /** Password reset token */
    token?: string;
    /** New password for the user */
    newPassword?: string;
  };
};
export type GetCategoriesApiResponse = /** status 200 Categories */ {
  /** Unique category ID */
  _id?: string;
  /** Unique category name */
  name?: string;
}[];
export type GetCategoriesApiArg = void;
export type GetCategoriesByIdByIdApiResponse = /** status 200 Category */ {
  /** Unique category ID */
  _id?: string;
  /** Unique category name */
  name?: string;
};
export type GetCategoriesByIdByIdApiArg = {
  /** Category id */
  id: string;
};
export type GetCategoriesByNameByNameApiResponse = /** status 200 Category */ {
  /** Unique category ID */
  _id?: string;
  /** Unique category name */
  name?: string;
};
export type GetCategoriesByNameByNameApiArg = {
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
    assignee?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    createdBy?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    /** Date of ticket creation */
    createdAt?: string;
    /** Date of ticket last update */
    updatedAt?: string;
    /** User which updated the ticket lately */
    updatedBy?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
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
  assignee?: {
    /** User ID */
    _id?: string;
    /** User email */
    email?: string;
  };
  createdBy?: {
    /** User ID */
    _id?: string;
    /** User email */
    email?: string;
  };
  /** Date of ticket creation */
  createdAt?: string;
  /** Date of ticket last update */
  updatedAt?: string;
  /** User which updated the ticket lately */
  updatedBy?: {
    /** User ID */
    _id?: string;
    /** User email */
    email?: string;
  };
  /** Title of the ticket */
  title?: string;
  /** Description of the ticket */
  description?: string;
  /** List of evaluations made by specialists */
  evaluations?: {
    user?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    dateOfResponse?: string;
    price?: {
      value?: number;
      currency?: 'PLN';
    };
  }[];
}[];
export type GetTicketsApiArg = void;
export type GetTicketsSpecialistByCityApiResponse =
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
    assignee?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    createdBy?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    /** Date of ticket creation */
    createdAt?: string;
    /** Date of ticket last update */
    updatedAt?: string;
    updatedBy?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    /** Title of the ticket */
    title?: string;
    /** Description of the ticket */
    description?: string;
  }[];
export type GetTicketsSpecialistByCityApiArg = {
  /** City ​​by which the returned tickets will be filtered */
  city?: string;
};
export type DeleteTicketsByIdApiResponse = /** status 200 Ticket deletion ended with success */ {
  message?: string;
};
export type DeleteTicketsByIdApiArg = {
  /** Ticket ID */
  id: string;
};
export type GetTicketsByIdByIdApiResponse = /** status 200 Successfully retrieved the ticket */ {
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
  assignee?: {
    /** User ID */
    _id?: string;
    /** User email */
    email?: string;
  };
  createdBy?: {
    /** User ID */
    _id?: string;
    /** User email */
    email?: string;
  };
  /** Date of ticket creation */
  createdAt?: string;
  /** Date of ticket last update */
  updatedAt?: string;
  updatedBy?: {
    /** User ID */
    _id?: string;
    /** User email */
    email?: string;
  };
  /** Title of the ticket */
  title?: string;
  /** Description of the ticket */
  description?: string;
  /** List of evaluations made by specialists */
  evaluations?: {
    user?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    dateOfResponse?: string;
    price?: {
      value?: number;
      currency?: 'PLN';
    };
  }[];
};
export type GetTicketsByIdByIdApiArg = {
  /** Unique id of the ticket */
  id: string;
};
export type GetTicketsByCategoryidByCategoryIdApiResponse =
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
    assignee?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    createdBy?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    /** Date of ticket creation */
    createdAt?: string;
    /** Date of ticket last update */
    updatedAt?: string;
    updatedBy?: {
      /** User ID */
      _id?: string;
      /** User email */
      email?: string;
    };
    /** Title of the ticket */
    title?: string;
    /** Description of the ticket */
    description?: string;
  }[];
export type GetTicketsByCategoryidByCategoryIdApiArg = {
  /** Unique categoryId */
  categoryId: string;
};
export type PatchTicketsByIdEvaluationApiResponse =
  /** status 200 Ticket evaluated successfully */ {
    message?: string;
  };
export type PatchTicketsByIdEvaluationApiArg = {
  /** Ticket ID */
  id: string;
  body: {
    /** Price set by specialist and accepted by ticket author */
    price: {
      /** The numeric value of the price */
      value?: number;
      /** Currency code (e.g., PLN, USD, EUR) */
      currency?: string;
    };
    /** Evaluated minutes as time of first response */
    minutes: number;
  };
};
export const {
  useGetUsersQuery,
  useGetUsersByUserIdQuery,
  useDeleteUsersByUserIdMutation,
  usePutUsersUpdateRoleMutation,
  usePostAuthRegisterMutation,
  usePostAuthLoginMutation,
  usePostAuthRefreshTokenMutation,
  usePostAuthLogoutMutation,
  usePostAuthRequestEmailVerificationMutation,
  usePostAuthEmailVerificationMutation,
  usePostAuthRequestPasswordResetMutation,
  usePostAuthPasswordResetMutation,
  useGetCategoriesQuery,
  useGetCategoriesByIdByIdQuery,
  useGetCategoriesByNameByNameQuery,
  usePatchCategoriesByIdSpecialistAssignMutation,
  usePatchCategoriesByIdSpecialistRemoveMutation,
  usePostTicketsMutation,
  useGetTicketsQuery,
  useGetTicketsSpecialistByCityQuery,
  useDeleteTicketsByIdMutation,
  useGetTicketsByIdByIdQuery,
  useGetTicketsByCategoryidByCategoryIdQuery,
  usePatchTicketsByIdEvaluationMutation
} = injectedRtkApi;
