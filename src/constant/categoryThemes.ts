export interface CategoryTheme {
  stripeColor: string;
  image: string;
}

export const CATEGORY_COLORS = {
  accent: '#e30613',
  ink: '#bd0510',
  tint: '#fff2f3',
};

const CATEGORY_THEMES_BY_KEYWORD: Array<{ match: RegExp; theme: CategoryTheme }> = [
  { match: /end\s*mill/i, theme: { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/flat-end-mill.jpg' } },
  { match: /wood/i, theme: { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/flat-wood-drill.jpg' } },
  { match: /masonry/i, theme: { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/masonry-drill.jpg' } },
  { match: /glass|tile/i, theme: { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/glass-tile-drill.jpg' } },
  { match: /tap/i, theme: { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/hand-taps.jpg' } },
];

export const DEFAULT_CATEGORY_THEMES: CategoryTheme[] = [
  { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/flat-end-mill.jpg' },
  { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/flat-wood-drill.jpg' },
  { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/masonry-drill.jpg' },
  { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/glass-tile-drill.jpg' },
  { stripeColor: CATEGORY_COLORS.accent, image: '/images/tools/hand-taps.jpg' },
];

export function getCategoryTheme(nameOrSlug: string = '', index: number = 0): CategoryTheme {
  for (const item of CATEGORY_THEMES_BY_KEYWORD) {
    if (item.match.test(nameOrSlug)) {
      return item.theme;
    }
  }
  return DEFAULT_CATEGORY_THEMES[index % DEFAULT_CATEGORY_THEMES.length];
}
