// cache is for AI predictions and analytics
// NOTE: currently unused; originally read/wrote ./app/data/analytics.json on disk.
// Stubbed for Cloudflare Workers compatibility (no filesystem). Reintroduce via R2
// or KV if analytics persistence is needed.

import { Pokemon } from "./CachePokemons";

type Analytic = {
  requestCount: number;
  description: string;
};

type Analytics = Record<string, Analytic | undefined>;

export function readAnayltics(): Analytics {
  return {};
}

export function generateComparisonKey(pokemon1: Pokemon, pokemon2: Pokemon) {
  // let's organize pokenons ABCly
  let names = [pokemon1.name, pokemon2.name];
  names.sort((a, b) => a.localeCompare(b));
  return `${names[0]}|${names[1]}`;
}

export function getAnalytic(pokemon1: Pokemon, pokemon2: Pokemon): Analytic {
  const key = generateComparisonKey(pokemon1, pokemon2);
  const analytics = readAnayltics();
  let analytic = analytics[key];

  if (!analytic) {
    analytic = createAnalytic(pokemon1, pokemon2);
  }

  return analytic;
}

export function incrementRequestCount(pokemon1: Pokemon, pokemon2: Pokemon) {
  // No-op: analytics persistence disabled on Workers.
  void pokemon1;
  void pokemon2;
}

export function updatePrediction(pokemon1: Pokemon, pokemon2: Pokemon, text: string) {}

export function createAnalytic(pokemon1: Pokemon, pokemon2: Pokemon) {
  void pokemon1;
  void pokemon2;
  return { requestCount: 1, description: "" };
}
