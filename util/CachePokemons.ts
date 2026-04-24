export type Stats = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

export type StatCategory = 
  | "physical-attacker"
  | "special-attacker" 
  | "physical-tank"
  | "special-tank"
  | "speedster"
  | "balanced";

export type RarityTier = 
  | "common"
  | "uncommon"
  | "rare"
  | "ultra-rare"
  | "legendary"
  | "mythical";

export type SizeCategory = 
  | "tiny"
  | "small"
  | "medium"
  | "large"
  | "giant";

// Enhanced types for Pokemon detail pages
export type EvolutionNode = {
  species: string;
  speciesId: number;
  trigger: string | null;  // "level-up", "trade", "use-item", etc.
  triggerDetail: string | null;  // "level 16", "Thunder Stone", etc.
  evolvesTo: EvolutionNode[];
};

export type MoveLearn = {
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  damageClass: "physical" | "special" | "status";
  effect: string;
  learnMethod: "level-up" | "machine" | "egg" | "tutor";
  levelLearned: number | null;
};

export type AbilityDetail = {
  name: string;
  isHidden: boolean;
  effect: string;
};

export type PokemonForm = {
  name: string;
  formName: string;
  sprites: { default: string; shiny?: string };
};

export type PokemonSprites = {
  official: string;
  shiny: string;
  home: string;
  animated?: string;
};

export type EncounterLocation = {
  location: string;
  games: string[];
  levelRange?: { min: number; max: number };
};

export type PokedexEntry = {
  dex: string;
  number: number;
};

export type EnhancedPokemon = Pokemon & {
  evolutionChain: EvolutionNode | null;
  moves: MoveLearn[];
  abilitiesDetailed: AbilityDetail[];
  sprites: PokemonSprites;
  forms: PokemonForm[];
  encounters: EncounterLocation[];
  genderRatio: number;  // -1 = genderless, 0-8 scale (0 = always male, 8 = always female)
  hatchSteps: number;
  pokedexNumbers: PokedexEntry[];
};

export type Pokemon = {
  // Basic info
  id: number;
  name: string;
  image: string;
  
  // Types & Abilities
  types: string[];
  abilities: string[];
  
  // Physical attributes
  height: number; // in decimeters
  weight: number; // in hectograms
  
  // Battle stats
  stats: Stats[];
  base_experience: number;
  
  // Calculated/derived fields
  total_stats: number;
  stat_category: StatCategory;
  
  // Species info (from /pokemon-species endpoint)
  generation: string;
  is_legendary: boolean;
  is_mythical: boolean;
  habitat: string | null;
  color: string;
  shape: string;
  capture_rate: number;
  growth_rate: string;
  egg_groups: string[];
  flavor_text: string;
  
  // Derived categorization
  rarity_tier: RarityTier;
  size_category: SizeCategory;
};

export let cachedPokemon: Record<string, Pokemon> = {};

// Load enriched Pokemon data from JSON file
import allPokemonsData from "@/app/data/AllPokemons.json";
const enrichedPokemons: Record<string, Pokemon> = allPokemonsData as Record<string, Pokemon>;

// DTO = Data Transfer Object

export async function fetchPokemon(id: string): Promise<Pokemon | undefined> {
  const normalizedId = id.toLowerCase();
  
  // First, try to get from enriched local data
  if (enrichedPokemons[normalizedId]) {
    return enrichedPokemons[normalizedId];
  }
  
  // Check cache
  if (cachedPokemon[normalizedId]) return cachedPokemon[normalizedId];

  // Fallback to API for Pokemon not in local data
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedId}`);
    if (!res.ok) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await res.json() as any;

    const pokemonDTO: Pokemon = {
      id: data.id,
      name: data.name,
      image: data.sprites.other.home.front_default || data.sprites.front_default || data.sprites.other['official-artwork'].front_default || "",
      types: data.types.map((t: { type: { name: string } }) => t.type.name),
      abilities: data.abilities.map((a: { ability: { name: string } }) => a.ability.name),
      height: data.height,
      weight: data.weight,
      stats: data.stats,
      base_experience: data.base_experience || 0,
      total_stats: data.stats.reduce((sum: number, s: Stats) => sum + s.base_stat, 0),
      stat_category: "balanced",
      generation: "",
      is_legendary: false,
      is_mythical: false,
      habitat: null,
      color: "",
      shape: "",
      capture_rate: 0,
      growth_rate: "",
      egg_groups: [],
      flavor_text: "",
      rarity_tier: "common",
      size_category: "medium",
    };
    
    cachedPokemon[normalizedId] = pokemonDTO;
    return pokemonDTO;
  } catch {
    return undefined;
  }
}
