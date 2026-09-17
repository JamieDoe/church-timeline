# Batch 07 — The Apostolic Age (review notes)

**24 entries** in `data/entries/07-apostolic.json` (18 figures, 6 events) — the largest batch, and the densest generation on the whole timeline. Peter, Paul, and Pentecost migrated out of `seed.json`, which now holds **only the four church-history seed entries** (Nicaea, Great Schism, Luther, Westphalia) — everything before AD 325 is now real batch content.

| group | entries | certainty |
|-------|---------|-----------|
| **The Twelve** | peter *(att)*, andrew, james-son-of-zebedee, john, philip, thomas, matthew, other-apostles *(grouped: Bartholomew, James-Alphaeus, Thaddaeus, Simon)*, judas-iscariot, matthias | mostly traditional |
| **Other disciples** | mary-magdalene, stephen, james-brother-of-jesus *(att)* | traditional / attested |
| **Paul's circle** | paul *(att)*, barnabas, timothy, luke, mark | attested / traditional |
| **Events** | pentecost, martyrdom-of-stephen, conversion-of-paul *(att)*, pauls-journeys *(att)*, council-of-jerusalem *(att)*, fall-of-jerusalem-70 *(att)* | mixed |

## (a) The density peak — handled on the linear axis
This is the hardest case for the linear-axis + vertical-fan approach: **a whole founding generation** (~18 figures) born within ~AD 1–17, i.e. ~25 px of horizontal room. There is no year-based spread that separates contemporaries. I bumped the band count **10 → 14** (out to ±655). **Verified: zero overlaps** across all 24 nodes. The result is a tall vertical column of distinct emblems gathered around the Christ node — with the **teacher-to-disciple edges radiating from Jesus to the twelve** (I wired `jesus →` each named apostle + Mary Magdalene in batch 6), so selecting Jesus lights up the whole apostolic band. Together with the Life of Christ this makes the "Christ & Apostles" era the tallest, busiest knot on the canvas — which is thematically right (the pivot of the whole story).
- **Honest tradeoff:** it's a tall column — when zoomed in to read labels you pan vertically through the apostles. This is the accepted cost of not distorting the time axis, and the apostolic age is the *worst* density case (later dense eras — church fathers, reformers — spread over centuries, not one generation, so they'll fan more easily). If the tall column bothers you, options are: group more of the twelve, or (last resort) revisit the axis. I judged it acceptable; your call.

## (b) The gold thread is complete — and stops at Jesus
The line of promise now runs its full length, **Adam → … → Joseph of Nazareth → Jesus, and ends there.** The apostles are deliberately *not* on the thread — the genealogy of promise arrives at Christ; from him the relationships become teacher→disciple and mission, not descent. "Follow the gold thread" now walks the complete Adam-to-Christ chain.

## (c) Relationship web (the People/Church layers come alive here)
- `jesus →` peter, andrew, james-son-of-zebedee, john, philip, thomas, matthew, other-apostles, judas-iscariot, mary-magdalene (**teacher-to-disciple** — the twelve).
- `matthias → judas-iscariot` (**succeeded** — the replacement).
- `andrew → peter` (contemporary, brothers); `peter → mark` (influenced — Mark from Peter's preaching); `barnabas → paul` (influenced — vouched for him); `paul → timothy` (teacher-to-disciple); `luke → paul` (contemporary); plus the kept `peter ↔ paul` (contemporary / opposed at Antioch) and `paul → luther` (influenced, across 15 centuries).

## (d) Register & accuracy notes
- **Attested where the evidence is real:** Paul (his own letters), his conversion/journeys/the Jerusalem council (cross-checked against Galatians), **James the brother of Jesus** (Josephus *Ant.* 20.9.1), and the **fall of Jerusalem AD 70** (Josephus, the Arch of Titus).
- **Judgment calls flagged in-entry, not smoothed:** what "brother of Jesus" means (full/half/step/cousin — tied to Mary's perpetual virginity); the **Mary Magdalene = penitent-prostitute** conflation (from Gregory the Great, 591) explicitly named as a later, unscriptural merge and set aside; the evangelists' Gospel authorship (Matthew, Mark, Luke, John) noted as traditional-and-debated, deferred to the book entries; the priority of Mark noted as the mainstream view.
- Pentecost's `yearStart` moved 33 → **30** to sit with the crucifixion/ascension I placed at 30 (dateDisplay still "AD 30 or 33").

## (e) One small engine change
`lib/entries.ts`: same-year entries now break ties by **file order** (stable sort), not alphabetically — so tight same-year clusters read in narrative order in both the layout and the journey. (This landed in batch 6; noting again as it matters for the passion week and any same-year apostolic events.)

## (f) Symbols & map
**21 new glyphs** (the evangelists' eagle/ox/winged-lion, Andrew's saltire, Thomas's reaching hand, Judas's thrown silver, Matthias's lots, the menorah of AD 70, the Damascus light, the ship, the opened door…); Peter keeps crossed-keys, Paul the scroll-and-sword, Pentecost the dove-and-flame. Map gains Damascus, Antioch, Ephesus, and Rome (Peter's martyrdom).

## Not yet done — the biblical narrative is now COMPLETE
Batches 8–9 are the **biblical canon** (the books of the Bible as `type: "text"` — which needs the one-time schema+node-form change I flagged), then batches 10–12 are **church history** (fathers, councils, medieval, Reformation). Awaiting your go for **batch 8** — and I'll do the `text`-type setup first.
