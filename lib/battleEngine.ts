// Battle engine - Pure functions for Pokemon battle simulation
// All logic runs client-side, no server dependencies

import { Pokemon } from "@/util/CachePokemons";
import {
  getBestAttackType,
  getMoveDamageClass,
  getEffectivenessLabel,
} from "./typeEffectiveness";

export interface BattleLogEntry {
  turn: number;
  attacker: string;
  defender: string;
  damage: number;
  attackType: string;
  effectiveness: string;
  isCritical: boolean;
  message: string;
  attackerHp: number;
  defenderHp: number;
}

export interface BattleResult {
  winner: Pokemon;
  loser: Pokemon;
  totalTurns: number;
  log: BattleLogEntry[];
  winnerRemainingHp: number;
  totalDamageDealt: { pokemon1: number; pokemon2: number };
}

export interface BattleState {
  status: "idle" | "fighting" | "paused" | "finished";
  currentTurn: number;
  hp1: number;
  hp2: number;
  maxHp1: number;
  maxHp2: number;
  log: BattleLogEntry[];
  winner: Pokemon | null;
  speed: "slow" | "normal" | "fast";
  currentAttacker: 1 | 2;
}

// HP multiplier to make battles last longer and more visible
const HP_MULTIPLIER = 3;

// Base power for attacks (simplified - no move selection)
const BASE_POWER = 50;

/**
 * Get a stat value by name from Pokemon stats array
 */
function getStat(pokemon: Pokemon, statName: string): number {
  const stat = pokemon.stats.find((s) => s.stat.name === statName);
  return stat?.base_stat || 50;
}

/**
 * Calculate initial HP for battle (scaled for visibility)
 */
export function calculateBattleHp(pokemon: Pokemon): number {
  return getStat(pokemon, "hp") * HP_MULTIPLIER;
}

/**
 * Determine who attacks first based on speed
 * Returns 1 if pokemon1 is faster, 2 if pokemon2 is faster
 * Ties broken randomly
 */
export function determineFirstAttacker(pokemon1: Pokemon, pokemon2: Pokemon): 1 | 2 {
  const speed1 = getStat(pokemon1, "speed");
  const speed2 = getStat(pokemon2, "speed");

  if (speed1 > speed2) return 1;
  if (speed2 > speed1) return 2;
  // Tie breaker
  return Math.random() < 0.5 ? 1 : 2;
}

/**
 * Calculate damage for an attack
 * Uses simplified Pokemon damage formula
 */
export function calculateDamage(
  attacker: Pokemon,
  defender: Pokemon
): { damage: number; attackType: string; effectiveness: string; isCritical: boolean } {
  // Get the best attack type based on type matchup
  const { type: attackType, multiplier } = getBestAttackType(
    attacker.types,
    defender.types
  );

  // Determine if attack is physical or special based on attacker's primary type
  const damageClass = getMoveDamageClass(attackType);

  // Get appropriate attack and defense stats
  const attackStat =
    damageClass === "physical"
      ? getStat(attacker, "attack")
      : getStat(attacker, "special-attack");

  const defenseStat =
    damageClass === "physical"
      ? getStat(defender, "defense")
      : getStat(defender, "special-defense");

  // Critical hit chance (6.25% base rate like in games)
  const isCritical = Math.random() < 0.0625;
  const critMultiplier = isCritical ? 1.5 : 1;

  // Random variance (85-100% like in games)
  const randomFactor = 0.85 + Math.random() * 0.15;

  // Simplified damage formula inspired by Pokemon games
  // damage = ((2 * level / 5 + 2) * power * (attack/defense) / 50 + 2) * modifiers
  // We simplify by assuming level 50 and fixed base power
  const baseDamage = ((2 * 50 / 5 + 2) * BASE_POWER * (attackStat / defenseStat)) / 50 + 2;
  const finalDamage = Math.floor(
    baseDamage * multiplier * critMultiplier * randomFactor
  );

  return {
    damage: Math.max(1, finalDamage), // Minimum 1 damage
    attackType,
    effectiveness: getEffectivenessLabel(multiplier),
    isCritical,
  };
}

/**
 * Process a single turn of battle
 * Returns the new battle state after the turn
 */
export function processTurn(
  state: BattleState,
  pokemon1: Pokemon,
  pokemon2: Pokemon
): BattleState {
  const attacker = state.currentAttacker === 1 ? pokemon1 : pokemon2;
  const defender = state.currentAttacker === 1 ? pokemon2 : pokemon1;
  const attackerHp = state.currentAttacker === 1 ? state.hp1 : state.hp2;
  const defenderHp = state.currentAttacker === 1 ? state.hp2 : state.hp1;

  // Skip if attacker is already knocked out (shouldn't happen but safety check)
  if (attackerHp <= 0) {
    return {
      ...state,
      status: "finished",
      winner: state.currentAttacker === 1 ? pokemon2 : pokemon1,
    };
  }

  // Calculate damage
  const { damage, attackType, effectiveness, isCritical } = calculateDamage(
    attacker,
    defender
  );

  // Apply damage
  const newDefenderHp = Math.max(0, defenderHp - damage);

  // Create log entry
  const logEntry: BattleLogEntry = {
    turn: state.currentTurn,
    attacker: attacker.name,
    defender: defender.name,
    damage,
    attackType,
    effectiveness,
    isCritical,
    message: "", // Will be filled by commentary system
    attackerHp,
    defenderHp: newDefenderHp,
  };

  // Update HP based on who was attacking
  const newHp1 = state.currentAttacker === 1 ? state.hp1 : newDefenderHp;
  const newHp2 = state.currentAttacker === 1 ? newDefenderHp : state.hp2;

  // Check for knockout
  if (newDefenderHp <= 0) {
    return {
      ...state,
      hp1: newHp1,
      hp2: newHp2,
      currentTurn: state.currentTurn + 1,
      log: [...state.log, logEntry],
      status: "finished",
      winner: attacker,
      currentAttacker: state.currentAttacker === 1 ? 2 : 1,
    };
  }

  // Continue battle - switch attacker
  return {
    ...state,
    hp1: newHp1,
    hp2: newHp2,
    currentTurn: state.currentTurn + 1,
    log: [...state.log, logEntry],
    currentAttacker: state.currentAttacker === 1 ? 2 : 1,
  };
}

/**
 * Initialize battle state
 */
export function initializeBattle(pokemon1: Pokemon, pokemon2: Pokemon): BattleState {
  const maxHp1 = calculateBattleHp(pokemon1);
  const maxHp2 = calculateBattleHp(pokemon2);
  const firstAttacker = determineFirstAttacker(pokemon1, pokemon2);

  return {
    status: "idle",
    currentTurn: 1,
    hp1: maxHp1,
    hp2: maxHp2,
    maxHp1,
    maxHp2,
    log: [],
    winner: null,
    speed: "normal",
    currentAttacker: firstAttacker,
  };
}

/**
 * Run a complete battle instantly and return the result
 * Useful for "Skip to End" functionality
 */
export function runCompleteBattle(
  pokemon1: Pokemon,
  pokemon2: Pokemon
): BattleResult {
  let state = initializeBattle(pokemon1, pokemon2);
  state.status = "fighting";

  // Safety limit to prevent infinite loops
  const MAX_TURNS = 100;

  while (state.status === "fighting" && state.currentTurn <= MAX_TURNS) {
    state = processTurn(state, pokemon1, pokemon2);
  }

  // If we hit max turns, determine winner by remaining HP percentage
  if (state.currentTurn > MAX_TURNS && !state.winner) {
    const hp1Percent = state.hp1 / state.maxHp1;
    const hp2Percent = state.hp2 / state.maxHp2;
    state.winner = hp1Percent >= hp2Percent ? pokemon1 : pokemon2;
  }

  const winner = state.winner || pokemon1;
  const loser = winner === pokemon1 ? pokemon2 : pokemon1;
  const winnerRemainingHp = winner === pokemon1 ? state.hp1 : state.hp2;

  // Calculate total damage dealt by each Pokemon
  const totalDamageDealt = {
    pokemon1: state.log
      .filter((entry) => entry.attacker === pokemon1.name)
      .reduce((sum, entry) => sum + entry.damage, 0),
    pokemon2: state.log
      .filter((entry) => entry.attacker === pokemon2.name)
      .reduce((sum, entry) => sum + entry.damage, 0),
  };

  return {
    winner,
    loser,
    totalTurns: state.currentTurn - 1,
    log: state.log,
    winnerRemainingHp,
    totalDamageDealt,
  };
}

/**
 * Get speed interval in milliseconds based on speed setting
 */
export function getSpeedInterval(speed: "slow" | "normal" | "fast"): number {
  switch (speed) {
    case "slow":
      return 1500;
    case "normal":
      return 800;
    case "fast":
      return 300;
  }
}
