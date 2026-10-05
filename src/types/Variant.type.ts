import type { ApiResponse } from './Product.type';

export interface Variant {
  id: number;
  productId: number;
  size: string;
  color: string;
  sku: string;
  price: number | null;
  stock: number;
  reservedStock: number;
  availableStock: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Variant Item (used in batch create request body) ────────────────────────

export interface CreateVariantItem {
  size: string;
  color: string;
  sku: string;
  price?: number | null;
  stock?: number;
}

export interface CreateVariantRequest {
  variants: CreateVariantItem[];
}

export interface UpdateVariantRequest {
  size?: string;
  color?: string;
  sku?: string;
  price?: number | null;
  stock?: number;
}

// ─── Stock Operations ────────────────────────────────────────────────────────

export type InventoryAction = 'IN' | 'OUT' | 'RETURN' | 'CANCELLED' | 'MANUAL';

export interface UpdateStockRequest {
  action: InventoryAction;
  quantity: number;
  reference?: string;
  notes?: string;
}

export interface BulkStockItem {
  variantId: number;
  action: InventoryAction;
  quantity: number;
  reference?: string;
  notes?: string;
}

export interface BulkStockUpdateRequest {
  items: BulkStockItem[];
}

// ─── Stock Summary ───────────────────────────────────────────────────────────

export interface StockVariantSummary {
  id: number;
  sku: string;
  size: string;
  color: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
  price: number | null;
}

export interface StockSummary {
  productId: number;
  totalStock: number;
  totalReservedStock: number;
  totalAvailableStock: number;
  inStock: boolean;
  variants: StockVariantSummary[];
}

// ─── API Response Types ──────────────────────────────────────────────────────

export type VariantResponse = ApiResponse<Variant>;
export type VariantListResponse = ApiResponse<Variant[]>;
export type VariantMutationResponse = ApiResponse<Variant>;
export type VariantBatchMutationResponse = ApiResponse<Variant[]>;
export type StockSummaryResponse = ApiResponse<StockSummary>;
