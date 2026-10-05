import type { CategorySummary, SubCategorySummary, ProductImage, ApiResponse } from './Product.type';

export interface Banner {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HomeSubCategory {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface HomeCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  subcategories: HomeSubCategory[];
  _count?: {
    products: number;
    subcategories: number;
  };
}

export interface HomeProduct {
  id: number;
  name: string;
  slug: string;
  shortDescription: string | null;
  brand: string | null;
  basePrice: number;
  discountPrice: number | null;
  sellingPrice: number;
  averageRating: number;
  reviewCount: number;
  totalSold: number;
  totalViews: number;
  totalStock: number;
  availableStock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  category: CategorySummary;
  subCategory: SubCategorySummary | null;
  images: ProductImage[];
}

export interface HomePageData {
  banners: Banner[];
  featuredProducts: HomeProduct[];
  bestSellers: HomeProduct[];
  newArrivals: HomeProduct[];
  trendingProducts: HomeProduct[];
  categories: HomeCategory[];
}

export type HomeResponse = ApiResponse<HomePageData>;
