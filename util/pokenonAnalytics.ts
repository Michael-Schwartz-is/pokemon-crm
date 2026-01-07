// cache is for AI predictions and analytics

import fs from "fs";
import { Pokemon } from "./CachePokemons";

type Analytic = {
  requestCount: number;
  description: string;
};

type Analytics = Record<string, Analytic | undefined>;

export function readAnayltics(): Analytics {
  return JSON.parse(fs.readFileSync("./app/data/analytics.json", "utf-8"));
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
  const key = generateComparisonKey(pokemon1, pokemon2);
  const content = readAnayltics();
  content[key] ? content[key].requestCount++ : createAnalytic(pokemon1, pokemon2); //?
  fs.writeFileSync("./app/data/analytics.json", JSON.stringify(content));
}

export function updatePrediction(pokemon1: Pokemon, pokemon2: Pokemon, text: string) {}

export function createAnalytic(pokemon1: Pokemon, pokemon2: Pokemon) {
  const key = generateComparisonKey(pokemon1, pokemon2);
  const content = readAnayltics();
  const newAnalytic: Analytic = {
    requestCount: 1,
    description: "",
  };
  content[key] = newAnalytic;
  //handle Prediction [get from outside]

  fs.writeFileSync("./app/data/analytics.json", JSON.stringify(content));
  return newAnalytic;
}
