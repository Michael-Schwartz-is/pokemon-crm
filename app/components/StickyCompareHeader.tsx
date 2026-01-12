"use client";

import { useState, useEffect } from "react";
import { Pokemon } from "@/util/CachePokemons";
import { getPokemonImageUrl } from "@/util/pokemonImage";

interface StickyCompareHeaderProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
}

export default function StickyCompareHeader({ pokemon1, pokemon2 }: StickyCompareHeaderProps) {
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header when scrolled past 400px (roughly past the main cards on mobile)
      setShowStickyHeader(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300
        md:hidden
        ${showStickyHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      <div className="flex items-center justify-between px-4 py-2 gap-2">
        {/* Left Pokemon */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-10 h-10 flex-shrink-0">
            <img
              src={getPokemonImageUrl(pokemon1.id)}
              alt={pokemon1.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <span className="text-sm font-semibold capitalize truncate">
            {pokemon1.name}
          </span>
        </div>

        {/* VS divider */}
        <div className="flex-shrink-0 px-2">
          <span className="text-xs font-black text-[hsl(var(--fire))]">VS</span>
        </div>

        {/* Right Pokemon */}
        <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse">
          <div className="w-10 h-10 flex-shrink-0">
            <img
              src={getPokemonImageUrl(pokemon2.id)}
              alt={pokemon2.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <span className="text-sm font-semibold capitalize truncate text-right">
            {pokemon2.name}
          </span>
        </div>
      </div>
    </div>
  );
}
