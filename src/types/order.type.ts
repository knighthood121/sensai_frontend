import type { Pagination } from './Product.type';
import type { PaymentStatus, PaymentMethod } from './Payment.type';

// ─── Enums ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

// ─── Models ─────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: number;
  productId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size: string;
  color: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
}

export interface OrderTimeline {
  id: number;
  status: string;
  notes: string | null;
  changedByAdminId: number | null;
  createdAt: string;
}

export interface PaymentRecord {
  id: number;
  paymentMethod: string;
  transactionId: string | null;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderAddress {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCharges: number;
  totalAmount: number;
  couponCode: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address?: OrderAddress | null;
  shippingTrackingId?: string | null;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  customerNotes?: string | null;
}

export interface OrderDetail extends OrderSummary {
  addressId: number;
  shippingTrackingId: string | null;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  customerNotes: string | null;
  address: OrderAddress;
  payment: PaymentRecord | null;
  timelines: OrderTimeline[];
}

// ─── Order Query & Response Types ───────────────────────────────────────────

export interface OrderListQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export interface OrderListResponse {
  success: boolean;
  data: OrderSummary[];
  pagination: Pagination;
}

export interface OrderDetailResponse {
  success: boolean;
  data: OrderDetail;
}

export interface CancelOrderRequest {
  reason: string;
}

export interface CancelOrderResponseData {
  orderId: number;
  orderNumber: string;
  status: string;
  message?: string;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
  data: CancelOrderResponseData;
}
