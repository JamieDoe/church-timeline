import type { BibleBook, Chapter } from "./types";

/**
 * The translation-source seam (spec §5). All reading goes through this, so
 * licensed API-fetched translations can be added later without touching the
 * reader. v1 ships only BundledSource (public-domain WEB + KJV).
 */
export interface TranslationSource {
  id: string;
  name: string;
  license: string;
  attribution?: string;
  getChapter(book: string, chapter: number): Promise<Chapter>;
}

/**
 * Loads the structured public-domain JSON from /public/bible, one book at a
 * time (lazy), and caches each fetched book in memory. Fully offline once the
 * static asset is served.
 */
export class BundledSource implements TranslationSource {
  readonly license = "Public domain.";
  private cache = new Map<string, Promise<BibleBook>>();

  constructor(
    readonly id: string,
    readonly name: string,
    readonly attribution?: string
  ) {}

  private book(code: string): Promise<BibleBook> {
    const key = code.toUpperCase();
    let p = this.cache.get(key);
    if (!p) {
      p = fetch(`/bible/${this.id}/${key}.json`).then((r) => {
        if (!r.ok) throw new Error(`Missing ${this.id}/${key}`);
        return r.json() as Promise<BibleBook>;
      });
      this.cache.set(key, p);
    }
    return p;
  }

  async getChapter(book: string, chapter: number): Promise<Chapter> {
    const b = await this.book(book);
    const ch = b.chapters.find((c) => c.number === chapter);
    if (!ch) throw new Error(`${book} ${chapter} not found`);
    return ch;
  }
}

/**
 * Scaffold only — NOT built in v1 (spec §5). When implemented it will fetch
 * licensed translations live (API.Bible / ESV API), honour the per-version
 * attribution, and enforce the no-bulk-store limits (fetch live, never bundle;
 * degrade gracefully rather than caching past the licensed cap). The user
 * supplies their own API key. Left here so the reader's contract already fits.
 */
export class ApiSource implements TranslationSource {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly license: string,
    readonly attribution: string,
    private readonly config: { apiKey: string; endpoint: string; versionId: string }
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getChapter(_book: string, _chapter: number): Promise<Chapter> {
    throw new Error(
      "ApiSource is not implemented in v1. Configure a licensed translation " +
        "(API.Bible / ESV) here, fetching live and honouring its storage limits."
    );
  }
}

// v1 registry: the two bundled public-domain translations. WEB is the readable
// default; KJV for the traditional feel.
export const TRANSLATIONS: TranslationSource[] = [
  new BundledSource("web", "World English Bible", "World English Bible (public domain)."),
  new BundledSource("kjv", "King James Version", "King James Version (1769; public domain)."),
];

export const DEFAULT_TRANSLATION = "web";

export function getSource(id: string): TranslationSource {
  return TRANSLATIONS.find((t) => t.id === id) ?? TRANSLATIONS[0];
}
