/**
 * Core content model for The Illuminated Timeline.
 *
 * DATE CONVENTION (project-wide):
 * Years are signed integers read directly: -1446 means 1446 BC, 325 means
 * AD 325. There is no year 0 in historical reckoning (1 BC is followed by
 * AD 1), and we deliberately do NOT shift to astronomical numbering; the
 * canvas treats the axis as continuous, accepting a ≤1-year positioning
 * error at the BC/AD boundary. Every date shown to the reader comes from
 * `dateDisplay`, which carries the honest form ("c. 1446 BC or c. 1250 BC
 * (disputed)"); the signed year is for sorting and canvas placement only.
 *
 * UNDATED ENTRIES: `undated: true` marks the beginnings zone (Creation,
 * Adam, Noah, Babel). These are never placed on the year axis and carry no
 * yearStart/yearEnd at all. Their symbolic order is the order in which they
 * appear in the data file.
 */

export type Certainty = "attested" | "traditional" | "contested";
export type Register = "scripture" | "tradition" | "history";
export type Layer = "scripture" | "people" | "church";

export type RelationType =
  | "line-of-promise"
  | "prophet-to-king"
  | "teacher-to-disciple"
  | "anointed"
  | "succeeded"
  | "influenced"
  | "opposed"
  | "split-from"
  | "covenant"
  | "contemporary"
  | "describes";

export interface Relationship {
  targetId: string;
  type: RelationType;
}

/** Detail page only; PUBLIC DOMAIN only; never used as a canvas node. */
export interface EntryImage {
  src: string;
  credit: string;
  license: string;
  /** e.g. "later depiction — not a contemporary likeness" */
  note?: string;
}

export interface Entry {
  id: string;
  /**
   * "figure" (a person — medallion), "event" (something that happened — seal),
   * or "text" (a book/creed/canonical writing — codex). The type only chooses
   * the node's shape and the directory it appears in; a text still carries a
   * date, certainty, registers, and sources like any other entry.
   */
  type: "event" | "figure" | "text";
  /** Which toggleable canvas layer(s) this entry belongs to. */
  layers: Layer[];
  title: string;
  /** Beginnings zone: never placed on the year axis. */
  undated?: boolean;
  /** Signed, sortable (BC negative). Omit when undated. */
  yearStart?: number;
  yearEnd?: number;
  /** "c. 1446 BC", "AD 325", "1483–1546"; omitted when undated. */
  dateDisplay?: string;
  certainty: Certainty;
  registers: Register[];
  /** Id of the emblem rendered as this entry's node (see components/emblems). */
  symbol: string;
  categories: string[];
  /** One line. */
  summary: string;
  /** Markdown, longer. */
  article: string;
  scriptureRefs?: string[];
  /** e.g. "His story is told in Genesis 37–50." */
  readingPointer?: string;
  sources?: string[];
  relationships?: Relationship[];
  image?: EntryImage;
  location?: { name: string; lat: number; lng: number };
  /** Cross-tradition views, each side fair, none endorsed. */
  traditions?: { catholic?: string; orthodox?: string; protestant?: string };
}

/**
 * A mapped route (Abraham's migration, the Exodus, Paul's journeys). Points are
 * ordered; a point reuses an existing map place by name where one exists, and
 * otherwise carries its own coordinates (many waypoints — Ur, Haran, Lystra —
 * have no entry of their own). Routes are NEVER drawn as established fact: the
 * `certainty` and `note` carry the same "traditional site" honesty the map
 * already uses. The Exodus route in particular is genuinely contested.
 */
export interface JourneyPoint {
  placeName: string;
  /** Optional explicit coordinates for waypoints not among the entry places. */
  lat?: number;
  lng?: number;
  note?: string;
}

export interface Journey {
  id: string;
  title: string;
  entryId?: string;
  points: JourneyPoint[];
  certainty: Certainty;
  /** The honesty note — e.g. "traditional route; the site of Mt Sinai is disputed". */
  note: string;
}
