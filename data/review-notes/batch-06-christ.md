# Batch 06 — Life of Christ (review notes)

**15 entries** in `data/entries/06-christ.json` (9 events, 6 figures). Jesus migrated out of `seed.json` (now begins at Peter) and kept verbatim.

| id | type | symbol | certainty |
|----|------|--------|-----------|
| herod-the-great | figure | herod-crown | **attested** |
| mary | figure | lily | traditional |
| joseph-of-nazareth | figure | carpenter-tools | traditional *(thread)* |
| annunciation-nativity | event | nativity-star | traditional |
| jesus | figure | chi-rho | **attested** *(thread)* |
| john-the-baptist | figure | baptist-shell | **attested** |
| pontius-pilate | figure | pilate-basin | **attested** |
| baptism-of-jesus | event | baptism-dove | **attested** |
| public-ministry-sermon | event | teaching-mount | **attested** |
| transfiguration | event | transfiguration-glory | traditional |
| triumphal-entry | event | donkey | traditional |
| last-supper | event | bread-cup | traditional |
| crucifixion | event | cross-thorns | **attested** |
| resurrection | event | empty-tomb | traditional |
| ascension | event | ascending-cloud | traditional |

## (a) The density cliff — solved with the linear axis (as agreed)
This batch was the one I warned about: ~9 non-thread events pack into AD 26–30. **No elastic axis** — the linear axis holds, and the cluster spreads *vertically*. One layout tweak: the band count went 8 → 10 (two far bands appended at ±525) because 9 non-thread events + 8 bands guaranteed exactly one overlap; sparse eras never reach the new bands, so their look is unchanged. **Verified: zero overlaps in the cluster**, and the Life of Christ reads as a radiant column of distinct emblems gathered around the Christ node, with the "opposed" edges (Herod, Pilate) and "contemporary" edges (Mary, John) fanning in.
- Honest caveat: it's a **cluster/column, not a perfectly-readable top-to-bottom sequence** — the events radiate chronologically but the outer bands sit far from the spine. The narrative order is delivered cleanly by the **"Through the Scriptures" journey** (which now walks same-year events in order — see the loader change below). I judged a hard-coded top-to-bottom stack not worth the special-casing/risk; say the word if you want it.

## (b) Loader change (small, worth knowing)
Same-year entries used to sort **alphabetically**, which ordered the AD 30 passion "Ascension, Crucifixion, Last Supper…" — wrong. Changed `lib/entries.ts` to break ties by **file order** (Array.sort is stable). Now the passion week reads in narrative order (Triumphal Entry → … → Ascension) both in the layout's band-fill and in the journey. Affects other same-year clusters cosmetically only (e.g. the Exodus events), for the better.

## (c) Line of promise — reaches its end through Joseph (verify)
Spine now ends **… → josiah → joseph-of-nazareth → jesus.** I edited **batch 5's Josiah** to point to Joseph (was → jesus), and Joseph → Jesus is the last link. This is deliberate and theologically loaded: Matthew traces David's royal line *through Joseph* (Matthew 1:16), then shifts wording at the last link — "Joseph **the husband of Mary**, of whom Jesus was born." Joseph's, Jesus's, Mary's, and the Nativity's entries all surface the **virgin birth** and the **Matthew-vs-Luke genealogy** difference as an open register point rather than smoothing it. Jesus is the end of the thread (only `jesus → peter`, teacher-to-disciple).

## (d) Register care — the crux entries
The three most register-sensitive entries got the most careful three-register handling:
- **Nativity** — Jesus's birth late in Herod's reign is history; the virgin birth is scripture/creed; the Quirinius census difficulty (Luke 2:2) is flagged honestly. `traditional`.
- **Crucifixion** — `attested` (Tacitus, *Annals* 15.44; the shamefulness of crucifixion as itself a kind of evidence); the *meaning* (atonement) held as confession, its theories "held, not resolved."
- **Resurrection** — flagged in-entry as **the timeline's most register-sensitive**: what history can weigh (the disciples' transformation, the empty-tomb report, the movement's explosion) vs. what history as history cannot certify or forbid (a bodily resurrection). Marked `traditional` — the church's central confession, "neither dressed up as neutral fact nor explained away."
- **Mary** carries a `traditions` panel (Catholic / Orthodox / Protestant on virginity, immaculate conception, assumption, intercession).
- **Attested figures** lean on real external evidence: Herod (Josephus, Masada/Herodium), John the Baptist (Josephus *Ant.* 18.5.2), Pilate (the Pilate Stone, Tacitus, Philo), the Baptism (criterion of embarrassment).

## (e) Symbols & map
14 new glyphs (herod-crown, lily, carpenter-tools, baptist-shell, pilate-basin, nativity-star, baptism-dove, teaching-mount, transfiguration-glory, donkey, bread-cup, cross-thorns, empty-tomb, ascending-cloud); the Crucifixion is a **plain cross + crown of thorns — no figure/likeness**. `symbols.json` updated. Map gains Nazareth, the Jordan, Galilee, Caesarea, Golgotha/Mount of Olives.

## Not yet done (awaiting your go for batch 7)
Apostolic age (~24 entries): Pentecost [revise], Martyrdom of Stephen, Conversion of Paul, Council of Jerusalem, Paul's journeys, Fall of Jerusalem (70); the apostles (Peter [revise], Andrew, James, John, Philip, Thomas, Matthew, remaining twelve grouped, Judas, Matthias, Mary Magdalene), Paul [revise], Barnabas, Timothy, Luke, Mark, Stephen, James the brother of Jesus. Peter/Paul/Pentecost migrate out of the seed — after that the seed holds only the four church-history seed entries (Nicaea, Great Schism, Luther, Westphalia).
