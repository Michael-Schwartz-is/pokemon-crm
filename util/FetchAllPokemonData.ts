import fs from "fs";
import { Pokemon, Stats } from "./CachePokemons";
import { getPokemonNames, readPokemons } from "./pokemons";

const allPokenons = async () => {
  await readPokemons();
  const allPokemons: Record<string, Pokemon> = {};
  const allNames = getPokemonNames();

  for (let i = 1; i < 1025; i++) {
    const name = allNames[i];
    if (allPokemons[name]) {
      continue;
    }
    console.log(`Processing pokemon ${i} of 1025.`);

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    if (res.ok === false) {
      console.log(`Error with pokemon id ${i}`);
      console.log(res);
      continue;
    }

    const data = await res.json();

    allPokemons[data.name] = {
      name: data.name as string,
      stats: data.stats as Stats[],
      image: data.sprites.other.home.front_default as string,
    };
    fs.writeFileSync("./app/data/AllPokemons.json", JSON.stringify(allPokemons, null, 2));
    console.log(data.name, " imported Successfully!");
  }
};
[];
allPokenons();

//
