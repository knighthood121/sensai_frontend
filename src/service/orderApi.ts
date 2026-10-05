import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  OrderListQueryParams,
  OrderListResponse,
  OrderDetailResponse,
  CancelOrderRequest,
  CancelOrderResponse,
} from '../types/order.type';

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderListResponse, OrderListQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              searchParams.append(key, String(value));
            }
          });
        }
        return {
          url: ENDPOINTS.orders.base,
          params: searchParams.toString() ? searchParams : undefined,
        };
      },
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrderById: builder.query<OrderDetailResponse, number>({
      query: (id) => ENDPOINTS.orders.byId(id),
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    cancelOrder: builder.mutation<CancelOrderResponse, { id: number; data: CancelOrderRequest }>({
      query: ({ id, data }) => ({
        url: ENDPOINTS.orders.cancel(id),
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useCancelOrderMutation,
} = orderApi;
