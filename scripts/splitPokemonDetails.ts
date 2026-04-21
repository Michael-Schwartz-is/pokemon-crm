import fs from "fs";
import path from "path";

const INPUT = path.join(process.cwd(), "app/data/PokemonDetails.json");
const OUTPUT_DIR = path.join(process.cwd(), "app/data/pokemon");

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`Input file not found: ${INPUT}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT, "utf-8");
  const data: Record<string, unknown> = JSON.parse(raw);
  const names = Object.keys(data);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let written = 0;
  for (const name of names) {
    const entry = data[name];
    const safeName = name.toLowerCase();
    const outPath = path.join(OUTPUT_DIR, `${safeName}.json`);
    fs.writeFileSync(outPath, JSON.stringify(entry));
    written++;
  }

  console.log(`Wrote ${written} files to ${OUTPUT_DIR}`);
}

main();
