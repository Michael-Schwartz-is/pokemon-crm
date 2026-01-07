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

// DTO = Data Transfer Object

export async function fetchPokemon(id: string): Promise<Pokemon | undefined> {
  if (cachedPokemon[id]) return cachedPokemon[id];

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();

  // For the simple fetch, we return basic data
  // Full enrichment happens in FetchAllPokemonData.ts
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
  
  cachedPokemon[id] = pokemonDTO;
  return pokemonDTO;
}
