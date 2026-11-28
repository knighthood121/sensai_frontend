import { api } from './api';

export interface ProductImportReport {
  rowCount: number;
  productCount: number;
  imported: number;
  preview: { row: number; name: string; sku: string; categoryId: number; basePrice: number; variants: number; stock: number }[];
  errors: { row: number; field: string; message: string }[];
}
export const productImportApi = api.injectEndpoints({
  endpoints: builder => ({
    previewProductImport: builder.mutation<{ success: boolean; data: ProductImportReport }, FormData>({
      query: body => ({ url: '/api/v1/products/import/preview', method: 'POST', body }),
    }),
    confirmProductImport: builder.mutation<{ success: boolean; data: ProductImportReport }, FormData>({
      query: body => ({ url: '/api/v1/products/import/confirm', method: 'POST', body }),
      invalidatesTags: result => result?.success ? ['Product', 'Variant', 'Category', 'SubCategory', 'Home', 'Inventory', 'Dashboard', 'Dropdown'] : [],
    }),
  }),
});
export const { usePreviewProductImportMutation, useConfirmProductImportMutation } = productImportApi;
