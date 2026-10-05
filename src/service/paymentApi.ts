import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  VerifyPaymentRequest,
  PaymentVerifyResponse,
  PaymentFailureRequest,
  PaymentFailureResponse,
} from '../types/Payment.type';

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    verifyPayment: builder.mutation<PaymentVerifyResponse, VerifyPaymentRequest>({
      query: (body) => ({
        url: ENDPOINTS.payments.verify,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Order', id: 'LIST' },
        { type: 'Cart' },
      ],
    }),

    handlePaymentFailure: builder.mutation<PaymentFailureResponse, PaymentFailureRequest>({
      query: (body) => ({
        url: ENDPOINTS.payments.failure,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useVerifyPaymentMutation,
  useHandlePaymentFailureMutation,
} = paymentApi;
