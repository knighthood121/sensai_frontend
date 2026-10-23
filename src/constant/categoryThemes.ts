export interface CategoryTheme {
  stripeColor: string;
  image: string;
}

const CATEGORY_THEMES_BY_KEYWORD: Array<{ match: RegExp; theme: CategoryTheme }> = [
  { match: /end\s*mill/i, theme: { stripeColor: '#00A3E0', image: '/images/tools/flat-end-mill.jpg' } },
  { match: /wood/i, theme: { stripeColor: '#C4D600', image: '/images/tools/flat-wood-drill.jpg' } },
  { match: /masonry/i, theme: { stripeColor: '#682145', image: '/images/tools/masonry-drill.jpg' } },
  { match: /glass|tile/i, theme: { stripeColor: '#FFCC00', image: '/images/tools/glass-tile-drill.jpg' } },
  { match: /tap/i, theme: { stripeColor: '#DC2626', image: '/images/tools/hand-taps.jpg' } },
];

export const DEFAULT_CATEGORY_THEMES: CategoryTheme[] = [
  { stripeColor: '#00A3E0', image: '/images/tools/flat-end-mill.jpg' },
  { stripeColor: '#C4D600', image: '/images/tools/flat-wood-drill.jpg' },
  { stripeColor: '#682145', image: '/images/tools/masonry-drill.jpg' },
  { stripeColor: '#FFCC00', image: '/images/tools/glass-tile-drill.jpg' },
  { stripeColor: '#DC2626', image: '/images/tools/hand-taps.jpg' },
];

export function getCategoryTheme(nameOrSlug: string = '', index: number = 0): CategoryTheme {
  for (const item of CATEGORY_THEMES_BY_KEYWORD) {
    if (item.match.test(nameOrSlug)) {
      return item.theme;
    }
  }
  return DEFAULT_CATEGORY_THEMES[index % DEFAULT_CATEGORY_THEMES.length];
}
