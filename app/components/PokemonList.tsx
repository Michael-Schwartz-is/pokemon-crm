"use client";

import { useState, useEffect } from "react";
import { Pokemon } from "@/util/CachePokemons";
import PokemonCard from "./PokemonCard";
import useStore from "../stores/pokemonStore";
import { useRouter } from "next/navigation";

type PokemonListProps = {
  initialPokemons: Pokemon[];
};

export default function PokemonList({ initialPokemons }: PokemonListProps) {
  const { searchQuery, selectedPokemonIds, toggleSelectedPokemon, clearSelectedPokemons } = useStore();
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
      {selectedPokemonIds.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-red-200 shadow-xl z-50 flex items-center gap-2 sm:gap-4 max-w-[90vw]">
          <span className="text-slate-700 font-medium text-sm sm:text-base whitespace-nowrap">
            {selectedPokemonIds.length} of 2 selected
          </span>
          <button 
            onClick={clearSelectedPokemons}
            className="text-sm text-red-500 hover:text-red-700 font-bold"
          >
            Clear
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center w-full">
        {displayed.map((poke) => (
          <PokemonCard 
            key={poke.name} 
            poke={poke} 
            isSelected={selectedPokemonIds.includes(poke.name)}
            onSelect={() => toggleSelectedPokemon(poke.name)}
          />
        ))}
      </div>
      
      {filteredPokemons.length === 0 && (
        <p className="text-center text-slate-500 mt-8 sm:mt-10 text-sm sm:text-base px-4">
          No pokemon found matching &quot;{searchQuery}&quot;
        </p>
      )}

      {filteredPokemons.length > displayLimit && (
        <button
          onClick={() => setDisplayLimit((prev) => prev + 40)}
          className="mt-8 sm:mt-10 px-6 sm:px-8 py-2 sm:py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors text-sm sm:text-base"
        >
          Load More ({filteredPokemons.length - displayLimit} remaining)
        </button>
      )}
    </div>
  );
}
