"use client";

import { AbilityDetail } from "@/util/CachePokemons";
import { Zap, Eye, Sparkles } from "lucide-react";

interface AbilityCardProps {
  abilities: AbilityDetail[];
}

function capitalize(str: string): string {
  return str.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function AbilityCard({ abilities }: AbilityCardProps) {
  if (abilities.length === 0) {
    return null;
  }

  // Sort abilities: regular abilities first, hidden ability last
  const sortedAbilities = [...abilities].sort((a, b) => {
    if (a.isHidden && !b.isHidden) return 1;
    if (!a.isHidden && b.isHidden) return -1;
    return 0;
  });

  return (
    <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[hsl(var(--plasma)/0.15)]">
          <Zap className="w-4 h-4 text-[hsl(var(--plasma))]" />
        </div>
        Abilities
      </h3>

      <div className="space-y-3">
        {sortedAbilities.map((ability, index) => (
          <div
            key={ability.name}
            className={`
              p-3 sm:p-4 rounded-xl border transition-all
              ${ability.isHidden 
                ? "bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20" 
                : "bg-secondary/30 border-border/50"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              {ability.isHidden ? (
                <Eye className="w-4 h-4 text-purple-500" />
              ) : (
                <Sparkles className="w-4 h-4 text-[hsl(var(--electric))]" />
              )}
              <span className="font-semibold text-foreground">
                {capitalize(ability.name)}
              </span>
              {ability.isHidden && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-500 border border-purple-500/30">
                  Hidden
                </span>
              )}
              {!ability.isHidden && index === 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))] border border-[hsl(var(--electric)/0.3)]">
                  Primary
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ability.effect}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
