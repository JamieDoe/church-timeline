# Batch 05 — Divided Kingdom, Prophets & Exile (review notes)

**22 entries** in `data/entries/05-prophets.json` (5 events, 17 figures) — the largest biblical batch. Nothing migrated from the seed this time (Samuel/David already moved in batch 4); the seed now holds only the New Testament / church seed entries.

| id | type | symbol | certainty |
|----|------|--------|-----------|
| kingdom-divides | event | torn-robe | attested |
| jeroboam | figure | golden-calf *(reused)* | traditional |
| ahab | figure | baal-idol | **attested** |
| elijah | figure | fiery-chariot | traditional |
| elisha | figure | mantle | traditional |
| amos | figure | plumb-line | traditional |
| hosea | figure | love-heart | traditional |
| jonah | figure | jonah-fish | **contested** |
| isaiah | figure | burning-coal | traditional |
| micah | figure | plowshare | traditional |
| fall-of-samaria | event | broken-city | **attested** |
| hezekiah | figure | sundial | **attested** *(thread)* |
| josiah | figure | found-scroll | **attested** *(thread)* |
| jeremiah | figure | yoke | traditional |
| ezekiel | figure | ezekiel-wheels | traditional |
| daniel | figure | lions-den | **contested** |
| fall-of-jerusalem | event | burning-temple | **attested** |
| return-from-exile | event | rising-temple | **attested** |
| minor-prophets | figure | scroll-twelve | traditional |
| esther | figure | queen-scepter | **contested** |
| ezra | figure | scribe-scroll | traditional |
| nehemiah | figure | wall-trowel | traditional |

## (a) Certainty gradient — the point of this era
This is where the timeline's evidential honesty pays off most:
- **`attested`** (firm history): the divided-monarchy framework; **Ahab** (Assyrian Kurkh Monolith, Moabite Mesha Stele); the **fall of Samaria** (Assyrian annals, 722); **Hezekiah** (Sennacherib's annals, the Siloam tunnel + bullae); **Josiah** (well-anchored era, death at Megiddo); the **fall of Jerusalem** (Babylonian Chronicles + 586 destruction layer); the **return** (Cyrus Cylinder). From the divided monarchy on, the Bible and the spade agree far more.
- **`traditional`**: the prophets whose ministries are anchored to attested events but who are not themselves named outside scripture (Elijah, Elisha, Isaiah, Jeremiah, Ezekiel, the four named minor prophets + the grouped Twelve), plus Ezra & Nehemiah (Nehemiah's opponent Sanballat *is* attested at Elephantine — noted).
- **`contested`** (three genuine scholarly disputes, each explained in-entry, none resolved):
  - **Daniel** — the sharpest: traditional 6th-c. exilic authorship vs. the majority-critical 2nd-c. (Maccabean) dating of the book.
  - **Jonah** — a real genre question: historical narrative vs. didactic parable/satire; date of composition uncertain.
  - **Esther** — historicity debated (no Persian record of a Jewish queen; reads to many as a Purim novella); I also noted the book never names God.

## (b) Line of promise — extended through the reforming kings (verified)
Spine is now **… → david → solomon → hezekiah → josiah → jesus.** I edited **batch 4's Solomon** to point to Hezekiah (was → jesus), then added `hezekiah → josiah` and `josiah → jesus`. Verified on the canvas: Hezekiah (y≈467) and Josiah (y≈463) sit on the spine with gold rings, while prophets like Isaiah (y≈260) fan off into the bands. **Note the deliberate split:** the two reforming *Judahite* kings ride the thread (they're on Matthew 1); the *northern* kings Jeroboam and Ahab are off-thread — the promise runs down the southern, Davidic track only, which the entries make explicit.

## (c) People-layer relationships (the prophet-to-king pattern)
- `elijah → ahab` (prophet-to-king), `isaiah → hezekiah` (prophet-to-king) — the paradigm of the prophet who speaks to the throne, matching the pattern named in Samuel's entry.
- `elisha → elijah` (succeeded — the mantle passed on).
- `nehemiah → ezra` (contemporary — the post-exilic rebuilders).

## (d) Judgment calls / things to check
1. **Jeroboam reuses the `golden-calf` glyph** — deliberate (his Bethel/Dan calves consciously echo Sinai), and his article says so. Flag if you'd rather he have a distinct emblem.
2. **"The Minor Prophets" is one grouped figure** covering the eight of the Twelve not given their own entry (Joel, Obadiah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi), with Hosea/Amos/Jonah/Micah standing separately — per the manifest's "remaining minor prophets may be grouped." The *books* get fuller treatment in the canon batches.
3. **Ahab's entry is titled "Ahab & Jezebel"** (manifest grouping); Jezebel has no separate node.
4. **Isaiah's authorship** (One/Second/Third Isaiah) and **Daniel's dating** are flagged in-prose but belong more fully to the book entries (batches 8–9); the figure entries keep it brief.
5. **Sources** — ESV Study Bible + ODCC throughout, MacCulloch on the well-attested political events. No citation invented.

## (e) Symbols & map
- **21 new glyphs** drawn (torn-robe, broken-city, burning-temple, rising-temple, baal-idol, sundial, found-scroll, fiery-chariot, mantle, burning-coal, yoke, ezekiel-wheels, lions-den, love-heart, plumb-line, jonah-fish, plowshare, scroll-twelve, queen-scepter, scribe-scroll, wall-trowel); Jeroboam reuses `golden-calf`. `data/symbols.json` updated.
- **Map** gains Samaria, Babylon (Ezekiel/Daniel), Susa (Esther — off-chart, listed below the map), and more Jerusalem points (de-collision handles the cluster).

## Not yet done (awaiting your go for batch 6)
Life of Christ (~15 entries): Annunciation & Nativity, Baptism, public ministry & Sermon on the Mount, Transfiguration, Triumphal entry, Last Supper, Crucifixion, Resurrection, Ascension; Mary, Joseph of Nazareth, John the Baptist, Jesus [revise], Herod the Great, Pontius Pilate. **⚠️ This is the density cliff I flagged earlier** — ~15 entries inside ~38 years (roughly 6 BC–AD 33). The current band-fan layout will struggle; I may need the "rubber"/non-linear axis for that stretch. I'll raise it concretely when we start batch 6.
