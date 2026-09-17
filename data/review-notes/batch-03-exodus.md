# Batch 03 — Exodus, Law & Wilderness (review notes)

**11 entries** in `data/entries/03-exodus.json` (5 figures, 6 events). Moses and the Exodus were migrated out of `seed.json` (now begins at Samuel) and revised.

| id | type | symbol | certainty |
|----|------|--------|-----------|
| moses | figure | tablets | contested |
| the-exodus | event | pillar-fire | contested |
| passover | event | passover-door | contested |
| crossing-of-the-sea | event | parted-sea | contested |
| sinai-and-the-law | event | sinai-mountain | contested |
| golden-calf | event | golden-calf | contested |
| wilderness-wanderings | event | wilderness-path | contested |
| aaron | figure | aaron-rod | contested |
| miriam | figure | timbrel | contested |
| joshua | figure | joshua-trumpet | contested |
| caleb | figure | grape-cluster | contested |

## (a) Entries marked `contested` — all 11
The Exodus's **date is a genuine dispute** (early c. 1446 BC from 1 Kings 6:1 vs. late c. 1250 BC from the store-city of Raamses), and its **historicity and the conquest** are among the sharper debates in biblical archaeology (no Egyptian record of the departure; Jericho/Ai excavations don't match a plain reading). So the whole batch is `contested`, consistent with the seed's existing Moses and Exodus. Each entry states plainly what scripture narrates vs. what history can and cannot corroborate.

## (b) Genuine uncertainties / judgment calls
1. **Joshua & the conquest** — I foregrounded the archaeological tension (swift-conquest vs. gradual-emergence models) rather than smoothing it; this is the entry most likely to draw scrutiny, and I kept it visible by design.
2. **Sinai's location** — noted Jebel Musa as *one traditional candidate among several*; the mountain isn't securely identified.
3. **Ten Commandments numbering** — noted in-prose that the traditions number them differently (Jewish / Catholic-Lutheran / Reformed-Orthodox) rather than adding a full `traditions` field; flag if you'd want that expanded into the side-by-side format.
4. **Dating spread of the figures** — Aaron/Miriam/Joshua/Caleb dates are back-reckoned from Moses/the Exodus and carry the same "15th or 13th century BC (dating tied to the disputed Exodus date)" hedge; positions are placement only.
5. **Typology held as reading** — Passover→Christ ("our Passover lamb"), the sea→baptism, Joshua's name→Jesus: each attributed explicitly as a Christian *reading*, not a claim of the text.
6. **Sources** — ESV Study Bible + ODCC throughout (+ MacCulloch on Moses/Exodus, matching the seed). Caleb cites the ESV Study Bible only (I avoided inventing an ODCC "Caleb" entry).

## (c) Relationships
- `aaron → moses` (contemporary), `miriam → moses` (contemporary), `caleb → joshua` (contemporary).
- **`joshua → moses` (succeeded)** — the first use of the `succeeded` relation type; renders on both detail pages and as a distinct line on the canvas.
- Moses/the Exodus are **deliberately off the gold thread** — the line of promise runs Jacob → David through Judah's line, not through the Levite Moses. Correct per Matthew 1.

## (d) Symbols
9 new glyphs drawn (`pillar-fire`, `passover-door`, `sinai-mountain`, `golden-calf`, `wilderness-path`, `aaron-rod`, `timbrel`, `joshua-trumpet`, `grape-cluster`); `parted-sea` reassigned from the Exodus to **Crossing of the Sea**, and the Exodus now carries the pillar of cloud/fire. `data/symbols.json` updated.

## (e) Two feature changes made in this batch (per your requests)
1. **More spacing** — `PX_PER_YEAR` 1.3 → 1.6, vertical bands widened to `[±145, ±240, ±335, ±430]`, and the thread/band minimum gaps raised. The dense Exodus cluster (5 events all at ~1446 BC) now fans across bands instead of stacking.
2. **A second guided journey** — "❧ Through the Scriptures" now sits beside "✦ Follow the gold thread." It flies node-to-node through the whole biblical story in chronological order (currently 36 scripture-layer entries), with the same placard/Previous/Next/Exit controls. **Note:** this walks the biblical *narrative*; a dedicated **canonical journey through the books of the Bible** will slot into the same mechanism once the books (type `text`) are added in batch 8.

## Not yet done (awaiting your go for batch 4)
Conquest, Judges & United Monarchy: events (Conquest of Canaan, the Judges, Anointing of Saul, David becomes king, Davidic covenant, Solomon's Temple) + figures (Deborah, Gideon, Samson, Ruth, Samuel [revise], Saul, David [revise], Solomon).
