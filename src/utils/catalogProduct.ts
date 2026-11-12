import type { Product, ProductVariant } from '../types/Product.type';

function numericValue(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const number = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function getCatalogPrice(product: Partial<Product>): number | null {
  return numericValue(product.sellingPrice ?? product.discountPrice ?? product.basePrice);
}

export function getVariantStock(variant: Partial<ProductVariant>): number | null {
  const stock = numericValue(variant.stock);
  const reserved = numericValue(variant.reservedStock);
  return stock === null || reserved === null ? null : Math.max(stock - reserved, 0);
}

export function getCatalogStock(product: Partial<Product>): number | null {
  const available = numericValue(product.availableStock);
  if (available !== null) return available;
  const total = numericValue(product.totalStock);
  const reserved = numericValue(product.totalReservedStock);
  if (total !== null && reserved !== null) return Math.max(total - reserved, 0);
  if (!product.variants?.length) return null;
  const amounts = product.variants.map(getVariantStock);
  return amounts.some((amount) => amount === null) ? null : amounts.reduce<number>((sum, amount) => sum + (amount ?? 0), 0);
}

// Match the backend cart's pricing precedence.
export function getCartUnitPrice(product: Partial<Product>, variant: Partial<ProductVariant>): number | null {
  return numericValue(product.discountPrice ?? variant.price ?? product.basePrice);
}

export function getCatalogImage(product: Partial<Product>): string | null {
  return product.images?.find((image) => image.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || null;
}

export function makeProductInquiry(product: Partial<Product>): string {
  const lines = ['Product: ' + (product.name || ''), 'Quantity Needed: '];
  if (product.sku) lines.push('SKU: ' + product.sku);
  if (product.material) lines.push('Material: ' + product.material);
  if (product.dimensions) lines.push('Dimensions: ' + product.dimensions);
  lines.push('Required Specifications: ', 'Target Delivery Date: ');
  return lines.join('\n');
}
