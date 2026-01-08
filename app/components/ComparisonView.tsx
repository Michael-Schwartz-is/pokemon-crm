"use client";

import { Pokemon } from "@/util/CachePokemons";
import PokemonCard from "./PokemonCard";
import PokemonInfoPanel from "./PokemonInfoPanel";
import StickyCompareHeader from "./StickyCompareHeader";

interface ComparisonViewProps {
  pokemonData1: Pokemon;
  pokemonData2: Pokemon;
}

export default function ComparisonView({ pokemonData1, pokemonData2 }: ComparisonViewProps) {
  return (
    <>
      {/* Sticky header - only visible on mobile when scrolling */}
      <StickyCompareHeader pokemon1={pokemonData1} pokemon2={pokemonData2} />

      {/* Pokemon cards with info panels - always side by side */}
      <div className="relative flex flex-row gap-3 sm:gap-6 md:gap-8 justify-center items-start">
        {/* Left Pokemon */}
        <div className="flex flex-col items-center gap-4">
          {pokemonData1 && <PokemonCard poke={pokemonData1} showChart={false} />}
          {pokemonData1 && <PokemonInfoPanel pokemon={pokemonData1} side="left" />}
        </div>

        {/* Right Pokemon */}
        <div className="flex flex-col items-center gap-4">
          {pokemonData2 && <PokemonCard poke={pokemonData2} showChart={false} />}
          {pokemonData2 && <PokemonInfoPanel pokemon={pokemonData2} side="right" />}
        </div>

        {/* VS divider - floating centered over cards */}
        <div className="absolute left-1/2 top-[160px] sm:top-[200px] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-card border-2 border-[hsl(var(--fire)/0.5)] flex items-center justify-center shadow-[0_0_30px_hsl(var(--fire)/0.3)]">
            <span className="text-lg sm:text-2xl font-black text-[hsl(var(--fire))] vs-badge">
              VS
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
