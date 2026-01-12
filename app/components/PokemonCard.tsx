"use client";

import { Pokemon, Stats } from "@/util/CachePokemons";
import { useState, memo } from "react";
import { Check, Zap, Activity } from "lucide-react";
import TypeBadge from "./TypeBadge";
import Image from "next/image";
import { getPokemonImageUrl, getFallbackImageUrl } from "@/util/pokemonImage";

type PokemonCardProps = {
  poke: Pokemon;
  isSelected?: boolean;
  onSelect?: () => void;
  showChart?: boolean;
  /** Set to true for LCP/hero images to disable lazy loading and add fetchpriority="high" */
  priority?: boolean;
};

// Stat color mapping - using hex values for proper inline style support
const statColors: Record<string, string> = {
  hp: "#ff5722", // fire orange
  attack: "#ffc107", // electric yellow
  defense: "#29b6f6", // ice blue
  "special-attack": "#ba68c8", // plasma purple
  "special-defense": "#4caf50", // toxic green
  speed: "#00bcd4", // cyan
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
      <span className="text-[11px] sm:text-xs font-mono font-medium text-muted-foreground w-10 sm:w-12 text-right uppercase tracking-tight">
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
      <span className="text-[11px] sm:text-xs font-mono font-bold text-foreground w-6 sm:w-7 tabular-nums">
        {value}
      </span>
    </div>
  );
}

function PokemonCardComponent({
  poke,
  isSelected,
  onSelect,
  showChart = false,
  priority = false,
}: PokemonCardProps) {
  // Use R2-hosted optimized images - compute URL directly, no state needed
  const [imgSrc, setImgSrc] = useState(getPokemonImageUrl(poke.id));
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative p-3 sm:p-4 rounded-2xl w-full min-w-0 max-w-[320px] cursor-pointer
        bg-card border transition-all duration-300 overflow-visible
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

        <div className="relative w-full h-full rounded-xl overflow-visible flex items-center justify-center">
          <Image
            src={imgSrc || getFallbackImageUrl()}
            width={200}
            height={200}
            className="w-full h-full scale-125 sm:scale-130 object-contain transition-transform duration-500 group-hover:scale-135 -translate-y-[10%]"
            alt={`${poke.name} - Pokemon with ${poke.types.join(' and ')} type`}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
            onError={() => setImgSrc(getFallbackImageUrl())}
            unoptimized
          />
        </div>

        {/* Stats Hover Overlay - Desktop only */}
        <div
          className={`
            hidden md:block absolute inset-0 rounded-xl z-20 transition-all duration-300 pointer-events-none
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
                  <Activity className="w-3 h-3 text-[hsl(var(--electric))]" aria-hidden="true" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[hsl(var(--electric))] uppercase tracking-widest">
                  Base Stats
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
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <div className="flex items-center justify-center gap-2">
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

        {/* Type badges */}
        <div className="flex items-center gap-1">
          {poke.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </div>
      </div>

      {/* Stats Section - Mobile only */}
      <div className="md:hidden mt-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md bg-[hsl(var(--electric)/0.15)]">
              <Activity className="w-3 h-3 text-[hsl(var(--electric))]" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-bold text-[hsl(var(--electric))] uppercase tracking-widest">
              Base Stats
            </span>
          </div>
        </div>

        {/* Stat bars */}
        <div className="flex flex-col gap-1">
          {pokeChartData.map((stat) => (
            <MiniStatBar key={stat.name} name={stat.name} value={Number(stat.base_stat)} />
          ))}
        </div>
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

// Memoize to prevent unnecessary re-renders during scrolling/filtering
const PokemonCard = memo(PokemonCardComponent);
export default PokemonCard;
