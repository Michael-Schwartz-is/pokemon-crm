import { MetadataRoute } from "next";

/**
 * Dynamic robots.txt that uses the correct domain from environment
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/compare/", "/popular/"],
        disallow: ["/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: [`${baseUrl}/sitemap-index.xml`, `${baseUrl}/sitemap.xml`],
  };
}

