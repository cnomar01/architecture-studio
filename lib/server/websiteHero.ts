import { unstable_cache } from "next/cache";
import { query } from "@/lib/server/db";

const fallbackImage = "/images/hero-florence-sunset.png";
export const websiteHeroCacheTag = "website-home-hero";

export function isWebsiteImage(value: unknown): value is string {
  return typeof value === "string" && (
    /^https?:\/\//.test(value) ||
    value.startsWith("/") ||
    /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)
  ) && value.length <= 5_500_000;
}

const loadWebsiteHeroImage = unstable_cache(async () => {
  const result = await query<{ image_url: string | null; is_data_image: boolean; updated_at: string }>(
    `SELECT CASE WHEN value->>'image_url' LIKE 'data:image/%' THEN NULL ELSE value->>'image_url' END AS image_url,
      value->>'image_url' LIKE 'data:image/%' AS is_data_image,updated_at
     FROM website_settings WHERE key='home_hero' LIMIT 1`,
  );
  const row = result.rows[0];
  if (!row) return fallbackImage;
  if (row.is_data_image) {
    const version = new Date(row.updated_at).getTime() || 0;
    return `/api/public/website-home-hero/image?v=${version}`;
  }
  return isWebsiteImage(row.image_url) ? row.image_url : fallbackImage;
}, ["website-home-hero-v2"], { tags: [websiteHeroCacheTag], revalidate: 3600 });

export async function getWebsiteHeroImage() {
  try {
    return await loadWebsiteHeroImage();
  } catch (error) {
    console.error("[public-home] Hero CMS query failed; serving the checked-in hero image.", error);
    return fallbackImage;
  }
}
