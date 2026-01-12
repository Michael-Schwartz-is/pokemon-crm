/**
 * Pokemon Image URL utilities for Cloudflare R2 hosted images
 */

// R2 public URL from environment
const R2_URL = process.env.NEXT_PUBLIC_R2_URL;

// Fallback to PokeAPI GitHub sprites if R2 is not configured
const FALLBACK_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home";

type ImageFormat = "avif" | "webp";

/**
 * Get the optimized Pokemon image URL from R2
 * Falls back to PokeAPI sprites if R2 is not configured
 * 
 * @param id - Pokemon ID
 * @param format - Image format (avif or webp), defaults to avif
 * @returns The image URL
 */
export function getPokemonImageUrl(id: number, format: ImageFormat = "avif"): string {
  if (R2_URL) {
    return `${R2_URL}/${id}.${format}`;
  }
  // Fallback to original PokeAPI sprites (PNG)
  return `${FALLBACK_BASE_URL}/${id}.png`;
}

/**
 * Get both AVIF and WebP URLs for use with picture element
 * This allows browsers to choose the best supported format
 * 
 * @param id - Pokemon ID
 * @returns Object with avif and webp URLs, plus png fallback
 */
export function getPokemonImageSources(id: number): {
  avif: string;
  webp: string;
  fallback: string;
} {
  if (R2_URL) {
    return {
      avif: `${R2_URL}/${id}.avif`,
      webp: `${R2_URL}/${id}.webp`,
      fallback: `${FALLBACK_BASE_URL}/${id}.png`,
    };
  }
  // If R2 not configured, all point to PNG
  const pngUrl = `${FALLBACK_BASE_URL}/${id}.png`;
  return {
    avif: pngUrl,
    webp: pngUrl,
    fallback: pngUrl,
  };
}

/**
 * Check if R2 image hosting is configured
 */
export function isR2Configured(): boolean {
  return Boolean(R2_URL);
}

/**
 * Get the fallback pokeball image URL (for error states)
 */
export function getFallbackImageUrl(): string {
  return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
}
