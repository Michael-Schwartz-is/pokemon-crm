import * as fs from "fs";
import path from "path";
import { Pokemon } from "@/util/CachePokemons";
import PokemonList from "./components/PokemonList";
import { Metadata } from "next";
import { Swords, Zap } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

export const metadata: Metadata = {
  title: "All Pokemon - Browse & Compare Stats",
  description:
    "Browse all Pokemon with detailed stats. Compare abilities, strengths, and weaknesses. Find your favorite Pokemon and discover new battle strategies.",
  alternates: {
    canonical: baseUrl,
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--electric)/0.1)] border border-[hsl(var(--electric)/0.2)] mb-4">
            <Zap className="w-4 h-4 text-[hsl(var(--electric))]" />
            <span className="text-sm font-medium text-[hsl(var(--electric))]">Battle Arena</span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-foreground">
            Choose Your
            <span className="block gradient-text">Fighters</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Select 2 Pokemon to pit them against each other and discover who would win in an epic
            battle.
          </p>

          {/* Stats badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
            <Swords className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">
              {pokemons.length} fighters available
            </span>
          </div>
        </div>

        <PokemonList initialPokemons={pokemons} />
      </div>
    </>
  );
}
