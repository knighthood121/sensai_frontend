import { useState, useEffect, useCallback } from 'react';

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  imageUrl?: string;
  accentColor?: string;
  location: 'Homepage Hero' | 'Category Top' | 'Promo Strip';
  status: 'Active' | 'Inactive';
  order: number;
  highlightWords?: string;
  badgeText?: string;
  createdAt: string;
  updatedAt: string;
}

export const STORAGE_KEY_BANNERS = 'sensai_marketing_banners';
export const BANNER_UPDATED_EVENT = 'sansai_banners_updated';

// In-memory cache for live fallback
let inMemoryBanners: BannerItem[] | null = null;

/**
 * Automatically compress any image file or data URL down to max 1600px width/height and quality 0.82
 * Outputting a lightweight WebP/JPEG data URL (<150KB) that safely fits in localStorage!
 */
export async function compressImageToDataUrl(
  fileOrDataUrl: File | string,
  maxWidth = 1600,
  maxHeight = 900,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoad = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      try {
        const webpUrl = canvas.toDataURL('image/webp', quality);
        if (webpUrl && webpUrl.startsWith('data:image/webp')) {
          resolve(webpUrl);
          return;
        }
      } catch {}
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onload = handleLoad;
    img.onerror = () => {
      if (typeof fileOrDataUrl === 'string') {
        resolve(fileOrDataUrl);
      } else {
        reject(new Error('Failed to load image for compression'));
      }
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          img.src = reader.result;
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

export const DEFAULT_BANNERS: BannerItem[] = [];

/**
 * Retrieve all banners from localStorage
 */
export function getStoredBanners(): BannerItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANNERS);
    if (!raw) {
      return inMemoryBanners || [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const sorted = parsed.sort((a, b) => a.order - b.order).map((b) => {
        const img = b.image || b.imageUrl || '';
        return {
          ...b,
          image: img,
          imageUrl: img,
        };
      });
      inMemoryBanners = sorted;
      return sorted;
    }
  } catch (err) {
    console.error('Failed to read banners from localStorage:', err);
  }
  return inMemoryBanners || [];
}

/**
 * Save banners to localStorage and dispatch event
 */
export function saveStoredBanners(banners: BannerItem[]): void {
  const sorted = [...banners].sort((a, b) => a.order - b.order).map((b) => {
    const finalImg = b.image || b.imageUrl || '';
    return {
      ...b,
      image: finalImg,
      imageUrl: finalImg,
    };
  });
  inMemoryBanners = sorted;
  try {
    localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(sorted));
  } catch (err) {
    console.warn('LocalStorage quota limit reached, maintaining memory cache:', err);
  }
  window.dispatchEvent(new CustomEvent(BANNER_UPDATED_EVENT, { detail: sorted }));
}

/**
 * Add a new banner
 */
export function addBanner(data: Omit<BannerItem, 'id' | 'createdAt' | 'updatedAt'>): BannerItem {
  const banners = getStoredBanners();
  const now = new Date().toISOString();
  const newBanner: BannerItem = {
    ...data,
    imageUrl: data.image,
    id: `ban-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };
  banners.push(newBanner);
  saveStoredBanners(banners);
  return newBanner;
}

/**
 * Update an existing banner
 */
export function updateBanner(id: string, updates: Partial<BannerItem>): BannerItem | null {
  const banners = getStoredBanners();
  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const imageVal = updates.image ?? banners[index].image;
  const updated: BannerItem = {
    ...banners[index],
    ...updates,
    image: imageVal,
    imageUrl: updates.imageUrl ?? imageVal,
    id, // protect id
    updatedAt: new Date().toISOString(),
  };

  banners[index] = updated;
  saveStoredBanners(banners);
  return updated;
}

/**
 * Delete a banner
 */
export function deleteBanner(id: string): boolean {
  const banners = getStoredBanners();
  const filtered = banners.filter((b) => b.id !== id);
  if (filtered.length === banners.length) return false;
  saveStoredBanners(filtered);
  return true;
}

/**
 * Toggle Active / Inactive status
 */
export function toggleBannerStatus(id: string): BannerItem | null {
  const banners = getStoredBanners();
  const banner = banners.find((b) => b.id === id);
  if (!banner) return null;

  const nextStatus = banner.status === 'Active' ? 'Inactive' : 'Active';
  return updateBanner(id, { status: nextStatus });
}

/**
 * Reorder banners
 */
export function reorderBanners(orderedBanners: BannerItem[]): void {
  const updated = orderedBanners.map((b, idx) => ({
    ...b,
    order: idx + 1,
    updatedAt: new Date().toISOString(),
  }));
  saveStoredBanners(updated);
}

/**
 * Reset banners to initial default
 */
export function resetBannersToDefault(): BannerItem[] {
  saveStoredBanners(DEFAULT_BANNERS);
  return DEFAULT_BANNERS;
}

/**
 * React Hook for real-time banner synchronization
 */
export function useBanners() {
  const [banners, setBanners] = useState<BannerItem[]>(() => getStoredBanners());

  const refresh = useCallback(() => {
    setBanners(getStoredBanners());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      refresh();
    };

    window.addEventListener(BANNER_UPDATED_EVENT, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(BANNER_UPDATED_EVENT, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refresh]);

  const activeHeroBanners = banners.filter(
    (b) => b.status === 'Active' && b.location === 'Homepage Hero'
  );

  return {
    banners,
    activeHeroBanners,
    refresh,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
    resetBannersToDefault,
  };
}
