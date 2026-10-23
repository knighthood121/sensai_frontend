import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  CustomerListResponse,
  CustomerDetailResponse,
  CustomerListQueryParams,
} from '../types/Customer.type';

export const adminCustomerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCustomers: builder.query<CustomerListResponse, CustomerListQueryParams | void>({
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
          url: ENDPOINTS.adminCustomers.base,
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Customer' as const, id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),

    getAdminCustomerById: builder.query<CustomerDetailResponse, number | string>({
      query: (id) => ENDPOINTS.adminCustomers.byId(id),
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }],
    }),
  }),
});

export const {
  useGetAdminCustomersQuery,
  useLazyGetAdminCustomersQuery,
  useGetAdminCustomerByIdQuery,
  useLazyGetAdminCustomerByIdQuery,
} = adminCustomerApi;
