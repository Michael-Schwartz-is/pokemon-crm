import * as fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Pokemon } from "@/util/CachePokemons";
import CategoryPokemonGrid from "@/app/components/CategoryPokemonGrid";
import generationsData from "@/app/data/generations.json";
import { ArrowLeft, MapPin, Calendar, Gamepad2, Crown, Sparkles, ChevronRight } from "lucide-react";
import { getPokemonImageUrl } from "@/util/pokemonImage";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

type GenerationPageProps = {
  params: Promise<{ gen: string }>;
};

// Generation colors
const GEN_COLORS: Record<string, string> = {
  "generation-i": "#FF1111",
  "generation-ii": "#E6C317",
  "generation-iii": "#00A8FF",
  "generation-iv": "#4A90D9",
  "generation-v": "#3C3C3C",
  "generation-vi": "#025DA6",
  "generation-vii": "#F4A100",
  "generation-viii": "#00D4AA",
  "generation-ix": "#E74C3C",
};

// Generate static params for all generations
export async function generateStaticParams() {
  return generationsData.map((gen) => ({
    gen: gen.name,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: GenerationPageProps): Promise<Metadata> {
  const { gen } = await params;
  const genData = generationsData.find((g) => g.name === gen);
  
  if (!genData) {
    return {
      title: "Generation Not Found",
    };
  }

  return {
    title: `${genData.display_name} Pokemon - ${genData.region} Region Guide`,
    description: genData.description,
    alternates: {
      canonical: `/generations/${gen}`,
    },
    openGraph: {
      title: `${genData.display_name} Pokemon - ${genData.region} Region`,
      description: genData.description,
      url: `${baseUrl}/generations/${gen}`,
      type: "website",
    },
  };
}

function generateGenerationSchema(genData: typeof generationsData[0], pokemonCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genData.display_name} Pokemon`,
    description: genData.description,
    url: `${baseUrl}/generations/${genData.name}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${genData.region} Region Pokemon`,
      numberOfItems: pokemonCount,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Generations", item: `${baseUrl}/generations` },
        { "@type": "ListItem", position: 3, name: genData.display_name, item: `${baseUrl}/generations/${genData.name}` },
      ],
    },
  };
}

// Mini Pokemon preview card
function PokemonPreview({ pokemon }: { pokemon: Pokemon }) {
  return (
    <Link
      href={`/compare/${pokemon.name}/${pokemon.name}`}
      className="group flex flex-col items-center p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
    >
      <div className="w-16 h-16 mb-2">
        <img
          src={getPokemonImageUrl(pokemon.id)}
          alt={pokemon.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
          loading="lazy"
        />
      </div>
      <span className="text-xs font-medium capitalize text-foreground">{pokemon.name}</span>
    </Link>
  );
}

export default async function GenerationPage({ params }: GenerationPageProps) {
  const { gen } = await params;
  const genData = generationsData.find((g) => g.name === gen);

  if (!genData) {
    notFound();
  }

  // Load Pokemon data
  const filePath = path.join(process.cwd(), "app/data/AllPokemons.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const allPokemons: Record<string, Pokemon> = JSON.parse(fileContent);

  // Filter Pokemon by generation
  const filteredPokemons = Object.values(allPokemons)
    .filter((poke) => poke.generation === gen)
    .sort((a, b) => a.id - b.id);

  // Get starter Pokemon
  const starters = genData.starters
    .map((name) => allPokemons[name])
    .filter(Boolean);

  // Get legendary Pokemon
  const legendaries = genData.legendaries
    .map((name) => allPokemons[name])
    .filter(Boolean);

  const color = GEN_COLORS[gen] || "#888";
  const jsonLd = generateGenerationSchema(genData, filteredPokemons.length);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <div 
          className="relative pt-20 pb-12 px-4 sm:px-6 md:px-8"
          style={{ 
            background: `linear-gradient(135deg, ${color}30 0%, ${color}10 50%, transparent 100%)`,
          }}
        >
          <div className="max-w-[80rem] mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/generations" className="hover:text-foreground transition-colors">Generations</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{genData.display_name}</span>
            </nav>

            {/* Back link */}
            <Link
              href="/generations"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Generations
            </Link>

            {/* Generation Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Gen Badge */}
              <div 
                className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: `${color}20`,
                  border: `3px solid ${color}`,
                  boxShadow: `0 8px 32px ${color}30`,
                }}
              >
                <span className="text-4xl font-black" style={{ color }}>
                  {genData.display_name.split(" ")[1]}
                </span>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-2">
                  {genData.display_name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mb-4">
                  {genData.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                    <MapPin className="w-4 h-4" style={{ color }} />
                    <span className="text-foreground font-medium">{genData.region}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                    <Calendar className="w-4 h-4" style={{ color }} />
                    <span className="text-foreground font-medium">{genData.year_released}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                    <Gamepad2 className="w-4 h-4" style={{ color }} />
                    <span className="text-foreground font-medium">{filteredPokemons.length} Pokemon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 py-8">
          {/* Version Groups */}
          {genData.version_groups.length > 0 && (
            <div className="mb-8 p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" style={{ color }} />
                Games Released
              </h2>
              <div className="flex flex-wrap gap-2">
                {genData.version_groups.map((vg) => (
                  <span
                    key={vg}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium capitalize"
                  >
                    {vg.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Featured Pokemon */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Starters */}
            {starters.length > 0 && (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--electric))]" />
                  Starter Pokemon
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {starters.map((pokemon) => (
                    <PokemonPreview key={pokemon.name} pokemon={pokemon} />
                  ))}
                </div>
              </div>
            )}

            {/* Legendaries */}
            {legendaries.length > 0 && (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#ffc107]" />
                  Legendary & Mythical
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
                  {legendaries.map((pokemon) => (
                    <PokemonPreview key={pokemon.name} pokemon={pokemon} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* All Pokemon */}
          <CategoryPokemonGrid 
            pokemons={filteredPokemons}
            title={`All ${genData.display_name} Pokemon`}
            subtitle={`(${filteredPokemons.length})`}
          />
        </div>
      </div>
    </>
  );
}

