"use client";

import { useRef, useState, useEffect } from "react";
import useStore, { SortOption } from "../stores/pokemonStore";
import { StatCategory, RarityTier } from "@/util/CachePokemons";
import {
  ArrowUpDown,
  X,
  ChevronDown,
  Sparkles,
  Crown,
  RotateCcw,
} from "lucide-react";

// All Pokemon types
const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

// All generations
const ALL_GENERATIONS = [
  { value: "generation-i", label: "Gen I" },
  { value: "generation-ii", label: "Gen II" },
  { value: "generation-iii", label: "Gen III" },
  { value: "generation-iv", label: "Gen IV" },
  { value: "generation-v", label: "Gen V" },
  { value: "generation-vi", label: "Gen VI" },
  { value: "generation-vii", label: "Gen VII" },
  { value: "generation-viii", label: "Gen VIII" },
  { value: "generation-ix", label: "Gen IX" },
];

// Stat categories
const STAT_CATEGORIES: { value: StatCategory; label: string }[] = [
  { value: "physical-attacker", label: "Physical Attacker" },
  { value: "special-attacker", label: "Special Attacker" },
  { value: "physical-tank", label: "Physical Tank" },
  { value: "special-tank", label: "Special Tank" },
  { value: "speedster", label: "Speedster" },
  { value: "balanced", label: "Balanced" },
];

// Rarity tiers
const RARITY_TIERS: { value: RarityTier; label: string; color: string }[] = [
  { value: "common", label: "Common", color: "#888" },
  { value: "uncommon", label: "Uncommon", color: "#4caf50" },
  { value: "rare", label: "Rare", color: "#2196f3" },
  { value: "ultra-rare", label: "Ultra Rare", color: "#9c27b0" },
  { value: "legendary", label: "Legendary", color: "#ffc107" },
  { value: "mythical", label: "Mythical", color: "#e91e63" },
];

// Sort options
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "id-asc", label: "# Low → High" },
  { value: "id-desc", label: "# High → Low" },
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "total-stats-desc", label: "Stats ↓" },
  { value: "total-stats-asc", label: "Stats ↑" },
  { value: "base-exp-desc", label: "EXP ↓" },
  { value: "base-exp-asc", label: "EXP ↑" },
];

// Type colors
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

// Custom dropdown component
function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
  multiSelect = true,
  renderOption,
}: {
  label: string;
  options: { value: string; label: string; color?: string }[];
  selected: string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  renderOption?: (option: { value: string; label: string; color?: string }, isSelected: boolean) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${selected.length > 0
            ? "bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))] border border-[hsl(var(--electric)/0.3)]"
            : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
          }
        `}
      >
        {label}
        {selected.length > 0 && (
          <span className="px-1.5 py-0.5 rounded-md bg-[hsl(var(--electric))] text-background text-xs font-bold">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[180px] max-h-[280px] overflow-y-auto rounded-xl bg-card border border-border shadow-xl z-50 py-1">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  // Close after selection on mobile, or if not multiSelect
                  if (!multiSelect || isMobile) setIsOpen(false);
                }}
                className={`
                  w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2
                  ${isSelected
                    ? "bg-[hsl(var(--electric)/0.1)] text-[hsl(var(--electric))]"
                    : "text-foreground hover:bg-secondary/50"
                  }
                `}
              >
                {renderOption ? (
                  renderOption(option, isSelected)
                ) : (
                  <>
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected ? "border-[hsl(var(--electric))] bg-[hsl(var(--electric))]" : "border-muted-foreground/40"
                    }`}>
                      {isSelected && <span className="text-background text-xs">✓</span>}
                    </span>
                    {option.label}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FilterSortPanel() {
  const {
    sortOption,
    filters,
    setSortOption,
    toggleFilter,
    clearFilters,
    setFilters,
  } = useStore();

  const activeFilterCount =
    filters.types.length +
    filters.generations.length +
    filters.rarityTiers.length +
    filters.statCategories.length +
    (filters.isLegendary === true ? 1 : 0) +
    (filters.isMythical === true ? 1 : 0);

  const typeOptions = ALL_TYPES.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1), color: TYPE_COLORS[t] }));
  const genOptions = ALL_GENERATIONS;
  const rarityOptions = RARITY_TIERS.map((r) => ({ value: r.value, label: r.label, color: r.color }));
  const roleOptions = STAT_CATEGORIES.map((c) => ({ value: c.value, label: c.label }));

  return (
    <div className="w-full mb-6">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Type Filter */}
        <FilterDropdown
          label="Type"
          options={typeOptions}
          selected={filters.types}
          onSelect={(value) => toggleFilter("types", value)}
          renderOption={(option, isSelected) => (
            <>
              <span
                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                  isSelected ? "ring-2 ring-offset-1 ring-offset-card" : ""
                }`}
                style={{
                  backgroundColor: option.color,
                  color: ["electric", "normal", "ground", "ice", "steel"].includes(option.value) ? "#1a1a2e" : "#fff",
                  "--tw-ring-color": option.color,
                } as React.CSSProperties}
              >
                {isSelected && "✓"}
              </span>
              <span className="capitalize">{option.label}</span>
            </>
          )}
        />

        {/* Generation Filter */}
        <FilterDropdown
          label="Gen"
          options={genOptions}
          selected={filters.generations}
          onSelect={(value) => toggleFilter("generations", value)}
        />

        {/* Rarity Filter */}
        <FilterDropdown
          label="Rarity"
          options={rarityOptions}
          selected={filters.rarityTiers}
          onSelect={(value) => toggleFilter("rarityTiers", value as RarityTier)}
          renderOption={(option, isSelected) => (
            <>
              <span
                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                  isSelected ? "ring-2 ring-offset-1 ring-offset-card" : ""
                }`}
                style={{
                  backgroundColor: option.color,
                  color: "#fff",
                  "--tw-ring-color": option.color,
                } as React.CSSProperties}
              >
                {isSelected && "✓"}
              </span>
              {option.label}
            </>
          )}
        />

        {/* Role Filter */}
        <FilterDropdown
          label="Role"
          options={roleOptions}
          selected={filters.statCategories}
          onSelect={(value) => toggleFilter("statCategories", value as StatCategory)}
        />

        <div className="w-px h-6 bg-border/50 mx-1" />

        {/* Quick Toggles */}
        <button
          onClick={() => setFilters({ isLegendary: filters.isLegendary === true ? null : true })}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${filters.isLegendary === true
              ? "bg-[#ffc107]/20 text-[#ffc107] border border-[#ffc107]/40"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
            }
          `}
        >
          <Crown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Legendary</span>
        </button>

        <button
          onClick={() => setFilters({ isMythical: filters.isMythical === true ? null : true })}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${filters.isMythical === true
              ? "bg-[#e91e63]/20 text-[#e91e63] border border-[#e91e63]/40"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
            }
          `}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mythical</span>
        </button>

        {/* Clear All */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-[hsl(var(--fire))] hover:bg-[hsl(var(--fire)/0.1)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        {/* Spacer to push sort to right */}
        <div className="flex-1" />

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="
              appearance-none pl-9 pr-8 py-2 rounded-lg font-medium text-sm
              bg-secondary/50 text-foreground border border-transparent
              hover:bg-secondary focus:border-[hsl(var(--electric)/0.3)] focus:ring-1 focus:ring-[hsl(var(--electric)/0.2)]
              cursor-pointer transition-all
            "
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {filters.types.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium capitalize"
              style={{
                backgroundColor: TYPE_COLORS[type] + "25",
                color: TYPE_COLORS[type],
              }}
            >
              {type}
              <button onClick={() => toggleFilter("types", type)} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.generations.map((gen) => (
            <span
              key={gen}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))]"
            >
              {ALL_GENERATIONS.find((g) => g.value === gen)?.label || gen}
              <button onClick={() => toggleFilter("generations", gen)} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.rarityTiers.map((rarity) => {
            const info = RARITY_TIERS.find((r) => r.value === rarity);
            return (
              <span
                key={rarity}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: (info?.color || "#888") + "25",
                  color: info?.color || "#888",
                }}
              >
                {info?.label || rarity}
                <button onClick={() => toggleFilter("rarityTiers", rarity)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          {filters.statCategories.map((cat) => {
            const info = STAT_CATEGORIES.find((c) => c.value === cat);
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[hsl(var(--plasma)/0.15)] text-[hsl(var(--plasma))]"
              >
                {info?.label || cat}
                <button onClick={() => toggleFilter("statCategories", cat)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          {filters.isLegendary === true && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[#ffc107]/15 text-[#ffc107]">
              Legendary
              <button onClick={() => setFilters({ isLegendary: null })} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.isMythical === true && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[#e91e63]/15 text-[#e91e63]">
              Mythical
              <button onClick={() => setFilters({ isMythical: null })} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
