import { fetchPokemon, Stats } from "@/util/CachePokemons";
import { PokemonPlot } from "../components/PokemonPlot";
import {
  getRandomPokemonName,
  getRandomPokemonCombinations,
  getAllPokemonBasic,
} from "@/util/pokemons";
import FightCombinationsSlider from "@/app/components/FightCombinationsSlider";
import BattleArena from "@/app/components/BattleArena";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

export const metadata: Metadata = {
  title: "Compare Pokemon - Head-to-Head Battle Analysis",
  description:
    "Compare any two Pokemon side by side. Analyze stats, abilities, strengths and weaknesses to determine which Pokemon would win in battle.",
  alternates: {
    canonical: `${baseUrl}/compare`,
  },
  openGraph: {
    title: "Compare Pokemon - Head-to-Head Battle Analysis",
    description:
      "Compare any two Pokemon side by side. Analyze stats, abilities, and battle potential.",
    url: `${baseUrl}/compare`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Pokemon - Battle Analysis",
    description: "Compare any two Pokemon side by side. Who would win?",
  },
};

// Generate WebPage JSON-LD schema for compare landing page
function generateCompareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare Pokemon",
    description:
      "Compare any two Pokemon side by side. Analyze stats, abilities, strengths and weaknesses to find the ultimate Pokemon.",
    url: `${baseUrl}/compare`,
    mainEntity: {
      "@type": "WebApplication",
      name: "Pokemon Comparison Tool",
      description: "Interactive tool to compare Pokemon stats and abilities",
      applicationCategory: "Game",
      operatingSystem: "Any",
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
          name: "Compare Pokemon",
          item: `${baseUrl}/compare`,
        },
      ],
    },
  };
}

export default async function Page() {
  const r1 = getRandomPokemonName();
  const r2 = getRandomPokemonName(r1);

  const pokemonData1 = await fetchPokemon(r1);
  const pokemonData2 = await fetchPokemon(r2);

  const combinations = getRandomPokemonCombinations(20);
  const allPokemon = getAllPokemonBasic();
  const jsonLd = generateCompareSchema();

  // Merge stats for the radar chart
  const mergeStats = (item1: Stats[], item2: Stats[]) => {
    return item1.map((stat1) => {
      const stat2 = item2.find((stat2) => stat2.stat.name === stat1.stat.name);
      return {
        statname: stat1.stat.name,
        pokemon1: stat1.base_stat,
        pokemon2: stat2?.base_stat || "",
      };
    });
  };

  const plotStats =
    pokemonData1 && pokemonData2 ? mergeStats(pokemonData1.stats, pokemonData2.stats) : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[60rem] mx-auto px-2 sm:px-6 pt-24 sm:pt-28 pb-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-800 capitalize">
            {pokemonData1?.name || "{{poke1}}"} vs {pokemonData2?.name || "{{poke2}}"}
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 pt-1 sm:pt-2">
            ⚔️ Battle of the Titans — Who will win?
          </p>
          <p className="text-xs sm:text-sm text-slate-500 pt-1">
            Analyze stats, abilities, and strengths to predict the victor
          </p>
        </div>

        {/* Pokemon cards with lock/shuffle */}
        {pokemonData1 && pokemonData2 && (
          <BattleArena pokemon1={pokemonData1} pokemon2={pokemonData2} allPokemon={allPokemon} />
        )}

        {/* Stats comparison radar chart */}
        {pokemonData1 && pokemonData2 && (
          <PokemonPlot
            plotStats={plotStats}
            pokemon1Name={pokemonData1.name}
            pokemon2Name={pokemonData2.name}
          />
        )}

        <FightCombinationsSlider combinations={combinations} allPokemon={allPokemon} />
      </div>
    </>
  );
}
