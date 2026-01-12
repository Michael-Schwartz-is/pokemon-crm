"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Pokemon } from "@/util/CachePokemons";
import PokemonCard from "./PokemonCard";
import FilterSortPanel from "./FilterSortPanel";
import useStore, { SortOption, Filters } from "../stores/pokemonStore";
import { useRouter } from "next/navigation";
import { Swords, X, Zap, Loader2 } from "lucide-react";

type PokemonListProps = {
  initialPokemons: Pokemon[];
};

// Filter function
function applyFilters(pokemons: Pokemon[], filters: Filters): Pokemon[] {
  return pokemons.filter((poke) => {
    // Type filter - Pokemon must have at least one matching type
    if (filters.types.length > 0) {
      const hasMatchingType = poke.types.some((type) => filters.types.includes(type));
      if (!hasMatchingType) return false;
    }

    // Generation filter
    if (filters.generations.length > 0) {
      if (!filters.generations.includes(poke.generation)) return false;
    }

    // Rarity tier filter
    if (filters.rarityTiers.length > 0) {
      if (!filters.rarityTiers.includes(poke.rarity_tier)) return false;
    }

    // Stat category filter
    if (filters.statCategories.length > 0) {
      if (!filters.statCategories.includes(poke.stat_category)) return false;
    }

    // Legendary filter
    if (filters.isLegendary === true && !poke.is_legendary) return false;

    // Mythical filter
    if (filters.isMythical === true && !poke.is_mythical) return false;

    return true;
  });
}

// Sort function
function applySorting(pokemons: Pokemon[], sortOption: SortOption): Pokemon[] {
  const sorted = [...pokemons];

  switch (sortOption) {
    case "id-asc":
      return sorted.sort((a, b) => a.id - b.id);
    case "id-desc":
      return sorted.sort((a, b) => b.id - a.id);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "total-stats-desc":
      return sorted.sort((a, b) => b.total_stats - a.total_stats);
    case "total-stats-asc":
      return sorted.sort((a, b) => a.total_stats - b.total_stats);
    case "base-exp-desc":
      return sorted.sort((a, b) => b.base_experience - a.base_experience);
    case "base-exp-asc":
      return sorted.sort((a, b) => a.base_experience - b.base_experience);
    default:
      return sorted;
  }
}

export default function PokemonList({ initialPokemons }: PokemonListProps) {
  const {
    searchQuery,
    selectedPokemonIds,
    toggleSelectedPokemon,
    clearSelectedPokemons,
    sortOption,
    filters,
  } = useStore();
  // Start with 20 items for faster initial render, then load more
  const [displayLimit, setDisplayLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPokemonIds.length === 2) {
      const [id1, id2] = selectedPokemonIds;
      router.push(`/compare/${id1}/${id2}`);

      const timer = setTimeout(() => {
        clearSelectedPokemons();
      }, 1000);
      return () => {
        clearTimeout(timer);
        clearSelectedPokemons();
      };
    }
  }, [selectedPokemonIds, router, clearSelectedPokemons]);

  const loadMore = useCallback(() => {
    setIsLoading(true);
    // Small delay for smoother UX
    setTimeout(() => {
      setDisplayLimit((prev) => prev + 40);
      setIsLoading(false);
    }, 200);
  }, []);

  // Reset display limit when search query or filters change
  useEffect(() => {
    setDisplayLimit(40);
  }, [searchQuery, filters, sortOption]);

  // Memoized filtered and sorted pokemons
  const processedPokemons = useMemo(() => {
    // First apply search filter
    let result = initialPokemons.filter((poke) =>
      poke.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Then apply other filters
    result = applyFilters(result, filters);

    // Finally apply sorting
    result = applySorting(result, sortOption);

    return result;
  }, [initialPokemons, searchQuery, filters, sortOption]);

  const displayed = processedPokemons.slice(0, displayLimit);
  const hasMore = processedPokemons.length > displayLimit;

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Filter & Sort Panel */}
      <FilterSortPanel />

      {/* Results count */}
      <div className="w-full flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{displayed.length}</span> of{" "}
          <span className="font-semibold text-foreground">{processedPokemons.length}</span> fighters
        </p>
      </div>

      {/* Floating Selection Bar */}
      {selectedPokemonIds.length > 0 && (
        <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
          <div className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3 sm:py-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-[hsl(var(--electric)/0.3)] shadow-[0_8px_40px_hsl(var(--electric)/0.2)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--fire))] flex items-center justify-center">
                <Zap className="w-4 h-4 text-background" />
              </div>
              <span className="text-foreground font-semibold text-sm sm:text-base whitespace-nowrap">
                {selectedPokemonIds.length}/2 selected
              </span>
            </div>

            <div className="w-px h-6 bg-border" />

            <button
              onClick={clearSelectedPokemons}
              aria-label="Clear selected Pokemon"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-[hsl(var(--fire))] hover:bg-[hsl(var(--fire)/0.1)] transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Pokemon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-items-center w-full">
        {displayed.map((poke, index) => (
          <div
            key={poke.name}
            className="w-full flex justify-center animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 20, 150)}ms` }}
          >
            <PokemonCard
              poke={poke}
              isSelected={selectedPokemonIds.includes(poke.name)}
              onSelect={() => toggleSelectedPokemon(poke.name)}
              priority={index < 4}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {processedPokemons.length === 0 && (
        <div className="text-center mt-12 sm:mt-16 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <Swords className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-1">No fighters found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? `No Pokemon matching "${searchQuery}" with current filters`
              : "No Pokemon match your current filters — try adjusting them!"}
          </p>
        </div>
      )}

      {/* Auto Load More Sentinel */}
      {hasMore && (
        <div ref={loadMoreRef} className="w-full flex justify-center py-10 sm:py-12">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  );
}
