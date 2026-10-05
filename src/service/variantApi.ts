import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  VariantResponse,
  VariantListResponse,
  VariantMutationResponse,
  VariantBatchMutationResponse,
  CreateVariantRequest,
  UpdateVariantRequest,
  UpdateStockRequest,
  BulkStockUpdateRequest,
  StockSummaryResponse,
} from '../types/Variant.type';
import type { DeleteResponse } from '../types/Product.type';

export const variantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Queries ──────────────────────────────────────────────────────────────

    listVariants: builder.query<VariantListResponse, number>({
      query: (productId) => ENDPOINTS.variants.base(productId),
      providesTags: (result) =>
        result && result.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'Variant' as const, id })),
            { type: 'Variant', id: 'LIST' },
          ]
          : [{ type: 'Variant', id: 'LIST' }],
    }),

    getVariantDetails: builder.query<VariantResponse, { productId: number; variantId: number }>({
      query: ({ productId, variantId }) => ENDPOINTS.variants.byId(productId, variantId),
      providesTags: (_result, _error, { variantId }) => [{ type: 'Variant', id: variantId }],
    }),

    getStockSummary: builder.query<StockSummaryResponse, number>({
      query: (productId) => ENDPOINTS.variants.stockSummary(productId),
      providesTags: (_result, _error, productId) => [
        { type: 'Variant', id: `STOCK_${productId}` },
      ],
    }),

    // ─── Mutations ────────────────────────────────────────────────────────────

    createVariants: builder.mutation<
      VariantBatchMutationResponse,
      { productId: number; data: CreateVariantRequest }
    >({
      query: ({ productId, data }) => ({
        url: ENDPOINTS.variants.base(productId),
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Variant', id: 'LIST' },
        { type: 'Variant', id: `STOCK_${productId}` },
        { type: 'Product', id: productId },
      ],
    }),

    updateVariant: builder.mutation<
      VariantMutationResponse,
      { productId: number; variantId: number; data: UpdateVariantRequest }
    >({
      query: ({ productId, variantId, data }) => ({
        url: ENDPOINTS.variants.byId(productId, variantId),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId, variantId }) => [
        { type: 'Variant', id: variantId },
        { type: 'Variant', id: 'LIST' },
        { type: 'Variant', id: `STOCK_${productId}` },
        { type: 'Product', id: productId },
      ],
    }),

    deleteVariant: builder.mutation<DeleteResponse, { productId: number; variantId: number }>({
      query: ({ productId, variantId }) => ({
        url: ENDPOINTS.variants.byId(productId, variantId),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { productId, variantId }) => [
        { type: 'Variant', id: variantId },
        { type: 'Variant', id: 'LIST' },
        { type: 'Variant', id: `STOCK_${productId}` },
        { type: 'Product', id: productId },
      ],
    }),

    updateVariantStock: builder.mutation<
      VariantMutationResponse,
      { productId: number; variantId: number; data: UpdateStockRequest }
    >({
      query: ({ productId, variantId, data }) => ({
        url: ENDPOINTS.variants.stock(productId, variantId),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId, variantId }) => [
        { type: 'Variant', id: variantId },
        { type: 'Variant', id: 'LIST' },
        { type: 'Variant', id: `STOCK_${productId}` },
        { type: 'Product', id: productId },
      ],
    }),

    bulkUpdateStock: builder.mutation<
      VariantBatchMutationResponse,
      { productId: number; data: BulkStockUpdateRequest }
    >({
      query: ({ productId, data }) => ({
        url: ENDPOINTS.variants.bulkStock(productId),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Variant', id: 'LIST' },
        { type: 'Variant', id: `STOCK_${productId}` },
        { type: 'Product', id: productId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListVariantsQuery,
  useLazyListVariantsQuery,
  useGetVariantDetailsQuery,
  useLazyGetVariantDetailsQuery,
  useGetStockSummaryQuery,
  useLazyGetStockSummaryQuery,
  useCreateVariantsMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useUpdateVariantStockMutation,
  useBulkUpdateStockMutation,
} = variantApi;
