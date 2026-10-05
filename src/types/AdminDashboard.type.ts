import type { ApiResponse } from './Product.type';

export interface AdminDashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  totalStock: number;
  reservedStock: number;
  lowStock: number;
}

export interface DashboardSalesPoint {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface DashboardCategory {
  id: number;
  name: string;
  products: number;
}

export interface DashboardRecentOrder {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  user: { name: string; email: string };
}

export interface AdminDashboardData {
  summary: AdminDashboardSummary;
  monthlySales: DashboardSalesPoint[];
  categoryDistribution: DashboardCategory[];
  recentOrders: DashboardRecentOrder[];
}

export type AdminDashboardResponse = ApiResponse<AdminDashboardData>;
