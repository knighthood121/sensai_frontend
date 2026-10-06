// export const API_BASE_URL = 'http://localhost:3001';
export const API_BASE_URL = 'https://sensai-backend-nmbj.onrender.com';

export const ENDPOINTS = {
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    google: '/api/v1/auth/google',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    me: '/api/v1/auth/me',
  },
  products: {
    base: '/api/v1/products',
    imagesUpload: '/api/v1/products/images/upload',
    imageUrls: '/api/v1/products/images/url',
    imagesTempUpload: '/api/v1/products/images/temp-upload',
    imagesDelete: '/api/v1/products/images',
      videosUpload: '/api/v1/products/videos/upload',
    details: (identifier: string | number) => `/api/v1/products/${identifier}`,
    detailsBySlug: (slug: string) => `/api/v1/products/slug/${slug}`,
    byId: (id: number) => `/api/v1/products/${id}`,
  },
  variants: {
    base: (productId: number) => `/api/v1/products/${productId}/variants`,
    byId: (productId: number, variantId: number) => `/api/v1/products/${productId}/variants/${variantId}`,
    stockSummary: (productId: number) => `/api/v1/products/${productId}/variants/stock-summary`,
    bulkStock: (productId: number) => `/api/v1/products/${productId}/variants/bulk-stock`,
    stock: (productId: number, variantId: number) => `/api/v1/products/${productId}/variants/${variantId}/stock`,
  },
  coupons: {
    base: '/api/v1/coupons',
    byId: (id: number) => `/api/v1/coupons/${id}`,
    apply: '/api/v1/coupons/apply',
  },
  cart: {
    base: '/api/v1/cart',
    byId: (id: number) => `/api/v1/cart/${id}`,
    clear: '/api/v1/cart/clear',
  },
  wishlist: {
    base: '/api/v1/wishlist',
    byId: (productId: number) => `/api/v1/wishlist/${productId}`,
  },
  addresses: {
    base: '/api/v1/addresses',
    byId: (id: number) => `/api/v1/addresses/${id}`,
  },
  dropdowns: {
    categories: '/api/v1/dropdowns/categories',
    subcategories: '/api/v1/dropdowns/subcategories',
    sizes: '/api/v1/dropdowns/sizes',
    colors: '/api/v1/dropdowns/colors',
    sizesColors: '/api/v1/dropdowns/sizes-colors',
    productFormData: '/api/v1/dropdowns/product-form-data',
  },
  checkout: {
    base: '/api/v1/checkout',
  },
  payments: {
    verify: '/api/v1/payments/verify',
    failure: '/api/v1/payments/failure',
  },
  orders: {
    base: '/api/v1/orders',
    byId: (id: number) => `/api/v1/orders/${id}`,
    cancel: (id: number) => `/api/v1/orders/${id}/cancel`,
  },
  home: {
    base: '/api/v1/home',
  },
  adminDashboard: {
    base: '/api/v1/admin/dashboard',
  },
  adminOrders: {
    base: '/api/v1/admin/orders',
    byId: (id: number) => `/api/v1/admin/orders/${id}`,
    updateStatus: (id: number) => `/api/v1/admin/orders/${id}/status`,
  },
  adminInventory: {
    dashboard: '/api/v1/admin/inventory/dashboard',
    logs: '/api/v1/admin/inventory/logs',
    lowStock: '/api/v1/admin/inventory/low-stock',
    variantLogs: (productId: number, variantId: number) =>
      `/api/v1/admin/inventory/products/${productId}/variants/${variantId}/logs`,
  },
  reviews: {
    base: '/api/v1/reviews',
    byId: (id: number) => `/api/v1/reviews/${id}`,
    helpful: (id: number) => `/api/v1/reviews/${id}/helpful`,
    productReviews: (productId: number) => `/api/v1/products/${productId}/reviews`,
    myReview: (productId: number) => `/api/v1/products/${productId}/reviews/mine`,
  },
  adminReviews: {
    base: '/api/v1/admin/reviews',
    byId: (id: number) => `/api/v1/admin/reviews/${id}`,
  },
  tickets: {
    base: '/api/v1/tickets',
    byId: (id: number) => `/api/v1/tickets/${id}`,
    close: (id: number) => `/api/v1/tickets/${id}/close`,
  },
  adminTickets: {
    base: '/api/v1/admin/tickets',
    byId: (id: number) => `/api/v1/admin/tickets/${id}`,
  },
};
