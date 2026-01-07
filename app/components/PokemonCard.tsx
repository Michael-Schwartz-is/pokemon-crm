"use client";

import Image from "next/image";
import { Pokemon, Stats } from "@/util/CachePokemons";
import { StatChart } from "@/app/components/StatChart";
import { useState, useEffect } from "react";

type PokemonCardProps = {
  poke: Pokemon;
  isSelected?: boolean;
  onSelect?: () => void;
  showChart?: boolean;
};

export default function PokemonCard({
  poke,
  isSelected,
  onSelect,
  showChart = false,
}: PokemonCardProps) {
  const [imgSrc, setImgSrc] = useState(poke.image);

  useEffect(() => {
    setImgSrc(poke.image);
  }, [poke.image]);

  const handleChartData = (arr: Stats[]) => {
    const chartData = arr.map((item: Stats) => ({
      base_stat: item.base_stat,
      effort: item.effort,
      name: item.stat.name,
    }));
    return chartData;
  };

  const pokeChartData = handleChartData(poke.stats);

  return (
    <div
      onClick={onSelect}
      className={`p-2 sm:p-3 md:p-4 bg-slate-50 border relative border-red-100 rounded-md w-full min-w-0 max-w-[320px] transition-all cursor-pointer ${
        isSelected
          ? "ring-2 sm:ring-4 ring-red-500 border-transparent shadow-lg scale-[1.02] sm:scale-105 z-10"
          : "hover:border-red-300"
      }`}
    >
      <div className="relative w-full aspect-square">
        <Image
          src={
            imgSrc ||
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          }
          className="scale-105 sm:scale-110 object-contain"
          fill
          sizes="(max-width: 400px) 140px, (max-width: 640px) 180px, 300px"
          alt={poke.name}
          onError={() =>
            setImgSrc(
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            )
          }
        />
      </div>
      <p className="text-xs sm:text-sm md:text-base text-center text-slate-600 font-medium capitalize mt-1 truncate">
        {poke?.name}
      </p>
      {showChart && <StatChart chartData={pokeChartData} name={poke.name} />}
      {isSelected && (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-base">
          ✓
        </div>
      )}
    </div>
  );
}
