import fs from "fs";
import path from "path";

// Types - duplicated here to avoid import issues in standalone script
type Stats = {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
};

type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
  stats: Stats[];
  base_experience: number;
  total_stats: number;
  stat_category: string;
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
  rarity_tier: string;
  size_category: string;
};

type EvolutionNode = {
  species: string;
  speciesId: number;
  trigger: string | null;
  triggerDetail: string | null;
  evolvesTo: EvolutionNode[];
};

type MoveLearn = {
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  damageClass: "physical" | "special" | "status";
  effect: string;
  learnMethod: "level-up" | "machine" | "egg" | "tutor";
  levelLearned: number | null;
};

type AbilityDetail = {
  name: string;
  isHidden: boolean;
  effect: string;
};

type PokemonForm = {
  name: string;
  formName: string;
  sprites: { default: string; shiny?: string };
};

type EncounterLocation = {
  location: string;
  games: string[];
  levelRange?: { min: number; max: number };
};

type PokedexEntry = {
  dex: string;
  number: number;
};

type PokemonSprites = {
  official: string;
  shiny: string;
  home: string;
  animated?: string;
};

type EnhancedPokemon = Pokemon & {
  evolutionChain: EvolutionNode | null;
  moves: MoveLearn[];
  abilitiesDetailed: AbilityDetail[];
  sprites: PokemonSprites;
  forms: PokemonForm[];
  encounters: EncounterLocation[];
  genderRatio: number;
  hatchSteps: number;
  pokedexNumbers: PokedexEntry[];
};

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Capitalize helper
const capitalize = (str: string) => 
  str.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

// Parse evolution chain from API response
function parseEvolutionChain(chain: any): EvolutionNode {
  const getTriggerDetail = (details: any[]): { trigger: string | null; detail: string | null } => {
    if (!details || details.length === 0) return { trigger: null, detail: null };
    
    const d = details[0];
    const trigger = d.trigger?.name || null;
    
    let detail: string | null = null;
    if (d.min_level) {
      detail = `Level ${d.min_level}`;
    } else if (d.item?.name) {
      detail = capitalize(d.item.name);
    } else if (d.held_item?.name) {
      detail = `Hold ${capitalize(d.held_item.name)}`;
    } else if (d.min_happiness) {
      detail = `Happiness ${d.min_happiness}+`;
    } else if (d.min_affection) {
      detail = `Affection ${d.min_affection}+`;
    } else if (d.known_move?.name) {
      detail = `Know ${capitalize(d.known_move.name)}`;
    } else if (d.known_move_type?.name) {
      detail = `Know ${d.known_move_type.name} move`;
    } else if (d.location?.name) {
      detail = `At ${capitalize(d.location.name)}`;
    } else if (d.time_of_day) {
      detail = `During ${d.time_of_day}`;
    } else if (trigger === "trade") {
      detail = "Trade";
    }
    
    return { trigger, detail };
  };

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

// Cache for move data to avoid duplicate fetches
const moveCache: Map<string, { type: string; power: number | null; accuracy: number | null; pp: number; damageClass: string; effect: string }> = new Map();

// Cache for ability data
const abilityCache: Map<string, string> = new Map();

// Cache for evolution chains (keyed by chain ID)
const evolutionChainCache: Map<number, EvolutionNode> = new Map();

async function fetchMoveDetails(moveName: string): Promise<{ type: string; power: number | null; accuracy: number | null; pp: number; damageClass: string; effect: string }> {
  if (moveCache.has(moveName)) {
    return moveCache.get(moveName)!;
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    const effectEntry = data.effect_entries?.find((e: any) => e.language.name === "en");
    const effect = effectEntry?.short_effect || "";

    const result = {
      type: data.type.name,
      power: data.power,
      accuracy: data.accuracy,
      pp: data.pp,
      damageClass: data.damage_class.name,
      effect: effect.replace(/\$effect_chance%?/g, `${data.effect_chance || 0}%`),
    };

    moveCache.set(moveName, result);
    return result;
  } catch {
    return { type: "normal", power: null, accuracy: null, pp: 0, damageClass: "physical", effect: "" };
  }
}

async function fetchAbilityEffect(abilityName: string): Promise<string> {
  if (abilityCache.has(abilityName)) {
    return abilityCache.get(abilityName)!;
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    const effectEntry = data.effect_entries?.find((e: any) => e.language.name === "en");
    const effect = effectEntry?.short_effect || effectEntry?.effect || "No description available.";

    abilityCache.set(abilityName, effect);
    return effect;
  } catch {
    return "No description available.";
  }
}

async function fetchEvolutionChain(chainUrl: string): Promise<EvolutionNode | null> {
  try {
    const chainId = parseInt(chainUrl.split("/").filter(Boolean).pop() || "0");
    
    if (evolutionChainCache.has(chainId)) {
      return evolutionChainCache.get(chainId)!;
    }

    const res = await fetch(chainUrl);
    if (!res.ok) return null;
    const data = await res.json();
    
    const chain = parseEvolutionChain(data.chain);
    evolutionChainCache.set(chainId, chain);
    return chain;
  } catch {
    return null;
  }
}

async function fetchEnhancedPokemon(basePokemon: Pokemon): Promise<EnhancedPokemon> {
  const pokemonName = basePokemon.name;
  
  try {
    // Fetch Pokemon data and species data
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`),
    ]);

    if (!pokemonRes.ok || !speciesRes.ok) {
      throw new Error(`Failed to fetch data for ${pokemonName}`);
    }

    const [pokemonData, speciesData] = await Promise.all([
      pokemonRes.json(),
      speciesRes.json(),
    ]);

    // Fetch evolution chain
    let evolutionChain: EvolutionNode | null = null;
    if (speciesData.evolution_chain?.url) {
      evolutionChain = await fetchEvolutionChain(speciesData.evolution_chain.url);
    }

    // Fetch ability details
    const abilitiesDetailed: AbilityDetail[] = [];
    for (const a of pokemonData.abilities) {
      const effect = await fetchAbilityEffect(a.ability.name);
      abilitiesDetailed.push({
        name: a.ability.name,
        isHidden: a.is_hidden,
        effect,
      });
      await delay(50); // Small delay between ability fetches
    }

    // Parse and fetch move details (limit to 100 moves)
    const moves: MoveLearn[] = [];
    const processedMoves = new Set<string>();
    
    const moveEntries = pokemonData.moves.slice(0, 100);
    
    for (const moveEntry of moveEntries) {
      const moveName = moveEntry.move.name;
      if (processedMoves.has(moveName)) continue;
      
      // Get the latest version group detail
      const latestDetail = moveEntry.version_group_details[moveEntry.version_group_details.length - 1];
      if (!latestDetail) continue;
      
      const learnMethodName = latestDetail.move_learn_method.name;
      if (!["level-up", "machine", "egg", "tutor"].includes(learnMethodName)) continue;
      
      processedMoves.add(moveName);
      
      const moveDetails = await fetchMoveDetails(moveName);
      await delay(30); // Small delay between move fetches
      
      moves.push({
        name: moveName,
        type: moveDetails.type,
        power: moveDetails.power,
        accuracy: moveDetails.accuracy,
        pp: moveDetails.pp,
        damageClass: moveDetails.damageClass as MoveLearn["damageClass"],
        effect: moveDetails.effect,
        learnMethod: learnMethodName as MoveLearn["learnMethod"],
        levelLearned: latestDetail.level_learned_at || null,
      });
    }

    // Sort moves
    moves.sort((a, b) => {
      if (a.learnMethod === "level-up" && b.learnMethod === "level-up") {
        return (a.levelLearned || 0) - (b.levelLearned || 0);
      }
      if (a.learnMethod !== b.learnMethod) {
        const order: Record<string, number> = { "level-up": 0, machine: 1, egg: 2, tutor: 3 };
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
        
        try {
          const formRes = await fetch(variety.pokemon.url);
          if (formRes.ok) {
            const formData = await formRes.json();
            const formName = variety.pokemon.name.replace(`${pokemonName}-`, "");
            forms.push({
              name: variety.pokemon.name,
              formName: capitalize(formName),
              sprites: {
                default: formData.sprites.other["official-artwork"]?.front_default || formData.sprites.front_default || "",
                shiny: formData.sprites.other["official-artwork"]?.front_shiny,
              },
            });
            await delay(50);
          }
        } catch {
          // Skip form if fetch fails
        }
      }
    }

    // Fetch encounters
    const encounters: EncounterLocation[] = [];
    try {
      const encounterRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${basePokemon.id}/encounters`);
      if (encounterRes.ok) {
        const encounterData = await encounterRes.json();
        
        const locationMap = new Map<string, Set<string>>();
        for (const enc of encounterData.slice(0, 20)) {
          const locationName = capitalize(enc.location_area.name);
          
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
      // Continue without encounters
    }

    // Parse pokedex numbers
    const pokedexNumbers: PokedexEntry[] = (speciesData.pokedex_numbers || []).map((p: any) => ({
      dex: p.pokedex.name,
      number: p.entry_number,
    }));

    const genderRatio = speciesData.gender_rate;
    const hatchSteps = (speciesData.hatch_counter || 0) * 255;

    return {
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
  } catch (error) {
    console.error(`Error fetching enhanced data for ${pokemonName}:`, error);
    
    // Return base data with empty enhanced fields
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
}

async function main() {
  // Load base Pokemon data
  const basePokemonPath = path.join(process.cwd(), "app/data/AllPokemons.json");
  const basePokemonContent = fs.readFileSync(basePokemonPath, "utf-8");
  const allPokemons: Record<string, Pokemon> = JSON.parse(basePokemonContent);

  const pokemonNames = Object.keys(allPokemons);
  const totalCount = pokemonNames.length;
  
  console.log(`Starting enhanced data fetch for ${totalCount} Pokemon...`);
  console.log("This will take approximately 2-3 hours due to API rate limiting.\n");

  const enhancedPokemons: Record<string, EnhancedPokemon> = {};
  const outputPath = path.join(process.cwd(), "app/data/PokemonDetails.json");

  // Check if we have partial progress
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
      Object.assign(enhancedPokemons, existing);
      console.log(`Resuming from previous progress: ${Object.keys(enhancedPokemons).length} Pokemon already processed.\n`);
    } catch {
      console.log("Starting fresh...\n");
    }
  }

  let processed = 0;
  let skipped = 0;

  for (const name of pokemonNames) {
    // Skip if already processed
    if (enhancedPokemons[name]) {
      skipped++;
      continue;
    }

    processed++;
    const basePokemon = allPokemons[name];
    
    console.log(`[${processed + skipped}/${totalCount}] Processing ${basePokemon.name}...`);
    
    const enhanced = await fetchEnhancedPokemon(basePokemon);
    enhancedPokemons[name] = enhanced;
    
    // Save progress every 10 Pokemon
    if (processed % 10 === 0) {
      fs.writeFileSync(outputPath, JSON.stringify(enhancedPokemons, null, 2));
      console.log(`  Progress saved! (${processed} new, ${skipped} skipped)`);
    }
    
    // Delay between Pokemon to avoid rate limiting
    await delay(200);
  }

  // Final save
  fs.writeFileSync(outputPath, JSON.stringify(enhancedPokemons, null, 2));
  
  console.log(`\n✅ Done! Enhanced ${processed} Pokemon (${skipped} already processed).`);
  console.log(`Data saved to ${outputPath}`);
  
  // Print stats
  const withEvolutions = Object.values(enhancedPokemons).filter(p => p.evolutionChain).length;
  const withMoves = Object.values(enhancedPokemons).filter(p => p.moves.length > 0).length;
  const withForms = Object.values(enhancedPokemons).filter(p => p.forms.length > 0).length;
  
  console.log(`\nStats:`);
  console.log(`- With evolution chains: ${withEvolutions}`);
  console.log(`- With moves: ${withMoves}`);
  console.log(`- With alternate forms: ${withForms}`);
}

main().catch(console.error);
