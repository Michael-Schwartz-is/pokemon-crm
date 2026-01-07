import * as fs from "fs";
import path from "path";
import { Pokemon } from "./CachePokemons";

const csvPath = path.join(process.cwd(), "pokemons.csv");
type PokemonBasic = {
  id: string;
  name: string;
};

let pokemons: PokemonBasic[] = [];

try {
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").slice(1);
  pokemons = lines
    .map((line) => {
      const [id, name] = line.split(",");
      return { id, name };
    })
    .filter((p) => p.id && p.name);
} catch (e) {
  console.error("Failed to read pokemons.csv", e);
}

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

export async function readPokemons() {
  return pokemons.map((p) => p.name);
}

export function getAll(): Pokemon[] {
  return [];
}

export function getPokemonByName(name: string): Pokemon | undefined {
  return undefined;
}
