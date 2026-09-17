import type { JSX } from "react";

/**
 * The emblem system (§4 of the brief). Nobody knows the face of Moses or
 * Peter, so figures are shown as designed symbols tied to their story —
 * never portraits. All glyphs share a 48×48 coordinate space and an inked,
 * stroke-based style; line color follows currentColor so the canvas can
 * tint by layer, with gold used sparingly as the illuminated accent.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const gold = { ...stroke, stroke: "var(--gold)" };

// Deterministic trig: Math.sin/cos can differ by 1 ULP between the server
// render and the browser hydration, which trips React's hydration check on
// computed glyph coordinates. Rounding the result makes both sides identical.
const dcos = (x: number) => Math.round(Math.cos(x) * 1e6) / 1e6;
const dsin = (x: number) => Math.round(Math.sin(x) * 1e6) / 1e6;

const GLYPHS: Record<string, JSX.Element> = {
  // ---- Batch 12: the Reformation ----
  // Erasmus — the humanist's quill over the page.
  "erasmus-quill": (
    <g>
      <rect x="14" y="20" width="16" height="18" rx="1.5" {...stroke} />
      {[25, 29, 33].map((y) => (
        <line key={y} x1="17" y1={y} x2="27" y2={y} {...stroke} strokeWidth={1} />
      ))}
      <path d="M26 34 L38 14" {...stroke} strokeWidth={1.4} />
      <path d="M38 14 q3 -3 5 -2 q-1 3 -4 4 Z" {...gold} strokeWidth={1} />
    </g>
  ),
  // The Ninety-Five Theses — the paper nailed to the door.
  "theses-nail": (
    <g>
      <rect x="16" y="14" width="18" height="24" rx="1" {...stroke} />
      {[20, 24, 28, 32].map((y) => (
        <line key={y} x1="19" y1={y} x2="31" y2={y} {...stroke} strokeWidth={0.9} />
      ))}
      <line x1="25" y1="11" x2="25" y2="16" {...gold} strokeWidth={1.2} />
      <circle cx="25" cy="14" r="2" {...gold} />
    </g>
  ),
  // The Diet of Worms — the hand on the open Bible, conscience bound to Scripture.
  "hand-on-bible": (
    <g>
      <path d="M10 32 Q18 29 24 32 Q30 29 38 32 L38 37 Q30 34 24 37 Q18 34 10 37 Z" {...stroke} />
      <line x1="24" y1="32" x2="24" y2="37" {...stroke} strokeWidth={1} />
      <g {...stroke} strokeWidth={1.3}>
        <path d="M19 27 L19 17" />
        <path d="M22.5 27 L22.5 13" />
        <path d="M26 27 L26 14" />
        <path d="M29 27 L29 18" />
        <path d="M17 24 Q16 27 19 28 L29 28 Q31 27 31 24" />
      </g>
    </g>
  ),
  // Zwingli — the sword laid across the open Bible.
  "zwingli-sword-bible": (
    <g>
      <path d="M9 28 Q17 25 24 28 Q31 25 39 28 L39 34 Q31 31 24 34 Q17 31 9 34 Z" {...stroke} />
      <line x1="24" y1="28" x2="24" y2="34" {...stroke} strokeWidth={1} />
      <line x1="14" y1="40" x2="34" y2="12" {...gold} strokeWidth={1.6} />
      <line x1="16" y1="34" x2="22" y2="38" {...gold} strokeWidth={1.4} />
      <circle cx="13" cy="41" r="1.4" {...gold} />
    </g>
  ),
  // The Anabaptists — the waters of believer's baptism, beneath the cross.
  "anabaptist-drops": (
    <g>
      <path d="M24 12 L24 16 M22 14 L26 14" {...stroke} strokeWidth={1.2} />
      {[[18, 22], [30, 22], [24, 29]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 5} Q${x - 4} ${y} ${x} ${y + 3} Q${x + 4} ${y} ${x} ${y - 5} Z`} {...gold} />
      ))}
      <path d="M12 37 q4 -3 8 0 q4 3 8 0 q4 -3 8 0" {...stroke} strokeWidth={1.3} />
    </g>
  ),
  // The Augsburg Confession — the codex of articles, under the cross.
  "confession-articles": (
    <g>
      <rect x="13" y="12" width="22" height="26" rx="1.5" {...stroke} />
      <path d="M24 15 L24 19 M22 17 L26 17" {...gold} strokeWidth={1.2} />
      {[23, 27, 31].map((y) => (
        <g key={y}>
          <circle cx="18" cy={y} r="1" fill="var(--gold)" stroke="none" />
          <line x1="21" y1={y} x2="31" y2={y} {...stroke} strokeWidth={1} />
        </g>
      ))}
    </g>
  ),
  // The English Reformation — the crown set over the church.
  "supremacy-crown": (
    <g>
      <path d="M15 18 L15 12 L20 15 L24 9 L28 15 L33 12 L33 18 Z" {...gold} />
      <line x1="13" y1="18" x2="35" y2="18" {...gold} strokeWidth={1.4} />
      {[20, 24, 28].map((x) => (
        <circle key={x} cx={x} cy="14.5" r="0.9" fill="var(--gold)" stroke="none" />
      ))}
      <path d="M17 40 L17 26 L24 22 L31 26 L31 40 Z" {...stroke} />
      <path d="M22 40 L22 32 L26 32 L26 40" {...stroke} strokeWidth={1} />
    </g>
  ),
  // Ignatius of Loyola — the Jesuit IHS, wreathed in rays.
  "jesuit-ihs": (
    <g>
      {Array.from({ length: 12 }).map((_, k) => {
        const a = (k * Math.PI) / 6;
        return (
          <line key={k} x1={24 + 13 * dcos(a)} y1={24 + 13 * dsin(a)} x2={24 + 16 * dcos(a)} y2={24 + 16 * dsin(a)} {...gold} strokeWidth={1} />
        );
      })}
      <path d="M24 15 L24 11 M22.5 12.5 L25.5 12.5" {...gold} strokeWidth={1} />
      <text x="24" y="29" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--gold)" style={{ fontFamily: "var(--font-eb-garamond), serif" }}>
        IHS
      </text>
    </g>
  ),
  // John Calvin — the heart offered to God in an open hand.
  "calvin-hand-heart": (
    <g>
      <path d="M24 26 C19 21 20 15 24 18 C28 15 29 21 24 26 Z" {...gold} />
      <path d="M24 18 q-2 -3 0 -6 q2 3 0 6" {...gold} strokeWidth={1} />
      <path d="M13 38 Q20 33 27 35" {...stroke} strokeWidth={1.4} />
      <path d="M20 34 L19 29 M23 34 L23 28 M26 35 L26 30" {...stroke} strokeWidth={1.1} />
      <path d="M13 38 L11 34" {...stroke} strokeWidth={1.1} />
    </g>
  ),
  // Thomas Cranmer — the hand thrust into the flames.
  "cranmer-hand": (
    <g>
      <path d="M14 40 q-3 -8 2 -13 q1 6 4 8 q-4 4 -2 8" {...gold} />
      <path d="M24 40 q-4 -9 1 -16 q4 7 1 12 q3 -3 3 -7 q3 6 -1 11" {...gold} />
      <path d="M34 40 q3 -8 -2 -13 q-1 6 -4 8 q4 4 2 8" {...gold} />
      <g {...stroke} strokeWidth={1.3}>
        <path d="M21 24 L21 14" />
        <path d="M24 24 L24 12" />
        <path d="M27 24 L27 15" />
        <path d="M19 24 Q19 28 24 28 Q29 28 29 23" />
        <path d="M29 23 Q29 20 27 20" />
      </g>
    </g>
  ),
  // The Book of Common Prayer — praying hands over the open book.
  "common-prayer": (
    <g>
      <path d="M10 32 Q18 29 24 32 Q30 29 38 32 L38 37 Q30 34 24 37 Q18 34 10 37 Z" {...stroke} />
      <line x1="24" y1="32" x2="24" y2="37" {...stroke} strokeWidth={1} />
      <path d="M22 28 L20 14 Q20 12 22 12 L23.5 27 Z" {...stroke} />
      <path d="M26 28 L28 14 Q28 12 26 12 L24.5 27 Z" {...stroke} />
      <line x1="20" y1="21" x2="28" y2="21" {...stroke} strokeWidth={0.8} />
    </g>
  ),
  // The Peace of Augsburg — two pennants, Catholic and Lutheran, side by side.
  "augsburg-peace": (
    <g>
      <line x1="16" y1="40" x2="16" y2="11" {...stroke} />
      <line x1="32" y1="40" x2="32" y2="11" {...stroke} />
      <path d="M16 12 L25 15 L16 18 Z" {...stroke} />
      <path d="M32 12 L23 15 L32 18 Z" {...gold} />
      <circle cx="16" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="32" cy="10" r="1.1" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // John Knox — the first blast of the trumpet.
  "knox-trumpet": (
    <g>
      <path d="M12 22 L30 22 L36 16 L36 32 L30 26 L12 26 Z" {...gold} />
      <line x1="9" y1="22" x2="9" y2="26" {...gold} strokeWidth={1.6} />
      <path d="M39 18 l3 -1 M39 24 l4 0 M39 30 l3 1" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Teresa of Ávila — the heart pierced by the golden arrow.
  "teresa-heart": (
    <g>
      <path d="M24 34 C15 27 15 17 21 17 C24 17 24 21 24 23 C24 21 25 17 28 17 C33 17 33 27 24 34 Z" {...stroke} />
      <line x1="12" y1="14" x2="36" y2="30" {...gold} strokeWidth={1.6} />
      <path d="M36 30 l-1 -4 M36 30 l-4 1" {...gold} strokeWidth={1.2} />
      <path d="M12 14 l4 -1 M12 14 l1 4" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // St Bartholomew's Day — the sword and the broken cross.
  "bartholomew-massacre": (
    <g>
      <line x1="16" y1="12" x2="32" y2="36" {...stroke} strokeWidth={1.8} />
      <line x1="12" y1="16" x2="20" y2="10" {...stroke} strokeWidth={1.4} />
      <circle cx="11" cy="17" r="1.5" {...stroke} />
      <path d="M30 13 L30 19" {...gold} strokeWidth={1.6} />
      <path d="M26 16 L29 16 M31.5 16 L34 16" {...gold} strokeWidth={1.6} />
      <path d="M30 21 L30 25" {...gold} strokeWidth={1.6} />
    </g>
  ),
  // The Thirty Years' War — the crossed swords of a generation of war.
  "thirty-years-swords": (
    <g>
      <line x1="12" y1="14" x2="36" y2="36" {...stroke} strokeWidth={1.8} />
      <line x1="36" y1="14" x2="12" y2="36" {...gold} strokeWidth={1.8} />
      <line x1="9" y1="14" x2="17" y2="12" {...stroke} strokeWidth={1.3} />
      <line x1="39" y1="14" x2="31" y2="12" {...gold} strokeWidth={1.3} />
      <line x1="9" y1="36" x2="17" y2="38" {...gold} strokeWidth={1.3} />
      <line x1="39" y1="36" x2="31" y2="38" {...stroke} strokeWidth={1.3} />
    </g>
  ),
  // ---- Batch 11: the medieval Church ----
  // Benedict of Nursia — the raven that bore off the poisoned bread.
  "benedict-raven": (
    <g>
      <path d="M13 28 Q20 18 30 22 Q36 24 38 21" {...stroke} />
      <path d="M13 28 Q22 34 32 30 Q34 26 30 22" {...stroke} />
      <path d="M22 26 Q26 28 30 26" {...stroke} strokeWidth={1} />
      <circle cx="35" cy="22" r="0.9" fill="currentColor" stroke="none" />
      <path d="M38 21 L42 20" {...stroke} strokeWidth={1.2} />
      <circle cx="42.5" cy="20" r="2.3" {...gold} />
      <path d="M20 32 l-2 6 M25 32 l1 6" {...stroke} strokeWidth={1.1} />
    </g>
  ),
  // Gregory the Great — the papal tiara, the triple crown.
  "papal-tiara": (
    <g>
      <path d="M16 34 L16 20 Q16 14 24 14 Q32 14 32 20 L32 34 Z" {...stroke} />
      <line x1="14" y1="34" x2="34" y2="34" {...stroke} strokeWidth={1.4} />
      <line x1="16.5" y1="27" x2="31.5" y2="27" {...gold} strokeWidth={1.2} />
      <line x1="16.5" y1="21" x2="31.5" y2="21" {...gold} strokeWidth={1.2} />
      <path d="M24 14 L24 9 M22 11 L26 11" {...gold} strokeWidth={1.2} />
      <line x1="20" y1="34" x2="20" y2="39" {...stroke} strokeWidth={1} />
      <line x1="28" y1="34" x2="28" y2="39" {...stroke} strokeWidth={1} />
    </g>
  ),
  // The rise of Islam — the crescent and star (historical context).
  "islam-crescent": (
    <g>
      <path d="M29 12 A13 13 0 1 0 29 36 A10 10 0 1 1 29 12 Z" {...gold} />
      <path d="M39 19 l1 2.2 2.4 .2 -1.8 1.6 .5 2.4 -2.1 -1.2 -2.1 1.2 .5 -2.4 -1.8 -1.6 2.4 -.2 Z" {...gold} strokeWidth={0.8} />
    </g>
  ),
  // Charlemagne — the arched imperial crown with orb and cross.
  "imperial-crown": (
    <g>
      <path d="M14 32 L14 24 L19 27 L24 21 L29 27 L34 24 L34 32 Z" {...stroke} />
      <line x1="12" y1="32" x2="36" y2="32" {...stroke} strokeWidth={1.6} />
      <path d="M14 24 Q24 14 34 24" {...gold} strokeWidth={1.3} />
      <circle cx="24" cy="13" r="1.8" {...gold} />
      <path d="M24 11.2 L24 8.5 M22.7 9.8 L25.3 9.8" {...gold} strokeWidth={1} />
      {[19, 24, 29].map((x) => (
        <circle key={x} cx={x} cy="26.5" r="1" fill="var(--gold)" stroke="none" />
      ))}
    </g>
  ),
  // The Investiture Controversy — the crozier crossed by the sword.
  "investiture-clash": (
    <g>
      <path d="M18 40 L18 15 Q18 10 23 10 Q27 10 27 14" {...stroke} strokeWidth={2} />
      <line x1="12" y1="16" x2="36" y2="38" {...gold} strokeWidth={2} />
      <line x1="31" y1="29" x2="37" y2="27" {...gold} strokeWidth={1.4} />
    </g>
  ),
  // Anselm — faith seeking understanding: the book beneath the rising light.
  "anselm-fides": (
    <g>
      <path d="M10 31 Q18 28 24 31 Q30 28 38 31 L38 37 Q30 34 24 37 Q18 34 10 37 Z" {...stroke} />
      <line x1="24" y1="31" x2="24" y2="37" {...stroke} strokeWidth={1} />
      <circle cx="24" cy="17" r="3.5" {...gold} />
      <line x1="24" y1="9" x2="24" y2="12" {...gold} strokeWidth={1.2} />
      <line x1="17" y1="12" x2="19" y2="14" {...gold} strokeWidth={1.2} />
      <line x1="31" y1="12" x2="29" y2="14" {...gold} strokeWidth={1.2} />
      <line x1="14" y1="19" x2="17" y2="19" {...gold} strokeWidth={1.2} />
      <line x1="34" y1="19" x2="31" y2="19" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // The Crusades — the Jerusalem cross (cross potent and four crosslets).
  "crusade-cross": (
    <g>
      <path d="M24 12 L24 36 M12 24 L36 24" {...gold} strokeWidth={2.2} />
      <line x1="21" y1="12" x2="27" y2="12" {...gold} strokeWidth={1.4} />
      <line x1="21" y1="36" x2="27" y2="36" {...gold} strokeWidth={1.4} />
      <line x1="12" y1="21" x2="12" y2="27" {...gold} strokeWidth={1.4} />
      <line x1="36" y1="21" x2="36" y2="27" {...gold} strokeWidth={1.4} />
      {[[17, 17], [31, 17], [17, 31], [31, 31]].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 2} L${x} ${y + 2} M${x - 2} ${y} L${x + 2} ${y}`} {...stroke} strokeWidth={1} />
      ))}
    </g>
  ),
  // Bernard of Clairvaux — the three mitres of the sees he declined.
  "three-mitres": (
    <g>
      {[[24, 15], [16, 30], [32, 30]].map(([cx, cy], i) => (
        <g key={i}>
          <path d={`M${cx - 5} ${cy + 6} L${cx - 4} ${cy - 2} Q${cx} ${cy - 8} ${cx + 4} ${cy - 2} L${cx + 5} ${cy + 6} Z`} {...(i === 0 ? gold : stroke)} />
          <line x1={cx - 4.4} y1={cy + 3} x2={cx + 4.4} y2={cy + 3} {...stroke} strokeWidth={0.8} />
        </g>
      ))}
    </g>
  ),
  // Hildegard of Bingen — a feather on the breath of God.
  "hildegard-feather": (
    <g>
      <path d="M31 11 Q17 20 13 39" {...stroke} />
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6;
        const x = 31 - 18 * t;
        const y = 11 + 27 * t;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x + 5} y2={y - 3} {...(i % 2 ? gold : stroke)} strokeWidth={1} />
            <line x1={x} y1={y} x2={x - 4} y2={y - 1} {...(i % 2 ? gold : stroke)} strokeWidth={1} />
          </g>
        );
      })}
    </g>
  ),
  // Francis of Assisi — the birds to whom he preached.
  "francis-birds": (
    <g>
      <path d="M12 35 Q12 29 18 29 L23 29" {...stroke} />
      <path d="M23 29 Q25 22 30 24 Q33 25 35 22" {...stroke} />
      <path d="M26 27 Q30 29 33 27" {...stroke} strokeWidth={1} />
      <circle cx="34" cy="22.5" r="0.8" fill="currentColor" stroke="none" />
      <path d="M35 22 l2 -0.5" {...gold} strokeWidth={1} />
      <path d="M11 15 q3 -3 6 0 q3 -3 6 0" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Dominic — the star of the preacher, above the book of study.
  "dominic-star": (
    <g>
      <g stroke="var(--gold)" strokeWidth={1.4}>
        <line x1="24" y1="12" x2="24" y2="26" />
        <line x1="17" y1="19" x2="31" y2="19" />
        <line x1="19" y1="14" x2="29" y2="24" />
        <line x1="29" y1="14" x2="19" y2="24" />
      </g>
      <path d="M14 34 Q24 31 34 34 L34 38 Q24 35 14 38 Z" {...stroke} />
    </g>
  ),
  // Thomas Aquinas — the radiant sun of the Angelic Doctor.
  "aquinas-sun": (
    <g>
      <circle cx="24" cy="24" r="6" {...gold} />
      {Array.from({ length: 12 }).map((_, k) => {
        const a = (k * Math.PI) / 6;
        return (
          <line key={k} x1={24 + 8 * dcos(a)} y1={24 + 8 * dsin(a)} x2={24 + 13 * dcos(a)} y2={24 + 13 * dsin(a)} {...gold} strokeWidth={1.3} />
        );
      })}
      <circle cx="24" cy="24" r="2.5" {...stroke} />
    </g>
  ),
  // Catherine of Siena — the ring of the mystical marriage.
  "catherine-ring": (
    <g>
      <circle cx="24" cy="28" r="9" {...gold} strokeWidth={2} />
      <path d="M24 12 L28 17 L24 21 L20 17 Z" {...stroke} />
      <line x1="20" y1="17" x2="28" y2="17" {...stroke} strokeWidth={0.8} />
    </g>
  ),
  // The Avignon papacy — the tiara and the fleur-de-lis of France.
  "avignon-tiara": (
    <g>
      <path d="M15 30 L15 22 Q15 17 22 17 Q29 17 29 22 L29 30 Z" {...stroke} />
      <line x1="13" y1="30" x2="31" y2="30" {...stroke} strokeWidth={1.4} />
      <line x1="16" y1="24" x2="28" y2="24" {...gold} strokeWidth={1} />
      <path d="M22 17 L22 13 M20.5 14.5 L23.5 14.5" {...gold} strokeWidth={1} />
      <path d="M35 40 Q35 33 38 33 Q35 35 35 30 Q35 35 32 33 Q35 33 35 40 Z" {...gold} />
      <line x1="32" y1="36" x2="38" y2="36" {...gold} strokeWidth={0.8} />
    </g>
  ),
  // The Western Schism — rival tiaras, and the crack between them.
  "schism-two-tiaras": (
    <g>
      {[15, 33].map((cx, i) => (
        <g key={cx}>
          <path d={`M${cx - 6} 32 L${cx - 6} 25 Q${cx - 6} 21 ${cx} 21 Q${cx + 6} 21 ${cx + 6} 25 L${cx + 6} 32 Z`} {...(i ? gold : stroke)} />
          <path d={`M${cx} 21 L${cx} 17 M${cx - 1.5} 18.5 L${cx + 1.5} 18.5`} {...(i ? gold : stroke)} strokeWidth={1} />
        </g>
      ))}
      <path d="M24 12 L22 20 L26 26 L23 34 L25 40" {...stroke} strokeWidth={1.4} />
    </g>
  ),
  // John Wycliffe — the morning star, above the English Bible.
  "wycliffe-star": (
    <g>
      <path d="M24 11 L26 19 L34 19 L28 24 L30 32 L24 27 L18 32 L20 24 L14 19 L22 19 Z" {...gold} />
      <path d="M14 36 Q24 33 34 36 L34 40 Q24 37 14 40 Z" {...stroke} />
    </g>
  ),
  // Jan Hus — the goose (his name), and the martyr's flame.
  "hus-goose": (
    <g>
      <ellipse cx="22" cy="28" rx="9" ry="6" {...stroke} />
      <path d="M29 24 Q34 20 33 14 Q32 11 29 12" {...stroke} />
      <circle cx="29.7" cy="12.6" r="0.9" fill="currentColor" stroke="none" />
      <path d="M28 12 l-3 1" {...gold} strokeWidth={1.2} />
      <line x1="20" y1="34" x2="20" y2="38" {...stroke} strokeWidth={1} />
      <line x1="24" y1="34" x2="24" y2="38" {...stroke} strokeWidth={1} />
      <path d="M13 40 q-2 -4 1 -7 q2 3 -1 7" {...gold} />
    </g>
  ),
  // The Black Death — the skull, memento mori of a plague age.
  "plague-skull": (
    <g>
      <path d="M16 22 Q16 12 24 12 Q32 12 32 22 Q32 27 28 29 L28 33 L20 33 L20 29 Q16 27 16 22 Z" {...stroke} />
      <circle cx="20.5" cy="21" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="27.5" cy="21" r="2.4" fill="currentColor" stroke="none" />
      <path d="M24 24 L22 28 L26 28 Z" {...stroke} strokeWidth={1} />
      <path d="M20 33 L20 36 M23 33 L23 36 M25 33 L25 36 M28 33 L28 36 M20 36 L28 36" {...stroke} strokeWidth={1} />
    </g>
  ),
  // The Imitation of Christ — footsteps following the cross.
  "imitatio-steps": (
    <g>
      <path d="M30 10 L30 24 M24 15 L36 15" {...gold} strokeWidth={1.8} />
      <ellipse cx="14" cy="36" rx="2.6" ry="4" {...stroke} transform="rotate(-25 14 36)" />
      <ellipse cx="20" cy="30" rx="2.6" ry="4" {...stroke} transform="rotate(-25 20 30)" />
      <ellipse cx="26" cy="26" rx="2.4" ry="3.6" {...gold} transform="rotate(-25 26 26)" />
    </g>
  ),
  // The fall of Constantinople — the domed church crowned by a crescent.
  "constantinople-dome": (
    <g>
      <path d="M14 30 Q14 16 24 16 Q34 16 34 30 Z" {...stroke} />
      <line x1="12" y1="30" x2="36" y2="30" {...stroke} strokeWidth={1.4} />
      <path d="M16 30 L16 38 L32 38 L32 30" {...stroke} />
      <path d="M24 15 A4 4 0 1 0 24 7 A3 3 0 1 1 24 15 Z" {...gold} />
    </g>
  ),
  // ---- Batch 10: the Church Fathers & the ecumenical councils ----
  // Clement of Rome — his letter to Corinth, with a hanging seal.
  "clement-letter": (
    <g>
      <rect x="13" y="12" width="22" height="24" rx="1.5" {...stroke} />
      {[18, 22, 26, 30].map((y) => (
        <line key={y} x1="17" y1={y} x2="31" y2={y} {...stroke} strokeWidth={1} />
      ))}
      <line x1="29" y1="36" x2="29" y2="41" {...stroke} strokeWidth={1} />
      <circle cx="29" cy="42" r="2.4" {...gold} />
    </g>
  ),
  // Ignatius of Antioch — the chains of the prisoner for Christ.
  "ignatius-chains": (
    <g>
      <ellipse cx="15" cy="16" rx="3.4" ry="6" {...stroke} transform="rotate(35 15 16)" />
      <ellipse cx="22" cy="22" rx="3.4" ry="6" {...gold} transform="rotate(-35 22 22)" />
      <ellipse cx="29" cy="28" rx="3.4" ry="6" {...stroke} transform="rotate(35 29 28)" />
      <ellipse cx="36" cy="34" rx="3.4" ry="6" {...gold} transform="rotate(-35 36 34)" />
    </g>
  ),
  // Polycarp — the stake and the flames of his martyrdom.
  "polycarp-pyre": (
    <g>
      <line x1="24" y1="41" x2="24" y2="18" {...stroke} />
      <path d="M13 40 q11 5 22 0" {...stroke} strokeWidth={1.4} />
      <path d="M17 40 q-4 -9 2 -16 q1 6 4 9 q-5 4 -2 7" {...gold} />
      <path d="M31 40 q4 -9 -2 -16 q-1 6 -4 9 q5 4 2 7" {...gold} />
      <path d="M24 38 q-4 -8 0 -15 q4 7 0 15" {...gold} />
    </g>
  ),
  // Justin Martyr — the philosopher's cloak, clasped with the star of truth.
  "justin-pallium": (
    <g>
      <path d="M24 12 L14 20 L17 40 L31 40 L34 20 Z" {...stroke} />
      <path d="M24 12 L24 40" {...stroke} strokeWidth={1} />
      <path d="M14 20 Q24 26 34 20" {...stroke} strokeWidth={1} />
      <circle cx="24" cy="16" r="2.4" {...gold} />
    </g>
  ),
  // Irenaeus — the book of the fourfold Gospel he defended.
  "irenaeus-book": (
    <g>
      <rect x="13" y="13" width="22" height="24" rx="2" {...stroke} />
      {[[19, 21], [29, 21], [19, 30], [29, 30]].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y - 2.5} L${x} ${y + 2.5} M${x - 2.5} ${y} L${x + 2.5} ${y}`}
          {...gold}
          strokeWidth={1.2}
        />
      ))}
    </g>
  ),
  // Tertullian — the triangle of the Trinity he named.
  "tertullian-trinity": (
    <g>
      <path d="M24 12 L36 34 L12 34 Z" {...stroke} />
      <circle cx="24" cy="12" r="2.4" {...gold} />
      <circle cx="36" cy="34" r="2.4" {...gold} />
      <circle cx="12" cy="34" r="2.4" {...gold} />
      <circle cx="24" cy="27" r="3" {...stroke} />
    </g>
  ),
  // Origen — the six parallel columns of his Hexapla.
  "origen-columns": (
    <g>
      {[12, 16.4, 20.8, 25.2, 29.6, 34].map((x, i) => (
        <line key={x} x1={x} y1="15" x2={x} y2="33" {...(i === 0 ? gold : stroke)} strokeWidth={1.5} />
      ))}
      <line x1="10" y1="15" x2="36" y2="15" {...stroke} strokeWidth={1} />
      <line x1="10" y1="33" x2="36" y2="33" {...stroke} strokeWidth={1} />
    </g>
  ),
  // Cyprian — the bishop's cathedra, marked with the cross.
  "cyprian-cathedra": (
    <g>
      <path d="M15 40 L15 18 L33 18 L33 40" {...stroke} />
      <line x1="13" y1="27" x2="35" y2="27" {...stroke} strokeWidth={1.6} />
      <path d="M24 21 L24 26 M21 23.5 L27 23.5" {...gold} />
    </g>
  ),
  // The Great Persecution — the martyr's palm branch.
  "martyr-palm": (
    <g>
      <path d="M24 40 L24 15" {...stroke} />
      {[0, 1, 2, 3].map((i) => {
        const y = 17 + i * 5;
        return (
          <g key={i}>
            <path d={`M24 ${y} q-8 -3 -12 2`} {...gold} strokeWidth={1.4} />
            <path d={`M24 ${y} q8 -3 12 2`} {...gold} strokeWidth={1.4} />
          </g>
        );
      })}
    </g>
  ),
  // The Edict of Milan — the imperial decree with its wax seal.
  "edict-scroll": (
    <g>
      <path d="M12 14 q-2 0 -2 3 v14 q0 3 2 3 h20 q2 0 2 -3 v-14 q0 -3 -2 -3 Z" {...stroke} />
      {[19, 23, 27].map((y) => (
        <line key={y} x1="15" y1={y} x2="31" y2={y} {...stroke} strokeWidth={1} />
      ))}
      <line x1="28" y1="34" x2="28" y2="40" {...stroke} strokeWidth={1} />
      <circle cx="28" cy="41" r="2.4" {...gold} />
    </g>
  ),
  // Constantine — the labarum, the standard bearing the Chi-Rho.
  "labarum": (
    <g>
      <line x1="24" y1="42" x2="24" y2="10" {...stroke} />
      <line x1="17" y1="14" x2="31" y2="14" {...stroke} />
      <path d="M18 14 L30 14 L30 27 L18 27 Z" {...stroke} />
      <path d="M21 17.5 L27 23.5 M27 17.5 L21 23.5" {...gold} strokeWidth={1.2} />
      <path d="M24 16.5 L24 24.5 M24 17.5 q3 0 3 2.5 q0 2.5 -3 2.5" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // The Arian controversy — the single Greek iota on which it turned.
  "arian-iota": (
    <g>
      <line x1="24" y1="14" x2="24" y2="34" {...gold} strokeWidth={3} />
      <line x1="20" y1="14" x2="28" y2="14" {...gold} strokeWidth={1.5} />
      <line x1="20" y1="34" x2="28" y2="34" {...gold} strokeWidth={1.5} />
      <path d="M15 24 L10 24 M12 22 L10 24 L12 26" {...stroke} strokeWidth={1.2} />
      <path d="M33 24 L38 24 M36 22 L38 24 L36 26" {...stroke} strokeWidth={1.2} />
    </g>
  ),
  // The Nicene Creed — the codex of the confession, sealed with the Chi-Rho.
  "creed-tablet": (
    <g>
      <rect x="13" y="12" width="22" height="26" rx="2" {...stroke} />
      <path d="M21 16 L27 22 M27 16 L21 22" {...gold} strokeWidth={1.3} />
      <path d="M24 15 L24 24 M24 16 q3.5 0 3.5 3 q0 3 -3.5 3" {...gold} strokeWidth={1.3} />
      {[28, 32].map((y) => (
        <line key={y} x1="17" y1={y} x2="31" y2={y} {...stroke} strokeWidth={1} />
      ))}
    </g>
  ),
  // Antony of Egypt — the Tau cross, and the desert sun.
  "antony-tau": (
    <g>
      <line x1="24" y1="40" x2="24" y2="16" {...stroke} strokeWidth={2.4} />
      <line x1="14" y1="16" x2="34" y2="16" {...stroke} strokeWidth={2.4} />
      <path d="M10 40 q14 -4 28 0" {...stroke} strokeWidth={1.2} />
      <circle cx="34" cy="35" r="2.8" {...gold} />
    </g>
  ),
  // Athanasius — the shield of the Nicene faith, held against the world.
  "athanasius-shield": (
    <g>
      <path d="M24 12 L36 16 L36 26 Q36 36 24 42 Q12 36 12 26 L12 16 Z" {...stroke} />
      <path d="M24 18 L24 30 M18 23 L30 23" {...gold} />
    </g>
  ),
  // The Cappadocians — three rings for the one God in three persons.
  "trinity-knot": (
    <g>
      <circle cx="24" cy="18" r="7" {...stroke} />
      <circle cx="18" cy="29" r="7" {...stroke} />
      <circle cx="30" cy="29" r="7" {...gold} />
    </g>
  ),
  // Ambrose of Milan — the beehive of his honeyed eloquence.
  "ambrose-beehive": (
    <g>
      <path d="M13 36 Q13 19 24 19 Q35 19 35 36 Z" {...stroke} />
      <line x1="16" y1="25" x2="32" y2="25" {...stroke} strokeWidth={1} />
      <line x1="14.5" y1="30.5" x2="33.5" y2="30.5" {...stroke} strokeWidth={1} />
      <circle cx="24" cy="33.5" r="1.6" {...stroke} />
      <circle cx="11" cy="16" r="1.5" {...gold} />
      <circle cx="36" cy="14" r="1.5" {...gold} />
    </g>
  ),
  // John Chrysostom — the golden mouth, and words going forth.
  "chrysostom-mouth": (
    <g>
      <path d="M13 24 Q24 17 35 24 Q24 31 13 24 Z" {...gold} />
      <line x1="13" y1="24" x2="35" y2="24" {...stroke} strokeWidth={1} />
      <path d="M37 20 l4 -2 M37 24 l5 0 M37 28 l4 2" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Jerome — the tame lion of the legend, his companion in the study.
  "jerome-lion": (
    <g>
      <path d="M14 36 Q14 26 22 26 L30 26 Q34 26 34 30 L34 36" {...stroke} />
      <circle cx="30" cy="31" r="4" {...stroke} />
      <circle cx="19" cy="22" r="6" {...gold} />
      <circle cx="19" cy="22" r="3.4" {...stroke} />
      <path d="M34 36 q4 -2 3 -8" {...stroke} strokeWidth={1.2} />
      <circle cx="37" cy="27" r="1.5" {...gold} />
      <line x1="18" y1="36" x2="18" y2="40" {...stroke} />
      <line x1="30" y1="36" x2="30" y2="40" {...stroke} />
    </g>
  ),
  // Augustine of Hippo — the restless heart, aflame.
  "augustine-heart": (
    <g>
      <path d="M24 36 C14 28 14 18 20 18 C23 18 24 21 24 23 C24 21 25 18 28 18 C34 18 34 28 24 36 Z" {...stroke} />
      <path d="M24 18 q-3.5 -6 0 -11 q3.5 5 0 11" {...gold} />
    </g>
  ),
  // The ecumenical councils — bishops assembled around the decree.
  "council-assembly": (
    <g>
      {Array.from({ length: 7 }).map((_, k) => {
        const a = Math.PI * (0.16 + (0.68 * k) / 6);
        const x = 24 - 16 * dcos(a);
        const y = 33 - 15 * dsin(a);
        return <circle key={k} cx={x} cy={y} r="2.1" {...(k === 3 ? gold : stroke)} />;
      })}
      <line x1="16" y1="35" x2="32" y2="35" {...stroke} strokeWidth={1.6} />
      <path d="M22 30 L26 30 L26 35 L22 35 Z" {...gold} />
    </g>
  ),
  // ---- Batch 9: the New Testament & the canon (text nodes) ----
  // Matthew — the winged man of the four living creatures.
  "winged-man": (
    <g>
      <circle cx="24" cy="14" r="4" {...stroke} />
      <path d="M24 18 L24 32" {...stroke} />
      <path d="M18 32 L30 32" {...stroke} strokeWidth={1.4} />
      <path d="M21 22 q-10 -1 -13 9 q9 -4 13 1" {...gold} />
      <path d="M27 22 q10 -1 13 9 q-9 -4 -13 1" {...gold} />
    </g>
  ),
  // Acts — the tongues of fire of the Spirit poured out.
  "acts-tongues": (
    <g>
      <path d="M24 32 q-5 -7 0 -15 q5 9 0 15" {...gold} />
      <path d="M15 33 q-4 -5 0 -11 q4 7 0 11" {...gold} />
      <path d="M33 33 q-4 -5 0 -11 q4 7 0 11" {...gold} />
      <path d="M12 36 q12 4 24 0" {...stroke} strokeWidth={1.4} />
    </g>
  ),
  // The general epistles — a bundle of sealed letters.
  "epistles-bundle": (
    <g>
      <rect x="11" y="15" width="16" height="20" rx="1.5" {...stroke} />
      <rect x="19" y="19" width="16" height="20" rx="1.5" {...stroke} fill="var(--card)" />
      <line x1="22" y1="26" x2="32" y2="26" {...stroke} strokeWidth={1.1} />
      <line x1="22" y1="30" x2="32" y2="30" {...stroke} strokeWidth={1.1} />
      <circle cx="27" cy="35" r="2" {...gold} />
    </g>
  ),
  // Revelation — the Alpha and the Omega, the beginning and the end.
  "alpha-omega": (
    <text
      x="24"
      y="31"
      textAnchor="middle"
      fontSize="21"
      fontWeight="600"
      fill="var(--gold)"
      style={{ fontFamily: "var(--font-eb-garamond), serif" }}
    >
      ΑΩ
    </text>
  ),
  // The New Testament canon — the open Gospel beneath the cross.
  "gospel-cross": (
    <g>
      <path d="M8 30 Q16 27 24 30 Q32 27 40 30 L40 34 Q32 31 24 34 Q16 31 8 34 Z" {...stroke} />
      <line x1="24" y1="30" x2="24" y2="34" {...stroke} strokeWidth={1} />
      <path d="M24 26 L24 12 M19 17 L29 17" {...gold} />
    </g>
  ),
  // The Septuagint — a Greek scroll in two columns.
  "septuagint-scroll": (
    <g>
      <path d="M13 15 q-3 0 -3 4.5 v9 q0 4.5 3 4.5" {...stroke} />
      <path d="M35 15 q3 0 3 4.5 v9 q0 4.5 -3 4.5" {...stroke} />
      <line x1="13" y1="15" x2="35" y2="15" {...stroke} />
      <line x1="13" y1="33" x2="35" y2="33" {...stroke} />
      {[19.5, 22.5, 25.5, 28.5].map((y) => (
        <g key={y}>
          <line x1="16" y1={y} x2="22" y2={y} {...stroke} strokeWidth={1} />
          <line x1="26" y1={y} x2="32" y2={y} {...stroke} strokeWidth={1} />
        </g>
      ))}
      <circle cx="9" cy="24" r="2.2" {...gold} />
      <circle cx="39" cy="24" r="2.2" {...gold} />
    </g>
  ),
  // The Muratorian fragment — a torn sheet with its ragged edge.
  "torn-fragment": (
    <g>
      <path d="M14 12 L34 12 L34 30 L31 33 L28 30 L25 34 L22 30 L19 33 L16 30 L14 33 Z" {...stroke} />
      {[17, 21, 25].map((y) => (
        <line key={y} x1="18" y1={y} x2="30" y2={y} {...stroke} strokeWidth={1} />
      ))}
    </g>
  ),
  // Athanasius' festal letter — the canon list under a cross.
  "festal-letter": (
    <g>
      <rect x="13" y="12" width="22" height="26" rx="1.5" {...stroke} />
      <path d="M24 15 L24 20 M21.5 17.5 L26.5 17.5" {...gold} strokeWidth={1.4} />
      {[25, 29, 33].map((y) => (
        <g key={y}>
          <path d={`M17 ${y} l1.5 1.6 l2.6 -3.2`} {...gold} strokeWidth={1.2} />
          <line x1="23" y1={y} x2="31" y2={y} {...stroke} strokeWidth={1} />
        </g>
      ))}
    </g>
  ),
  // Hippo & Carthage — the open Bible ratified with a seal.
  "canon-ratified": (
    <g>
      <path d="M9 16 Q17 13 24 16 L24 33 Q17 30 9 33 Z" {...stroke} fill="var(--card)" />
      <path d="M39 16 Q31 13 24 16 L24 33 Q31 30 39 33 Z" {...stroke} fill="var(--card)" />
      <circle cx="30" cy="26" r="4.6" {...gold} />
      <path d="M27.8 26 l1.6 1.7 l2.7 -3.2" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // The Vulgate — Jerome's Latin Bible, cross on the board and quill.
  "vulgate-codex": (
    <g>
      <rect x="13" y="13" width="18" height="24" rx="1.5" {...stroke} />
      <line x1="17" y1="13" x2="17" y2="37" {...stroke} strokeWidth={1.2} />
      <path d="M24 19 L24 27 M20.5 22 L27.5 22" {...gold} />
      <path d="M30 35 L39 22" {...stroke} strokeWidth={1.2} />
      <path d="M39 22 q2.5 -2.5 4.5 -2 q-0.5 3 -4 4 Z" {...gold} strokeWidth={1} />
    </g>
  ),
  // The Masoretic Text — Hebrew lines with the added vowel points.
  "masoretic-points": (
    <g>
      <rect x="12" y="14" width="24" height="20" rx="1.5" {...stroke} />
      {[20, 27].map((y) => (
        <g key={y}>
          <line x1="16" y1={y} x2="32" y2={y} {...stroke} strokeWidth={1.3} />
          {[19, 24, 29].map((x) => (
            <circle key={x} cx={x} cy={y + 3} r="0.9" fill="var(--gold)" stroke="none" />
          ))}
        </g>
      ))}
    </g>
  ),
  // Tyndale — the open English Bible, and the flame of his burning.
  "tyndale-flame": (
    <g>
      <path d="M9 32 Q17 29 24 32 L24 36 Q17 33 9 36 Z" {...stroke} fill="var(--card)" />
      <path d="M39 32 Q31 29 24 32 L24 36 Q31 33 39 36 Z" {...stroke} fill="var(--card)" />
      <path d="M24 30 q-5 -6 0 -14 q5 8 0 14" {...gold} />
      <path d="M24 30 q3 -4 0 -9" {...stroke} strokeWidth={1} />
    </g>
  ),
  // The King James Version — the open Bible beneath the crown.
  "kjv-crown": (
    <g>
      <path d="M9 30 Q17 27 24 30 L24 36 Q17 33 9 36 Z" {...stroke} fill="var(--card)" />
      <path d="M39 30 Q31 27 24 30 L24 36 Q31 33 39 36 Z" {...stroke} fill="var(--card)" />
      <line x1="24" y1="30" x2="24" y2="36" {...stroke} strokeWidth={1} />
      <path d="M16 23 L18 14 L21 20 L24 12 L27 20 L30 14 L32 23 Z" {...gold} />
      {[18, 24, 30].map((x) => (
        <circle key={x} cx={x} cy={13} r="1" fill="var(--gold)" stroke="none" />
      ))}
    </g>
  ),
  // ---- Batch 8: the books of the Old Testament (text nodes) ----
  // The Tanakh — three scrolls for Law, Prophets, Writings; the Law gilded.
  "tanakh-scrolls": (
    <g>
      {[13, 24, 35].map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 4.5} y={14} width={9} height={20} rx={2.5} {...(i === 1 ? gold : stroke)} />
          <line x1={cx - 2.3} y1={20} x2={cx + 2.3} y2={20} {...stroke} strokeWidth={1.1} />
          <line x1={cx - 2.3} y1={24} x2={cx + 2.3} y2={24} {...stroke} strokeWidth={1.1} />
          <line x1={cx - 2.3} y1={28} x2={cx + 2.3} y2={28} {...stroke} strokeWidth={1.1} />
        </g>
      ))}
    </g>
  ),
  // Genesis — the first dawn rising over the waters.
  "genesis-dawn": (
    <g>
      <line x1="7" y1="30" x2="41" y2="30" {...stroke} />
      <path d="M15 30 a9 9 0 0 1 18 0" {...gold} />
      <line x1="24" y1="16" x2="24" y2="11.5" {...gold} strokeWidth={1.4} />
      <line x1="16.5" y1="18" x2="14" y2="14.5" {...gold} strokeWidth={1.4} />
      <line x1="31.5" y1="18" x2="34" y2="14.5" {...gold} strokeWidth={1.4} />
      <path d="M10 35 q4 -3 8 0 q4 3 8 0 q4 -3 8 0" {...stroke} strokeWidth={1.4} />
      <path d="M12 40 q4 -3 8 0 q4 3 8 0 q4 -3 8 0" {...stroke} strokeWidth={1.4} />
    </g>
  ),
  // Exodus — the shepherd's staff of Moses, raised for the going-out.
  "exodus-staff": (
    <g>
      <path d="M24 41 L24 15" {...stroke} />
      <path d="M24 15 q0 -6 -6 -6 q-5 0 -5 5" {...stroke} />
      <circle cx="13" cy="14" r="1.5" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // Leviticus — the horned altar with its rising flame.
  "leviticus-altar": (
    <g>
      <path d="M14 34 L34 34 L32 25 L16 25 Z" {...stroke} />
      <path d="M16 25 L14 21" {...stroke} strokeWidth={1.6} />
      <path d="M32 25 L34 21" {...stroke} strokeWidth={1.6} />
      <line x1="12" y1="38" x2="36" y2="38" {...stroke} strokeWidth={1.6} />
      <path d="M24 25 q-5 -5 0 -13 q5 8 0 13" {...gold} />
    </g>
  ),
  // Numbers — the camp of tents in the wilderness, a standard raised.
  "numbers-tents": (
    <g>
      <line x1="6" y1="34" x2="42" y2="34" {...stroke} strokeWidth={1.5} />
      <path d="M8 34 L16 19 L24 34 Z" {...stroke} />
      <path d="M24 34 L32 21 L40 34 Z" {...stroke} />
      <line x1="16" y1="19" x2="16" y2="13" {...stroke} strokeWidth={1.4} />
      <path d="M16 13 L21 14.5 L16 16 Z" {...gold} />
    </g>
  ),
  // Deuteronomy — the two tablets of the law, restated.
  "deuteronomy-tablets": (
    <g>
      <path d="M12 35 L12 22 Q12 16 17.5 16 Q23 16 23 22 L23 35 Z" {...stroke} />
      <path d="M25 35 L25 22 Q25 16 30.5 16 Q36 16 36 22 L36 35 Z" {...stroke} />
      {[26, 30].map((y) => (
        <g key={y}>
          <line x1="15" y1={y} x2="20" y2={y} {...stroke} strokeWidth={1.1} />
          <line x1="28" y1={y} x2="33" y2={y} {...stroke} strokeWidth={1.1} />
        </g>
      ))}
    </g>
  ),
  // The Former Prophets — an open narrative scroll on its rollers.
  "former-prophets-scroll": (
    <g>
      <line x1="14" y1="15" x2="34" y2="15" {...stroke} />
      <line x1="14" y1="33" x2="34" y2="33" {...stroke} />
      <path d="M14 15 q-4 0 -4 4.5 v9 q0 4.5 4 4.5" {...stroke} />
      <path d="M34 15 q4 0 4 4.5 v9 q0 4.5 -4 4.5" {...stroke} />
      <circle cx="10" cy="24" r="2.4" {...gold} />
      <circle cx="38" cy="24" r="2.4" {...gold} />
      {[21, 24, 27].map((y, i) => (
        <line key={y} x1="18" y1={y} x2={i === 2 ? 28 : 30} y2={y} {...stroke} strokeWidth={1.1} />
      ))}
    </g>
  ),
  // The post-exilic histories — the rebuilt city wall and its gate.
  "restoration-wall": (
    <g>
      <path d="M10 20 L10 16 L15 16 L15 20 L20 20 L20 16 L25 16 L25 20 L30 20 L30 16 L35 16 L35 20 L38 20" {...stroke} />
      <path d="M10 20 L10 36 L38 36 L38 20" {...stroke} />
      <path d="M20 36 L20 27 q4 -3.5 8 0 L28 36" {...gold} />
      <line x1="10" y1="28" x2="20" y2="28" {...stroke} strokeWidth={1.1} />
      <line x1="28" y1="28" x2="38" y2="28" {...stroke} strokeWidth={1.1} />
    </g>
  ),
  // Psalms — the lyre of praise, gold-framed and strung.
  "psalter-harp": (
    <g>
      <path d="M16 34 q-5 -14 4 -23" {...gold} />
      <path d="M32 34 q5 -14 -4 -23" {...gold} />
      <path d="M20 11 q4 -2 8 0" {...gold} />
      <path d="M15 34 q9 4 18 0" {...stroke} />
      <line x1="21" y1="14" x2="20.5" y2="33" {...stroke} strokeWidth={1} />
      <line x1="24" y1="13" x2="24" y2="33.5" {...stroke} strokeWidth={1} />
      <line x1="27" y1="14" x2="27.5" y2="33" {...stroke} strokeWidth={1} />
    </g>
  ),
  // Proverbs — the lamp of wisdom, a light to the feet.
  "proverbs-lamp": (
    <g>
      <ellipse cx="25" cy="30" rx="10" ry="5" {...stroke} />
      <path d="M16 28 L8 26 L17 31" {...stroke} />
      <path d="M8 26 q-2 -5 1 -9 q3 5 -1 9" {...gold} />
      <path d="M28 25 q3 -2 5 0" {...stroke} strokeWidth={1.4} />
    </g>
  ),
  // (Job's book reuses the existing "job-whirlwind" glyph, defined below.)
  // Ecclesiastes — the hourglass; all is fleeting breath.
  "ecclesiastes-hourglass": (
    <g>
      <line x1="14" y1="12" x2="34" y2="12" {...stroke} />
      <line x1="14" y1="36" x2="34" y2="36" {...stroke} />
      <path d="M16 12 L32 12 L25 24 L32 36 L16 36 L23 24 Z" {...stroke} />
      <path d="M23.5 24 L28 32 L20 32 Z" {...gold} />
      <line x1="24" y1="24" x2="24" y2="18" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Song of Songs — the lily of the valleys.
  "song-lily": (
    <g>
      <path d="M24 41 L24 25" {...stroke} />
      <path d="M24 25 q-9 -2 -6 -13 q5 5 6 13" {...gold} />
      <path d="M24 25 q9 -2 6 -13 q-5 5 -6 13" {...gold} />
      <path d="M24 25 q-3 -11 0 -17 q3 6 0 17" {...gold} />
      <path d="M24 33 q-6 -1 -8 4 q6 1 8 -4" {...stroke} />
    </g>
  ),
  // Isaiah — the burning coal from the altar, held in the tongs (Isa 6).
  "isaiah-coal": (
    <g>
      <path d="M18 37 L23 22" {...stroke} />
      <path d="M30 37 L25 22" {...stroke} />
      <path d="M17 37 q7 3 14 0" {...stroke} strokeWidth={1.4} />
      <circle cx="24" cy="18" r="4.5" {...gold} />
      <line x1="24" y1="10.5" x2="24" y2="7.5" {...gold} strokeWidth={1.2} />
      <line x1="18" y1="13" x2="16" y2="11" {...gold} strokeWidth={1.2} />
      <line x1="30" y1="13" x2="32" y2="11" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Jeremiah — the almond branch in blossom (Jer 1:11, the watching rod).
  "jeremiah-almond": (
    <g>
      <path d="M11 39 Q22 31 33 12" {...stroke} />
      <circle cx="33" cy="12" r="3" {...gold} />
      <circle cx="26" cy="20" r="2.6" {...gold} />
      <circle cx="20" cy="28" r="2.2" {...stroke} />
      <circle cx="30" cy="17" r="1.3" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // Ezekiel — the wheel within a wheel, its rim full of eyes.
  "ezekiel-wheel": (
    <g>
      <circle cx="24" cy="24" r="12" {...stroke} />
      <ellipse cx="24" cy="24" rx="12" ry="5.5" {...stroke} />
      <line x1="24" y1="12" x2="24" y2="36" {...stroke} strokeWidth={1} />
      <line x1="12" y1="24" x2="36" y2="24" {...stroke} strokeWidth={1} />
      <circle cx="24" cy="24" r="4.5" {...gold} />
      {[12, 36].map((y) => (
        <circle key={y} cx="24" cy={y} r="1.2" fill="currentColor" stroke="none" />
      ))}
    </g>
  ),
  // Daniel — the lion of the den, maned in gold.
  "daniel-lion": (
    <g>
      {Array.from({ length: 12 }).map((_, k) => {
        const a = (k / 12) * Math.PI * 2;
        return (
          <line
            key={k}
            x1={24 + 9.5 * dcos(a)}
            y1={24 + 9.5 * dsin(a)}
            x2={24 + 14.5 * dcos(a)}
            y2={24 + 14.5 * dsin(a)}
            {...gold}
            strokeWidth={1.4}
          />
        );
      })}
      <circle cx="24" cy="24" r="9" {...stroke} />
      <circle cx="20.5" cy="22" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="27.5" cy="22" r="1.2" fill="currentColor" stroke="none" />
      <path d="M24 25 L24 28 M24 28 q-2.5 2 -4.5 0.5 M24 28 q2.5 2 4.5 0.5" {...stroke} strokeWidth={1.3} />
    </g>
  ),
  // The Twelve — the roller-bars of a scroll listing the minor prophets.
  "twelve-scroll": (
    <g>
      <line x1="13" y1="14" x2="13" y2="34" {...stroke} />
      <line x1="35" y1="14" x2="35" y2="34" {...stroke} />
      {[19, 24, 29].map((y) =>
        [17.5, 22, 26.5, 31].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="var(--gold)" stroke="none" />
        ))
      )}
    </g>
  ),
  // Creation — radiant burst of the first light.
  "genesis-burst": (
    <g>
      <circle cx="24" cy="24" r="5.5" {...gold} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r1 = 10.5;
        const r2 = a % 90 === 0 ? 19 : 15.5;
        const x1 = 24 + r1 * dcos((a * Math.PI) / 180);
        const y1 = 24 + r1 * dsin((a * Math.PI) / 180);
        const x2 = 24 + r2 * dcos((a * Math.PI) / 180);
        const y2 = 24 + r2 * dsin((a * Math.PI) / 180);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} {...stroke} />;
      })}
    </g>
  ),
  // Adam — the tree of the garden, fruit still on the bough.
  "eden-tree": (
    <g>
      <path d="M24 40 L24 24" {...stroke} />
      <path d="M10 40 Q24 35 38 40" {...stroke} />
      <circle cx="24" cy="17" r="9.5" {...stroke} />
      <circle cx="20" cy="15" r="1.6" fill="var(--gold)" stroke="none" />
      <circle cx="28" cy="14" r="1.6" fill="var(--gold)" stroke="none" />
      <circle cx="25" cy="20" r="1.6" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // Noah — the ark beneath the bow of the covenant.
  ark: (
    <g>
      <path d="M9 27 L39 27 L34 35 L14 35 Z" {...stroke} />
      <path d="M18 27 L18 21 L30 21 L30 27" {...stroke} />
      <path d="M10 15 Q24 5 38 15" {...gold} />
      <path d="M8 40 q4 -3 8 0 q4 3 8 0 q4 -3 8 0 q4 3 8 0" {...stroke} />
    </g>
  ),
  // Eve — the fruit of the tree, and the mother of all living (Gen 3:20).
  "eden-fruit": (
    <g>
      <path d="M24 17 q-9 2 -9 12 q0 10 9 11 q9 -1 9 -11 q0 -10 -9 -12 Z" {...stroke} />
      <path d="M24 17 q0 -4 3 -6" {...stroke} strokeWidth={1.4} />
      <path d="M25 12 q6 -5 11 -3 q-2 6 -9 6 Z" {...gold} />
      <circle cx="21" cy="27" r="1.6" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // The Fall — the serpent and the forbidden fruit (Gen 3).
  "fall-serpent": (
    <g>
      <path d="M19 10 C27 13 21 18 25 22 C29 26 21 29 25 33 C28 36 25 39 27 41" {...stroke} />
      <circle cx="18" cy="10" r="2" fill="currentColor" stroke="none" />
      <path d="M15 9 l-2 -1 M15 11 l-2 1" {...stroke} strokeWidth={1} />
      <circle cx="34" cy="30" r="5" {...gold} />
      <path d="M34 25 q3 -3 6 -2" {...stroke} strokeWidth={1.4} />
    </g>
  ),
  // Cain & Abel — two altars, one smoke rising, one turned aside (Gen 4:4-5).
  "twin-altars": (
    <g>
      <path d="M9 39 L23 39 L21 31 L11 31 Z" {...stroke} />
      <path d="M16 31 q-2 -5 0 -9 q2 -4 0 -9" {...gold} />
      <path d="M25 39 L39 39 L37 31 L27 31 Z" {...stroke} />
      <path d="M32 31 q0 -4 -4 -6 q-4 -2 -7 -1" {...stroke} strokeWidth={1.4} opacity={0.9} />
    </g>
  ),
  // The Flood — the bow set in the clouds over the waters (Gen 9:13).
  "covenant-bow": (
    <g>
      <path d="M8 31 A16 16 0 0 1 40 31" {...gold} />
      <path d="M12 31 A12 12 0 0 1 36 31" {...stroke} strokeWidth={1.4} />
      <path d="M16 31 A8 8 0 0 1 32 31" {...gold} strokeWidth={1.4} />
      <path d="M8 36 q4 -3 8 0 q4 3 8 0 q4 -3 8 0 q4 3 8 0" {...stroke} />
      <path d="M8 40 q4 -3 8 0 q4 3 8 0 q4 -3 8 0 q4 3 8 0" {...stroke} opacity={0.7} />
    </g>
  ),
  // Tower of Babel — the stepped ziggurat, its top unfinished (Gen 11).
  "babel-tower": (
    <g>
      <path d="M8 40 L40 40" {...stroke} />
      <rect x="11" y="32" width="26" height="8" {...stroke} />
      <rect x="15" y="25" width="18" height="7" {...stroke} />
      <rect x="19" y="19" width="10" height="6" {...stroke} />
      <path d="M21 19 l1 -4 l2 3 l2 -4 l1 4" {...gold} />
      <path d="M24 40 L24 19" {...stroke} strokeWidth={0.8} opacity={0.5} />
    </g>
  ),
  // Abraham — the tent of the sojourner under promised stars.
  "tent-stars": (
    <g>
      <path d="M8 36 L20 18 L32 36 Z" {...stroke} />
      <path d="M20 18 L20 36" {...stroke} />
      {[
        [33, 12],
        [40, 18],
        [38, 8],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 3} L${x} ${y + 3} M${x - 3} ${y} L${x + 3} ${y}`}
          {...gold}
        />
      ))}
    </g>
  ),
  // Call of Abraham — the road out, toward the promised destination.
  "call-road": (
    <g>
      <path d="M9 41 C17 35 13 29 21 25 C29 21 25 15 33 11" {...stroke} strokeDasharray="1 4" />
      <path d="M9 41 C17 35 13 29 21 25 C29 21 25 15 33 11" {...stroke} opacity={0.3} />
      <circle cx="9" cy="41" r="2.2" fill="currentColor" stroke="none" />
      <path d="M33 7 l0 8 M29 11 l8 0 M30.5 8.5 l5 5 M35.5 8.5 l-5 5" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Abrahamic covenant — the flaming torch passing between the divided pieces.
  "covenant-torch": (
    <g>
      <path d="M7 34 q5 -5 10 0 Z" {...stroke} />
      <path d="M31 34 q5 -5 10 0 Z" {...stroke} />
      <line x1="24" y1="40" x2="24" y2="22" {...stroke} strokeWidth={1.8} />
      <path d="M24 22 C20 18 22 13 24 9 C26 13 28 18 24 22 Z" {...gold} />
      <path d="M24 20 C22.5 18 23 15 24 13 C25 15 25.5 18 24 20 Z" {...stroke} strokeWidth={1} />
    </g>
  ),
  // Binding of Isaac — the altar and the ram caught in the thicket.
  "altar-ram": (
    <g>
      <path d="M14 40 L34 40 L31 32 L17 32 Z" {...stroke} />
      <path d="M17 32 q7 -3 14 0" {...stroke} strokeWidth={1} opacity={0.6} />
      <circle cx="24" cy="22" r="5" {...stroke} />
      <path d="M19 20 q-5 -2 -4 -7 q3 2 3 5 M29 20 q5 -2 4 -7 q-3 2 -3 5" {...gold} />
      <path d="M22 26 l1 3 M26 26 l-1 3" {...stroke} strokeWidth={1} />
    </g>
  ),
  // Jacob & the twelve sons — twelve stars over the people.
  "twelve-tribes": (
    <g>
      {Array.from({ length: 12 }).map((_, k) => {
        const ang = Math.PI * (k / 11);
        const cx = 24 - 17 * dcos(ang);
        const cy = 34 - 15 * dsin(ang);
        return <circle key={k} cx={cx} cy={cy} r="1.5" fill="var(--gold)" stroke="none" />;
      })}
      <path d="M9 40 L39 40" {...stroke} />
    </g>
  ),
  // Joseph in Egypt — the bound sheaf of stored grain.
  "grain-sheaves": (
    <g>
      <path d="M24 40 C20 40 16 36 15 27 M24 40 C28 40 32 36 33 27 M24 40 L24 25" {...stroke} />
      <path d="M15 27 q9 -4 18 0" {...stroke} />
      <path d="M24 25 q-3 -6 -6 -10 M24 25 q3 -6 6 -10 M24 25 L24 12" {...gold} />
      <path d="M18 16 q0 -3 1 -5 M30 16 q0 -3 -1 -5" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Sarah — the cradle of the long-awaited, promised son.
  cradle: (
    <g>
      <path d="M11 24 L37 24 L34 34 Q24 38 14 34 Z" {...stroke} />
      <path d="M11 34 q13 5 26 0" {...stroke} strokeWidth={1} opacity={0.5} />
      <path d="M9 24 q15 -5 30 0" {...gold} strokeWidth={1.4} />
      <circle cx="21" cy="28" r="2.5" {...stroke} strokeWidth={1.2} />
    </g>
  ),
  // Rebekah — the water jar at the well.
  "water-jar": (
    <g>
      <path d="M18 14 L30 14 L29 18 Q35 22 34 30 Q33 40 24 40 Q15 40 14 30 Q13 22 19 18 Z" {...stroke} />
      <path d="M17 15 q7 -3 14 0" {...stroke} strokeWidth={1.2} />
      <path d="M24 23 q-2 3 0 5 q2 -2 0 -5" {...gold} />
      <circle cx="24" cy="32" r="1.6" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // Leah & Rachel — two fruitful branches from one root.
  "twin-branches": (
    <g>
      <path d="M24 40 L20 24 Q16 14 20 9" {...stroke} />
      <path d="M24 40 L28 24 Q32 14 28 9" {...stroke} />
      <circle cx="19" cy="9" r="2.5" {...gold} />
      <circle cx="29" cy="9" r="2.5" {...gold} />
      <path d="M20 24 q-5 -1 -7 -5 M28 24 q5 -1 7 -5" {...stroke} strokeWidth={1.2} />
      <path d="M22 32 q-4 -1 -6 -4 M26 32 q4 -1 6 -4" {...stroke} strokeWidth={1.2} />
    </g>
  ),
  // Isaac — the well re-dug in the land of promise.
  "isaac-well": (
    <g>
      <path d="M11 22 L37 22" {...stroke} />
      <path d="M13 22 L13 34 M35 22 L35 34" {...stroke} />
      <ellipse cx="24" cy="34" rx="11" ry="4" {...stroke} />
      <path d="M24 22 L24 30" {...stroke} strokeWidth={1} />
      <path d="M21 30 L27 30 L26 34 L22 34 Z" {...gold} />
    </g>
  ),
  // Jacob — the ladder set up to heaven.
  "jacob-ladder": (
    <g>
      <path d="M16 42 L22 8" {...stroke} />
      <path d="M28 42 L26 8" {...stroke} />
      <path d="M17 36 L27 36 M18 29 L26.5 29 M19.5 22 L26 22 M21 15 L25.5 15" {...stroke} strokeWidth={1.4} />
      <path d="M24 8 l0 -4 M21 5.5 l6 0 M22 4 l4 4 M26 4 l-4 4" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Joseph — the ornate coat of many colors.
  "joseph-coat": (
    <g>
      <path d="M16 14 L24 10 L32 14 L36 20 L31 24 L31 40 L17 40 L17 24 L12 20 Z" {...stroke} />
      <path d="M24 10 L24 40" {...stroke} strokeWidth={0.7} opacity={0.4} />
      <path d="M18 28 L30 28 M18 32 L30 32 M18 36 L30 36" {...gold} strokeWidth={1.2} />
      <circle cx="24" cy="16" r="1.5" {...gold} strokeWidth={1} />
    </g>
  ),
  // Job — the LORD answering out of the whirlwind.
  "job-whirlwind": (
    <g>
      <path d="M14 12 Q34 10 32 18 Q14 20 18 26 Q32 26 30 32 Q18 34 22 38" {...stroke} />
      <path d="M14 12 Q34 10 32 18" {...gold} />
      <circle cx="24" cy="24" r="1.4" fill="currentColor" stroke="none" opacity={0.6} />
    </g>
  ),
  // Moses — the two tablets of the Law.
  tablets: (
    <g>
      <path d="M11 38 L11 15 Q11 9 17 9 Q23 9 23 15 L23 38 Z" {...stroke} />
      <path d="M25 38 L25 15 Q25 9 31 9 Q37 9 37 15 L37 38 Z" {...stroke} />
      {[19, 24, 29].map((y) => (
        <g key={y}>
          <line x1="14" y1={y} x2="20" y2={y} {...gold} strokeWidth={1.5} />
          <line x1="28" y1={y} x2="34" y2={y} {...gold} strokeWidth={1.5} />
        </g>
      ))}
    </g>
  ),
  // The Exodus — the pillar of cloud and fire that led Israel out.
  "pillar-fire": (
    <g>
      <path d="M24 42 L24 26" {...stroke} strokeWidth={2.4} />
      <path d="M24 26 C18 24 16 18 20 12 C22 15 22 18 24 20 C26 18 26 15 28 12 C32 18 30 24 24 26 Z" {...gold} />
      <path d="M24 24 C21.5 22 21.5 18 23 15 C24 17 24 19 24 21 C24 19 24 17 25 15 C26.5 18 26.5 22 24 24 Z" {...stroke} strokeWidth={1} />
      <path d="M18 40 q6 -2 12 0" {...stroke} strokeWidth={1.2} opacity={0.5} />
    </g>
  ),
  // Passover — the doorframe marked with the blood of the lamb.
  "passover-door": (
    <g>
      <path d="M14 42 L14 14 L34 14 L34 42" {...stroke} />
      <path d="M12 12 L36 12" {...gold} strokeWidth={2} />
      <circle cx="14" cy="24" r="1.9" fill="var(--gold)" stroke="none" />
      <circle cx="34" cy="24" r="1.9" fill="var(--gold)" stroke="none" />
      <path d="M19 42 L19 30 L29 30 L29 42" {...stroke} strokeWidth={1} opacity={0.5} />
    </g>
  ),
  // Sinai & the Law — the mountain, God descending in fire above the peak.
  "sinai-mountain": (
    <g>
      <path d="M8 40 L22 18 L36 40 Z" {...stroke} />
      <path d="M22 18 L22 8 M18 11 L26 11 M19 8.5 L25 13 M25 8.5 L19 13" {...gold} strokeWidth={1.2} />
      <path d="M15 16 q7 -4 14 0" {...stroke} strokeWidth={1.2} opacity={0.6} />
      <path d="M17 40 L20 31 L24 35 L28 31 L31 40" {...stroke} strokeWidth={0.8} opacity={0.4} />
    </g>
  ),
  // The Golden Calf — the idol on its pedestal.
  "golden-calf": (
    <g>
      <path d="M16 41 L32 41 L30 35 L18 35 Z" {...stroke} />
      <path d="M15 31 Q15 25 21 25 L28 25 Q33 25 33 30 L33 34 L15 34 Z" {...gold} />
      <path d="M18 34 L18 41 M30 34 L30 41" {...gold} strokeWidth={1.2} />
      <path d="M15 31 Q10 30 10 26 Q10 23 13 23" {...gold} />
      <path d="M12 23 q-2 -3 0 -5 M13 23 q2 -3 4 -4" {...gold} strokeWidth={1.2} />
      <circle cx="12" cy="27" r="0.9" fill="currentColor" stroke="none" />
    </g>
  ),
  // Wilderness wanderings — the long winding path through the desert.
  "wilderness-path": (
    <g>
      <path d="M8 38 q6 -4 10 0 q6 4 12 0 q4 -3 10 0" {...stroke} strokeWidth={1.2} opacity={0.5} />
      <path d="M10 30 C18 26 16 20 24 16 C32 12 30 20 38 14" {...stroke} strokeDasharray="1 4" />
      <circle cx="10" cy="30" r="1.9" fill="currentColor" stroke="none" />
      <path d="M38 11 l0 6 M35 14 l6 0" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Aaron — the priestly staff that budded with almond blossoms.
  "aaron-rod": (
    <g>
      <path d="M24 42 L24 13" {...stroke} strokeWidth={2} />
      <path d="M24 14 L20 18 M24 14 L28 18 M24 22 L21 26 M24 22 L27 26" {...stroke} strokeWidth={1} />
      <circle cx="24" cy="10" r="3" {...gold} />
      <circle cx="19" cy="16" r="2.5" {...gold} />
      <circle cx="29" cy="16" r="2.5" {...gold} />
      <circle cx="20" cy="24" r="2" {...gold} />
      <circle cx="28" cy="24" r="2" {...gold} />
    </g>
  ),
  // Miriam — the timbrel of the song at the sea.
  timbrel: (
    <g>
      <circle cx="24" cy="23" r="13" {...stroke} />
      <circle cx="24" cy="23" r="9" {...stroke} strokeWidth={1} opacity={0.6} />
      {[30, 90, 150, 210, 270, 330].map((a) => {
        const x = 24 + 13 * dcos((a * Math.PI) / 180);
        const y = 23 + 13 * dsin((a * Math.PI) / 180);
        return <circle key={a} cx={x} cy={y} r="1.6" fill="var(--gold)" stroke="none" />;
      })}
      <path d="M33 32 q4 4 2 9" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Joshua — the trumpet before the walls of Jericho.
  "joshua-trumpet": (
    <g>
      <path d="M11 24 Q20 18 30 20 Q40 22 39 30 Q39 33 36 33 Q37 28 31 26 Q20 23 14 29 Q11 27 11 24 Z" {...stroke} />
      <path d="M41 20 l3 -1 M42 24 l3 0 M41 28 l3 1" {...gold} strokeWidth={1.3} />
      <path d="M12 39 L16 39 L16 35 L20 35 L20 39 L24 39 L24 35 L28 35" {...stroke} strokeWidth={1} opacity={0.5} />
    </g>
  ),
  // Caleb — the cluster of grapes carried back from the promised land.
  "grape-cluster": (
    <g>
      <path d="M9 14 L39 14" {...stroke} strokeWidth={1.6} />
      <path d="M24 14 L24 18" {...stroke} />
      {[
        [21, 20], [27, 20], [24, 24], [19, 25], [29, 25], [22, 29], [26, 29], [24, 33],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" {...gold} strokeWidth={1.2} />
      ))}
      <path d="M20 16 q-2 -2 -4 -1 M28 16 q2 -2 4 -1" {...stroke} strokeWidth={1} />
    </g>
  ),
  // The crossing of the sea — walls of water, a dry path between.
  "parted-sea": (
    <g>
      <path d="M18 12 Q10 18 14 24 Q8 28 13 34 Q9 37 12 40" {...stroke} />
      <path d="M30 12 Q38 18 34 24 Q40 28 35 34 Q39 37 36 40" {...stroke} />
      <path d="M24 14 L24 38" {...gold} strokeDasharray="2.5 4" />
    </g>
  ),
  // Samuel — the horn of anointing oil.
  "horn-of-oil": (
    <g>
      <path d="M13 34 Q10 22 18 15 Q26 8 34 12 L30 18 Q24 16 21 21 Q17 26 20 33 Z" {...stroke} />
      <circle cx="35" cy="20" r="1.5" fill="var(--gold)" stroke="none" />
      <circle cx="37" cy="26" r="1.7" fill="var(--gold)" stroke="none" />
      <circle cx="36" cy="33" r="1.9" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // David — the harp of the psalmist.
  harp: (
    <g>
      <path d="M14 38 Q10 24 15 11" {...stroke} />
      <path d="M34 38 Q38 24 33 11" {...stroke} />
      <path d="M15 11 Q24 6 33 11" {...stroke} />
      <path d="M14 38 L34 38" {...gold} />
      {[19, 24, 29].map((x) => (
        <line key={x} x1={x} y1="12" x2={x + 1.5} y2="37" {...stroke} strokeWidth={1.2} />
      ))}
    </g>
  ),
  // Conquest of Canaan — the walls of Jericho falling.
  "falling-walls": (
    <g>
      <path d="M8 40 L40 40" {...stroke} />
      <path d="M10 40 L10 30 L18 30 L18 40 M18 34 L26 34 L26 40 M26 32 L34 32 L34 40" {...stroke} strokeWidth={1.3} />
      <rect x="21" y="17" width="6" height="6" {...gold} transform="rotate(20 24 20)" />
      <rect x="30" y="21" width="5" height="5" {...stroke} strokeWidth={1.2} transform="rotate(-18 32 23)" />
      <rect x="13" y="19" width="5" height="5" {...stroke} strokeWidth={1.2} transform="rotate(28 15 21)" />
    </g>
  ),
  // The judges — the deliverer's planted sword.
  "judges-sword": (
    <g>
      <path d="M24 40 L24 16" {...stroke} strokeWidth={2} />
      <path d="M24 40 l-2 -3 M24 40 l2 -3" {...stroke} />
      <path d="M17 16 L31 16" {...gold} strokeWidth={2} />
      <path d="M24 16 L24 8" {...stroke} />
      <circle cx="24" cy="7" r="2" {...gold} />
    </g>
  ),
  // Anointing of Saul — the crown, and the oil poured above it.
  "anointing-crown": (
    <g>
      <path d="M12 34 L14 22 L20 28 L24 20 L28 28 L34 22 L36 34 Z" {...stroke} />
      <path d="M12 34 L36 34 L36 38 L12 38 Z" {...gold} />
      <path d="M24 6 q-3 4 0 8 q3 -4 0 -8" {...gold} />
      {[16, 24, 32].map((x) => (
        <circle key={x} cx={x} cy="22" r="1.4" fill="var(--gold)" stroke="none" />
      ))}
    </g>
  ),
  // David becomes king — the lion of Judah.
  "judah-lion": (
    <g>
      <circle cx="24" cy="24" r="8.5" {...stroke} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const x1 = 24 + 8.5 * dcos((a * Math.PI) / 180);
        const y1 = 24 + 8.5 * dsin((a * Math.PI) / 180);
        const x2 = 24 + 14 * dcos((a * Math.PI) / 180);
        const y2 = 24 + 14 * dsin((a * Math.PI) / 180);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} {...gold} strokeWidth={1.4} />;
      })}
      <circle cx="21" cy="22" r="1" fill="currentColor" stroke="none" />
      <circle cx="27" cy="22" r="1" fill="currentColor" stroke="none" />
      <path d="M22 27 q2 2 4 0" {...stroke} strokeWidth={1.2} />
    </g>
  ),
  // The Davidic covenant — the everlasting throne beneath a star.
  throne: (
    <g>
      <path d="M15 40 L15 20 Q15 14 21 14 L27 14 Q33 14 33 20 L33 40" {...stroke} />
      <path d="M15 28 L33 28" {...stroke} strokeWidth={1.2} />
      <path d="M18 40 L18 44 M30 40 L30 44" {...stroke} strokeWidth={1.2} />
      <path d="M24 12 L24 6 M21 9 L27 9 M22 7 L26 11 M26 7 L22 11" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Solomon's temple — the sanctuary in Jerusalem.
  temple: (
    <g>
      <path d="M8 20 L24 10 L40 20 Z" {...stroke} />
      <path d="M11 20 L11 38 M17 20 L17 38 M24 20 L24 38 M31 20 L31 38 M37 20 L37 38" {...stroke} strokeWidth={1.4} />
      <path d="M8 38 L40 38" {...stroke} />
      <path d="M8 20 L40 20" {...gold} strokeWidth={1.6} />
      <path d="M20 38 L20 30 L28 30 L28 38" {...stroke} strokeWidth={1} opacity={0.6} />
    </g>
  ),
  // Deborah — the palm of Deborah, where she judged Israel.
  "palm-tree": (
    <g>
      <path d="M24 40 L24 18" {...stroke} strokeWidth={2} />
      <path d="M24 40 q-3 -1 -5 0 M24 40 q3 -1 5 0" {...stroke} strokeWidth={1} />
      <path d="M24 18 Q14 14 8 18 M24 18 Q34 14 40 18 M24 18 Q16 10 12 8 M24 18 Q32 10 36 8 M24 18 Q24 10 24 6" {...gold} strokeWidth={1.3} />
      <circle cx="22" cy="20" r="1.1" fill="var(--gold)" stroke="none" />
      <circle cx="26" cy="20" r="1.1" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // Gideon — the torch hidden in a jar, carried by the three hundred.
  "gideon-torch": (
    <g>
      <path d="M18 24 L18 36 Q18 40 24 40 Q30 40 30 36 L30 24 Z" {...stroke} />
      <path d="M17 24 L31 24" {...stroke} strokeWidth={1.2} />
      <path d="M24 24 L24 16" {...stroke} />
      <path d="M24 16 C20 12 22 8 24 5 C26 8 28 12 24 16 Z" {...gold} />
    </g>
  ),
  // Samson — the pillars of the temple he pulled down.
  "broken-pillars": (
    <g>
      <path d="M14 40 L14 22 L13 16" {...stroke} strokeWidth={2} />
      <path d="M34 40 L34 22 L35 16" {...stroke} strokeWidth={2} />
      <path d="M11 40 L17 40 M31 40 L37 40" {...stroke} strokeWidth={1.4} />
      <path d="M10 14 L20 12 M28 12 L38 14" {...gold} strokeWidth={1.6} />
      <path d="M24 20 l-2 3 l3 2 l-2 3" {...stroke} strokeWidth={1} opacity={0.6} />
    </g>
  ),
  // Ruth — the gleaned barley of the loyal Moabite in Boaz's field.
  "gleaned-barley": (
    <g>
      <path d="M24 40 L24 12" {...stroke} strokeWidth={1.6} />
      <path d="M24 14 q-3 -3 -3 -7 M24 14 q3 -3 3 -7 M24 19 q-4 -2 -5 -6 M24 19 q4 -2 5 -6 M24 24 q-4 -2 -5 -6 M24 24 q4 -2 5 -6 M24 29 q-4 -2 -5 -6 M24 29 q4 -2 5 -6" {...gold} strokeWidth={1.1} />
      <path d="M24 40 q-3 0 -5 -2 M24 40 q3 0 5 -2" {...stroke} strokeWidth={1} />
    </g>
  ),
  // Saul — the king's spear, so often in his hand.
  "saul-spear": (
    <g>
      <path d="M24 42 L24 10" {...stroke} strokeWidth={2} />
      <path d="M24 6 L20 14 L24 12 L28 14 Z" {...gold} />
      <path d="M24 42 l-2 -3 M24 42 l2 -3" {...stroke} strokeWidth={1.2} />
      <path d="M20 26 L21 22 L24 25 L27 22 L28 26 Z" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Solomon — the balance of his wise judgment.
  scales: (
    <g>
      <path d="M24 10 L24 34" {...stroke} strokeWidth={1.6} />
      <path d="M12 16 L36 16" {...stroke} strokeWidth={1.6} />
      <circle cx="24" cy="10" r="2" {...gold} />
      <path d="M12 16 L8 24 L16 24 Z" {...stroke} />
      <path d="M36 16 L32 24 L40 24 Z" {...stroke} />
      <path d="M12 16 L12 13 M36 16 L36 13" {...stroke} strokeWidth={1} />
      <path d="M20 34 L28 34" {...gold} strokeWidth={1.6} />
    </g>
  ),
  // The kingdom divides — Ahijah's robe torn into twelve pieces.
  "torn-robe": (
    <g>
      <path d="M16 10 L20 8 L24 12 L28 8 L32 10 L30 40 L18 40 Z" {...stroke} />
      <path d="M24 12 l-2 5 l3 4 l-3 5 l2 5 l-2 5 l2 4" {...gold} strokeWidth={1.4} />
      <path d="M22 40 L20 44 M26 40 L28 44" {...stroke} strokeWidth={1} opacity={0.5} />
    </g>
  ),
  // Fall of the North — the broken city of Samaria.
  "broken-city": (
    <g>
      <path d="M8 40 L8 24 L14 24 L14 18 L20 18 L20 26 L25 26" {...stroke} />
      <path d="M31 40 L31 22 L36 22 L36 28 L40 28 L40 40" {...stroke} />
      <path d="M8 40 L40 40" {...stroke} />
      <rect x="24" y="30" width="4" height="4" {...gold} transform="rotate(20 26 32)" />
      <rect x="26" y="24" width="3.5" height="3.5" {...stroke} strokeWidth={1} transform="rotate(-15 28 26)" />
    </g>
  ),
  // Fall of Jerusalem — the temple in flames.
  "burning-temple": (
    <g>
      <path d="M10 40 L10 24 L38 24 L38 40" {...stroke} />
      <path d="M8 24 L24 16 L40 24" {...stroke} />
      <path d="M15 40 L15 28 M24 40 L24 28 M33 40 L33 28" {...stroke} strokeWidth={1.2} />
      <path d="M16 24 C13 20 16 16 15 12 C19 15 20 19 18 24 M28 24 C25 19 28 14 27 10 C32 14 33 19 30 24 M24 24 C21 20 23 15 24 12 C25 15 27 20 24 24" {...gold} />
    </g>
  ),
  // Return from exile — the sun rising behind the rebuilt temple.
  "rising-temple": (
    <g>
      <path d="M8 20 A16 16 0 0 1 40 20" {...gold} />
      <path d="M24 8 L24 4 M14 10 L11 7 M34 10 L37 7" {...gold} strokeWidth={1.2} />
      <path d="M12 40 L12 24 L36 24 L36 40" {...stroke} />
      <path d="M10 24 L24 17 L38 24" {...stroke} />
      <path d="M17 40 L17 30 M24 40 L24 30 M31 40 L31 30" {...stroke} strokeWidth={1.2} />
    </g>
  ),
  // Ahab & Jezebel — the storm-god Baal they promoted.
  "baal-idol": (
    <g>
      <path d="M18 40 L30 40 L30 37 L18 37 Z" {...stroke} />
      <path d="M24 37 L24 20" {...stroke} strokeWidth={2} />
      <circle cx="24" cy="16" r="3.5" {...stroke} />
      <path d="M24 22 L30 16" {...stroke} strokeWidth={1.6} />
      <path d="M30 16 l3 -3 l-2 4 l3 -1 l-4 4" {...gold} strokeWidth={1.4} />
      <path d="M24 22 L19 27" {...stroke} strokeWidth={1.6} />
      <path d="M21 13 q-2 -3 0 -5 M27 13 q2 -3 0 -5" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Hezekiah — the shadow that went back on the sundial.
  sundial: (
    <g>
      <path d="M10 34 A18 18 0 0 1 38 34" {...stroke} />
      {[200, 225, 250, 290, 315, 340].map((a, i) => {
        const x1 = 24 + 16 * dcos((a * Math.PI) / 180);
        const y1 = 34 + 16 * dsin((a * Math.PI) / 180);
        const x2 = 24 + 13 * dcos((a * Math.PI) / 180);
        const y2 = 34 + 13 * dsin((a * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...stroke} strokeWidth={1} />;
      })}
      <path d="M24 34 L14 26" {...gold} strokeWidth={1.6} />
      <path d="M24 34 L24 28" {...stroke} strokeWidth={1.4} />
      <path d="M10 34 L38 34" {...stroke} />
    </g>
  ),
  // Josiah — the Book of the Law found in the temple.
  "found-scroll": (
    <g>
      <path d="M12 12 Q10 12 10 15 L10 33 Q10 36 12 36 L36 36 Q38 36 38 33 L38 15 Q38 12 36 12 Z" {...stroke} />
      <path d="M14 12 Q12 12 12 15 L12 33 Q12 36 14 36 M34 12 Q36 12 36 15 L36 33 Q36 36 34 36" {...stroke} strokeWidth={1} opacity={0.6} />
      <path d="M18 19 L30 19 M18 24 L30 24 M18 29 L26 29" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Elijah — the chariot of fire.
  "fiery-chariot": (
    <g>
      <circle cx="18" cy="30" r="7" {...stroke} />
      {[0, 45, 90, 135].map((a, i) => (
        <line key={i} x1={18 - 7 * dcos((a * Math.PI) / 180)} y1={30 - 7 * dsin((a * Math.PI) / 180)} x2={18 + 7 * dcos((a * Math.PI) / 180)} y2={30 + 7 * dsin((a * Math.PI) / 180)} {...stroke} strokeWidth={1} />
      ))}
      <path d="M25 30 L34 30 L34 24 L27 24" {...stroke} />
      <path d="M20 20 C17 16 20 12 19 9 C23 12 24 16 22 20 M28 20 C25 15 28 11 27 8 C32 12 33 16 30 20" {...gold} />
    </g>
  ),
  // Elisha — the fallen mantle of Elijah.
  mantle: (
    <g>
      <path d="M16 10 Q24 6 32 10 L34 16 L28 18 L28 40 L20 40 L20 18 L14 16 Z" {...stroke} />
      <path d="M24 12 L24 40" {...stroke} strokeWidth={0.8} opacity={0.5} />
      <path d="M20 24 L28 24 M20 30 L28 30" {...gold} strokeWidth={1} opacity={0.7} />
      <circle cx="24" cy="14" r="1.6" {...gold} />
    </g>
  ),
  // Isaiah — the burning coal that touched his lips.
  "burning-coal": (
    <g>
      <path d="M14 40 L22 22 M20 40 L26 24" {...stroke} />
      <path d="M22 22 Q24 18 26 22" {...stroke} />
      <circle cx="24" cy="18" r="5" {...gold} />
      <path d="M21 13 q-1 -3 1 -5 M27 13 q1 -3 -1 -5 M24 11 q0 -3 0 -5" {...gold} strokeWidth={1.1} />
    </g>
  ),
  // Jeremiah — the wooden yoke, sign of submission to Babylon.
  yoke: (
    <g>
      <path d="M8 18 Q24 12 40 18" {...stroke} strokeWidth={2.2} />
      <path d="M14 17 Q10 24 16 28 Q22 24 18 17" {...stroke} />
      <path d="M30 17 Q26 24 32 28 Q38 24 34 17" {...stroke} />
      <path d="M24 15 L24 22" {...gold} strokeWidth={1.4} />
      <circle cx="24" cy="24" r="1.6" {...gold} />
    </g>
  ),
  // Ezekiel — the wheel within a wheel, full of eyes.
  "ezekiel-wheels": (
    <g>
      <circle cx="24" cy="24" r="14" {...stroke} />
      <circle cx="24" cy="24" r="8" {...gold} />
      <path d="M10 24 L38 24 M24 10 L24 38" {...stroke} strokeWidth={1} />
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const x = 24 + 14 * dcos((a * Math.PI) / 180);
        const y = 24 + 14 * dsin((a * Math.PI) / 180);
        return <circle key={i} cx={x} cy={y} r="1.3" fill="currentColor" stroke="none" />;
      })}
    </g>
  ),
  // Daniel — the lion in the den.
  "lions-den": (
    <g>
      <path d="M8 40 L8 24 Q8 12 24 12 Q40 12 40 24 L40 40" {...stroke} />
      <path d="M16 40 L16 20 M24 40 L24 14 M32 40 L32 20" {...stroke} strokeWidth={1} opacity={0.45} />
      <circle cx="24" cy="30" r="5" {...gold} />
      {[210, 250, 290, 330].map((a, i) => {
        const x1 = 24 + 5 * dcos((a * Math.PI) / 180);
        const y1 = 30 + 5 * dsin((a * Math.PI) / 180);
        const x2 = 24 + 8 * dcos((a * Math.PI) / 180);
        const y2 = 30 + 8 * dsin((a * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...gold} strokeWidth={1.2} />;
      })}
      <circle cx="22" cy="29" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="26" cy="29" r="0.7" fill="currentColor" stroke="none" />
    </g>
  ),
  // Hosea — the covenant love that endures unfaithfulness.
  "love-heart": (
    <g>
      <path d="M24 36 C10 26 12 12 24 18 C36 12 38 26 24 36 Z" {...gold} />
      <path d="M24 18 l-2 5 l3 3 l-2 5 l1 3" {...stroke} strokeWidth={1} opacity={0.6} />
    </g>
  ),
  // Amos — the plumb line held against a wall gone out of true.
  "plumb-line": (
    <g>
      <path d="M24 8 L24 34" {...stroke} strokeWidth={1.2} />
      <circle cx="24" cy="8" r="1.8" {...stroke} />
      <path d="M24 34 L20 38 L24 44 L28 38 Z" {...gold} />
      <path d="M14 12 L16 42" {...stroke} strokeWidth={1.6} opacity={0.7} />
    </g>
  ),
  // Jonah — the great fish.
  "jonah-fish": (
    <g>
      <path d="M8 24 Q18 12 32 16 Q40 18 40 24 Q40 30 32 32 Q18 36 8 24 Z" {...stroke} />
      <path d="M8 24 L3 18 L5 24 L3 30 Z" {...stroke} />
      <circle cx="32" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <path d="M10 38 q5 -3 10 0 q5 3 10 0 q5 -3 10 0" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Micah — swords beaten into a plowshare.
  plowshare: (
    <g>
      <path d="M14 20 L34 20 L30 30 Q24 36 18 30 Z" {...gold} />
      <path d="M24 20 L24 12 L30 8" {...stroke} strokeWidth={1.6} />
      <path d="M12 38 q6 -2 12 0 q6 2 12 0" {...stroke} strokeWidth={1} opacity={0.5} />
      <path d="M12 42 q6 -2 12 0 q6 2 12 0" {...stroke} strokeWidth={1} opacity={0.4} />
    </g>
  ),
  // The Minor Prophets — the Book of the Twelve.
  "scroll-twelve": (
    <g>
      <path d="M12 10 L36 10 Q38 10 38 13 L38 35 Q38 38 36 38 L12 38 Q10 38 10 35 L10 13 Q10 10 12 10 Z" {...stroke} />
      <path d="M14 10 Q12 10 12 13 L12 38 M34 10 Q36 10 36 13 L36 38" {...stroke} strokeWidth={0.8} opacity={0.5} />
      {[0, 1, 2, 3, 4, 5].map((r) => (
        <g key={r}>
          <line x1="18" y1={15 + r * 4} x2="23" y2={15 + r * 4} {...gold} strokeWidth={1.1} />
          <line x1="25" y1={15 + r * 4} x2="30" y2={15 + r * 4} {...gold} strokeWidth={1.1} />
        </g>
      ))}
    </g>
  ),
  // Esther — the golden scepter the king extended to her.
  "queen-scepter": (
    <g>
      <path d="M14 40 L32 14" {...stroke} strokeWidth={2} />
      <circle cx="33" cy="12" r="3.5" {...gold} />
      <path d="M33 8.5 l0 -3 M29.5 12 l-3 0 M30.5 9.5 l5 5 M35.5 9.5 l-5 5" {...gold} strokeWidth={1} />
      <path d="M11 40 L12 36 L14 38 L16 35 L18 38 L20 36 L21 40 Z" {...stroke} strokeWidth={1.2} />
    </g>
  ),
  // Ezra — the scribe's scroll and stylus.
  "scribe-scroll": (
    <g>
      <path d="M12 32 Q12 28 16 28 L34 28 Q38 28 38 32 Q38 36 34 36 L16 36 Q12 36 12 32 Z" {...stroke} />
      <path d="M16 28 L16 18 Q16 14 20 14 L36 14" {...stroke} />
      <path d="M20 19 L32 19 M20 23 L30 23" {...gold} strokeWidth={1.1} />
      <path d="M30 10 L22 24" {...stroke} strokeWidth={1.4} />
      <path d="M30 10 L33 8 L31 12 Z" {...gold} />
    </g>
  ),
  // Nehemiah — the rebuilt wall and the builder's trowel.
  "wall-trowel": (
    <g>
      <path d="M8 40 L8 22 L14 22 L14 18 L20 18 L20 22 L28 22 L28 18 L34 18 L34 22 L40 22 L40 40 Z" {...stroke} />
      <path d="M8 28 L40 28 M8 34 L40 34 M20 22 L20 40 M14 28 L14 34" {...stroke} strokeWidth={0.8} opacity={0.5} />
      <path d="M30 14 L36 8" {...stroke} strokeWidth={1.4} />
      <path d="M28 16 L34 12 L32 18 Z" {...gold} />
    </g>
  ),
  // Herod the Great — the heavy jeweled crown of the threatened king.
  "herod-crown": (
    <g>
      <path d="M10 34 L12 18 L19 26 L24 14 L29 26 L36 18 L38 34 Z" {...stroke} />
      <path d="M10 34 L38 34 L38 39 L10 39 Z" {...gold} />
      {[16, 24, 32].map((x) => (
        <circle key={x} cx={x} cy="19" r="1.6" {...stroke} strokeWidth={1} />
      ))}
      {[15, 24, 33].map((x) => (
        <circle key={x} cx={x} cy="36.5" r="1.2" fill="var(--gold)" stroke="none" />
      ))}
    </g>
  ),
  // Mary — the annunciation lily.
  lily: (
    <g>
      <path d="M24 40 L24 20" {...stroke} strokeWidth={1.6} />
      <path d="M24 20 C18 14 18 8 22 6 C24 10 24 15 24 20" {...gold} />
      <path d="M24 20 C30 14 30 8 26 6 C24 10 24 15 24 20" {...gold} />
      <path d="M24 20 C22 12 24 8 24 6 C24 8 26 12 24 20" {...stroke} strokeWidth={1.2} />
      <path d="M24 32 q-6 -2 -8 -7 M24 28 q6 -2 8 -7" {...stroke} strokeWidth={1.2} />
    </g>
  ),
  // Joseph of Nazareth — the carpenter's square and saw.
  "carpenter-tools": (
    <g>
      <path d="M14 12 L14 34 L34 34" {...stroke} strokeWidth={2} />
      <path d="M17 15 L17 31 L33 31" {...stroke} strokeWidth={0.8} opacity={0.5} />
      <path d="M20 20 L36 12" {...gold} strokeWidth={1.6} />
      <path d="M20 20 l0 3 l3 -1 M36 12 l2 -1 l0 3" {...stroke} strokeWidth={1} />
    </g>
  ),
  // John the Baptist — the baptismal scallop shell.
  "baptist-shell": (
    <g>
      <path d="M10 20 Q24 6 38 20 Q24 24 10 20 Z" {...stroke} />
      {[14, 19, 24, 29, 34].map((x, i) => (
        <path key={i} d={`M24 22 L${x} 20`} {...stroke} strokeWidth={0.8} opacity={0.6} />
      ))}
      <path d="M20 26 q-1 3 0 4 M24 28 q-1 3 0 4 M28 26 q-1 3 0 4" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Pontius Pilate — the basin and ewer for washing his hands.
  "pilate-basin": (
    <g>
      <path d="M12 26 Q24 34 36 26 L34 32 Q24 38 14 32 Z" {...stroke} />
      <path d="M12 26 L36 26" {...stroke} strokeWidth={1.2} />
      <path d="M28 12 Q34 12 34 18 L34 20 Q30 22 28 20 L28 14" {...stroke} />
      <path d="M28 20 L24 24" {...gold} strokeWidth={1.4} />
      <circle cx="22" cy="28" r="1.2" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // Annunciation & Nativity — the star of Bethlehem over the manger.
  "nativity-star": (
    <g>
      <path d="M12 34 L20 40 L28 40 L36 34" {...stroke} />
      <path d="M14 34 L34 34" {...stroke} strokeWidth={1.2} />
      <path d="M18 34 L20 40 M30 34 L28 40" {...stroke} strokeWidth={0.8} opacity={0.6} />
      <path d="M24 6 L24 28 M17 13 L31 13 M19 8 L29 20 M29 8 L19 20" {...gold} strokeWidth={1.2} />
    </g>
  ),
  // Baptism of Jesus — the dove descending, over the water.
  "baptism-dove": (
    <g>
      <path d="M24 10 Q20 16 24 20 Q28 16 24 10" {...stroke} />
      <path d="M24 16 Q16 13 12 18 Q18 20 22 19 M24 16 Q32 13 36 18 Q30 20 26 19" {...stroke} />
      <path d="M24 8 L24 5 M20 9 L18 6 M28 9 L30 6" {...gold} strokeWidth={1} />
      <path d="M8 30 q4 -3 8 0 q4 3 8 0 q4 -3 8 0 q4 3 8 0" {...stroke} />
      <path d="M8 35 q4 -3 8 0 q4 3 8 0 q4 -3 8 0 q4 3 8 0" {...stroke} opacity={0.6} />
    </g>
  ),
  // Public ministry & the Sermon on the Mount — the teaching on the hill.
  "teaching-mount": (
    <g>
      <path d="M6 38 Q24 20 42 38 Z" {...stroke} />
      <path d="M24 14 Q20 12 16 13 L16 20 Q20 19 24 21 Q28 19 32 20 L32 13 Q28 12 24 14 Z" {...gold} />
      <path d="M24 14 L24 21" {...gold} strokeWidth={0.8} />
      <path d="M24 10 L24 7 M19 11 L17 8 M29 11 L31 8" {...gold} strokeWidth={1} />
    </g>
  ),
  // The Transfiguration — glory blazing on the mountain.
  "transfiguration-glory": (
    <g>
      <path d="M10 40 L24 20 L38 40 Z" {...stroke} />
      <circle cx="24" cy="18" r="4" {...gold} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const x1 = 24 + 5 * dcos((a * Math.PI) / 180);
        const y1 = 18 + 5 * dsin((a * Math.PI) / 180);
        const x2 = 24 + 9 * dcos((a * Math.PI) / 180);
        const y2 = 18 + 9 * dsin((a * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...gold} strokeWidth={1.1} />;
      })}
    </g>
  ),
  // The Triumphal Entry — the donkey and the palm.
  donkey: (
    <g>
      <path d="M14 28 Q14 22 20 22 L30 22 Q34 22 34 26 L34 30 L14 30 Z" {...stroke} />
      <path d="M34 26 Q38 24 39 19 L36 18 Q34 22 32 24" {...stroke} />
      <path d="M37 18 q0 -5 2 -7 M39 18 q1 -4 3 -5" {...stroke} strokeWidth={1.2} />
      <path d="M18 30 L18 38 M28 30 L28 38" {...stroke} strokeWidth={1.4} />
      <path d="M12 18 Q20 12 28 14" {...gold} strokeWidth={1.2} />
      <path d="M12 18 q3 -1 4 -4 M18 15 q3 -1 4 -3" {...gold} strokeWidth={1} />
    </g>
  ),
  // The Last Supper — the bread and the cup.
  "bread-cup": (
    <g>
      <path d="M18 20 Q18 30 24 30 Q30 30 30 20 Z" {...stroke} />
      <path d="M24 30 L24 36 M18 38 L30 38" {...stroke} strokeWidth={1.4} />
      <path d="M18 20 L30 20" {...gold} strokeWidth={1.4} />
      <path d="M8 24 Q8 18 16 18 Q18 18 18 22 L18 26 L8 26 Z" {...gold} />
      <path d="M10 21 l1 3 M13 20 l1 3" {...stroke} strokeWidth={0.8} opacity={0.6} />
    </g>
  ),
  // The Crucifixion — the cross ringed by the crown of thorns.
  "cross-thorns": (
    <g>
      <path d="M24 8 L24 40" {...stroke} strokeWidth={2.4} />
      <path d="M15 18 L33 18" {...stroke} strokeWidth={2.4} />
      <circle cx="24" cy="18" r="7" {...gold} />
      {[20, 70, 120, 160, 200, 250, 300, 340].map((a, i) => {
        const x = 24 + 7 * dcos((a * Math.PI) / 180);
        const y = 18 + 7 * dsin((a * Math.PI) / 180);
        const x2 = 24 + 9.5 * dcos((a * Math.PI) / 180);
        const y2 = 18 + 9.5 * dsin((a * Math.PI) / 180);
        return <line key={i} x1={x} y1={y} x2={x2} y2={y2} {...gold} strokeWidth={0.9} />;
      })}
    </g>
  ),
  // The Resurrection — the empty tomb, its stone rolled away.
  "empty-tomb": (
    <g>
      <path d="M10 40 L10 26 Q10 16 22 16 Q34 16 34 26 L34 40" {...stroke} />
      <path d="M16 40 L16 28 Q16 22 22 22 Q28 22 28 28 L28 40" {...stroke} strokeWidth={1} opacity={0.5} />
      <circle cx="40" cy="34" r="5" {...stroke} />
      <path d="M40 30 L40 38" {...stroke} strokeWidth={0.8} opacity={0.5} />
      <path d="M22 12 L22 8 M17 14 L15 10 M27 14 L29 10" {...gold} strokeWidth={1.1} />
    </g>
  ),
  // The Ascension — the figure taken up into the cloud.
  "ascending-cloud": (
    <g>
      <path d="M12 18 Q10 12 16 12 Q18 8 24 10 Q30 8 32 13 Q38 13 36 18 Z" {...gold} />
      <path d="M24 40 L24 20" {...stroke} strokeWidth={1.6} />
      <path d="M24 20 l-3 4 M24 20 l3 4" {...stroke} strokeWidth={1.2} />
      <path d="M18 34 L18 30 M30 34 L30 30 M24 44 L24 40" {...gold} strokeWidth={1} />
    </g>
  ),
  // Andrew — the X-shaped saltire cross of his martyrdom.
  "andrew-cross": (
    <g>
      <path d="M12 12 L36 36 M36 12 L12 36" {...stroke} strokeWidth={2.4} />
      {[[12, 12], [36, 12], [12, 36], [36, 36]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" {...gold} />
      ))}
    </g>
  ),
  // James son of Zebedee — the sword of his martyrdom, the pilgrim's shell above.
  "james-sword": (
    <g>
      <path d="M24 42 L24 20" {...stroke} strokeWidth={2} />
      <path d="M18 20 L30 20" {...stroke} strokeWidth={1.8} />
      <path d="M24 20 L21 24 M24 20 L27 24" {...stroke} strokeWidth={1.4} />
      <path d="M16 14 Q24 4 32 14 Q24 17 16 14 Z" {...gold} />
      {[19, 24, 29].map((x, i) => (
        <path key={i} d={`M24 16 L${x} 14`} {...gold} strokeWidth={0.7} opacity={0.6} />
      ))}
    </g>
  ),
  // John — the eagle of the Evangelist.
  eagle: (
    <g>
      <path d="M24 14 L24 32" {...stroke} strokeWidth={1.6} />
      <circle cx="24" cy="12" r="3" {...stroke} />
      <path d="M27 12 l4 -1" {...gold} strokeWidth={1.4} />
      <path d="M24 18 Q14 14 8 20 Q16 22 22 22 M24 18 Q34 14 40 20 Q32 22 26 22" {...gold} />
      <path d="M24 24 Q16 22 12 27 Q18 28 22 27 M24 24 Q32 22 36 27 Q30 28 26 27" {...stroke} strokeWidth={1.2} />
      <path d="M24 32 l-3 6 M24 32 l3 6 M24 32 l0 7" {...stroke} strokeWidth={1} />
    </g>
  ),
  // Philip — the basket of loaves from the feeding.
  "philip-loaves": (
    <g>
      <path d="M12 24 L36 24 L33 38 Q24 42 15 38 Z" {...stroke} />
      <path d="M12 24 q12 -5 24 0" {...stroke} strokeWidth={1} opacity={0.5} />
      <path d="M16 24 Q16 18 22 18 Q24 18 24 22 L24 24 Z" {...gold} />
      <path d="M24 24 Q24 18 30 18 Q32 18 32 22 L32 24 Z" {...gold} />
      <path d="M18 30 l-3 -2 l1 2 l-1 2 Z M30 30 l3 -2 l-1 2 l1 2 Z" {...stroke} strokeWidth={1} />
    </g>
  ),
  // Thomas — the hand reaching to touch the wounds.
  "doubting-hand": (
    <g>
      <path d="M14 34 Q12 28 16 26 L22 24 L22 14 Q22 11 25 11 Q28 11 28 14 L28 26 L34 26 Q37 27 36 31 L34 36 Q32 38 28 38 L20 38 Q16 38 14 34 Z" {...stroke} />
      <path d="M22 12 l-6 -2" {...gold} strokeWidth={1.6} />
      <path d="M14 9 q-2 1 -1 3 q2 -1 1 -3" {...gold} />
    </g>
  ),
  // Matthew — the money bag of the tax collector.
  "money-bag": (
    <g>
      <path d="M16 20 Q16 16 20 15 L28 15 Q32 16 32 20 Q40 28 36 36 Q34 40 24 40 Q14 40 12 36 Q8 28 16 20 Z" {...stroke} />
      <path d="M18 18 q6 -3 12 0" {...stroke} strokeWidth={1.2} />
      <circle cx="24" cy="30" r="4" {...gold} />
      <path d="M24 27 L24 33 M22 30 L26 30" {...gold} strokeWidth={1} />
    </g>
  ),
  // The other apostles — the net of the fishers of men.
  net: (
    <g>
      <path d="M10 14 Q24 10 38 14" {...stroke} />
      <path d="M12 16 L20 40 M24 15 L24 40 M36 16 L28 40" {...stroke} strokeWidth={0.9} opacity={0.7} />
      <path d="M14 22 L34 22 M16 30 L32 30 M18 38 L30 38" {...stroke} strokeWidth={0.9} opacity={0.7} />
      {[12, 18, 24, 30, 36].map((x, i) => (
        <circle key={i} cx={x} cy={14 + Math.abs(x - 24) * 0.15} r="1.4" {...gold} strokeWidth={0.8} />
      ))}
    </g>
  ),
  // Judas Iscariot — the thirty pieces of silver, thrown down.
  "thirty-silver": (
    <g>
      {[[16, 20], [26, 17], [32, 24], [18, 30], [28, 32], [22, 25]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" {...gold} strokeWidth={1.2} />
          <path d={`M${x} ${y - 2} L${x} ${y + 2}`} {...gold} strokeWidth={0.8} />
        </g>
      ))}
      <path d="M10 40 L38 40" {...stroke} strokeWidth={1} opacity={0.5} />
    </g>
  ),
  // Matthias — the lots by which he was chosen.
  "casting-lots": (
    <g>
      <rect x="12" y="22" width="12" height="12" rx="2" {...stroke} transform="rotate(-12 18 28)" />
      <rect x="26" y="24" width="11" height="11" rx="2" {...gold} transform="rotate(10 31 30)" />
      <circle cx="18" cy="28" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="25" r="1" fill="currentColor" stroke="none" />
      <circle cx="21" cy="31" r="1" fill="currentColor" stroke="none" />
      <circle cx="31" cy="30" r="1.2" fill="var(--gold)" stroke="none" />
    </g>
  ),
  // Mary Magdalene — the jar of spices carried to the tomb.
  "spice-jar": (
    <g>
      <path d="M18 16 L30 16 L29 20 Q34 24 34 30 Q34 40 24 40 Q14 40 14 30 Q14 24 19 20 Z" {...stroke} />
      <path d="M18 15 L30 15" {...gold} strokeWidth={1.4} />
      <path d="M22 14 q-1 -3 1 -5 M26 14 q1 -3 -1 -5" {...gold} strokeWidth={1} opacity={0.7} />
      <path d="M16 28 q8 3 16 0" {...gold} strokeWidth={1} opacity={0.6} />
    </g>
  ),
  // Barnabas — open hands lifting a gift (son of encouragement).
  encourager: (
    <g>
      <path d="M10 26 Q14 34 22 34 Q18 28 14 26 Q11 25 10 26 Z" {...stroke} />
      <path d="M38 26 Q34 34 26 34 Q30 28 34 26 Q37 25 38 26 Z" {...stroke} />
      <path d="M24 30 C20 24 22 18 24 20 C26 18 28 24 24 30 Z" {...gold} />
      <path d="M24 30 L24 38" {...stroke} strokeWidth={1} opacity={0.5} />
    </g>
  ),
  // Timothy — the torch of the faith handed on.
  "passed-torch": (
    <g>
      <path d="M20 40 L28 20" {...stroke} strokeWidth={2} />
      <path d="M28 20 C24 16 27 11 28 8 C31 12 32 16 30 21 Z" {...gold} />
      <path d="M14 40 Q14 34 20 34 L24 34" {...stroke} strokeWidth={1.4} />
      <path d="M16 34 q4 -2 7 0" {...stroke} strokeWidth={1} opacity={0.6} />
    </g>
  ),
  // Luke — the winged ox of the Evangelist.
  ox: (
    <g>
      <path d="M16 20 Q16 34 24 36 Q32 34 32 20" {...stroke} />
      <path d="M16 20 Q12 16 10 10 Q16 12 18 18 M32 20 Q36 16 38 10 Q32 12 30 18" {...gold} />
      <circle cx="20" cy="24" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="28" cy="24" r="1.2" fill="currentColor" stroke="none" />
      <path d="M22 30 q2 2 4 0" {...stroke} strokeWidth={1} />
      <path d="M32 22 q6 0 8 4 q-4 1 -7 -1" {...gold} strokeWidth={1} opacity={0.7} />
    </g>
  ),
  // Mark — the winged lion of the Evangelist.
  "winged-lion": (
    <g>
      <circle cx="22" cy="26" r="7" {...stroke} />
      {[100, 140, 180, 220, 260].map((a, i) => {
        const x1 = 22 + 7 * dcos((a * Math.PI) / 180);
        const y1 = 26 + 7 * dsin((a * Math.PI) / 180);
        const x2 = 22 + 11 * dcos((a * Math.PI) / 180);
        const y2 = 26 + 11 * dsin((a * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...gold} strokeWidth={1.2} />;
      })}
      <circle cx="20" cy="24" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="24" cy="24" r="0.8" fill="currentColor" stroke="none" />
      <path d="M28 20 Q38 16 40 24 Q34 24 30 26 M30 24 Q37 22 39 27" {...gold} strokeWidth={1} />
    </g>
  ),
  // Stephen — the martyr's laurel crown and cross.
  "martyr-crown": (
    <g>
      <path d="M10 24 Q10 12 24 12 Q38 12 38 24 Q38 34 24 34 Q10 34 10 24 Z" {...gold} strokeWidth={1.4} />
      {[130, 150, 170, 190, 210, 230].map((a, i) => {
        const x1 = 24 + 14 * dcos((a * Math.PI) / 180);
        const y1 = 24 + 11 * dsin((a * Math.PI) / 180);
        return <path key={i} d={`M${x1} ${y1} l-2 -2`} {...gold} strokeWidth={0.8} />;
      })}
      <path d="M24 18 L24 30 M19 24 L29 24" {...stroke} strokeWidth={1.6} />
    </g>
  ),
  // James the Just — the fuller's club of his martyrdom.
  "james-club": (
    <g>
      <path d="M18 40 L28 16 Q30 10 34 10 Q38 10 38 15 Q38 20 32 22 L22 42 Z" {...stroke} />
      <path d="M30 14 q3 0 4 3" {...gold} strokeWidth={1} opacity={0.6} />
      <path d="M18 40 L22 42" {...stroke} strokeWidth={1.4} />
    </g>
  ),
  // Martyrdom of Stephen — the stones, thrown.
  "stephen-stones": (
    <g>
      {[[14, 30], [22, 34], [30, 30], [18, 38], [28, 38], [24, 26], [34, 36]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.5" ry="2.8" {...stroke} strokeWidth={1.2} transform={`rotate(${(i * 40) % 360} ${x} ${y})`} />
      ))}
      <path d="M12 14 l4 4 M24 12 l0 5 M36 14 l-4 4" {...gold} strokeWidth={1} opacity={0.6} />
    </g>
  ),
  // Conversion of Paul — the blinding light on the Damascus road.
  "damascus-light": (
    <g>
      <circle cx="24" cy="14" r="4" {...gold} />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
        const x1 = 24 + 5 * dcos((a * Math.PI) / 180);
        const y1 = 14 + 5 * dsin((a * Math.PI) / 180);
        const r2 = a > 60 && a < 120 ? 12 : 9;
        const x2 = 24 + r2 * dcos((a * Math.PI) / 180);
        const y2 = 14 + r2 * dsin((a * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...gold} strokeWidth={1} />;
      })}
      <path d="M10 40 L38 40" {...stroke} opacity={0.5} />
      <path d="M18 40 Q24 34 30 40" {...stroke} strokeWidth={1.4} />
    </g>
  ),
  // Council of Jerusalem — the door of faith opened to the Gentiles.
  "open-door": (
    <g>
      <path d="M14 40 L14 12 L34 12 L34 40" {...stroke} />
      <path d="M14 12 L22 8 L22 40 L14 40" {...stroke} strokeWidth={1.2} />
      <path d="M24 16 L30 16 M24 22 L32 22 M24 28 L30 28" {...gold} strokeWidth={1.1} />
      <circle cx="20" cy="26" r="1" {...stroke} />
    </g>
  ),
  // Paul's journeys — the ship crossing the Roman sea.
  "sailing-ship": (
    <g>
      <path d="M10 30 L38 30 L34 38 Q24 40 14 38 Z" {...stroke} />
      <path d="M24 30 L24 10" {...stroke} strokeWidth={1.6} />
      <path d="M24 12 Q34 16 32 28 L24 28 Z" {...gold} />
      <path d="M24 14 Q16 18 17 28 L24 28 Z" {...stroke} strokeWidth={1} opacity={0.6} />
      <path d="M8 40 q4 -2 8 0 q4 2 8 0 q4 -2 8 0" {...stroke} strokeWidth={1} opacity={0.5} />
    </g>
  ),
  // Fall of Jerusalem (70) — the temple menorah, carried to Rome.
  menorah: (
    <g>
      <path d="M24 14 L24 34" {...stroke} strokeWidth={1.6} />
      <path d="M24 22 Q19 22 19 15 M24 22 Q29 22 29 15" {...gold} strokeWidth={1.2} />
      <path d="M24 24 Q15 24 15 15 M24 24 Q33 24 33 15" {...gold} strokeWidth={1.2} />
      <path d="M24 26 Q11 26 11 15 M24 26 Q37 26 37 15" {...gold} strokeWidth={1.2} />
      <path d="M20 34 L28 34 M18 38 L30 38 L28 34 L20 34 Z" {...stroke} />
      {[11, 15, 19, 24, 29, 33, 37].map((x) => (
        <circle key={x} cx={x} cy="14" r="1.2" fill="var(--gold)" stroke="none" />
      ))}
    </g>
  ),
  // Jesus Christ — the Chi-Rho, oldest of the christograms.
  "chi-rho": (
    <g>
      <path d="M24 40 L24 12" {...stroke} strokeWidth={2.4} />
      <path d="M24 12 Q24 7 28.5 7 Q33 7 33 11.5 Q33 16 24 16" {...stroke} strokeWidth={2.4} />
      <path d="M14 18 L34 38 M34 18 L14 38" {...gold} strokeWidth={2.2} />
    </g>
  ),
  // Peter — the crossed keys of the kingdom.
  "crossed-keys": (
    <g>
      <circle cx="13" cy="13" r="4.5" {...stroke} />
      <path d="M16 16 L36 36 M36 36 L36 30 M36 36 L30 36" {...stroke} />
      <circle cx="35" cy="13" r="4.5" {...gold} />
      <path d="M32 16 L12 36 M12 36 L12 30 M12 36 L18 36" {...gold} />
    </g>
  ),
  // Paul — the scroll of the letters and the sword of his martyrdom.
  "scroll-sword": (
    <g>
      <path d="M24 6 L24 34 M24 34 L20 30 M24 34 L28 30" {...gold} />
      <path d="M17 38 L31 38" {...gold} />
      <path d="M10 16 Q10 12 14 12 L34 12 Q38 12 38 16 Q38 20 34 20 L14 20 Q10 20 10 24 L10 28 Q10 32 14 32" {...stroke} strokeWidth={1.8} />
    </g>
  ),
  // Pentecost — the dove descending amid tongues of fire.
  "dove-flame": (
    <g>
      <path d="M24 10 Q20 16 24 22 Q28 16 24 10" {...stroke} />
      <path d="M24 18 Q14 14 10 20 Q16 22 22 22 M24 18 Q34 14 38 20 Q32 22 26 22" {...stroke} />
      {[14, 24, 34].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${i === 1 ? 40 : 38} Q${x - 3} ${i === 1 ? 34 : 33} ${x} ${i === 1 ? 28 : 30} Q${x + 3} ${i === 1 ? 34 : 33} ${x} ${i === 1 ? 40 : 38}`}
          {...gold}
        />
      ))}
    </g>
  ),
  // Nicaea — the open codex of the creed, crowned by the cross.
  "council-codex": (
    <g>
      <path d="M24 20 Q16 15 8 18 L8 36 Q16 33 24 38 Q32 33 40 36 L40 18 Q32 15 24 20 Z" {...stroke} />
      <path d="M24 20 L24 38" {...stroke} strokeWidth={1.4} />
      <path d="M24 6 L24 14 M20 9.5 L28 9.5" {...gold} />
    </g>
  ),
  // The Great Schism — one seal torn in two.
  "split-circle": (
    <g>
      <path d="M21 8 A16 16 0 0 0 21 40" {...stroke} />
      <path d="M27 8 A16 16 0 0 1 27 40" {...stroke} />
      <path d="M24 6 L21 16 L26 24 L21 32 L24 42" {...gold} strokeDasharray="none" />
    </g>
  ),
  // Luther — the rose-and-cross seal he designed himself.
  "luther-rose": (
    <g>
      <circle cx="24" cy="24" r="16" {...stroke} />
      {[90, 162, 234, 306, 18].map((a) => {
        const x = 24 + 11 * dcos((a * Math.PI) / 180);
        const y = 24 + 11 * dsin((a * Math.PI) / 180);
        return <circle key={a} cx={x} cy={y} r="4.2" {...stroke} strokeWidth={1.5} />;
      })}
      <path d="M24 18 Q19 22 24 28 Q29 22 24 18 Z" {...gold} />
      <path d="M24 19 L24 26 M21.5 21.5 L26.5 21.5" {...stroke} strokeWidth={1.4} />
    </g>
  ),
  // Westphalia — the olive branch of a negotiated peace.
  "olive-branch": (
    <g>
      <path d="M12 38 Q24 28 34 12" {...stroke} />
      {[
        [17, 33, -1],
        [22, 27, 1],
        [26, 22, -1],
        [30, 17, 1],
      ].map(([x, y, side], i) => (
        <path
          key={i}
          d={`M${x} ${y} Q${x + 6 * side} ${y - 4} ${x + 8 * side} ${y - 8}`}
          {...stroke}
          strokeWidth={1.6}
        />
      ))}
      <circle cx="15" cy="29" r="1.8" fill="var(--gold)" stroke="none" />
      <circle cx="25" cy="18" r="1.8" fill="var(--gold)" stroke="none" />
    </g>
  ),
};

export function EmblemGlyph({ symbol }: { symbol: string }) {
  return GLYPHS[symbol] ?? (
    <circle cx="24" cy="24" r="10" {...stroke} strokeDasharray="3 3" />
  );
}

/** Eight-lobed seal outline for event nodes (drawn around origin). */
export function sealPathD(r: number, lobes = 8): string {
  const pts: string[] = [];
  for (let k = 0; k < lobes; k++) {
    const a1 = (k / lobes) * Math.PI * 2;
    const a2 = ((k + 1) / lobes) * Math.PI * 2;
    const am = (a1 + a2) / 2;
    const x1 = r * dcos(a1);
    const y1 = r * dsin(a1);
    const cx = r * 1.22 * dcos(am);
    const cyy = r * 1.22 * dsin(am);
    const x2 = r * dcos(a2);
    const y2 = r * dsin(a2);
    if (k === 0) pts.push(`M ${x1} ${y1}`);
    pts.push(`Q ${cx} ${cyy} ${x2} ${y2}`);
  }
  return pts.join(" ") + " Z";
}

/**
 * Portrait codex (bound-book) outline for text nodes — a rounded rectangle,
 * taller than wide, drawn around the origin. Distinct from the figure circle
 * and the scalloped event seal so canonical writings read as books at a glance.
 */
export function codexPathD(r: number): string {
  const a = r * 0.72; // half width
  const b = r * 0.9; // half height (portrait)
  const c = r * 0.16; // corner radius
  return [
    `M ${-a + c} ${-b}`,
    `L ${a - c} ${-b}`,
    `Q ${a} ${-b} ${a} ${-b + c}`,
    `L ${a} ${b - c}`,
    `Q ${a} ${b} ${a - c} ${b}`,
    `L ${-a + c} ${b}`,
    `Q ${-a} ${b} ${-a} ${b - c}`,
    `L ${-a} ${-b + c}`,
    `Q ${-a} ${-b} ${-a + c} ${-b}`,
    "Z",
  ].join(" ");
}

/**
 * Standalone emblem for pages (detail page, directory). `framed` draws the
 * node chrome: gold-ringed medallion for figures, eight-lobed seal for events,
 * portrait codex for texts.
 */
export function Emblem({
  symbol,
  size = 48,
  framed,
  type = "figure",
  className,
}: {
  symbol: string;
  size?: number;
  framed?: boolean;
  type?: "event" | "figure" | "text";
  className?: string;
}) {
  if (!framed) {
    return (
      <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden>
        <EmblemGlyph symbol={symbol} />
      </svg>
    );
  }
  return (
    <svg viewBox="-34 -34 68 68" width={size} height={size} className={className} aria-hidden>
      {type === "figure" ? (
        <>
          <circle r={30} fill="var(--card)" stroke="var(--gold)" strokeWidth={2.5} />
          <circle r={25.5} fill="none" stroke="var(--gold)" strokeWidth={1} opacity={0.7} />
        </>
      ) : type === "text" ? (
        <>
          <path d={codexPathD(29)} fill="var(--card)" stroke="var(--gold)" strokeWidth={2.5} />
          <path d={codexPathD(24)} fill="none" stroke="var(--gold)" strokeWidth={0.9} opacity={0.7} />
        </>
      ) : (
        <>
          <path d={sealPathD(27)} fill="var(--card)" stroke="var(--gold)" strokeWidth={2} />
          <circle r={22} fill="none" stroke="var(--gold)" strokeWidth={0.8} opacity={0.7} />
        </>
      )}
      <g transform="translate(-17.5 -17.5) scale(0.73)">
        <EmblemGlyph symbol={symbol} />
      </g>
    </svg>
  );
}
