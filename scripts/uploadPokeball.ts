import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME || "poke-arena",
};

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CONFIG.accessKeyId,
    secretAccessKey: CONFIG.secretAccessKey,
  },
});

async function upload(key: string, buffer: Buffer, contentType: string): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: CONFIG.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
}

async function main() {
  console.log("🎱 Uploading pokeball to R2...\n");

  // Download pokeball from PokeAPI sprites
  const pokeballUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
  
  const res = await fetch(pokeballUrl);
  if (!res.ok) {
    console.error("❌ Failed to download pokeball");
    process.exit(1);
  }
  
  const buffer = Buffer.from(await res.arrayBuffer());
  
  // Convert to webp and avif
  const [webp, avif] = await Promise.all([
    sharp(buffer).webp({ quality: 90 }).toBuffer(),
    sharp(buffer).avif({ quality: 85 }).toBuffer(),
  ]);
  
  // Upload both formats
  await Promise.all([
    upload("pokeball.webp", webp, "image/webp"),
    upload("pokeball.avif", avif, "image/avif"),
  ]);
  
  console.log("✅ Uploaded pokeball.webp");
  console.log("✅ Uploaded pokeball.avif");
  console.log(`\n🔗 URL: ${process.env.NEXT_PUBLIC_R2_URL}/pokeball.webp`);
}

main().catch(console.error);
