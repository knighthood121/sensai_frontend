import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, ENDPOINTS } from '../constant/urls';
import type { RootState } from '../app/store';
import { logOut, setCredentials } from '../Feature/Authentication/Slice';
import type { AuthSuccessResponse } from '../types/Auth.type';

// Create base query with auth token headers
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // 1. First try reading token from Redux state
    let token = (getState() as RootState).auth.accessToken;

    // 2. Fallback to localStorage if state is temporarily uninitialized
    if (!token) {
      token = localStorage.getItem('accessToken');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Mutual exclusion / Lock flag to prevent redundant concurrent token refresh queries
let isRefreshing = false;

// Custom base query that intercepts 401 and performs automatic JWT refresh rotation
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, apiInstance, extraOptions) => {
  let result = await baseQuery(args, apiInstance, extraOptions);

  if (result.error && result.error.status === 401) {
    // Prevent nested reauth calls if we are already refreshing or if the request *is* the refresh request itself
    const isRefreshReq = typeof args !== 'string' && args.url === ENDPOINTS.auth.refresh;

    if (!isRefreshing && !isRefreshReq) {
      isRefreshing = true;

      // Obtain stored refresh token from Redux state or localStorage fallback
      let refreshToken = (apiInstance.getState() as RootState).auth.refreshToken;
      if (!refreshToken) {
        refreshToken = localStorage.getItem('refreshToken');
      }

      if (refreshToken) {
        try {
          // Perform silent token rotation query
          const refreshResult = await baseQuery(
            {
              url: ENDPOINTS.auth.refresh,
              method: 'POST',
              body: { refreshToken },
            },
            apiInstance,
            extraOptions
          );

          const responseData = refreshResult.data as AuthSuccessResponse;

          if (responseData && responseData.success && responseData.data) {
            // Update store credentials
            apiInstance.dispatch(
              setCredentials({
                user: responseData.data.user,
                tokens: responseData.data.tokens,
              })
            );

            // Re-run original query with new tokens
            result = await baseQuery(args, apiInstance, extraOptions);
          } else {
            // Refresh failed or returned invalid response, force logout
            apiInstance.dispatch(logOut());
          }
        } catch (err) {
          console.error('Silent token rotation failed:', err);
          apiInstance.dispatch(logOut());
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available, force logout
        apiInstance.dispatch(logOut());
        isRefreshing = false;
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Product', 'Cart', 'Wishlist', 'Category', 'SubCategory', 'Address', 'Variant', 'Coupon', 'Dropdown', 'Order', 'Payment', 'Home', 'AdminOrder', 'Dashboard', 'Inventory', 'Review', 'Ticket', 'AdminTicket', 'BulkInquiry'],
  endpoints: () => ({}),
});
