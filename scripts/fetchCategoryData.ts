/**
 * Script to fetch and cache category data from PokeAPI
 * Run with: npx ts-node scripts/fetchCategoryData.ts
 */

interface TypeDamageRelations {
  double_damage_from: { name: string; url: string }[];
  double_damage_to: { name: string; url: string }[];
  half_damage_from: { name: string; url: string }[];
  half_damage_to: { name: string; url: string }[];
  no_damage_from: { name: string; url: string }[];
  no_damage_to: { name: string; url: string }[];
}

interface TypeData {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: string[];
    double_damage_to: string[];
    half_damage_from: string[];
    half_damage_to: string[];
    no_damage_from: string[];
    no_damage_to: string[];
  };
  move_damage_class: string | null;
  pokemon_count: number;
  color: string;
  description: string;
}

interface GenerationData {
  id: number;
  name: string;
  display_name: string;
  region: string;
  version_groups: string[];
  pokemon_count: number;
  starters: string[];
  legendaries: string[];
  year_released: number;
  description: string;
}

// Type colors matching FilterSortPanel.tsx
const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

// Type descriptions
const TYPE_DESCRIPTIONS: Record<string, string> = {
  normal: "Normal-type Pokémon are versatile fighters with few weaknesses. They excel in stability and have access to a wide variety of moves.",
  fire: "Fire-type Pokémon harness the power of flames. They are strong against Grass, Ice, Bug, and Steel types but weak to Water, Ground, and Rock.",
  water: "Water-type Pokémon control aquatic powers. They dominate Fire, Ground, and Rock types while being vulnerable to Electric and Grass.",
  electric: "Electric-type Pokémon channel lightning and electricity. They shock Water and Flying types but are grounded by Ground-type moves.",
  grass: "Grass-type Pokémon draw power from nature. They thrive against Water, Ground, and Rock but struggle against Fire, Ice, and Flying.",
  ice: "Ice-type Pokémon wield freezing attacks. They are effective against Dragon, Flying, Grass, and Ground but melt under Fire and Fighting.",
  fighting: "Fighting-type Pokémon are martial arts masters. They crush Normal, Ice, Rock, Dark, and Steel types with raw power.",
  poison: "Poison-type Pokémon use toxic attacks. They are super effective against Grass and Fairy types but fail against Steel.",
  ground: "Ground-type Pokémon command the earth itself. They devastate Electric, Fire, Poison, Rock, and Steel types.",
  flying: "Flying-type Pokémon rule the skies. They soar above Fighting, Bug, and Grass types with aerial superiority.",
  psychic: "Psychic-type Pokémon possess incredible mental powers. They overwhelm Fighting and Poison types with telekinetic force.",
  bug: "Bug-type Pokémon evolve rapidly and swarm opponents. They are effective against Grass, Psychic, and Dark types.",
  rock: "Rock-type Pokémon are sturdy defenders. They crush Fire, Flying, Ice, and Bug types with stone-hard attacks.",
  ghost: "Ghost-type Pokémon are spectral entities. They haunt Psychic and other Ghost types while being immune to Normal and Fighting.",
  dragon: "Dragon-type Pokémon are legendary creatures of immense power. They battle other Dragons but fear Ice and Fairy types.",
  dark: "Dark-type Pokémon use underhanded tactics. They prey on Psychic and Ghost types but fall to Fighting and Fairy.",
  steel: "Steel-type Pokémon have incredible defenses. They resist many types and are super effective against Ice, Rock, and Fairy.",
  fairy: "Fairy-type Pokémon wield magical powers. They counter Dragon, Fighting, and Dark types with mystical attacks.",
};

// Generation metadata
const GENERATION_METADATA: Record<string, { year: number; starters: string[]; legendaries: string[]; description: string }> = {
  "generation-i": {
    year: 1996,
    starters: ["bulbasaur", "charmander", "squirtle"],
    legendaries: ["articuno", "zapdos", "moltres", "mewtwo", "mew"],
    description: "The original 151 Pokémon that started it all. Set in the Kanto region, this generation introduced the world to Pokémon through Red, Blue, and Yellow versions.",
  },
  "generation-ii": {
    year: 1999,
    starters: ["chikorita", "cyndaquil", "totodile"],
    legendaries: ["raikou", "entei", "suicune", "lugia", "ho-oh", "celebi"],
    description: "Expanded the Pokémon world with 100 new species in the Johto region. Introduced breeding, day/night cycles, and held items.",
  },
  "generation-iii": {
    year: 2002,
    starters: ["treecko", "torchic", "mudkip"],
    legendaries: ["regirock", "regice", "registeel", "latias", "latios", "kyogre", "groudon", "rayquaza", "jirachi", "deoxys-normal"],
    description: "Set in the tropical Hoenn region with 135 new Pokémon. Introduced abilities, natures, and double battles.",
  },
  "generation-iv": {
    year: 2006,
    starters: ["turtwig", "chimchar", "piplup"],
    legendaries: ["uxie", "mesprit", "azelf", "dialga", "palkia", "heatran", "regigigas", "giratina-altered", "cresselia", "phione", "manaphy", "darkrai", "shaymin-land", "arceus"],
    description: "Explored the Sinnoh region with 107 new Pokémon. Introduced the physical/special split and online trading.",
  },
  "generation-v": {
    year: 2010,
    starters: ["snivy", "tepig", "oshawott"],
    legendaries: ["cobalion", "terrakion", "virizion", "tornadus-incarnate", "thundurus-incarnate", "reshiram", "zekrom", "landorus-incarnate", "kyurem", "keldeo-ordinary", "meloetta-aria", "genesect"],
    description: "Unova region brought 156 new Pokémon - the most of any generation. Featured an entirely new Pokédex and animated sprites.",
  },
  "generation-vi": {
    year: 2013,
    starters: ["chespin", "fennekin", "froakie"],
    legendaries: ["xerneas", "yveltal", "zygarde-50", "diancie", "hoopa", "volcanion"],
    description: "Kalos region introduced 72 new Pokémon and the Fairy type. First generation with full 3D graphics and Mega Evolution.",
  },
  "generation-vii": {
    year: 2016,
    starters: ["rowlet", "litten", "popplio"],
    legendaries: ["tapu-koko", "tapu-lele", "tapu-bulu", "tapu-fini", "cosmog", "cosmoem", "solgaleo", "lunala", "nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana", "guzzlord", "necrozma", "magearna", "marshadow", "poipole", "naganadel", "stakataka", "blacephalon", "zeraora"],
    description: "Alola region added 88 new Pokémon with a Hawaiian theme. Introduced regional forms, Z-Moves, and Ultra Beasts.",
  },
  "generation-viii": {
    year: 2019,
    starters: ["grookey", "scorbunny", "sobble"],
    legendaries: ["zacian", "zamazenta", "eternatus", "kubfu", "urshifu-single-strike", "zarude", "regieleki", "regidrago", "glastrier", "spectrier", "calyrex"],
    description: "Galar region brought 96 new Pokémon with British inspiration. Introduced Dynamax, Gigantamax, and the Wild Area.",
  },
  "generation-ix": {
    year: 2022,
    starters: ["sprigatito", "fuecoco", "quaxly"],
    legendaries: ["koraidon", "miraidon", "wo-chien", "chien-pao", "ting-lu", "chi-yu", "roaring-moon", "iron-valiant", "walking-wake", "iron-leaves", "okidogi", "munkidori", "fezandipiti", "ogerpon", "gouging-fire", "raging-bolt", "iron-boulder", "iron-crown", "terapagos", "pecharunt"],
    description: "Paldea region features 120 new Pokémon in an open-world setting. Introduced Terastallization and seamless multiplayer.",
  },
};

// Region name mapping
const REGION_DISPLAY_NAMES: Record<string, string> = {
  kanto: "Kanto",
  johto: "Johto",
  hoenn: "Hoenn",
  sinnoh: "Sinnoh",
  unova: "Unova",
  kalos: "Kalos",
  alola: "Alola",
  galar: "Galar",
  paldea: "Paldea",
};

async function fetchTypeData(): Promise<TypeData[]> {
  const types: TypeData[] = [];
  
  for (const typeName of Object.keys(TYPE_COLORS)) {
    console.log(`Fetching type: ${typeName}`);
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
      const data = await response.json();
      
      const damageRelations: TypeDamageRelations = data.damage_relations;
      
      types.push({
        id: data.id,
        name: typeName,
        damage_relations: {
          double_damage_from: damageRelations.double_damage_from.map(t => t.name),
          double_damage_to: damageRelations.double_damage_to.map(t => t.name),
          half_damage_from: damageRelations.half_damage_from.map(t => t.name),
          half_damage_to: damageRelations.half_damage_to.map(t => t.name),
          no_damage_from: damageRelations.no_damage_from.map(t => t.name),
          no_damage_to: damageRelations.no_damage_to.map(t => t.name),
        },
        move_damage_class: data.move_damage_class?.name || null,
        pokemon_count: data.pokemon.length,
        color: TYPE_COLORS[typeName],
        description: TYPE_DESCRIPTIONS[typeName],
      });
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching type ${typeName}:`, error);
    }
  }
  
  return types;
}

async function fetchGenerationData(): Promise<GenerationData[]> {
  const generations: GenerationData[] = [];
  
  for (let i = 1; i <= 9; i++) {
    const genName = `generation-${["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"][i - 1]}`;
    console.log(`Fetching generation: ${genName}`);
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/generation/${i}`);
      const data = await response.json();
      
      const metadata = GENERATION_METADATA[genName];
      const regionName = data.main_region?.name || "";
      
      generations.push({
        id: i,
        name: genName,
        display_name: `Generation ${["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][i - 1]}`,
        region: REGION_DISPLAY_NAMES[regionName] || regionName,
        version_groups: data.version_groups.map((vg: { name: string }) => vg.name),
        pokemon_count: data.pokemon_species.length,
        starters: metadata?.starters || [],
        legendaries: metadata?.legendaries || [],
        year_released: metadata?.year || 0,
        description: metadata?.description || "",
      });
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching generation ${i}:`, error);
    }
  }
  
  return generations;
}

// Role definitions (derived, not from PokeAPI)
const ROLES_DATA = [
  {
    id: "physical-attacker",
    name: "Physical Attacker",
    description: "Pokémon that excel in dealing physical damage. They have high Attack stats and learn powerful physical moves like Earthquake, Close Combat, and Outrage.",
    stat_focus: "attack",
    color: "#F08030",
    icon: "sword",
    criteria: "Attack is the highest offensive stat and exceeds 100 base.",
  },
  {
    id: "special-attacker",
    name: "Special Attacker",
    description: "Pokémon specializing in special moves. They possess high Special Attack stats and devastating moves like Thunderbolt, Psychic, and Flamethrower.",
    stat_focus: "special-attack",
    color: "#BA68C8",
    icon: "sparkles",
    criteria: "Special Attack is the highest offensive stat and exceeds 100 base.",
  },
  {
    id: "physical-tank",
    name: "Physical Tank",
    description: "Defensive walls that absorb physical hits. High HP and Defense allow them to take repeated attacks while supporting their team.",
    stat_focus: "defense",
    color: "#29B6F6",
    icon: "shield",
    criteria: "Defense is the highest stat and HP is above average.",
  },
  {
    id: "special-tank",
    name: "Special Tank",
    description: "Bulky Pokémon that shrug off special attacks. Their high Special Defense makes them ideal for tanking energy-based moves.",
    stat_focus: "special-defense",
    color: "#4CAF50",
    icon: "shield-plus",
    criteria: "Special Defense is the highest stat and HP is above average.",
  },
  {
    id: "speedster",
    name: "Speedster",
    description: "Lightning-fast Pokémon that strike first. Their incredible Speed lets them outpace opponents and control the pace of battle.",
    stat_focus: "speed",
    color: "#00BCD4",
    icon: "zap",
    criteria: "Speed exceeds 100 base and is the highest stat.",
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Well-rounded Pokémon with no glaring weaknesses. Their even stat distribution makes them adaptable to various battle situations.",
    stat_focus: "all",
    color: "#9E9E9E",
    icon: "scale",
    criteria: "No single stat significantly exceeds others.",
  },
];

// Rarity definitions
const RARITY_DATA = [
  {
    id: "common",
    name: "Common",
    description: "Frequently encountered Pokémon found in most areas. They're easy to catch and often the first Pokémon trainers encounter on their journey.",
    color: "#888888",
    capture_rate_range: "200-255",
    examples: ["rattata", "pidgey", "caterpie", "weedle"],
  },
  {
    id: "uncommon",
    name: "Uncommon",
    description: "Pokémon that appear less frequently than common species. They may require specific conditions or locations to encounter.",
    color: "#4CAF50",
    capture_rate_range: "100-199",
    examples: ["pikachu", "eevee", "growlithe", "abra"],
  },
  {
    id: "rare",
    name: "Rare",
    description: "Elusive Pokémon that are difficult to find. Trainers often spend considerable time searching for these prized catches.",
    color: "#2196F3",
    capture_rate_range: "45-99",
    examples: ["dratini", "larvitar", "beldum", "gible"],
  },
  {
    id: "ultra-rare",
    name: "Ultra Rare",
    description: "Exceptionally rare Pokémon that few trainers ever encounter. Finding one is considered a significant achievement.",
    color: "#9C27B0",
    capture_rate_range: "3-44",
    examples: ["dragonite", "tyranitar", "metagross", "garchomp"],
  },
  {
    id: "legendary",
    name: "Legendary",
    description: "Legendary Pokémon are one-of-a-kind beings of immense power. They often play crucial roles in the lore of their regions.",
    color: "#FFC107",
    capture_rate_range: "3-45",
    examples: ["mewtwo", "lugia", "rayquaza", "arceus"],
  },
  {
    id: "mythical",
    name: "Mythical",
    description: "Mythical Pokémon are shrouded in mystery and typically only available through special events. They are among the rarest Pokémon in existence.",
    color: "#E91E63",
    capture_rate_range: "3-45",
    examples: ["mew", "celebi", "jirachi", "arceus"],
  },
];

async function main() {
  const fs = await import("fs");
  const path = await import("path");
  
  console.log("Starting PokeAPI data fetch...\n");
  
  // Fetch type data
  console.log("=== Fetching Type Data ===");
  const types = await fetchTypeData();
  const typesPath = path.join(process.cwd(), "app/data/types.json");
  fs.writeFileSync(typesPath, JSON.stringify(types, null, 2));
  console.log(`✓ Saved ${types.length} types to ${typesPath}\n`);
  
  // Fetch generation data
  console.log("=== Fetching Generation Data ===");
  const generations = await fetchGenerationData();
  const generationsPath = path.join(process.cwd(), "app/data/generations.json");
  fs.writeFileSync(generationsPath, JSON.stringify(generations, null, 2));
  console.log(`✓ Saved ${generations.length} generations to ${generationsPath}\n`);
  
  // Save roles data (static)
  console.log("=== Saving Role Data ===");
  const rolesPath = path.join(process.cwd(), "app/data/roles.json");
  fs.writeFileSync(rolesPath, JSON.stringify(ROLES_DATA, null, 2));
  console.log(`✓ Saved ${ROLES_DATA.length} roles to ${rolesPath}\n`);
  
  // Save rarity data (static)
  console.log("=== Saving Rarity Data ===");
  const rarityPath = path.join(process.cwd(), "app/data/rarity.json");
  fs.writeFileSync(rarityPath, JSON.stringify(RARITY_DATA, null, 2));
  console.log(`✓ Saved ${RARITY_DATA.length} rarity tiers to ${rarityPath}\n`);
  
  console.log("=== All data fetched and saved successfully! ===");
}

main().catch(console.error);


