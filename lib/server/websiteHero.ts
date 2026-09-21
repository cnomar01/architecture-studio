import { query } from "@/lib/server/db";

const fallbackImage = "/images/hero.png";

export function isWebsiteImage(value: unknown): value is string {
  return typeof value === "string" && (
    /^https?:\/\//.test(value) ||
    value.startsWith("/") ||
    /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)
  ) && value.length <= 5_500_000;
}

export async function getWebsiteHeroImage() {
  const result = await query<{ value: { image_url?: unknown }; updated_at: string }>(
    "SELECT value,updated_at FROM website_settings WHERE key='home_hero' LIMIT 1",
  );
  const row = result.rows[0];
  const image = row?.value?.image_url;
  if (!isWebsiteImage(image)) return fallbackImage;
  if (!image.startsWith("data:image/")) return image;
  const version = new Date(row.updated_at).getTime() || 0;
  return `/api/public/website-home-hero/image?v=${version}`;
}
