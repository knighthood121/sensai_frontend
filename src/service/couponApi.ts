import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  CouponResponse,
  CouponListResponse,
  CouponMutationResponse,
  CreateCouponRequest,
  UpdateCouponRequest,
  ValidateCouponRequest,
  ValidateCouponResponse,
} from '../types/Coupon.type';
import type { DeleteResponse } from '../types/Product.type';

export const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listCoupons: builder.query<CouponListResponse, void>({
      query: () => ENDPOINTS.coupons.base,
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Coupon' as const, id })),
              { type: 'Coupon', id: 'LIST' },
            ]
          : [{ type: 'Coupon', id: 'LIST' }],
    }),

    getCouponDetails: builder.query<CouponResponse, number>({
      query: (id) => ENDPOINTS.coupons.byId(id),
      providesTags: (_result, _error, id) => [{ type: 'Coupon', id }],
    }),

    createCoupon: builder.mutation<CouponMutationResponse, CreateCouponRequest>({
      query: (newCoupon) => ({
        url: ENDPOINTS.coupons.base,
        method: 'POST',
        body: newCoupon,
      }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),

    updateCoupon: builder.mutation<
      CouponMutationResponse,
      { id: number; data: UpdateCouponRequest }
    >({
      query: ({ id, data }) => ({
        url: ENDPOINTS.coupons.byId(id),
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),

    deleteCoupon: builder.mutation<DeleteResponse, number>({
      query: (id) => ({
        url: ENDPOINTS.coupons.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),

    validateCoupon: builder.mutation<ValidateCouponResponse, ValidateCouponRequest>({
      query: (validationPayload) => ({
        url: ENDPOINTS.coupons.apply,
        method: 'POST',
        body: validationPayload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListCouponsQuery,
  useLazyListCouponsQuery,
  useGetCouponDetailsQuery,
  useLazyGetCouponDetailsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
} = couponApi;
