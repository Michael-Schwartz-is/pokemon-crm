# Fetch Enhanced Pokemon Data

## Purpose

This script fetches comprehensive Pokemon data from PokeAPI and saves it to `app/data/PokemonDetails.json`. This data powers the individual Pokemon detail pages at `/pokemon/[name]`.

## What It Fetches

For each of the 1025 Pokemon:
- **Evolution chains** - Full evolution tree with triggers (level, item, trade, etc.)
- **Moves** - Up to 100 moves per Pokemon with power, accuracy, PP, type, effect, learn method
- **Ability descriptions** - Effect text for each ability, including hidden abilities
- **Sprites** - Official artwork, shiny, home, animated variants
- **Forms/Varieties** - Mega evolutions, regional forms, alternate forms
- **Encounter locations** - Where to catch in each game
- **Breeding info** - Gender ratio, hatch steps, egg groups
- **Pokedex numbers** - National dex and regional dex entries

## How to Run

```bash
cd /Users/michael/Documents/code/pokemon-crm
npx ts-node scripts/fetchEnhancedPokemonData.ts
```

## Expected Duration

- **Time**: 2-3 hours (due to PokeAPI rate limiting)
- **API calls**: ~5000+ requests (Pokemon data, species, evolution chains, abilities, moves, encounters)
- **Output size**: ~50-100MB JSON file

## Progress & Resume

- Progress is saved every 10 Pokemon to `app/data/PokemonDetails.json`
- If interrupted, re-running the script will **resume from where it left off**
- Already-processed Pokemon are skipped automatically

## After Completion

Once the script finishes:
1. The file `app/data/PokemonDetails.json` will contain all enhanced data
2. Pokemon detail pages will load instantly from local data (no API calls)
3. Run `npm run build` to statically generate all 1025 Pokemon pages

## Verification

After running, check the output:
```bash
# Check file size (should be 50-100MB)
ls -lh app/data/PokemonDetails.json

# Check Pokemon count (should be 1025)
node -e "console.log(Object.keys(require('./app/data/PokemonDetails.json')).length)"
```

## Notes

- Be patient - the script is intentionally slow to respect PokeAPI rate limits
- Run on a stable internet connection
- Can run in background: `nohup npx ts-node scripts/fetchEnhancedPokemonData.ts > fetch.log 2>&1 &`
