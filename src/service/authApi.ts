import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  RegisterRequest,
  LoginRequest,
  GoogleLoginRequest,
  LogoutRequest,
  AuthSuccessResponse,
  MeResponse,
  DeleteResponse,
} from '../types/Auth.type';
import { setCredentials, logOut } from '../Feature/Authentication/Slice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthSuccessResponse, RegisterRequest>({
      query: (credentials) => ({
        url: ENDPOINTS.auth.register,
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                tokens: data.data.tokens,
              })
            );
          }
        } catch (error) {
          console.error('Registration query failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    login: builder.mutation<AuthSuccessResponse, LoginRequest>({
      query: (credentials) => ({
        url: ENDPOINTS.auth.login,
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                tokens: data.data.tokens,
              })
            );
          }
        } catch (error) {
          console.error('Login query failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    googleLogin: builder.mutation<AuthSuccessResponse, GoogleLoginRequest>({
      query: (tokenPayload) => ({
        url: ENDPOINTS.auth.google,
        method: 'POST',
        body: tokenPayload,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                tokens: data.data.tokens,
              })
            );
          }
        } catch (error) {
          console.error('Google Login query failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<DeleteResponse, LogoutRequest>({
      query: (logoutPayload) => ({
        url: ENDPOINTS.auth.logout,
        method: 'POST',
        body: logoutPayload,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        // Optimistically clean up auth session in frontend
        dispatch(logOut());
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Server-side logout query failed:', error);
        }
      },
      invalidatesTags: ['Auth', 'Product'],
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => ENDPOINTS.auth.me,
      providesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
