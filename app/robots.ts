import type { MetadataRoute } from "next";

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
    sitemap: "https://havenly-2-1.vercel.app/sitemap.xml",
  };
}
