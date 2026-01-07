import * as fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Pokemon } from "@/util/CachePokemons";
import CategoryPokemonGrid from "@/app/components/CategoryPokemonGrid";
import PokemonCard from "@/app/components/PokemonCard";
import rolesData from "@/app/data/roles.json";
import { ArrowLeft, Sword, Sparkles, Shield, ShieldPlus, Zap, Scale, ChevronRight, Target } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pokemon-crm.vercel.app";

type RolePageProps = {
  params: Promise<{ role: string }>;
};

// Role icons mapping
const ROLE_ICONS: Record<string, React.ReactNode> = {
  "physical-attacker": <Sword className="w-10 h-10" />,
  "special-attacker": <Sparkles className="w-10 h-10" />,
  "physical-tank": <Shield className="w-10 h-10" />,
  "special-tank": <ShieldPlus className="w-10 h-10" />,
  "speedster": <Zap className="w-10 h-10" />,
  "balanced": <Scale className="w-10 h-10" />,
};

// Generate static params for all roles
export async function generateStaticParams() {
  return rolesData.map((role) => ({
    role: role.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const { role } = await params;
  const roleData = rolesData.find((r) => r.id === role);
  
  if (!roleData) {
    return {
      title: "Role Not Found",
    };
  }

  return {
    title: `${roleData.name} Pokemon - Best ${roleData.name}s for Your Team`,
    description: roleData.description,
    alternates: {
      canonical: `${baseUrl}/roles/${role}`,
    },
    openGraph: {
      title: `${roleData.name} Pokemon`,
      description: roleData.description,
      url: `${baseUrl}/roles/${role}`,
      type: "website",
    },
  };
}

function generateRoleSchema(roleData: typeof rolesData[0], pokemonCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${roleData.name} Pokemon`,
    description: roleData.description,
    url: `${baseUrl}/roles/${roleData.id}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${roleData.name} Pokemon`,
      numberOfItems: pokemonCount,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Roles", item: `${baseUrl}/roles` },
        { "@type": "ListItem", position: 3, name: roleData.name, item: `${baseUrl}/roles/${roleData.id}` },
      ],
    },
  };
}

export default async function RolePage({ params }: RolePageProps) {
  const { role } = await params;
  const roleData = rolesData.find((r) => r.id === role);

  if (!roleData) {
    notFound();
  }

  // Load Pokemon data
  const filePath = path.join(process.cwd(), "app/data/AllPokemons.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const allPokemons: Record<string, Pokemon> = JSON.parse(fileContent);

  // Filter Pokemon by stat category (role)
  const filteredPokemons = Object.values(allPokemons)
    .filter((poke) => poke.stat_category === role)
    .sort((a, b) => b.total_stats - a.total_stats); // Sort by total stats descending

  const jsonLd = generateRoleSchema(roleData, filteredPokemons.length);

  // Get top performers (top 6 by total stats)
  const topPerformers = filteredPokemons.slice(0, 6);

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
            background: `linear-gradient(135deg, ${roleData.color}30 0%, ${roleData.color}10 50%, transparent 100%)`,
          }}
        >
          <div className="max-w-[80rem] mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/roles" className="hover:text-foreground transition-colors">Roles</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{roleData.name}</span>
            </nav>

            {/* Back link */}
            <Link
              href="/roles"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Roles
            </Link>

            {/* Role Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Role Icon */}
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: `${roleData.color}20`,
                  border: `2px solid ${roleData.color}`,
                  color: roleData.color,
                  boxShadow: `0 8px 32px ${roleData.color}30`,
                }}
              >
                {ROLE_ICONS[role]}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-2">
                  {roleData.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mb-4">
                  {roleData.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg"
                    style={{ 
                      backgroundColor: `${roleData.color}15`,
                      border: `1px solid ${roleData.color}30`,
                    }}
                  >
                    <Target className="w-4 h-4" style={{ color: roleData.color }} />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Focus:</span>{" "}
                      <span className="font-medium text-foreground capitalize">
                        {roleData.stat_focus === "all" ? "All Stats" : roleData.stat_focus.replace("-", " ")}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                    <span className="text-sm">
                      <span className="text-muted-foreground">Pokemon:</span>{" "}
                      <span className="font-bold text-foreground">{filteredPokemons.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 md:px-8 py-8">
          {/* Role criteria */}
          <div className="mb-8 p-6 rounded-2xl bg-card border border-border">
            <h2 className="text-lg font-bold text-foreground mb-2">Classification Criteria</h2>
            <p className="text-muted-foreground">{roleData.criteria}</p>
          </div>

          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${roleData.color}20`, color: roleData.color }}
                >
                  ⭐
                </span>
                Top {roleData.name}s
                <span className="text-muted-foreground font-normal text-lg">(by Total Stats)</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {topPerformers.map((poke, index) => (
                  <div
                    key={poke.name}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PokemonCard poke={poke} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Pokemon */}
          <CategoryPokemonGrid 
            pokemons={filteredPokemons}
            title={`All ${roleData.name} Pokemon`}
            subtitle={`(${filteredPokemons.length})`}
          />
        </div>
      </div>
    </>
  );
}

