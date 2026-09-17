"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CertaintyBadge } from "@/components/badges";
import { EmblemGlyph, sealPathD } from "@/components/emblems";
import type { Entry, Journey, Layer } from "@/lib/types";
import { project, MAP_W, MAP_H, landPath, bordersPath } from "@/lib/map-geo";
import { cn } from "@/lib/utils";

/**
 * A stylized parchment chart of the Mediterranean world — full-screen and
 * interactive. The coastline is deliberately simplified (hand-drawn spirit,
 * labelled as such); plotting uses a plain equirectangular projection into a
 * fixed 1000×640 design space that the view transform fits to the viewport.
 *
 * Scroll to zoom, drag to pan (canvas-style click-vs-drag), nearby pins gather
 * into illuminated cluster seals when zoomed out, and a pin is a PLACE —
 * clicking it opens a panel of every entry there. A time scrubber plays the
 * story's migration; a journeys mode inks the great routes (traditional/
 * contested, never as settled fact). Undated beginnings carry no year.
 */

const W = MAP_W;
const H = MAP_H;
const S_MAX = 12;
const CLICK_SLOP_PX = 5;

// Every point flows through the one shared d3 projection (see lib/map-geo).
// Mercator is separable — x depends only on lng, y only on lat — so these stay
// simple and the coastline, pins, routes, and labels all land in agreement.
function px(lng: number): number {
  return project(lng, 35)[0];
}
function py(lat: number): number {
  return project(0, lat)[1];
}

function toPath(pts: [number, number][], close = true): string {
  return (
    pts
      .map(([lng, lat], i) => `${i ? "L" : "M"} ${px(lng).toFixed(1)} ${py(lat).toFixed(1)}`)
      .join(" ") + (close ? " Z" : "")
  );
}

// Lakes too small to survive in the 50m coastline — drawn as blue water.
const LAKES: [number, number][][] = [
  // Sea of Galilee
  [[35.55, 32.90], [35.62, 32.88], [35.65, 32.82], [35.62, 32.75], [35.55, 32.74], [35.52, 32.80], [35.53, 32.86]],
  // Dead Sea
  [[35.48, 31.76], [35.53, 31.70], [35.55, 31.55], [35.52, 31.40], [35.48, 31.30], [35.45, 31.45], [35.44, 31.62], [35.46, 31.72]],
];

// Land labels: ancient name, and — for orientation — the modern country. `z`
// gates the fine Levant lands to zoomed-in views; `size` overrides the default.
const LANDS: { anc: string; mod: string; at: [number, number]; z?: number; size?: number }[] = [
  { anc: "Britannia", mod: "Britain", at: [-2.6, 53.4] },
  { anc: "Gallia", mod: "France", at: [2.4, 47.3] },
  { anc: "Germania", mod: "Germany", at: [10.0, 51.2] },
  { anc: "Hispania", mod: "Spain", at: [-4.2, 39.9] },
  { anc: "Italia", mod: "Italy", at: [13.6, 42.5] },
  { anc: "Illyricum", mod: "the Balkans", at: [18.6, 44.6] },
  { anc: "Thracia", mod: "Bulgaria", at: [25.7, 42.1] },
  { anc: "Macedonia", mod: "N. Greece", at: [22.0, 41.0] },
  { anc: "Achaia", mod: "Greece", at: [22.6, 38.5] },
  { anc: "Asia Minor", mod: "Turkey", at: [32.6, 39.2] },
  { anc: "Syria", mod: "Syria", at: [38.2, 34.9] },
  { anc: "Mesopotamia", mod: "Iraq", at: [43.6, 34.6] },
  { anc: "Persia", mod: "Iran", at: [48.7, 31.4] },
  { anc: "Arabia", mod: "Jordan & Arabia", at: [39.8, 28.3] },
  { anc: "Aegyptus", mod: "Egypt", at: [29.6, 27.0] },
  { anc: "Cyrenaica", mod: "Libya", at: [20.5, 29.7] },
  { anc: "Africa", mod: "Tunisia", at: [9.7, 34.7] },
  { anc: "Numidia", mod: "Algeria", at: [4.0, 34.2] },
  { anc: "Mauretania", mod: "Morocco", at: [-6.2, 32.4] },
  { anc: "Phoenicia", mod: "Lebanon", at: [35.7, 33.75], z: 2.4, size: 11 },
  { anc: "Galilee", mod: "", at: [35.35, 32.85], z: 3.2, size: 10 },
  { anc: "Samaria", mod: "", at: [35.08, 32.2], z: 3.2, size: 10 },
  { anc: "Judea", mod: "Israel / Palestine", at: [34.95, 31.55], z: 2.4, size: 11 },
];

const LAYERS: { id: Layer; label: string }[] = [
  { id: "scripture", label: "Scripture" },
  { id: "people", label: "People" },
  { id: "church", label: "Church" },
];

function baseName(name: string): string {
  return name.replace(/\s*\(.*\)$/, "");
}
function formatYear(y: number): string {
  return y < 0 ? `${-y} BC` : `AD ${y}`;
}

interface Place {
  key: string;
  name: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  entries: Entry[];
}

function buildPlaces(entries: Entry[]): Place[] {
  const places: Place[] = [];
  for (const e of entries) {
    const { lat, lng } = e.location!;
    const near = places.find(
      (p) => Math.abs(p.lat - lat) < 0.035 && Math.abs(p.lng - lng) < 0.035
    );
    if (near) near.entries.push(e);
    else
      places.push({
        key: `${lat.toFixed(3)},${lng.toFixed(3)}`,
        name: "",
        lat,
        lng,
        x: px(lng),
        y: py(lat),
        entries: [e],
      });
  }
  for (const p of places) {
    const counts = new Map<string, number>();
    for (const e of p.entries) {
      const n = baseName(e.location!.name);
      counts.set(n, (counts.get(n) ?? 0) + 1);
    }
    p.name = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    p.entries.sort((a, b) => (a.yearStart ?? -Infinity) - (b.yearStart ?? -Infinity));
  }
  return places;
}

interface View {
  x: number;
  y: number;
  s: number;
}

export function HolyLandMap({
  entries,
  journeys = [],
}: {
  entries: Entry[];
  journeys?: Journey[];
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [size, setSize] = useState({ w: 1200, h: 700 });
  const [view, setView] = useState<View>({ x: 0, y: 0, s: 1 });
  const viewRef = useRef(view);
  viewRef.current = view;

  const [layersOn, setLayersOn] = useState<Record<Layer, boolean>>({
    scripture: true,
    people: true,
    church: true,
  });
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [hoverPlace, setHoverPlace] = useState<string | null>(null);

  // ----- journeys -----
  const [journeysOpen, setJourneysOpen] = useState(false);
  const [activeJourney, setActiveJourney] = useState<string | null>(null);
  const [hoverStop, setHoverStop] = useState<number | null>(null);

  // ----- time scrubber -----
  const located = useMemo(
    () => entries.filter((e) => e.location && !e.undated),
    [entries]
  );
  const YEAR_MIN = useMemo(
    () => (located.length ? Math.floor(Math.min(...located.map((e) => e.yearStart!)) / 100) * 100 : -2000),
    [located]
  );
  const YEAR_MAX = 1700;
  const [year, setYear] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<number | null>(null);
  const yearRef = useRef<number>(YEAR_MIN);

  const stopPlay = useCallback(() => {
    setPlaying(false);
    if (playRef.current) cancelAnimationFrame(playRef.current);
    playRef.current = null;
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) {
      stopPlay();
      return;
    }
    setPlaying(true);
    yearRef.current = year === null || year >= YEAR_MAX ? YEAR_MIN : year;
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      yearRef.current = Math.min(YEAR_MAX, yearRef.current + dt * 0.14);
      setYear(Math.round(yearRef.current));
      if (yearRef.current >= YEAR_MAX) {
        setPlaying(false);
        playRef.current = null;
        return;
      }
      playRef.current = requestAnimationFrame(step);
    };
    playRef.current = requestAnimationFrame(step);
  }, [playing, year, YEAR_MIN, stopPlay]);

  useEffect(() => () => stopPlay(), [stopPlay]);

  const entryOpacity = useCallback(
    (e: Entry): number => {
      if (year === null) return 1;
      if (e.undated || e.yearStart === undefined) return 0;
      const start = e.yearStart;
      const end = e.yearEnd ?? e.yearStart;
      if (year < start - 20) return 0;
      if (year < start) return (year - (start - 20)) / 20;
      if (year <= end + 60) return 1;
      if (year <= end + 320) return 1 - (0.82 * (year - end - 60)) / 260;
      return 0.18;
    },
    [year]
  );

  // ----- places, filtered by layer toggles -----
  const shown = useMemo(
    () => located.filter((e) => e.layers.some((l) => layersOn[l])),
    [located, layersOn]
  );
  const places = useMemo(() => buildPlaces(shown), [shown]);
  const placeByKey = useMemo(() => new Map(places.map((p) => [p.key, p])), [places]);
  const placeByName = useMemo(() => {
    const m = new Map<string, Place>();
    for (const p of buildPlaces(located)) if (!m.has(p.name)) m.set(p.name, p);
    return m;
  }, [located]);

  const journeyOn = journeysOpen && activeJourney;
  const journey = journeys.find((j) => j.id === activeJourney) ?? null;

  // Resolve a journey's ordered points to design-space coordinates.
  const journeyPts = useMemo(() => {
    if (!journey) return [];
    return journey.points.map((p) => {
      let lat = p.lat,
        lng = p.lng;
      if (lat == null || lng == null) {
        const place = placeByName.get(baseName(p.placeName));
        if (place) {
          lat = place.lat;
          lng = place.lng;
        }
      }
      return { ...p, x: px(lng ?? 0), y: py(lat ?? 0), lat, lng };
    });
  }, [journey, placeByName]);

  // ----- clustering (screen-space, zoom-dependent) -----
  interface Cluster {
    x: number;
    y: number;
    places: Place[];
    count: number;
  }
  const clusters = useMemo<Cluster[]>(() => {
    const CLUSTER_R = Math.max(13, 56 / Math.max(1, view.s / 2.2));
    const pool = [...places]
      .map((p) => ({ p, op: Math.max(...p.entries.map(entryOpacity)) }))
      .filter(({ op }) => op > 0)
      .sort((a, b) => b.p.entries.length - a.p.entries.length)
      .map(({ p }) => p);
    const out: Cluster[] = [];
    const claimed = new Set<string>();
    for (const p of pool) {
      if (claimed.has(p.key)) continue;
      const members = pool.filter(
        (q) =>
          !claimed.has(q.key) &&
          Math.hypot((p.x - q.x) * view.s, (p.y - q.y) * view.s) < CLUSTER_R
      );
      for (const m of members) claimed.add(m.key);
      const n = members.reduce((acc, m) => acc + m.entries.length, 0);
      out.push({
        x: members.reduce((acc, m) => acc + m.x * m.entries.length, 0) / n,
        y: members.reduce((acc, m) => acc + m.y * m.entries.length, 0) / n,
        places: members,
        count: n,
      });
    }
    return out;
  }, [places, view.s, entryOpacity]);

  // ----- sizing + fit-to-viewport (canvas discipline) -----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Minimum zoom = COVER the viewport: the chart always fills edge-to-edge, so
  // you can never pull back to reveal blank parchment beyond its boundaries.
  const minS = Math.max(size.w / W, size.h / H);
  const clampView = useCallback(
    (v: View): View => {
      const s = Math.max(minS, Math.min(S_MAX, v.s));
      const x = Math.min(0, Math.max(size.w - W * s, v.x));
      const y = Math.min(0, Math.max(size.h - H * s, v.y));
      return { s, x, y };
    },
    [minS, size]
  );
  const interacted = useRef(false);
  useEffect(() => {
    if (interacted.current || !size.w) return;
    setView(clampView({ x: (size.w - W * minS) / 2, y: (size.h - H * minS) / 2, s: minS }));
  }, [size, minS, clampView]);

  // ----- fullscreen -----
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrapRef.current?.requestFullscreen?.();
  };

  // ----- zoom / pan / click-vs-drag -----
  const dragDist = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const wasClick = () => dragDist.current < CLICK_SLOP_PX;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      interacted.current = true;
      const delta = ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY;
      const factor = Math.exp(-delta * 0.0016);
      const rect = svg.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      setView((v) => {
        const s = Math.min(S_MAX, Math.max(minS, v.s * factor));
        const k = s / v.s;
        return clampView({ s, x: mx - (mx - v.x) * k, y: my - (my - v.y) * k });
      });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [minS, clampView]);

  const onPointerDown = (ev: React.PointerEvent<SVGSVGElement>) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    pointers.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pointers.current.size === 1) dragDist.current = 0;

    const move = (me: PointerEvent) => {
      const prev = pointers.current.get(me.pointerId);
      if (!prev) return;
      const cur = { x: me.clientX, y: me.clientY };
      if (pointers.current.size === 1) {
        const dx = cur.x - prev.x;
        const dy = cur.y - prev.y;
        dragDist.current += Math.hypot(dx, dy);
        if (dragDist.current > CLICK_SLOP_PX) interacted.current = true;
        setView((v) => clampView({ ...v, x: v.x + dx, y: v.y + dy }));
      } else if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.entries()];
        const other = a[0] === me.pointerId ? b : a;
        const d0 = Math.hypot(prev.x - other[1].x, prev.y - other[1].y);
        const d1 = Math.hypot(cur.x - other[1].x, cur.y - other[1].y);
        dragDist.current += 10;
        interacted.current = true;
        const rect = svgRef.current!.getBoundingClientRect();
        const cx = (cur.x + other[1].x) / 2 - rect.left;
        const cyy = (cur.y + other[1].y) / 2 - rect.top;
        setView((v) => {
          const s = Math.min(S_MAX, Math.max(minS, (v.s * d1) / (d0 || 1)));
          const k = s / v.s;
          return clampView({ s, x: cx - (cx - v.x) * k, y: cyy - (cyy - v.y) * k });
        });
      }
      pointers.current.set(me.pointerId, cur);
    };
    const up = (ue: PointerEvent) => {
      pointers.current.delete(ue.pointerId);
      if (pointers.current.size === 0) {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  // ----- fly-to -----
  const animRef = useRef<number | null>(null);
  const flyToBox = useCallback(
    (minX: number, minY: number, maxX: number, maxY: number, pad = 90) => {
      interacted.current = true;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const bw = Math.max(40, maxX - minX);
      const bh = Math.max(40, maxY - minY);
      const targetS = Math.min(
        S_MAX,
        Math.max(minS, Math.min((size.w - pad * 2) / bw, (size.h - pad * 2) / bh))
      );
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const from = { ...viewRef.current };
      const to = { s: targetS, x: size.w / 2 - cx * targetS, y: size.h / 2 - cy * targetS };
      const t0 = performance.now();
      const dur = 700;
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const k = ease(t);
        setView(
          clampView({
            x: from.x + (to.x - from.x) * k,
            y: from.y + (to.y - from.y) * k,
            s: from.s + (to.s - from.s) * k,
          })
        );
        if (t < 1) animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    },
    [minS, size, clampView]
  );
  const selectJourney = useCallback(
    (id: string | null) => {
      setActiveJourney(id);
      setSelectedPlace(null);
      const j = journeys.find((jj) => jj.id === id);
      if (!j) return;
      const pts = j.points.map((p) => {
        let lat = p.lat,
          lng = p.lng;
        if (lat == null || lng == null) {
          const place = placeByName.get(baseName(p.placeName));
          if (place) {
            lat = place.lat;
            lng = place.lng;
          }
        }
        return { x: px(lng ?? 0), y: py(lat ?? 0) };
      });
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      flyToBox(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
    },
    [journeys, placeByName, flyToBox]
  );

  // ----- deep link: /map?entry=<id> -----
  const didDeepLink = useRef(false);
  useEffect(() => {
    if (didDeepLink.current || !size.w) return;
    didDeepLink.current = true;
    const id = new URLSearchParams(window.location.search).get("entry");
    if (!id) return;
    const place = places.find((p) => p.entries.some((e) => e.id === id));
    if (place) {
      setSelectedPlace(place.key);
      flyToBox(place.x - 30, place.y - 30, place.x + 30, place.y + 30, 220);
    }
  }, [places, flyToBox, size.w]);

  const selected = selectedPlace ? placeByKey.get(selectedPlace) : null;
  const hovered = hoverPlace && hoverPlace !== selectedPlace ? placeByKey.get(hoverPlace) : null;

  const layerTint = (p: Place): string => {
    const counts: Record<string, number> = {};
    for (const e of p.entries) counts[e.layers[0]] = (counts[e.layers[0]] ?? 0) + 1;
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return `var(--layer-${dominant})`;
  };
  const arrivedCount = (p: Place): number =>
    year === null ? p.entries.length : p.entries.filter((e) => (e.yearStart ?? Infinity) <= year).length;

  const toScreen = (dx: number, dy: number) => ({
    left: dx * view.s + view.x,
    top: dy * view.s + view.y,
  });

  // Smoothed route path through the journey's points (hand-drawn feel).
  const routeD = useMemo(() => {
    if (journeyPts.length < 2) return "";
    const p = journeyPts;
    let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i];
      const b = p[i + 1];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      // gentle bow perpendicular to the segment
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const bow = Math.min(26, len * 0.12);
      d += ` Q ${(mx - (dy / len) * bow).toFixed(1)} ${(my + (dx / len) * bow).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    return d;
  }, [journeyPts]);

  // Contested routes glow crimson (a caution), the rest gold — an at-a-glance
  // cue backing the badge and note.
  const routeGlow = journey?.certainty === "contested" ? "var(--crimson)" : "var(--thread-glow)";

  return (
    <div
      ref={wrapRef}
      className={cn("select-none", fullscreen ? "flex h-screen flex-col bg-background p-3" : "mt-5")}
    >
      {/* Toolbar */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayersOn((prev) => ({ ...prev, [l.id]: !prev[l.id] }))}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              layersOn[l.id]
                ? "border-border bg-card/85 text-foreground"
                : "border-transparent bg-muted/50 text-muted-foreground line-through"
            )}
          >
            <span className="size-2 rounded-full" style={{ background: `var(--layer-${l.id})` }} />
            {l.label}
          </button>
        ))}
        <button
          onClick={() => {
            setJourneysOpen((o) => !o);
            if (journeysOpen) setActiveJourney(null);
          }}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            journeysOpen ? "border-gold bg-gold/15 text-foreground" : "border-border bg-card/85 text-muted-foreground hover:text-foreground"
          )}
        >
          ✦ Journeys
        </button>
        <span className="ml-auto hidden text-xs italic text-muted-foreground sm:inline">
          scroll to zoom · drag to pan
        </span>
        <button
          onClick={() => {
            interacted.current = true;
            setView(clampView({ x: (size.w - W * minS) / 2, y: (size.h - H * minS) / 2, s: minS }));
            setSelectedPlace(null);
          }}
          className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Whole chart
        </button>
        <button
          onClick={toggleFullscreen}
          className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {fullscreen ? "Exit fullscreen" : "⛶ Fullscreen"}
        </button>
      </div>

      {/* Chart card */}
      <div
        ref={containerRef}
        className={cn(
          "relative w-full overflow-hidden rounded-lg border border-border bg-card/60",
          fullscreen ? "min-h-0 flex-1" : "aspect-[1000/818]"
        )}
      >
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onClick={() => {
          if (wasClick()) setSelectedPlace(null);
        }}
        role="application"
        aria-label="Interactive manuscript map of the Mediterranean world. Drag to pan, scroll to zoom, click a place for its entries."
      >
        <defs>
          {/* A whisper of roughen so the coast reads as hand-inked, not surveyed. */}
          <filter id="coast-ink" x="-3%" y="-3%" width="106%" height="106%">
            <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={2} seed={11} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={2.6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g transform={`translate(${view.x} ${view.y}) scale(${view.s})`}>
          {/* Sea — the whole surface reads as water; land sits on top */}
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="color-mix(in oklab, var(--background), var(--lapis) 48%)" />

          {/* Coastline — Natural Earth 50m (land only, no political borders),
              projected through the shared d3 projection. Land is parchment, the
              coast is inked. The modern coastline is an accepted approximation
              (a few sites, e.g. Ephesus, have since silted inland). */}
          <path
            d={landPath}
            fill="color-mix(in oklch, var(--card), var(--gold) 16%)"
            stroke="var(--ink-soft)"
            strokeWidth={1.1 / view.s}
            strokeOpacity={0.7}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#coast-ink)"
          />

          {/* Lakes too small for the 50m coastline (Sea of Galilee, Dead Sea) */}
          {LAKES.map((lake, i) => (
            <path key={`lake-${i}`} d={toPath(lake)} fill="color-mix(in oklab, var(--background), var(--lapis) 48%)" stroke="var(--lapis)" strokeWidth={0.8 / view.s} strokeOpacity={0.5} strokeLinejoin="round" />
          ))}

          {/* Country borders — Natural Earth inner boundaries, drawn as a faint
              dotted reference overlay (modern borders, shown lightly). */}
          <path
            d={bordersPath}
            fill="none"
            stroke="var(--ink-soft)"
            strokeWidth={1 / view.s}
            strokeDasharray={`${2.6 / view.s} ${2 / view.s}`}
            strokeOpacity={0.72}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* The Great Sea */}
          <text x={px(19)} y={py(35)} fill="var(--lapis)" opacity="0.7" textAnchor="middle" style={{ fontFamily: "var(--font-eb-garamond)", fontStyle: "italic", fontSize: 20 / view.s, letterSpacing: "0.12em" }}>
            The Great Sea
          </text>
          <text x={px(19)} y={py(35) + 20 / view.s} fill="var(--lapis)" opacity="0.55" textAnchor="middle" style={{ fontFamily: "var(--font-eb-garamond)", fontStyle: "italic", fontSize: 12 / view.s }}>
            (Mediterranean)
          </text>

          {/* Ancient lands — floating labels (no bordered countries), with the
              modern country beneath for orientation */}
          <g>
            {LANDS.filter((l) => !l.z || view.s >= l.z).map((l) => {
              const anc = (l.size ?? 13) / view.s;
              return (
                <g key={l.anc} opacity={0.6} style={{ pointerEvents: "none" }}>
                  <text
                    x={px(l.at[0])}
                    y={py(l.at[1])}
                    textAnchor="middle"
                    fill="var(--ink-soft)"
                    style={{ fontFamily: "var(--font-eb-garamond)", fontStyle: "italic", fontSize: anc, letterSpacing: "0.12em" }}
                  >
                    {l.anc}
                  </text>
                  {l.mod && (
                    <text
                      x={px(l.at[0])}
                      y={py(l.at[1]) + anc * 0.95}
                      textAnchor="middle"
                      fill="var(--ink-soft)"
                      opacity={0.7}
                      style={{ fontFamily: "var(--font-geist-sans)", fontSize: anc * 0.6, letterSpacing: "0.16em", textTransform: "uppercase" }}
                    >
                      {l.mod}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Pins */}
          {clusters.map((c) => {
            const isCluster = c.places.length > 1;
            const place = c.places[0];
            const op = Math.max(...c.places.flatMap((p) => p.entries.map(entryOpacity)));
            if (op <= 0) return null;
            const dimmed = journeyOn ? op * 0.28 : op;
            const arrived = c.places.reduce((acc, p) => acc + arrivedCount(p), 0);
            const dominant = c.places.reduce((a, b) => (b.entries.length > a.entries.length ? b : a));
            const key = isCluster ? `cluster-${c.places.map((p) => p.key).join("|")}` : place.key;
            const tint = layerTint(dominant);
            const isSel = !isCluster && selectedPlace === place.key;
            const isHover = !isCluster && hoverPlace === place.key;
            const multi = !isCluster && place.entries.length > 1;
            const r = isCluster ? 13 + Math.min(6, c.places.length) : multi ? 10 + Math.min(5, place.entries.length * 0.6) : 6.5;
            const label = isCluster ? `${dominant.name} +${c.places.length - 1}` : place.name;
            return (
              <g
                key={key}
                transform={`translate(${c.x.toFixed(2)} ${c.y.toFixed(2)}) scale(${1 / view.s})`}
                opacity={dimmed}
                style={{ transition: "opacity 300ms", cursor: "pointer" }}
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (!wasClick()) return;
                  if (isCluster) {
                    flyToBox(
                      Math.min(...c.places.map((p) => p.x)) - 20,
                      Math.min(...c.places.map((p) => p.y)) - 20,
                      Math.max(...c.places.map((p) => p.x)) + 20,
                      Math.max(...c.places.map((p) => p.y)) + 20,
                      120
                    );
                  } else {
                    setSelectedPlace(isSel ? null : place.key);
                    setHoverPlace(null);
                  }
                }}
                onPointerEnter={() => !isCluster && setHoverPlace(place.key)}
                onPointerLeave={() => setHoverPlace(null)}
              >
                {isSel && <circle r={r + 5} fill="none" stroke="var(--gold)" strokeWidth={2} opacity={0.9} />}
                {isCluster ? (
                  <>
                    <circle r={r} fill="var(--card)" stroke={tint} strokeWidth={2} />
                    <circle r={r - 3.5} fill="none" stroke="var(--gold)" strokeWidth={0.9} opacity={0.7} />
                    <text y={4} textAnchor="middle" fill="var(--ink)" style={{ fontFamily: "var(--font-eb-garamond)", fontSize: 12, fontWeight: 700 }}>
                      {arrived}
                    </text>
                  </>
                ) : multi ? (
                  <>
                    <path d={sealPathD(r)} fill="var(--card)" stroke={tint} strokeWidth={1.8} />
                    <text y={3.8} textAnchor="middle" fill="var(--ink)" style={{ fontFamily: "var(--font-eb-garamond)", fontSize: 11, fontWeight: 700 }}>
                      {arrived}
                    </text>
                  </>
                ) : (
                  <>
                    <circle r={r} fill="var(--card)" stroke={tint} strokeWidth={1.6} />
                    <circle r={2.2} fill="var(--gold)" stroke="none" />
                  </>
                )}
                {!journeyOn && (
                  <text
                    x={r + 5}
                    y={4}
                    fill="var(--ink)"
                    stroke="var(--background)"
                    strokeWidth={3}
                    paintOrder="stroke"
                    style={{ fontFamily: "var(--font-eb-garamond)", fontSize: 13.5, fontWeight: isHover || isSel ? 700 : 500 }}
                  >
                    {label}
                    {multi ? ` ×${arrived}` : ""}
                  </text>
                )}
              </g>
            );
          })}

          {/* Journey route — inks itself on when selected */}
          {journeyOn && routeD && (
            <g>
              <path d={routeD} fill="none" stroke={routeGlow} strokeWidth={7 / view.s} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
              <path
                key={journey!.id}
                className="route-draw"
                d={routeD}
                fill="none"
                stroke="var(--gold)"
                strokeWidth={2.6 / view.s}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
              />
              {journeyPts.map((p, i) => (
                <g
                  key={i}
                  transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${1 / view.s})`}
                  style={{ cursor: "pointer" }}
                  onPointerEnter={() => setHoverStop(i)}
                  onPointerLeave={() => setHoverStop(null)}
                  onClick={(ev) => ev.stopPropagation()}
                >
                  <circle r={9} fill="var(--card)" stroke="var(--gold)" strokeWidth={2} />
                  <text y={3.6} textAnchor="middle" fill="var(--ink)" style={{ fontFamily: "var(--font-eb-garamond)", fontSize: 11, fontWeight: 700 }}>
                    {i + 1}
                  </text>
                  <text
                    x={12}
                    y={4}
                    fill="var(--ink)"
                    stroke="var(--background)"
                    strokeWidth={3}
                    paintOrder="stroke"
                    style={{ fontFamily: "var(--font-eb-garamond)", fontSize: 12.5, fontWeight: hoverStop === i ? 700 : 500 }}
                  >
                    {p.placeName}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      </svg>

      {/* Journeys picker */}
      {journeysOpen && (
        <div className="pointer-events-auto absolute left-3 top-3 z-10 w-64 max-w-[calc(100%-1.5rem)] rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
          <p className="mb-1.5 font-display text-sm">The great journeys</p>
          <p className="mb-2 text-[11px] italic leading-snug text-muted-foreground">
            Routes are drawn as tradition and scholarship propose them — never as
            settled fact. Read the note on each.
          </p>
          <ul className="space-y-1">
            {journeys.map((j) => (
              <li key={j.id}>
                <button
                  onClick={() => selectJourney(activeJourney === j.id ? null : j.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition-colors",
                    activeJourney === j.id ? "border-gold bg-gold/10 text-foreground" : "border-border hover:bg-accent"
                  )}
                >
                  <span className="min-w-0 flex-1 truncate font-medium">{j.title}</span>
                  <CertaintyBadge certainty={j.certainty} className="h-auto shrink-0 px-1.5 py-0 text-[9px]" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Journey note panel (honesty) */}
      {journey && (
        <div className="pointer-events-auto absolute bottom-24 left-3 z-10 w-80 max-w-[calc(100%-1.5rem)] rounded-lg border border-border bg-card/95 p-3 shadow-xl backdrop-blur">
          <div className="flex items-start gap-2">
            <div className="min-w-0">
              <h2 className="font-display text-base leading-tight">{journey.title}</h2>
              <div className="mt-1">
                <CertaintyBadge certainty={journey.certainty} className="h-auto text-[10px]" />
              </div>
            </div>
            <button
              onClick={() => setActiveJourney(null)}
              aria-label="Clear journey"
              className="ml-auto rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-xs leading-snug text-foreground/90">
            {hoverStop != null && journeyPts[hoverStop]?.note
              ? journeyPts[hoverStop].note
              : journey.note}
          </p>
          {journey.entryId && (
            <Link
              href={`/entry/${journey.entryId}`}
              className="mt-2 inline-block text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
            >
              Open the related entry →
            </Link>
          )}
        </div>
      )}

      {/* Hover card */}
      {hovered && !selected && !journeyOn && (
        <div
          className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 rounded-md border border-border bg-card/95 p-2.5 shadow-lg backdrop-blur"
          style={{
            left: Math.min(size.w - 120, Math.max(120, toScreen(hovered.x, hovered.y).left)),
            top: Math.min(size.h - 90, Math.max(60, toScreen(hovered.x, hovered.y).top + 16)),
          }}
        >
          <p className="font-display text-sm leading-tight">{hovered.name}</p>
          {hovered.entries.length === 1 ? (
            <>
              <p className="text-xs italic text-muted-foreground">{hovered.entries[0].dateDisplay}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{hovered.entries[0].summary}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">{hovered.entries.length} entries — click to open</p>
          )}
        </div>
      )}

      {/* Place panel */}
      {selected && (
        <div className="pointer-events-auto absolute right-3 top-3 z-10 flex max-h-[calc(100%-8rem)] w-80 max-w-[calc(100%-1.5rem)] flex-col rounded-lg border border-border bg-card/95 shadow-xl backdrop-blur">
          <div className="flex items-start gap-2 p-3 pb-2">
            <div className="min-w-0">
              <h2 className="font-display text-lg leading-tight">{selected.name}</h2>
              <p className="text-xs italic text-muted-foreground">
                {selected.entries.length} {selected.entries.length === 1 ? "entry" : "entries"} at this place
              </p>
            </div>
            <button onClick={() => setSelectedPlace(null)} aria-label="Close" className="ml-auto rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
              ✕
            </button>
          </div>
          <div className="gold-rule mx-3" />
          <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3 pt-2">
            {selected.entries.map((e) => (
              <li key={e.id} className="flex items-start gap-2.5">
                <svg viewBox="0 0 48 48" width={26} height={26} className="mt-0.5 shrink-0" style={{ color: `var(--layer-${e.layers[0]})` }} aria-hidden>
                  <EmblemGlyph symbol={e.symbol} />
                </svg>
                <div className="min-w-0">
                  <Link href={`/entry/${e.id}`} className="text-sm font-medium leading-tight underline-offset-2 hover:text-gold hover:underline">
                    {e.title}
                  </Link>
                  <p className="text-xs italic text-muted-foreground">
                    {e.dateDisplay}
                    {baseName(e.location!.name) !== e.location!.name && <> · {e.location!.name.replace(/^[^(]*\(|\)$/g, "")}</>}
                  </p>
                  <Link href={`/?focus=${e.id}`} className="text-[11px] text-muted-foreground underline-offset-2 hover:text-gold hover:underline">
                    on the timeline →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Time scrubber */}
      <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-10 rounded-lg border border-border bg-card/90 px-3 py-2.5 shadow-lg backdrop-blur sm:inset-x-auto sm:left-1/2 sm:w-[min(680px,calc(100%-1.5rem))] sm:-translate-x-1/2">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play through the centuries"}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm",
              playing ? "border-gold bg-gold/15 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <input
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={5}
            value={year ?? YEAR_MIN}
            onChange={(ev) => {
              stopPlay();
              setYear(Number(ev.target.value));
            }}
            className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-[var(--gold)]"
            aria-label="Scrub through the centuries"
          />
          <span className="w-20 shrink-0 text-right font-display text-sm italic">
            {year === null ? "All ages" : formatYear(year)}
          </span>
          {year !== null && (
            <button
              onClick={() => {
                stopPlay();
                setYear(null);
              }}
              className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              All ages
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
