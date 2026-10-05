import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  CartItem,
  CartData,
  CartResponse,
  SingleCartItemResponse,
  AddToCartRequest,
} from '../types/Cart.type';

export type {
  CartItem,
  CartData,
  CartResponse,
  SingleCartItemResponse,
  AddToCartRequest,
};

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => ENDPOINTS.cart.base,
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<SingleCartItemResponse, AddToCartRequest>({
      query: (body) => ({
        url: ENDPOINTS.cart.base,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<SingleCartItemResponse, { id: number; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: ENDPOINTS.cart.byId(id),
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: ENDPOINTS.cart.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: ENDPOINTS.cart.clear,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
