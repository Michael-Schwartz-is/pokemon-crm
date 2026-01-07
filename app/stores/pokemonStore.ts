import { Pokemon } from "@/util/CachePokemons";
import { create } from "zustand";

interface PokemonStore {
  pokemonFetched: Pokemon[];
  searchQuery: string;
  selectedPokemonIds: string[];
  addPokemon: (pokemon: Pokemon) => void;
  setSearchQuery: (query: string) => void;
  toggleSelectedPokemon: (id: string) => void;
  clearSelectedPokemons: () => void;
}

const useStore = create<PokemonStore>((set) => ({
  pokemonFetched: [],
  searchQuery: "",
  selectedPokemonIds: [],
  addPokemon: (pokemon) =>
    set((state) => ({ pokemonFetched: [...state.pokemonFetched, pokemon] })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSelectedPokemon: (id) =>
    set((state) => {
      const isSelected = state.selectedPokemonIds.includes(id);
      if (isSelected) {
        return {
          selectedPokemonIds: state.selectedPokemonIds.filter((i) => i !== id),
        };
      } else {
        if (state.selectedPokemonIds.length >= 2) {
          return { selectedPokemonIds: [state.selectedPokemonIds[1], id] };
        }
        return { selectedPokemonIds: [...state.selectedPokemonIds, id] };
      }
    }),
  clearSelectedPokemons: () => set({ selectedPokemonIds: [] }),
}));

export default useStore;
