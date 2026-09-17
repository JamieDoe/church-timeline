import type { Entry, RelationType } from "./types";

/**
 * World-coordinate model for the manuscript canvas. Units are px at scale 1.
 * The beginnings zone (undated entries) occupies a fixed region at the far
 * left, walled off from the dated axis by a threshold divider at Abraham,
 * where conventional dating begins. Dated x-positions are linear in the
 * signed year (see lib/types.ts for the no-year-0 convention; the axis is
 * treated as continuous, accepting a ≤1-year error at the BC/AD boundary).
 */

export const BEGINNINGS_W = 760;
export const THRESHOLD_W = 70;
export const YEAR_MIN = -2150;
export const YEAR_MAX = 1700;
/** Pixels per year on the linear, to-scale axis. Dense clusters spread across
 *  vertical bands (see buildCanvasLayout), never by distorting the time axis. */
export const PX_PER_YEAR = 1.6;
export const AXIS_X0 = BEGINNINGS_W + THRESHOLD_W;

/**
 * A single magnified window: the time axis is strictly linear everywhere, EXCEPT
 * the Christ-&-Apostles generation (AD -5 to 100), which is stretched by MAG so
 * its dense knot of figures, events, and the first New Testament books can
 * breathe. The axis stays continuous (piecewise-linear) — no gaps, and no global
 * distortion of the rest of the timeline. Matches the "Christ & Apostles" era.
 */
export const MAG_LO = -5;
export const MAG_HI = 50;
export const MAG = 20;
/** Extra px the magnified window adds beyond its natural linear width. */
export const MAG_EXTRA = (MAG - 1) * (MAG_HI - MAG_LO) * PX_PER_YEAR;

/** World width for the axis (layout.worldW may extend it slightly to contain
 *  minimum-gap nudging at the far right edge). */
export const WORLD_W =
  AXIS_X0 + (YEAR_MAX - YEAR_MIN) * PX_PER_YEAR + MAG_EXTRA + 80;
export const WORLD_H = 1000;
export const CY = WORLD_H / 2;

export const S_MIN = 0.28;
export const S_MAX = 6;
/** Below this scale nodes render as density dots and era labels dominate. */
export const LOD_DOTS = 0.5;
/** At or above this scale nodes carry name + date labels. */
export const LOD_LABELS = 0.95;

export const FIGURE_R = 30;
export const EVENT_R = 26;
export const TEXT_R = 27;

export function yearToX(year: number): number {
  // Piecewise-linear: normal scale before the window, MAG× inside it, normal
  // again after (offset by the extra width the window added). Continuous.
  const before = (Math.min(year, MAG_LO) - YEAR_MIN) * PX_PER_YEAR;
  const inWindow =
    Math.max(0, Math.min(year, MAG_HI) - MAG_LO) * PX_PER_YEAR * MAG;
  const after = Math.max(0, year - MAG_HI) * PX_PER_YEAR;
  return AXIS_X0 + before + inWindow + after;
}

export interface Era {
  label: string;
  from: number; // signed year
  to: number;
}

export const ERAS: Era[] = [
  { label: "Patriarchs", from: -2150, to: -1600 },
  { label: "Exodus & Law", from: -1600, to: -1200 },
  { label: "Judges", from: -1200, to: -1050 },
  { label: "Kings & Prophets", from: -1050, to: -586 },
  { label: "Exile & Return", from: -586, to: -400 },
  { label: "Between the Testaments", from: -400, to: -5 },
  { label: "Christ & Apostles", from: -5, to: 100 },
  { label: "Early Church", from: 100, to: 325 },
  { label: "Councils & Christendom", from: 325, to: 1054 },
  { label: "Medieval Church", from: 1054, to: 1517 },
  { label: "Reformation", from: 1517, to: 1700 },
];

/** Gentle vertical drift of the gold thread; fixed wavelength, independent of
 *  the (now variable) world width. */
export function threadY(x: number): number {
  // A gentle, graceful wave — small enough amplitude to stay in the clear
  // central gutter (scattered nodes live at |Δy| ≥ ~130 from CY), long enough
  // period to read as a languid swell rather than a busy ripple.
  // Rounded to sub-pixel so the value is byte-identical between server render
  // and client hydration (Math.sin can differ by 1 ULP across JS engines).
  return Math.round((CY + 38 * Math.sin((x / 2200) * Math.PI * 2 + 0.6)) * 1000) / 1000;
}

export interface NodePos {
  x: number;
  y: number;
}

function isPromiseNode(e: Entry, promiseIds: Set<string>): boolean {
  return promiseIds.has(e.id);
}

export interface CanvasLayout {
  positions: Map<string, NodePos>;
  /** Linear year→x mapping (identical to yearToX). Ticks and era bands read
   *  from this, so they stay strictly to-scale. */
  axisX: (year: number) => number;
  worldW: number;
}

/** Deterministic pseudo-random in [-0.5, 0.5) from an id. Used to jitter each
 *  node off its exact band/tick so clusters read as an organic scatter — an
 *  illuminated page — rather than a rigid grid. Stable across renders. */
function jitter(id: string, salt: number): number {
  let h = (2166136261 ^ salt) >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000 - 0.5;
}

/**
 * Deterministic layout on a strictly linear (to-scale) time axis. Promise-chain
 * nodes ride the gold thread; undated entries occupy the fixed beginnings zone;
 * every other dated node fans across vertical bands, then is nudged off the
 * exact band centre by a small per-id jitter so the canvas reads as a hand-set
 * page, not a grid. Dense clusters spread vertically, never by distorting time.
 */
export function buildCanvasLayout(
  entries: Entry[],
  promiseIds: Set<string>
): CanvasLayout {
  const pos = new Map<string, NodePos>();

  // Beginnings zone (undated): fixed region, promise nodes on the thread, the
  // rest fanned across four bands in data-file (story) order.
  const undated = entries.filter((e) => e.undated);
  const beginningsBands = [-255, -120, 135, 255];
  let bc = 0;
  undated.forEach((e, i) => {
    const bx = 120 + i * ((BEGINNINGS_W - 250) / Math.max(1, undated.length - 1));
    if (isPromiseNode(e, promiseIds)) {
      pos.set(e.id, { x: bx, y: threadY(bx) });
    } else {
      const x = bx + jitter(e.id, 1) * 66;
      const y = CY + beginningsBands[bc++ % beginningsBands.length] + jitter(e.id, 2) * 46;
      pos.set(e.id, { x, y });
    }
  });

  const dated = entries
    .filter((e) => !e.undated)
    .sort((a, b) => a.yearStart! - b.yearStart!);

  // Thread (line-of-promise) nodes ride the gold spine, with a minimum
  // horizontal gap so consecutive generations don't pile up. Everything else
  // fans across vertical bands — nearest the spine first, each node to the band
  // with the most horizontal clearance, with a within-band minimum gap. Nodes
  // otherwise sit at their true, to-scale year position; the axis is not warped.
  const MIN_THREAD_GAP = 118;
  let lastThreadX = -Infinity;
  // Bands near the spine serve the ordinary spread; the farther bands give the
  // densest generations (Life of Christ, and the apostolic age — a whole
  // founding generation gathered in a few decades) the extra rows they need so
  // nothing overlaps. Sparse eras never reach the outer bands.
  const datedBands = [
    -150, 150, -250, 250, -350, 350, -450, 450, -550, 550, -650, 650, -750, 750,
  ];
  const lastXByBand: number[] = datedBands.map(() => -Infinity);
  const MIN_BAND_GAP = 145;
  let maxX = AXIS_X0;

  for (const e of dated) {
    const trueX = yearToX(e.yearStart!);
    if (isPromiseNode(e, promiseIds)) {
      // Thread nodes ride the spine exactly (no jitter) so the gold line stays
      // smooth and unbroken through them.
      const x = Math.max(trueX, lastThreadX + MIN_THREAD_GAP);
      lastThreadX = x;
      pos.set(e.id, { x, y: threadY(x) });
      maxX = Math.max(maxX, x);
      continue;
    }
    // Per-id pseudo-random band preference (lightly biased toward the spine)
    // rather than strict nearest-first — so a cluster scatters instead of
    // forming a tidy symmetric arc. Take the first preferred band that's clear;
    // if a dense cluster has filled them all, take the one with the most room.
    const order = datedBands.map((_, b) => b);
    order.sort(
      (a, b) => a + jitter(e.id, 200 + a) * 11 - (b + jitter(e.id, 200 + b) * 11)
    );
    let best = -1;
    for (const b of order) {
      if (trueX - lastXByBand[b] >= MIN_BAND_GAP) {
        best = b;
        break;
      }
    }
    if (best === -1) {
      best = order[0];
      for (const b of order) {
        if (trueX - lastXByBand[b] > trueX - lastXByBand[best]) best = b;
      }
    }
    const baseX = Math.max(trueX, lastXByBand[best] + MIN_BAND_GAP);
    lastXByBand[best] = baseX;
    // Scatter well off the exact band centre — a hand-set, illuminated-page
    // feel. Wide horizontal jitter (the within-band gaps have room); vertical
    // jitter is kept in check so densely-packed bands don't collide.
    const x = baseX + jitter(e.id, 1) * 84;
    const y = CY + datedBands[best] + jitter(e.id, 2) * 42;
    pos.set(e.id, { x, y });
    maxX = Math.max(maxX, baseX);
  }

  // Strictly linear, to-scale axis: ticks and era bands sit at their true year.
  const axisX = (year: number): number => yearToX(year);
  const worldW = Math.max(WORLD_W, maxX + 120);
  return { positions: pos, axisX, worldW };
}

/** Catmull-Rom spline through the promise nodes, extended to both canvas edges. */
export function promisePathD(
  chain: Entry[],
  pos: Map<string, NodePos>,
  worldW: number
): { main: string; continuation: string } {
  const pts = chain
    .map((e) => pos.get(e.id))
    .filter((p): p is NodePos => !!p);
  if (pts.length < 2) return { main: "", continuation: "" };
  const last = pts[pts.length - 1];

  // The thread is the analytic wave itself (threadY), sampled finely — NOT a
  // spline chased through the bead positions. Chasing the beads made the line
  // overshoot into loops and lurch into sharp V-dips; sampling threadY gives a
  // mathematically smooth swell that can never kink. Every bead is placed at
  // exactly threadY(x), so the wave glides cleanly through each medallion.
  const STEP = 14;
  const wave = (from: number, to: number): string => {
    let s = `M ${from.toFixed(1)} ${threadY(from).toFixed(2)}`;
    for (let x = from + STEP; x < to; x += STEP) {
      s += ` L ${x.toFixed(1)} ${threadY(x).toFixed(2)}`;
    }
    s += ` L ${to.toFixed(1)} ${threadY(to).toFixed(2)}`;
    return s;
  };

  const main = wave(20, last.x);
  // After Christ the thread runs on, quiet and thin, to the canvas edge —
  // the promise carried into the church age.
  const contD = wave(last.x, worldW - 20);
  return { main, continuation: contD };
}

export interface EdgeStyle {
  stroke: string; // CSS variable reference
  width: number;
  dash?: string;
  label: string;
}

export const EDGE_STYLES: Record<RelationType, EdgeStyle> = {
  "line-of-promise": { stroke: "var(--gold)", width: 3.5, label: "line of promise" },
  "prophet-to-king": { stroke: "var(--lapis)", width: 2, dash: "7 4", label: "prophet to king" },
  "teacher-to-disciple": { stroke: "var(--lapis)", width: 2, label: "teacher to disciple" },
  anointed: { stroke: "var(--gold)", width: 2, dash: "2 5", label: "anointed" },
  succeeded: { stroke: "var(--lapis)", width: 1.8, dash: "1 4", label: "succeeded" },
  influenced: { stroke: "var(--ink-soft)", width: 1.8, dash: "9 5", label: "influenced" },
  opposed: { stroke: "var(--crimson)", width: 1.8, dash: "4 4", label: "opposed" },
  "split-from": { stroke: "var(--crimson)", width: 2.5, label: "split from" },
  covenant: { stroke: "var(--gold)", width: 2, dash: "10 4", label: "covenant" },
  contemporary: { stroke: "var(--ink-soft)", width: 1.4, dash: "1 5", label: "contemporary" },
  // A text and the era/figure it narrates — a quiet tether from the book
  // (placed where it was written) back to its setting on the axis.
  describes: { stroke: "var(--ink-soft)", width: 1.1, dash: "1 8", label: "describes" },
};

export interface CanvasEdge {
  sourceId: string;
  targetId: string;
  type: RelationType;
  d: string;
}

/** Curved connector; parallel edges between the same pair bow apart. */
export function buildEdges(
  entries: Entry[],
  pos: Map<string, NodePos>
): CanvasEdge[] {
  const pairCount = new Map<string, number>();
  const edges: CanvasEdge[] = [];
  for (const e of entries) {
    for (const r of e.relationships ?? []) {
      if (r.type === "line-of-promise") continue; // drawn as the thread
      const a = pos.get(e.id);
      const b = pos.get(r.targetId);
      if (!a || !b) continue;
      const key = [e.id, r.targetId].sort().join("~");
      const n = pairCount.get(key) ?? 0;
      pairCount.set(key, n + 1);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      // Perpendicular bow: base curve plus extra separation per parallel edge.
      const bow = Math.min(90, len * 0.18) + n * 26;
      const cx = mx - (dy / len) * bow;
      const cyy = my + (dx / len) * bow;
      // Round every coordinate to a fixed precision before it enters the `d`
      // string. Math.hypot / division diverge in the last floating-point digit
      // between JS engines (V8 on the server vs JavaScriptCore on iOS Safari),
      // which otherwise produces a full-tree SVG hydration mismatch on iOS.
      // Same guard as promisePathD and the IntroLoader sunburst.
      const f = (n: number) => n.toFixed(2);
      edges.push({
        sourceId: e.id,
        targetId: r.targetId,
        type: r.type,
        d: `M ${f(a.x)} ${f(a.y)} Q ${f(cx)} ${f(cyy)} ${f(b.x)} ${f(b.y)}`,
      });
    }
  }
  return edges;
}

/** Dated figures whose lifespans overlap the given entry's span. */
export function contemporariesOf(entry: Entry, entries: Entry[]): Entry[] {
  if (entry.undated || entry.yearStart === undefined) return [];
  const a1 = entry.yearStart;
  const a2 = entry.yearEnd ?? entry.yearStart;
  return entries.filter((e) => {
    if (e.id === entry.id || e.undated || e.yearStart === undefined) return false;
    if (e.type !== "figure") return false;
    const b1 = e.yearStart;
    const b2 = e.yearEnd ?? e.yearStart;
    return a1 <= b2 && b1 <= a2;
  });
}
