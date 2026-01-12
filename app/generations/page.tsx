import Link from "next/link";
import { Metadata } from "next";
import generationsData from "@/app/data/generations.json";
import { MapPin, Calendar, Gamepad2, Users, ChevronRight } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pokefightarena.com";

export const metadata: Metadata = {
  title: "Pokemon Generations - Complete History from Gen I to IX",
  description: "Explore all 9 Pokemon generations from Kanto to Paldea. Discover each region's starters, legendaries, and the Pokemon introduced in each era.",
  alternates: {
    canonical: "/generations",
  },
  openGraph: {
    title: "Pokemon Generations - Complete History",
    description: "Explore all 9 Pokemon generations from Kanto to Paldea.",
    url: `${baseUrl}/generations`,
    type: "website",
  },
};

// Generation colors
const GEN_COLORS: Record<string, string> = {
  "generation-i": "#FF1111",
  "generation-ii": "#E6C317",
  "generation-iii": "#00A8FF",
  "generation-iv": "#4A90D9",
  "generation-v": "#5C5C5C",
  "generation-vi": "#1E90FF",
  "generation-vii": "#F4A100",
  "generation-viii": "#00D4AA",
  "generation-ix": "#E74C3C",
};

function generateGenerationsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pokemon Generations",
    description: "Complete guide to all 9 Pokemon generations with regions, starters, and legendaries.",
    url: `${baseUrl}/generations`,
    mainEntity: {
      "@type": "ItemList",
      name: "Pokemon Generations",
      numberOfItems: 9,
      itemListElement: generationsData.map((gen, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: gen.display_name,
        url: `${baseUrl}/generations/${gen.name}`,
      })),
    },
  };
}

export default function GenerationsPage() {
  const jsonLd = generateGenerationsSchema();

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
            Pokemon <span className="gradient-text">Generations</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Journey through Pokemon history. From the original 151 in Kanto to the latest adventures in Paldea.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[hsl(var(--electric))] via-[hsl(var(--fire))] to-[hsl(var(--plasma))]" />

          <div className="space-y-8">
            {generationsData.map((gen, index) => {
              const isEven = index % 2 === 0;
              const color = GEN_COLORS[gen.name] || "#888";

              return (
                <Link
                  key={gen.name}
                  href={`/generations/${gen.name}`}
                  className={`
                    group relative flex items-center gap-6 animate-fade-up
                    ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-background -translate-x-1/2 z-10 transition-transform group-hover:scale-150"
                    style={{ backgroundColor: color }}
                  />

                  {/* Card */}
                  <div
                    className={`
                      flex-1 p-4 sm:p-6 rounded-2xl bg-card border border-border transition-all duration-300
                      group-hover:border-[hsl(var(--electric)/0.5)] group-hover:shadow-lg
                      ml-10 md:ml-0
                      ${isEven ? "md:mr-[52%]" : "md:ml-[52%]"}
                    `}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Gen Number Badge */}
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${color}20`,
                          border: `2px solid ${color}`,
                        }}
                      >
                        <span className="text-xl sm:text-2xl font-black" style={{ color }}>
                          {gen.display_name.split(" ")[1]}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-[hsl(var(--electric))] transition-colors truncate">
                            {gen.display_name}
                          </h2>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1 shrink-0">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{gen.region}</span>
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {gen.year_released}
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            {gen.pokemon_count} Pokemon
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {gen.description}
                        </p>

                        {/* Starters preview */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted-foreground shrink-0">Starters:</span>
                          <div className="flex flex-wrap gap-1">
                            {gen.starters.slice(0, 3).map((starter) => (
                              <span
                                key={starter}
                                className="px-2 py-0.5 rounded-md bg-secondary text-xs capitalize whitespace-nowrap"
                              >
                                {starter}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="text-3xl font-black gradient-text mb-1">9</div>
            <div className="text-sm text-muted-foreground">Generations</div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="text-3xl font-black gradient-text mb-1">9</div>
            <div className="text-sm text-muted-foreground">Regions</div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="text-3xl font-black gradient-text mb-1">28+</div>
            <div className="text-sm text-muted-foreground">Years of Pokemon</div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="text-3xl font-black gradient-text mb-1">1000+</div>
            <div className="text-sm text-muted-foreground">Pokemon Species</div>
          </div>
        </div>
      </div>
    </>
  );
}


