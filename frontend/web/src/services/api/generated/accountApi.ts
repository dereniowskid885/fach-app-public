import { api } from '../services/account-service/index';
export const addTagTypes = [
  'Authentication',
  'Categories',
  'Ticketing',
  'Comments',
  'Users'
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getAuthMe: build.query<GetAuthMeApiResponse, GetAuthMeApiArg>({
        query: () => ({ url: `/auth/me` }),
        providesTags: ['Authentication']
      }),
      postAuthRegister: build.mutation<PostAuthRegisterApiResponse, PostAuthRegisterApiArg>({
        query: queryArg => ({ url: `/auth/register`, method: 'POST', body: queryArg.body }),
        invalidatesTags: ['Authentication']
      }),
      postAuthLogin: build.mutation<PostAuthLoginApiResponse, PostAuthLoginApiArg>({
        query: queryArg => ({ url: `/auth/login`, method: 'POST', body: queryArg.body }),
        invalidatesTags: ['Authentication']
      }),
      postAuthRefreshToken: build.mutation<
        PostAuthRefreshTokenApiResponse,
        PostAuthRefreshTokenApiArg
      >({
        query: () => ({ url: `/auth/refresh-token`, method: 'POST' }),
        invalidatesTags: ['Authentication']
      }),
      postAuthLogout: build.mutation<PostAuthLogoutApiResponse, PostAuthLogoutApiArg>({
        query: () => ({ url: `/auth/logout`, method: 'POST' }),
        invalidatesTags: ['Authentication']
      }),
      postAuthRequestEmailVerification: build.mutation<
        PostAuthRequestEmailVerificationApiResponse,
        PostAuthRequestEmailVerificationApiArg
      >({
        query: queryArg => ({
          url: `/auth/request-email-verification`,
          method: 'POST',
          body: queryArg.body
        }),
        invalidatesTags: ['Authentication']
      }),
      postAuthEmailVerification: build.mutation<
        PostAuthEmailVerificationApiResponse,
        PostAuthEmailVerificationApiArg
      >({
        query: queryArg => ({
          url: `/auth/email-verification`,
          method: 'POST',
          body: queryArg.body
        }),
        invalidatesTags: ['Authentication']
      }),
      postAuthRequestPasswordReset: build.mutation<
        PostAuthRequestPasswordResetApiResponse,
        PostAuthRequestPasswordResetApiArg
      >({
        query: queryArg => ({
          url: `/auth/request-password-reset`,
          method: 'POST',
          body: queryArg.body
        }),
        invalidatesTags: ['Authentication']
      }),
      postAuthPasswordReset: build.mutation<
        PostAuthPasswordResetApiResponse,
        PostAuthPasswordResetApiArg
      >({
        query: queryArg => ({ url: `/auth/password-reset`, method: 'POST', body: queryArg.body }),
        invalidatesTags: ['Authentication']
      }),
      postCategories: build.mutation<PostCategoriesApiResponse, PostCategoriesApiArg>({
        query: queryArg => ({ url: `/categories`, method: 'POST', body: queryArg.body }),
        invalidatesTags: ['Categories']
      }),
      getCategories: build.query<GetCategoriesApiResponse, GetCategoriesApiArg>({
        query: queryArg => ({
          url: `/categories`,
          params: {
            name: queryArg.name,
            hasSpecialists: queryArg.hasSpecialists
          }
        }),
        providesTags: ['Categories']
      }),
      getCategoriesById: build.query<GetCategoriesByIdApiResponse, GetCategoriesByIdApiArg>({
        query: queryArg => ({ url: `/categories/${queryArg.id}` }),
        providesTags: ['Categories']
      }),
      deleteCategoriesById: build.mutation<
        DeleteCategoriesByIdApiResponse,
        DeleteCategoriesByIdApiArg
      >({
        query: queryArg => ({ url: `/categories/${queryArg.id}`, method: 'DELETE' }),
        invalidatesTags: ['Categories']
      }),
      patchCategoriesById: build.mutation<
        PatchCategoriesByIdApiResponse,
        PatchCategoriesByIdApiArg
      >({
        query: queryArg => ({
          url: `/categories/${queryArg.id}`,
          method: 'PATCH',
          body: queryArg.body
        }),
        invalidatesTags: ['Categories']
      }),
      patchCategoriesByIdSpecialistAssign: build.mutation<
        PatchCategoriesByIdSpecialistAssignApiResponse,
        PatchCategoriesByIdSpecialistAssignApiArg
      >({
        query: queryArg => ({
          url: `/categories/${queryArg.id}/specialist/assign`,
          method: 'PATCH',
          body: queryArg.body
        }),
        invalidatesTags: ['Categories']
      }),
      patchCategoriesByIdSpecialistRemove: build.mutation<
        PatchCategoriesByIdSpecialistRemoveApiResponse,
        PatchCategoriesByIdSpecialistRemoveApiArg
      >({
        query: queryArg => ({
          url: `/categories/${queryArg.id}/specialist/remove`,
          method: 'PATCH',
          body: queryArg.body
        }),
        invalidatesTags: ['Categories']
      }),
      postTickets: build.mutation<PostTicketsApiResponse, PostTicketsApiArg>({
        query: queryArg => ({ url: `/tickets`, method: 'POST', body: queryArg.body }),
        invalidatesTags: ['Ticketing']
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
        }),
        providesTags: ['Ticketing']
      }),
      postTicketsByIdComments: build.mutation<
        PostTicketsByIdCommentsApiResponse,
        PostTicketsByIdCommentsApiArg
      >({
        query: queryArg => ({
          url: `/tickets/${queryArg.id}/comments`,
          method: 'POST',
          body: queryArg.body
        }),
        invalidatesTags: ['Comments']
      }),
      getTicketsByIdComments: build.query<
        GetTicketsByIdCommentsApiResponse,
        GetTicketsByIdCommentsApiArg
      >({
        query: queryArg => ({ url: `/tickets/${queryArg.id}/comments` }),
        providesTags: ['Comments']
      }),
      postTicketsByIdPayment: build.mutation<
        PostTicketsByIdPaymentApiResponse,
        PostTicketsByIdPaymentApiArg
      >({
        query: queryArg => ({
          url: `/tickets/${queryArg.id}/payment`,
          method: 'POST',
          body: queryArg.body
        }),
        invalidatesTags: ['Ticketing']
      }),
      getTicketsMy: build.query<GetTicketsMyApiResponse, GetTicketsMyApiArg>({
        query: queryArg => ({
          url: `/tickets/my`,
          params: {
            categoryId: queryArg.categoryId,
            city: queryArg.city,
            status: queryArg.status
          }
        }),
        providesTags: ['Ticketing']
      }),
      getTicketsCompleted: build.query<GetTicketsCompletedApiResponse, GetTicketsCompletedApiArg>({
        query: queryArg => ({
          url: `/tickets/completed`,
          params: {
            categoryId: queryArg.categoryId,
            city: queryArg.city,
            status: queryArg.status
          }
        }),
        providesTags: ['Ticketing']
      }),
      getTicketsSpecialistAvailable: build.query<
        GetTicketsSpecialistAvailableApiResponse,
        GetTicketsSpecialistAvailableApiArg
      >({
        query: queryArg => ({
          url: `/tickets/specialist/available`,
          params: {
            city: queryArg.city
          }
        }),
        providesTags: ['Ticketing']
      }),
      getTicketsSpecialistEvaluations: build.query<
        GetTicketsSpecialistEvaluationsApiResponse,
        GetTicketsSpecialistEvaluationsApiArg
      >({
        query: queryArg => ({
          url: `/tickets/specialist/evaluations`,
          params: {
            city: queryArg.city
          }
        }),
        providesTags: ['Ticketing']
      }),
      getTicketsById: build.query<GetTicketsByIdApiResponse, GetTicketsByIdApiArg>({
        query: queryArg => ({ url: `/tickets/${queryArg.id}` }),
        providesTags: ['Ticketing']
      }),
      deleteTicketsById: build.mutation<DeleteTicketsByIdApiResponse, DeleteTicketsByIdApiArg>({
        query: queryArg => ({ url: `/tickets/${queryArg.id}`, method: 'DELETE' }),
        invalidatesTags: ['Ticketing']
      }),
      patchTicketsById: build.mutation<PatchTicketsByIdApiResponse, PatchTicketsByIdApiArg>({
        query: queryArg => ({
          url: `/tickets/${queryArg.id}`,
          method: 'PATCH',
          body: queryArg.body
        }),
        invalidatesTags: ['Ticketing']
      }),
      deleteTicketsCommentById: build.mutation<
        DeleteTicketsCommentByIdApiResponse,
        DeleteTicketsCommentByIdApiArg
      >({
        query: queryArg => ({ url: `/tickets/comment/${queryArg.id}`, method: 'DELETE' }),
        invalidatesTags: ['Comments']
      }),
      patchTicketsByIdEvaluation: build.mutation<
        PatchTicketsByIdEvaluationApiResponse,
        PatchTicketsByIdEvaluationApiArg
      >({
        query: queryArg => ({
          url: `/tickets/${queryArg.id}/evaluation`,
          method: 'PATCH',
          body: queryArg.body
        }),
        invalidatesTags: ['Ticketing']
      }),
      patchTicketsByIdAcceptEvaluation: build.mutation<
        PatchTicketsByIdAcceptEvaluationApiResponse,
        PatchTicketsByIdAcceptEvaluationApiArg
      >({
        query: queryArg => ({
          url: `/tickets/${queryArg.id}/accept-evaluation`,
          method: 'PATCH',
          body: queryArg.body
        }),
        invalidatesTags: ['Ticketing']
      }),
      patchTicketsByIdEditEvaluation: build.mutation<
        PatchTicketsByIdEditEvaluationApiResponse,
        PatchTicketsByIdEditEvaluationApiArg
      >({
        query: queryArg => ({
          url: `/tickets/${queryArg.id}/edit-evaluation`,
          method: 'PATCH',
          body: queryArg.body
        }),
        invalidatesTags: ['Ticketing']
      }),
      postUsers: build.mutation<PostUsersApiResponse, PostUsersApiArg>({
        query: queryArg => ({ url: `/users`, method: 'POST', body: queryArg.body }),
        invalidatesTags: ['Users']
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
        }),
        providesTags: ['Users']
      }),
      getUsersById: build.query<GetUsersByIdApiResponse, GetUsersByIdApiArg>({
        query: queryArg => ({ url: `/users/${queryArg.id}` }),
        providesTags: ['Users']
      }),
      patchUsersById: build.mutation<PatchUsersByIdApiResponse, PatchUsersByIdApiArg>({
        query: queryArg => ({ url: `/users/${queryArg.id}`, method: 'PATCH', body: queryArg.body }),
        invalidatesTags: ['Users']
      }),
      deleteUsersById: build.mutation<DeleteUsersByIdApiResponse, DeleteUsersByIdApiArg>({
        query: queryArg => ({ url: `/users/${queryArg.id}`, method: 'DELETE' }),
        invalidatesTags: ['Users']
      }),
      patchUsersByIdRole: build.mutation<PatchUsersByIdRoleApiResponse, PatchUsersByIdRoleApiArg>({
        query: queryArg => ({
          url: `/users/${queryArg.id}/role`,
          method: 'PATCH',
          body: queryArg.body
        }),
        invalidatesTags: ['Users']
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
export type PostAuthLoginApiResponse = /** status 200 User logged in successfully */ {
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
export type PostAuthRefreshTokenApiResponse =
  /** status 200 Access token refreshed successfully */ {
    success?: boolean;
    message?: string;
    data?: {
      accessToken?: string;
    };
  };
export type PostAuthRefreshTokenApiArg = void;
export type PostAuthLogoutApiResponse = /** status 200 User logged out successfully. */ {
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
  /** Determines if should omit categories with no specialists assigned */
  hasSpecialists?: boolean;
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
    Example: awaiting_evaluation,in_progress
     */
  status?: string;
  /** Filter by assignee (userId) */
  assignee?: string;
  /** Filter by author (userId) */
  createdBy?: string;
};
export type PostTicketsByIdCommentsApiResponse =
  /** status 200 Ticket comment created successfully */ {
    success?: boolean;
    message?: string;
    data?: Comment;
  };
export type PostTicketsByIdCommentsApiArg = {
  /** Unique ID of the ticket */
  id: string;
  body: {
    /** Content of the comment */
    content: string;
    /** Array of attachment URLs */
    attachments?: string[];
  };
};
export type GetTicketsByIdCommentsApiResponse =
  /** status 200 Successfully retrieved ticket comments */ {
    success?: boolean;
    dataLength?: number;
    data?: Comment[];
  };
export type GetTicketsByIdCommentsApiArg = {
  /** Unique ID of the ticket */
  id: string;
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
    currency: Currency;
  };
};
export type GetTicketsMyApiResponse = /** status 200 Array of tickets */ {
  success?: boolean;
  dataLength?: number;
  data?: Ticket[];
};
export type GetTicketsMyApiArg = {
  /** Filter by categoryId */
  categoryId?: string;
  /** Filter by city */
  city?: string;
  /** Filter by one or multiple ticket statuses.
    You can pass a single value or a comma-separated list.
    Example: awaiting_evaluation,in_progress
     */
  status?: string;
};
export type GetTicketsCompletedApiResponse = /** status 200 Array of tickets */ {
  success?: boolean;
  dataLength?: number;
  data?: Ticket[];
};
export type GetTicketsCompletedApiArg = {
  /** Filter by categoryId */
  categoryId?: string;
  /** Filter by city */
  city?: string;
  /** Filter by one or multiple ticket statuses.
    You can pass a single value or a comma-separated list.
    Example: awaiting_evaluation,in_progress
     */
  status?: string;
};
export type GetTicketsSpecialistAvailableApiResponse = /** status 200 Array of tickets */ {
  success?: boolean;
  dataLength?: number;
  data?: Ticket[];
};
export type GetTicketsSpecialistAvailableApiArg = {
  /** Filter by city */
  city?: string;
};
export type GetTicketsSpecialistEvaluationsApiResponse = /** status 200 Array of tickets */ {
  success?: boolean;
  dataLength?: number;
  data?: Ticket[];
};
export type GetTicketsSpecialistEvaluationsApiArg = {
  /** Filter by city */
  city?: string;
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
export type DeleteTicketsCommentByIdApiResponse = /** status 200 Comment deleted successfully */ {
  success?: boolean;
  message?: string;
};
export type DeleteTicketsCommentByIdApiArg = {
  /** Unique ID of the comment */
  id: string;
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
      amountInCents?: number;
      currency?: Currency;
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
      amountInCents?: number;
      currency?: Currency;
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
  | 'awaiting_evaluation'
  | 'awaiting_payment'
  | 'in_progress'
  | 'solution_review'
  | 'moderator_investigation'
  | 'completed'
  | 'canceled';
export type Currency = 'PLN' | 'EUR';
export type Evaluation = {
  _id?: string;
  user?: User;
  dateOfResponse?: string;
  minutes?: number;
  price?: {
    amountInCents?: number;
    currency?: Currency;
  };
};
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
export type Payment = {
  _id?: string;
  user?: User;
  ticket?: Ticket;
  amount?: number;
  currency?: Currency;
  paymentMethod?: string;
  status?: PaymentStatus;
  createdAt?: string;
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
  commentsCount?: number;
  specialistCommentsCount?: number;
  payment?: Payment;
};
export type Comment = {
  _id?: string;
  user?: User;
  userRole?: UserRole;
  ticket?: Ticket;
  content?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
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
  usePostTicketsByIdCommentsMutation,
  useGetTicketsByIdCommentsQuery,
  usePostTicketsByIdPaymentMutation,
  useGetTicketsMyQuery,
  useGetTicketsCompletedQuery,
  useGetTicketsSpecialistAvailableQuery,
  useGetTicketsSpecialistEvaluationsQuery,
  useGetTicketsByIdQuery,
  useDeleteTicketsByIdMutation,
  usePatchTicketsByIdMutation,
  useDeleteTicketsCommentByIdMutation,
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
