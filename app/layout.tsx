import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { getRandomPokemonName } from "@/util/pokemons";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Pokemon CRM - Compare Pokemon Stats & Abilities",
    template: "%s | Pokemon CRM",
  },
  description:
    "Compare Pokemon stats, abilities, and battle potential. Find the strongest Pokemon with detailed stat analysis and head-to-head comparisons.",
  keywords: ["pokemon", "pokemon comparison", "pokemon stats", "pokemon battle", "pokemon CRM"],
  authors: [{ name: "Pokemon CRM" }],
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Pokemon CRM",
    title: "Pokemon CRM - Compare Pokemon Stats & Abilities",
    description:
      "Compare Pokemon stats, abilities, and battle potential. Find the strongest Pokemon with detailed stat analysis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokemon CRM - Compare Pokemon Stats & Abilities",
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
      name: "Pokemon CRM",
      url: baseUrl,
      logo: `${baseUrl}/favicon.ico`,
      description: "Compare Pokemon stats, abilities, and battle potential.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@pokemon-crm.com",
        contactType: "customer service",
      },
      sameAs: ["https://github.com", "https://twitter.com"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Pokemon CRM",
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
      name: "Pokemon CRM Navigation",
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
  const r1 = getRandomPokemonName();
  const r2 = getRandomPokemonName(r1);
  const siteSchema = generateSiteSchema();

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GXG0KCFJHF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
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
        <Navigation randomR1={r1} randomR2={r2} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
