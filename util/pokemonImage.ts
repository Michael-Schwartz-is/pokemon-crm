/**
 * Pokemon Image URL utilities for Cloudflare R2 hosted images
 */

// R2 public URL from environment (required)
const R2_URL = process.env.NEXT_PUBLIC_R2_URL;

if (!R2_URL && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_R2_URL is not configured. Pokemon images will not load.");
}

type ImageFormat = "avif" | "webp";

/**
 * Get the optimized Pokemon image URL from R2
 * 
 * @param id - Pokemon ID
 * @param format - Image format (avif or webp), defaults to avif
 * @returns The image URL
 */
export function getPokemonImageUrl(id: number, format: ImageFormat = "avif"): string {
  return `${R2_URL}/${id}.${format}`;
}

/**
 * Get both AVIF and WebP URLs for use with picture element
 * This allows browsers to choose the best supported format
 * 
 * @param id - Pokemon ID
 * @returns Object with avif and webp URLs
 */
export function getPokemonImageSources(id: number): {
  avif: string;
  webp: string;
} {
  return {
    avif: `${R2_URL}/${id}.avif`,
    webp: `${R2_URL}/${id}.webp`,
  };
}

/**
 * Get the fallback pokeball image URL (for error states)
 */
export function getFallbackImageUrl(): string {
  return `${R2_URL}/pokeball.webp`;
}
