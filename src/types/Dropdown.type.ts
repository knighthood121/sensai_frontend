import type { ApiResponse } from './Product.type';

// ─── Dropdown Item Types ─────────────────────────────────────────────────────

export interface CategoryDropdownItem {
  id: number;
  name: string;
  slug: string;
}

export interface SubCategoryDropdownItem {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

export interface DistinctValueItem {
  value: string;
  count: number;
}

export interface SizesColorsResult {
  sizes: DistinctValueItem[];
  colors: DistinctValueItem[];
}

export interface ProductFormData {
  categories: CategoryDropdownItem[];
  subcategories: SubCategoryDropdownItem[];
  sizes: DistinctValueItem[];
  colors: DistinctValueItem[];
}

// ─── Query Param Types ───────────────────────────────────────────────────────

export interface SubCategoriesDropdownParams {
  categoryId?: number;
}

export interface SizesColorsParams {
  productId: number;
}

export interface ProductFormDataParams {
  categoryId?: number;
}

// ─── API Response Types ──────────────────────────────────────────────────────

export type CategoriesDropdownResponse = ApiResponse<CategoryDropdownItem[]>;
export type SubCategoriesDropdownResponse = ApiResponse<SubCategoryDropdownItem[]>;
export type DistinctValuesResponse = ApiResponse<DistinctValueItem[]>;
export type SizesColorsResponse = ApiResponse<SizesColorsResult>;
export type ProductFormDataResponse = ApiResponse<ProductFormData>;
