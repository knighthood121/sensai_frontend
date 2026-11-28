import { api } from './api';
import type { OrderStatus } from '../types/order.type';

export interface OrderDocument {
  id: number;
  orderId: number;
  stage: OrderStatus;
  title: string;
  originalName: string;
  mimeType: string;
  bytes: number;
  createdAt: string;
}
type OrderKey = { orderId: number; admin?: boolean };
const base = ({ orderId, admin }: OrderKey) => `/api/v1/${admin ? 'admin/' : ''}orders/${orderId}/documents`;

export const orderDocumentApi = api.injectEndpoints({
  endpoints: builder => ({
    getOrderDocuments: builder.query<{ success: boolean; data: OrderDocument[] }, OrderKey>({
      query: key => base(key),
      providesTags: (_result, _error, { orderId }) => [{ type: 'OrderDocument', id: orderId }],
    }),
    uploadOrderDocument: builder.mutation<{ success: boolean; data: OrderDocument }, { orderId: number; body: FormData }>({
      query: ({ orderId, body }) => ({ url: base({ orderId, admin: true }), method: 'POST', body }),
      invalidatesTags: (_result, _error, { orderId }) => [{ type: 'OrderDocument', id: orderId }],
    }),
    getOrderDocumentDownload: builder.query<{ success: boolean; data: { url: string; fileName: string } }, OrderKey & { documentId: number }>({
      query: key => `${base(key)}/${key.documentId}/download`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetOrderDocumentsQuery, useUploadOrderDocumentMutation, useLazyGetOrderDocumentDownloadQuery } = orderDocumentApi;
