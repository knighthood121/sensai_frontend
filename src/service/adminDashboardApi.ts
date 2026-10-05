import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type { AdminDashboardResponse } from '../types/AdminDashboard.type';

export const adminDashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboardResponse, void>({
      query: () => ENDPOINTS.adminDashboard.base,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetAdminDashboardQuery } = adminDashboardApi;
