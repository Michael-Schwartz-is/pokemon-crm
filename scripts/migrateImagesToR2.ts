import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// R2 Configuration (from environment)
const CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME || "poke-arena",
  
  // Image settings
  avifQuality: 80,
  webpQuality: 85,
  
  // Process 20 Pokemon at once
  concurrency: 20,
};

// S3 client for R2
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CONFIG.accessKeyId,
    secretAccessKey: CONFIG.secretAccessKey,
  },
});

// Check if object exists
async function exists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: CONFIG.bucketName, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// Upload buffer to R2
async function upload(key: string, buffer: Buffer, contentType: string): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: CONFIG.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
}

// Process single Pokemon
async function processPokemon(
  pokemon: { id: number; name: string; image: string }
): Promise<{ success: boolean; skipped: boolean; error?: string }> {
  try {
    // Skip if already exists
    if (await exists(`${pokemon.id}.avif`)) {
      return { success: true, skipped: true };
    }
    
    // Download
    const res = await fetch(pokemon.image);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    
    // Convert & upload in parallel
    const [avif, webp] = await Promise.all([
      sharp(buffer).avif({ quality: CONFIG.avifQuality }).toBuffer(),
      sharp(buffer).webp({ quality: CONFIG.webpQuality }).toBuffer(),
    ]);
    
    await Promise.all([
      upload(`${pokemon.id}.avif`, avif, "image/avif"),
      upload(`${pokemon.id}.webp`, webp, "image/webp"),
    ]);
    
    return { success: true, skipped: false };
  } catch (error) {
    return { success: false, skipped: false, error: String(error) };
  }
}

// Main
async function main() {
  console.log("🚀 Pokemon Migration (S3 SDK - Fast Mode)\n");
  
  // Validate required env vars
  if (!CONFIG.accountId || !CONFIG.accessKeyId || !CONFIG.secretAccessKey) {
    console.error("❌ Missing R2 credentials in .env.local");
    console.error("   Required: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY");
    process.exit(1);
  }
  
  // Load Pokemon
  const data: Record<string, { id: number; name: string; image: string }> = 
    JSON.parse(fs.readFileSync("app/data/AllPokemons.json", "utf-8"));
  const pokemons = Object.values(data).sort((a, b) => a.id - b.id);
  
  console.log(`📦 ${pokemons.length} Pokemon | ⚡ ${CONFIG.concurrency} parallel\n`);
  
  let uploaded = 0, skipped = 0, failed = 0;
  const start = Date.now();
  
  // Process in batches
  for (let i = 0; i < pokemons.length; i += CONFIG.concurrency) {
    const batch = pokemons.slice(i, i + CONFIG.concurrency);
    const results = await Promise.all(batch.map(p => processPokemon(p)));
    
    results.forEach((r, j) => {
      const p = batch[j];
      const idx = i + j + 1;
      if (r.skipped) {
        skipped++;
        process.stdout.write(`\r[${idx}/${pokemons.length}] ⏭️  ${p.name.padEnd(15)}`);
      } else if (r.success) {
        uploaded++;
        process.stdout.write(`\r[${idx}/${pokemons.length}] ✅ ${p.name.padEnd(15)}`);
      } else {
        failed++;
        console.log(`\n[${idx}] ❌ ${p.name}: ${r.error}`);
      }
    });
  }
  
  const mins = ((Date.now() - start) / 60000).toFixed(1);
  console.log(`\n\n${"=".repeat(40)}`);
  console.log(`✅ Uploaded: ${uploaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Time: ${mins} min`);
}

main().catch(console.error);
