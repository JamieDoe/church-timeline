# Batch 04 — Conquest, Judges & United Monarchy (review notes)

**14 entries** in `data/entries/04-monarchy.json` (6 events, 8 figures). Samuel and David migrated out of `seed.json` (now begins at Jesus) and revised.

| id | type | symbol | certainty |
|----|------|--------|-----------|
| conquest-of-canaan | event | falling-walls | contested |
| period-of-the-judges | event | judges-sword | traditional |
| deborah | figure | palm-tree | traditional |
| gideon | figure | gideon-torch | traditional |
| samson | figure | broken-pillars | traditional |
| ruth | figure | gleaned-barley | traditional |
| samuel | figure | horn-of-oil | traditional |
| anointing-of-saul | event | anointing-crown | traditional |
| saul | figure | saul-spear | traditional |
| david-becomes-king | event | judah-lion | **attested** |
| david | figure | harp | **attested** |
| davidic-covenant | event | throne | traditional |
| solomon | figure | scales | contested |
| solomons-temple | event | temple | contested |

## (a) The certainty gradient (this batch teaches it)
This is the first batch where certainty genuinely varies, and the variation is the honest point:
- **Conquest of Canaan → `contested`.** One of the sharpest narrative-vs-archaeology gaps (Jericho/Ai excavations don't match a plain reading); models range from modified conquest to gradual internal emergence. Foregrounded, not smoothed.
- **Judges, Deborah, Gideon, Samson, Ruth, Saul, Samuel, Anointing of Saul → `traditional`.** Carried by scripture, thinly corroborated, but not the locus of a sharp scholarly dispute.
- **David & David-becomes-king → `attested`.** The Tel Dan Stele's "House of David" (9th c. BC) is real external attestation of the dynasty — the earliest on the timeline. I marked the *event* attested on that basis while noting the scriptural narrative (anointing, divine choice) is a separate, theological register.
- **Solomon & Solomon's Temple → `contested`.** The "high vs low chronology" debate over the united monarchy's scale is genuine; no direct evidence of Solomon or his temple survives. So the golden-age portrait is `contested` even though it sits right after the attested David — an honest, slightly counterintuitive gradient worth your eye.

## (b) Line of promise — extended through Solomon (verify)
Spine is now **adam → noah → abraham → isaac → jacob → david → solomon → jesus.** I changed David's edge from `david → jesus` to `david → solomon`, and added `solomon → jesus` (condensing Rehoboam…Joseph — Hezekiah and Josiah slot in during batch 5). Verified on Solomon's detail page: Connections show "David → line of promise" and "line of promise → Jesus Christ". Build is green (loader validates no dangling links).

## (c) Judgment calls / things to check
1. **Ruth is a figure node but NOT on the gold thread.** She's a mother in the Davidic line (great-grandmother of David, named in Matthew 1:5), but the thread is the patrilineal spine, so I connected her via prose (her article makes the Matthew-genealogy point prominently) rather than a line-of-promise edge that would visually yank the thread down to her. This follows the batch-2 plan for the Matthew-1 women. Flag if you'd rather she sit on the thread.
2. **Saul → David is `opposed`; Samuel → Saul and Samuel → David are `anointed`.** These give the People layer real relational lines (the prophet-who-makes-kings pattern). I did *not* add a David-succeeded-Saul edge to avoid over-cluttering David's node — say the word if you want it.
3. **Ten Commandments–style `traditions` panels** — none needed here; no clean three-way cross-tradition dispute in this batch.
4. **Sources** — ESV Study Bible + ODCC throughout (+ MacCulloch on the conquest and the united-monarchy debate). No citation invented.

## (d) Symbols
12 new glyphs drawn (`falling-walls`, `judges-sword`, `palm-tree`, `gideon-torch`, `broken-pillars`, `gleaned-barley`, `anointing-crown`, `saul-spear`, `judah-lion`, `throne`, `scales`, `temple`); `data/symbols.json` updated. Samuel keeps `horn-of-oil`, David keeps `harp`.

## (e) Map
New location points: Ruth → Bethlehem; David-becomes-king, David, Solomon, Solomon's Temple → Jerusalem (the label de-collision handles the Jerusalem cluster).

## Not yet done (awaiting your go for batch 5)
Divided Kingdom, Prophets & Exile (~22 entries): the kingdom divides, fall of the North (722), fall of Jerusalem & Exile (586), return & Second Temple; kings Jeroboam, Ahab & Jezebel, Hezekiah, Josiah; the prophets Elijah, Elisha, Isaiah, Jeremiah, Ezekiel, Daniel, Hosea, Amos, Jonah, Micah (+ minor prophets grouped); Esther, Ezra, Nehemiah. Hezekiah & Josiah will slot into the gold thread between Solomon and Jesus.
