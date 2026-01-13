// Battle commentary system - Dynamic message generation
// Pure functions for generating battle narration

import { Pokemon } from "@/util/CachePokemons";
import { BattleLogEntry } from "./battleEngine";

// Helper to capitalize names
function capitalize(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper to pick a random item from array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Commentary templates by situation
const templates = {
  superEffective: [
    "{attacker} lands a devastating {type} attack! It's super effective!",
    "A powerful {type} strike! {defender} takes massive damage!",
    "{attacker}'s {type} move hits where it hurts!",
    "Super effective! {defender} reels from the {type} attack!",
    "Critical weakness exploited! {attacker}'s {type} attack connects!",
  ],

  doublySuperEffective: [
    "DEVASTATING! {attacker}'s {type} attack deals quadruple damage!",
    "An absolutely crushing blow! {defender} can barely stand!",
    "{attacker} exploits a massive weakness! The {type} attack is overwhelming!",
  ],

  notEffective: [
    "{defender} shrugs off the {type} attack...",
    "It's not very effective! {defender} barely feels it.",
    "The {type} move doesn't do much to {defender}.",
    "{attacker}'s {type} attack bounces off {defender}!",
  ],

  doublyNotEffective: [
    "The {type} attack is almost completely ineffective!",
    "{defender} barely notices the resisted {type} move.",
    "{attacker}'s {type} attack does minimal damage...",
  ],

  immune: [
    "The {type} attack passes right through {defender}!",
    "It has no effect! {defender}'s typing makes it immune!",
    "{defender} is completely unaffected by the {type} move!",
    "No damage! {defender} is immune to {type} attacks!",
  ],

  neutral: [
    "{attacker} strikes with a {type} attack!",
    "{attacker} launches a {type} move at {defender}!",
    "A solid {type} hit from {attacker}!",
    "{attacker}'s {type} attack connects!",
  ],

  critical: [
    "A critical hit! {attacker} shows no mercy!",
    "Critical strike! {attacker} finds a weak spot!",
    "CRITICAL HIT! Maximum damage!",
    "{attacker} lands a devastating critical blow!",
  ],

  lowHealth: [
    "{pokemon} is hanging on by a thread!",
    "{pokemon} looks exhausted but refuses to give up!",
    "{pokemon} is in the danger zone!",
    "Can {pokemon} survive another hit?",
  ],

  knockout: [
    "{defender} faints! {attacker} wins!",
    "{defender} is knocked out! Victory for {attacker}!",
    "It's over! {defender} can't continue!",
    "{attacker} claims victory as {defender} falls!",
  ],

  battleStart: [
    "The battle begins! {pokemon1} vs {pokemon2}!",
    "Trainers ready! {pokemon1} faces off against {pokemon2}!",
    "Let the battle commence! {pokemon1} and {pokemon2} take their positions!",
  ],

  firstAttacker: [
    "{pokemon} moves first with superior speed!",
    "{pokemon} blitzes into action!",
    "Lightning fast! {pokemon} strikes first!",
  ],

  legendaryAppears: [
    "The legendary {pokemon} enters the arena!",
    "A legendary presence! {pokemon} towers with power!",
    "Behold! The legendary {pokemon} takes the stage!",
  ],

  mythicalAppears: [
    "The mythical {pokemon} manifests!",
    "A rare sight! The mythical {pokemon} appears!",
    "From legend to reality - {pokemon} enters battle!",
  ],

  rarityMismatch: [
    "Can {underdog} overcome the odds against {favorite}?",
    "David vs Goliath! {underdog} faces {favorite}!",
  ],

  closeFinish: [
    "What a close battle! {winner} barely survives!",
    "Down to the wire! {winner} edges out the victory!",
    "A nail-biter! {winner} wins by a hair!",
  ],

  dominant: [
    "{winner} dominates completely!",
    "A crushing victory for {winner}!",
    "{winner} didn't even break a sweat!",
  ],
};

/**
 * Generate commentary for a single turn
 */
export function generateTurnCommentary(
  entry: BattleLogEntry,
  attacker: Pokemon,
  defender: Pokemon,
  defenderMaxHp: number
): string {
  const attackerName = capitalize(entry.attacker);
  const defenderName = capitalize(entry.defender);
  const attackType = capitalize(entry.attackType);

  let message = "";

  // Handle critical hits first
  if (entry.isCritical) {
    message = pickRandom(templates.critical);
  } else {
    // Choose template based on effectiveness
    switch (entry.effectiveness) {
      case "immune":
        message = pickRandom(templates.immune);
        break;
      case "doubly-super-effective":
        message = pickRandom(templates.doublySuperEffective);
        break;
      case "super-effective":
        message = pickRandom(templates.superEffective);
        break;
      case "doubly-resisted":
        message = pickRandom(templates.doublyNotEffective);
        break;
      case "not-effective":
        message = pickRandom(templates.notEffective);
        break;
      default:
        message = pickRandom(templates.neutral);
    }
  }

  // Replace placeholders
  message = message
    .replace(/{attacker}/g, attackerName)
    .replace(/{defender}/g, defenderName)
    .replace(/{type}/g, attackType);

  // Add damage info
  message += ` (-${entry.damage} HP)`;

  // Add low health warning if defender is below 25%
  if (entry.defenderHp > 0 && entry.defenderHp < defenderMaxHp * 0.25) {
    message += " " + pickRandom(templates.lowHealth).replace(/{pokemon}/g, defenderName);
  }

  // Add knockout message
  if (entry.defenderHp <= 0) {
    message =
      message.split("(-")[0].trim() +
      " " +
      pickRandom(templates.knockout)
        .replace(/{attacker}/g, attackerName)
        .replace(/{defender}/g, defenderName);
  }

  return message;
}

/**
 * Generate battle start commentary
 */
export function generateBattleStartCommentary(
  pokemon1: Pokemon,
  pokemon2: Pokemon,
  firstAttacker: 1 | 2
): string[] {
  const name1 = capitalize(pokemon1.name);
  const name2 = capitalize(pokemon2.name);
  const messages: string[] = [];

  // Main battle start message
  messages.push(
    pickRandom(templates.battleStart)
      .replace(/{pokemon1}/g, name1)
      .replace(/{pokemon2}/g, name2)
  );

  // Legendary/Mythical callouts
  if (pokemon1.is_legendary) {
    messages.push(
      pickRandom(templates.legendaryAppears).replace(/{pokemon}/g, name1)
    );
  } else if (pokemon1.is_mythical) {
    messages.push(
      pickRandom(templates.mythicalAppears).replace(/{pokemon}/g, name1)
    );
  }

  if (pokemon2.is_legendary) {
    messages.push(
      pickRandom(templates.legendaryAppears).replace(/{pokemon}/g, name2)
    );
  } else if (pokemon2.is_mythical) {
    messages.push(
      pickRandom(templates.mythicalAppears).replace(/{pokemon}/g, name2)
    );
  }

  // Rarity mismatch commentary
  const rarityOrder = ["common", "uncommon", "rare", "ultra-rare", "legendary", "mythical"];
  const rarity1 = rarityOrder.indexOf(pokemon1.rarity_tier);
  const rarity2 = rarityOrder.indexOf(pokemon2.rarity_tier);

  if (Math.abs(rarity1 - rarity2) >= 2) {
    const underdog = rarity1 < rarity2 ? name1 : name2;
    const favorite = rarity1 < rarity2 ? name2 : name1;
    messages.push(
      pickRandom(templates.rarityMismatch)
        .replace(/{underdog}/g, underdog)
        .replace(/{favorite}/g, favorite)
    );
  }

  // First attacker callout
  const firstPokemon = firstAttacker === 1 ? name1 : name2;
  messages.push(
    pickRandom(templates.firstAttacker).replace(/{pokemon}/g, firstPokemon)
  );

  return messages;
}

/**
 * Generate victory commentary
 */
export function generateVictoryCommentary(
  winner: Pokemon,
  loser: Pokemon,
  winnerRemainingHpPercent: number
): string {
  const winnerName = capitalize(winner.name);

  // Close fight (winner has less than 30% HP)
  if (winnerRemainingHpPercent < 0.3) {
    return pickRandom(templates.closeFinish).replace(/{winner}/g, winnerName);
  }

  // Dominant victory (winner has more than 70% HP)
  if (winnerRemainingHpPercent > 0.7) {
    return pickRandom(templates.dominant).replace(/{winner}/g, winnerName);
  }

  // Normal victory
  return `${winnerName} wins the battle!`;
}

/**
 * Generate flavor text commentary (for knockout)
 */
export function generateFlavorTextCommentary(pokemon: Pokemon): string | null {
  if (!pokemon.flavor_text) return null;
  return `"${pokemon.flavor_text}"`;
}
