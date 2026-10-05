import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  AdminReviewListResponse,
  AdminReviewDetailResponse,
  AdminReviewListQueryParams,
} from '../types/Review.type';

export const adminReviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReviews: builder.query<AdminReviewListResponse, AdminReviewListQueryParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: ENDPOINTS.adminReviews.base,
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: ['Review'],
    }),

    getAdminReviewById: builder.query<AdminReviewDetailResponse, number>({
      query: (id) => ENDPOINTS.adminReviews.byId(id),
      providesTags: ['Review'],
    }),

    adminDeleteReview: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: ENDPOINTS.adminReviews.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
  }),
});

export const {
  useGetAdminReviewsQuery,
  useLazyGetAdminReviewsQuery,
  useGetAdminReviewByIdQuery,
  useLazyGetAdminReviewByIdQuery,
  useAdminDeleteReviewMutation,
} = adminReviewApi;
