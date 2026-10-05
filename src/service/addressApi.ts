import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  Address,
  AddressResponse,
  SingleAddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '../types/Address.type';

export type {
  Address,
  AddressResponse,
  SingleAddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
};

export const addressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressResponse, void>({
      query: () => ENDPOINTS.addresses.base,
      providesTags: ['Address'],
    }),
    createAddress: builder.mutation<SingleAddressResponse, CreateAddressRequest>({
      query: (body) => ({
        url: ENDPOINTS.addresses.base,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation<SingleAddressResponse, { id: number; body: UpdateAddressRequest }>({
      query: ({ id, body }) => ({
        url: ENDPOINTS.addresses.byId(id),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: ENDPOINTS.addresses.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
