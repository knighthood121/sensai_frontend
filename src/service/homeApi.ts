import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type { HomeResponse } from '../types/Home.type';

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHome: builder.query<HomeResponse, void>({
      query: () => ENDPOINTS.home.base,
      providesTags: ['Home'],
    }),
  }),
});

export const { useGetHomeQuery, useLazyGetHomeQuery } = homeApi;
