export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  slug: string;
  image: string | null;
  price: number;
  discountPrice: number | null;
  sellingPrice: number;
  averageRating: number;
  isActive: boolean;
  inStock: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  createdAt: string;
}

export interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
}

export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
  data: {
    action: 'added' | 'removed';
    productId: number;
    item?: WishlistItem;
  };
}
