import type { ProductVariant } from '../types/Product.type';

export function selectedProductVariant(variants: ProductVariant[], size: string, color: string) {
  return variants.find((variant) => variant.size === size && variant.color === color);
}

