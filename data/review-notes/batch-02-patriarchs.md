# Batch 02 — Patriarchs (review notes)

**13 entries** in `data/entries/02-patriarchs.json` (8 figures, 5 events), spanning the traditional patriarchal age (c. 2000–1640 BC). Abraham was migrated out of `seed.json` and revised.

| id | type | symbol | certainty |
|----|------|--------|-----------|
| abraham | figure | tent-stars | contested |
| call-of-abraham | event | call-road | contested |
| sarah | figure | cradle | contested |
| abrahamic-covenant | event | covenant-torch | contested |
| isaac | figure | isaac-well | contested |
| binding-of-isaac | event | altar-ram | contested |
| rebekah | figure | water-jar | contested |
| jacob | figure | jacob-ladder | contested |
| leah-and-rachel | figure | twin-branches | contested |
| jacob-and-the-twelve | event | twelve-tribes | contested |
| joseph | figure | joseph-coat | contested |
| joseph-in-egypt | event | grain-sheaves | contested |
| job | figure | job-whirlwind | contested |

## (a) Entries marked `contested` — and why (all 13)
Per your manifest ("Patriarchal era — traditional dating, mark contested"), **the whole batch is `contested`.** This is also the honest reading: the historicity *and* dating of the patriarchal age is one of the genuinely live debates in the field (a historical core vs. later literary/theological composition; the traditional early-2nd-millennium setting vs. much later dates). It is an era-level dispute, so it attaches to the matriarchs (Sarah, Rebekah, Leah & Rachel) as much as to the patriarchs — they are part of the same narrative complex, not a separate evidential category. Each article states the register plainly and never presents the narrative as settled secular history.

**Judgment call to flag:** this **reclassifies Abraham from `traditional` → `contested`** (he was `traditional` in the seed you reviewed). I think `contested` is the more precise marker and it follows the manifest, but if you'd rather the patriarchs read `traditional` (thinly-corroborated tradition) — or want a split (primary patriarchs `contested`, matriarchs `traditional`) — it's a quick change. **This is the main thing to confirm.**

## (b) Genuine uncertainties / judgment calls
1. **Job's placement — the shakiest call in the batch.** The book gives Job no king, Exodus, or Law, and he seems non-Israelite; the *setting* reads patriarchal, so tradition often locates him there, and that's where I put him — **loosely, with the plainest caveat in the article**. But the book's *composition* date is separately and widely debated (exilic/post-exilic proposals included), and whether Job is historical or the protagonist of a wisdom poem is itself open. His canvas position (c. 1900 BC) is a convenience, not a claim. **Flag if you'd prefer Job deferred, undated, or handled another way** — the book of Job (the text) is separately slated for batch 8.
2. **Dates are traditional back-reckonings, not defensible points.** All year values are inferred from Genesis's internal chronology (Abraham c. 2000, then Isaac/Jacob/Joseph spaced by the biblical generation gaps). They exist only to order the nodes; every `dateDisplay` carries the hedge. The canvas now shows a **compact** date ("c. 1900 BC"); the full nuance ("c. 1900–1720 BC (traditional; dating debated)") is in the placard and detail page.
3. **Matthew-1 women** surfaced in `jacob-and-the-twelve`: I noted that the Judah→David line Matthew traces runs through Tamar, Rahab, and Ruth, and that Matthew's inclusion of women is itself striking. Ruth becomes a real node in batch 4; Tamar/Rahab remain in-prose notes (not standalone entries), per the approved plan.
4. **Typology, held as a reading.** Where Christian tradition reads Isaac's binding or Joseph's rejection-and-exaltation as figures of Christ, I attribute it explicitly as *a reading*, not a claim of the text (binding-of-isaac also sets the Jewish *Akedah* alongside it).
5. **Sources:** anchored on ESV Study Bible + ODCC throughout; MacCulloch cited only on Abraham (general context). No citation invented.

## (c) Line of promise — rewired (verify this)
The spine now threads through named entries: **adam → noah → abraham → isaac → jacob → david → jesus.** Concretely I changed Abraham's edge from `abraham → david` to `abraham → isaac`, and added `isaac → jacob` and `jacob → david` (David lives in `seed.json`; target resolves, no dangling link — build is green). The Judah→David generations stay condensed in prose. Verified on the canvas (thread flows Abraham→Isaac→Jacob) and on Jacob's detail page (Connections: Isaac → / → David, plus contemporary edges from Leah & Rachel and Joseph).

## (d) Structural / other notes
- **Spouse/son links use `contemporary`** (Sarah→Abraham, Rebekah→Isaac, Leah & Rachel→Jacob, Joseph→Jacob) — the schema still has no family/spouse relation type. Same flag as batch 1.
- **12 new emblem glyphs drawn** (call-road, covenant-torch, cradle, isaac-well, altar-ram, water-jar, jacob-ladder, twin-branches, twelve-tribes, joseph-coat, grain-sheaves, job-whirlwind); `data/symbols.json` updated. Abraham keeps `tent-stars`.
- **Canvas layout reworked to fit the denser data** (the patriarchal generations cluster in ~300 years and overcrowded the axis): (1) `PX_PER_YEAR` 0.6 → 1.3 for more horizontal room; (2) node labels now show a **compact** date via a new `shortDate()` helper, full `dateDisplay` reserved for the placard/detail page; (3) the non-thread layout now fans nodes across **8 vertical bands** (nearest the spine first, each node placed in the band with the most horizontal clearance) so dense clusters spread out instead of stacking, and consecutive **thread nodes get a minimum horizontal gap** so grandfather→father→son don't pile up. Verified in-browser: the patriarchal era is now clearly spaced.
- **Locations added** (for the map): Abraham→Hebron (kept), Call of Abraham→Shechem, Joseph in Egypt→Goshen.
- **seed.json** now begins at Moses (Abraham migrated out).

## Not yet done (awaiting your go for batch 3)
Exodus, Law & Wilderness: events (The Exodus [revise], Passover, Crossing of the sea, Sinai/Ten Commandments, Golden Calf, Wilderness wanderings) + figures (Moses [revise], Aaron, Miriam, Joshua, Caleb).
