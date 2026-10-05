import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  ReviewMutationResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewHelpfulResponse,
  ProductReviewsResponse,
  ProductReviewsQueryParams,
  MyReviewResponse,
} from '../types/Review.type';

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<ReviewMutationResponse, CreateReviewRequest>({
      query: (body) => ({
        url: ENDPOINTS.reviews.base,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Review', 'Product'],
    }),

    updateReview: builder.mutation<
      ReviewMutationResponse,
      { id: number; data: UpdateReviewRequest }
    >({
      query: ({ id, data }) => ({
        url: ENDPOINTS.reviews.byId(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Review', 'Product'],
    }),

    deleteReview: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: ENDPOINTS.reviews.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Review', 'Product'],
    }),

    markReviewHelpful: builder.mutation<ReviewHelpfulResponse, number>({
      query: (id) => ({
        url: ENDPOINTS.reviews.helpful(id),
        method: 'POST',
      }),
      invalidatesTags: ['Review'],
    }),

    getProductReviews: builder.query<
      ProductReviewsResponse,
      { productId: number; filters?: ProductReviewsQueryParams }
    >({
      query: ({ productId, filters }) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: ENDPOINTS.reviews.productReviews(productId),
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: ['Review'],
    }),

    getMyReview: builder.query<MyReviewResponse, number>({
      query: (productId) => ENDPOINTS.reviews.myReview(productId),
      providesTags: ['Review'],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
  useGetProductReviewsQuery,
  useLazyGetProductReviewsQuery,
  useGetMyReviewQuery,
  useLazyGetMyReviewQuery,
} = reviewApi;
