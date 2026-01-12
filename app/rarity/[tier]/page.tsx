import * as fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Pokemon } from "@/util/CachePokemons";
import CategoryPokemonGrid from "@/app/components/CategoryPokemonGrid";
import rarityData from "@/app/data/rarity.json";
import { ArrowLeft, Gem, Crown, Sparkles, ChevronRight, Target } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

type RarityPageProps = {
  params: Promise<{ tier: string }>;
};

// Rarity icons
const RARITY_ICONS: Record<string, React.ReactNode> = {
  common: <Gem className="w-10 h-10" />,
  uncommon: <Gem className="w-10 h-10" />,
  rare: <Gem className="w-10 h-10" />,
  "ultra-rare": <Gem className="w-10 h-10" />,
  legendary: <Crown className="w-10 h-10" />,
  mythical: <Sparkles className="w-10 h-10" />,
};

// Generate static params for all rarity tiers
export async function generateStaticParams() {
  return rarityData.map((rarity) => ({
    tier: rarity.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: RarityPageProps): Promise<Metadata> {
  const { tier } = await params;
  const tierData = rarityData.find((r) => r.id === tier);
  
  if (!tierData) {
    return {
      title: "Rarity Tier Not Found",
    };
  }

  return {
    title: `${tierData.name} Pokemon - All ${tierData.name} Tier Pokemon`,
    description: tierData.description,
    alternates: {
      canonical: `/rarity/${tier}`,
    },
    openGraph: {
      title: `${tierData.name} Pokemon`,
      description: tierData.description,
      url: `${baseUrl}/rarity/${tier}`,
      type: "website",
    },
  };
}

function generateRaritySchema(tierData: typeof rarityData[0], pokemonCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tierData.name} Pokemon`,
    description: tierData.description,
    url: `${baseUrl}/rarity/${tierData.id}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${tierData.name} Pokemon`,
      numberOfItems: pokemonCount,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Rarity", item: `${baseUrl}/rarity` },
        { "@type": "ListItem", position: 3, name: tierData.name, item: `${baseUrl}/rarity/${tierData.id}` },
      ],
    },
  };
}

export default async function RarityTierPage({ params }: RarityPageProps) {
  const { tier } = await params;
  const tierData = rarityData.find((r) => r.id === tier);

  if (!tierData) {
    notFound();
  }

  // Load Pokemon data
  const filePath = path.join(process.cwd(), "app/data/AllPokemons.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const allPokemons: Record<string, Pokemon> = JSON.parse(fileContent);

  // Filter Pokemon by rarity tier
  const filteredPokemons = Object.values(allPokemons)
    .filter((poke) => poke.rarity_tier === tier)
    .sort((a, b) => a.id - b.id);

  const jsonLd = generateRaritySchema(tierData, filteredPokemons.length);

  // Get adjacent rarity tiers for navigation
  const currentIndex = rarityData.findIndex((r) => r.id === tier);
  const prevTier = currentIndex > 0 ? rarityData[currentIndex - 1] : null;
  const nextTier = currentIndex < rarityData.length - 1 ? rarityData[currentIndex + 1] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <div 
          className="relative pt-20 pb-12 px-4 sm:px-6 md:px-8"
          style={{ 
            background: `linear-gradient(135deg, ${tierData.color}30 0%, ${tierData.color}10 50%, transparent 100%)`,
          }}
        >
          <div className="max-w-[80rem] mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/rarity" className="hover:text-foreground transition-colors">Rarity</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{tierData.name}</span>
            </nav>

            {/* Back link */}
            <Link
              href="/rarity"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Rarity Tiers
            </Link>

            {/* Tier Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Tier Icon */}
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: `${tierData.color}20`,
                  border: `2px solid ${tierData.color}`,
                  color: tierData.color,
                  boxShadow: `0 8px 32px ${tierData.color}30`,
                }}
              >
                {RARITY_ICONS[tier]}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-2">
                  {tierData.name}
                  <span className="text-muted-foreground font-normal ml-3">Rarity</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mb-4">
                  {tierData.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg"
                    style={{ 
                      backgroundColor: `${tierData.color}15`,
                      border: `1px solid ${tierData.color}30`,
                    }}
                  >
                    <Target className="w-4 h-4" style={{ color: tierData.color }} />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Capture Rate:</span>{" "}
                      <span className="font-medium text-foreground">{tierData.capture_rate_range}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                    <span className="text-sm">
                      <span className="text-muted-foreground">Pokemon:</span>{" "}
                      <span className="font-bold text-foreground">{filteredPokemons.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 py-8">
          {/* Tier Navigation */}
          <div className="flex items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-card border border-border">
            {prevTier ? (
              <Link 
                href={`/rarity/${prevTier.id}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">More Common:</span>
                <span className="font-medium" style={{ color: prevTier.color }}>{prevTier.name}</span>
              </Link>
            ) : (
              <div />
            )}
            
            <div className="flex items-center gap-1">
              {rarityData.map((r) => (
                <Link
                  key={r.id}
                  href={`/rarity/${r.id}`}
                  className={`w-3 h-3 rounded-full transition-transform ${r.id === tier ? "scale-125" : "hover:scale-110"}`}
                  style={{ backgroundColor: r.color }}
                  title={r.name}
                />
              ))}
            </div>

            {nextTier ? (
              <Link 
                href={`/rarity/${nextTier.id}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="hidden sm:inline">Rarer:</span>
                <span className="font-medium" style={{ color: nextTier.color }}>{nextTier.name}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Example Pokemon highlight */}
          {tierData.examples.length > 0 && (
            <div className="mb-8 p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-lg font-bold text-foreground mb-3">Notable Examples</h2>
              <div className="flex flex-wrap gap-2">
                {tierData.examples.map((example) => (
                  <span
                    key={example}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize"
                    style={{ 
                      backgroundColor: `${tierData.color}15`,
                      color: tierData.color,
                    }}
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* All Pokemon */}
          <CategoryPokemonGrid 
            pokemons={filteredPokemons}
            title={`All ${tierData.name} Pokemon`}
            subtitle={`(${filteredPokemons.length})`}
          />
        </div>
      </div>
    </>
  );
}

