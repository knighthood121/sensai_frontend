import { api } from './api';

export type BulkInquiryStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'CLOSED';

export interface BulkInquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  requirements: string;
  status: BulkInquiryStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBulkInquiry {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  requirements: string;
}

export const bulkInquiryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBulkInquiry: builder.mutation<{ success: boolean; message: string; data: BulkInquiry }, CreateBulkInquiry>({
      query: (body) => ({ url: '/api/v1/bulk-inquiries', method: 'POST', body }),
      invalidatesTags: ['BulkInquiry'],
    }),
    getBulkInquiries: builder.query<{ success: boolean; data: BulkInquiry[] }, void>({
      query: () => '/api/v1/bulk-inquiries',
      providesTags: ['BulkInquiry'],
    }),
    updateBulkInquiry: builder.mutation<{ success: boolean; data: BulkInquiry }, { id: number; status: BulkInquiryStatus; adminNotes?: string }>({
      query: ({ id, ...body }) => ({ url: `/api/v1/bulk-inquiries/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BulkInquiry'],
    }),
  }),
});

export const { useCreateBulkInquiryMutation, useGetBulkInquiriesQuery, useUpdateBulkInquiryMutation } = bulkInquiryApi;
