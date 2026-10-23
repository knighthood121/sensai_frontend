import type { Pagination } from './Product.type';

export interface CustomerSummary {
  id: number;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface CustomerRecentOrder {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  itemsCount: number;
}

export interface CustomerAddress {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CustomerDetail extends CustomerSummary {
  initials: string;
  since: string;
  addresses: CustomerAddress[];
  recentOrders: CustomerRecentOrder[];
}

export interface CustomerListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
}

export interface CustomerListResponse {
  success: boolean;
  data: CustomerSummary[];
  pagination: Pagination;
}

export interface CustomerDetailResponse {
  success: boolean;
  data: CustomerDetail;
}
