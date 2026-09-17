import type { MetadataRoute } from "next";
import { CANON } from "@/lib/bible/types";
import { getEntries } from "@/lib/entries";
import { SITE_URL } from "@/lib/site";

/**
 * Every publicly reachable route. Built from the same sources the pages are —
 * so a new entry or canon book appears in the sitemap without a second edit.
 * Deeper chapters (/read/<book>/2…) are deliberately omitted: they render the
 * same shell as chapter 1 and would add ~1,100 near-duplicate URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    ...["/read", "/figures", "/map", "/about"].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const entryRoutes: MetadataRoute.Sitemap = getEntries().map((entry) => ({
    url: `${SITE_URL}/entry/${entry.id}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const bookRoutes: MetadataRoute.Sitemap = CANON.map((book) => ({
    url: `${SITE_URL}/read/${book.code}/1`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...entryRoutes, ...bookRoutes];
}
