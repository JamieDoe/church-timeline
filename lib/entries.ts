import fs from "node:fs";
import path from "node:path";
import type { Entry, Layer } from "./types";

/**
 * Flat-file content loader. Reads every JSON file in /data/entries (each an
 * array of Entry), validates, and returns one merged, sorted list. Runs on
 * the server only (build time for static pages). Validation throws so a bad
 * data file fails the build rather than shipping silently.
 *
 * Undated (beginnings-zone) entries keep their file order — that order IS
 * their symbolic sequence. Dated entries sort by signed yearStart.
 */

const DATA_DIR = path.join(process.cwd(), "data", "entries");

const LAYERS: Layer[] = ["scripture", "people", "church"];
const CERTAINTIES = ["attested", "traditional", "contested"];
const RELATION_TYPES = [
  "line-of-promise",
  "prophet-to-king",
  "teacher-to-disciple",
  "anointed",
  "succeeded",
  "influenced",
  "opposed",
  "split-from",
  "covenant",
  "contemporary",
  "describes",
];

let cache: Entry[] | null = null;

function validate(entries: Entry[]): void {
  const ids = new Set<string>();
  for (const e of entries) {
    const where = `entry "${e.id ?? "<missing id>"}"`;
    if (!e.id || !e.title)
      throw new Error(`${where}: id and title are required`);
    if (ids.has(e.id)) throw new Error(`${where}: duplicate id`);
    ids.add(e.id);
    if (e.type !== "event" && e.type !== "figure" && e.type !== "text")
      throw new Error(`${where}: type must be "event", "figure", or "text"`);
    if (
      !Array.isArray(e.layers) ||
      e.layers.length === 0 ||
      e.layers.some((l) => !LAYERS.includes(l))
    )
      throw new Error(
        `${where}: layers must be a non-empty subset of ${LAYERS.join(", ")}`,
      );
    if (!CERTAINTIES.includes(e.certainty))
      throw new Error(
        `${where}: certainty must be one of ${CERTAINTIES.join(", ")}`,
      );
    if (e.undated) {
      if (e.yearStart !== undefined || e.yearEnd !== undefined)
        throw new Error(
          `${where}: undated entries must not carry yearStart/yearEnd`,
        );
    } else {
      if (typeof e.yearStart !== "number")
        throw new Error(`${where}: dated entries require a numeric yearStart`);
      if (e.yearStart === 0 || e.yearEnd === 0)
        throw new Error(`${where}: there is no year 0 (see lib/types.ts)`);
      if (e.yearEnd !== undefined && e.yearEnd < e.yearStart)
        throw new Error(`${where}: yearEnd precedes yearStart`);
      if (!e.dateDisplay)
        throw new Error(`${where}: dated entries require dateDisplay`);
    }
    if (!e.summary || !e.article)
      throw new Error(`${where}: summary and article are required`);
    if (!e.scriptureRefs?.length && !e.sources?.length)
      throw new Error(
        `${where}: accuracy protocol requires scriptureRefs and/or sources`,
      );
    for (const r of e.relationships ?? []) {
      if (!RELATION_TYPES.includes(r.type))
        throw new Error(`${where}: unknown relationship type "${r.type}"`);
    }
  }
  // Dangling relationship targets fail the build.
  for (const e of entries) {
    for (const r of e.relationships ?? []) {
      if (!ids.has(r.targetId))
        throw new Error(
          `entry "${e.id}": relationship targets unknown entry "${r.targetId}"`,
        );
    }
  }
}

export function getEntries(): Entry[] {
  if (cache) return cache;
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const all: Entry[] = [];
  for (const file of files) {
    const parsed = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, file), "utf8"),
    );
    if (!Array.isArray(parsed))
      throw new Error(`${file}: expected a top-level array of entries`);
    all.push(...parsed);
  }
  validate(all);
  // Undated first in file order, then dated by signed year. Same-year entries
  // keep file order (Array.sort is stable) — so tightly clustered events like
  // the passion week read in narrative sequence, on the canvas and in the
  // "Through the Scriptures" journey, rather than alphabetically.
  const undated = all.filter((e) => e.undated);
  const dated = all
    .filter((e) => !e.undated)
    .sort((a, b) => a.yearStart! - b.yearStart!);
  cache = [...undated, ...dated];
  return cache;
}

export function getEntry(id: string): Entry | undefined {
  return getEntries().find((e) => e.id === id);
}

export function getFigures(): Entry[] {
  return getEntries().filter((e) => e.type === "figure");
}

/** Incoming relationships, computed by reversing every outgoing edge. */
export function getIncoming(id: string): { source: Entry; type: string }[] {
  return getEntries().flatMap((e) =>
    (e.relationships ?? [])
      .filter((r) => r.targetId === id)
      .map((r) => ({ source: e, type: r.type })),
  );
}

/**
 * The gold thread: orders every entry touched by a line-of-promise edge by
 * following the edges from the entry no promise-edge points to (Adam).
 */
export function getLineOfPromise(): Entry[] {
  const entries = getEntries();
  const byId = new Map(entries.map((e) => [e.id, e]));
  const next = new Map<string, string>();
  const hasIncoming = new Set<string>();
  for (const e of entries) {
    for (const r of e.relationships ?? []) {
      if (r.type === "line-of-promise") {
        next.set(e.id, r.targetId);
        hasIncoming.add(r.targetId);
      }
    }
  }
  const start = [...next.keys()].find((id) => !hasIncoming.has(id));
  if (!start) return [];
  const chain: Entry[] = [];
  let cur: string | undefined = start;
  const seen = new Set<string>();
  while (cur && byId.has(cur) && !seen.has(cur)) {
    seen.add(cur);
    chain.push(byId.get(cur)!);
    cur = next.get(cur);
  }
  return chain;
}
