import { CANON, getBook } from "./types";

/**
 * Turn a free-text scripture pointer ("His story is told in Genesis 37–50",
 * "Luke 24:44", "Read it: Exodus 1–40.") into a deep link into the reader.
 * Finds the earliest canon book name + its starting chapter.
 */

const CANDIDATES: { name: string; code: string }[] = [
  ...CANON.map((b) => ({ name: b.name, code: b.code })),
  { name: "Song of Solomon", code: "SNG" },
  { name: "Psalm", code: "PSA" },
];

export interface ReadingRef {
  code: string;
  chapter: number;
  label: string;
}

export function parseReadingRef(text?: string): ReadingRef | null {
  if (!text) return null;
  let best: { code: string; idx: number; chapter: number; nameLen: number } | null = null;
  for (const c of CANDIDATES) {
    const esc = c.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m = new RegExp(`\\b${esc}\\b(?:\\s+(\\d+))?`, "i").exec(text);
    if (!m) continue;
    const chapter = m[1] ? +m[1] : 1;
    if (
      !best ||
      m.index < best.idx ||
      (m.index === best.idx && c.name.length > best.nameLen)
    ) {
      best = { code: c.code, idx: m.index, chapter, nameLen: c.name.length };
    }
  }
  if (!best) return null;
  const book = getBook(best.code);
  if (!book) return null;
  const chapter = Math.min(Math.max(1, best.chapter), book.chapters);
  return { code: best.code, chapter, label: `${book.name} ${chapter}` };
}

/** The canon book code for a timeline entry id, if it maps to a book. */
export function entryBookCode(entryId: string): string | undefined {
  return CANON.find((b) => b.entryId === entryId)?.code;
}
