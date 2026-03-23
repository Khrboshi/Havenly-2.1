import type { MetadataRoute } from "next";
import { CONFIG } from "@/app/lib/config";

const base = CONFIG.siteUrl.replace(/\/$/, "");

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
