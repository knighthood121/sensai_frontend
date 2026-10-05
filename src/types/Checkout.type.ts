import type { PaymentMethod } from './Payment.type';

// ─── Checkout Types ─────────────────────────────────────────────────────────

export interface CheckoutRequest {
  addressId: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
}

export interface CheckoutOrderData {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCharges: number;
  totalAmount: number;
  couponCode: string | null;
  createdAt: string;
}

export interface CheckoutPaymentData {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
}

export interface CheckoutResponseData {
  order: CheckoutOrderData;
  payment: CheckoutPaymentData | null;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: CheckoutResponseData;
}
