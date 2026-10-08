import type { MetadataRoute } from "next";

const SITE = "https://buildx.tiqanah.org";

// Public, indexable pages only (pages marked noindex are intentionally excluded).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/team`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/graduates`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/register`, changeFrequency: "weekly", priority: 0.6 },
  ];
}
