import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://havenly-2-1.vercel.app";

  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/about`, priority: 0.8 },
    { url: `${base}/blog`, priority: 0.9 },
    { url: `${base}/premium`, priority: 0.7 },
    { url: `${base}/upgrade`, priority: 0.7 },
    { url: `${base}/privacy`, priority: 0.5 },
  ];
}
