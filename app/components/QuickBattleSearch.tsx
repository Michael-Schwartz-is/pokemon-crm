"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/util/CachePokemons";
import { getPokemonImageUrl } from "@/util/pokemonImage";
import { Search, X, Swords, Zap, Dices } from "lucide-react";

interface QuickBattleSearchProps {
  pokemons: Pokemon[];
}

interface PokemonAvatarProps {
  selectedPokemon: Pokemon | null;
  onClear: () => void;
}

function PokemonAvatar({ selectedPokemon, onClear }: PokemonAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Pokemon Preview - fixed height placeholder */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-secondary/30 border-2 border-dashed border-border/50 flex items-end justify-center">
        {selectedPokemon ? (
          <>
            <img
              src={getPokemonImageUrl(selectedPokemon.id)}
              alt={selectedPokemon.name}
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain scale-110 origin-bottom"
            />
            {/* Clear button */}
            <button
              onClick={onClear}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-card border border-border text-muted-foreground hover:text-[hsl(var(--fire))] hover:border-[hsl(var(--fire)/0.3)] transition-all z-10"
              aria-label="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <span className="text-xl text-muted-foreground/50 mb-6">?</span>
        )}
      </div>

      {/* Pokemon name or placeholder */}
      <span className="text-xs sm:text-sm font-semibold text-foreground capitalize truncate max-w-[112px] sm:max-w-full h-4 sm:h-5">
        {selectedPokemon?.name || ""}
      </span>
    </div>
  );
}

interface PokemonSearchInputProps {
  pokemons: Pokemon[];
  selectedPokemon: Pokemon | null;
  onSelect: (pokemon: Pokemon) => void;
  onRandom: () => void;
  placeholder: string;
  label: string;
}

function PokemonSearchInput({
  pokemons,
  selectedPokemon,
  onSelect,
  onRandom,
  placeholder,
  label,
}: PokemonSearchInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter Pokemon by query
  const filteredPokemons = query.trim()
    ? pokemons
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8)
    : [];

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredPokemons.length]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || filteredPokemons.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredPokemons.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredPokemons[highlightedIndex]) {
            onSelect(filteredPokemons[highlightedIndex]);
            setQuery("");
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, filteredPokemons, highlightedIndex, onSelect]
  );

  return (
    <div className="relative w-full">
      {/* Label */}
      <label className="block text-xs font-medium text-muted-foreground mb-1.5 sm:hidden">
        {label}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        {selectedPokemon && (
          <img
            src={getPokemonImageUrl(selectedPokemon.id)}
            alt=""
            className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 object-contain sm:hidden"
          />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedPokemon ? selectedPokemon.name : placeholder}
          className={`w-full py-3 rounded-xl border border-border/50 bg-secondary/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[hsl(var(--electric)/0.5)] focus:ring-2 focus:ring-[hsl(var(--electric)/0.1)] transition-all ${
            selectedPokemon ? 'pl-14 sm:pl-10 pr-20 placeholder:text-foreground placeholder:capitalize' : 'pl-10 pr-20'
          }`}
        />
        {/* Random button - inside input */}
        <button
          onClick={onRandom}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-[hsl(var(--plasma))] hover:bg-[hsl(var(--plasma)/0.1)] transition-all"
          aria-label="Random Pokemon"
        >
          <Dices className="w-3.5 h-3.5" />
          <span>Random</span>
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && filteredPokemons.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full min-w-[220px] max-h-[300px] overflow-y-auto rounded-xl bg-card border border-border shadow-xl z-50 py-1 left-0"
        >
          {filteredPokemons.map((pokemon, index) => (
            <button
              key={pokemon.name}
              onClick={() => {
                onSelect(pokemon);
                setQuery("");
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
                index === highlightedIndex
                  ? "bg-[hsl(var(--electric)/0.1)] text-[hsl(var(--electric))]"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              <img
                src={getPokemonImageUrl(pokemon.id)}
                alt={pokemon.name}
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium capitalize truncate">
                  {pokemon.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty state hint */}
      {isOpen && query.trim() && filteredPokemons.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full min-w-[200px] rounded-xl bg-card border border-border shadow-xl z-50 p-4 text-center left-0"
        >
          <p className="text-sm text-muted-foreground">
            No Pokemon found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}

export default function QuickBattleSearch({ pokemons }: QuickBattleSearchProps) {
  const router = useRouter();
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);

  const canBattle = pokemon1 && pokemon2;

  const handleBattle = () => {
    if (pokemon1 && pokemon2) {
      router.push(`/compare/${pokemon1.name}/${pokemon2.name}`);
    }
  };

  const getRandomPokemon = useCallback((exclude?: string) => {
    const available = exclude 
      ? pokemons.filter(p => p.name !== exclude)
      : pokemons;
    return available[Math.floor(Math.random() * available.length)];
  }, [pokemons]);

  const handleRandom1 = useCallback(() => {
    setPokemon1(getRandomPokemon(pokemon2?.name));
  }, [getRandomPokemon, pokemon2?.name]);

  const handleRandom2 = useCallback(() => {
    setPokemon2(getRandomPokemon(pokemon1?.name));
  }, [getRandomPokemon, pokemon1?.name]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="p-3 sm:p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
        {/* Instruction text */}
        <p className="text-sm text-foreground/80 font-medium text-center mb-4 sm:mb-6">
          Search for two Pokemon below to start your battle 👇
        </p>

        {/* Mobile Layout: Avatars side by side with VS */}
        <div className="sm:hidden">
          {/* Avatars Row */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <PokemonAvatar
              selectedPokemon={pokemon1}
              onClear={() => setPokemon1(null)}
            />
            
            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center px-1">
              <div className="relative">
                <span className="text-2xl font-black text-[hsl(var(--fire))] vs-badge">
                  VS
                </span>
                <div className="absolute -inset-2 bg-[hsl(var(--fire)/0.1)] rounded-full blur-md -z-10" />
              </div>
            </div>
            
            <PokemonAvatar
              selectedPokemon={pokemon2}
              onClear={() => setPokemon2(null)}
            />
          </div>
          
          {/* Search Inputs */}
          <div className="space-y-3">
            <PokemonSearchInput
              pokemons={pokemons}
              selectedPokemon={pokemon1}
              onSelect={setPokemon1}
              onRandom={handleRandom1}
              placeholder="Search fighter..."
              label="Fighter 1"
            />
            <PokemonSearchInput
              pokemons={pokemons}
              selectedPokemon={pokemon2}
              onSelect={setPokemon2}
              onRandom={handleRandom2}
              placeholder="Search opponent..."
              label="Fighter 2"
            />
          </div>
          
          {/* Battle Button - Mobile */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleBattle}
              disabled={!canBattle}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                canBattle
                  ? "btn-neon cursor-pointer"
                  : "bg-secondary/50 text-muted-foreground cursor-not-allowed border border-border/50"
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Start Battle</span>
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Layout: Side by side with avatars above searches */}
        <div className="hidden sm:flex items-start justify-center gap-8">
          {/* Pokemon 1 */}
          <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
            <PokemonAvatar
              selectedPokemon={pokemon1}
              onClear={() => setPokemon1(null)}
            />
            <PokemonSearchInput
              pokemons={pokemons}
              selectedPokemon={pokemon1}
              onSelect={setPokemon1}
              onRandom={handleRandom1}
              placeholder="Search fighter..."
              label="Fighter 1"
            />
          </div>

          {/* VS Divider with Battle Button */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center pt-10 gap-4">
            <div className="relative">
              <span className="text-3xl font-black text-[hsl(var(--fire))] vs-badge">
                VS
              </span>
              <div className="absolute -inset-3 bg-[hsl(var(--fire)/0.1)] rounded-full blur-lg -z-10" />
            </div>
            
            {/* Battle Button - Desktop */}
            <button
              onClick={handleBattle}
              disabled={!canBattle}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                canBattle
                  ? "btn-neon cursor-pointer"
                  : "bg-secondary/50 text-muted-foreground cursor-not-allowed border border-border/50"
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Start Battle</span>
              <Zap className="w-4 h-4" />
            </button>
          </div>

          {/* Pokemon 2 */}
          <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
            <PokemonAvatar
              selectedPokemon={pokemon2}
              onClear={() => setPokemon2(null)}
            />
            <PokemonSearchInput
              pokemons={pokemons}
              selectedPokemon={pokemon2}
              onSelect={setPokemon2}
              onRandom={handleRandom2}
              placeholder="Search opponent..."
              label="Fighter 2"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
