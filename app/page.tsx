import * as fs from "fs";
import path from "path";
import { Pokemon } from "@/util/CachePokemons";
import PokemonList from "./components/PokemonList";
import { Metadata } from "next";

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
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8">
        {/* Hero Section - Compact */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-1">
            Choose Your <span className="gradient-text">Fighters</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Select 2 Pokemon to battle • <span className="font-mono">{pokemons.length}</span>{" "}
            fighters available
          </p>
        </div>

        <PokemonList initialPokemons={pokemons} />
      </div>
    </>
  );
}
