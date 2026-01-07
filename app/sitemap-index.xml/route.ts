import { getSitemapPageCount } from "@/util/sitemapGenerator";

/**
 * Sitemap Index - Master sitemap pointing to all paginated comparison sitemaps
 * Route: /sitemap-index.xml
 *
 * This is the URL you submit to Google Search Console
 */
export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";
  const sitemapCount = getSitemapPageCount();

  const sitemapEntries = [];

  // Add main sitemap (static pages)
  sitemapEntries.push(`  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`);

  // Add all comparison sitemaps
  for (let i = 0; i < sitemapCount; i++) {
    sitemapEntries.push(`  <sitemap>
    <loc>${baseUrl}/comparisons-sitemap/${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

