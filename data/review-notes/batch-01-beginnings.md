# Batch 01 — Beginnings (review notes)

**8 entries**, all `undated` (no `yearStart`/`yearEnd`/`dateDisplay`), all in the SCRIPTURE layer; figures also in PEOPLE. File: `data/entries/01-beginnings.json`.

| id | type | symbol | certainty | registers |
|----|------|--------|-----------|-----------|
| creation | event | genesis-burst | traditional | scripture, tradition |
| adam | figure | eden-tree | traditional | scripture |
| eve | figure | eden-fruit | traditional | scripture |
| the-fall | event | fall-serpent | traditional | scripture, tradition |
| cain-and-abel | event | twin-altars | traditional | scripture |
| noah | figure | ark | traditional | scripture, tradition |
| the-flood | event | covenant-bow | traditional | scripture, tradition, history |
| tower-of-babel | event | babel-tower | traditional | scripture, history |

## (a) Entries marked `contested` — and why there are none
**No entry in this batch is `contested`.** Per the manifest, the entire Beginnings zone is `undated` and pre-historical: these narratives are not disputes over a *date* or *attribution* (which is what `contested` flags) but accounts whose register is scripture/tradition and which external history cannot place at all. The honest marker for "carried by scripture/tradition, not externally corroborable" is `traditional`, which all eight carry. Where genuine disagreement exists it is surfaced *in prose* or in a `traditions` field (below), not by mislabeling the certainty.

## (b) Things I was genuinely uncertain about / judgment calls
1. **The "historical Adam/Eve" question.** This is a live, high-stakes debate (historical first pair vs. representative/literary figure of humanity). I did **not** adjudicate it — both `adam` and `eve` explicitly name the open question and keep the account in the scriptural register. Flagging because a reader could want the app to lean one way; by design it does not.
2. **Original sin vs. ancestral sin.** `the-fall` carries a `traditions` field (Catholic / Orthodox / Protestant). These are fair summaries but compressed; the Catholic "privation of original grace," Orthodox "ancestral sin / inherited mortality not guilt," and Reformed "imputed guilt + total depravity" distinctions are exactly the sort of thing worth a second eye. Trent (1546) is cited for the Catholic side.
3. **Flood parallels (`the-flood`).** I state that a relationship between Genesis and the Mesopotamian flood accounts (Ziusudra, *Atrahasis*, *Gilgamesh* XI) is widely held but its *implication* is contested, and give the range without picking. If you want the framing pushed harder in either direction (more/less weight to shared-memory vs. literary-borrowing), that's a wording call.
4. **Babel → Etemenanki (`tower-of-babel`).** I flagged the ziggurat identification (Babylon's Etemenanki) as scholarly *inference*, since the text names no structure. Kept deliberately hedged.
5. **"rib" vs "side" (`eve`).** Noted the *tsela* translation point as a genuine and ancient interpretive question — low-risk but worth confirming I represented it fairly.
6. **Sources.** Genesis entries are anchored on the **ESV Study Bible** notes and the **ODCC** (both certainly cover this material); **MacCulloch** is cited only on `noah`/`the-flood` for general ANE context, matching the seed. No citation was invented; where I couldn't ground a specific claim I kept it in the scriptural register rather than attributing it.

## (c) Grouping / deferral / structural notes
- **Eve added** (figure) per my recommended gap-fill for matriarch parity — you approved with "go." If you'd rather Eve be folded into Adam/the-fall instead, easy to change.
- **Cain & Abel** is **one event** entry (`cain-and-abel`); the manifest lists no Cain or Abel *figure* entries, so I did not create any. Seth is named in-prose only (condensed line-of-promise), not an entry.
- **Line of promise wired so far:** `adam → noah` (both in this batch) and `noah → abraham` (Abraham lives in `seed.json`, so the target exists — no dangling link). The condensed segments (Adam→Noah via Seth…Lamech; Noah→Abraham via Shem…Terah) are stated in the Adam and Noah articles. The full spine continues to fill in as later batches add their targets (the loader **fails the build on dangling relationship targets**, so each forward link is added when its target appears).
- **Adam ↔ Eve** uses a `contemporary` relationship — the schema has no spouse/family relation type. Flagging as a possible future schema note; for now `contemporary` is literally true and renders a faint link between them.
- **Seed reconciliation:** `creation`, `adam`, `noah` were **moved out of `seed.json`** into this batch file (expanded), so there are no duplicate ids. `seed.json` now begins at `abraham`. Adam's prose was updated (added the historical-Adam caveat; removed the "later batches may add" line); Noah's flood detail was trimmed since `the-flood` now carries it.
- **Symbols:** `data/symbols.json` created as the authoritative manifest (includes all seed symbols too). Five **new glyphs drawn** so this batch renders without placeholders: `eden-fruit`, `fall-serpent`, `twin-altars`, `covenant-bow`, `babel-tower`.
- **No `text`-type code change** was made — not needed until the biblical-books phase (batch 8).

## Not yet done (awaiting your go for batch 2)
Patriarchs: events (Call of Abraham, Abrahamic covenant, Binding of Isaac, Jacob & the twelve sons, Joseph in Egypt) + figures (Abraham [revise], Sarah, Isaac, Rebekah, Jacob, Leah & Rachel, Joseph, Job).
