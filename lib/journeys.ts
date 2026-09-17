import fs from "node:fs";
import path from "node:path";
import type { Certainty, Journey } from "./types";

/**
 * Flat-file loader for mapped routes (see /data/journeys). Server-only, read at
 * build time. Validates so a malformed route fails the build rather than
 * shipping a silently-broken line.
 */

const DIR = path.join(process.cwd(), "data", "journeys");
const CERTAINTIES: Certainty[] = ["attested", "traditional", "contested"];

let cache: Journey[] | null = null;

export function getJourneys(): Journey[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return (cache = []);
  const journeys: Journey[] = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Journey);

  const ids = new Set<string>();
  for (const j of journeys) {
    const where = `journey "${j.id ?? "<missing id>"}"`;
    if (!j.id || !j.title) throw new Error(`${where}: id and title are required`);
    if (ids.has(j.id)) throw new Error(`${where}: duplicate id`);
    ids.add(j.id);
    if (!CERTAINTIES.includes(j.certainty))
      throw new Error(`${where}: certainty must be one of ${CERTAINTIES.join(", ")}`);
    if (!j.note) throw new Error(`${where}: an honesty note is required`);
    if (!Array.isArray(j.points) || j.points.length < 2)
      throw new Error(`${where}: a route needs at least two points`);
    for (const p of j.points) {
      if (!p.placeName) throw new Error(`${where}: every point needs a placeName`);
    }
  }
  cache = journeys;
  return cache;
}
