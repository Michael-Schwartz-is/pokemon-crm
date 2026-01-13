// Type effectiveness calculation utilities
// Pure functions - no server dependencies, bundled into client JS

import typesData from "@/app/data/types.json";

export interface TypeData {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: string[];
    double_damage_to: string[];
    half_damage_from: string[];
    half_damage_to: string[];
    no_damage_from: string[];
    no_damage_to: string[];
  };
  move_damage_class: string | null;
  color: string;
}

// Build a lookup map for O(1) access
const typeMap: Record<string, TypeData> = {};
for (const type of typesData as TypeData[]) {
  typeMap[type.name] = type;
}

/**
 * Get the damage multiplier for an attack type against a single defender type
 * Returns: 2 (super effective), 1 (neutral), 0.5 (not effective), 0 (immune)
 */
export function getSingleTypeMultiplier(attackType: string, defenderType: string): number {
  const attackTypeData = typeMap[attackType];
  if (!attackTypeData) return 1;

  const { damage_relations } = attackTypeData;

  if (damage_relations.no_damage_to.includes(defenderType)) {
    return 0;
  }
  if (damage_relations.double_damage_to.includes(defenderType)) {
    return 2;
  }
  if (damage_relations.half_damage_to.includes(defenderType)) {
    return 0.5;
  }
  return 1;
}

/**
 * Get the combined damage multiplier for an attack type against dual-type Pokemon
 * For dual types, multiply the effectiveness against each type
 * Returns: 4, 2, 1, 0.5, 0.25, or 0
 */
export function getTypeMultiplier(attackType: string, defenderTypes: string[]): number {
  let multiplier = 1;
  for (const defType of defenderTypes) {
    multiplier *= getSingleTypeMultiplier(attackType, defType);
  }
  return multiplier;
}

/**
 * Get the best attack type from attacker's types against defender's types
 * Returns the type that deals the most damage and its multiplier
 */
export function getBestAttackType(
  attackerTypes: string[],
  defenderTypes: string[]
): { type: string; multiplier: number } {
  let bestType = attackerTypes[0];
  let bestMultiplier = 0;

  for (const attackType of attackerTypes) {
    const multiplier = getTypeMultiplier(attackType, defenderTypes);
    if (multiplier > bestMultiplier) {
      bestMultiplier = multiplier;
      bestType = attackType;
    }
  }

  return { type: bestType, multiplier: bestMultiplier };
}

/**
 * Calculate overall type advantage between two Pokemon
 * Positive = attacker advantage, Negative = defender advantage, 0 = neutral
 */
export function calculateTypeAdvantage(
  attackerTypes: string[],
  defenderTypes: string[]
): number {
  const attackerBest = getBestAttackType(attackerTypes, defenderTypes);
  const defenderBest = getBestAttackType(defenderTypes, attackerTypes);

  // Convert multipliers to advantage score
  const attackerScore = Math.log2(attackerBest.multiplier || 0.25);
  const defenderScore = Math.log2(defenderBest.multiplier || 0.25);

  return attackerScore - defenderScore;
}

/**
 * Get effectiveness label for display
 */
export function getEffectivenessLabel(multiplier: number): string {
  if (multiplier === 0) return "immune";
  if (multiplier === 0.25) return "doubly-resisted";
  if (multiplier === 0.5) return "not-effective";
  if (multiplier === 1) return "neutral";
  if (multiplier === 2) return "super-effective";
  if (multiplier === 4) return "doubly-super-effective";
  return "neutral";
}

/**
 * Get the move damage class for a type (physical or special)
 */
export function getMoveDamageClass(type: string): "physical" | "special" {
  const typeData = typeMap[type];
  if (!typeData || !typeData.move_damage_class) return "physical";
  return typeData.move_damage_class as "physical" | "special";
}

/**
 * Get the color associated with a type
 */
export function getTypeColor(type: string): string {
  const typeData = typeMap[type];
  return typeData?.color || "#A8A878";
}
