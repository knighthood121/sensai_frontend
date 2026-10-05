export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'RAZORPAY' | 'COD';

export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface PaymentVerifyResponseData {
    orderId: number;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
}

export interface PaymentVerifyResponse {
    success: boolean;
    message: string;
    data: PaymentVerifyResponseData;
}

export interface PaymentFailureRequest {
    razorpay_order_id: string;
    errorCode?: string;
    errorDescription?: string;
}

export interface PaymentFailureResponseData {
    orderId: number;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    message?: string;
}

export interface PaymentFailureResponse {
    success: boolean;
    message: string;
    data: PaymentFailureResponseData;
}
