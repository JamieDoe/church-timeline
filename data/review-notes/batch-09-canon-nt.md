# Batch 09 — Biblical Canon II: the New Testament & canon formation (review notes)

**18 entries** in `data/entries/09-canon-nt.json` — the New Testament books plus the story of how the whole Bible was gathered, translated, and transmitted. 154 static pages, build green, **0 overlaps across all 147 nodes**. Reused the batch-8 machinery (`type:"text"`, codex form, `describes` tether) — no new schema work.

## (a) The 18 entries
| group | entries | placed | tether → |
|-------|---------|--------|----------|
| **NT books** | the-pauline-epistles *(att)*, book-mark, book-matthew, book-luke, book-acts, book-john, the-general-epistles *(Hebrews + catholic epistles)*, book-revelation | AD 54–96 | paul, jesus ×4, pentecost, peter, john |
| **Framing** | the-new-testament-canon *(how the 27 were recognized; Marcion; disputed books)* | AD 250 | — |
| **Formation** | the-septuagint *(att)*, the-muratorian-fragment *(att)*, athanasius-367 *(att)*, councils-of-hippo-carthage *(event, att)*, the-vulgate *(att)*, the-masoretic-text *(att)* | 260 BC – AD 900 | septuagint → the-tanakh |
| **Translations** | luther-bible, tyndale-new-testament, king-james-version *(all att)* | AD 1522–1611 | — |

The batch stretches the canon story from the **Septuagint (c. 260 BC)** — tethered to the Tanakh node — all the way to the **King James Version (1611)** at the far right, populating the long, formerly-near-empty AD 100–1611 stretch and setting up the church-history batches.

## (b) Certainty gradient (deliberate, and honest)
- **OT books (batch 8): contested** — authorship/dating genuinely disputed.
- **Gospels + Acts + Revelation + general epistles: contested** — anonymous texts, traditional authorship debated (Markan priority, Q, the "beloved disciple," John of Patmos, 2 Peter as latest/pseudonymous all stated plainly).
- **the-pauline-epistles: attested** — the seven undisputed letters are among the most securely authored texts of antiquity; the disputed/Deutero-Pauline/Pastoral spectrum is spelled out inside.
- **Canon transmission: attested** — the LXX, Muratorian fragment, Athanasius' 367 letter, Hippo/Carthage, Vulgate, Masoretic Text, and the three Reformation Bibles are well-documented history.

Every article keeps the three registers explicit and cites only real sources (ESV/NIV Study Bible intros, ODCC, González, Chadwick, MacCulloch) — no fabricated citations, no images.

## (c) Emblem reuse — the four living creatures
The Gospel codices carry the **tetramorph**: book-mark → the existing **winged-lion**, book-luke → **ox**, book-john → **eagle** (reused from the evangelist *figures*; `usedBy` updated). **book-matthew** gets a new **winged-man** (the figure uses money-bag, so the man was free). **the-pauline-epistles** reuses Paul's **scroll-sword** (whose manifest basis was already "the Pauline epistles"), and **luther-bible** reuses the **luther-rose**. **13 new glyphs** drawn for the rest (Alpha-Omega, the Septuagint's two-column scroll, the torn Muratorian fragment, Athanasius' festal list, the ratifying seal, Jerome's Vulgate cross-and-quill, the Masoretic vowel points, Tyndale's flame, the KJV crown, etc.). All recorded in `symbols.json` (now 141 symbols).

## (d) Bug caught and fixed during verification
First pass, I wrote the **NT-book `yearStart` as negative** (BC) while their `dateDisplay` said "AD" — so Matthew, Mark, etc. rendered at "c. 85 BC," sitting *before* Christ. Caught it on the canvas, flipped all eight to positive AD (54–96), rebuilt, and **re-verified 0 overlaps** in the now-denser apostolic+NT window (the band-fan absorbed it). Placards and labels now read AD correctly (verified in-browser: Mark AD 68, Luke AD 83, KJV 1611).

## Judgment calls / things to check
1. **Same composition-placement convention as batch 8** — foregrounds critical dating on the axis, states the traditional view in every entry, tethers keep the setting reachable. The 4 Gospels all tether to Jesus (thematically: the fourfold witness converging on Christ).
2. **Groupings:** Hebrews is placed with the general epistles (anonymous, not Paul — stated); the 13 Pauline letters are one clustered node; the deuterocanon dispute lives in `traditions` panels on the Septuagint (and, from batch 8, Tanakh/Daniel/Jeremiah).
3. **Layers:** NT books are `scripture`; the formation/translation nodes are `["scripture","church"]` (so they show under both toggles); the Hippo/Carthage council and the Muratorian fragment are `church`.
4. **`winged-lion` in Mark's codex** reads a little sun-like at tiny glyph scale (it's the existing evangelist glyph, unchanged) — flag if you want it clearer.

## Not yet done
The **biblical canon is now complete** (OT + NT + transmission). **NEXT: batches 10–12 = church history** — the fathers and councils, the medieval church, and the Reformation. Awaiting your go.
