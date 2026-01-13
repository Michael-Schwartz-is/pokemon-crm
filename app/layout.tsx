import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { PHProvider } from './providers/posthog';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Pokemon Arena - Compare Pokemon Stats & Abilities",
    template: "%s | Pokemon Arena",
  },
  description:
    "Compare Pokemon stats, abilities, and battle potential. Find the strongest Pokemon with detailed stat analysis and head-to-head comparisons.",
  keywords: ["pokemon", "pokemon comparison", "pokemon stats", "pokemon battle", "pokemon arena"],
  authors: [{ name: "Pokemon Arena" }],
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Pokemon Arena",
    title: "Pokemon Arena - Compare Pokemon Stats & Abilities",
    description:
      "Compare Pokemon stats, abilities, and battle potential. Find the strongest Pokemon with detailed stat analysis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokemon Arena - Compare Pokemon Stats & Abilities",
    description: "Compare Pokemon stats, abilities, and battle potential.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization and WebSite JSON-LD schema for site-wide SEO
function generateSiteSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Pokemon Arena",
      url: baseUrl,
      logo: `${baseUrl}/favicon.ico`,
      description: "Compare Pokemon stats, abilities, and battle potential.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "mike@gushon.com",
        contactType: "customer service",
      },
      sameAs: ["https://github.com", "https://twitter.com"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Pokemon Arena",
      url: baseUrl,
      description:
        "Compare Pokemon stats, abilities, and battle potential. Find the strongest Pokemon with detailed stat analysis.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    // Footer navigation structured data
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: "Pokemon Arena Navigation",
      url: baseUrl,
      mainEntity: [
        {
          "@type": "SiteNavigationElement",
          name: "Home",
          url: `${baseUrl}/`,
          description: "Browse all Pokemon",
        },
        {
          "@type": "SiteNavigationElement",
          name: "Compare Pokemon",
          url: `${baseUrl}/compare`,
          description: "Head-to-head Pokemon battles",
        },
        {
          "@type": "SiteNavigationElement",
          name: "Popular Pokemon",
          url: `${baseUrl}/popular`,
          description: "Most searched Pokemon",
        },
        {
          "@type": "SiteNavigationElement",
          name: "Pokemon Types",
          url: `${baseUrl}/types`,
          description: "18 elemental Pokemon types",
        },
        {
          "@type": "SiteNavigationElement",
          name: "Pokemon Generations",
          url: `${baseUrl}/generations`,
          description: "Pokemon from Gen I to IX",
        },
        {
          "@type": "SiteNavigationElement",
          name: "Pokemon Roles",
          url: `${baseUrl}/roles`,
          description: "Battle roles and strategies",
        },
        {
          "@type": "SiteNavigationElement",
          name: "Pokemon Rarity",
          url: `${baseUrl}/rarity`,
          description: "Common to Mythical Pokemon",
        },
      ],
    },
  ];
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSchema = generateSiteSchema();

  return (
    <html lang="en">
      <head>
        {/* Preconnect to R2 image CDN for faster LCP */}
        <link rel="preconnect" href="https://pub-6fc5238d5b67437dac1ad915af3ce98b.r2.dev" />
        <link rel="dns-prefetch" href="https://pub-6fc5238d5b67437dac1ad915af3ce98b.r2.dev" />
        {/* Google Analytics - deferred to after page load */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GXG0KCFJHF"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GXG0KCFJHF');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <PHProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </PHProvider>
      </body>
    </html>
  );
}
