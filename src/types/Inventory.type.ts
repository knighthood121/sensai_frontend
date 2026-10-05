import type { Pagination } from './Product.type';

export type InventoryAction = 'IN' | 'OUT' | 'RETURN' | 'CANCELLED' | 'MANUAL';

export interface InventoryLog {
  id: number;
  productId: number;
  productName: string | null;
  productSku: string | null;
  variantId: number;
  variantSku: string | null;
  variantSize: string | null;
  variantColor: string | null;
  action: InventoryAction;
  quantityChanged: number;
  previousStock: number;
  newStock: number;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export interface LowStockVariant {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productSlug: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
}

export interface VariantStockInfo {
  id: number;
  sku: string;
  size: string;
  color: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
}

export interface InventoryDashboardSummary {
  totalVariants: number;
  totalStock: number;
  totalReserved: number;
  totalAvailable: number;
  outOfStockVariants: number;
  lowStockVariants: number;
  lowStockThreshold: number;
}

export interface InventoryDashboardActivity {
  periodDays: number;
  byAction: Record<string, { count: number; totalQty: number }>;
}

export interface InventoryLogQueryParams {
  page?: number;
  limit?: number;
  productId?: number;
  variantId?: number;
  action?: InventoryAction;
  reference?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LowStockQueryParams {
  threshold?: number;
  page?: number;
  limit?: number;
}

export interface VariantLogsQueryParams {
  page?: number;
  limit?: number;
}

export interface InventoryLogListResponse {
  success: boolean;
  data: InventoryLog[];
  pagination: Pagination;
}

export interface VariantInventoryLogsResponse {
  success: boolean;
  data: {
    variant: VariantStockInfo;
    logs: InventoryLog[];
    pagination: Pagination;
  };
}

export interface LowStockResponse {
  success: boolean;
  data: {
    threshold: number;
    variants: LowStockVariant[];
    total: number;
  };
}

export interface InventoryDashboardResponse {
  success: boolean;
  data: {
    summary: InventoryDashboardSummary;
    recentActivity: InventoryDashboardActivity;
  };
}
