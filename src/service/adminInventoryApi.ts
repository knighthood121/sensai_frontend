import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  InventoryDashboardResponse,
  InventoryLogListResponse,
  InventoryLogQueryParams,
  LowStockResponse,
  LowStockQueryParams,
  VariantInventoryLogsResponse,
} from '../types/Inventory.type';

export const adminInventoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryDashboard: builder.query<InventoryDashboardResponse, number | void>({
      query: (threshold) => {
        const params = new URLSearchParams();
        if (threshold !== undefined && threshold !== null) {
          params.append('threshold', String(threshold));
        }
        return {
          url: ENDPOINTS.adminInventory.dashboard,
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: ['Inventory'],
    }),

    getInventoryLogs: builder.query<InventoryLogListResponse, InventoryLogQueryParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: ENDPOINTS.adminInventory.logs,
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: ['Inventory'],
    }),

    getLowStockVariants: builder.query<LowStockResponse, LowStockQueryParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: ENDPOINTS.adminInventory.lowStock,
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: ['Inventory'],
    }),

    getVariantInventoryLogs: builder.query<
      VariantInventoryLogsResponse,
      { productId: number; variantId: number; page?: number; limit?: number }
    >({
      query: ({ productId, variantId, page, limit }) => {
        const params = new URLSearchParams();
        if (page !== undefined && page !== null) {
          params.append('page', String(page));
        }
        if (limit !== undefined && limit !== null) {
          params.append('limit', String(limit));
        }
        return {
          url: ENDPOINTS.adminInventory.variantLogs(productId, variantId),
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: ['Inventory'],
    }),
  }),
});

export const {
  useGetInventoryDashboardQuery,
  useLazyGetInventoryDashboardQuery,
  useGetInventoryLogsQuery,
  useLazyGetInventoryLogsQuery,
  useGetLowStockVariantsQuery,
  useLazyGetLowStockVariantsQuery,
  useGetVariantInventoryLogsQuery,
  useLazyGetVariantInventoryLogsQuery,
} = adminInventoryApi;
