import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  AdminOrderListResponse,
  AdminOrderDetailResponse,
  AdminOrderStatusUpdateResponse,
  AdminOrderListQueryParams,
  UpdateOrderStatusRequest,
} from '../types/AdminOrder.type';

export const adminOrderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<AdminOrderListResponse, AdminOrderListQueryParams | void>({
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
          url: ENDPOINTS.adminOrders.base,
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'AdminOrder' as const, id })),
              { type: 'AdminOrder', id: 'LIST' },
            ]
          : [{ type: 'AdminOrder', id: 'LIST' }],
    }),

    getAdminOrderById: builder.query<AdminOrderDetailResponse, number>({
      query: (id) => ENDPOINTS.adminOrders.byId(id),
      providesTags: (_result, _error, id) => [{ type: 'AdminOrder', id }],
    }),

    updateOrderStatus: builder.mutation<
      AdminOrderStatusUpdateResponse,
      { id: number; data: UpdateOrderStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: ENDPOINTS.adminOrders.updateStatus(id),
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        'Order',
      ],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useLazyGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useLazyGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = adminOrderApi;
