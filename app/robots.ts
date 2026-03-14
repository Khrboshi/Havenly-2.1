import type { MetadataRoute } from "next";

const base = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://havenly.app"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/journal",
        "/settings",
        "/tools",
        "/insights",
        "/api",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
