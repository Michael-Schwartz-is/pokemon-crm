import fs from "fs";
import { Pokemon, Stats, StatCategory, RarityTier, SizeCategory } from "./CachePokemons";

// Helper function to add delay between requests (be nice to the API)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate stat category based on highest stats
function calculateStatCategory(stats: Stats[]): StatCategory {
  const statMap: Record<string, number> = {};
  stats.forEach(s => {
    statMap[s.stat.name] = s.base_stat;
  });

  const attack = statMap["attack"] || 0;
  const spAttack = statMap["special-attack"] || 0;
  const defense = statMap["defense"] || 0;
  const spDefense = statMap["special-defense"] || 0;
  const speed = statMap["speed"] || 0;
  const hp = statMap["hp"] || 0;

  const totalOffense = attack + spAttack;
  const totalDefense = defense + spDefense + hp;
  
  // Check for speedster (speed is notably highest)
  if (speed > attack && speed > spAttack && speed > defense && speed > spDefense) {
    return "speedster";
  }
  
  // Physical attacker
  if (attack > spAttack && attack > defense && attack > spDefense) {
    return "physical-attacker";
  }
  
  // Special attacker
  if (spAttack > attack && spAttack > defense && spAttack > spDefense) {
    return "special-attacker";
  }
  
  // Physical tank
  if (defense > attack && defense > spAttack && defense >= spDefense) {
    return "physical-tank";
  }
  
  // Special tank
  if (spDefense > attack && spDefense > spAttack && spDefense > defense) {
    return "special-tank";
  }
  
  return "balanced";
}

// Calculate rarity tier based on capture rate and legendary/mythical status
function calculateRarityTier(captureRate: number, isLegendary: boolean, isMythical: boolean): RarityTier {
  if (isMythical) return "mythical";
  if (isLegendary) return "legendary";
  if (captureRate <= 3) return "ultra-rare";
  if (captureRate <= 45) return "rare";
  if (captureRate <= 127) return "uncommon";
  return "common";
}

// Calculate size category based on height (in decimeters)
function calculateSizeCategory(height: number): SizeCategory {
  if (height <= 3) return "tiny";      // <= 0.3m
  if (height <= 10) return "small";    // <= 1.0m
  if (height <= 20) return "medium";   // <= 2.0m
  if (height <= 50) return "large";    // <= 5.0m
  return "giant";                       // > 5.0m
}

// Extract English flavor text from species data
function extractFlavorText(flavorTextEntries: Array<{ flavor_text: string; language: { name: string }; version: { name: string } }>): string {
  const englishEntry = flavorTextEntries.find(
    entry => entry.language.name === "en"
  );
  if (!englishEntry) return "";
  // Clean up the text (remove line breaks and extra spaces)
  return englishEntry.flavor_text
    .replace(/\f/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const enrichAllPokemons = async () => {
  const allPokemons: Record<string, Pokemon> = {};
  const maxPokemonId = 1025; // Gen 1-9 main Pokemon
  
  console.log(`Starting Pokemon data enrichment for ${maxPokemonId} Pokemon...`);
  console.log("This will take approximately 15-30 minutes.\n");

  for (let i = 1; i <= maxPokemonId; i++) {
    try {
      console.log(`Processing Pokemon ${i} of ${maxPokemonId}...`);

      // Fetch basic Pokemon data
      const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      if (!pokemonRes.ok) {
        console.log(`Error fetching pokemon ${i}: ${pokemonRes.status}`);
        continue;
      }
      const pokemonData = await pokemonRes.json();

      // Small delay to be nice to the API
      await delay(100);

      // Fetch species data for additional info
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
      if (!speciesRes.ok) {
        console.log(`Error fetching species ${i}: ${speciesRes.status}`);
        continue;
      }
      const speciesData = await speciesRes.json();

      // Calculate total stats
      const totalStats = pokemonData.stats.reduce(
        (sum: number, s: { base_stat: number }) => sum + s.base_stat, 
        0
      );

      // Build the enriched Pokemon object
      const pokemon: Pokemon = {
        // Basic info
        id: pokemonData.id,
        name: pokemonData.name,
        image: pokemonData.sprites.other.home.front_default || 
               pokemonData.sprites.other["official-artwork"].front_default ||
               pokemonData.sprites.front_default || 
               "",
        
        // Types & Abilities
        types: pokemonData.types.map((t: { type: { name: string } }) => t.type.name),
        abilities: pokemonData.abilities.map((a: { ability: { name: string } }) => a.ability.name),
        
        // Physical attributes
        height: pokemonData.height,
        weight: pokemonData.weight,
        
        // Battle stats
        stats: pokemonData.stats,
        base_experience: pokemonData.base_experience || 0,
        
        // Calculated fields
        total_stats: totalStats,
        stat_category: calculateStatCategory(pokemonData.stats),
        
        // Species info
        generation: speciesData.generation?.name || "unknown",
        is_legendary: speciesData.is_legendary || false,
        is_mythical: speciesData.is_mythical || false,
        habitat: speciesData.habitat?.name || null,
        color: speciesData.color?.name || "unknown",
        shape: speciesData.shape?.name || "unknown",
        capture_rate: speciesData.capture_rate || 0,
        growth_rate: speciesData.growth_rate?.name || "unknown",
        egg_groups: speciesData.egg_groups?.map((g: { name: string }) => g.name) || [],
        flavor_text: extractFlavorText(speciesData.flavor_text_entries || []),
        
        // Derived categorization
        rarity_tier: calculateRarityTier(
          speciesData.capture_rate || 255,
          speciesData.is_legendary || false,
          speciesData.is_mythical || false
        ),
        size_category: calculateSizeCategory(pokemonData.height),
      };

      allPokemons[pokemon.name] = pokemon;
      
      // Save progress every 50 Pokemon
      if (i % 50 === 0) {
        fs.writeFileSync("./app/data/AllPokemons.json", JSON.stringify(allPokemons, null, 2));
        console.log(`Progress saved! (${i}/${maxPokemonId})`);
      }

      console.log(`✓ ${pokemon.name} - ${pokemon.types.join("/")} - ${pokemon.generation}`);
      
      // Small delay between requests
      await delay(100);

    } catch (error) {
      console.error(`Error processing Pokemon ${i}:`, error);
      continue;
    }
  }

  // Final save
  fs.writeFileSync("./app/data/AllPokemons.json", JSON.stringify(allPokemons, null, 2));
  console.log(`\n✅ Done! Enriched ${Object.keys(allPokemons).length} Pokemon.`);
  console.log("Data saved to ./app/data/AllPokemons.json");
  
  // Print some stats
  const legendaries = Object.values(allPokemons).filter(p => p.is_legendary).length;
  const mythicals = Object.values(allPokemons).filter(p => p.is_mythical).length;
  const generations = [...new Set(Object.values(allPokemons).map(p => p.generation))];
  
  console.log(`\nStats:`);
  console.log(`- Total Pokemon: ${Object.keys(allPokemons).length}`);
  console.log(`- Legendaries: ${legendaries}`);
  console.log(`- Mythicals: ${mythicals}`);
  console.log(`- Generations: ${generations.length}`);
};

enrichAllPokemons();
