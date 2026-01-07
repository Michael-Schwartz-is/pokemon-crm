import Link from "next/link";
import { Metadata } from "next";
import typesData from "@/app/data/types.json";
import { Flame, Droplets, Zap, Leaf, Snowflake, Sword, Skull, Mountain, Wind, Brain, Bug, Gem, Ghost, Sparkles, Moon, Shield, Heart } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

export const metadata: Metadata = {
  title: "Pokemon Types - All 18 Types Explained",
  description: "Explore all 18 Pokemon types with damage relations, strengths, weaknesses, and Pokemon lists. Master type matchups for battle strategy.",
  alternates: {
    canonical: `${baseUrl}/types`,
  },
  openGraph: {
    title: "Pokemon Types - All 18 Types Explained",
    description: "Explore all 18 Pokemon types with damage relations, strengths, and weaknesses.",
    url: `${baseUrl}/types`,
    type: "website",
  },
};

// Type icons mapping
const TYPE_ICONS: Record<string, React.ReactNode> = {
  normal: <Shield className="w-6 h-6" />,
  fire: <Flame className="w-6 h-6" />,
  water: <Droplets className="w-6 h-6" />,
  electric: <Zap className="w-6 h-6" />,
  grass: <Leaf className="w-6 h-6" />,
  ice: <Snowflake className="w-6 h-6" />,
  fighting: <Sword className="w-6 h-6" />,
  poison: <Skull className="w-6 h-6" />,
  ground: <Mountain className="w-6 h-6" />,
  flying: <Wind className="w-6 h-6" />,
  psychic: <Brain className="w-6 h-6" />,
  bug: <Bug className="w-6 h-6" />,
  rock: <Gem className="w-6 h-6" />,
  ghost: <Ghost className="w-6 h-6" />,
  dragon: <Sparkles className="w-6 h-6" />,
  dark: <Moon className="w-6 h-6" />,
  steel: <Shield className="w-6 h-6" />,
  fairy: <Heart className="w-6 h-6" />,
};

function generateTypesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pokemon Types",
    description: "Complete guide to all 18 Pokemon types with damage relations and strategies.",
    url: `${baseUrl}/types`,
    mainEntity: {
      "@type": "ItemList",
      name: "Pokemon Types",
      numberOfItems: 18,
      itemListElement: typesData.map((type, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: type.name,
        url: `${baseUrl}/types/${type.name}`,
      })),
    },
  };
}

export default function TypesPage() {
  const jsonLd = generateTypesSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Pokemon <span className="gradient-text">Types</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the 18 elemental types. Understand strengths, weaknesses, and type matchups to dominate in battle.
          </p>
        </div>

        {/* Types Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {typesData.map((type, index) => {
            const isDarkText = ["electric", "normal", "ground", "ice", "steel"].includes(type.name);
            
            return (
              <Link
                key={type.name}
                href={`/types/${type.name}`}
                className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-up"
                style={{ 
                  backgroundColor: type.color,
                  animationDelay: `${index * 50}ms`,
                  boxShadow: `0 4px 20px ${type.color}40`,
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
                  />
                </div>
                
                {/* Content */}
                <div className="relative flex flex-col items-center text-center">
                  <div 
                    className={`mb-3 ${isDarkText ? "text-gray-800" : "text-white"}`}
                  >
                    {TYPE_ICONS[type.name]}
                  </div>
                  <h2 
                    className={`text-lg font-bold capitalize ${isDarkText ? "text-gray-800" : "text-white"}`}
                  >
                    {type.name}
                  </h2>
                  <p 
                    className={`text-sm mt-1 ${isDarkText ? "text-gray-700" : "text-white/80"}`}
                  >
                    {type.pokemon_count} Pokemon
                  </p>
                </div>

                {/* Corner accent */}
                <div 
                  className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isDarkText ? "bg-gray-800/20" : "bg-white/20"}`}
                />
              </Link>
            );
          })}
        </div>

        {/* Type Effectiveness Info */}
        <div className="mt-16 p-8 rounded-3xl bg-card border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Type Matchups</h2>
          <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Super Effective (2x)
              </h3>
              <p className="text-sm">
                When a move is super effective, it deals double damage. Exploiting type advantages is key to winning battles.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                Not Very Effective (0.5x)
              </h3>
              <p className="text-sm">
                Resisted moves deal half damage. Avoid attacking into resistances or switch to a better matchup.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-500" />
                No Effect (0x)
              </h3>
              <p className="text-sm">
                Some types are completely immune to others. Ground is immune to Electric, Ghost to Normal, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

