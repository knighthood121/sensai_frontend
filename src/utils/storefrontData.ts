import type { Banner } from '../types/Home.type';

// The API is authoritative; this also removes banners that expire while a page is open.
export function activeBanners(banners: Banner[], now = Date.now()): Banner[] {
  return banners.filter((banner) => {
    const start = banner.startDate ? Date.parse(banner.startDate) : -Infinity;
    const end = banner.endDate ? Date.parse(banner.endDate) : Infinity;
    return banner.isActive && start <= now && end >= now;
  }).sort((a, b) => a.displayOrder - b.displayOrder || b.createdAt.localeCompare(a.createdAt));
}

export function bannerDestination(link?: string | null): string | null {
  const value = link?.trim();
  if (!value) return null;
  if (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
