import { Pokemon } from "./CachePokemons";
import allPokemonsData from "@/app/data/AllPokemons.json";

type PokemonBasic = {
  id: string;
  name: string;
};

const pokemons: PokemonBasic[] = Object.entries(
  allPokemonsData as Record<string, { id: number | string; name: string }>
).map(([, p]) => ({ id: String(p.id), name: p.name }));

export function getRandomPokemonNames(count: number): string[] {
  if (pokemons.length === 0) return [];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pokemons.length);
    result.push(pokemons[randomIndex].name);
  }
  return result;
}

export function getRandomPokemonCombinations(count: number): [PokemonBasic, PokemonBasic][] {
  if (pokemons.length < 2) return [];
  const result: [PokemonBasic, PokemonBasic][] = [];
  for (let i = 0; i < count; i++) {
    const idx1 = Math.floor(Math.random() * pokemons.length);
    let idx2 = Math.floor(Math.random() * pokemons.length);
    while (idx1 === idx2) {
      idx2 = Math.floor(Math.random() * pokemons.length);
    }
    result.push([pokemons[idx1], pokemons[idx2]]);
  }
  return result;
}

export function getRandomPokemonName(not?: string): string {
  if (pokemons.length === 0) return "";
  if (pokemons.length === 1) return pokemons[0].name;

  let randomName = not;
  let attempts = 0;
  while ((randomName === not || !randomName) && attempts < 100) {
    const randomId = Math.floor(Math.random() * pokemons.length);
    randomName = pokemons[randomId].name;
    attempts++;
  }
  return randomName || pokemons[0].name;
}

export function getPokemonNames(): string[] {
  return pokemons.map((p) => p.name);
}

export function getAllPokemonBasic(): PokemonBasic[] {
  return pokemons;
}

export async function readPokemons() {
  return pokemons.map((p) => p.name);
}

export function getAll(): Pokemon[] {
  return [];
}

export function getPokemonByName(name: string): Pokemon | undefined {
  return undefined;
}
