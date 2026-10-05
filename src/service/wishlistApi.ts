import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  WishlistItem,
  WishlistResponse,
  ToggleWishlistResponse,
} from '../types/Wishlist.type';

export type {
  WishlistItem,
  WishlistResponse,
  ToggleWishlistResponse,
};

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => ENDPOINTS.wishlist.base,
      providesTags: ['Wishlist'],
    }),
    toggleWishlist: builder.mutation<ToggleWishlistResponse, number>({
      query: (productId) => ({
        url: ENDPOINTS.wishlist.byId(productId),
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation<{ success: boolean; message: string }, number>({
      query: (productId) => ({
        url: ENDPOINTS.wishlist.byId(productId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
