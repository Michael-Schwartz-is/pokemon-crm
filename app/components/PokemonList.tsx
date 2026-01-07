"use client";

import { useState, useEffect } from "react";
import { Pokemon } from "@/util/CachePokemons";
import PokemonCard from "./PokemonCard";
import useStore from "../stores/pokemonStore";
import { useRouter } from "next/navigation";
import { Swords, X, ChevronDown, Zap } from "lucide-react";

type PokemonListProps = {
  initialPokemons: Pokemon[];
};

export default function PokemonList({ initialPokemons }: PokemonListProps) {
  const { searchQuery, selectedPokemonIds, toggleSelectedPokemon, clearSelectedPokemons } =
    useStore();
  const [displayLimit, setDisplayLimit] = useState(40);
  const router = useRouter();

  useEffect(() => {
    if (selectedPokemonIds.length === 2) {
      const [id1, id2] = selectedPokemonIds;
      router.push(`/compare/${id1}/${id2}`);

      const timer = setTimeout(() => {
        clearSelectedPokemons();
      }, 1000);
      return () => {
        clearTimeout(timer);
        clearSelectedPokemons();
      };
    }
  }, [selectedPokemonIds, router, clearSelectedPokemons]);

  const filteredPokemons = initialPokemons.filter((poke) =>
    poke.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayed = filteredPokemons.slice(0, displayLimit);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Floating Selection Bar */}
      {selectedPokemonIds.length > 0 && (
        <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
          <div className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3 sm:py-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-[hsl(var(--electric)/0.3)] shadow-[0_8px_40px_hsl(var(--electric)/0.2)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--fire))] flex items-center justify-center">
                <Zap className="w-4 h-4 text-background" />
              </div>
              <span className="text-foreground font-semibold text-sm sm:text-base whitespace-nowrap">
                {selectedPokemonIds.length}/2 selected
              </span>
            </div>

            <div className="w-px h-6 bg-border" />

            <button
              onClick={clearSelectedPokemons}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-[hsl(var(--fire))] hover:bg-[hsl(var(--fire)/0.1)] transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Pokemon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-items-center w-full">
        {displayed.map((poke, index) => (
          <div
            key={poke.name}
            className="w-full flex justify-center animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <PokemonCard
              poke={poke}
              isSelected={selectedPokemonIds.includes(poke.name)}
              onSelect={() => toggleSelectedPokemon(poke.name)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPokemons.length === 0 && (
        <div className="text-center mt-12 sm:mt-16 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <Swords className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-1">No fighters found</p>
          <p className="text-sm text-muted-foreground">
            No Pokemon matching &quot;{searchQuery}&quot; — try another name!
          </p>
        </div>
      )}

      {/* Load More Button */}
      {filteredPokemons.length > displayLimit && (
        <button
          onClick={() => setDisplayLimit((prev) => prev + 40)}
          className="mt-10 sm:mt-12 group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl btn-neon text-sm sm:text-base"
        >
          <span>Load More</span>
          <span className="px-2 py-0.5 rounded-md bg-background/20 text-xs font-mono">
            {filteredPokemons.length - displayLimit}
          </span>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
        </button>
      )}
    </div>
  );
}
