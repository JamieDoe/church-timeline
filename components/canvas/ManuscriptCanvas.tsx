"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Entry, Layer } from "@/lib/types";
import {
  AXIS_X0,
  BEGINNINGS_W,
  CY,
  EDGE_STYLES,
  ERAS,
  EVENT_R,
  FIGURE_R,
  TEXT_R,
  LOD_DOTS,
  LOD_LABELS,
  MAG,
  MAG_HI,
  MAG_LO,
  S_MAX,
  S_MIN,
  THRESHOLD_W,
  WORLD_H,
  buildCanvasLayout,
  buildEdges,
  contemporariesOf,
  promisePathD,
} from "@/lib/canvas-model";
import { EmblemGlyph, codexPathD, sealPathD } from "@/components/emblems";
import { CertaintyBadge } from "@/components/badges";
import { cn } from "@/lib/utils";

/**
 * The manuscript canvas: one shared parchment surface for all three layers.
 * SVG world coordinates; pan/zoom via a single transform. Click-vs-drag is
 * the hard acceptance criterion here: pointer movement under 5px must land
 * as a click on the node underneath, at every zoom level.
 */

const CLICK_SLOP_PX = 5;

interface View {
  x: number;
  y: number;
  s: number;
}

const LAYER_LABELS: { id: Layer; label: string }[] = [
  { id: "scripture", label: "Scripture" },
  { id: "people", label: "People" },
  { id: "church", label: "Church" },
];

function formatYear(y: number): string {
  return y < 0 ? `${-y} BC` : `AD ${y}`;
}

/**
 * Compact date for the canvas node label — a single anchor year, keeping the
 * "c." only when the full dateDisplay signals approximation. The complete,
 * nuanced dateDisplay (ranges, "traditional; dating debated", etc.) still
 * shows in the placard and on the detail page; the canvas is wayfinding.
 */
function shortDate(e: Entry): string {
  if (e.undated || e.yearStart === undefined) return "before datable history";
  const approx = /c\.|traditional|debated|disputed|contested|century/i.test(
    e.dateDisplay ?? ""
  );
  const core = formatYear(e.yearStart);
  return approx ? `c. ${core}` : core;
}

export function ManuscriptCanvas({
  entries,
  promiseChain,
}: {
  entries: Entry[];
  promiseChain: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 700 });
  const [view, setView] = useState<View>({ x: 0, y: 0, s: 0.4 });
  const viewRef = useRef(view);
  viewRef.current = view;

  const [layersOn, setLayersOn] = useState<Record<Layer, boolean>>({
    scripture: true,
    people: true,
    church: true,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [journey, setJourney] = useState<{
    key: string;
    label: string;
    ids: string[];
    idx: number;
  } | null>(null);
  const [contempOn, setContempOn] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);

  const promiseSet = useMemo(() => new Set(promiseChain), [promiseChain]);
  const byId = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries]);

  // Guided journeys — the traveller is flown node to node with each placard.
  // "The line of promise" follows the gold thread (Adam → Christ); "Through
  // the Scriptures" walks the whole biblical story in order (entries are
  // already sorted chronologically by the loader). Books of the Bible get
  // their own canonical journey once they enter the dataset.
  const scriptureChain = useMemo(
    () => entries.filter((e) => e.layers.includes("scripture")).map((e) => e.id),
    [entries]
  );
  const journeyDefs = useMemo(
    () => [
      { key: "promise", label: "The line of promise", ids: promiseChain },
      { key: "scripture", label: "Through the Scriptures", ids: scriptureChain },
    ],
    [promiseChain, scriptureChain]
  );
  const journeyIdSet = useMemo(() => new Set(journey?.ids ?? []), [journey]);
  const layout = useMemo(
    () => buildCanvasLayout(entries, promiseSet),
    [entries, promiseSet]
  );
  const positions = layout.positions;
  const axisX = layout.axisX;
  const worldW = layout.worldW;
  const edges = useMemo(() => buildEdges(entries, positions), [entries, positions]);
  const thread = useMemo(() => {
    const chain = promiseChain
      .map((id) => byId.get(id))
      .filter((e): e is Entry => !!e);
    return promisePathD(chain, positions, worldW);
  }, [promiseChain, byId, positions, worldW]);

  const selected = selectedId ? byId.get(selectedId) : undefined;
  const contemporaries = useMemo(
    () => (selected && contempOn ? contemporariesOf(selected, entries) : []),
    [selected, contempOn, entries]
  );
  const contempIds = useMemo(
    () => new Set(contemporaries.map((e) => e.id)),
    [contemporaries]
  );

  /** Ids adjacent to the selected node via any edge or the promise thread. */
  const connectedToSelected = useMemo(() => {
    const set = new Set<string>();
    if (!selectedId) return set;
    for (const e of edges) {
      if (e.sourceId === selectedId) set.add(e.targetId);
      if (e.targetId === selectedId) set.add(e.sourceId);
    }
    const i = promiseChain.indexOf(selectedId);
    if (i > 0) set.add(promiseChain[i - 1]);
    if (i >= 0 && i < promiseChain.length - 1) set.add(promiseChain[i + 1]);
    return set;
  }, [selectedId, edges, promiseChain]);

  const q = searchQ.trim().toLowerCase();
  const matchesSearch = useCallback(
    (e: Entry) =>
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      e.categories.some((c) => c.toLowerCase().includes(q)),
    [q]
  );

  const layerVisible = useCallback(
    (e: Entry) => e.layers.some((l) => layersOn[l]),
    [layersOn]
  );

  // ----- sizing -------------------------------------------------------
  const [measured, setMeasured] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
      setMeasured(true);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fitScale = Math.min(size.w / worldW, size.h / WORLD_H) * 0.97;
  const minS = Math.min(S_MIN, fitScale);

  // The reachable surface: the full world width, and the vertical span the
  // nodes actually occupy (padded for medallions + labels). Panning is clamped
  // to this so the reader can't drift off into blank parchment beyond the story.
  const contentBounds = useMemo(() => {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of positions.values()) {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    if (!Number.isFinite(minY)) {
      minY = 0;
      maxY = WORLD_H;
    }
    return { x0: 0, x1: worldW, y0: minY - 130, y1: maxY + 130 };
  }, [positions, worldW]);

  // Keep the view within bounds: centre an axis when the content is smaller than
  // the viewport on it, otherwise pin so neither edge pulls past the content.
  const clampView = useCallback(
    (v: View): View => {
      const s = Math.min(S_MAX, Math.max(minS, v.s));
      const { x0, x1, y0, y1 } = contentBounds;
      const contentW = (x1 - x0) * s;
      const contentH = (y1 - y0) * s;
      const x =
        contentW <= size.w
          ? (size.w - contentW) / 2 - x0 * s
          : Math.min(-x0 * s, Math.max(size.w - x1 * s, v.x));
      const y =
        contentH <= size.h
          ? (size.h - contentH) / 2 - y0 * s
          : Math.min(-y0 * s, Math.max(size.h - y1 * s, v.y));
      return { s, x, y };
    },
    [minS, size, contentBounds]
  );

  // Fit the whole timeline to the viewport (the "Overview" framing) on load and
  // on resize, UNTIL the reader pans or zooms themselves. The first render uses
  // a placeholder size; the real ResizeObserver measurement then re-fits, so the
  // opening view lands on the actual viewport rather than the 1200×700 guess.
  const interacted = useRef(false);
  useEffect(() => {
    if (interacted.current || !size.w) return;
    setView(clampView({ x: 0, y: 0, s: fitScale }));
  }, [size, fitScale, clampView]);

  // ----- animation ----------------------------------------------------
  const animRef = useRef<number | null>(null);
  const flyTo = useCallback(
    (wx: number, wy: number, targetS: number) => {
      interacted.current = true;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const from = { ...viewRef.current };
      const to = {
        s: targetS,
        x: size.w / 2 - wx * targetS,
        y: size.h * 0.44 - wy * targetS,
      };
      const t0 = performance.now();
      const dur = 900;
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
    [size, clampView]
  );

  // ----- wheel zoom (native listener: React's is passive) -------------
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      interacted.current = true;
      const delta = ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY;
      const factor = Math.exp(-delta * 0.0016);
      const rect = svg.getBoundingClientRect();
      const px = ev.clientX - rect.left;
      const py = ev.clientY - rect.top;
      setView((v) => {
        const s = Math.min(S_MAX, Math.max(minS, v.s * factor));
        const k = s / v.s;
        return clampView({ s, x: px - (px - v.x) * k, y: py - (py - v.y) * k });
      });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [minS, clampView]);

  // ----- pan / pinch / click-vs-drag ---------------------------------
  const dragDist = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

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
        if (dragDist.current > 5) interacted.current = true;
        setView((v) => clampView({ ...v, x: v.x + dx, y: v.y + dy }));
      } else if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.entries()];
        const other = a[0] === me.pointerId ? b : a;
        const d0 = Math.hypot(prev.x - other[1].x, prev.y - other[1].y);
        const d1 = Math.hypot(cur.x - other[1].x, cur.y - other[1].y);
        dragDist.current += 10; // pinches are never clicks
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

  const wasClick = () => dragDist.current < CLICK_SLOP_PX;

  const selectEntry = useCallback((id: string | null) => {
    setSelectedId(id);
    setContempOn(false);
    if (id === null) setJourney(null);
  }, []);

  // Deep link from the map (and anywhere else): /?focus=<id> selects that
  // entry and flies to it once the viewport has its real measurements.
  const didFocusLink = useRef(false);
  useEffect(() => {
    if (didFocusLink.current || !measured) return;
    didFocusLink.current = true;
    const id = new URLSearchParams(window.location.search).get("focus");
    if (!id) return;
    const p = positions.get(id);
    if (!p) return;
    selectEntry(id);
    flyTo(p.x, p.y, 1.5);
  }, [measured, positions, selectEntry, flyTo]);

  const onBackgroundClick = () => {
    if (wasClick()) selectEntry(null);
  };

  const onNodeClick = (id: string) => {
    if (!wasClick()) return;
    selectEntry(id);
  };

  // ----- journey ------------------------------------------------------
  const startJourney = (def: { key: string; label: string; ids: string[] }) => {
    if (!def.ids.length) return;
    setJourney({ ...def, idx: 0 });
    setContempOn(false);
    setSelectedId(def.ids[0]);
    const p = positions.get(def.ids[0]);
    if (p) flyTo(p.x, p.y, 1.7);
  };
  const toggleJourney = (def: { key: string; label: string; ids: string[] }) => {
    if (journey?.key === def.key) exitJourney();
    else startJourney(def);
  };
  const stepJourney = (dir: 1 | -1) => {
    setJourney((j) => {
      if (!j) return j;
      const next = Math.min(j.ids.length - 1, Math.max(0, j.idx + dir));
      setSelectedId(j.ids[next]);
      const p = positions.get(j.ids[next]);
      if (p) flyTo(p.x, p.y, 1.7);
      return { ...j, idx: next };
    });
  };
  const exitJourney = () => setJourney(null);

  // ----- opacity model ------------------------------------------------
  const journeyActive = journey !== null;

  function nodeOpacity(e: Entry): number {
    if (!layerVisible(e)) return 0;
    if (journeyActive) return journeyIdSet.has(e.id) ? 1 : 0.12;
    if (selected && contempOn)
      return e.id === selected.id || contempIds.has(e.id) ? 1 : 0.12;
    if (q) return matchesSearch(e) ? 1 : 0.14;
    if (selectedId)
      return e.id === selectedId || connectedToSelected.has(e.id) ? 1 : 0.28;
    return 1;
  }

  function edgeOpacity(sourceId: string, targetId: string): number {
    const a = byId.get(sourceId);
    const b = byId.get(targetId);
    if (!a || !b || !layerVisible(a) || !layerVisible(b)) return 0;
    if (journeyActive) return 0.08;
    if (selected && contempOn) return 0.06;
    if (q) return 0.08;
    if (selectedId)
      return sourceId === selectedId || targetId === selectedId ? 0.95 : 0.08;
    if (hoverId)
      return sourceId === hoverId || targetId === hoverId ? 0.95 : 0.3;
    return 0.55;
  }

  // ----- LOD ----------------------------------------------------------
  const s = view.s;
  const showDots = s < LOD_DOTS;
  const showLabels = s >= LOD_LABELS;
  // Era labels hold a roughly constant on-screen size; a label renders only
  // when its band is wide enough to contain it.
  const eraLabelSize = Math.min(44, 15 / s);
  const eraOpacity = s < 0.85 ? 0.85 : Math.max(0, 0.85 - (s - 0.85) * 1.4);
  const beginningsTitleSize = Math.min((BEGINNINGS_W - 60) / (22 * 0.82), 19 / s);
  // Nodes and inked lines grow with zoom only up to ~1.6×, then sublinearly,
  // so deep zoom magnifies space between things rather than the ink itself.
  const inkScale = 1 / Math.max(1, Math.pow(s / 1.6, 0.65));

  // The visible slice of the world. Zone washes, era bands, and dividers are
  // drawn to cover it fully, and wayfinding text pins to the screen edges, so
  // the parchment reads as an unbounded surface in every direction.
  const worldTop = (0 - view.y) / s;
  const worldBottom = (size.h - view.y) / s;
  const worldLeft = (0 - view.x) / s;
  const topPinY = worldTop + 78 / s;
  const axisY = worldBottom - 52 / s;

  // Axis ticks: every 500y zoomed out, 100y zoomed in. On the rubber axis the
  // spacing between years varies, so we drop any tick that would land too
  // close on screen to the previous one (keeps the compressed church-history
  // end from jumbling its labels).
  const tickStep = s >= 1.2 ? 100 : s >= 0.55 ? 250 : 500;
  const shownTicks: { y: number; x: number }[] = [];
  let lastTickX = -Infinity;
  for (let y = -2000; y <= 1700; y += tickStep) {
    if (y === 0) continue;
    const x = axisX(y);
    if (x - lastTickX >= 62 / s) {
      shownTicks.push({ y, x });
      lastTickX = x;
    }
  }

  return (
    <div ref={containerRef} className="vignette relative h-full w-full overflow-hidden select-none">
      <svg
        ref={svgRef}
        className="h-full w-full cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onClick={onBackgroundClick}
        role="application"
        aria-label="Manuscript timeline canvas. Drag to pan, scroll to zoom, click a node to open its placard."
      >
        <defs>
          {/* The nimbus of the Messiah — a soft gold aura marking Christ's node
              apart from every other figure on the page. */}
          <radialGradient id="messiah-halo">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.55" />
            <stop offset="45%" stopColor="var(--gold)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={`translate(${view.x} ${view.y}) scale(${view.s})`}>
          {/* Beginnings zone — walled off, no year axis; the wash runs on
              indefinitely to the left: everything before the threshold is
              before datable history. */}
          <rect
            x={worldLeft - 50}
            y={worldTop - 50}
            width={Math.max(0, BEGINNINGS_W - (worldLeft - 50))}
            height={worldBottom - worldTop + 100}
            fill="var(--vellum-shadow)"
            opacity={0.4}
          />
          <text
            x={(BEGINNINGS_W + 22) / 2}
            y={topPinY}
            textAnchor="middle"
            fill="var(--ink-soft)"
            style={{
              fontFamily: "var(--font-eb-garamond)",
              fontSize: beginningsTitleSize,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Before datable history
          </text>
          <text
            x={(BEGINNINGS_W + 22) / 2}
            y={topPinY + beginningsTitleSize * 1.35}
            textAnchor="middle"
            fill="var(--ink-soft)"
            opacity={0.8}
            style={{
              fontFamily: "var(--font-eb-garamond)",
              fontStyle: "italic",
              fontSize: beginningsTitleSize * 0.68,
            }}
          >
            ordered by story, not by year
          </text>

          {/* Threshold divider — conventional dating begins */}
          <line
            x1={BEGINNINGS_W + THRESHOLD_W / 2}
            y1={worldTop - 50}
            x2={BEGINNINGS_W + THRESHOLD_W / 2}
            y2={worldBottom + 50}
            stroke="var(--gold)"
            strokeWidth={1.2 / s}
            strokeDasharray={`${10 / s} ${7 / s}`}
            opacity={0.65}
          />
          <path
            d={`M ${BEGINNINGS_W + THRESHOLD_W / 2} ${CY - 9 / s} l ${6 / s} ${9 / s} l ${-6 / s} ${9 / s} l ${-6 / s} ${-9 / s} Z`}
            fill="var(--gold)"
            opacity={0.8}
          />

          {/* New Testament divider — where the New Covenant begins (the coming
              of Christ). Mirrors the datable-history threshold so the page has
              two gilt pillars: recorded time begins, then the promise is kept. */}
          {(() => {
            const ntx = axisX(MAG_LO);
            return (
              <g>
                <line
                  x1={ntx}
                  y1={worldTop - 50}
                  x2={ntx}
                  y2={worldBottom + 50}
                  stroke="var(--gold)"
                  strokeWidth={1.2 / s}
                  strokeDasharray={`${10 / s} ${7 / s}`}
                  opacity={0.65}
                />
                {eraOpacity > 0.05 && (
                  <text
                    x={ntx}
                    y={topPinY + eraLabelSize * 1.5}
                    textAnchor="middle"
                    fill="var(--gold)"
                    opacity={eraOpacity}
                    style={{
                      fontFamily: "var(--font-eb-garamond)",
                      fontStyle: "italic",
                      fontSize: Math.min(30, 11 / s),
                      letterSpacing: "0.08em",
                    }}
                  >
                    the New Testament
                  </text>
                )}
              </g>
            );
          })()}

          {/* Era bands + labels */}
          <g opacity={eraOpacity}>
            {ERAS.map((era, i) => {
              const x1 = axisX(era.from);
              const x2 = axisX(era.to);
              return (
                <g key={era.label}>
                  {i % 2 === 0 && (
                    <rect
                      x={x1}
                      y={worldTop - 50}
                      width={x2 - x1}
                      height={worldBottom - worldTop + 100}
                      fill="var(--gold)"
                      opacity={0.045}
                    />
                  )}
                  <line
                    x1={x1}
                    y1={worldTop - 50}
                    x2={x1}
                    y2={worldBottom + 50}
                    stroke="var(--ink-soft)"
                    strokeWidth={0.5 / s}
                    opacity={0.3}
                  />
                  {(() => {
                    // Shrink to fit the band; drop below ~9px on screen.
                    const fs = Math.min(eraLabelSize, (x2 - x1) / (era.label.length * 0.82));
                    if (fs * s < 9) return null;
                    return (
                      <text
                        x={(x1 + x2) / 2}
                        y={topPinY}
                        textAnchor="middle"
                        fill="var(--ink-soft)"
                        style={{
                          fontFamily: "var(--font-eb-garamond)",
                          fontSize: fs,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        {era.label}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </g>

          {/* Year axis — pinned to the bottom of the viewport like a chart's
              scale, so it travels with the reader across the surface */}
          <g>
            <line
              x1={AXIS_X0 - 20}
              y1={axisY}
              x2={worldW - 30}
              y2={axisY}
              stroke="var(--ink-soft)"
              strokeWidth={1 / s}
              opacity={0.5}
            />
            {shownTicks.map(({ y, x }) => (
              <g key={y}>
                <line
                  x1={x}
                  y1={axisY - 6 / s}
                  x2={x}
                  y2={axisY + 6 / s}
                  stroke="var(--ink-soft)"
                  strokeWidth={1 / s}
                  opacity={0.5}
                />
                <text
                  x={x}
                  y={axisY + 24 / s}
                  textAnchor="middle"
                  fill="var(--ink-soft)"
                  opacity={0.8}
                  style={{
                    fontFamily: "var(--font-eb-garamond)",
                    fontSize: 12 / s,
                  }}
                >
                  {formatYear(y)}
                </text>
              </g>
            ))}

            {/* Finer 10-year scale across the magnified Christ-&-Apostles
                window — a detail ruler shown alongside the main axis once the
                stretched era is wide enough on screen to read. */}
            {s >= 0.32 &&
              (() => {
                const x0 = axisX(MAG_LO);
                const x1 = axisX(MAG_HI);
                const subY = axisY - 30 / s;
                const decades: number[] = [];
                for (let y = 0; y <= MAG_HI; y += 10) decades.push(y);
                return (
                  <g>
                    <line
                      x1={x0}
                      y1={subY}
                      x2={x1}
                      y2={subY}
                      stroke="var(--gold)"
                      strokeWidth={1 / s}
                      opacity={0.45}
                    />
                    {decades.map((y) => {
                      const x = axisX(y);
                      return (
                        <g key={y}>
                          <line
                            x1={x}
                            y1={subY}
                            x2={x}
                            y2={subY - 5 / s}
                            stroke="var(--gold)"
                            strokeWidth={1 / s}
                            opacity={0.6}
                          />
                          <text
                            x={x}
                            y={subY - 9 / s}
                            textAnchor="middle"
                            fill="var(--gold)"
                            opacity={0.85}
                            style={{
                              fontFamily: "var(--font-eb-garamond)",
                              fontSize: 10 / s,
                            }}
                          >
                            {y === 0 ? "AD 1" : `${y}`}
                          </text>
                        </g>
                      );
                    })}
                    <text
                      x={(x0 + x1) / 2}
                      y={subY + 15 / s}
                      textAnchor="middle"
                      fill="var(--gold)"
                      opacity={0.7}
                      style={{
                        fontFamily: "var(--font-eb-garamond)",
                        fontSize: 10.5 / s,
                        fontStyle: "italic",
                      }}
                    >
                      Christ &amp; the Apostles — AD 1–{MAG_HI}, shown at {MAG}× scale
                    </text>
                  </g>
                );
              })()}
          </g>

          {/* The gold thread — the line of promise, hero of the canvas */}
          <g>
            <path
              d={thread.main}
              fill="none"
              stroke="var(--thread-glow)"
              strokeWidth={9 * inkScale}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={thread.main}
              fill="none"
              stroke="var(--gold)"
              strokeWidth={3.2 * inkScale}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={thread.continuation}
              fill="none"
              stroke="var(--gold)"
              strokeWidth={1.4 * inkScale}
              strokeDasharray={`${1 * inkScale} ${7 * inkScale}`}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.8}
            />
          </g>

          {/* Typed connection lines */}
          {edges.map((edge, i) => {
            const st = EDGE_STYLES[edge.type];
            return (
              <path
                key={`${edge.sourceId}-${edge.targetId}-${i}`}
                d={edge.d}
                fill="none"
                stroke={st.stroke}
                strokeWidth={st.width * inkScale}
                strokeDasharray={st.dash
                  ?.split(" ")
                  .map((n) => Number(n) * inkScale)
                  .join(" ")}
                strokeLinecap="round"
                opacity={edgeOpacity(edge.sourceId, edge.targetId)}
                style={{ transition: "opacity 300ms" }}
              >
                <title>{st.label}</title>
              </path>
            );
          })}

          {/* Nodes */}
          {entries.map((e) => {
            const p = positions.get(e.id);
            if (!p) return null;
            const opacity = nodeOpacity(e);
            const tint = `var(--layer-${e.layers[0]})`;
            const isSel = e.id === selectedId;
            const isContemp = contempIds.has(e.id);
            const isMessiah = e.id === "jesus";
            const r =
              e.type === "figure" ? FIGURE_R : e.type === "text" ? TEXT_R : EVENT_R;

            if (showDots) {
              const dotR = Math.max(9, 5.5 / s) * (promiseSet.has(e.id) ? 1.25 : 1);
              return (
                <g
                  key={e.id}
                  transform={`translate(${p.x} ${p.y})`}
                  opacity={opacity}
                  style={{ transition: "opacity 300ms" }}
                  data-node-id={e.id}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onNodeClick(e.id);
                  }}
                  className="cursor-pointer"
                >
                  {isMessiah && <circle r={dotR * 3.4} fill="url(#messiah-halo)" />}
                  <circle
                    r={dotR}
                    fill={promiseSet.has(e.id) ? "var(--gold)" : tint}
                    stroke="var(--background)"
                    strokeWidth={1.5 / s}
                  />
                  <title>{e.title}</title>
                </g>
              );
            }

            return (
              <g
                key={e.id}
                transform={`translate(${p.x} ${p.y}) scale(${inkScale})`}
                opacity={opacity}
                style={{ transition: "opacity 300ms", color: tint }}
                data-node-id={e.id}
                tabIndex={opacity > 0 ? 0 : -1}
                role="button"
                aria-label={`${e.title}${e.dateDisplay ? `, ${e.dateDisplay}` : ", before datable history"}`}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onNodeClick(e.id);
                }}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    selectEntry(e.id);
                  }
                }}
                onPointerEnter={() => setHoverId(e.id)}
                onPointerLeave={() => setHoverId(null)}
                className="cursor-pointer focus:outline-none"
              >
                {isMessiah && (
                  <>
                    <circle r={r * 2.7} fill="url(#messiah-halo)" />
                    <circle r={r + 5} fill="none" stroke="var(--gold)" strokeWidth={1.4} opacity={0.85} />
                  </>
                )}
                {isContemp && (
                  <circle
                    r={r + 9}
                    fill="none"
                    stroke="var(--lapis)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                )}
                {isSel && (
                  <circle r={r + 6} fill="none" stroke="var(--gold)" strokeWidth={2.5} opacity={0.9} />
                )}
                {e.type === "figure" ? (
                  <>
                    {/* Opaque medallion — the promise nodes are beads that sit
                        ON the smooth thread: the card fill occludes the line, so
                        the wave passes cleanly behind and the node rests on top. */}
                    <circle
                      r={r}
                      fill="var(--card)"
                      stroke={promiseSet.has(e.id) ? "var(--gold)" : "currentColor"}
                      strokeWidth={promiseSet.has(e.id) ? 3 : 2}
                    />
                    <circle r={r - 4.5} fill="none" stroke="var(--gold)" strokeWidth={0.9} opacity={0.7} />
                  </>
                ) : e.type === "text" ? (
                  <>
                    {/* Codex — a bound book: the canonical writings (Scripture,
                        creeds) as nodes, portrait-shaped so they read as books,
                        distinct from the figure medallion and the event seal. */}
                    <path
                      d={codexPathD(r)}
                      fill="var(--card)"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <path
                      d={codexPathD(r - 5)}
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth={0.8}
                      opacity={0.7}
                    />
                  </>
                ) : (
                  <>
                    <path
                      d={sealPathD(r)}
                      fill="var(--card)"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <circle r={r - 5.5} fill="none" stroke="var(--gold)" strokeWidth={0.8} opacity={0.7} />
                  </>
                )}
                <g transform={`translate(${-r * 0.62} ${-r * 0.62}) scale(${(r * 1.24) / 48})`}>
                  <EmblemGlyph symbol={e.symbol} />
                </g>
                {showLabels && (
                  <g style={{ pointerEvents: "none" }}>
                    <text
                      y={r + 18}
                      textAnchor="middle"
                      fill="var(--ink)"
                      stroke="var(--background)"
                      strokeWidth={3}
                      paintOrder="stroke"
                      style={{ fontFamily: "var(--font-eb-garamond)", fontSize: 15, fontWeight: 600 }}
                    >
                      {e.title}
                    </text>
                    <text
                      y={r + 33}
                      textAnchor="middle"
                      fill="var(--ink-soft)"
                      stroke="var(--background)"
                      strokeWidth={2.5}
                      paintOrder="stroke"
                      style={{ fontFamily: "var(--font-eb-garamond)", fontSize: 11.5, fontStyle: "italic" }}
                    >
                      {shortDate(e)}
                    </text>
                  </g>
                )}
                <title>{`${e.title} — ${e.summary}`}</title>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Toolbar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-start gap-2 p-3 sm:justify-between">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {LAYER_LABELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayersOn((prev) => ({ ...prev, [l.id]: !prev[l.id] }))}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur transition-colors",
                layersOn[l.id]
                  ? "border-border bg-card/85 text-foreground"
                  : "border-transparent bg-muted/50 text-muted-foreground line-through"
              )}
            >
              <span className="size-2 rounded-full" style={{ background: `var(--layer-${l.id})` }} />
              {l.label}
            </button>
          ))}
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search the canvas…"
            className="h-7 w-44 rounded-full border border-border bg-card/85 px-3 text-xs outline-none backdrop-blur placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50"
          />
          {searchQ && (
            <button
              onClick={() => setSearchQ("")}
              className="rounded-full border border-border bg-card/85 px-2 py-1 text-xs text-muted-foreground backdrop-blur hover:text-foreground"
            >
              clear
            </button>
          )}
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <button
            onClick={() => toggleJourney(journeyDefs[0])}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium backdrop-blur transition-colors",
              journey?.key === "promise"
                ? "border-gold bg-gold/15 text-foreground"
                : "border-gold/60 bg-card/85 text-foreground hover:bg-gold/10"
            )}
          >
            ✦ Follow the gold thread
          </button>
          <button
            onClick={() => toggleJourney(journeyDefs[1])}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium backdrop-blur transition-colors",
              journey?.key === "scripture"
                ? "border-lapis bg-lapis/15 text-foreground"
                : "border-lapis/50 bg-card/85 text-foreground hover:bg-lapis/10"
            )}
          >
            ❧ Through the Scriptures
          </button>
          <button
            onClick={() => {
              interacted.current = true;
              setView(clampView({ x: 0, y: 0, s: fitScale }));
            }}
            className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs text-muted-foreground backdrop-blur hover:text-foreground"
          >
            Overview
          </button>
          <button
            onClick={() => setLegendOpen((o) => !o)}
            className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs text-muted-foreground backdrop-blur hover:text-foreground"
          >
            Key
          </button>
        </div>
      </div>

      {/* Legend */}
      {legendOpen && (
        <div className="absolute right-3 top-14 max-h-[calc(100vh-6rem)] w-64 overflow-y-auto rounded-lg border border-border bg-card/95 p-3 text-xs shadow-lg backdrop-blur">
          <p className="mb-2 font-display text-sm">Reading the canvas</p>

          <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">Node forms</p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="-12 -12 24 24"><circle r="9" fill="var(--card)" stroke="var(--gold)" strokeWidth="1.8" /></svg>
              figure — a person
            </li>
            <li className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="-13 -13 26 26"><path d={sealPathD(9)} fill="var(--card)" stroke="currentColor" strokeWidth="1.5" /></svg>
              event — something that happened
            </li>
            <li className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="-13 -13 26 26"><path d={codexPathD(9)} fill="var(--card)" stroke="currentColor" strokeWidth="1.5" /></svg>
              text — a book or creed
            </li>
          </ul>

          <div className="my-2 gold-rule" />
          <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">Layers</p>
          <ul className="space-y-1.5 text-muted-foreground">
            {LAYER_LABELS.map((l) => (
              <li key={l.id} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: `var(--layer-${l.id})` }} />
                {l.label}
              </li>
            ))}
          </ul>

          <div className="my-2 gold-rule" />
          <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">Threads &amp; ties</p>
          <ul className="space-y-1.5 text-muted-foreground">
            {(
              [
                { dash: undefined, w: 3, stroke: "var(--gold)", label: "the line of promise" },
                { dash: "1 8", w: 1.4, stroke: "var(--ink-soft)", label: "a text & what it tells" },
                { dash: undefined, w: 2, stroke: "var(--lapis)", label: "teacher → disciple" },
                { dash: "7 4", w: 2, stroke: "var(--lapis)", label: "prophet → king" },
                { dash: "2 5", w: 2, stroke: "var(--gold)", label: "anointed" },
                { dash: "1 4", w: 1.8, stroke: "var(--lapis)", label: "succeeded" },
                { dash: "9 5", w: 1.8, stroke: "var(--ink-soft)", label: "influenced" },
                { dash: "4 4", w: 1.8, stroke: "var(--crimson)", label: "opposed" },
                { dash: "1 5", w: 1.5, stroke: "var(--ink-soft)", label: "contemporary" },
                { dash: undefined, w: 2.5, stroke: "var(--crimson)", label: "split from" },
              ] as const
            ).map((e) => (
              <li key={e.label} className="flex items-center gap-2">
                <svg width="28" height="8" className="shrink-0">
                  <line x1="0" y1="4" x2="28" y2="4" stroke={e.stroke} strokeWidth={e.w} strokeDasharray={e.dash} strokeLinecap="round" />
                </svg>
                {e.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Placard */}
      {selected && (
        <div className="absolute bottom-3 left-3 w-[21rem] max-w-[calc(100%-1.5rem)] rounded-lg border border-border bg-card/95 p-4 shadow-xl backdrop-blur">
          {journey && (
            <p
              className="mb-1 text-[11px] uppercase tracking-widest"
              style={{ color: journey.key === "promise" ? "var(--gold)" : "var(--lapis)" }}
            >
              {journey.label} · {journey.idx + 1} of {journey.ids.length}
            </p>
          )}
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 48 48" width="44" height="44" style={{ color: `var(--layer-${selected.layers[0]})` }} aria-hidden>
              <EmblemGlyph symbol={selected.symbol} />
            </svg>
            <div className="min-w-0">
              <h2 className="font-display text-lg leading-tight">{selected.title}</h2>
              <p className="text-xs italic text-muted-foreground">
                {selected.undated ? "before datable history" : selected.dateDisplay}
              </p>
            </div>
            <button
              onClick={() => selectEntry(null)}
              aria-label="Close placard"
              className="ml-auto -mr-1 -mt-1 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm leading-snug text-foreground/90">{selected.summary}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <CertaintyBadge certainty={selected.certainty} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {journeyActive ? (
              <>
                <button
                  onClick={() => stepJourney(-1)}
                  disabled={journey!.idx === 0}
                  className="rounded-md border border-border px-2.5 py-1 text-xs disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => stepJourney(1)}
                  disabled={journey!.idx === journey!.ids.length - 1}
                  className="rounded-md border border-gold bg-gold/10 px-2.5 py-1 text-xs disabled:opacity-40"
                >
                  Next →
                </button>
                <button onClick={exitJourney} className="rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground">
                  Exit
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/entry/${selected.id}`}
                  className="rounded-md border border-gold bg-gold/10 px-2.5 py-1 text-xs font-medium hover:bg-gold/20"
                >
                  Open full entry →
                </Link>
                {selected.location && (
                  <Link
                    href={`/map?entry=${selected.id}`}
                    className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    View on the map ↗
                  </Link>
                )}
                {selected.type === "figure" && !selected.undated && (
                  <button
                    onClick={() => setContempOn((c) => !c)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs",
                      contempOn
                        ? "border-lapis bg-lapis/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {contempOn ? "Hide contemporaries" : "Who was alive then?"}
                  </button>
                )}
              </>
            )}
          </div>
          {contempOn && (
            <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
              {contemporaries.length ? (
                <p>
                  Alive at the same time:{" "}
                  {contemporaries.map((c, i) => (
                    <span key={c.id}>
                      {i > 0 && ", "}
                      <button
                        onClick={() => {
                          selectEntry(c.id);
                          setContempOn(true);
                        }}
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        {c.title}
                      </button>
                    </span>
                  ))}
                  <span className="mt-1 block italic opacity-80">
                    Dated figures only — approximate lifespans, see each entry.
                  </span>
                </p>
              ) : (
                <p>No dated figures on the canvas overlap this lifespan yet.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
