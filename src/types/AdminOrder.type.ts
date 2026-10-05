import type { Pagination } from './Product.type';
import type { PaymentStatus, PaymentMethod } from './Payment.type';
import type { OrderStatus } from './order.type';

export interface AdminOrderCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface AdminOrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size: string | null;
  color: string | null;
  productId: number;
  productName: string;
  productSlug: string;
  productImage: string | null;
}

export interface AdminOrderPaymentRecord {
  id: number;
  paymentMethod: string;
  transactionId: string | null;
  amount: number;
  status: string;
  errorMessage: string | null;
  retries: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderTimeline {
  id: number;
  status: string;
  notes: string | null;
  changedByAdminId: number | null;
  createdAt: string;
}

export interface AdminOrderAddress {
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

export interface AdminOrderSummary {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCharges: number;
  totalAmount: number;
  couponCode: string | null;
  shippingTrackingId: string | null;
  createdAt: string;
  updatedAt: string;
  customer: AdminOrderCustomer;
  items: AdminOrderItem[];
  address?: AdminOrderAddress | null;
}

export interface AdminOrderDetail extends AdminOrderSummary {
  addressId: number | null;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  customerNotes: string | null;
  internalNotes: string | null;
  address: AdminOrderAddress | null;
  payment: AdminOrderPaymentRecord | null;
  timelines: AdminOrderTimeline[];
}

export interface AdminOrderListQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: number;
  search?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
  shippingTrackingId?: string;
}

export interface AdminOrderListResponse {
  success: boolean;
  data: AdminOrderSummary[];
  pagination: Pagination;
}

export interface AdminOrderDetailResponse {
  success: boolean;
  data: AdminOrderDetail;
}

export interface AdminOrderStatusUpdateResponse {
  success: boolean;
  message: string;
  data: AdminOrderDetail;
}
