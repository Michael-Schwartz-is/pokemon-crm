import * as fs from "fs";
import path from "path";
import { Pokemon } from "@/util/CachePokemons";
import PokemonList from "../components/PokemonList";
import { Metadata } from "next";
import { Flame, Trophy } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

export const metadata: Metadata = {
  title: "Popular Pokemon - Most Searched & Compared",
  description:
    "Discover the most popular Pokemon. See which Pokemon are trending, most compared, and fan favorites with detailed stats and abilities.",
  alternates: {
    canonical: "/popular",
  },
  openGraph: {
    title: "Popular Pokemon - Most Searched & Compared",
    description:
      "Discover the most popular Pokemon. See which Pokemon are trending and most compared.",
    url: `${baseUrl}/popular`,
    type: "website",
  },
};

// Generate CollectionPage JSON-LD schema for popular Pokemon
function generatePopularSchema(pokemonCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Popular Pokemon",
    description: `Browse the most popular and trending Pokemon. Collection of ${pokemonCount} Pokemon with stats and comparisons.`,
    url: `${baseUrl}/popular`,
    mainEntity: {
      "@type": "ItemList",
      name: "Popular Pokemon Collection",
      description: `List of ${pokemonCount} popular Pokemon`,
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
        {
          "@type": "ListItem",
          position: 2,
          name: "Popular Pokemon",
          item: `${baseUrl}/popular`,
        },
      ],
    },
  };
}

export default function PopularPage() {
  const filePath = path.join(process.cwd(), "app/data/AllPokemons.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const allPokemons: Record<string, Pokemon> = JSON.parse(fileContent);

  const popular = Object.values(allPokemons);
  const jsonLd = generatePopularSchema(popular.length);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 pt-28 sm:pt-32 md:pt-36 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--fire)/0.1)] border border-[hsl(var(--fire)/0.2)] mb-4">
            <Flame className="w-4 h-4 text-[hsl(var(--fire))]" />
            <span className="text-sm font-medium text-[hsl(var(--fire))]">Fan Favorites</span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-foreground">
            Most Popular
            <span className="block gradient-text-plasma">Fighters</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            The fan-favorites and battle champions. Select 2 to see who wins in a head-to-head
            showdown!
          </p>

          {/* Stats badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
            <Trophy className="w-4 h-4 text-[hsl(var(--electric))]" />
            <span className="text-sm font-mono text-muted-foreground">
              {popular.length} champions
            </span>
          </div>
        </div>

        <PokemonList initialPokemons={popular} />
      </div>
    </>
  );
}
