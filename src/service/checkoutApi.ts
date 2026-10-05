import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  CheckoutRequest,
  CheckoutResponse,
} from '../types/Checkout.type';

export const checkoutApi = api.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: ENDPOINTS.checkout.base,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Cart' },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCheckoutMutation,
} = checkoutApi;
