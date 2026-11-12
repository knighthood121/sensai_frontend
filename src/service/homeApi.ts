import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type { HomeResponse } from '../types/Home.type';

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHome: builder.query<HomeResponse, void>({
      query: () => ENDPOINTS.home.base,
      // Product and variant writes already invalidate these shared catalog tags.
      // Subscribe home data too, including empty results that have no product IDs.
      providesTags: [
        'Home', 'Banner', 'Category', 'SubCategory',
        { type: 'Product', id: 'LIST' },
        { type: 'Variant', id: 'LIST' },
      ],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetHomeQuery, useLazyGetHomeQuery } = homeApi;
