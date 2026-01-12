import * as fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Pokemon } from "@/util/CachePokemons";
import CategoryPokemonGrid from "@/app/components/CategoryPokemonGrid";
import typesData from "@/app/data/types.json";
import { ArrowLeft, Swords, Shield, Slash, ChevronRight } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

type TypePageProps = {
  params: Promise<{ type: string }>;
};

// Generate static params for all types
export async function generateStaticParams() {
  return typesData.map((type) => ({
    type: type.name,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TypePageProps): Promise<Metadata> {
  const { type } = await params;
  const typeData = typesData.find((t) => t.name === type);
  
  if (!typeData) {
    return {
      title: "Type Not Found",
    };
  }

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  
  return {
    title: `${capitalizedType} Type Pokemon - Strengths, Weaknesses & Pokemon List`,
    description: typeData.description,
    alternates: {
      canonical: `/types/${type}`,
    },
    openGraph: {
      title: `${capitalizedType} Type Pokemon`,
      description: typeData.description,
      url: `${baseUrl}/types/${type}`,
      type: "website",
    },
  };
}

function generateTypeSchema(typeData: typeof typesData[0], pokemonCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${typeData.name.charAt(0).toUpperCase() + typeData.name.slice(1)} Type Pokemon`,
    description: typeData.description,
    url: `${baseUrl}/types/${typeData.name}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${typeData.name} Type Pokemon`,
      numberOfItems: pokemonCount,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Types", item: `${baseUrl}/types` },
        { "@type": "ListItem", position: 3, name: typeData.name, item: `${baseUrl}/types/${typeData.name}` },
      ],
    },
  };
}

// Type badge component for damage relations
function TypeBadge({ typeName, variant }: { typeName: string; variant: "strong" | "weak" | "immune" }) {
  const typeInfo = typesData.find((t) => t.name === typeName);
  const color = typeInfo?.color || "#888";
  const isDarkText = ["electric", "normal", "ground", "ice", "steel"].includes(typeName);
  
  return (
    <Link
      href={`/types/${typeName}`}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-transform hover:scale-105"
      style={{
        backgroundColor: color,
        color: isDarkText ? "#1a1a2e" : "#fff",
      }}
    >
      {typeName}
    </Link>
  );
}

export default async function TypePage({ params }: TypePageProps) {
  const { type } = await params;
  const typeData = typesData.find((t) => t.name === type);

  if (!typeData) {
    notFound();
  }

  // Load Pokemon data
  const filePath = path.join(process.cwd(), "app/data/AllPokemons.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const allPokemons: Record<string, Pokemon> = JSON.parse(fileContent);

  // Filter Pokemon by type
  const filteredPokemons = Object.values(allPokemons)
    .filter((poke) => poke.types.includes(type))
    .sort((a, b) => a.id - b.id);

  const isDarkText = ["electric", "normal", "ground", "ice", "steel"].includes(type);
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const jsonLd = generateTypeSchema(typeData, filteredPokemons.length);

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
            background: `linear-gradient(135deg, ${typeData.color}40 0%, ${typeData.color}10 50%, transparent 100%)`,
          }}
        >
          <div className="max-w-[80rem] mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/types" className="hover:text-foreground transition-colors">Types</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground capitalize">{type}</span>
            </nav>

            {/* Back link */}
            <Link
              href="/types"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Types
            </Link>

            {/* Type Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Type Badge */}
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: typeData.color,
                  boxShadow: `0 8px 32px ${typeData.color}50`,
                }}
              >
                <span 
                  className={`text-4xl font-black ${isDarkText ? "text-gray-800" : "text-white"}`}
                >
                  {type.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-2">
                  {capitalizedType} <span className="text-muted-foreground font-normal">Type</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mb-4">
                  {typeData.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="px-4 py-2 rounded-lg bg-card border border-border">
                    <span className="text-muted-foreground">Pokemon:</span>{" "}
                    <span className="font-bold text-foreground">{filteredPokemons.length}</span>
                  </div>
                  {typeData.move_damage_class && (
                    <div className="px-4 py-2 rounded-lg bg-card border border-border">
                      <span className="text-muted-foreground">Primary:</span>{" "}
                      <span className="font-bold text-foreground capitalize">{typeData.move_damage_class}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Damage Relations */}
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Offensive */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Swords className="w-5 h-5 text-[hsl(var(--fire))]" />
                Offensive Matchups
              </h2>
              
              {typeData.damage_relations.double_damage_to.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-green-500 mb-2">
                    Super Effective Against (2x)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typeData.damage_relations.double_damage_to.map((t) => (
                      <TypeBadge key={t} typeName={t} variant="strong" />
                    ))}
                  </div>
                </div>
              )}

              {typeData.damage_relations.half_damage_to.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-red-500 mb-2">
                    Not Very Effective Against (0.5x)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typeData.damage_relations.half_damage_to.map((t) => (
                      <TypeBadge key={t} typeName={t} variant="weak" />
                    ))}
                  </div>
                </div>
              )}

              {typeData.damage_relations.no_damage_to.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Slash className="w-4 h-4" />
                    No Effect Against (0x)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typeData.damage_relations.no_damage_to.map((t) => (
                      <TypeBadge key={t} typeName={t} variant="immune" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Defensive */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[hsl(var(--water))]" />
                Defensive Matchups
              </h2>
              
              {typeData.damage_relations.double_damage_from.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-red-500 mb-2">
                    Weak To (2x Damage)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typeData.damage_relations.double_damage_from.map((t) => (
                      <TypeBadge key={t} typeName={t} variant="weak" />
                    ))}
                  </div>
                </div>
              )}

              {typeData.damage_relations.half_damage_from.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-green-500 mb-2">
                    Resistant To (0.5x Damage)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typeData.damage_relations.half_damage_from.map((t) => (
                      <TypeBadge key={t} typeName={t} variant="strong" />
                    ))}
                  </div>
                </div>
              )}

              {typeData.damage_relations.no_damage_from.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-blue-500 mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Immune To (0x Damage)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typeData.damage_relations.no_damage_from.map((t) => (
                      <TypeBadge key={t} typeName={t} variant="immune" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pokemon List */}
          <CategoryPokemonGrid 
            pokemons={filteredPokemons}
            title={`All ${capitalizedType} Type Pokemon`}
            subtitle={`(${filteredPokemons.length})`}
          />
        </div>
      </div>
    </>
  );
}

