"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Pokemon } from "@/util/CachePokemons";
import { getPokemonImageUrl } from "@/util/pokemonImage";
import {
  BattleState,
  BattleLogEntry,
  initializeBattle,
  processTurn,
  runCompleteBattle,
  getSpeedInterval,
} from "@/lib/battleEngine";
import {
  generateTurnCommentary,
  generateBattleStartCommentary,
  generateVictoryCommentary,
} from "@/lib/battleCommentary";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Zap,
  ChevronDown,
} from "lucide-react";

interface FightSimulatorProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
}

// Helper to capitalize names
function capitalize(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


// Commentary Line Component (simplified for chat-like display)
function CommentaryLine({
  message,
  isLatest,
  isCritical,
  effectiveness,
  compact = false,
}: {
  message: string;
  isLatest: boolean;
  isCritical?: boolean;
  effectiveness?: string;
  compact?: boolean;
}) {
  // Determine accent color based on effectiveness
  const getAccentClass = () => {
    if (effectiveness === "super-effective" || effectiveness === "doubly-super-effective") {
      return "text-orange-400";
    }
    if (effectiveness === "not-effective" || effectiveness === "doubly-resisted") {
      return "text-blue-400";
    }
    if (effectiveness === "immune") {
      return "text-gray-400";
    }
    if (isCritical) {
      return "text-red-400";
    }
    return "text-foreground";
  };

  return (
    <p
      className={`
        ${compact ? "text-xs py-0.5" : "text-sm py-1"}
        ${isLatest ? `animate-fade-in ${getAccentClass()}` : "text-muted-foreground"}
        transition-colors duration-300
      `}
    >
      {message}
    </p>
  );
}

// Chat-like Commentary Log
function CommentaryLog({
  cards,
  compact = false,
  maxLines = 8,
}: {
  cards: Array<{
    message: string;
    isCritical?: boolean;
    effectiveness?: string;
    damage?: number;
    turnNumber?: number;
  }>;
  compact?: boolean;
  maxLines?: number;
}) {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [cards]);

  // Get only the recent cards to display
  const visibleCards = cards.slice(-maxLines);

  if (visibleCards.length === 0) return null;

  return (
    <div className="relative">
      {/* Fade-out gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
      
      {/* Scrollable log container */}
      <div
        ref={logRef}
        className={`
          overflow-y-auto overflow-x-hidden no-scrollbar
          ${compact ? "max-h-28 px-3 py-2" : "max-h-40 px-4 py-3"}
        `}
      >
        <div className="space-y-0.5">
          {visibleCards.map((card, index) => (
            <CommentaryLine
              key={cards.length - visibleCards.length + index}
              message={card.message}
              isLatest={index === visibleCards.length - 1}
              isCritical={card.isCritical}
              effectiveness={card.effectiveness}
              compact={compact}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Turn Card Component (kept for expandable battle log)
function TurnCard({
  message,
  isLatest,
  isCritical,
  effectiveness,
  damage,
  turnNumber,
  compact = false,
}: {
  message: string;
  isLatest: boolean;
  isCritical?: boolean;
  effectiveness?: string;
  damage?: number;
  turnNumber?: number;
  compact?: boolean;
}) {
  // Determine card accent based on effectiveness
  const getAccentClass = () => {
    if (effectiveness === "super-effective" || effectiveness === "doubly-super-effective") {
      return "border-l-orange-500 bg-orange-500/10";
    }
    if (effectiveness === "not-effective" || effectiveness === "doubly-resisted") {
      return "border-l-blue-400 bg-blue-400/10";
    }
    if (effectiveness === "immune") {
      return "border-l-gray-500 bg-gray-500/10";
    }
    if (isCritical) {
      return "border-l-red-500 bg-red-500/10";
    }
    return "border-l-[hsl(var(--electric))] bg-[hsl(var(--electric)/0.1)]";
  };

  return (
    <div
      className={`
        border-l-4 rounded-r-lg transition-all duration-300
        ${getAccentClass()}
        ${isLatest ? "animate-fade-in scale-100 opacity-100" : "scale-95 opacity-70"}
        ${compact ? "p-2" : "p-3 sm:p-4"}
      `}
    >
      {turnNumber && !compact && (
        <div className="text-xs font-mono text-muted-foreground mb-1">
          TURN {turnNumber}
        </div>
      )}
      <p className={`${compact ? "text-xs" : "text-sm sm:text-base"} ${isLatest ? "text-foreground" : "text-muted-foreground"}`}>
        {message}
      </p>
      {damage && isLatest && !compact && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black text-red-500 animate-pulse">
            -{damage}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            damage
          </span>
        </div>
      )}
    </div>
  );
}

// HP Bar Component
function HPBar({
  name,
  currentHp,
  maxHp,
  percent,
  compact = false,
}: {
  name: string;
  currentHp: number;
  maxHp: number;
  percent: number;
  compact?: boolean;
}) {
  const getHpBarColor = (p: number) => {
    if (p > 50) return "bg-green-500";
    if (p > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={compact ? "w-full" : "w-full max-w-[180px]"}>
      <div className="flex justify-between items-center mb-1">
        <span className={`font-semibold text-foreground truncate ${compact ? "text-[10px] max-w-[60px]" : "text-xs max-w-[100px]"}`}>
          {capitalize(name)}
        </span>
        <span className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}>
          {Math.max(0, currentHp)}/{maxHp}
        </span>
      </div>
      <div className={`bg-secondary rounded-full overflow-hidden ${compact ? "h-2" : "h-3"}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${getHpBarColor(percent)} ${
            percent < 25 ? "animate-pulse" : ""
          }`}
          style={{ width: `${Math.max(0, percent)}%` }}
        />
      </div>
    </div>
  );
}

// Pokemon Fighter Component
function PokemonFighter({
  pokemon,
  hp,
  maxHp,
  isShaking,
  flashSide,
  isWinner,
  isAttacking,
  isFainted,
  side,
  compact = false,
}: {
  pokemon: Pokemon;
  hp: number;
  maxHp: number;
  isShaking: boolean;
  flashSide: boolean;
  isWinner: boolean;
  isAttacking: boolean;
  isFainted: boolean;
  side: "left" | "right";
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center ${compact ? "gap-1" : "gap-2"}`}>
      {/* Pokemon Image */}
      <div
        className={`relative transition-all duration-300 ${
          isShaking ? "animate-shake" : ""
        } ${isFainted ? "opacity-40 grayscale scale-90" : ""}`}
      >
        {/* Flash overlay */}
        {flashSide && (
          <div className="absolute inset-0 bg-white/60 rounded-full animate-flash z-10" />
        )}

        {/* Winner crown */}
        {isWinner && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl animate-bounce z-20">
            👑
          </div>
        )}

        <Image
          src={getPokemonImageUrl(pokemon.id)}
          alt={pokemon.name}
          width={200}
          height={200}
          className={`object-contain drop-shadow-2xl ${
            compact 
              ? "w-24 h-24" 
              : "w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48"
          }`}
        />

        {/* Active indicator */}
        {isAttacking && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <div className="px-1.5 py-0.5 rounded-full bg-[hsl(var(--electric))] text-[8px] sm:text-[10px] font-bold text-background">
              ATK
            </div>
          </div>
        )}
      </div>

      {/* Type badges - hidden on compact mobile */}
      {!compact && (
        <div className="flex gap-1 mt-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground"
            >
              {type.toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FightSimulator({ pokemon1, pokemon2 }: FightSimulatorProps) {
  const [battleState, setBattleState] = useState<BattleState>(() =>
    initializeBattle(pokemon1, pokemon2)
  );
  const [turnCards, setTurnCards] = useState<
    Array<{
      message: string;
      isCritical?: boolean;
      effectiveness?: string;
      damage?: number;
      turnNumber?: number;
    }>
  >([]);
  const [isShaking, setIsShaking] = useState<1 | 2 | null>(null);
  const [flashSide, setFlashSide] = useState<1 | 2 | null>(null);
  const [showBattleLog, setShowBattleLog] = useState(false);
  const turnCardsRef = useRef<HTMLDivElement>(null);

  // Reset battle when Pokemon change
  useEffect(() => {
    setBattleState(initializeBattle(pokemon1, pokemon2));
    setTurnCards([]);
  }, [pokemon1, pokemon2]);

  // Battle loop
  useEffect(() => {
    if (battleState.status !== "fighting") return;

    const interval = setInterval(() => {
      setBattleState((prev) => {
        if (prev.status !== "fighting") return prev;

        const newState = processTurn(prev, pokemon1, pokemon2);

        // Generate commentary for this turn
        const lastEntry = newState.log[newState.log.length - 1];
        if (lastEntry) {
          const attacker = prev.currentAttacker === 1 ? pokemon1 : pokemon2;
          const defender = prev.currentAttacker === 1 ? pokemon2 : pokemon1;
          const defenderMaxHp = prev.currentAttacker === 1 ? prev.maxHp2 : prev.maxHp1;

          const turnMessage = generateTurnCommentary(
            lastEntry,
            attacker,
            defender,
            defenderMaxHp
          );

          setTurnCards((cards) => [
            ...cards,
            {
              message: turnMessage,
              isCritical: lastEntry.isCritical,
              effectiveness: lastEntry.effectiveness,
              damage: lastEntry.damage,
              turnNumber: newState.currentTurn - 1,
            },
          ]);

          // Trigger animations on defender
          const defenderSide = prev.currentAttacker === 1 ? 2 : 1;
          setFlashSide(defenderSide);
          setTimeout(() => setFlashSide(null), 150);
          setIsShaking(defenderSide);
          setTimeout(() => setIsShaking(null), 400);
        }

        // Victory commentary
        if (newState.status === "finished" && newState.winner) {
          const loser = newState.winner === pokemon1 ? pokemon2 : pokemon1;
          const winnerMaxHp =
            newState.winner === pokemon1 ? newState.maxHp1 : newState.maxHp2;
          const winnerHp =
            newState.winner === pokemon1 ? newState.hp1 : newState.hp2;
          const victoryMessage = generateVictoryCommentary(
            newState.winner,
            loser,
            winnerHp / winnerMaxHp
          );
          setTurnCards((cards) => [
            ...cards,
            { message: `🏆 ${victoryMessage}` },
          ]);
        }

        return newState;
      });
    }, getSpeedInterval(battleState.speed));

    return () => clearInterval(interval);
  }, [battleState.status, battleState.speed, pokemon1, pokemon2]);

  // Start battle
  const handleStart = useCallback(() => {
    if (battleState.status === "idle") {
      const startMessages = generateBattleStartCommentary(
        pokemon1,
        pokemon2,
        battleState.currentAttacker
      );
      setTurnCards(startMessages.map((msg) => ({ message: msg })));
    }
    setBattleState((prev) => ({ ...prev, status: "fighting" }));
  }, [battleState.status, battleState.currentAttacker, pokemon1, pokemon2]);

  // Pause/Resume
  const handlePause = useCallback(() => {
    setBattleState((prev) => ({
      ...prev,
      status: prev.status === "fighting" ? "paused" : "fighting",
    }));
  }, []);

  // Skip to end
  const handleSkip = useCallback(() => {
    const result = runCompleteBattle(pokemon1, pokemon2);

    // Generate all commentary
    const cards: Array<{
      message: string;
      isCritical?: boolean;
      effectiveness?: string;
      damage?: number;
      turnNumber?: number;
    }> = [];

    const startMessages = generateBattleStartCommentary(
      pokemon1,
      pokemon2,
      result.log[0]?.attacker === pokemon1.name ? 1 : 2
    );
    startMessages.forEach((msg) => cards.push({ message: msg }));

    const initialState = initializeBattle(pokemon1, pokemon2);

    for (const entry of result.log) {
      const attacker = entry.attacker === pokemon1.name ? pokemon1 : pokemon2;
      const defender = entry.defender === pokemon1.name ? pokemon1 : pokemon2;
      const defenderMaxHp =
        defender === pokemon1 ? initialState.maxHp1 : initialState.maxHp2;

      cards.push({
        message: generateTurnCommentary(entry, attacker, defender, defenderMaxHp),
        isCritical: entry.isCritical,
        effectiveness: entry.effectiveness,
        damage: entry.damage,
        turnNumber: entry.turn,
      });
    }

    const winnerMaxHp =
      result.winner === pokemon1 ? initialState.maxHp1 : initialState.maxHp2;

    cards.push({
      message: `🏆 ${generateVictoryCommentary(
        result.winner,
        result.loser,
        result.winnerRemainingHp / winnerMaxHp
      )}`,
    });

    setTurnCards(cards);
    setBattleState({
      status: "finished",
      currentTurn: result.totalTurns + 1,
      hp1: result.winner === pokemon1 ? result.winnerRemainingHp : 0,
      hp2: result.winner === pokemon2 ? result.winnerRemainingHp : 0,
      maxHp1: initialState.maxHp1,
      maxHp2: initialState.maxHp2,
      log: result.log,
      winner: result.winner,
      speed: battleState.speed,
      currentAttacker: 1,
    });
  }, [pokemon1, pokemon2, battleState.speed]);

  // Reset/Rematch
  const handleReset = useCallback(() => {
    setBattleState(initializeBattle(pokemon1, pokemon2));
    setTurnCards([]);
    setIsShaking(null);
    setFlashSide(null);
  }, [pokemon1, pokemon2]);

  // Change speed
  const handleSpeedChange = useCallback((speed: "slow" | "normal" | "fast") => {
    setBattleState((prev) => ({ ...prev, speed }));
  }, []);

  // Calculate HP percentages
  const hp1Percent = (battleState.hp1 / battleState.maxHp1) * 100;
  const hp2Percent = (battleState.hp2 / battleState.maxHp2) * 100;

  // Controls component (reused in both layouts)
  const BattleControls = ({ compact = false, hideStatusIndicator = false }: { compact?: boolean; hideStatusIndicator?: boolean }) => (
    <div className={`flex items-center justify-center ${compact ? "gap-2" : "gap-3"}`}>
      {/* Main action button */}
      {!hideStatusIndicator && battleState.status === "idle" && (
        <button
          onClick={handleStart}
          className={`rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/40 hover:shadow-green-500/60 hover:scale-110 transition-all cursor-pointer ${
            compact ? "w-14 h-14" : "w-20 h-20 sm:w-24 sm:h-24"
          }`}
        >
          <Play className={compact ? "w-7 h-7 text-white" : "w-10 h-10 sm:w-12 sm:h-12 text-white"} />
        </button>
      )}

      {!hideStatusIndicator && battleState.status === "fighting" && (
        <div className={`rounded-full bg-[hsl(var(--fire))] flex items-center justify-center animate-pulse shadow-lg shadow-[hsl(var(--fire)/0.4)] ${
          compact ? "w-12 h-12" : "w-16 h-16 sm:w-20 sm:h-20"
        }`}>
          <Zap className={compact ? "w-6 h-6 text-white" : "w-8 h-8 sm:w-10 sm:h-10 text-white"} />
        </div>
      )}

      {!hideStatusIndicator && battleState.status === "paused" && (
        <div className={`rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40 ${
          compact ? "w-12 h-12" : "w-16 h-16 sm:w-20 sm:h-20"
        }`}>
          <Pause className={compact ? "w-6 h-6 text-white" : "w-8 h-8 sm:w-10 sm:h-10 text-white"} />
        </div>
      )}

      {!hideStatusIndicator && battleState.status === "finished" && (
        <button
          onClick={handleReset}
          className={`rounded-full bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-110 transition-all cursor-pointer ${
            compact ? "w-14 h-14" : "w-20 h-20 sm:w-24 sm:h-24"
          }`}
          title="Rematch"
        >
          <RotateCcw className={compact ? "w-7 h-7 text-white" : "w-10 h-10 sm:w-12 sm:h-12 text-white"} />
        </button>
      )}

      {/* Secondary controls */}
      {(battleState.status === "fighting" || battleState.status === "paused") && (
        <div className="flex items-center gap-1">
          <button
            onClick={handlePause}
            className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-all"
          >
            {battleState.status === "fighting" ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleSkip}
            className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-0.5 p-1 bg-secondary/60 rounded-lg">
            {(["slow", "normal", "fast"] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-1.5 py-1 rounded text-[9px] font-semibold transition-all ${
                  battleState.speed === speed
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {speed === "slow" ? "1x" : speed === "normal" ? "2x" : "3x"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-2">
      {/* Battle Arena */}
      <div className="relative bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-sm rounded-2xl border border-border/50">
        {/* Arena Background Pattern */}
        <div className="absolute inset-0 opacity-5 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--fire))_0%,_transparent_50%)]" />
        </div>

        {/* ========== MOBILE LAYOUT (default) ========== */}
        <div className="sm:hidden">
          {/* Pokemon Container */}
          <div className="relative z-10 pt-4 px-4">
            {/* HP Bars */}
            <div className="flex justify-between gap-4 mb-2">
              <HPBar
                name={pokemon1.name}
                currentHp={battleState.hp1}
                maxHp={battleState.maxHp1}
                percent={hp1Percent}
                compact
              />
              <HPBar
                name={pokemon2.name}
                currentHp={battleState.hp2}
                maxHp={battleState.maxHp2}
                percent={hp2Percent}
                compact
              />
            </div>

            {/* Pokemon Images - Side by Side */}
            <div className="flex justify-around items-center">
              <PokemonFighter
                pokemon={pokemon1}
                hp={battleState.hp1}
                maxHp={battleState.maxHp1}
                isShaking={isShaking === 1}
                flashSide={flashSide === 1}
                isWinner={battleState.winner === pokemon1}
                isAttacking={battleState.status === "fighting" && battleState.currentAttacker === 1}
                isFainted={battleState.hp1 <= 0}
                side="left"
                compact
              />
              <PokemonFighter
                pokemon={pokemon2}
                hp={battleState.hp2}
                maxHp={battleState.maxHp2}
                isShaking={isShaking === 2}
                flashSide={flashSide === 2}
                isWinner={battleState.winner === pokemon2}
                isAttacking={battleState.status === "fighting" && battleState.currentAttacker === 2}
                isFainted={battleState.hp2 <= 0}
                side="right"
                compact
              />
            </div>
          </div>

          {/* Bottom Content - Controls & Commentary */}
          <div className="px-4 pb-4 pt-2 space-y-2 transition-all duration-300 ease-out">
            {/* Turn indicator */}
            {battleState.status === "fighting" && (
              <div className="text-center animate-fade-in">
                <span className="text-xs font-mono text-muted-foreground">
                  TURN {battleState.currentTurn}
                </span>
              </div>
            )}

            {/* Winner banner */}
            {battleState.status === "finished" && battleState.winner && (
              <div className="text-center py-1 animate-fade-in">
                <p className="text-base font-black text-amber-400">
                  🏆 {capitalize(battleState.winner.name)} Wins!
                </p>
              </div>
            )}

            {/* Commentary Log - expands when battle starts */}
            <div className={`overflow-hidden transition-all duration-300 ease-out ${
              turnCards.length > 0 ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}>
              {turnCards.length > 0 && (
                <CommentaryLog cards={turnCards} compact maxLines={6} />
              )}
            </div>

            {/* Controls */}
            <div className={battleState.status !== "idle" ? "pt-2 border-t border-border/30" : ""}>
              <BattleControls compact />
            </div>
          </div>
        </div>

        {/* ========== DESKTOP LAYOUT (sm+) ========== */}
        <div className="hidden sm:block">
          <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] gap-4 p-8 min-h-[500px]">
            {/* Pokemon 1 Side */}
            <div className="flex flex-col items-center justify-center">
              <HPBar
                name={pokemon1.name}
                currentHp={battleState.hp1}
                maxHp={battleState.maxHp1}
                percent={hp1Percent}
              />
              <div className="mt-4">
                <PokemonFighter
                  pokemon={pokemon1}
                  hp={battleState.hp1}
                  maxHp={battleState.maxHp1}
                  isShaking={isShaking === 1}
                  flashSide={flashSide === 1}
                  isWinner={battleState.winner === pokemon1}
                  isAttacking={battleState.status === "fighting" && battleState.currentAttacker === 1}
                  isFainted={battleState.hp1 <= 0}
                  side="left"
                />
              </div>
            </div>

            {/* Center Action Zone */}
            <div className="flex flex-col items-center justify-center min-w-[200px] md:min-w-[280px]">
              {/* Battle status indicator - at top */}
              {battleState.status === "idle" && (
                <button
                  onClick={handleStart}
                  className="rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/40 hover:shadow-green-500/60 hover:scale-110 transition-all cursor-pointer w-20 h-20 sm:w-24 sm:h-24 mb-4"
                >
                  <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </button>
              )}

              {battleState.status === "fighting" && (
                <div className="rounded-full bg-[hsl(var(--fire))] flex items-center justify-center animate-pulse shadow-lg shadow-[hsl(var(--fire)/0.4)] w-16 h-16 sm:w-20 sm:h-20 mb-4">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              )}

              {battleState.status === "paused" && (
                <div className="rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40 w-16 h-16 sm:w-20 sm:h-20 mb-4">
                  <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              )}

              {battleState.status === "finished" && (
                <button
                  onClick={handleReset}
                  className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-110 transition-all cursor-pointer w-20 h-20 sm:w-24 sm:h-24 mb-4"
                  title="Rematch"
                >
                  <RotateCcw className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </button>
              )}

              {/* Turn indicator */}
              {battleState.status === "fighting" && (
                <span className="text-xs font-mono text-muted-foreground mb-3">
                  TURN {battleState.currentTurn}
                </span>
              )}

              {/* Winner banner */}
              {battleState.status === "finished" && battleState.winner && (
                <div className="text-center mb-3">
                  <p className="text-xl font-black text-amber-400">
                    🏆 {capitalize(battleState.winner.name)} Wins!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {battleState.currentTurn - 1} turns
                  </p>
                </div>
              )}

              {/* Commentary Log */}
              {turnCards.length > 0 && (
                <div className="w-full max-w-[320px] bg-card/50 rounded-lg border border-border/30">
                  <CommentaryLog cards={turnCards} maxLines={8} />
                </div>
              )}

              {/* Controls - below commentary */}
              <div className="mt-4">
                <BattleControls hideStatusIndicator />
              </div>
            </div>

            {/* Pokemon 2 Side */}
            <div className="flex flex-col items-center justify-center">
              <HPBar
                name={pokemon2.name}
                currentHp={battleState.hp2}
                maxHp={battleState.maxHp2}
                percent={hp2Percent}
              />
              <div className="mt-4">
                <PokemonFighter
                  pokemon={pokemon2}
                  hp={battleState.hp2}
                  maxHp={battleState.maxHp2}
                  isShaking={isShaking === 2}
                  flashSide={flashSide === 2}
                  isWinner={battleState.winner === pokemon2}
                  isAttacking={battleState.status === "fighting" && battleState.currentAttacker === 2}
                  isFainted={battleState.hp2 <= 0}
                  side="right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Battle Log (both layouts) */}
        {turnCards.length > 1 && (
          <div className="relative z-30 border-t border-border/30 bg-card/90">
            <button
              onClick={() => setShowBattleLog(!showBattleLog)}
              className="w-full px-4 py-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <span>Battle Log ({turnCards.length} events)</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showBattleLog ? "rotate-180" : ""
                }`}
              />
            </button>

            {showBattleLog && (
              <div
                ref={turnCardsRef}
                className="max-h-60 overflow-y-auto p-4 space-y-2 bg-secondary/20"
              >
                {turnCards.slice(0, -1).map((card, index) => (
                  <TurnCard
                    key={index}
                    message={card.message}
                    isLatest={false}
                    isCritical={card.isCritical}
                    effectiveness={card.effectiveness}
                    turnNumber={card.turnNumber}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
