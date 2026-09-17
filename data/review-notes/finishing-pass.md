# Finishing pass — after all 12 content batches (review notes)

Done after the twelve content batches were complete: (1) integrate the Luther seed entry, (2) polish the Figures/Map/About/Key surfaces now that every node form, edge type, and layer is in use, and (3) a full end-to-end review. **215 pages, build green, clean browser console.**

## 1. Luther entry — integrated, not padded
The seed `martin-luther` article was already at (arguably above) the depth of the batch entries — it needed *connecting*, not lengthening. Two targeted edits:
- Wove **Augustine** (father of his order) and **Erasmus**'s Greek New Testament into the discovery moment, so the incoming `influenced` edges from Paul, Augustine, and Erasmus are all named in prose.
- Replaced the stale forward-looking line ("later content batches will draw…") with the realized network: **Wycliffe → Hus → Luther**, the Anabaptists' **split-from** Zwingli (the one on the canvas), and Rome's answer at Trent.

Verified: the entry renders with the new prose, and its **6 incoming edges** (Paul/Augustine/Hus/Erasmus influenced + Zwingli/Trent opposed) are intact.

## 2. Polish
- **Key legend** — was missing the newer content. Rebuilt into three labelled sections: **Node forms** (figure / event / **text-codex**, previously absent), **Layers** (Scripture / People / Church colour dots, previously absent), and **Threads & ties** — now all **10 used edge types** including `describes` ("a text & what it tells") and `split from`. Set to scroll if it exceeds the viewport.
- **Map** — added **58 `location`s** to the church-history entries (batches 10–12). The chart (lng 8–42, lat 26–47) now shows the ancient church world in-frame — Rome, Carthage, Alexandria, Antioch, Smyrna, Ephesus, Chalcedon, Cappadocia, Nicaea, Milan, Monte Cassino, Trent, and more — while the European Reformation sites (Wittenberg, Geneva, Zurich, Prague, Oxford, Canterbury, …) fall to the off-chart list, which itself tells the story of the faith spreading north and west. Books (`text` nodes) were deliberately left placeless.
- **About** — reviewed; it is written at the level of principle (three registers, certainty markers, no invented faces, the cross-check canon) and already describes the finished scope accurately. Left unchanged.
- **Figures** — verified it renders the full people directory (searchable, sortable, filterable by layer/category) with framed medallions and badges. Left as figures-only by design; texts/events live on the canvas.

## 3. Full review — findings & fixes
Comprehensive data-integrity sweep over all **208 entries**:
- **0** entry symbols without a drawn glyph (no placeholder fallbacks); **0** symbols missing from the manifest; **0** dangling relationship targets; **0** entries missing registers/categories/summary/article/sources.
- **Line of promise** complete and correct: Adam → Noah → Abraham → Isaac → Jacob → David → Solomon → Hezekiah → Josiah → Joseph of Nazareth → Jesus (11).
- Type mix: 102 figures / 67 events / 39 texts. Certainty: 99 attested / 55 contested / 54 traditional — an honest gradient. Layer membership: scripture 136, people 66 (rich as a *secondary* layer), church 91.

**Issues caught and fixed during the review:**
1. **Hydration mismatch (real).** ~30 glyphs computed coordinates with `Math.cos`/`Math.sin`, and `threadY` used `Math.sin`; these differ by 1 ULP between the Node server render and the browser hydration, tripping React's hydration check on every page that draws an emblem (and the canvas thread). Fixed with deterministic `dcos`/`dsin` helpers (round the trig result) in `emblems.tsx`, and by rounding `threadY`'s output to sub-pixel in `canvas-model.ts`. Confirmed via server-HTML inspection (rounded, byte-identical to client) and a clean console on a fresh tab.
2. **`<script>`-in-component warning (real, benign).** The theme-flash-prevention script was a raw `<script dangerouslySetInnerHTML>`. Switched to `next/script` with `strategy="beforeInteractive"` and an `id`, per the Next 16 scripts guide. Warning gone.
3. **Orphan manifest symbol (cleanup).** `golden-calf-north` was a manifest-only pseudo-entry (no entry used it; Jeroboam actually reuses `golden-calf`). Folded Jeroboam into `golden-calf`'s `usedBy` with a note and removed the orphan. Manifest is now 197 keys, every one used.

**Not changed (intentional):** the one `describes` tether pointing at a text (`the-septuagint → the-tanakh`) is deliberate — the Greek translation and its Hebrew source. The 5 people-*primary* figures (Herod, Pilate, Peter, James, Paul) are correct; the People layer is populated as a secondary membership.

## State
All content complete; all surfaces polished; console clean; build green. Optional future work if ever wanted: an end-to-end visual/dark-mode sweep of every detail page, or a browsable index for the `text` (book) nodes.
