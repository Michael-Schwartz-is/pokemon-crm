import PokemonCard from "@/app/components/PokemonCard";
import { PokemonPlot } from "@/app/components/PokemonPlot";
import RandomBTN from "@/app/components/RandomBTN";
import { fetchPokemon, Stats, Pokemon } from "@/util/CachePokemons";
import { getRandomPokemonName, getRandomPokemonCombinations } from "@/util/pokemons";
import FightCombinationsSlider from "@/app/components/FightCombinationsSlider";
import { Metadata } from "next";

type compareProps = {
  params: Promise<{
    id1: string;
    id2: string;
  }>;
};

type RandomBTNProps = {
  r1: string;
  r2: string;
};

type PokemonData = {
  item1: Stats;
  item2: Stats;
};

// Helper to capitalize Pokemon names
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: compareProps): Promise<Metadata> {
  const { id1, id2 } = await params;
  const name1 = capitalize(id1);
  const name2 = capitalize(id2);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";
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
      canonical: canonicalUrl,
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

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
            image: pokemon1.image,
            description: `${capitalize(pokemon1.name)} Pokemon with stats comparison`,
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Thing",
            name: capitalize(pokemon2.name),
            image: pokemon2.image,
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

  // const { id1, id2 } = useParams<{ id1: string; id2: string }>();

  const r1 = getRandomPokemonName();
  const r2 = getRandomPokemonName(r1);

  const pokemonData1 = await fetchPokemon(id1);
  const pokemonData2 = await fetchPokemon(id2);

  // type narrowing

  if (!pokemonData1 || !pokemonData2) {
    return <h3>pokemon not found</h3>;
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

  const jsonLd = generateJsonLd(pokemonData1, pokemonData2, id1, id2);

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[60rem] mx-auto p-4 pt-[6rem]">
        <div className="text-2xl bold text-center p-4 ">
          <h1 className="text-4xl bold text-center ">
            {capitalize(pokemonData1?.name) || "POKEMON1"} vs{" "}
            {capitalize(pokemonData2?.name) || "POKEMON2"}
          </h1>
          <p className="text-lg bold text-center pt-2 ">which is better?</p>
        </div>
        <div className=" p-4 ">
          <div className="flex p-4 gap-10 justify-center ">
            {pokemonData1 && <PokemonCard poke={pokemonData1} showChart={true} />}
            {pokemonData2 && <PokemonCard poke={pokemonData2} showChart={true} />}
          </div>

          <RandomBTN r1={r1} r2={r2} />
        </div>
        <PokemonPlot plotStats={plotStats} />
        <FightCombinationsSlider combinations={combinations} />
      </div>
    </>
  );
}
