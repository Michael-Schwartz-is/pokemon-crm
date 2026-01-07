import { Pokemon, StatCategory, RarityTier } from "@/util/CachePokemons";
import { create } from "zustand";

export type SortOption = 
  | "id-asc"
  | "id-desc"
  | "name-asc"
  | "name-desc"
  | "total-stats-desc"
  | "total-stats-asc"
  | "base-exp-desc"
  | "base-exp-asc";

export interface Filters {
  types: string[];
  generations: string[];
  rarityTiers: RarityTier[];
  statCategories: StatCategory[];
  isLegendary: boolean | null;
  isMythical: boolean | null;
}

interface PokemonStore {
  pokemonFetched: Pokemon[];
  searchQuery: string;
  selectedPokemonIds: string[];
  sortOption: SortOption;
  filters: Filters;
  filtersOpen: boolean;
  addPokemon: (pokemon: Pokemon) => void;
  setSearchQuery: (query: string) => void;
  toggleSelectedPokemon: (id: string) => void;
  clearSelectedPokemons: () => void;
  setSortOption: (option: SortOption) => void;
  setFilters: (filters: Partial<Filters>) => void;
  toggleFilter: <K extends keyof Filters>(key: K, value: Filters[K] extends (infer U)[] ? U : never) => void;
  clearFilters: () => void;
  setFiltersOpen: (open: boolean) => void;
}

const initialFilters: Filters = {
  types: [],
  generations: [],
  rarityTiers: [],
  statCategories: [],
  isLegendary: null,
  isMythical: null,
};

const useStore = create<PokemonStore>((set) => ({
  pokemonFetched: [],
  searchQuery: "",
  selectedPokemonIds: [],
  sortOption: "id-asc",
  filters: initialFilters,
  filtersOpen: false,
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
  setSortOption: (option) => set({ sortOption: option }),
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  toggleFilter: (key, value) =>
    set((state) => {
      const currentArray = state.filters[key] as unknown[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { filters: { ...state.filters, [key]: newArray } };
    }),
  clearFilters: () => set({ filters: initialFilters }),
  setFiltersOpen: (open) => set({ filtersOpen: open }),
}));

export default useStore;
