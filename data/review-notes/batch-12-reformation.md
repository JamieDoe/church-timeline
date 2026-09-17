# Batch 12 — The Reformation (review notes) · THE FINAL CONTENT BATCH

**17 entries** in `data/entries/12-reformation.json` — the Reformation and its settlement, **AD 1516–1648** (Erasmus to the eve of the Peace of Westphalia). This completes the church-history arc and **the whole content plan**: the canvas now runs unbroken from Creation to 1648. 215 static pages, build green, **0 overlaps across all 208 nodes**.

## (a) The 17 entries
| stream | entries |
|--------|---------|
| **Humanist prelude** | erasmus *(1516)* |
| **German Reformation** | the-95-theses *(1517, event)*, the-diet-of-worms *(1521, event)*, the-augsburg-confession *(1530, **text**)* |
| **Reformed / Swiss** | huldrych-zwingli *(1523)*, john-calvin *(1541)*, john-knox *(1560)* |
| **Radical** | the-anabaptists *(1525, event)* |
| **English** | the-english-reformation *(1534, event)*, thomas-cranmer *(1549)*, the-book-of-common-prayer *(1549, **text**)* |
| **Counter-Reformation** | ignatius-loyola *(1540)*, the-council-of-trent *(1550, event)*, teresa-of-avila *(1570)* |
| **Wars & settlement** | the-peace-of-augsburg *(1555, event)*, st-bartholomews-day-massacre *(1572, event)*, the-thirty-years-war *(1630, event)* |

All `certainty: "attested"`. Sources real throughout (ODCC, MacCulloch, González); no fabrication, no images.

## (b) `split-from` — finally demoed ★
The long-unused **`split-from`** edge (crimson, solid, width 2.5 — the boldest edge style) at last has its use: **the-anabaptists → huldrych-zwingli**. Historically exact — the first Anabaptists were Zwingli's own Zurich followers who broke with him over infant baptism in 1525. Verified in-browser: selecting the Anabaptists lights the solid crimson line to Zwingli.

## (c) The relationship web ties the whole church-history arc together
- **The Protestant fracturing:** zwingli → luther (**opposed** — the Marburg split over the Eucharist); the-anabaptists → zwingli (**split-from**).
- **The Reformed lineage:** zwingli → calvin → knox (influenced, then teacher-to-disciple: Knox trained in Calvin's Geneva).
- **The Catholic response:** loyola → the-council-of-trent (influenced); the-council-of-trent → luther (**opposed**).
- **English:** cranmer → the-english-reformation (influenced).
- **Converging on Luther:** with erasmus → luther (influenced) added here, Luther is now the hub of five incoming/opposed edges spanning the whole timeline — **augustine → luther** (batch 10, 11 centuries), **jan-hus → luther** and **wycliffe → hus** (batch 11), **erasmus → luther**, plus **zwingli/trent → luther** (opposed). The seed `martin-luther` node was left as-is; all these edges point *to* it, so it needed no editing.
- **Batch-9 tie-back:** the Reformation Bibles (luther-bible 1522, tyndale 1526, KJV 1611) already sit in this window from the canon batch, and **wycliffe → tyndale** (batch 11) reaches into it.

## (d) Honesty on the violence and the whole ("all sides")
The Reformation is not told as a hero story. The entries state plainly: the Anabaptists were **persecuted by Catholics and Protestants alike** (drowned, burned); Calvin's Geneva **burned Servetus** (named in his entry); the **St Bartholomew's Day Massacre** of the Huguenots; and the **Thirty Years' War** that killed a third of some regions before Europe wearied of religious war. `traditions`-style even-handedness carries through — the Catholic Reformation (Trent, Loyola, Teresa) is given its due as genuine renewal, not merely reaction. **Teresa of Ávila** is a full figure node (a woman leading reform; Doctor of the Church).

## (e) 16 new glyphs (Trent reuses council-assembly)
Verified in-browser: anabaptist-drops, zwingli-sword-bible, plus (from the same view) the batch-11 plague-skull and hus-goose. Others: erasmus-quill, theses-nail, hand-on-bible (Worms), confession-articles, supremacy-crown (English Ref.), jesuit-ihs (the IHS monogram in rays), calvin-hand-heart (his seal), cranmer-hand (thrust into the flames), common-prayer (praying hands), augsburg-peace (two pennants), knox-trumpet, teresa-heart (the transverberation arrow), bartholomew-massacre, thirty-years-swords. **`symbols.json` now 198 entries.**

## (f) Where the timeline ends
The seed **peace-of-westphalia (1648)** sits just past the Thirty Years' War as the timeline's closing node — the end of Europe's wars of religion and of the story this project set out to tell. `martin-luther` and `peace-of-westphalia` seed nodes were kept in place and integrated by the new edges/neighbours around them.

## Judgment calls / things to check
1. **Luther's seed node not expanded** — I chose to enrich it purely by connection (5 edges now point to it) rather than rewrite the seed article. If you'd like the Luther *entry itself* fleshed out to match the depth of Calvin/Aquinas/Augustine, that's a small follow-up.
2. **the-english-reformation** is one event node for the whole English arc (Henry → Edward → Mary → Elizabeth's *via media*), with Cranmer + the BCP as its figures; not split into multiple events.
3. **Grouping:** the Anabaptists are one movement node (Menno Simons named within); no separate Zwingli-vs-Luther "Marburg" event (carried by the `opposed` edge + prose).

## The content plan is complete
All **12 batches** are done: Beginnings → Patriarchs → Exodus → Monarchy → Prophets/Exile → Christ → Apostolic → OT books → NT/canon → Fathers/Councils → Medieval → **Reformation**. 208 canvas nodes, 215 pages, build green. Possible next steps if you want them: expand the Luther seed entry; a final end-to-end pass (Figures directory, Map coverage for the new places, the About page); or a "Key" review now that all node forms, edge types, and layers are in use.
