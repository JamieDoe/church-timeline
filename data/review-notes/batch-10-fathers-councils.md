# Batch 10 — The Church Fathers & the ecumenical councils (review notes)

**23 entries** in `data/entries/10-fathers-councils.json` — the first of three church-history batches. This opens the **patristic era (AD ~96–451)** and turns the region right of Christ into a distinct **crimson `church`-layer band**, so the canvas now reads brown *Scripture* → red *Church* across the apostolic transition. 177 static pages, build green, **0 overlaps across all 170 nodes**.

## (a) The 23 entries
| group | entries |
|-------|---------|
| **Apostolic Fathers** | clement-of-rome *(96)*, ignatius-of-antioch *(108)*, polycarp *(155)* |
| **Apologists / 2nd c.** | justin-martyr *(160)*, irenaeus *(190)* |
| **3rd c. theologians** | tertullian *(200)*, origen *(230)*, cyprian *(258)* |
| **The turn under Constantine** | diocletianic-persecution *(303, event)*, edict-of-milan *(313, event)*, constantine *(320)*, arian-controversy *(340, event)*, the-nicene-creed *(325, **text/codex**)* |
| **Monasticism** | antony-of-egypt *(330)* |
| **4th-c. giants** | athanasius *(350)*, the-cappadocian-fathers *(375, grouped)*, ambrose-of-milan *(385)*, john-chrysostom *(398)*, jerome *(405)*, augustine-of-hippo *(418)* |
| **Later councils** | council-of-constantinople-i *(381)*, council-of-ephesus *(431)*, council-of-chalcedon *(451)* — all events |

Nearly all `certainty: "attested"` — these are well-documented history. Legendary details (Polycarp's fire, Ambrose's bees, Jerome's lion, Constantine's vision) are flagged as tradition *inside* attested lives. Every article cites only real sources (ODCC, Chadwick, González, MacCulloch) — no fabrication, no images.

## (b) Integration with what already exists
- **council-of-nicaea (325)** already existed in `seed.json` — left in place; new entries point *to* it (constantine → nicaea, athanasius → nicaea) rather than duplicating it.
- The canon-formation nodes from batch 9 sit in this same stretch: **athanasius-367** (the text — Athanasius' festal letter) is distinct from the new **athanasius** figure; the entry cross-references it. **the-vulgate** (400) sits right by the new **jerome** figure (405), who made it.

## (c) The relationship web (church history comes alive)
- **Chains of teaching:** john → polycarp → irenaeus (teacher-to-disciple); ambrose → augustine (Ambrose baptized him); tertullian → cyprian; origen → the-cappadocians.
- **Doctrine & conflict:** athanasius → arian-controversy (opposed); the-nicene-creed → arian-controversy (opposed); the-cappadocians → council-of-constantinople-i (Gregory of Nazianzus presided).
- **Church & empire:** constantine → edict-of-milan, constantine → council-of-nicaea (influenced/convened).
- **The long arc:** **augustine → martin-luther** (influenced) — an 11-century edge, since Luther was an Augustinian friar; it visibly reaches from AD 418 to 1517, tying the fathers to the Reformation batch to come.

## (d) Doctrine handled with three-tradition care
`traditions` panels where it matters: **the-nicene-creed** (the *filioque* — Western vs Eastern text), **council-of-chalcedon** (received by Catholic/Orthodox/Protestant, and the honest note that the **Oriental Orthodox** separated over its language — the first great lasting split). Ephesus notes the **Church of the East** ("Nestorian") separation. These splits are stated plainly in prose (no `split-from` edge yet — no separate church-body nodes exist; that edge's natural home is still the Reformation branch).

## (e) 21 new glyphs (+ council-of-nicaea keeps council-codex)
Verified in-browser: ignatius-chains, arian-iota (the gold iota flanked by opposing arrows — the "one letter" the doctrine of God hung on), athanasius-shield, justin-pallium, clement-letter, and the shared **council-assembly** (bishops around a decree, on Constantinople/Ephesus/Chalcedon) all read clearly. Others: polycarp-pyre, irenaeus-book (four crosses = the fourfold Gospel), tertullian-trinity, origen-columns (the Hexapla), cyprian-cathedra, martyr-palm, edict-scroll, labarum (Chi-Rho standard), creed-tablet, antony-tau, trinity-knot, ambrose-beehive, chrysostom-mouth, jerome-lion, augustine-heart. `symbols.json` now 162 entries.

## Judgment calls / things to check
1. **Layer = `church`** for all 23 (red tint) — makes the patristic era a coherent red band. Constantine is `church` too (not `people`), since he belongs to the church-and-empire story.
2. **The Cappadocians are one grouped node** (Basil + the two Gregories) — same approach as the minor prophets / grouped books.
3. **Legends kept as legends** inside attested lives, not smoothed away or given their own certainty.
4. **`winged-lion`/`jerome-lion`/`daniel-lion`** — three different lions now live on the canvas (evangelist, Jerome's companion, Daniel's den); each is a distinct glyph in a distinct era.

## Not yet done
**Batch 11 = the medieval Church** (Gregory the Great, Benedict, the rise of the papacy, Islam's rise as context, Charlemagne, East–West estrangement → the Great Schism of 1054 which already exists as a seed node, Anselm, Aquinas & scholasticism, Francis & Dominic, the crusades, Avignon). **Batch 12 = the Reformation.** Awaiting your go.
