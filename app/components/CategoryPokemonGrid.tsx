"use client";

import { Pokemon } from "@/util/CachePokemons";
import PokemonCard from "./PokemonCard";

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

      {/* Pokemon Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {pokemons.map((poke, index) => (
          <div
            key={poke.name}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <PokemonCard
              poke={poke}
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
