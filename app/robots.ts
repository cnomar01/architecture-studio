import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.masonandarc.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/app", "/api"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
