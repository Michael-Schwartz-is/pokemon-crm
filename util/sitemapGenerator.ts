import * as fs from "fs";
import path from "path";

type PokemonBasic = {
  id: string;
  name: string;
};

// Load Pokemon data from CSV
const csvPath = path.join(process.cwd(), "pokemons.csv");
let allPokemons: PokemonBasic[] = [];

try {
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").slice(1); // Skip header
  allPokemons = lines
    .map((line) => {
      const [id, name] = line.split(",");
      return { id: id?.trim(), name: name?.trim()?.toLowerCase() };
    })
    .filter((p) => p.id && p.name);
} catch (e) {
  console.error("Failed to read pokemons.csv for sitemap generation", e);
}

/**
 * Get all Pokemon names sorted alphabetically
 */
export function getAllPokemonNames(): string[] {
  return allPokemons.map((p) => p.name).sort();
}

/**
 * Get total count of Pokemon
 */
export function getPokemonCount(): number {
  return allPokemons.length;
}

/**
 * Calculate total number of unique comparison pairs
 * C(n, 2) = n * (n-1) / 2
 */
export function getTotalComparisonCount(): number {
  const n = allPokemons.length;
  return (n * (n - 1)) / 2;
}

/**
 * Generate all canonical comparison pairs (alphabetically ordered)
 * Returns a generator to handle 500k+ combinations memory-efficiently
 */
export function* generateAllComparisonPairs(): Generator<[string, string]> {
  const sortedNames = getAllPokemonNames();

  for (let i = 0; i < sortedNames.length; i++) {
    for (let j = i + 1; j < sortedNames.length; j++) {
      // Already in alphabetical order since array is sorted
      yield [sortedNames[i], sortedNames[j]];
    }
  }
}

/**
 * Get a paginated slice of comparison pairs for sitemap generation
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of URLs per page (default 50000 per Google's limit)
 */
export function getComparisonPairsForPage(
  page: number,
  pageSize: number = 50000
): { pairs: [string, string][]; hasMore: boolean } {
  const sortedNames = getAllPokemonNames();
  const pairs: [string, string][] = [];

  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;

  let currentIndex = 0;

  // Iterate through all combinations and collect the ones in our page range
  outer: for (let i = 0; i < sortedNames.length; i++) {
    for (let j = i + 1; j < sortedNames.length; j++) {
      if (currentIndex >= startIndex && currentIndex < endIndex) {
        pairs.push([sortedNames[i], sortedNames[j]]);
      }

      currentIndex++;

      // Early exit if we've collected enough
      if (currentIndex >= endIndex) {
        break outer;
      }
    }
  }

  const totalPairs = getTotalComparisonCount();
  const hasMore = endIndex < totalPairs;

  return { pairs, hasMore };
}

/**
 * Calculate number of sitemap pages needed
 * @param pageSize - URLs per sitemap (default 50000)
 */
export function getSitemapPageCount(pageSize: number = 50000): number {
  const total = getTotalComparisonCount();
  return Math.ceil(total / pageSize);
}

/**
 * Priority tiers for SEO - iconic Pokemon get higher priority
 */
const ICONIC_POKEMON = new Set([
  "pikachu",
  "charizard",
  "mewtwo",
  "mew",
  "bulbasaur",
  "charmander",
  "squirtle",
  "eevee",
  "snorlax",
  "gengar",
  "dragonite",
  "gyarados",
  "lapras",
  "articuno",
  "zapdos",
  "moltres",
  "ditto",
  "vaporeon",
  "jolteon",
  "flareon",
  "blastoise",
  "venusaur",
  "alakazam",
  "machamp",
  "golem",
  "rapidash",
  "slowbro",
  "magneton",
  "haunter",
  "onix",
  "hypno",
  "electrode",
  "exeggutor",
  "marowak",
  "hitmonlee",
  "hitmonchan",
  "weezing",
  "rhydon",
  "chansey",
  "kangaskhan",
  "starmie",
  "scyther",
  "jynx",
  "electabuzz",
  "magmar",
  "pinsir",
  "tauros",
  "magikarp",
  "aerodactyl",
]);

/**
 * Get priority value for a comparison pair (0.5 - 1.0)
 * Higher priority for iconic Pokemon matchups
 */
export function getComparisonPriority(name1: string, name2: string): number {
  const isIconic1 = ICONIC_POKEMON.has(name1.toLowerCase());
  const isIconic2 = ICONIC_POKEMON.has(name2.toLowerCase());

  if (isIconic1 && isIconic2) return 1.0; // Both iconic = highest priority
  if (isIconic1 || isIconic2) return 0.8; // One iconic = high priority
  return 0.5; // Default priority
}

