import type { CSSProperties } from 'react';

const categoryAccents = [
  { color: '#00afd0', ink: '#00788f', tint: '#ecfafd' },
  { color: '#a9c900', ink: '#5b7500', tint: '#f4f8df' },
  { color: '#7d2758', ink: '#7d2758', tint: '#f8eff4' },
  { color: '#edbd00', ink: '#926b00', tint: '#fff9df' },
  { color: '#e30613', ink: '#bd0510', tint: '#fff2f3' },
];

export function getCategoryColorStyle(categoryId?: number | null): CSSProperties {
  // Identity-based colors stay consistent across menus, filters, and paginated results.
  const index = categoryId != null && Number.isSafeInteger(categoryId) && categoryId > 0
    ? (categoryId - 1) % categoryAccents.length
    : categoryAccents.length - 1;
  const accent = categoryAccents[index];
  return {
    '--category-accent': accent.color,
    '--category-accent-ink': accent.ink,
    '--category-accent-tint': accent.tint,
  } as CSSProperties;
}
