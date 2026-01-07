export type Stats = {
  base_stat: string;
  effort: string;
  stat: {
    name: string;
    url: string;
  };
};

export type Pokemon = {
  name: string;
  image: string;
  stats: Stats[];
};

export let cachedPokemon: Record<string, Pokemon> = {};

// DTO = Data Transfer Object

export async function fetchPokemon(id: string): Promise<Pokemon | undefined> {
  // console.log(`Cache: ${Object.keys(cachedPokemon).length}`, cachedPokemon);
  if (cachedPokemon[id]) return cachedPokemon[id];

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();

  const pokemonDTO = {
    name: data.name,
    image: data.sprites.other.home.front_default || data.sprites.front_default || data.sprites.other['official-artwork'].front_default || "",
    stats: data.stats,
  };
  cachedPokemon[id] = pokemonDTO;
  return pokemonDTO;
}
