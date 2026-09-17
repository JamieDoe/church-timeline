/**
 * Scripture references link OUT to a public Bible site; we never bundle
 * Bible text. BibleGateway accepts the human-readable reference directly.
 * En-dashes in ranges ("Genesis 12–25") are normalized to hyphens.
 */
export function scriptureUrl(ref: string): string {
  const cleaned = ref.replace(/–/g, "-").replace(/\s*\(.*\)$/, "");
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(cleaned)}&version=ESV`;
}
