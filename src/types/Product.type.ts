// Generic API Envelope
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// Product Sub-models
export interface CategorySummary {
    id: number;
    name: string;
    slug: string;
    isActive: boolean;
}

export interface SubCategorySummary {
    id: number;
    name: string;
    slug: string;
    isActive: boolean;
}

export interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    publicId: string | null;
    blurHash: string | null;
    altText: string | null;
    isPrimary: boolean;
    displayOrder: number;
    createdAt: string;
}

export interface ProductVideo {
    id: number;
    productId?: number;
    videoUrl: string;
    thumbnailUrl: string | null;
    publicId: string | null;
    title: string | null;
    displayOrder: number;
    createdAt: string;
}

export interface ProductVariant {
    id: number;
    size: string;
    color: string;
    sku: string;
    price: number | null;
    stock: number;
    reservedStock: number;
    createdAt: string;
    updatedAt: string;
}

export interface StockVariant {
    id: number;
    sku: string;
    size: string;
    color: string;
    stock: number;
    reservedStock: number;
    availableStock: number;
    price: number | null;
}

export interface StockSummary {
    totalStock: number;
    totalReservedStock: number;
    availableStock: number;
    inStock: boolean;
    variants: StockVariant[];
}

export interface ReviewUser {
    id: number;
    name: string;
    profileImage: string | null;
}

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    images: string[];
    verified: boolean;
    helpful: number;
    createdAt: string;
    updatedAt: string;
    user: ReviewUser;
}

export interface Product {
    id: number;
    categoryId: number;
    subCategoryId: number | null;
    name: string;
    slug: string;
    shortDescription: string | null;
    description: string;
    fabricType: string | null;
    fitType: string | null;
    careInstructions: string | null;
    material: string | null;
    finish: string | null;
    dimensions: string | null;
    packQuantity: number;
    unitOfMeasure: string | null;
    brand: string | null;
    sku: string;
    basePrice: number;
    discountPrice: number | null;
    sellingPrice: number;
    costPrice: number | null;
    weight: number | null;
    tags: string[];
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    canonicalUrl: string | null;
    totalViews: number;
    totalSold: number;
    averageRating: number;
    reviewCount: number;
    totalStock: number;
    totalReservedStock: number;
    availableStock: number;
    isActive: boolean;
    isFeatured: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    category?: CategorySummary;
    subCategory?: SubCategorySummary;
    images: ProductImage[];
    videos: ProductVideo[];
    variants: ProductVariant[];
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ProductUploadResult {
    imageUrl: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    originalName: string;
}

export interface ProductDetailsData {
    product: Product;
    images: ProductImage[];
    variants: ProductVariant[];
    stock: StockSummary;
    reviews: Review[];
    reviewCount: number;
    averageRating: number;
    relatedProducts: Product[];
}

// Product Requests and Payload Types
export interface ProductImageInput {
    id?: number;
    imageUrl: string;
    publicId?: string | null;
    blurHash?: string | null;
    altText?: string;
    isPrimary?: boolean;
    displayOrder?: number;
}

export interface ProductVideoInput {
    id?: number;
    videoUrl: string;
    thumbnailUrl?: string | null;
    publicId?: string | null;
    title?: string | null;
    displayOrder?: number;
}

export interface ProductVariantInput {
    id?: number;
    size: string;
    color: string;
    sku: string;
    price?: number | null;
    stock: number;
    reservedStock?: number;
}

export interface CreateProductRequest {
    categoryId: number;
    subCategoryId?: number | null;
    name: string;
    slug?: string;
    shortDescription?: string;
    description: string;
    fabricType?: string;
    fitType?: string;
    careInstructions?: string;
    material?: string;
    finish?: string;
    dimensions?: string;
    packQuantity?: number;
    unitOfMeasure?: string;
    brand?: string;
    sku: string;
    basePrice: number;
    discountPrice?: number | null;
    costPrice?: number | null;
    weight?: number | null;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    canonicalUrl?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    images?: ProductImageInput[];
    videos?: ProductVideoInput[];
    variants?: ProductVariantInput[];
}

export interface UpdateProductRequest {
    categoryId?: number;
    subCategoryId?: number | null;
    name?: string;
    slug?: string;
    shortDescription?: string | null;
    description?: string;
    fabricType?: string | null;
    fitType?: string | null;
    careInstructions?: string | null;
    material?: string | null;
    finish?: string | null;
    dimensions?: string | null;
    packQuantity?: number;
    unitOfMeasure?: string | null;
    brand?: string | null;
    sku?: string;
    basePrice?: number;
    discountPrice?: number | null;
    costPrice?: number | null;
    weight?: number | null;
    tags?: string[] | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;
    canonicalUrl?: string | null;
    isActive?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    images?: ProductImageInput[];
    videos?: ProductVideoInput[];
    removeImageIds?: number[];
    variants?: ProductVariantInput[];
    removeVariantIds?: number[];
}

export interface DeleteUploadedImagesRequest {
    publicIds: string[];
}

export interface AddProductImageUrlsRequest {
    productId: number;
    images: ProductImageInput[];
}

// Product Specific Responses
export type ProductResponse = ApiResponse<Product>;
export type ProductMutationResponse = ApiResponse<Product>;

export interface ProductListResponse extends ApiResponse<Product[]> {
    pagination: Pagination;
}

export type ProductDetailsResponse = ApiResponse<ProductDetailsData>;
export type UploadProductImagesResponse = ApiResponse<(ProductImage | ProductUploadResult)[]>;
export type SavedProductImagesResponse = ApiResponse<ProductImage[]>;

// Shared Utility Responses
export interface DeleteResponse {
    success: boolean;
    message: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    details?: Record<string, unknown> | null;
    errors?: string[];
}
