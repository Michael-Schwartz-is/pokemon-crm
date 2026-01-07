"use client";

import { Pokemon } from "@/util/CachePokemons";
import {
  Crown,
  Sparkles,
  Scale,
  Ruler,
  Zap,
  Shield,
  Target,
  Leaf,
  Dna,
  Star,
  Gauge,
} from "lucide-react";

// Type color mapping
const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  normal: { bg: "bg-stone-100", text: "text-stone-700", border: "border-stone-300" },
  fire: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  water: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  electric: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  grass: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  ice: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300" },
  fighting: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  poison: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  ground: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  flying: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300" },
  psychic: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" },
  bug: { bg: "bg-lime-100", text: "text-lime-700", border: "border-lime-300" },
  rock: { bg: "bg-stone-200", text: "text-stone-800", border: "border-stone-400" },
  ghost: { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-300" },
  dragon: { bg: "bg-indigo-200", text: "text-indigo-800", border: "border-indigo-400" },
  dark: { bg: "bg-neutral-200", text: "text-neutral-800", border: "border-neutral-400" },
  steel: { bg: "bg-slate-200", text: "text-slate-700", border: "border-slate-400" },
  fairy: { bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-300" },
};

// Rarity tier colors
const rarityColors: Record<string, { bg: string; text: string; glow: string }> = {
  common: { bg: "bg-slate-100", text: "text-slate-600", glow: "" },
  uncommon: { bg: "bg-green-100", text: "text-green-700", glow: "" },
  rare: { bg: "bg-blue-100", text: "text-blue-700", glow: "shadow-blue-200" },
  "ultra-rare": { bg: "bg-purple-100", text: "text-purple-700", glow: "shadow-purple-200" },
  legendary: { bg: "bg-amber-100", text: "text-amber-700", glow: "shadow-amber-300" },
  mythical: { bg: "bg-pink-100", text: "text-pink-700", glow: "shadow-pink-300" },
};

// Stat category display names and colors
const statCategoryDisplay: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  "physical-attacker": { label: "Physical Attacker", icon: <Zap className="w-3 h-3" />, color: "text-orange-600" },
  "special-attacker": { label: "Special Attacker", icon: <Sparkles className="w-3 h-3" />, color: "text-purple-600" },
  "physical-tank": { label: "Physical Tank", icon: <Shield className="w-3 h-3" />, color: "text-blue-600" },
  "special-tank": { label: "Special Tank", icon: <Shield className="w-3 h-3" />, color: "text-teal-600" },
  speedster: { label: "Speedster", icon: <Gauge className="w-3 h-3" />, color: "text-cyan-600" },
  balanced: { label: "Balanced", icon: <Target className="w-3 h-3" />, color: "text-slate-600" },
};

function formatGeneration(gen: string): string {
  const match = gen.match(/generation-(\w+)/);
  if (!match) return gen;
  return `Gen ${match[1].toUpperCase()}`;
}

function formatHeight(dm: number): string {
  const meters = dm / 10;
  const feet = Math.floor(meters * 3.281);
  const inches = Math.round((meters * 3.281 - feet) * 12);
  return `${meters.toFixed(1)}m (${feet}'${inches}")`;
}

function formatWeight(hg: number): string {
  const kg = hg / 10;
  const lbs = (kg * 2.205).toFixed(1);
  return `${kg.toFixed(1)}kg (${lbs}lbs)`;
}

function capitalize(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface PokemonInfoPanelProps {
  pokemon: Pokemon;
  side?: "left" | "right";
}

export default function PokemonInfoPanel({ pokemon, side = "left" }: PokemonInfoPanelProps) {
  const rarityStyle = rarityColors[pokemon.rarity_tier] || rarityColors.common;
  const statCategory = statCategoryDisplay[pokemon.stat_category] || statCategoryDisplay.balanced;

  return (
    <div className="w-full max-w-[320px] space-y-3">
      {/* Types */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {pokemon.types.map((type) => {
          const colors = typeColors[type] || typeColors.normal;
          return (
            <span
              key={type}
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {type}
            </span>
          );
        })}
      </div>

      {/* Legendary/Mythical Badge */}
      {(pokemon.is_legendary || pokemon.is_mythical) && (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              pokemon.is_mythical
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
            }`}
          >
            {pokemon.is_mythical ? <Sparkles className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
            {pokemon.is_mythical ? "Mythical" : "Legendary"}
          </span>
        </div>
      )}

      {/* Info Grid */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-3 space-y-2.5">
        {/* Rarity & Generation Row */}
        <div className="flex justify-between items-center text-xs">
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${rarityStyle.bg} ${rarityStyle.text} font-semibold ${rarityStyle.glow ? `shadow-md ${rarityStyle.glow}` : ""}`}
          >
            <Star className="w-3 h-3" />
            {capitalize(pokemon.rarity_tier)}
          </span>
          {pokemon.generation && (
            <span className="text-muted-foreground font-mono">
              {formatGeneration(pokemon.generation)}
            </span>
          )}
        </div>

        {/* Stat Category */}
        <div className="flex items-center justify-center gap-1.5 text-xs">
          <span className={`flex items-center gap-1 ${statCategory.color} font-semibold`}>
            {statCategory.icon}
            {statCategory.label}
          </span>
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Ruler className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-medium">{formatHeight(pokemon.height)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">{formatWeight(pokemon.weight)}</span>
          </div>
        </div>

        {/* Abilities */}
        {pokemon.abilities.length > 0 && (
          <div className="pt-1 border-t border-border/30">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
              <Zap className="w-3 h-3" />
              <span>Abilities</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pokemon.abilities.map((ability, idx) => (
                <span
                  key={ability}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    idx === 0
                      ? "bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))] border border-[hsl(var(--electric)/0.3)]"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {capitalize(ability)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Habitat & Egg Groups */}
        <div className="pt-1 border-t border-border/30 grid grid-cols-2 gap-2 text-[10px]">
          {pokemon.habitat && (
            <div>
              <div className="flex items-center gap-1 text-muted-foreground uppercase tracking-wider mb-1">
                <Leaf className="w-3 h-3" />
                <span>Habitat</span>
              </div>
              <span className="font-medium text-foreground">{capitalize(pokemon.habitat)}</span>
            </div>
          )}
          {pokemon.egg_groups.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-muted-foreground uppercase tracking-wider mb-1">
                <Dna className="w-3 h-3" />
                <span>Egg Groups</span>
              </div>
              <span className="font-medium text-foreground">
                {pokemon.egg_groups.map(capitalize).join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Capture Rate & Base XP */}
        <div className="pt-1 border-t border-border/30 flex justify-between text-[10px] text-muted-foreground">
          <span>
            Catch Rate: <span className="font-bold text-foreground">{pokemon.capture_rate}</span>
          </span>
          <span>
            Base XP: <span className="font-bold text-foreground">{pokemon.base_experience}</span>
          </span>
        </div>
      </div>

      {/* Flavor Text */}
      {pokemon.flavor_text && (
        <div className="bg-secondary/30 rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground italic leading-relaxed text-center">
            "{pokemon.flavor_text}"
          </p>
        </div>
      )}
    </div>
  );
}

