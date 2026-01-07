"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type PokemonBasic = {
  id: string;
  name: string;
};

interface FightCombinationsSliderProps {
  combinations: [PokemonBasic, PokemonBasic][];
}

function PokemonImage({ pokemon }: { pokemon: PokemonBasic }) {
  const [errorCount, setErrorCount] = useState(0);
  const sources = [
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
  ];

  const placeholder =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

  return (
    <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
      {errorCount >= sources.length ? (
        <img src={placeholder} alt="placeholder" className="w-10 h-10 object-contain opacity-20" />
      ) : (
        <Image
          src={sources[errorCount]}
          alt={pokemon.name}
          fill
          sizes="64px"
          className="object-contain scale-[1.6] origin-bottom"
          onError={() => setErrorCount((prev) => prev + 1)}
          unoptimized={errorCount > 0} // Skip optimization for fallbacks to reduce console noise
        />
      )}
    </div>
  );
}

export default function FightCombinationsSlider({ combinations }: FightCombinationsSliderProps) {
  return (
    <div className="w-full py-12 mt-12 border-t border-gray-100">
      <h3 className="text-2xl font-bold mb-6 px-4 text-center text-gray-800">
        More Fight Combinations
      </h3>
      <div className="flex overflow-x-auto overflow-y-visible gap-6 px-4 pt-8 pb-6 no-scrollbar snap-x snap-mandatory">
        {combinations.map(([p1, p2], i) => (
          <Link
            key={i}
            href={`/compare/${p1.name}/${p2.name}`}
            className="flex-shrink-0 w-64 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all group snap-center"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col items-center flex-1">
                <PokemonImage pokemon={p1} />
                <span className="text-xs font-bold truncate w-full text-center capitalize text-gray-700">
                  {p1.name}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-lg font-black text-red-500 italic">VS</span>
              </div>

              <div className="flex flex-col items-center flex-1">
                <PokemonImage pokemon={p2} />
                <span className="text-xs font-bold truncate w-full text-center capitalize text-gray-700">
                  {p2.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
