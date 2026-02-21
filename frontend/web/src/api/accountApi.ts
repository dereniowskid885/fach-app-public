import { api } from './services/account/index';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getAuthMe: build.query<GetAuthMeApiResponse, GetAuthMeApiArg>({
      query: () => ({ url: `/auth/me` })
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
    postCategories: build.mutation<PostCategoriesApiResponse, PostCategoriesApiArg>({
      query: queryArg => ({ url: `/categories`, method: 'POST', body: queryArg.body })
    }),
    getCategories: build.query<GetCategoriesApiResponse, GetCategoriesApiArg>({
      query: queryArg => ({
        url: `/categories`,
        params: {
          name: queryArg.name
        }
      })
    }),
    getCategoriesById: build.query<GetCategoriesByIdApiResponse, GetCategoriesByIdApiArg>({
      query: queryArg => ({ url: `/categories/${queryArg.id}` })
    }),
    deleteCategoriesById: build.mutation<
      DeleteCategoriesByIdApiResponse,
      DeleteCategoriesByIdApiArg
    >({
      query: queryArg => ({ url: `/categories/${queryArg.id}`, method: 'DELETE' })
    }),
    patchCategoriesById: build.mutation<PatchCategoriesByIdApiResponse, PatchCategoriesByIdApiArg>({
      query: queryArg => ({
        url: `/categories/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.body
      })
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
      query: queryArg => ({
        url: `/tickets`,
        params: {
          categoryId: queryArg.categoryId,
          city: queryArg.city,
          status: queryArg.status,
          assignee: queryArg.assignee,
          createdBy: queryArg.createdBy
        }
      })
    }),
    postTicketsByIdPayment: build.mutation<
      PostTicketsByIdPaymentApiResponse,
      PostTicketsByIdPaymentApiArg
    >({
      query: queryArg => ({
        url: `/tickets/${queryArg.id}/payment`,
        method: 'POST',
        body: queryArg.body
      })
    }),
    getTicketsById: build.query<GetTicketsByIdApiResponse, GetTicketsByIdApiArg>({
      query: queryArg => ({ url: `/tickets/${queryArg.id}` })
    }),
    deleteTicketsById: build.mutation<DeleteTicketsByIdApiResponse, DeleteTicketsByIdApiArg>({
      query: queryArg => ({ url: `/tickets/${queryArg.id}`, method: 'DELETE' })
    }),
    patchTicketsById: build.mutation<PatchTicketsByIdApiResponse, PatchTicketsByIdApiArg>({
      query: queryArg => ({ url: `/tickets/${queryArg.id}`, method: 'PATCH', body: queryArg.body })
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
    }),
    patchTicketsByIdAcceptEvaluation: build.mutation<
      PatchTicketsByIdAcceptEvaluationApiResponse,
      PatchTicketsByIdAcceptEvaluationApiArg
    >({
      query: queryArg => ({
        url: `/tickets/${queryArg.id}/accept-evaluation`,
        method: 'PATCH',
        body: queryArg.body
      })
    }),
    patchTicketsByIdEditEvaluation: build.mutation<
      PatchTicketsByIdEditEvaluationApiResponse,
      PatchTicketsByIdEditEvaluationApiArg
    >({
      query: queryArg => ({
        url: `/tickets/${queryArg.id}/edit-evaluation`,
        method: 'PATCH',
        body: queryArg.body
      })
    }),
    postUsers: build.mutation<PostUsersApiResponse, PostUsersApiArg>({
      query: queryArg => ({ url: `/users`, method: 'POST', body: queryArg.body })
    }),
    getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
      query: queryArg => ({
        url: `/users`,
        params: {
          email: queryArg.email,
          role: queryArg.role,
          category: queryArg.category,
          city: queryArg.city,
          verified: queryArg.verified
        }
      })
    }),
    getUsersById: build.query<GetUsersByIdApiResponse, GetUsersByIdApiArg>({
      query: queryArg => ({ url: `/users/${queryArg.id}` })
    }),
    patchUsersById: build.mutation<PatchUsersByIdApiResponse, PatchUsersByIdApiArg>({
      query: queryArg => ({ url: `/users/${queryArg.id}`, method: 'PATCH', body: queryArg.body })
    }),
    deleteUsersById: build.mutation<DeleteUsersByIdApiResponse, DeleteUsersByIdApiArg>({
      query: queryArg => ({ url: `/users/${queryArg.id}`, method: 'DELETE' })
    }),
    patchUsersByIdRole: build.mutation<PatchUsersByIdRoleApiResponse, PatchUsersByIdRoleApiArg>({
      query: queryArg => ({
        url: `/users/${queryArg.id}/role`,
        method: 'PATCH',
        body: queryArg.body
      })
    })
  }),
  overrideExisting: false
});
export { injectedRtkApi as accountApi };
export type GetAuthMeApiResponse = /** status 200 Single user object. */ {
  success?: boolean;
  data?: User;
};
export type GetAuthMeApiArg = void;
export type PostAuthRegisterApiResponse = /** status 201 User registered successfully */ {
  success?: boolean;
  message?: string;
  data?: User;
};
export type PostAuthRegisterApiArg = {
  body: {
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
    /** User's first name */
    name: string;
    /** User's last name */
    surname: string;
    /** User's city */
    city: string;
    lang?: Language;
  };
};
export type PostAuthLoginApiResponse = /** status 200 User logged in succesfully */ {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};
export type PostAuthLoginApiArg = {
  body: {
    /** User's email address */
    email?: string;
    /** User's password */
    password?: string;
  };
};
export type PostAuthRefreshTokenApiResponse = /** status 200 Access token refreshed succesfully */ {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
  };
};
export type PostAuthRefreshTokenApiArg = void;
export type PostAuthLogoutApiResponse = /** status 200 User logged out succesfully. */ {
  success?: boolean;
  message?: string;
};
export type PostAuthLogoutApiArg = void;
export type PostAuthRequestEmailVerificationApiResponse =
  /** status 200 If this email is registered, a verification link has been sent */ {
    success?: boolean;
    message?: string;
  };
export type PostAuthRequestEmailVerificationApiArg = {
  body: {
    /** User's email address */
    email: string;
    lang?: Language;
  };
};
export type PostAuthEmailVerificationApiResponse =
  /** status 200 User has been verified successfully */ {
    success?: boolean;
    message?: string;
  };
export type PostAuthEmailVerificationApiArg = {
  body: {
    /** Verification token sent via email */
    token?: string;
  };
};
export type PostAuthRequestPasswordResetApiResponse =
  /** status 200 If this email is registered, a password reset link has been sent */ {
    success?: boolean;
    message?: string;
  };
export type PostAuthRequestPasswordResetApiArg = {
  body: {
    /** User's email address */
    email: string;
    lang?: Language;
  };
};
export type PostAuthPasswordResetApiResponse = /** status 200 Password reset successful */ {
  success?: boolean;
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
export type PostCategoriesApiResponse = /** status 201 Category successfully created */ {
  success?: boolean;
  message?: string;
  data?: Category;
};
export type PostCategoriesApiArg = {
  body: {
    name: string;
  };
};
export type GetCategoriesApiResponse = /** status 200 Array of categories */ {
  success?: boolean;
  dataLength?: number;
  data?: Category[];
};
export type GetCategoriesApiArg = {
  /** Category name to filter by */
  name?: string;
};
export type GetCategoriesByIdApiResponse = /** status 200 Category object */ {
  success?: boolean;
  data?: Category;
};
export type GetCategoriesByIdApiArg = {
  /** Unique category ID */
  id: string;
};
export type DeleteCategoriesByIdApiResponse = /** status 200 Category successfully removed */ {
  success?: boolean;
  message?: string;
};
export type DeleteCategoriesByIdApiArg = {
  /** Unique category ID */
  id: string;
};
export type PatchCategoriesByIdApiResponse = /** status 200 Category name successfully updated */ {
  success?: boolean;
  data?: Category;
};
export type PatchCategoriesByIdApiArg = {
  /** Unique category ID */
  id: string;
  body: {
    name?: string;
  };
};
export type PatchCategoriesByIdSpecialistAssignApiResponse =
  /** status 200 Specialist successfully assigned to a category */ {
    success?: boolean;
    message?: string;
    data?: Category;
  };
export type PatchCategoriesByIdSpecialistAssignApiArg = {
  /** Unique category ID */
  id: string;
  body: {
    userId: string;
  };
};
export type PatchCategoriesByIdSpecialistRemoveApiResponse =
  /** status 200 Specialist successfully removed from category */ {
    success?: boolean;
    message?: string;
    data?: Category;
  };
export type PatchCategoriesByIdSpecialistRemoveApiArg = {
  /** Unique category ID */
  id: string;
  body: {
    /** Specialist user ID to remove from category */
    userId: string;
  };
};
export type PostTicketsApiResponse = /** status 200 Ticket created successfully */ {
  success?: boolean;
  message?: string;
  data?: Ticket;
};
export type PostTicketsApiArg = {
  body: {
    /** Title of the ticket */
    title: string;
    /** Description of the ticket */
    description: string;
    /** Unique ID of the category */
    categoryId: string;
    /** City associated with the ticket */
    city: string;
  };
};
export type GetTicketsApiResponse = /** status 200 Array of tickets */ {
  success?: boolean;
  dataLength?: number;
  data?: Ticket[];
};
export type GetTicketsApiArg = {
  /** Filter by categoryId */
  categoryId?: string;
  /** Filter by city */
  city?: string;
  /** Filter by one or multiple ticket statuses.
    You can pass a single value or a comma-separated list.
    Example: Wycena,Oczekiwanie na płatność
     */
  status?: string;
  /** Filter by assignee (userId) */
  assignee?: string;
  /** Filter by author (userId) */
  createdBy?: string;
};
export type PostTicketsByIdPaymentApiResponse = /** status 200 Ticket payment successfull */ {
  success?: boolean;
  message?: string;
  data?: {
    clientSecret?: string;
    payment?: Payment;
  };
};
export type PostTicketsByIdPaymentApiArg = {
  /** Unique ID of the ticket */
  id: string;
  body: {
    /** Numeric value of the price */
    amount: number;
    /** Currency code (e.g., PLN) */
    currency: string;
  };
};
export type GetTicketsByIdApiResponse = /** status 200 Successfully retrieved the ticket */ {
  success?: boolean;
  data?: Ticket;
};
export type GetTicketsByIdApiArg = {
  /** Unique ID of the ticket */
  id: string;
};
export type DeleteTicketsByIdApiResponse = /** status 200 Ticket deleted successfully */ {
  success?: boolean;
  message?: string;
};
export type DeleteTicketsByIdApiArg = {
  /** Unique ID of the ticket */
  id: string;
};
export type PatchTicketsByIdApiResponse = /** status 200 Ticket updated successfully */ {
  success?: boolean;
  message?: string;
  data?: Ticket;
};
export type PatchTicketsByIdApiArg = {
  /** Unique ID of the ticket */
  id: string;
  body: {
    /** Updated title of the ticket */
    title?: string;
    /** Updated description of the ticket */
    description?: string;
    /** Unique ID of the category */
    categoryId?: string;
    /** City associated with the ticket */
    city?: string;
    status?: TicketStatus;
    /** User ID of the assignee */
    assigneeId?: string;
  };
};
export type PatchTicketsByIdEvaluationApiResponse =
  /** status 200 Ticket evaluated successfully */ {
    success?: boolean;
    message?: string;
    data?: Ticket;
  };
export type PatchTicketsByIdEvaluationApiArg = {
  /** Unique ID of the ticket */
  id: string;
  body: {
    /** Price set by the specialist */
    price: {
      /** Numeric value of the price */
      value?: number;
      /** Currency code (e.g., PLN) */
      currency?: string;
    };
    /** Evaluated minutes as the time of first response */
    minutes: number;
  };
};
export type PatchTicketsByIdAcceptEvaluationApiResponse =
  /** status 200 Ticket evaluation accepted successfully */ {
    success?: boolean;
    message?: string;
    data?: Ticket;
  };
export type PatchTicketsByIdAcceptEvaluationApiArg = {
  /** Unique ID of the ticket */
  id: string;
  body: {
    evaluationId: string;
  };
};
export type PatchTicketsByIdEditEvaluationApiResponse =
  /** status 200 Ticket evaluation updated successfully */ {
    success?: boolean;
    message?: string;
    data?: Ticket;
  };
export type PatchTicketsByIdEditEvaluationApiArg = {
  /** Unique ID of the ticket */
  id: string;
  body: {
    evaluationId: string;
    /** Price set by the specialist */
    price?: {
      /** Numeric value of the price */
      value?: number;
      /** Currency code (e.g., PLN) */
      currency?: string;
    };
    /** Evaluated minutes as the time of first response */
    minutes?: number;
  };
};
export type PostUsersApiResponse = /** status 201 User created successfully */ {
  success?: boolean;
  message?: string;
  data?: User;
};
export type PostUsersApiArg = {
  body: {
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
    role?: UserRole;
    /** Specialist category name */
    categoryName?: string;
    /** User's first name */
    name: string;
    /** User's last name */
    surname: string;
    /** User's city */
    city: string;
  };
};
export type GetUsersApiResponse = /** status 200 Fetched users. */ {
  success?: boolean;
  dataLength?: number;
  data?: User[];
};
export type GetUsersApiArg = {
  /** Filter by user email */
  email?: string;
  /** Filter by user role (e.g., admin, specialist, user) */
  role?: string;
  /** Filter by user category ID */
  category?: string;
  /** Filter by user city */
  city?: string;
  /** Filter by verification status */
  verified?: boolean;
};
export type GetUsersByIdApiResponse = /** status 200 Single user object. */ {
  success?: boolean;
  data?: User;
};
export type GetUsersByIdApiArg = {
  /** Unique ID of the user */
  id: string;
};
export type PatchUsersByIdApiResponse = /** status 200 Successfully updated the user */ {
  success?: boolean;
  message?: string;
  data?: User;
};
export type PatchUsersByIdApiArg = {
  /** Unique ID of the user */
  id: string;
  body: {
    email?: string;
    city?: string;
    isVerified?: boolean;
    name?: string;
    surname?: string;
    theme?: ThemeType;
  };
};
export type DeleteUsersByIdApiResponse = /** status 200 Successfully deleted the user */ {
  success?: boolean;
  message?: string;
};
export type DeleteUsersByIdApiArg = {
  /** Unique ID of the user */
  id: string;
};
export type PatchUsersByIdRoleApiResponse = /** status 200 Successfully updated the user role */ {
  success?: boolean;
  message?: string;
  data?: User;
};
export type PatchUsersByIdRoleApiArg = {
  /** Unique ID of the user */
  id: string;
  body: {
    role: UserRole;
  };
};
export type UserRole = 'user' | 'specialist' | 'admin';
export type Category = {
  _id?: string;
  name?: string;
  specialists?: User[];
};
export type User = {
  _id?: string;
  email?: string;
  role?: UserRole;
  category?: Category;
  name?: string;
  surname?: string;
  city?: string;
  isVerified?: boolean;
  theme?: 'light' | 'dark' | 'system';
};
export type Language = 'pl' | 'en';
export type TicketStatus =
  | 'Wycena'
  | 'Akceptacja wyceny'
  | 'Oczekiwanie na p\u0142atno\u015B\u0107'
  | 'W trakcie'
  | 'Akceptacja rozwi\u0105zania'
  | 'Badanie przez moderatora'
  | 'Uko\u0144czony';
export type Evaluation = {
  _id?: string;
  user?: User;
  dateOfResponse?: string;
  price?: {
    value?: number;
    currency?: 'PLN';
  };
};
export type Ticket = {
  _id?: string;
  category?: Category;
  city?: string;
  status?: TicketStatus;
  assignee?: User;
  createdBy?: User;
  createdAt?: string;
  updatedBy?: User;
  updatedAt?: string;
  title?: string;
  description?: string;
  evaluations?: Evaluation[];
  acceptedEvaluation?: Evaluation;
};
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
export type Payment = {
  _id?: string;
  user?: User;
  ticket?: Ticket;
  amount?: number;
  currency?: 'PLN';
  paymentMethod?: string;
  status?: PaymentStatus;
  createdAt?: string;
};
export type ThemeType = 'light' | 'dark' | 'system';
export const {
  useGetAuthMeQuery,
  usePostAuthRegisterMutation,
  usePostAuthLoginMutation,
  usePostAuthRefreshTokenMutation,
  usePostAuthLogoutMutation,
  usePostAuthRequestEmailVerificationMutation,
  usePostAuthEmailVerificationMutation,
  usePostAuthRequestPasswordResetMutation,
  usePostAuthPasswordResetMutation,
  usePostCategoriesMutation,
  useGetCategoriesQuery,
  useGetCategoriesByIdQuery,
  useDeleteCategoriesByIdMutation,
  usePatchCategoriesByIdMutation,
  usePatchCategoriesByIdSpecialistAssignMutation,
  usePatchCategoriesByIdSpecialistRemoveMutation,
  usePostTicketsMutation,
  useGetTicketsQuery,
  usePostTicketsByIdPaymentMutation,
  useGetTicketsByIdQuery,
  useDeleteTicketsByIdMutation,
  usePatchTicketsByIdMutation,
  usePatchTicketsByIdEvaluationMutation,
  usePatchTicketsByIdAcceptEvaluationMutation,
  usePatchTicketsByIdEditEvaluationMutation,
  usePostUsersMutation,
  useGetUsersQuery,
  useGetUsersByIdQuery,
  usePatchUsersByIdMutation,
  useDeleteUsersByIdMutation,
  usePatchUsersByIdRoleMutation
} = injectedRtkApi;
