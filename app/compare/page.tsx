import { fetchPokemon } from "@/util/CachePokemons";
import PokemonCard from "../components/PokemonCard";
import { getRandomPokemonName, getRandomPokemonCombinations } from "@/util/pokemons";
import RandomBTN from "../components/RandomBTN";
import FightCombinationsSlider from "@/app/components/FightCombinationsSlider";

export default async function Page() {
  const r1 = getRandomPokemonName();
  const r2 = getRandomPokemonName(r1);

  const pokemonData1 = await fetchPokemon(r1);
  const pokemonData2 = await fetchPokemon(r2);

  const combinations = getRandomPokemonCombinations(20);

  return (
    <div className="max-w-[60rem] mx-auto p-4 pt-[6rem]">
      <div className="text-2xl bold text-center p-4 ">
        <h2 className="text-4xl bold text-center ">
          {pokemonData1?.name || "POKEMON1"} vs {pokemonData2?.name || "POKEMON2"}
        </h2>
        <h2 className="text-lg bold text-center pt-2 ">which is better?</h2>
      </div>
      <div className=" p-4 ">
        <div className="flex p-4 gap-10 justify-center ">
          {pokemonData1 && <PokemonCard poke={pokemonData1} showChart={true} />}
          {pokemonData2 && <PokemonCard poke={pokemonData2} showChart={true} />}
        </div>
      </div>

      <RandomBTN r1={r1} r2={r2}></RandomBTN>
      <FightCombinationsSlider combinations={combinations} />
    </div>
  );
}
