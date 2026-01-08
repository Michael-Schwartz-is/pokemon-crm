import * as fs from "fs";
import path from "path";

type PokemonBasic = {
  id: string;
  name: string;
};

type PokemonMetadata = {
  types: string[];
  generation: string;
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
  const maxUrls = getMaxComparisonUrls();

  // If MAX_COMPARISON_URLS is set, use prioritized pairs
  if (maxUrls !== undefined) {
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, maxUrls);
    const pairs: [string, string][] = [];

    let index = 0;
    for (const [name1, name2, score] of generatePrioritizedComparisonPairs(maxUrls)) {
      if (index >= startIndex && index < endIndex) {
        pairs.push([name1, name2]);
      }
      index++;
      if (index >= endIndex) break;
    }

    const hasMore = endIndex < maxUrls;
    return { pairs, hasMore };
  }

  // Otherwise, use original alphabetical order
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
  const maxUrls = getMaxComparisonUrls();
  const total = maxUrls !== undefined ? maxUrls : getTotalComparisonCount();
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
 * Popular types that get priority in sitemap
 */
const POPULAR_TYPES = new Set([
  "fire",
  "water",
  "electric",
  "psychic",
  "dragon",
]);

/**
 * Early generations that get priority in sitemap
 */
const EARLY_GENERATIONS = new Set(["generation-i", "generation-ii"]);

/**
 * Cached Pokemon metadata for prioritization
 */
let pokemonMetadataCache: Map<string, PokemonMetadata> | null = null;

/**
 * Load Pokemon metadata from AllPokemons.json
 * Returns Map<pokemonName, {types: string[], generation: string}>
 */
function loadPokemonMetadata(): Map<string, PokemonMetadata> {
  if (pokemonMetadataCache) {
    return pokemonMetadataCache;
  }

  const metadata = new Map<string, PokemonMetadata>();
  const dataPath = path.join(process.cwd(), "app", "data", "AllPokemons.json");

  try {
    const jsonData = fs.readFileSync(dataPath, "utf-8");
    const allPokemonData = JSON.parse(jsonData);

    for (const [name, data] of Object.entries(allPokemonData)) {
      const pokemonData = data as any;
      metadata.set(name.toLowerCase(), {
        types: pokemonData.types || [],
        generation: pokemonData.generation || "",
      });
    }
  } catch (e) {
    console.error("Failed to load Pokemon metadata for sitemap prioritization", e);
  }

  pokemonMetadataCache = metadata;
  return metadata;
}

/**
 * Get max comparison URLs from environment variable
 * Returns number or undefined if not set
 */
export function getMaxComparisonUrls(): number | undefined {
  const maxUrls = process.env.MAX_COMPARISON_URLS;
  if (!maxUrls || maxUrls === "0") {
    return undefined;
  }
  const parsed = parseInt(maxUrls, 10);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Calculate priority score for a comparison pair (0-100)
 * Higher scores = higher priority in sitemap
 */
export function getComparisonPriorityScore(
  name1: string,
  name2: string,
  metadata: Map<string, PokemonMetadata>
): number {
  let score = 0;

  const lower1 = name1.toLowerCase();
  const lower2 = name2.toLowerCase();

  // Iconic Pokemon bonus (max 50 points)
  const isIconic1 = ICONIC_POKEMON.has(lower1);
  const isIconic2 = ICONIC_POKEMON.has(lower2);
  if (isIconic1 && isIconic2) {
    score += 50;
  } else if (isIconic1 || isIconic2) {
    score += 25;
  }

  // Early generation bonus (max 20 points)
  const meta1 = metadata.get(lower1);
  const meta2 = metadata.get(lower2);

  const isEarly1 = meta1 && EARLY_GENERATIONS.has(meta1.generation);
  const isEarly2 = meta2 && EARLY_GENERATIONS.has(meta2.generation);
  if (isEarly1 && isEarly2) {
    score += 20;
  } else if (isEarly1 || isEarly2) {
    score += 10;
  }

  // Popular type bonus (max 15 points)
  const hasPopularType1 = meta1 && meta1.types.some((t) => POPULAR_TYPES.has(t));
  const hasPopularType2 = meta2 && meta2.types.some((t) => POPULAR_TYPES.has(t));
  if (hasPopularType1 && hasPopularType2) {
    score += 15;
  } else if (hasPopularType1 || hasPopularType2) {
    score += 7;
  }

  return score;
}

/**
 * Generate prioritized comparison pairs
 * Returns pairs sorted by priority score (highest first)
 */
export function* generatePrioritizedComparisonPairs(
  maxPairs?: number
): Generator<[string, string, number]> {
  const sortedNames = getAllPokemonNames();
  const metadata = loadPokemonMetadata();

  // Generate all pairs with scores
  const pairs: [string, string, number][] = [];

  for (let i = 0; i < sortedNames.length; i++) {
    for (let j = i + 1; j < sortedNames.length; j++) {
      const score = getComparisonPriorityScore(sortedNames[i], sortedNames[j], metadata);
      pairs.push([sortedNames[i], sortedNames[j], score]);
    }
  }

  // Sort by score (highest first)
  pairs.sort((a, b) => b[2] - a[2]);

  // Yield up to maxPairs
  const limit = maxPairs || pairs.length;
  for (let i = 0; i < Math.min(limit, pairs.length); i++) {
    yield pairs[i];
  }
}

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

