import { NextRequest } from "next/server";
import {
  getComparisonPairsForPage,
  getComparisonPriority,
  getSitemapPageCount,
} from "@/util/sitemapGenerator";

/**
 * Dynamic sitemap route for comparison pages
 * Generates paginated XML sitemaps with 50,000 URLs each
 *
 * Route: /comparisons-sitemap/[id]
 * Example: /comparisons-sitemap/0 returns first 50k comparisons
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pageId = parseInt(id, 10);

  // Validate page ID
  const maxPages = getSitemapPageCount();
  if (isNaN(pageId) || pageId < 0 || pageId >= maxPages) {
    return new Response("Sitemap not found", { status: 404 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

  // Get comparison pairs for this page
  const { pairs } = getComparisonPairsForPage(pageId, 50000);

  // Generate XML sitemap
  const xml = generateSitemapXml(baseUrl, pairs);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
    },
  });
}

function generateSitemapXml(
  baseUrl: string,
  pairs: [string, string][]
): string {
  const urlEntries = pairs
    .map(([name1, name2]) => {
      const priority = getComparisonPriority(name1, name2);
      return `  <url>
    <loc>${baseUrl}/compare/${encodeURIComponent(name1)}/${encodeURIComponent(name2)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Generate static params for all sitemap pages
 * This pre-defines the valid sitemap IDs
 */
export function generateStaticParams() {
  const sitemapCount = getSitemapPageCount();
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: String(i) }));
}

