import * as fs from "fs";
import path from "path";
import { Pokemon } from "@/util/CachePokemons";
import PokemonList from "./components/PokemonList";
import QuickBattleSearch from "./components/QuickBattleSearch";
import { Metadata } from "next";
import { getPokemonImageUrl } from "@/util/pokemonImage";
import { Swords } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

export const metadata: Metadata = {
  title: "All Pokemon - Browse & Compare Stats",
  description:
    "Browse all Pokemon with detailed stats. Compare abilities, strengths, and weaknesses. Find your favorite Pokemon and discover new battle strategies.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "All Pokemon - Browse & Compare Stats",
    description:
      "Browse all Pokemon with detailed stats. Compare abilities, strengths, and weaknesses.",
    url: baseUrl,
    type: "website",
  },
};

// Generate CollectionPage JSON-LD schema
function generateHomeSchema(pokemonCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Pokemon",
    description: `Browse and compare ${pokemonCount} Pokemon with detailed stats, abilities, and battle analysis.`,
    url: baseUrl,
    mainEntity: {
      "@type": "ItemList",
      name: "Pokemon Collection",
      description: `Complete list of ${pokemonCount} Pokemon`,
      numberOfItems: pokemonCount,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
      ],
    },
  };
}

export default async function Home() {
  const filePath = path.join(process.cwd(), "app/data/AllPokemons.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const allPokemons: Record<string, Pokemon> = JSON.parse(fileContent);

  const pokemons = Object.values(allPokemons);
  const jsonLd = generateHomeSchema(pokemons.length);

  // Preload only the first 2 Pokemon images for LCP optimization (above the fold on mobile)
  // Using fewer preloads reduces bandwidth contention
  const preloadImages = pokemons.slice(0, 2).map((p) => getPokemonImageUrl(p.id));

  return (
    <>
      {/* Preload LCP images - only first 2 for mobile viewport */}
      {preloadImages.map((src, index) => (
        <link
          key={src}
          rel="preload"
          as="image"
          href={src}
          type="image/avif"
          // @ts-expect-error - fetchPriority is valid HTML attribute
          fetchpriority={index === 0 ? "high" : "low"}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--electric)/0.1)] border border-[hsl(var(--electric)/0.2)] mb-4">
            <Swords className="w-4 h-4 text-[hsl(var(--electric))]" />
            <span className="text-sm font-medium text-[hsl(var(--electric))]">Pokemon Battle Simulator</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Settle the <span className="gradient-text">Ultimate Showdown</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Pick two Pokemon and find out who wins. Compare stats, type matchups, and battle it out.
          </p>
        </div>

        {/* Quick Battle Search */}
        <div className="mb-12 sm:mb-14">
          <QuickBattleSearch pokemons={pokemons} />
        </div>

        {/* Divider with "or browse" text */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-sm text-muted-foreground">or browse all fighters</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        <PokemonList initialPokemons={pokemons} />
      </div>
    </>
  );
}
