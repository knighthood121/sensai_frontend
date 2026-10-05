export interface CartItem {
  id: number;
  productId: number;
  variantId: number;
  quantity: number;
  productName: string;
  slug: string;
  image: string | null;
  price: number;
  discountPrice: number | null;
  sellingPrice: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
  itemTotal: number;
}

export interface CartData {
  items: CartItem[];
  totalItems: number;
  cartTotal: number;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: CartData;
}

export interface SingleCartItemResponse {
  success: boolean;
  message?: string;
  data: CartItem;
}

export interface AddToCartRequest {
  productId: number;
  variantId: number;
  quantity: number;
}
