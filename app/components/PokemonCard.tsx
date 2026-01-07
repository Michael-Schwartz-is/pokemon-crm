"use client";

import Image from "next/image";
import { Pokemon, Stats } from "@/util/CachePokemons";
import { useState, useEffect } from "react";
import { Check, Zap, Activity } from "lucide-react";

type PokemonCardProps = {
  poke: Pokemon;
  isSelected?: boolean;
  onSelect?: () => void;
  showChart?: boolean;
};

// Stat color mapping - using actual HSL values that match CSS variables
const statColors: Record<string, string> = {
  hp: "hsl(15, 100%, 55%)",           // --fire
  attack: "hsl(47, 100%, 50%)",        // --electric
  defense: "hsl(195, 100%, 60%)",      // --ice
  "special-attack": "hsl(280, 100%, 65%)", // --plasma
  "special-defense": "hsl(145, 80%, 45%)", // --toxic
  speed: "hsl(195, 100%, 60%)",        // --chart-3 (ice)
};

const statAbbreviations: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

// Mini stat bar component for hover display
function MiniStatBar({
  name,
  value,
  maxValue = 255,
}: {
  name: string;
  value: number;
  maxValue?: number;
}) {
  const percentage = (value / maxValue) * 100;
  const color = statColors[name] || "hsl(var(--electric))";
  const abbr = statAbbreviations[name] || name.slice(0, 3).toUpperCase();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-[9px] sm:text-[10px] font-mono font-medium text-muted-foreground w-10 sm:w-12 text-right uppercase tracking-tight">
        {abbr}
      </span>
      <div className="flex-1 h-2.5 sm:h-3 bg-secondary/80 rounded-md overflow-hidden relative">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.3) 5px)`,
          }}
        />
        {/* Stat bar */}
        <div
          className="h-full rounded-md transition-all duration-500 relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 12px ${color}80, inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
        </div>
      </div>
      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-foreground w-6 sm:w-7 tabular-nums">
        {value}
      </span>
    </div>
  );
}

export default function PokemonCard({
  poke,
  isSelected,
  onSelect,
  showChart = false,
}: PokemonCardProps) {
  const [imgSrc, setImgSrc] = useState(poke.image);
  const [isHovered, setIsHovered] = useState(false);

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

  // Calculate total stats
  const totalStats = poke.stats.reduce((sum, stat) => sum + Number(stat.base_stat), 0);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative p-3 sm:p-4 rounded-2xl w-full min-w-0 max-w-[320px] cursor-pointer
        bg-card border transition-all duration-300
        ${
          isSelected
            ? "border-[hsl(var(--electric))] shadow-[0_0_30px_hsl(var(--electric)/0.3)] ring-pulse scale-[1.02] z-10"
            : "border-border/50 hover:border-[hsl(var(--electric)/0.3)] card-lift"
        }
      `}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className={`
        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none
        bg-gradient-to-br from-[hsl(var(--electric)/0.05)] via-transparent to-[hsl(var(--plasma)/0.05)]
        ${isSelected ? "opacity-100" : "group-hover:opacity-100"}
      `}
      />

      {/* Pokemon Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-visible bg-secondary/30">
        {/* Background glow effect */}
        <div
          className={`
          absolute inset-0 transition-opacity duration-500 rounded-xl overflow-hidden
          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"}
        `}
        >
          <div className="absolute inset-0 bg-gradient-radial from-[hsl(var(--electric)/0.2)] via-transparent to-transparent" />
        </div>

        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src={
              imgSrc ||
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            }
            className="scale-105 sm:scale-110 object-contain transition-transform duration-500 group-hover:scale-115"
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

        {/* Stats Hover Overlay */}
        <div
          className={`
            absolute inset-0 rounded-xl z-20 transition-all duration-300 pointer-events-none
            ${isHovered && !isSelected ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
        >
          {/* Frosted glass background */}
          <div className="absolute inset-0 bg-card/95 backdrop-blur-lg rounded-xl border border-[hsl(var(--electric)/0.4)] shadow-[0_0_30px_hsl(var(--electric)/0.15)]" />

          {/* Stats content */}
          <div className="relative h-full flex flex-col p-2 sm:p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-[hsl(var(--electric)/0.15)]">
                  <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[hsl(var(--electric))]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-[hsl(var(--electric))] uppercase tracking-widest">
                  Base Stats
                </span>
              </div>
              <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-gradient-to-r from-[hsl(var(--electric)/0.2)] to-[hsl(var(--fire)/0.2)] border border-[hsl(var(--electric)/0.3)]">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[hsl(var(--electric))]">
                  Σ {totalStats}
                </span>
              </div>
            </div>

            {/* Stat bars */}
            <div className="flex-1 flex flex-col justify-center gap-1 sm:gap-1.5">
              {pokeChartData.map((stat) => (
                <MiniStatBar key={stat.name} name={stat.name} value={Number(stat.base_stat)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pokemon Name */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <p
          className={`
          text-sm sm:text-base font-semibold capitalize truncate transition-colors duration-300
          ${
            isSelected
              ? "text-[hsl(var(--electric))]"
              : "text-foreground group-hover:text-[hsl(var(--electric))]"
          }
        `}
        >
          {poke?.name}
        </p>
        {isSelected && (
          <Zap className="w-4 h-4 text-[hsl(var(--electric))] fill-[hsl(var(--electric))]" />
        )}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--fire))] flex items-center justify-center shadow-lg shadow-[hsl(var(--electric)/0.4)]">
          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-background" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
