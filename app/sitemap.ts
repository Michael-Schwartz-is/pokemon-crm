import { MetadataRoute } from "next";
import { getSitemapPageCount } from "@/util/sitemapGenerator";

/**
 * Sitemap Index - Points to paginated comparison sitemaps
 * Each child sitemap contains up to 50,000 URLs (Google's limit)
 *
 * With ~523,776 comparison pairs, this generates ~11 sitemap files
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";
  const sitemapCount = getSitemapPageCount();

  const sitemaps: MetadataRoute.Sitemap = [];

  // Main pages
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

  return sitemaps;
}

/**
 * Generate sitemap index entries for Google
 * This tells Google where to find all the paginated comparison sitemaps
 */
export async function generateSitemaps() {
  const sitemapCount = getSitemapPageCount();

  // Generate array of sitemap IDs [0, 1, 2, ..., 10]
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }));
}

