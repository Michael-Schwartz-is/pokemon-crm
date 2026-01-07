"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/util/CachePokemons";
import PokemonCard from "./PokemonCard";
import useStore from "../stores/pokemonStore";
import { X, Zap } from "lucide-react";

type CategoryPokemonGridProps = {
  pokemons: Pokemon[];
  title?: string;
  subtitle?: string;
};

export default function CategoryPokemonGrid({ 
  pokemons, 
  title,
  subtitle 
}: CategoryPokemonGridProps) {
  const {
    selectedPokemonIds,
    toggleSelectedPokemon,
    clearSelectedPokemons,
  } = useStore();
  const router = useRouter();

  // Navigate to compare page when 2 Pokemon are selected
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

  return (
    <div className="relative">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-foreground">
              {title}
              {subtitle && (
                <span className="text-muted-foreground font-normal ml-2">{subtitle}</span>
              )}
            </h2>
          )}
        </div>
      )}

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {pokemons.map((poke, index) => (
          <div
            key={poke.name}
            className="animate-fade-up"
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
      {pokemons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No Pokemon found in this category.</p>
        </div>
      )}
    </div>
  );
}

