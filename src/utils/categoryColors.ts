import type { CSSProperties } from 'react';
import { CATEGORY_COLORS } from '../constant/categoryThemes';

export function getCategoryColorStyle(): CSSProperties {
  return {
    '--category-accent': CATEGORY_COLORS.accent,
    '--category-accent-ink': CATEGORY_COLORS.ink,
    '--category-accent-tint': CATEGORY_COLORS.tint,
  } as CSSProperties;
}
