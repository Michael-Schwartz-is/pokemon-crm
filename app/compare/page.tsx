import { fetchPokemon, Stats } from "@/util/CachePokemons";
import PokemonCard from "../components/PokemonCard";
import { PokemonPlot } from "../components/PokemonPlot";
import { getRandomPokemonName, getRandomPokemonCombinations } from "@/util/pokemons";
import RandomBTN from "../components/RandomBTN";
import FightCombinationsSlider from "@/app/components/FightCombinationsSlider";
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
            {pokemonData1?.name || "POKEMON1"} vs {pokemonData2?.name || "POKEMON2"}
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 pt-1 sm:pt-2">which is better?</p>
        </div>

        {/* Pokemon cards - always side by side */}
        <div className="relative flex flex-row gap-2 sm:gap-4 md:gap-6 justify-center items-start">
          {pokemonData1 && <PokemonCard poke={pokemonData1} showChart={false} />}
          {pokemonData2 && <PokemonCard poke={pokemonData2} showChart={false} />}

          {/* VS divider - floating centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <span className="text-xl sm:text-3xl md:text-4xl font-black text-red-500 italic drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
              VS
            </span>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <RandomBTN r1={r1} r2={r2} />
        </div>

        {/* Stats comparison radar chart */}
        {pokemonData1 && pokemonData2 && (
          <PokemonPlot
            plotStats={plotStats}
            pokemon1Name={pokemonData1.name}
            pokemon2Name={pokemonData2.name}
          />
        )}

        <FightCombinationsSlider combinations={combinations} />
      </div>
    </>
  );
}
