"use client";

import Link from "next/link";

// Type colors matching the app's theme
const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

type TypeBadgeProps = {
  type: string;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  className?: string;
};

export default function TypeBadge({ 
  type, 
  size = "sm", 
  clickable = true,
  className = "" 
}: TypeBadgeProps) {
  const color = TYPE_COLORS[type] || "#888";
  const isDarkText = ["electric", "normal", "ground", "ice", "steel"].includes(type);
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const badge = (
    <span
      className={`
        inline-flex items-center rounded-md font-semibold uppercase tracking-wide
        transition-transform
        ${sizeClasses[size]}
        ${clickable ? "hover:scale-105 cursor-pointer" : ""}
        ${className}
      `}
      style={{
        backgroundColor: color,
        color: isDarkText ? "#1a1a2e" : "#fff",
      }}
    >
      {type}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/types/${type}`} onClick={(e) => e.stopPropagation()}>
        {badge}
      </Link>
    );
  }

  return badge;
}

// Export the colors for use in other components
export { TYPE_COLORS };

