# Batch 08 — Biblical Canon I: the Old Testament books (review notes)

**18 entries** in `data/entries/08-canon-ot.json`, all the new **`type: "text"`** — the first books-of-the-Bible batch. This batch also carried the one-time **schema + node-form setup** and a **new placement convention** you chose. 136 static pages, build green, **0 overlaps across all 129 nodes**.

## (a) The `text`-type setup (done first, as promised)
- `Entry.type` is now `"event" | "figure" | "text"`; loader validates it; entry pages label it **TEXT**.
- **New node form — the codex:** a portrait bound-book shape (`codexPathD`, `TEXT_R = 27`), rendered on the canvas and on detail/directory pages, visibly distinct from the figure **medallion** (circle) and the event **seal** (eight scalloped lobes). Verified in-browser next to "Fall of the Northern Kingdom" (a seal) — the three forms read apart at a glance.
- Text entries are **not** figures, so they don't appear in the Figures directory (correct — they're books), and the "Who was alive then?" contemporaries button stays figure-only.

## (b) Your placement decision — composition date + a thread to the setting
You chose: **a book sits where it was written**, with a faint dotted tether back to the era/figure it narrates. Implemented as a new relationship type **`describes`** (book → figure/event), styled as a quiet `ink-soft` dotted line (width 1.1, dash `1 8`) that sits at 0.55 opacity and brightens to 0.95 when you select the book or its subject. This is the honest, distinctive layer the events/figures couldn't show: **when Scripture was compiled**, not just when its stories are set.

The effect is exactly the "striking compilation cluster" the preview promised — most books gather in the **exile / post-exilic window (~600–150 BC)**, with tethers fanning back across the canvas to the beginnings, the exodus, David, Solomon, and the prophets.

**The sharpest case, deliberately:** **Daniel** — book node at **c. 165 BC** (Maccabean dating), a long tether reaching back to the Daniel *figure* at c. 605 BC. Its article names the reason (the visions track Greek history down to Antiochus IV, then blur at his death) and notes the Hebrew canon places Daniel among the Writings, not the Prophets. **Deuteronomy** likewise sits earlier than the other four Torah books (c. 622 BC, Josiah's scroll, 2 Kings 22) — the best-anchored critical date — so the Torah cluster is intentionally *not* a tidy stack.

## (c) The 18 entries
| group | entries | placed | tether → |
|-------|---------|--------|----------|
| **Framing** | the-tanakh *(Law/Prophets/Writings; canon formation; deuterocanon fault line)* | c. 180 BC | — |
| **Torah** | book-genesis, book-exodus, book-leviticus, book-numbers, book-deuteronomy | 6th–5th c. BC (Deut. 622) | creation, the-exodus, sinai-and-the-law, wilderness-wanderings, moses |
| **Histories** | the-former-prophets *(Joshua–Kings)*, the-post-exilic-histories *(Chron/Ezra/Neh/Esther)* | c. 560 / 390 BC | joshua, return-from-exile |
| **Wisdom** | book-psalms, book-proverbs, book-job, book-ecclesiastes, book-song-of-songs | 5th–3rd c. BC | david, solomon, job, solomon, solomon |
| **Major Prophets** | book-isaiah *(1st/2nd/3rd Isaiah)*, book-jeremiah *(+Lamentations; MT vs LXX)*, book-ezekiel, book-daniel | 6th c. / 165 BC | isaiah, jeremiah, ezekiel, daniel |
| **Minor Prophets** | the-book-of-the-twelve | c. 400 BC | minor-prophets |

All `certainty: "contested"` — OT authorship/dating is genuinely disputed across the board; the entries lay out the disagreement (traditional attribution vs. critical composition) rather than settling it. Every article keeps the three registers explicit and cites only real sources (**ESV/NIV Study Bible book introductions, ODCC**) plus the book's own `scriptureRefs`. No fabricated citations; no images (codex glyphs carry the nodes).

## (d) Cross-tradition honesty (`traditions` panels)
Where the canon differs, I added a neutral three-view panel: **the-tanakh** (39 / 46 / larger Orthodox), **book-daniel** (Greek additions: Susanna, Bel, Song of the Three), **book-jeremiah** (Baruch / Letter of Jeremiah), **the-post-exilic-histories** (Greek additions to Esther). The full New Testament + canon-formation treatment (Septuagint, Muratorian, Athanasius 367, Hippo/Carthage, Vulgate, KJV, the deuterocanon dispute) is **batch 9**.

## (e) 17 new glyphs (+1 reused)
tanakh-scrolls, genesis-dawn, exodus-staff, leviticus-altar, numbers-tents, deuteronomy-tablets, former-prophets-scroll, restoration-wall, psalter-harp, proverbs-lamp, ecclesiastes-hourglass, song-lily, isaiah-coal, jeremiah-almond, ezekiel-wheel, daniel-lion, twelve-scroll — all drawn in `emblems.tsx` and recorded in `symbols.json` with `node: "text"`. **book-job reuses the existing `job-whirlwind`** (shared with the Job figure; manifest `usedBy` updated).

## Judgment calls / things to check
1. **Placement philosophy is opinionated by design.** Composition dating foregrounds critical scholarship on the axis; every entry states the traditional view too, and the tether keeps the setting reachable. If any single book's placement feels wrong to you (Isaiah at 540 vs. its 8th-c. core is the other debatable one), it's a one-line `yearStart` change.
2. **`daniel-lion` glyph** reads a little like a sun/face at very small sizes (mane rays + face). Fine in the codex frame, but I can redraw it more lion-like if you want.
3. **Lamentations** is folded into the Jeremiah entry (traditional pairing) with a note that the Hebrew canon puts it among the Writings — rather than its own node.
4. **Ruth / Esther** are named inside the grouped history entries (with their Hebrew-canon placement noted), not given their own book nodes; the Ruth and Esther *figures* already exist from earlier batches.

## Not yet done
**Batch 9 = Biblical Canon II (New Testament books + canon formation).** Awaiting your go.
