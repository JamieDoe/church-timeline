import { geoMercator } from "d3-geo";
import landData from "@/data/geo/land.json";
import borderData from "@/data/geo/borders.json";

/**
 * Shared basemap projection for the map. Natural Earth 50m coastlines (public
 * domain, land only — no political borders), clipped to a window a little larger
 * than the visible frame and simplified (see data/geo/land.json).
 *
 * A gently-tuned Mercator, fit to the window. Mercator is *separable* — x is a
 * function of longitude alone, y of latitude alone — which lets the map keep its
 * lightweight `px(lng)`/`py(lat)` call sites while every pin, route, label, and
 * the coastline itself flow through this one projection, so they always agree.
 * The modern coastline is an accepted approximation (a few ancient sites — e.g.
 * Ephesus — have since silted inland); the map's disclaimer covers it.
 */

// The framed window in [lng, lat]; the land data is clipped a touch beyond this,
// so the coastline runs off the edges and the map card's overflow does the
// visible clipping (no stroked border around the frame).
const WIN_LNG: [number, number] = [-12, 52];
const WIN_LAT: [number, number] = [19, 58];
const MARGIN = 6;

export const MAP_W = 1000;

// Fit from the window's projected corners directly (fitting via geoPath.bounds
// densifies the rectangle's edges as geodesics and bulges the box).
const projection = geoMercator().scale(1).translate([0, 0]);
const [tlx, tly] = projection([WIN_LNG[0], WIN_LAT[1]])!; // top-left  (minLng, maxLat)
const [brx, bry] = projection([WIN_LNG[1], WIN_LAT[0]])!; // bot-right (maxLng, minLat)
const scale = (MAP_W - 2 * MARGIN) / (brx - tlx);
export const MAP_H = Math.round((bry - tly) * scale + 2 * MARGIN);

projection.scale(scale);
const [ox, oy] = projection([WIN_LNG[0], WIN_LAT[1]])!;
projection.translate([MARGIN - ox, MARGIN - oy]);

// Round to 2dp so server- and client-rendered coordinates stringify identically
// (raw projection floats can differ by 1 ULP across evaluations → a hydration
// mismatch). 0.01px in a 1000px design space is far below anything visible.
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Project [lng, lat] → [x, y] in the fixed design space. */
export function project(lng: number, lat: number): [number, number] {
  const p = projection([lng, lat]) ?? [0, 0];
  return [r2(p[0]), r2(p[1])];
}

// Build the coastline path by projecting each vertex and joining with straight
// segments — NOT geoPath, whose geodesic resampling bulges the data's straight
// clip-edges off to infinity and floods the frame. The 50m vertices are dense,
// so straight segments read as true coastline; the clip-edges become plain
// straight lines that fall outside the frame and are clipped by the card.
const geometry = (landData as { geometries: { coordinates: number[][][][] }[] }).geometries[0];

let path = "";
for (const polygon of geometry.coordinates) {
  for (const ring of polygon) {
    for (let i = 0; i < ring.length; i++) {
      const [x, y] = project(ring[i][0], ring[i][1]);
      path += `${i ? "L" : "M"}${x} ${y}`;
    }
    path += "Z";
  }
}

/** The coastline as one SVG path in the design space (land polygons). */
export const landPath = path;

// Modern country borders — the *inner* boundaries only (shared borders between
// countries, not coastlines, which the land layer already draws). Natural Earth
// 50m via world-atlas, extracted with mapshaper -innerlines. Open polylines, so
// no closing "Z". Projected the same way as the coastline.
// -innerlines emits a mix of LineString and MultiLineString, so normalise each
// geometry to an array of polylines before projecting (a stray nested array
// would project to NaN and halt the whole SVG path).
const borderGeoms = (
  borderData as { geometries: { type: string; coordinates: number[][] | number[][][] }[] }
).geometries;
let bpath = "";
for (const geom of borderGeoms) {
  const lines: number[][][] =
    geom.type === "MultiLineString"
      ? (geom.coordinates as number[][][])
      : [geom.coordinates as number[][]];
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      const [x, y] = project(line[i][0], line[i][1]);
      bpath += `${i ? "L" : "M"}${x} ${y}`;
    }
  }
}

/** Country borders as one SVG path in the design space (inner boundaries). */
export const bordersPath = bpath;
