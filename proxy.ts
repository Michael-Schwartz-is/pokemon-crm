import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy to enforce canonical URLs for Pokemon comparisons.
 * Ensures alphabetical ordering: /compare/bulbasaur/pikachu (not /compare/pikachu/bulbasaur)
 * This prevents duplicate content issues for SEO.
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only process /compare/[id1]/[id2] routes
  const compareMatch = pathname.match(/^\/compare\/([^\/]+)\/([^\/]+)$/);

  if (compareMatch) {
    const [, id1, id2] = compareMatch;

    // Decode URL-encoded names (e.g., %20 -> space)
    const decodedId1 = decodeURIComponent(id1).toLowerCase();
    const decodedId2 = decodeURIComponent(id2).toLowerCase();

    // If not in alphabetical order, redirect to canonical URL
    if (decodedId1 > decodedId2) {
      const canonicalUrl = new URL(
        `/compare/${encodeURIComponent(decodedId2)}/${encodeURIComponent(decodedId1)}`,
        request.url
      );

      // 301 permanent redirect for SEO
      return NextResponse.redirect(canonicalUrl, 301);
    }

    // Normalize to lowercase if needed
    if (id1 !== decodedId1 || id2 !== decodedId2) {
      const normalizedUrl = new URL(
        `/compare/${encodeURIComponent(decodedId1)}/${encodeURIComponent(decodedId2)}`,
        request.url
      );
      return NextResponse.redirect(normalizedUrl, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/compare/:id1/:id2",
};
