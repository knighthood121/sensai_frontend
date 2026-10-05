import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  ProductListResponse,
  ProductDetailsResponse,
  ProductMutationResponse,
  CreateProductRequest,
  UpdateProductRequest,
  DeleteResponse,
  UploadProductImagesResponse,
  SavedProductImagesResponse,
  DeleteUploadedImagesRequest,
  AddProductImageUrlsRequest,
} from '../types/Product.type';

export interface ProductQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  category?: string;
  subCategoryId?: number;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  sort?:
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'best_selling'
  | 'top_rated'
  | 'popular'
  | 'featured';
}

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query<ProductListResponse, ProductQueryFilters | void>({
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
          url: ENDPOINTS.products.base,
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: (result) =>
        result && result.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
            { type: 'Product', id: 'LIST' },
          ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductDetails: builder.query<ProductDetailsResponse, string | number>({
      query: (identifier) => ENDPOINTS.products.details(identifier),
      providesTags: (_result, _error, identifier) => [
        { type: 'Product', id: identifier },
      ],
    }),

    getProductDetailsBySlug: builder.query<ProductDetailsResponse, string>({
      query: (slug) => ENDPOINTS.products.detailsBySlug(slug),
      providesTags: (_result, _error, slug) => [
        { type: 'Product', id: slug },
      ],
    }),

    createProduct: builder.mutation<ProductMutationResponse, CreateProductRequest>({
      query: (newProduct) => ({
        url: ENDPOINTS.products.base,
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<
      ProductMutationResponse,
      { id: number; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: ENDPOINTS.products.byId(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<DeleteResponse, number>({
      query: (id) => ({
        url: ENDPOINTS.products.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    uploadProductImages: builder.mutation<SavedProductImagesResponse, FormData>({
      query: (formData) => ({
        url: ENDPOINTS.products.imagesUpload,
        method: 'POST',
        body: formData,
      }),

      // Invalidates product details list as new product images are saved
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    uploadProductVideos: builder.mutation<{ success: boolean; data: any[] }, FormData>({
      query: (formData) => ({
        url: ENDPOINTS.products.videosUpload,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    uploadTempProductImages: builder.mutation<UploadProductImagesResponse, FormData>({
      query: (formData) => ({
        url: ENDPOINTS.products.imagesTempUpload,
        method: 'POST',
        body: formData,
      }),
    }),

    addProductImageUrls: builder.mutation<SavedProductImagesResponse, AddProductImageUrlsRequest>({
      query: (payload) => ({
        url: ENDPOINTS.products.imageUrls,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    deleteProductImages: builder.mutation<DeleteResponse, DeleteUploadedImagesRequest>({
      query: (deletePayload) => ({
        url: ENDPOINTS.products.imagesDelete,
        method: 'DELETE',
        body: deletePayload,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    listCategories: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => '/api/v1/categories',
      providesTags: ['Category'],
    }),

    createCategory: builder.mutation<{ success: boolean; data: any }, any>({
      query: (newCategory) => ({
        url: '/api/v1/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation<{ success: boolean; data: any }, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    deleteCategory: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/api/v1/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    listSubCategories: builder.query<{ success: boolean; data: any[] }, { categoryId?: number } | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters && filters.categoryId) {
          params.append('categoryId', String(filters.categoryId));
        }
        return {
          url: '/api/v1/subcategories',
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: ['SubCategory'],
    }),

    createSubCategory: builder.mutation<{ success: boolean; data: any }, any>({
      query: (newSubCategory) => ({
        url: '/api/v1/subcategories',
        method: 'POST',
        body: newSubCategory,
      }),
      invalidatesTags: ['SubCategory', 'Category'],
    }),

    updateSubCategory: builder.mutation<{ success: boolean; data: any }, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/subcategories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SubCategory', 'Category'],
    }),

    deleteSubCategory: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/api/v1/subcategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubCategory', 'Category'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListProductsQuery,
  useLazyListProductsQuery,
  useGetProductDetailsQuery,
  useLazyGetProductDetailsQuery,
  useGetProductDetailsBySlugQuery,
  useLazyGetProductDetailsBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useUploadProductVideosMutation,
  useUploadTempProductImagesMutation,
  useAddProductImageUrlsMutation,
  useDeleteProductImagesMutation,
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useListSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = productsApi;
