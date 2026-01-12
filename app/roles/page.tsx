import Link from "next/link";
import { Metadata } from "next";
import rolesData from "@/app/data/roles.json";
import { Sword, Sparkles, Shield, ShieldPlus, Zap, Scale, ChevronRight } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

export const metadata: Metadata = {
  title: "Pokemon Battle Roles - Team Building Guide",
  description: "Understand Pokemon battle roles: Physical Attackers, Special Attackers, Tanks, Speedsters, and more. Build balanced teams with the right roles.",
  alternates: {
    canonical: "/roles",
  },
  openGraph: {
    title: "Pokemon Battle Roles - Team Building Guide",
    description: "Understand Pokemon battle roles and build balanced teams.",
    url: `${baseUrl}/roles`,
    type: "website",
  },
};

// Role icons mapping
const ROLE_ICONS: Record<string, React.ReactNode> = {
  "physical-attacker": <Sword className="w-8 h-8" />,
  "special-attacker": <Sparkles className="w-8 h-8" />,
  "physical-tank": <Shield className="w-8 h-8" />,
  "special-tank": <ShieldPlus className="w-8 h-8" />,
  "speedster": <Zap className="w-8 h-8" />,
  "balanced": <Scale className="w-8 h-8" />,
};

function generateRolesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pokemon Battle Roles",
    description: "Guide to Pokemon battle roles for team building strategy.",
    url: `${baseUrl}/roles`,
    mainEntity: {
      "@type": "ItemList",
      name: "Battle Roles",
      numberOfItems: rolesData.length,
      itemListElement: rolesData.map((role, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: role.name,
        url: `${baseUrl}/roles/${role.id}`,
      })),
    },
  };
}

export default function RolesPage() {
  const jsonLd = generateRolesSchema();

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
            Battle <span className="gradient-text">Roles</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every Pokemon has a role to play. Understanding these roles is key to building a balanced and powerful team.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolesData.map((role, index) => (
            <Link
              key={role.id}
              href={`/roles/${role.id}`}
              className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-border transition-all duration-300 hover:border-[hsl(var(--electric)/0.5)] hover:shadow-xl animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: role.color }}
              />

              {/* Icon */}
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ 
                  backgroundColor: `${role.color}20`,
                  color: role.color,
                }}
              >
                {ROLE_ICONS[role.id]}
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-[hsl(var(--electric))] transition-colors">
                    {role.name}
                  </h2>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {role.description}
                </p>

                {/* Stat focus tag */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Primary Stat:</span>
                  <span 
                    className="px-2 py-0.5 rounded-md text-xs font-medium capitalize"
                    style={{ 
                      backgroundColor: `${role.color}20`,
                      color: role.color,
                    }}
                  >
                    {role.stat_focus === "all" ? "Balanced" : role.stat_focus.replace("-", " ")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Team Building Tips */}
        <div className="mt-16 p-8 rounded-3xl bg-card border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Team Building Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[hsl(var(--electric)/0.2)] flex items-center justify-center text-sm">1</span>
                Balance Your Roles
              </h3>
              <p className="text-sm text-muted-foreground">
                A well-rounded team needs a mix of attackers, tanks, and utility Pokemon. Don&apos;t stack too many of one role.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[hsl(var(--fire)/0.2)] flex items-center justify-center text-sm">2</span>
                Consider Speed Tiers
              </h3>
              <p className="text-sm text-muted-foreground">
                Speedsters can sweep weakened teams, but they&apos;re fragile. Pair them with tanks that can absorb hits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[hsl(var(--water)/0.2)] flex items-center justify-center text-sm">3</span>
                Physical vs Special
              </h3>
              <p className="text-sm text-muted-foreground">
                Mix physical and special attackers to handle opponents with unbalanced defenses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[hsl(var(--grass)/0.2)] flex items-center justify-center text-sm">4</span>
                Know Your Win Condition
              </h3>
              <p className="text-sm text-muted-foreground">
                Identify which Pokemon is your sweeper and build your team to support their success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


