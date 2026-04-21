import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Ruler,
  Scale,
  Dna,
  Leaf,
  Target,
  Star,
  MapPin,
  Sparkles,
  ArrowLeft,
  Swords
} from "lucide-react";

// Components
import PokemonList from "@/app/components/PokemonList";
import TypeBadge from "@/app/components/TypeBadge";
import { RarityBadge, RoleBadge, GenerationBadge } from "@/app/components/CategoryBadge";
import EvolutionChain from "@/app/components/EvolutionChain";
import MovesTable from "@/app/components/MovesTable";
import AbilityCard from "@/app/components/AbilityCard";
import PokemonCard from "@/app/components/PokemonCard";
import PokemonInfoPanel from "@/app/components/PokemonInfoPanel";
import { PokemonPlot } from "@/app/components/PokemonPlot";
import RandomBTN from "@/app/components/RandomBTN";
import FightCombinationsSlider from "@/app/components/FightCombinationsSlider";
import FightSimulator from "@/app/components/FightSimulator";
import EmailPopup from "@/app/components/EmailPopup";

// Utils
import { Pokemon, fetchPokemon, Stats } from "@/util/CachePokemons";
import { getPokemonDetail, getAllPokemonNames } from "@/util/fetchPokemonDetail";
import allPokemonsData from "@/app/data/AllPokemons.json";
import { getPokemonImageUrl } from "@/util/pokemonImage";
import {
  getRandomPokemonName,
  getRandomPokemonCombinations,
  getAllPokemonBasic,
} from "@/util/pokemons";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

// ISR Configuration: Cache pages permanently
export const revalidate = false;
export const dynamic = 'force-static';

// Generate static params
export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];

  // 1. Single Pokemon Pages (Generate only iconic ones to avoid ENOSPC in dev environment)
  // In production with more disk space, this could be expanded
  const iconicPokemon = [
    'pikachu', 'charizard', 'mewtwo', 'mew', 'bulbasaur', 'charmander',
    'squirtle', 'eevee', 'snorlax', 'gengar', 'dragonite', 'gyarados',
    'lucario', 'greninja', 'rayquaza', 'lugia', 'ho-oh', 'kyogre'
  ];
  
  iconicPokemon.forEach((name) => {
    params.push({ slug: [name] });
  });

  // 2. Iconic Comparison Pages
  for (let i = 0; i < iconicPokemon.length; i++) {
    for (let j = i + 1; j < iconicPokemon.length; j++) {
      params.push({
        slug: [iconicPokemon[i], iconicPokemon[j]],
      });
    }
  }

  return params;
}

// Helper functions
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatHeight(dm: number): string {
  const meters = dm / 10;
  const feet = Math.floor(meters * 3.281);
  const inches = Math.round((meters * 3.281 - feet) * 12);
  return `${meters.toFixed(1)}m (${feet}'${inches}")`;
}

function formatWeight(hg: number): string {
  const kg = hg / 10;
  const lbs = (kg * 2.205).toFixed(1);
  return `${kg.toFixed(1)}kg (${lbs}lbs)`;
}

function formatGenderRatio(ratio: number): string {
  if (ratio === -1) return "Genderless";
  const femalePercent = (ratio / 8) * 100;
  const malePercent = 100 - femalePercent;
  if (femalePercent === 0) return "100% Male";
  if (femalePercent === 100) return "100% Female";
  return `${malePercent.toFixed(0)}% Male, ${femalePercent.toFixed(0)}% Female`;
}

// Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug.length === 1) {
    // Detail Page Metadata
    const name = slug[0];
    const pokemon = await getPokemonDetail(name);

    if (!pokemon) {
      return { title: "Pokemon Not Found" };
    }

    const capitalizedName = capitalize(pokemon.name);
    const typeString = pokemon.types.map(t => capitalize(t)).join("/");

    return {
      title: `${capitalizedName} - Stats, Evolution, Moves & Abilities | Pokemon Arena`,
      description: `${pokemon.flavor_text} Learn about ${capitalizedName}'s base stats, evolution chain, moves, abilities, and where to catch it. ${typeString} type Pokemon from ${pokemon.generation.replace("generation-", "Gen ").toUpperCase()}.`,
      keywords: [
        pokemon.name,
        ...pokemon.types,
        pokemon.generation,
        "pokemon",
        "pokedex",
        `${capitalizedName} stats`,
        `${capitalizedName} evolution`,
        `${capitalizedName} moves`,
      ],
      alternates: {
        canonical: `/pokemon/${pokemon.name}`,
      },
      openGraph: {
        title: `${capitalizedName} | Pokemon Arena`,
        description: pokemon.flavor_text || `Everything you need to know about ${capitalizedName}`,
        url: `${baseUrl}/pokemon/${pokemon.name}`,
        images: [
          {
            url: pokemon.sprites?.official || getPokemonImageUrl(pokemon.id),
            width: 475,
            height: 475,
            alt: capitalizedName,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${capitalizedName} - Pokemon Stats & Info`,
        description: pokemon.flavor_text,
      },
    };
  } else if (slug.length === 2) {
    // Comparison Page Metadata
    const [id1, id2] = slug;
    const name1 = capitalize(id1);
    const name2 = capitalize(id2);
    const canonicalUrl = `${baseUrl}/pokemon/${id1}/${id2}`;

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
        canonical: `/pokemon/${id1}/${id2}`,
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

  return { title: "Not Found" };
}

// JSON-LD Generators
function generateDetailJsonLd(pokemon: Awaited<ReturnType<typeof getPokemonDetail>>) {
  if (!pokemon) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: capitalize(pokemon.name),
    description: pokemon.flavor_text,
    image: pokemon.sprites?.official || getPokemonImageUrl(pokemon.id),
    identifier: pokemon.id.toString(),
    url: `${baseUrl}/pokemon/${pokemon.name}`,
    additionalType: "https://schema.org/VideoGameCharacter",
    subjectOf: {
      "@type": "WebPage",
      url: `${baseUrl}/pokemon/${pokemon.name}`,
      name: `${capitalize(pokemon.name)} - Pokemon Arena`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Pokedex", item: baseUrl },
        { "@type": "ListItem", position: 3, name: capitalize(pokemon.name), item: `${baseUrl}/pokemon/${pokemon.name}` },
      ],
    },
  };
}

function generateComparisonJsonLd(pokemon1: Pokemon, pokemon2: Pokemon, id1: string, id2: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${capitalize(pokemon1.name)} vs ${capitalize(pokemon2.name)} Comparison`,
    description: `Detailed comparison of ${pokemon1.name} and ${pokemon2.name} Pokemon stats, abilities, and battle potential.`,
    url: `${baseUrl}/pokemon/${id1}/${id2}`,
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
          item: `${baseUrl}/pokemon/${id1}/${id2}`,
        },
      ],
    },
  };
}

// Shared Component
function StatBar({ name, value, maxValue = 255 }: { name: string; value: number; maxValue?: number }) {
  const percentage = (value / maxValue) * 100;
  
  const statColors: Record<string, string> = {
    hp: "#ff5722",
    attack: "#ffc107",
    defense: "#29b6f6",
    "special-attack": "#ba68c8",
    "special-defense": "#4caf50",
    speed: "#00bcd4",
  };

  const statAbbreviations: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SP.ATK",
    "special-defense": "SP.DEF",
    speed: "SPD",
  };

  const color = statColors[name] || "#888";
  const abbr = statAbbreviations[name] || name.slice(0, 3).toUpperCase();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="text-xs sm:text-sm font-mono font-medium text-muted-foreground w-14 sm:w-16 text-right uppercase tracking-tight">
        {abbr}
      </span>
      <span className="text-xs sm:text-sm font-mono font-bold text-foreground w-8 tabular-nums">
        {value}
      </span>
      <div className="flex-1 h-3 sm:h-4 bg-secondary/80 rounded-md overflow-hidden relative">
        <div
          className="h-full rounded-md transition-all duration-500 relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 12px ${color}80, inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// View Components
// -----------------------------------------------------------------------------

async function PokemonDetailView({ name }: { name: string }) {
  const pokemon = await getPokemonDetail(name);

  if (!pokemon) {
    notFound();
  }

  const capitalizedName = capitalize(pokemon.name);
  const jsonLd = generateDetailJsonLd(pokemon);
  const imageUrl = pokemon.sprites?.official || getPokemonImageUrl(pokemon.id);

  // Load all Pokemon for the battle selector
  const pokemonsList = Object.values(allPokemonsData as Record<string, Pokemon>);

  // Get prev/next Pokemon names for navigation (by ID)
  const findPokemonNameById = (id: number): string | null => {
    const found = pokemonsList.find(p => p.id === id);
    return found ? found.name : null;
  };

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null;
  const prevName = prevId ? findPokemonNameById(prevId) : null;
  const nextName = nextId ? findPokemonNameById(nextId) : null;

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="min-h-screen">
        {/* Hero Section */}
        <div 
          className="relative pt-20 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8"
          style={{
            background: `linear-gradient(135deg, hsl(var(--${pokemon.types[0]})/0.3) 0%, hsl(var(--${pokemon.types[0]})/0.1) 50%, transparent 100%)`,
          }}
        >
          <div className="max-w-[80rem] mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/" className="hover:text-foreground transition-colors">Pokedex</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground capitalize">{pokemon.name}</span>
            </nav>

            {/* Back & Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Pokedex
              </Link>
              
              <div className="flex items-center gap-2">
                {prevName && (
                  <Link
                    href={`/pokemon/${prevName}`}
                    className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:border-[hsl(var(--electric)/0.5)] transition-colors"
                  >
                    #{prevId!.toString().padStart(3, "0")}
                  </Link>
                )}
                {nextName && (
                  <Link
                    href={`/pokemon/${nextName}`}
                    className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:border-[hsl(var(--electric)/0.5)] transition-colors"
                  >
                    #{nextId!.toString().padStart(3, "0")}
                  </Link>
                )}
              </div>
            </div>

            {/* Main Hero Content */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              {/* Pokemon Image */}
              <div className="flex-shrink-0 flex justify-center lg:justify-start">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent rounded-full" />
                  <Image
                    src={imageUrl}
                    alt={capitalizedName}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                    unoptimized
                  />
                </div>
              </div>

              {/* Pokemon Info */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Name & ID */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground">
                    {capitalizedName}
                  </h1>
                  <span className="px-3 py-1 text-lg font-mono font-bold rounded-lg bg-card/80 border border-border text-muted-foreground">
                    #{pokemon.id.toString().padStart(3, "0")}
                  </span>
                </div>

                {/* Type Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {pokemon.types.map(type => (
                    <Link key={type} href={`/types/${type}`}>
                      <TypeBadge type={type} size="lg" insideLink={true} />
                    </Link>
                  ))}
                </div>

                {/* Category Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <RarityBadge rarity={pokemon.rarity_tier} size="lg" />
                  <GenerationBadge generation={pokemon.generation} size="lg" />
                  <RoleBadge role={pokemon.stat_category} size="lg" />
                </div>

                {/* Flavor Text */}
                {pokemon.flavor_text && (
                  <p className="text-base sm:text-lg text-muted-foreground italic max-w-2xl mb-4">
                    "{pokemon.flavor_text}"
                  </p>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-500" />
                    <span className="text-muted-foreground">Height:</span>
                    <span className="font-medium">{formatHeight(pokemon.height)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-500" />
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-medium">{formatWeight(pokemon.weight)}</span>
                  </div>
                </div>

                {/* Battle Button - Updated Link */}
                <div className="mt-6">
                  <Link
                    href={`/pokemon/${pokemon.name}/pikachu`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[hsl(var(--fire))] to-[hsl(var(--electric))] text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Swords className="w-5 h-5" />
                    Battle {capitalizedName}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-8">
          {/* Three Column Layout for Stats, Abilities & Evolution */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Stats Section */}
            <div className="px-2 py-4 sm:px-3 sm:py-6 bg-card/30 rounded-2xl border border-border/50">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[hsl(var(--electric)/0.15)]">
                    <Target className="w-4 h-4 text-[hsl(var(--electric))]" />
                  </div>
                  Base Stats
                </div>
                <span className="text-xl sm:text-2xl font-bold text-yellow-500">
                  {pokemon.total_stats}
                </span>
              </h2>
              <div className="space-y-2">
                {pokemon.stats.map(stat => (
                  <StatBar key={stat.stat.name} name={stat.stat.name} value={stat.base_stat} />
                ))}
              </div>
            </div>

            {/* Abilities */}
            {pokemon.abilitiesDetailed && pokemon.abilitiesDetailed.length > 0 && (
              <AbilityCard abilities={pokemon.abilitiesDetailed} />
            )}

            {/* Evolution Chain - spans full width on md (2 cols) and lg (2 cols) */}
            {pokemon.evolutionChain && (
              <div className="md:col-span-2 lg:col-span-2">
                <EvolutionChain chain={pokemon.evolutionChain} currentPokemon={pokemon.name} />
              </div>
            )}
          </div>

          {/* Moves Table */}
          {pokemon.moves && pokemon.moves.length > 0 && (
            <MovesTable moves={pokemon.moves} />
          )}

          {/* Species Info & Breeding */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Species Info */}
            <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[hsl(var(--water)/0.15)]">
                  <Star className="w-4 h-4 text-[hsl(var(--water))]" />
                </div>
                Species Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capture Rate</span>
                  <span className="font-medium">{pokemon.capture_rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Experience</span>
                  <span className="font-medium">{pokemon.base_experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Growth Rate</span>
                  <span className="font-medium capitalize">{pokemon.growth_rate.replace("-", " ")}</span>
                </div>
                {pokemon.habitat && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Habitat</span>
                    <span className="font-medium capitalize">{pokemon.habitat}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color</span>
                  <span className="font-medium capitalize">{pokemon.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shape</span>
                  <span className="font-medium capitalize">{pokemon.shape}</span>
                </div>
              </div>
            </div>

            {/* Breeding Info */}
            <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[hsl(var(--grass)/0.15)]">
                  <Dna className="w-4 h-4 text-[hsl(var(--grass))]" />
                </div>
                Breeding
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender Ratio</span>
                  <span className="font-medium">{formatGenderRatio(pokemon.genderRatio)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Egg Groups</span>
                  <span className="font-medium capitalize">
                    {pokemon.egg_groups.length > 0 
                      ? pokemon.egg_groups.join(", ") 
                      : "Undiscovered"
                    }
                  </span>
                </div>
                {pokemon.hatchSteps > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hatch Steps</span>
                    <span className="font-medium">{pokemon.hatchSteps.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Encounter Locations */}
          {pokemon.encounters && pokemon.encounters.length > 0 && (
            <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[hsl(var(--ground)/0.15)]">
                  <MapPin className="w-4 h-4 text-[hsl(var(--ground))]" />
                </div>
                Where to Find
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pokemon.encounters.slice(0, 12).map((enc, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <div className="font-medium text-sm text-foreground mb-1">
                      {enc.location}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {enc.games.slice(0, 3).map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(", ")}
                      {enc.games.length > 3 && ` +${enc.games.length - 3} more`}
                    </div>
                  </div>
                ))}
              </div>
              {pokemon.encounters.length > 12 && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  And {pokemon.encounters.length - 12} more locations...
                </p>
              )}
            </div>
          )}

          {/* Forms Gallery */}
          {pokemon.forms && pokemon.forms.length > 0 && (
            <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[hsl(var(--plasma)/0.15)]">
                  <Sparkles className="w-4 h-4 text-[hsl(var(--plasma))]" />
                </div>
                Alternate Forms
              </h3>
              <div className="flex flex-wrap gap-4">
                {pokemon.forms.map((form, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    {form.sprites.default ? (
                      <div className="relative w-20 h-20">
                        <Image
                          src={form.sprites.default}
                          alt={form.formName}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-secondary/50 rounded-lg">
                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-xs font-medium text-foreground mt-1 text-center">
                      {form.formName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Pokemon - Links to same type */}
          <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
              Explore More
            </h3>
            <div className="flex flex-wrap gap-3">
              {pokemon.types.map(type => (
                <Link
                  key={type}
                  href={`/types/${type}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-[hsl(var(--electric)/0.3)] transition-all"
                >
                  <TypeBadge type={type} size="sm" insideLink={true} />
                  <span className="text-sm font-medium">All {capitalize(type)} Pokemon</span>
                </Link>
              ))}
              <Link
                href={`/generations/${pokemon.generation}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-[hsl(var(--electric)/0.3)] transition-all"
              >
                <span className="text-sm font-medium">
                  All {pokemon.generation.replace("generation-", "Gen ").toUpperCase()} Pokemon
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Battle Opponent Selection - Full Width */}
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 pt-8 border-t border-border/50">
           <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--fire)/0.1)] border border-[hsl(var(--fire)/0.2)] mb-4">
                <Swords className="w-4 h-4 text-[hsl(var(--fire))]" />
                <span className="text-sm font-medium text-[hsl(var(--fire))]">Choose an Opponent</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">
                Who can defeat {capitalizedName}?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select a Pokemon from the list below to start a battle simulation against {capitalizedName}.
              </p>
           </div>
           <PokemonList initialPokemons={pokemonsList} compareWith={pokemon.name} />
        </div>
      </div>
    </>
  );
}

async function PokemonComparisonView({ id1, id2 }: { id1: string; id2: string }) {
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

  const jsonLd = generateComparisonJsonLd(pokemonData1, pokemonData2, id1, id2);

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
        <FightSimulator pokemon1={pokemonData1} pokemon2={pokemonData2} allPokemon={allPokemon} />

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

      {/* Email Popup - shows after 10 seconds */}
      <EmailPopup />
    </>
  );
}

// -----------------------------------------------------------------------------
// Main Page Component
// -----------------------------------------------------------------------------

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 1) {
    return <PokemonDetailView name={slug[0]} />;
  } else if (slug.length === 2) {
    return <PokemonComparisonView id1={slug[0]} id2={slug[1]} />;
  }

  notFound();
}
