import type { ApiResponse } from './Product.type';

export interface Coupon {
  id: number;
  code: string;
  description: string | null;
  couponType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxDiscount: number | null;
  minOrderAmount: number | null;
  maxUsagePerUser: number;
  maxTotalUsage: number | null;
  totalUsed: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  description?: string | null;
  couponType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  maxUsagePerUser?: number;
  maxTotalUsage?: number | null;
  isActive?: boolean;
  expiresAt: string;
}

export interface UpdateCouponRequest {
  code?: string;
  description?: string | null;
  couponType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  maxUsagePerUser?: number;
  maxTotalUsage?: number | null;
  isActive?: boolean;
  expiresAt?: string;
}

export interface ValidateCouponRequest {
  code: string;
  orderAmount?: number;
}

export interface ValidateCouponResult {
  discount: number;
  finalAmount: number;
  // Allow frontend fallback reads
  [key: string]: any;
}

export type CouponResponse = ApiResponse<Coupon>;
export type CouponListResponse = ApiResponse<Coupon[]>;
export type CouponMutationResponse = ApiResponse<Coupon>;
export type ValidateCouponResponse = ApiResponse<ValidateCouponResult>;
