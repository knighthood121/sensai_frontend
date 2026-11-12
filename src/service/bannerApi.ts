import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type { Banner } from '../types/Home.type';

export type DbBanner = Banner;

export interface CreateBannerRequest {
  title: string;
  description?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  isActive?: boolean;
  displayOrder?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface BannerListResponse {
  success: boolean;
  data: DbBanner[];
  message?: string;
}

export interface BannerSingleResponse {
  success: boolean;
  data: DbBanner;
  message?: string;
}

export const bannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBanners: builder.query<BannerListResponse, void>({
      query: () => ENDPOINTS.adminBanners.base,
      providesTags: ['Banner'],
    }),

    createBanner: builder.mutation<BannerSingleResponse, CreateBannerRequest>({
      query: (body) => ({
        url: ENDPOINTS.adminBanners.base,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Banner', 'Home'],
    }),

    updateBanner: builder.mutation<BannerSingleResponse, { id: number | string; data: Partial<CreateBannerRequest> }>({
      query: ({ id, data }) => ({
        url: ENDPOINTS.adminBanners.byId(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Banner', 'Home'],
    }),

    deleteBanner: builder.mutation<{ success: boolean; message?: string }, number | string>({
      query: (id) => ({
        url: ENDPOINTS.adminBanners.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner', 'Home'],
    }),
  }),
});

export const {
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
