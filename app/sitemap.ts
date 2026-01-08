import { MetadataRoute } from "next";
import { getSitemapPageCount } from "@/util/sitemapGenerator";

/**
 * Sitemap Index - Points to paginated comparison sitemaps
 * Each child sitemap contains up to 50,000 URLs (Google's limit)
 *
 * With ~845,650 comparison pairs, this generates ~17 sitemap files
 * Controlled by MAX_COMPARISON_URLS environment variable for gradual rollout
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";
  const sitemaps: MetadataRoute.Sitemap = [];

  // === Main Static Pages ===
  sitemaps.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1.0,
  });

  sitemaps.push({
    url: `${baseUrl}/compare`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  });

  sitemaps.push({
    url: `${baseUrl}/popular`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  });

  // === Category Index Pages ===
  const categoryPages = [
    { path: "/generations", priority: 0.9 },
    { path: "/types", priority: 0.9 },
    { path: "/roles", priority: 0.8 },
    { path: "/rarity", priority: 0.8 },
  ];

  categoryPages.forEach(({ path, priority }) => {
    sitemaps.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority,
    });
  });

  // === Generation Detail Pages ===
  const generations = [
    "generation-i",
    "generation-ii",
    "generation-iii",
    "generation-iv",
    "generation-v",
    "generation-vi",
    "generation-vii",
    "generation-viii",
    "generation-ix",
  ];

  generations.forEach((gen) => {
    sitemaps.push({
      url: `${baseUrl}/generations/${gen}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // === Type Detail Pages ===
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  types.forEach((type) => {
    sitemaps.push({
      url: `${baseUrl}/types/${type}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // === Role Detail Pages ===
  const roles = [
    "physical-attacker",
    "special-attacker",
    "physical-tank",
    "special-tank",
    "speedster",
    "balanced",
  ];

  roles.forEach((role) => {
    sitemaps.push({
      url: `${baseUrl}/roles/${role}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  // === Rarity Detail Pages ===
  const rarityTiers = [
    "common",
    "uncommon",
    "rare",
    "ultra-rare",
    "legendary",
    "mythical",
  ];

  rarityTiers.forEach((tier) => {
    sitemaps.push({
      url: `${baseUrl}/rarity/${tier}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return sitemaps;
}


