import Link from "next/link";
import { Metadata } from "next";
import rarityData from "@/app/data/rarity.json";
import { Gem, ChevronRight, Crown, Sparkles } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

export const metadata: Metadata = {
  title: "Pokemon Rarity Tiers - From Common to Mythical",
  description: "Explore Pokemon rarity tiers from Common to Mythical. Understand capture rates, discover rare Pokemon, and plan your collection strategy.",
  alternates: {
    canonical: `${baseUrl}/rarity`,
  },
  openGraph: {
    title: "Pokemon Rarity Tiers - From Common to Mythical",
    description: "Explore Pokemon rarity tiers and discover rare species.",
    url: `${baseUrl}/rarity`,
    type: "website",
  },
};

// Rarity icons
const RARITY_ICONS: Record<string, React.ReactNode> = {
  common: <Gem className="w-6 h-6" />,
  uncommon: <Gem className="w-6 h-6" />,
  rare: <Gem className="w-6 h-6" />,
  "ultra-rare": <Gem className="w-6 h-6" />,
  legendary: <Crown className="w-6 h-6" />,
  mythical: <Sparkles className="w-6 h-6" />,
};

function generateRaritySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pokemon Rarity Tiers",
    description: "Guide to Pokemon rarity tiers from common catches to mythical encounters.",
    url: `${baseUrl}/rarity`,
    mainEntity: {
      "@type": "ItemList",
      name: "Rarity Tiers",
      numberOfItems: rarityData.length,
      itemListElement: rarityData.map((rarity, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: rarity.name,
        url: `${baseUrl}/rarity/${rarity.id}`,
      })),
    },
  };
}

export default function RarityPage() {
  const jsonLd = generateRaritySchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Rarity <span className="gradient-text">Tiers</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From everyday encounters to once-in-a-lifetime catches. Discover Pokemon across all rarity tiers.
          </p>
        </div>

        {/* Rarity Pyramid */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex flex-col gap-3">
            {[...rarityData].reverse().map((rarity, index) => {
              // Calculate width based on rarity (rarer = narrower)
              const widthPercent = 40 + (index * 10);
              
              return (
                <Link
                  key={rarity.id}
                  href={`/rarity/${rarity.id}`}
                  className="group relative mx-auto transition-all duration-300 hover:scale-105 animate-fade-up"
                  style={{ 
                    width: `${widthPercent}%`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div 
                    className="relative overflow-hidden rounded-xl p-4 sm:p-5 border-2 transition-all duration-300 group-hover:shadow-2xl"
                    style={{ 
                      backgroundColor: `${rarity.color}15`,
                      borderColor: `${rarity.color}50`,
                      boxShadow: `0 4px 20px ${rarity.color}20`,
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    
                    <div className="relative flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${rarity.color}30`,
                            color: rarity.color,
                          }}
                        >
                          {RARITY_ICONS[rarity.id]}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-foreground group-hover:text-[hsl(var(--electric))] transition-colors">
                            {rarity.name}
                          </h2>
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            Capture Rate: {rarity.capture_rate_range}
                          </p>
                        </div>
                      </div>
                      <ChevronRight 
                        className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform"
                        style={{ color: rarity.color }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Rarity Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rarityData.map((rarity, index) => (
            <Link
              key={rarity.id}
              href={`/rarity/${rarity.id}`}
              className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-border transition-all duration-300 hover:border-[hsl(var(--electric)/0.5)] hover:shadow-xl animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ 
                  background: `radial-gradient(circle at 50% 50%, ${rarity.color}, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <div 
                className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: `${rarity.color}20`,
                  color: rarity.color,
                  boxShadow: `0 0 20px ${rarity.color}30`,
                }}
              >
                {RARITY_ICONS[rarity.id]}
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-[hsl(var(--electric))] transition-colors">
                    {rarity.name}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {rarity.description}
                </p>

                {/* Example Pokemon */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Examples:</span>
                  <div className="flex gap-1 flex-wrap">
                    {rarity.examples.slice(0, 3).map((example) => (
                      <span
                        key={example}
                        className="px-2 py-0.5 rounded-md text-xs capitalize"
                        style={{ 
                          backgroundColor: `${rarity.color}15`,
                          color: rarity.color,
                        }}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Capture rate badge */}
                <div 
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ 
                    backgroundColor: `${rarity.color}15`,
                    color: rarity.color,
                  }}
                >
                  <Gem className="w-3 h-3" />
                  Capture Rate: {rarity.capture_rate_range}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 p-8 rounded-3xl bg-card border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">About Capture Rates</h2>
          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">How Capture Rate Works</h3>
              <p className="text-sm">
                Each Pokemon has a capture rate from 3 to 255. Higher numbers mean easier catches. 
                A Pokemon with rate 255 (like Caterpie) is easy to catch, while one with rate 3 
                (like Mewtwo) is extremely difficult.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Rarity Classification</h3>
              <p className="text-sm">
                Our rarity tiers are based on a combination of capture rate, availability in games, 
                and special status (Legendary/Mythical). This gives a practical sense of how hard 
                each Pokemon is to obtain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

