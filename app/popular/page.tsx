import * as fs from "fs";
import path from "path";
import { Pokemon } from "@/util/CachePokemons";
import PokemonList from "../components/PokemonList";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

export const metadata: Metadata = {
  title: "Popular Pokemon - Most Searched & Compared",
  description:
    "Discover the most popular Pokemon. See which Pokemon are trending, most compared, and fan favorites with detailed stats and abilities.",
  alternates: {
    canonical: `${baseUrl}/popular`,
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
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-slate-800">
          Popular Pokemons
        </h1>
        <PokemonList initialPokemons={popular} />
      </div>
    </>
  );
}
