import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  CategoriesDropdownResponse,
  SubCategoriesDropdownResponse,
  DistinctValuesResponse,
  SizesColorsResponse,
  ProductFormDataResponse,
  SubCategoriesDropdownParams,
  SizesColorsParams,
  ProductFormDataParams,
} from '../types/Dropdown.type';

export const dropdownApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Categories Dropdown ──────────────────────────────────────────────────
    getCategoriesDropdown: builder.query<CategoriesDropdownResponse, void>({
      query: () => ENDPOINTS.dropdowns.categories,
      providesTags: ['Dropdown'],
    }),

    // ─── Subcategories Dropdown ───────────────────────────────────────────────
    getSubCategoriesDropdown: builder.query<SubCategoriesDropdownResponse, SubCategoriesDropdownParams | void>({
      query: (params) => ({
        url: ENDPOINTS.dropdowns.subcategories,
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Dropdown'],
    }),

    // ─── Distinct Sizes Dropdown ──────────────────────────────────────────────
    getDistinctSizes: builder.query<DistinctValuesResponse, void>({
      query: () => ENDPOINTS.dropdowns.sizes,
      providesTags: ['Dropdown'],
    }),

    // ─── Distinct Colors Dropdown ─────────────────────────────────────────────
    getDistinctColors: builder.query<DistinctValuesResponse, void>({
      query: () => ENDPOINTS.dropdowns.colors,
      providesTags: ['Dropdown'],
    }),

    // ─── Product Sizes & Colors Dropdown ──────────────────────────────────────
    getProductSizesAndColors: builder.query<SizesColorsResponse, SizesColorsParams>({
      query: (params) => ({
        url: ENDPOINTS.dropdowns.sizesColors,
        method: 'GET',
        params,
      }),
      providesTags: (_result, _error, { productId }) => [
        { type: 'Dropdown', id: `SIZES_COLORS_${productId}` },
      ],
    }),

    // ─── Product Form Data Dropdown ───────────────────────────────────────────
    getProductFormData: builder.query<ProductFormDataResponse, ProductFormDataParams | void>({
      query: (params) => ({
        url: ENDPOINTS.dropdowns.productFormData,
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Dropdown'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesDropdownQuery,
  useLazyGetCategoriesDropdownQuery,
  useGetSubCategoriesDropdownQuery,
  useLazyGetSubCategoriesDropdownQuery,
  useGetDistinctSizesQuery,
  useLazyGetDistinctSizesQuery,
  useGetDistinctColorsQuery,
  useLazyGetDistinctColorsQuery,
  useGetProductSizesAndColorsQuery,
  useLazyGetProductSizesAndColorsQuery,
  useGetProductFormDataQuery,
  useLazyGetProductFormDataQuery,
} = dropdownApi;
