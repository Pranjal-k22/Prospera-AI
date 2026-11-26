/**
 * Global Brand Configuration for Prospera AI / Lumora
 * Easily change the product name in this single location.
 */
export const BRAND_NAME = "Prospera";
export const BRAND_FULL_NAME = `${BRAND_NAME} AI`;
export const BRAND_TAGLINE = "Find your next home in India";

/**
 * Derives a namespaced localStorage key from BRAND_NAME
 * Automatically migrates legacy keys (e.g. 'prospera-favorites' -> '${brandKey}-favorites')
 * so user saved items, tabs, and preferences survive rebranding.
 */
export function getStorageKey(suffix: string): string {
  const brandKey = BRAND_NAME.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const currentKey = `${brandKey}-${suffix}`;
  const legacyKey = `prospera-${suffix}`;

  if (typeof window !== 'undefined') {
    try {
      const currentValue = localStorage.getItem(currentKey);
      if (currentValue === null && currentKey !== legacyKey) {
        const legacyValue = localStorage.getItem(legacyKey);
        if (legacyValue !== null) {
          localStorage.setItem(currentKey, legacyValue);
        }
      }
    } catch {
      // Ignore storage access errors in private browsing
    }
  }

  return currentKey;
}

export function getStorageItem(suffix: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = getStorageKey(suffix);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStorageItem(suffix: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getStorageKey(suffix);
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors
  }
}
