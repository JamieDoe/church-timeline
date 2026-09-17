"use client";

import { useEffect, useState } from "react";

/**
 * A one-time illuminated opening: a gilt sunburst inks in, the wordmark rises,
 * a gold rule draws beneath it, and the veil lifts to reveal the site. Shown on
 * the first full load of a browsing session (guarded via sessionStorage), and
 * skipped entirely for readers who prefer reduced motion. The matching
 * `intro-seen` class is set by an inline <head> script (see layout) so a
 * refresh never flashes the veil before React hydrates.
 */

// 12-point sunburst: alternating long/short gilt rays around a ringed centre.
// Coordinates are rounded to a short, stable precision so the server- and
// client-rendered SVG stringify identically (avoids a hydration mismatch on
// the raw trig floats).
const r2 = (n: number) => Math.round(n * 100) / 100;
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  const inner = 25;
  const outer = i % 2 === 0 ? 37 : 31;
  return {
    x1: r2(50 + Math.cos(a) * inner),
    y1: r2(50 + Math.sin(a) * inner),
    x2: r2(50 + Math.cos(a) * outer),
    y2: r2(50 + Math.sin(a) * outer),
  };
});

export function IntroLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      // sessionStorage unavailable (private mode, etc.) — just play it.
    }
    const reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setGone(true);
      return;
    }
    const t = setTimeout(() => setGone(true), 2450);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-loader" aria-hidden="true">
      <div className="intro-inner">
        <svg
          className="intro-mark"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          {RAYS.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} strokeWidth={2} />
          ))}
          <circle cx={50} cy={50} r={21} strokeWidth={2} />
          <circle cx={50} cy={50} r={13} strokeWidth={1} opacity={0.6} />
          <circle cx={50} cy={50} r={4.5} fill="currentColor" stroke="none" />
        </svg>
        <p className="intro-title">
          The <span className="text-gold">Illuminated</span> Timeline
        </p>
        <div className="intro-rule" />
        <p className="intro-tagline">&ldquo;Your word is a lamp to my feet&rdquo;</p>
      </div>
    </div>
  );
}
