# Batch 11 — The medieval Church (review notes)

**21 entries** in `data/entries/11-medieval.json` — the second church-history batch, spanning **AD ~530–1453** (Benedict to the fall of Constantinople). With this, the `church`-layer red band now runs unbroken across the whole AD region: the canvas tells the full arc — brown *Scripture* → red *Church* — from creation to the eve of the Reformation. 198 static pages, build green, **0 overlaps across all 191 nodes**.

## (a) The 21 entries
| era | entries |
|-----|---------|
| **After Rome's fall** | benedict-of-nursia *(530)*, gregory-the-great *(595)*, the-rise-of-islam *(622, event)* |
| **Councils & empire** | second-council-of-nicaea *(787, event — 7th & last shared council)*, charlemagne *(800)* |
| **Reform & crusade** | the-investiture-controversy *(1085, event)*, anselm-of-canterbury *(1095)*, the-first-crusade *(1096, event)* |
| **12th c.** | bernard-of-clairvaux *(1125)*, hildegard-of-bingen *(1150)* |
| **Friars & scholastics** | francis-of-assisi *(1210)*, dominic *(1216)*, thomas-aquinas *(1270)* |
| **Late-medieval crisis** | the-avignon-papacy *(1309, event)*, the-black-death *(1348, event)*, catherine-of-siena *(1370)*, the-western-schism *(1378, event)* |
| **Pre-Reformation & the fall** | john-wycliffe *(1382)*, jan-hus *(1415)*, the-imitation-of-christ *(1420, **text/codex**)*, fall-of-constantinople *(1453, event)* |

All `certainty: "attested"` (well-documented). Legends (Benedict's raven, Francis's stigmata, Catherine's mystical marriage, Hildegard's visions) are flagged as tradition *inside* attested lives. Sources are real throughout (ODCC, González, MacCulloch); no fabrication, no images.

## (b) The relationship web — the pre-Reformation chain
- **Teaching & study:** gregory → benedict (influenced); anselm → aquinas, dominic → aquinas (Aquinas the Dominican); bernard ↔ hildegard (contemporary); francis ↔ dominic (contemporary — the two friar movements).
- **The road to Wittenberg:** **wycliffe → jan-hus → martin-luther** (influenced) — a visible pre-Reformation chain reaching from 1382 to 1517; plus **wycliffe → tyndale-new-testament** (the English-Bible lineage, an edge back to batch 9). With batch 10's **augustine → luther**, three long threads now converge on the Reformation node to come.
- **Reform pressure:** catherine → the-avignon-papacy (opposed — she helped end the exile).

## (c) Honesty on the hard parts
- **The Crusades** entry states the dark legacy plainly — the Rhineland massacres of Jews, the 1204 crusader sack of Christian Constantinople — neither glorified nor erased.
- **The rise of Islam** is framed explicitly as *historical context* (how the Christian map was reshaped, three of five patriarchates lost), not a claim about Islam itself.
- **The Black Death** notes the scapegoating and persecution of Jews alongside the spiritual aftershocks.
- **Women given real weight:** Hildegard (visionary, composer, Doctor of the Church) and Catherine (mystic, letter-writer who moved a pope) are full figure nodes, not footnotes.

## (d) Integration
- **great-schism (1054)** already exists in `seed.json` and sits right in this stretch — left in place; the E–W estrangement is set up by batch 10's *filioque* (Creed) and this batch's crusader sack of Constantinople.
- **the-western-schism (1378, rival popes)** is deliberately distinct from **great-schism (1054, East–West)** — different glyphs (schism-two-tiaras vs the seed's split-circle), different events; the notes flag the easy-to-confuse naming.

## (e) 20 new glyphs (second-council-of-nicaea reuses council-assembly)
Verified in-browser: crusade-cross (the Jerusalem cross — cross potent + four crosslets), francis-birds, and hus-goose (the goose + martyr's flame) all read clearly. Others: benedict-raven, papal-tiara, islam-crescent, imperial-crown, investiture-clash (crozier × sword), anselm-fides, three-mitres, hildegard-feather, dominic-star, aquinas-sun, catherine-ring, avignon-tiara, schism-two-tiaras, wycliffe-star, plague-skull, imitatio-steps, constantinople-dome. `symbols.json` now 182 entries.

## Judgment calls / things to check
1. **Grouping vs individual:** kept Francis and Dominic as separate nodes (distinct movements) rather than grouping; the Cappadocian-style grouping was reserved for genuinely-treated-as-one sets.
2. **the-first-crusade id** covers *the Crusades* broadly (1095–1291), titled "The Crusades" — one node for the whole movement rather than one per crusade.
3. **Some glyphs are dense** at tiny scale (benedict-raven, francis-birds) — legible in the medallion but busy; flag any you'd like simplified.

## Not yet done
**Batch 12 = the Reformation** (Erasmus, Luther & the 95 Theses, the Diet of Worms, the Swiss/Reformed stream — Zwingli & Calvin, the Anabaptists, the English Reformation — Henry VIII & Cranmer, the Catholic/Counter-Reformation — Trent, Loyola & the Jesuits, the wars of religion → the Peace of Westphalia which already exists as a seed node). This is the **final content batch** — `martin-luther` and `peace-of-westphalia` seed nodes to expand/integrate, and the natural home for the `split-from` edge (Protestant bodies splitting from Rome). Awaiting your go.
