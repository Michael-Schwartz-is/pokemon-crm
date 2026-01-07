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
      className={`px-4 pt-4 bg-slate-50 border relative border-red-100 rounded-md max-w-[320px] transition-all cursor-pointer ${
        isSelected
          ? "ring-4 ring-red-500 border-transparent shadow-lg scale-105 z-10"
          : "hover:border-red-300"
      }`}
    >
      <h3 className=" text-4xl font-bold text-slate-600">{poke?.name}</h3>
      <div className="relative w-[300px] h-[300px]">
        <Image
          src={
            imgSrc ||
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          }
          className="scale-110 object-contain"
          fill
          alt={poke.name}
          onError={() =>
            setImgSrc(
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            )
          }
        />
      </div>
      {showChart && <StatChart chartData={pokeChartData} name={poke.name} />}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
          ✓
        </div>
      )}
    </div>
  );
}
