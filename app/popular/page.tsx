import * as fs from "fs";
import path from "path";
import { Pokemon } from "@/util/CachePokemons";
import PokemonList from "../components/PokemonList";

export default function PopularPage() {
  const filePath = path.join(process.cwd(), "app/data/AllPokemons.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const allPokemons: Record<string, Pokemon> = JSON.parse(fileContent);

  const popular = Object.values(allPokemons);

  return (
    <div className="max-w-[80rem] mx-auto p-10 pt-[8rem]">
      <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">
        Popular Pokemons
      </h1>
      <PokemonList initialPokemons={popular} />
    </div>
  );
}
