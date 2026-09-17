/**
 * Canonical site identity — the one place absolute URLs come from
 * (metadataBase, Open Graph, sitemap.xml, robots.txt).
 *
 * On Vercel, VERCEL_PROJECT_PRODUCTION_URL holds the stable production domain
 * (e.g. "illuminated-timeline.vercel.app") and is injected into every build,
 * previews included — so canonical URLs and the sitemap always point at
 * production rather than at a throwaway per-deployment hash. Set
 * NEXT_PUBLIC_SITE_URL to override when a custom domain is added later.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "The Illuminated Timeline";

export const SITE_DESCRIPTION =
  "An illuminated-manuscript timeline of the Bible, its figures, and the church history that flows from it — with a reader for the public-domain Scriptures.";
