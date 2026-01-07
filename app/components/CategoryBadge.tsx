"use client";

import Link from "next/link";
import { Crown, Sparkles, Gem } from "lucide-react";

// Rarity colors
const RARITY_COLORS: Record<string, string> = {
  common: "#888888",
  uncommon: "#4CAF50",
  rare: "#2196F3",
  "ultra-rare": "#9C27B0",
  legendary: "#FFC107",
  mythical: "#E91E63",
};

// Role colors
const ROLE_COLORS: Record<string, string> = {
  "physical-attacker": "#F08030",
  "special-attacker": "#BA68C8",
  "physical-tank": "#29B6F6",
  "special-tank": "#4CAF50",
  "speedster": "#00BCD4",
  "balanced": "#9E9E9E",
};

// Role display names
const ROLE_NAMES: Record<string, string> = {
  "physical-attacker": "Phys. ATK",
  "special-attacker": "Sp. ATK",
  "physical-tank": "Phys. Tank",
  "special-tank": "Sp. Tank",
  "speedster": "Speedster",
  "balanced": "Balanced",
};

// Generation colors
const GEN_COLORS: Record<string, string> = {
  "generation-i": "#FF1111",
  "generation-ii": "#E6C317",
  "generation-iii": "#00A8FF",
  "generation-iv": "#4A90D9",
  "generation-v": "#3C3C3C",
  "generation-vi": "#025DA6",
  "generation-vii": "#F4A100",
  "generation-viii": "#00D4AA",
  "generation-ix": "#E74C3C",
};

// Generation display names
const GEN_NAMES: Record<string, string> = {
  "generation-i": "Gen I",
  "generation-ii": "Gen II",
  "generation-iii": "Gen III",
  "generation-iv": "Gen IV",
  "generation-v": "Gen V",
  "generation-vi": "Gen VI",
  "generation-vii": "Gen VII",
  "generation-viii": "Gen VIII",
  "generation-ix": "Gen IX",
};

type RarityBadgeProps = {
  rarity: string;
  size?: "sm" | "md";
  clickable?: boolean;
};

export function RarityBadge({ rarity, size = "sm", clickable = true }: RarityBadgeProps) {
  const color = RARITY_COLORS[rarity] || "#888";
  
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[9px] gap-0.5",
    md: "px-2 py-1 text-xs gap-1",
  };

  const iconSize = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  
  const Icon = rarity === "legendary" ? Crown : rarity === "mythical" ? Sparkles : Gem;
  
  const displayName = rarity.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const badge = (
    <span
      className={`
        inline-flex items-center rounded-md font-semibold capitalize
        ${sizeClasses[size]}
        ${clickable ? "hover:scale-105 cursor-pointer transition-transform" : ""}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      <Icon className={iconSize} />
      {displayName}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/rarity/${rarity}`} onClick={(e) => e.stopPropagation()}>
        {badge}
      </Link>
    );
  }

  return badge;
}

type RoleBadgeProps = {
  role: string;
  size?: "sm" | "md";
  clickable?: boolean;
};

export function RoleBadge({ role, size = "sm", clickable = true }: RoleBadgeProps) {
  const color = ROLE_COLORS[role] || "#888";
  const displayName = ROLE_NAMES[role] || role;
  
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[9px]",
    md: "px-2 py-1 text-xs",
  };

  const badge = (
    <span
      className={`
        inline-flex items-center rounded-md font-semibold
        ${sizeClasses[size]}
        ${clickable ? "hover:scale-105 cursor-pointer transition-transform" : ""}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {displayName}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/roles/${role}`} onClick={(e) => e.stopPropagation()}>
        {badge}
      </Link>
    );
  }

  return badge;
}

type GenerationBadgeProps = {
  generation: string;
  size?: "sm" | "md";
  clickable?: boolean;
};

export function GenerationBadge({ generation, size = "sm", clickable = true }: GenerationBadgeProps) {
  const color = GEN_COLORS[generation] || "#888";
  const displayName = GEN_NAMES[generation] || generation;
  
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[9px]",
    md: "px-2 py-1 text-xs",
  };

  const badge = (
    <span
      className={`
        inline-flex items-center rounded-md font-semibold
        ${sizeClasses[size]}
        ${clickable ? "hover:scale-105 cursor-pointer transition-transform" : ""}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {displayName}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/generations/${generation}`} onClick={(e) => e.stopPropagation()}>
        {badge}
      </Link>
    );
  }

  return badge;
}

export { RARITY_COLORS, ROLE_COLORS, GEN_COLORS };

