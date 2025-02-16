import { api } from './services/auth/index';
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
    postAuthVerifyEmail: build.mutation<PostAuthVerifyEmailApiResponse, PostAuthVerifyEmailApiArg>({
      query: queryArg => ({ url: `/auth/verify-email`, method: 'POST', body: queryArg.body })
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
    })
  }),
  overrideExisting: false
});
export { injectedRtkApi as authApi };
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
    /** User's first name */
    name?: string;
    /** User's last name */
    surname?: string;
    /** User's city */
    city?: string;
  };
};
export type PostAuthLoginApiResponse = /** status 200 Successfully authenticated user */ {
  /** JWT access token for authentication */
  accessToken?: string;
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
    /** New JWT access token */
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
export type PostAuthVerifyEmailApiResponse = /** status 200 User has been verified successfully */ {
  message?: string;
  /** JWT access token for authentication */
  accessToken?: string;
};
export type PostAuthVerifyEmailApiArg = {
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
  usePostAuthVerifyEmailMutation,
  usePostAuthRequestPasswordResetMutation,
  usePostAuthPasswordResetMutation
} = injectedRtkApi;
