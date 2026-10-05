import type { Pagination } from './Product.type';

export interface ReviewUser {
  id: number;
  name: string;
  profileImage: string | null;
}

export interface ReviewProduct {
  id: number;
  name: string;
  slug: string;
}

export interface ReviewData {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string | null;
  images: string[];
  verified: boolean;
  isApproved: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  user?: ReviewUser;
  product?: ReviewProduct;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  images?: string[];
}

export interface ProductReviewsQueryParams {
  page?: number;
  limit?: number;
  rating?: number;
  verified?: boolean;
}

export interface AdminReviewListQueryParams {
  page?: number;
  limit?: number;
  productId?: number;
  userId?: number;
  rating?: number;
  isApproved?: boolean;
  verified?: boolean;
}

export interface RatingDistribution {
  [key: number]: number;
}

export interface ReviewMutationResponse {
  success: boolean;
  message: string;
  data: ReviewData;
}

export interface ProductReviewsResponse {
  success: boolean;
  data: ReviewData[];
  ratingDistribution: RatingDistribution;
  pagination: Pagination;
}

export interface MyReviewResponse {
  success: boolean;
  data: ReviewData;
}

export interface ReviewHelpfulResponse {
  success: boolean;
  message: string;
  data: {
    helpful: number;
  };
}

export interface AdminReviewListResponse {
  success: boolean;
  data: ReviewData[];
  pagination: Pagination;
}

export interface AdminReviewDetailResponse {
  success: boolean;
  data: ReviewData;
}
