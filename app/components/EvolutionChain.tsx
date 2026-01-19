"use client";

import Link from "next/link";
import Image from "next/image";
import { EvolutionNode } from "@/util/CachePokemons";
import { getPokemonImageUrl, getFallbackImageUrl } from "@/util/pokemonImage";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

interface EvolutionChainProps {
  chain: EvolutionNode;
  currentPokemon?: string;
}

interface EvolutionStageProps {
  node: EvolutionNode;
  currentPokemon?: string;
  showTrigger?: boolean;
}

function EvolutionStage({ node, currentPokemon, showTrigger = false }: EvolutionStageProps) {
  const [imgSrc, setImgSrc] = useState(getPokemonImageUrl(node.speciesId));
  const isCurrent = node.species === currentPokemon;
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Evolution trigger arrow */}
      {showTrigger && (
        <div className="flex flex-col items-center gap-1 px-1 sm:px-2">
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--electric))]" />
          {node.triggerDetail && (
            <span className="text-[9px] sm:text-[10px] text-muted-foreground text-center max-w-[60px] sm:max-w-[80px] leading-tight">
              {node.triggerDetail}
            </span>
          )}
        </div>
      )}

      {/* Pokemon card */}
      <Link
        href={`/pokemon/${node.species}`}
        scroll={false}
        className={`
          group flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-300
          ${isCurrent 
            ? "bg-[hsl(var(--electric)/0.15)] border-2 border-[hsl(var(--electric))] shadow-lg shadow-[hsl(var(--electric)/0.2)]" 
            : "bg-card/50 border border-border/50 hover:border-[hsl(var(--electric)/0.3)] hover:bg-card/80"
          }
        `}
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
          <Image
            src={imgSrc}
            alt={node.species}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            onError={() => setImgSrc(getFallbackImageUrl())}
            sizes="96px"
            unoptimized
          />
          {isCurrent && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[hsl(var(--electric))] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-background" />
            </div>
          )}
        </div>
        <span className={`
          text-xs sm:text-sm font-medium capitalize mt-1 transition-colors
          ${isCurrent ? "text-[hsl(var(--electric))]" : "text-foreground group-hover:text-[hsl(var(--electric))]"}
        `}>
          {capitalize(node.species)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          #{node.speciesId.toString().padStart(3, "0")}
        </span>
      </Link>
    </div>
  );
}

function flattenChain(node: EvolutionNode, stages: EvolutionNode[][] = [], depth: number = 0): EvolutionNode[][] {
  if (!stages[depth]) {
    stages[depth] = [];
  }
  stages[depth].push(node);
  
  for (const evolution of node.evolvesTo) {
    flattenChain(evolution, stages, depth + 1);
  }
  
  return stages;
}

export default function EvolutionChain({ chain, currentPokemon }: EvolutionChainProps) {
  // Flatten the chain into stages
  const stages = flattenChain(chain);
  
  // Check if this is a single Pokemon with no evolutions
  const isSinglePokemon = stages.length === 1 && stages[0].length === 1;
  
  if (isSinglePokemon) {
    return (
      <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[hsl(var(--electric)/0.15)]">
            <Sparkles className="w-4 h-4 text-[hsl(var(--electric))]" />
          </div>
          Evolution Chain
        </h3>
        <div className="flex justify-center">
          <EvolutionStage node={chain} currentPokemon={currentPokemon} />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          This Pokemon does not evolve.
        </p>
      </div>
    );
  }

  // Check for branching evolutions (like Eevee)
  const hasBranching = stages.some(stage => stage.length > 1);

  return (
    <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[hsl(var(--electric)/0.15)]">
          <Sparkles className="w-4 h-4 text-[hsl(var(--electric))]" />
        </div>
        Evolution Chain
      </h3>

      {hasBranching ? (
        // Branching evolution layout (vertical for mobile, grid for desktop)
        <div className="space-y-4">
          {stages.map((stage, stageIndex) => (
            <div key={stageIndex} className="flex flex-col items-center gap-2">
              {stageIndex > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                  <span className="text-xs">evolves into</span>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {stage.map((node, nodeIndex) => (
                  <EvolutionStage
                    key={node.species}
                    node={node}
                    currentPokemon={currentPokemon}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Linear evolution layout (horizontal)
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {stages.map((stage, stageIndex) => (
            <EvolutionStage
              key={stage[0].species}
              node={stage[0]}
              currentPokemon={currentPokemon}
              showTrigger={stageIndex > 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
