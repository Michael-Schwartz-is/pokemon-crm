import { getCloudflareContext } from "@opennextjs/cloudflare";

const PUBLIC_R2_URL = process.env.NEXT_PUBLIC_R2_URL || "https://pub-6fc5238d5b67437dac1ad915af3ce98b.r2.dev";

async function readKey(key: string): Promise<string> {
  try {
    const { env } = getCloudflareContext();
    if (env?.DATA) {
      const obj = await env.DATA.get(key);
      if (!obj) throw new Error(`R2 object not found: ${key}`);
      return await obj.text();
    }
  } catch {
    // getCloudflareContext throws in environments without CF runtime (e.g. `next dev`).
    // Fall through to public R2 fetch.
  }

  const res = await fetch(`${PUBLIC_R2_URL}/${key}`, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to fetch ${key}: ${res.status}`);
  return await res.text();
}

export async function loadJSON<T>(key: string): Promise<T> {
  const text = await readKey(key);
  return JSON.parse(text) as T;
}
