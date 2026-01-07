"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

type PokemonBasic = {
  id: string;
  name: string;
};

interface FightCombinationsSliderProps {
  combinations: [PokemonBasic, PokemonBasic][];
}

function PokemonImage({ pokemon }: { pokemon: PokemonBasic }) {
  const [errorCount, setErrorCount] = useState(0);
  const sources = [
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
  ];

  const placeholder =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

  return (
    <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-1 sm:mb-2 flex items-center justify-center">
      {errorCount >= sources.length ? (
        <img
          src={placeholder}
          alt="placeholder"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain opacity-20"
        />
      ) : (
        <Image
          src={sources[errorCount]}
          alt={pokemon.name}
          fill
          sizes="(max-width: 640px) 48px, 64px"
          className="object-contain scale-[1.6] origin-bottom"
          onError={() => setErrorCount((prev) => prev + 1)}
          unoptimized={errorCount > 0}
        />
      )}
    </div>
  );
}

export default function FightCombinationsSlider({ combinations }: FightCombinationsSliderProps) {
  return (
    <div className="w-full py-8 sm:py-12 mt-8 sm:mt-12 border-t border-gray-100">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2 sm:px-4 text-center text-gray-800">
        More Fight Combinations
      </h3>

      <div className="relative px-10 sm:px-14">
        {/* Custom navigation buttons */}
        <button
          className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            480: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          }}
          className="py-4"
        >
          {combinations.map(([p1, p2], i) => (
            <SwiperSlide key={i}>
              <Link
                href={`/compare/${p1.name}/${p2.name}`}
                className="block p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all group"
              >
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                  <div className="flex flex-col items-center flex-1">
                    <PokemonImage pokemon={p1} />
                    <span className="text-[10px] sm:text-xs font-bold truncate w-full text-center capitalize text-gray-700">
                      {p1.name}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-sm sm:text-lg font-black text-red-500 italic">VS</span>
                  </div>

                  <div className="flex flex-col items-center flex-1">
                    <PokemonImage pokemon={p2} />
                    <span className="text-[10px] sm:text-xs font-bold truncate w-full text-center capitalize text-gray-700">
                      {p2.name}
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
