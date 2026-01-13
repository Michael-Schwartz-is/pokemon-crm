import PokemonCard from "@/app/components/PokemonCard";
import PokemonInfoPanel from "@/app/components/PokemonInfoPanel";
import { PokemonPlot } from "@/app/components/PokemonPlot";
import RandomBTN from "@/app/components/RandomBTN";
import { fetchPokemon, Stats, Pokemon } from "@/util/CachePokemons";
import {
  getRandomPokemonName,
  getRandomPokemonCombinations,
  getAllPokemonBasic,
} from "@/util/pokemons";
import FightCombinationsSlider from "@/app/components/FightCombinationsSlider";
import FightSimulator from "@/app/components/FightSimulator";
import { Metadata } from "next";
import { Swords } from "lucide-react";
import ComparisonView from "@/app/components/ComparisonView";
import { getPokemonImageUrl } from "@/util/pokemonImage";

type compareProps = {
  params: Promise<{
    id1: string;
    id2: string;
  }>;
};

// ISR Configuration: Cache pages permanently after first render
// Pokemon data never changes, so pages can be cached forever
// This dramatically reduces serverless function invocations
export const revalidate = false;

// Pre-build the most popular/iconic Pokemon matchups at build time
// These will be available instantly with ZERO function invocations
// Other matchups will be built on-demand and cached (ISR)
export async function generateStaticParams() {
  // Most iconic/searched Pokemon - pre-build all combinations
  const iconicPokemon = [
    'pikachu', 'charizard', 'mewtwo', 'mew', 'bulbasaur', 'charmander', 
    'squirtle', 'eevee', 'snorlax', 'gengar', 'dragonite', 'gyarados',
    'lucario', 'greninja', 'rayquaza', 'lugia', 'ho-oh', 'kyogre'
  ];

  const params: { id1: string; id2: string }[] = [];

  // Generate all combinations of iconic Pokemon (alphabetically ordered)
  for (let i = 0; i < iconicPokemon.length; i++) {
    for (let j = i + 1; j < iconicPokemon.length; j++) {
      params.push({
        id1: iconicPokemon[i],
        id2: iconicPokemon[j],
      });
    }
  }

  // This pre-builds ~153 pages at build time (18 choose 2 combinations)
  // All other comparison pages will use ISR (built on first visit, cached forever)
  return params;
}

// Helper to capitalize Pokemon names
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: compareProps): Promise<Metadata> {
  const { id1, id2 } = await params;
  const name1 = capitalize(id1);
  const name2 = capitalize(id2);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";
  const canonicalUrl = `${baseUrl}/compare/${id1}/${id2}`;

  return {
    title: `${name1} vs ${name2} - Pokemon Comparison | Stats, Abilities & Battle Analysis`,
    description: `Compare ${name1} and ${name2} stats, abilities, strengths and weaknesses. See which Pokemon is stronger in a head-to-head battle comparison with detailed stat analysis.`,
    keywords: [
      `${name1} vs ${name2}`,
      `${name2} vs ${name1}`,
      `${name1} comparison`,
      `${name2} comparison`,
      "pokemon battle",
      "pokemon stats",
      "pokemon comparison",
    ],
    alternates: {
      canonical: `/compare/${id1}/${id2}`,
    },
    openGraph: {
      title: `${name1} vs ${name2} - Who Would Win?`,
      description: `Head-to-head comparison of ${name1} and ${name2}. Compare stats, abilities, and find out which Pokemon is stronger.`,
      url: canonicalUrl,
      siteName: "Pokemon CRM",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name1} vs ${name2} - Pokemon Battle Comparison`,
      description: `Compare ${name1} and ${name2} stats and abilities. Who would win?`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// JSON-LD structured data for rich snippets
function generateJsonLd(pokemon1: Pokemon, pokemon2: Pokemon, id1: string, id2: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${capitalize(pokemon1.name)} vs ${capitalize(pokemon2.name)} Comparison`,
    description: `Detailed comparison of ${pokemon1.name} and ${pokemon2.name} Pokemon stats, abilities, and battle potential.`,
    url: `${baseUrl}/compare/${id1}/${id2}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Thing",
            name: capitalize(pokemon1.name),
            image: getPokemonImageUrl(pokemon1.id),
            description: `${capitalize(pokemon1.name)} Pokemon with stats comparison`,
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Thing",
            name: capitalize(pokemon2.name),
            image: getPokemonImageUrl(pokemon2.id),
            description: `${capitalize(pokemon2.name)} Pokemon with stats comparison`,
          },
        },
      ],
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
          name: "Compare",
          item: `${baseUrl}/compare`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${capitalize(pokemon1.name)} vs ${capitalize(pokemon2.name)}`,
          item: `${baseUrl}/compare/${id1}/${id2}`,
        },
      ],
    },
  };
}

export default async function page({ params }: compareProps) {
  const { id1, id2 } = await params;

  const r1 = getRandomPokemonName();
  const r2 = getRandomPokemonName(r1);

  const pokemonData1 = await fetchPokemon(id1);
  const pokemonData2 = await fetchPokemon(id2);

  if (!pokemonData1 || !pokemonData2) {
    return (
      <div className="max-w-[60rem] mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[hsl(var(--fire)/0.1)] border border-[hsl(var(--fire)/0.2)] flex items-center justify-center">
          <Swords className="w-10 h-10 text-[hsl(var(--fire))]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-3">Fighter Not Found!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Could not find one or both Pokemon for this battle. Check the names and try again.
        </p>
      </div>
    );
  }

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

  const plotStats = mergeStats(pokemonData1.stats, pokemonData2.stats);
  const combinations = getRandomPokemonCombinations(20);
  const allPokemon = getAllPokemonBasic();

  const jsonLd = generateJsonLd(pokemonData1, pokemonData2, id1, id2);

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[60rem] mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground">
            <span className="gradient-text">{capitalize(pokemonData1?.name)}</span>
            <span className="text-[hsl(var(--fire))] mx-3 vs-badge">vs</span>
            <span className="gradient-text-plasma">{capitalize(pokemonData2?.name)}</span>
          </h1>
        </div>

        {/* Fight Simulator - runs entirely client-side */}
        <FightSimulator pokemon1={pokemonData1} pokemon2={pokemonData2} />

        {/* Pokemon cards with info panels - always side by side */}
        <div className="mt-8 sm:mt-10">
          <ComparisonView pokemonData1={pokemonData1} pokemonData2={pokemonData2} />
        </div>

        {/* Stats comparison below the simulator */}
        <PokemonPlot
          plotStats={plotStats}
          pokemon1Name={pokemonData1.name}
          pokemon2Name={pokemonData2.name}
        />

        {/* Random Battle Button */}
        <div className="mt-8 sm:mt-10">
          <RandomBTN r1={r1} r2={r2} />
        </div>

        <FightCombinationsSlider combinations={combinations} allPokemon={allPokemon} />
      </div>
    </>
  );
}
