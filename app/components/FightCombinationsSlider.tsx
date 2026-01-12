"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Lock, Unlock, Shuffle, Swords, Zap } from "lucide-react";
import { getPokemonImageUrl, getFallbackImageUrl } from "@/util/pokemonImage";

import "swiper/css";
import "swiper/css/navigation";

type PokemonBasic = {
  id: string;
  name: string;
};

interface FightCombinationsSliderProps {
  combinations: [PokemonBasic, PokemonBasic][];
  allPokemon: PokemonBasic[];
}

function PokemonImage({
  pokemon,
  size = "normal",
}: {
  pokemon: PokemonBasic;
  size?: "normal" | "large";
}) {
  const [hasError, setHasError] = useState(false);
  const sizeClasses = size === "large" ? "w-20 h-20 sm:w-28 sm:h-28" : "w-14 h-14 sm:w-16 sm:h-16";

  return (
    <div className={`relative ${sizeClasses} flex items-center justify-center`}>
      <img
        src={hasError ? getFallbackImageUrl() : getPokemonImageUrl(Number(pokemon.id))}
        alt={pokemon.name}
        className="w-full h-full object-contain"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function FightCombinationsSlider({
  combinations,
  allPokemon,
}: FightCombinationsSliderProps) {
  const [currentMatchup, setCurrentMatchup] = useState<[PokemonBasic, PokemonBasic]>(
    combinations[0] || [allPokemon[0], allPokemon[1]]
  );
  const [lockedSide, setLockedSide] = useState<"left" | "right" | null>(null);

  const getRandomPokemon = useCallback(
    (exclude?: string) => {
      if (allPokemon.length === 0) return null;
      let attempts = 0;
      let pokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
      while (pokemon.name === exclude && attempts < 100) {
        pokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
        attempts++;
      }
      return pokemon;
    },
    [allPokemon]
  );

  const handleShuffle = useCallback(() => {
    if (lockedSide === "left") {
      const newRight = getRandomPokemon(currentMatchup[0].name);
      if (newRight) setCurrentMatchup([currentMatchup[0], newRight]);
    } else if (lockedSide === "right") {
      const newLeft = getRandomPokemon(currentMatchup[1].name);
      if (newLeft) setCurrentMatchup([newLeft, currentMatchup[1]]);
    } else {
      const newLeft = getRandomPokemon();
      const newRight = getRandomPokemon(newLeft?.name);
      if (newLeft && newRight) setCurrentMatchup([newLeft, newRight]);
    }
  }, [lockedSide, currentMatchup, getRandomPokemon]);

  const toggleLock = (side: "left" | "right") => {
    setLockedSide((prev) => (prev === side ? null : side));
  };

  return (
    <div className="w-full py-10 sm:py-14 mt-10 sm:mt-14 border-t border-border/30">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--fire)/0.1)] border border-[hsl(var(--fire)/0.2)] mb-3">
          <Swords className="w-4 h-4 text-[hsl(var(--fire))]" />
          <span className="text-sm font-medium text-[hsl(var(--fire))]">More Battles</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2">Epic Matchups</h3>
        <p className="text-sm text-muted-foreground">
          Pick your next battle — who will emerge victorious?
        </p>
      </div>

      {/* Featured Matchup with Lock Controls */}
      <div className="max-w-md mx-auto mb-8 sm:mb-10 px-4">
        <div className="relative p-5 sm:p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--electric)/0.05)] via-transparent to-[hsl(var(--fire)/0.05)] pointer-events-none" />

          <div className="relative flex items-center justify-between gap-3 sm:gap-4">
            {/* Left Pokemon */}
            <div className="flex flex-col items-center flex-1 relative">
              <button
                onClick={() => toggleLock("left")}
                className={`absolute -top-2 -right-1 z-10 p-1.5 rounded-full transition-all ${
                  lockedSide === "left"
                    ? "bg-[hsl(var(--electric))] text-background shadow-lg shadow-[hsl(var(--electric)/0.4)]"
                    : "bg-secondary text-muted-foreground hover:text-[hsl(var(--electric))] hover:bg-[hsl(var(--electric)/0.1)]"
                }`}
                title={lockedSide === "left" ? "Unlock this Pokemon" : "Lock this Pokemon"}
              >
                {lockedSide === "left" ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </button>
              <div
                className={`p-2 rounded-xl transition-all ${
                  lockedSide === "left"
                    ? "bg-[hsl(var(--electric)/0.1)] ring-2 ring-[hsl(var(--electric)/0.3)]"
                    : "bg-secondary/50"
                }`}
              >
                <PokemonImage pokemon={currentMatchup[0]} />
              </div>
              <span className="mt-2 text-sm font-semibold truncate w-full text-center capitalize text-foreground">
                {currentMatchup[0].name}
              </span>
            </div>

            {/* VS + Shuffle */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xl sm:text-2xl font-black text-[hsl(var(--fire))] vs-badge">
                VS
              </span>
              <button
                onClick={handleShuffle}
                className="p-2.5 sm:p-3 rounded-full bg-gradient-to-br from-[hsl(var(--plasma))] to-[hsl(var(--ice))] text-white shadow-lg shadow-[hsl(var(--plasma)/0.3)] hover:shadow-[hsl(var(--plasma)/0.5)] hover:scale-110 transition-all active:scale-95"
                title="Shuffle matchup"
              >
                <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Right Pokemon */}
            <div className="flex flex-col items-center flex-1 relative">
              <button
                onClick={() => toggleLock("right")}
                className={`absolute -top-2 -left-1 z-10 p-1.5 rounded-full transition-all ${
                  lockedSide === "right"
                    ? "bg-[hsl(var(--electric))] text-background shadow-lg shadow-[hsl(var(--electric)/0.4)]"
                    : "bg-secondary text-muted-foreground hover:text-[hsl(var(--electric))] hover:bg-[hsl(var(--electric)/0.1)]"
                }`}
                title={lockedSide === "right" ? "Unlock this Pokemon" : "Lock this Pokemon"}
              >
                {lockedSide === "right" ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </button>
              <div
                className={`p-2 rounded-xl transition-all ${
                  lockedSide === "right"
                    ? "bg-[hsl(var(--electric)/0.1)] ring-2 ring-[hsl(var(--electric)/0.3)]"
                    : "bg-secondary/50"
                }`}
              >
                <PokemonImage pokemon={currentMatchup[1]} />
              </div>
              <span className="mt-2 text-sm font-semibold truncate w-full text-center capitalize text-foreground">
                {currentMatchup[1].name}
              </span>
            </div>
          </div>

          {/* Battle Link */}
          <Link
            href={`/compare/${currentMatchup[0].name}/${currentMatchup[1].name}`}
            className="relative mt-5 flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 rounded-xl btn-neon text-sm sm:text-base overflow-hidden"
          >
            <Swords className="w-4 h-4" />
            <span>Start Battle</span>
            <Zap className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          {lockedSide ? (
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {lockedSide === "left" ? currentMatchup[0].name : currentMatchup[1].name} locked
            </span>
          ) : (
            "Click lock icon to keep a Pokemon"
          )}
        </p>
      </div>

      {/* Slider */}
      <div className="relative px-12 sm:px-16 max-w-6xl mx-auto">
        {/* Custom navigation buttons */}
        <button
          className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-[hsl(var(--electric))] hover:border-[hsl(var(--electric)/0.3)] hover:bg-[hsl(var(--electric)/0.05)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-[hsl(var(--electric))] hover:border-[hsl(var(--electric)/0.3)] hover:bg-[hsl(var(--electric)/0.05)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          spaceBetween={16}
          slidesPerView={1.5}
          breakpoints={{
            400: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            900: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="py-4"
        >
          {combinations.map(([p1, p2], i) => (
            <SwiperSlide key={i}>
              <Link
                href={`/compare/${p1.name}/${p2.name}`}
                className="block p-3 sm:p-4 rounded-xl bg-card border border-border/50 hover:border-[hsl(var(--electric)/0.4)] hover:shadow-[0_0_25px_hsl(var(--electric)/0.15)] transition-all group relative"
              >
                {/* VS Badge - floating above images */}
                <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <span className="text-base sm:text-lg font-black text-[hsl(var(--fire))] bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[hsl(var(--fire)/0.3)] shadow-lg">
                    VS
                  </span>
                </div>

                {/* Two large images side by side */}
                <div className="flex items-center justify-center gap-0">
                  <div className="flex-1 flex justify-end -mr-3 sm:-mr-4">
                    <PokemonImage pokemon={p1} size="large" />
                  </div>
                  <div className="flex-1 flex justify-start -ml-3 sm:-ml-4">
                    <PokemonImage pokemon={p2} size="large" />
                  </div>
                </div>

                {/* Names below */}
                <div className="flex justify-between gap-2 mt-2 px-1">
                  <span className="text-[10px] sm:text-xs font-medium truncate flex-1 text-center capitalize text-muted-foreground group-hover:text-foreground transition-colors">
                    {p1.name}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium truncate flex-1 text-center capitalize text-muted-foreground group-hover:text-foreground transition-colors">
                    {p2.name}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
