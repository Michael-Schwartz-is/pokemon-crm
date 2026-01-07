"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Pokemon } from "@/util/CachePokemons";
import PokemonCard from "./PokemonCard";
import useStore from "../stores/pokemonStore";
import { useRouter } from "next/navigation";
import { Swords, X, Zap, Loader2 } from "lucide-react";

type PokemonListProps = {
  initialPokemons: Pokemon[];
};

export default function PokemonList({ initialPokemons }: PokemonListProps) {
  const { searchQuery, selectedPokemonIds, toggleSelectedPokemon, clearSelectedPokemons } =
    useStore();
  const [displayLimit, setDisplayLimit] = useState(40);
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

  // Reset display limit when search query changes
  useEffect(() => {
    setDisplayLimit(40);
  }, [searchQuery]);

  const filteredPokemons = initialPokemons.filter((poke) =>
    poke.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayed = filteredPokemons.slice(0, displayLimit);
  const hasMore = filteredPokemons.length > displayLimit;

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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-[hsl(var(--fire))] hover:bg-[hsl(var(--fire)/0.1)] transition-colors"
            >
              <X className="w-4 h-4" />
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
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <PokemonCard
              poke={poke}
              isSelected={selectedPokemonIds.includes(poke.name)}
              onSelect={() => toggleSelectedPokemon(poke.name)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPokemons.length === 0 && (
        <div className="text-center mt-12 sm:mt-16 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <Swords className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-1">No fighters found</p>
          <p className="text-sm text-muted-foreground">
            No Pokemon matching &quot;{searchQuery}&quot; — try another name!
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
