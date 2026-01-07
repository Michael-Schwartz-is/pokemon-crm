"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Lock, Unlock, Shuffle } from "lucide-react";
import PokemonCard from "./PokemonCard";
import { Pokemon } from "@/util/CachePokemons";

type PokemonBasic = {
  id: string;
  name: string;
};

interface BattleArenaProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  allPokemon: PokemonBasic[];
}

export default function BattleArena({ pokemon1, pokemon2, allPokemon }: BattleArenaProps) {
  const router = useRouter();
  const [lockedSide, setLockedSide] = useState<"left" | "right" | null>(null);

  const getRandomPokemon = useCallback(
    (exclude?: string) => {
      if (allPokemon.length === 0) return null;
      let attempts = 0;
      let pokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
      while (pokemon.name === exclude && attempts < 100) {
        pokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
        attempts++;
      }
      return pokemon;
    },
    [allPokemon]
  );

  const handleShuffle = useCallback(() => {
    let newLeft = pokemon1.name;
    let newRight = pokemon2.name;

    if (lockedSide === "left") {
      // Keep left, randomize right
      const newPokemon = getRandomPokemon(pokemon1.name);
      if (newPokemon) newRight = newPokemon.name;
    } else if (lockedSide === "right") {
      // Keep right, randomize left
      const newPokemon = getRandomPokemon(pokemon2.name);
      if (newPokemon) newLeft = newPokemon.name;
    } else {
      // Randomize both
      const left = getRandomPokemon();
      const right = getRandomPokemon(left?.name);
      if (left && right) {
        newLeft = left.name;
        newRight = right.name;
      }
    }

    router.push(`/compare/${newLeft}/${newRight}`);
  }, [lockedSide, pokemon1.name, pokemon2.name, getRandomPokemon, router]);

  const toggleLock = (side: "left" | "right") => {
    setLockedSide((prev) => (prev === side ? null : side));
  };

  return (
    <div className="relative flex flex-row gap-2 sm:gap-4 md:gap-6 justify-center items-start">
      {/* Left Pokemon with Lock */}
      <div className="relative">
        <button
          onClick={() => toggleLock("left")}
          className={`absolute -top-2 -right-2 z-20 p-1.5 sm:p-2 rounded-full transition-all ${
            lockedSide === "left"
              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/40 scale-110"
              : "bg-white text-gray-400 hover:text-amber-500 hover:bg-amber-50 shadow-md border border-gray-200"
          }`}
          title={lockedSide === "left" ? "Unlock this Pokemon" : "Lock this Pokemon"}
        >
          {lockedSide === "left" ? (
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
        <PokemonCard poke={pokemon1} showChart={false} />
      </div>

      {/* VS divider with Shuffle button */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 sm:gap-3">
        <span className="text-xl sm:text-3xl md:text-4xl font-black text-red-500 italic drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
          VS
        </span>
        <button
          onClick={handleShuffle}
          className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-110 transition-all active:scale-95"
          title={
            lockedSide
              ? `Shuffle ${lockedSide === "left" ? "right" : "left"} Pokemon`
              : "Shuffle both Pokemon"
          }
        >
          <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Right Pokemon with Lock */}
      <div className="relative">
        <button
          onClick={() => toggleLock("right")}
          className={`absolute -top-2 -left-2 z-20 p-1.5 sm:p-2 rounded-full transition-all ${
            lockedSide === "right"
              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/40 scale-110"
              : "bg-white text-gray-400 hover:text-amber-500 hover:bg-amber-50 shadow-md border border-gray-200"
          }`}
          title={lockedSide === "right" ? "Unlock this Pokemon" : "Lock this Pokemon"}
        >
          {lockedSide === "right" ? (
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
        <PokemonCard poke={pokemon2} showChart={false} />
      </div>
    </div>
  );
}

