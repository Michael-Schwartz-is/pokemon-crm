import { 
  Pokemon, 
  EnhancedPokemon, 
  EvolutionNode, 
  MoveLearn, 
  AbilityDetail, 
  PokemonForm,
  EncounterLocation,
  PokedexEntry,
  PokemonSprites
} from "./CachePokemons";

// Import base Pokemon data
import allPokemonsData from "@/app/data/AllPokemons.json";
// Import enhanced Pokemon data (empty object until build script runs)
import enhancedPokemonDataImport from "@/app/data/PokemonDetails.json";

const basePokemonData: Record<string, Pokemon> = allPokemonsData as Record<string, Pokemon>;
const enhancedPokemonData: Record<string, EnhancedPokemon> = enhancedPokemonDataImport as unknown as Record<string, EnhancedPokemon>;

// Cache for on-demand fetched data
const fetchCache: Record<string, EnhancedPokemon> = {};

/**
 * Get Pokemon by name from local data (base or enhanced)
 */
export function getPokemonByName(name: string): Pokemon | undefined {
  const normalizedName = name.toLowerCase();
  return enhancedPokemonData[normalizedName] || basePokemonData[normalizedName];
}

/**
 * Get all Pokemon names
 */
export function getAllPokemonNames(): string[] {
  return Object.keys(basePokemonData);
}

/**
 * Parse evolution chain from API response
 */
function parseEvolutionChain(chain: any): EvolutionNode {
  const getTriggerDetail = (details: any[]): { trigger: string | null; detail: string | null } => {
    if (!details || details.length === 0) return { trigger: null, detail: null };
    
    const d = details[0];
    const trigger = d.trigger?.name || null;
    
    let detail: string | null = null;
    if (d.min_level) {
      detail = `Level ${d.min_level}`;
    } else if (d.item?.name) {
      detail = d.item.name.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    } else if (d.held_item?.name) {
      detail = `Hold ${d.held_item.name.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`;
    } else if (d.min_happiness) {
      detail = `Happiness ${d.min_happiness}+`;
    } else if (d.min_affection) {
      detail = `Affection ${d.min_affection}+`;
    } else if (d.known_move?.name) {
      detail = `Know ${d.known_move.name.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`;
    } else if (d.known_move_type?.name) {
      detail = `Know ${d.known_move_type.name} move`;
    } else if (d.location?.name) {
      detail = `At ${d.location.name.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`;
    } else if (d.time_of_day) {
      detail = `During ${d.time_of_day}`;
    } else if (trigger === "trade") {
      detail = "Trade";
    }
    
    return { trigger, detail };
  };

  // Extract species ID from URL
  const speciesUrl = chain.species.url;
  const speciesId = parseInt(speciesUrl.split("/").filter(Boolean).pop() || "0");

  const { trigger, detail } = getTriggerDetail(chain.evolution_details);

  return {
    species: chain.species.name,
    speciesId,
    trigger,
    triggerDetail: detail,
    evolvesTo: chain.evolves_to.map((evo: any) => parseEvolutionChain(evo)),
  };
}

/**
 * Fetch enhanced Pokemon data from PokeAPI
 */
export async function fetchEnhancedPokemon(nameOrId: string): Promise<EnhancedPokemon | undefined> {
  const normalizedName = nameOrId.toLowerCase();
  
  // Check enhanced data first
  if (enhancedPokemonData[normalizedName]) {
    return enhancedPokemonData[normalizedName];
  }
  
  // Check fetch cache
  if (fetchCache[normalizedName]) {
    return fetchCache[normalizedName];
  }
  
  // Get base Pokemon data
  const basePokemon = basePokemonData[normalizedName];
  if (!basePokemon) {
    return undefined;
  }

  try {
    // Fetch Pokemon data and species data in parallel
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedName}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${normalizedName}`),
    ]);

    if (!pokemonRes.ok || !speciesRes.ok) {
      // Return base data with empty enhanced fields
      return createEnhancedFromBase(basePokemon);
    }

    const [pokemonData, speciesData] = await Promise.all([
      pokemonRes.json(),
      speciesRes.json(),
    ]);

    // Fetch evolution chain
    let evolutionChain: EvolutionNode | null = null;
    if (speciesData.evolution_chain?.url) {
      try {
        const evoRes = await fetch(speciesData.evolution_chain.url);
        if (evoRes.ok) {
          const evoData = await evoRes.json();
          evolutionChain = parseEvolutionChain(evoData.chain);
        }
      } catch {
        // Evolution chain fetch failed, continue without it
      }
    }

    // Fetch ability details (limit concurrent requests)
    const abilitiesDetailed: AbilityDetail[] = await Promise.all(
      pokemonData.abilities.slice(0, 3).map(async (a: any) => {
        try {
          const abilityRes = await fetch(a.ability.url);
          if (!abilityRes.ok) throw new Error();
          const abilityData = await abilityRes.json();
          
          const effectEntry = abilityData.effect_entries?.find(
            (e: any) => e.language.name === "en"
          );
          
          return {
            name: a.ability.name,
            isHidden: a.is_hidden,
            effect: effectEntry?.short_effect || effectEntry?.effect || "No description available.",
          };
        } catch {
          return {
            name: a.ability.name,
            isHidden: a.is_hidden,
            effect: "No description available.",
          };
        }
      })
    );

    // Parse moves (get latest version group moves for level-up, machine, egg, tutor)
    const moves: MoveLearn[] = [];
    const processedMoves = new Set<string>();
    
    // Only process first 50 moves to avoid too many API calls
    const movesToProcess = pokemonData.moves.slice(0, 50);
    
    for (const moveEntry of movesToProcess) {
      const moveName = moveEntry.move.name;
      if (processedMoves.has(moveName)) continue;
      
      // Get the latest version group detail
      const latestDetail = moveEntry.version_group_details[moveEntry.version_group_details.length - 1];
      if (!latestDetail) continue;
      
      const learnMethod = latestDetail.move_learn_method.name as MoveLearn["learnMethod"];
      if (!["level-up", "machine", "egg", "tutor"].includes(learnMethod)) continue;
      
      processedMoves.add(moveName);
      
      // For now, add basic move info without fetching details
      // Full move details will be fetched by the build script
      moves.push({
        name: moveName,
        type: "normal", // Will be enriched by build script
        power: null,
        accuracy: null,
        pp: 0,
        damageClass: "physical",
        effect: "",
        learnMethod: learnMethod as MoveLearn["learnMethod"],
        levelLearned: latestDetail.level_learned_at || null,
      });
    }

    // Sort moves: level-up by level, then alphabetically
    moves.sort((a, b) => {
      if (a.learnMethod === "level-up" && b.learnMethod === "level-up") {
        return (a.levelLearned || 0) - (b.levelLearned || 0);
      }
      if (a.learnMethod !== b.learnMethod) {
        const order = { "level-up": 0, machine: 1, egg: 2, tutor: 3 };
        return order[a.learnMethod] - order[b.learnMethod];
      }
      return a.name.localeCompare(b.name);
    });

    // Parse sprites
    const sprites: PokemonSprites = {
      official: pokemonData.sprites.other["official-artwork"]?.front_default || basePokemon.image,
      shiny: pokemonData.sprites.other["official-artwork"]?.front_shiny || "",
      home: pokemonData.sprites.other.home?.front_default || basePokemon.image,
      animated: pokemonData.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default,
    };

    // Parse forms/varieties
    const forms: PokemonForm[] = [];
    if (speciesData.varieties && speciesData.varieties.length > 1) {
      for (const variety of speciesData.varieties) {
        if (variety.is_default) continue;
        
        const formName = variety.pokemon.name.replace(`${normalizedName}-`, "");
        forms.push({
          name: variety.pokemon.name,
          formName: formName.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
          sprites: { default: "" }, // Would need additional fetch to get form sprites
        });
      }
    }

    // Fetch encounters (simplified - just get location names)
    const encounters: EncounterLocation[] = [];
    try {
      const encounterRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${basePokemon.id}/encounters`);
      if (encounterRes.ok) {
        const encounterData = await encounterRes.json();
        
        // Group by location
        const locationMap = new Map<string, Set<string>>();
        for (const enc of encounterData.slice(0, 20)) { // Limit to 20 locations
          const locationName = enc.location_area.name
            .split("-")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          
          const games = new Set<string>();
          for (const detail of enc.version_details) {
            games.add(detail.version.name);
          }
          
          if (locationMap.has(locationName)) {
            games.forEach(g => locationMap.get(locationName)!.add(g));
          } else {
            locationMap.set(locationName, games);
          }
        }
        
        for (const [location, games] of locationMap) {
          encounters.push({
            location,
            games: Array.from(games),
          });
        }
      }
    } catch {
      // Encounters fetch failed, continue without them
    }

    // Parse pokedex numbers
    const pokedexNumbers: PokedexEntry[] = (speciesData.pokedex_numbers || []).map((p: any) => ({
      dex: p.pokedex.name,
      number: p.entry_number,
    }));

    // Gender ratio: -1 means genderless, 0-8 scale
    const genderRatio = speciesData.gender_rate;
    
    // Hatch steps = hatch_counter * 255 (approximately)
    const hatchSteps = (speciesData.hatch_counter || 0) * 255;

    const enhanced: EnhancedPokemon = {
      ...basePokemon,
      evolutionChain,
      moves,
      abilitiesDetailed,
      sprites,
      forms,
      encounters,
      genderRatio,
      hatchSteps,
      pokedexNumbers,
    };

    // Cache the result
    fetchCache[normalizedName] = enhanced;
    
    return enhanced;
  } catch (error) {
    console.error(`Error fetching enhanced data for ${normalizedName}:`, error);
    return createEnhancedFromBase(basePokemon);
  }
}

/**
 * Create enhanced Pokemon from base data with empty enhanced fields
 */
function createEnhancedFromBase(basePokemon: Pokemon): EnhancedPokemon {
  return {
    ...basePokemon,
    evolutionChain: null,
    moves: [],
    abilitiesDetailed: basePokemon.abilities.map(name => ({
      name,
      isHidden: false,
      effect: "No description available.",
    })),
    sprites: {
      official: basePokemon.image,
      shiny: "",
      home: basePokemon.image,
    },
    forms: [],
    encounters: [],
    genderRatio: 0,
    hatchSteps: 0,
    pokedexNumbers: [],
  };
}

/**
 * Get Pokemon detail - tries enhanced data first, falls back to fetching
 */
export async function getPokemonDetail(nameOrId: string): Promise<EnhancedPokemon | undefined> {
  const normalizedName = nameOrId.toLowerCase();
  
  // Try enhanced data first (from pre-built JSON)
  if (enhancedPokemonData[normalizedName]) {
    return enhancedPokemonData[normalizedName];
  }
  
  // Fallback to on-demand fetch
  return fetchEnhancedPokemon(normalizedName);
}
