/**
 * Structured Bible text model (see the Library feature spec, §4). Both the
 * traditional and reader's layouts render from this ONE shape, so the data must
 * preserve document structure — paragraphs, poetry lines, headings — not just a
 * flat verse list. Generated from public-domain USFM (see scripts/ingest-bible.mjs).
 */

export interface VerseSpan {
  verse: number; // 0 = heading text (no verse number)
  text: string;
  wordsOfChrist?: boolean;
}

export interface Block {
  kind: "paragraph" | "poetry" | "heading";
  /** poetry indent level (1–4) or heading level (1–3 section, 4 = psalm title). */
  level?: number;
  spans: VerseSpan[];
}

export interface Chapter {
  number: number;
  blocks: Block[];
}

export interface BibleBook {
  translation: string;
  book: string; // USFM code (GEN, PSA, JHN…)
  chapters: Chapter[];
}

// ---- Canon (Protestant 66) -------------------------------------------------
// v1 covers the Protestant canon. The deuterocanon is deliberately left as a
// future division rather than implying 66 is the only canon — see the app's
// existing "the-new-testament-canon" entry and the canon-differences note.

export type Division =
  | "Pentateuch"
  | "History"
  | "Wisdom & Poetry"
  | "Major Prophets"
  | "Minor Prophets"
  | "Gospels"
  | "Acts"
  | "Epistles"
  | "Revelation";

export interface CanonBook {
  code: string; // USFM code, also the data filename
  name: string;
  division: Division;
  testament: "OT" | "NT";
  chapters: number;
  /** Linked timeline entry id, where one exists (two-way Library ↔ timeline). */
  entryId?: string;
}

export const DIVISIONS: Division[] = [
  "Pentateuch",
  "History",
  "Wisdom & Poetry",
  "Major Prophets",
  "Minor Prophets",
  "Gospels",
  "Acts",
  "Epistles",
  "Revelation",
];

// Order is canonical. `entryId` links to the existing `type: "text"` entries.
export const CANON: CanonBook[] = [
  { code: "GEN", name: "Genesis", division: "Pentateuch", testament: "OT", chapters: 50, entryId: "book-genesis" },
  { code: "EXO", name: "Exodus", division: "Pentateuch", testament: "OT", chapters: 40, entryId: "book-exodus" },
  { code: "LEV", name: "Leviticus", division: "Pentateuch", testament: "OT", chapters: 27, entryId: "book-leviticus" },
  { code: "NUM", name: "Numbers", division: "Pentateuch", testament: "OT", chapters: 36, entryId: "book-numbers" },
  { code: "DEU", name: "Deuteronomy", division: "Pentateuch", testament: "OT", chapters: 34, entryId: "book-deuteronomy" },
  { code: "JOS", name: "Joshua", division: "History", testament: "OT", chapters: 24 },
  { code: "JDG", name: "Judges", division: "History", testament: "OT", chapters: 21 },
  { code: "RUT", name: "Ruth", division: "History", testament: "OT", chapters: 4 },
  { code: "1SA", name: "1 Samuel", division: "History", testament: "OT", chapters: 31 },
  { code: "2SA", name: "2 Samuel", division: "History", testament: "OT", chapters: 24 },
  { code: "1KI", name: "1 Kings", division: "History", testament: "OT", chapters: 22 },
  { code: "2KI", name: "2 Kings", division: "History", testament: "OT", chapters: 25 },
  { code: "1CH", name: "1 Chronicles", division: "History", testament: "OT", chapters: 29 },
  { code: "2CH", name: "2 Chronicles", division: "History", testament: "OT", chapters: 36 },
  { code: "EZR", name: "Ezra", division: "History", testament: "OT", chapters: 10 },
  { code: "NEH", name: "Nehemiah", division: "History", testament: "OT", chapters: 13 },
  { code: "EST", name: "Esther", division: "History", testament: "OT", chapters: 10 },
  { code: "JOB", name: "Job", division: "Wisdom & Poetry", testament: "OT", chapters: 42, entryId: "book-job" },
  { code: "PSA", name: "Psalms", division: "Wisdom & Poetry", testament: "OT", chapters: 150, entryId: "book-psalms" },
  { code: "PRO", name: "Proverbs", division: "Wisdom & Poetry", testament: "OT", chapters: 31, entryId: "book-proverbs" },
  { code: "ECC", name: "Ecclesiastes", division: "Wisdom & Poetry", testament: "OT", chapters: 12, entryId: "book-ecclesiastes" },
  { code: "SNG", name: "Song of Songs", division: "Wisdom & Poetry", testament: "OT", chapters: 8, entryId: "book-song-of-songs" },
  { code: "ISA", name: "Isaiah", division: "Major Prophets", testament: "OT", chapters: 66, entryId: "book-isaiah" },
  { code: "JER", name: "Jeremiah", division: "Major Prophets", testament: "OT", chapters: 52, entryId: "book-jeremiah" },
  { code: "LAM", name: "Lamentations", division: "Major Prophets", testament: "OT", chapters: 5 },
  { code: "EZK", name: "Ezekiel", division: "Major Prophets", testament: "OT", chapters: 48, entryId: "book-ezekiel" },
  { code: "DAN", name: "Daniel", division: "Major Prophets", testament: "OT", chapters: 12, entryId: "book-daniel" },
  { code: "HOS", name: "Hosea", division: "Minor Prophets", testament: "OT", chapters: 14 },
  { code: "JOL", name: "Joel", division: "Minor Prophets", testament: "OT", chapters: 3 },
  { code: "AMO", name: "Amos", division: "Minor Prophets", testament: "OT", chapters: 9 },
  { code: "OBA", name: "Obadiah", division: "Minor Prophets", testament: "OT", chapters: 1 },
  { code: "JON", name: "Jonah", division: "Minor Prophets", testament: "OT", chapters: 4 },
  { code: "MIC", name: "Micah", division: "Minor Prophets", testament: "OT", chapters: 7 },
  { code: "NAM", name: "Nahum", division: "Minor Prophets", testament: "OT", chapters: 3 },
  { code: "HAB", name: "Habakkuk", division: "Minor Prophets", testament: "OT", chapters: 3 },
  { code: "ZEP", name: "Zephaniah", division: "Minor Prophets", testament: "OT", chapters: 3 },
  { code: "HAG", name: "Haggai", division: "Minor Prophets", testament: "OT", chapters: 2 },
  { code: "ZEC", name: "Zechariah", division: "Minor Prophets", testament: "OT", chapters: 14 },
  { code: "MAL", name: "Malachi", division: "Minor Prophets", testament: "OT", chapters: 4 },
  { code: "MAT", name: "Matthew", division: "Gospels", testament: "NT", chapters: 28, entryId: "book-matthew" },
  { code: "MRK", name: "Mark", division: "Gospels", testament: "NT", chapters: 16, entryId: "book-mark" },
  { code: "LUK", name: "Luke", division: "Gospels", testament: "NT", chapters: 24, entryId: "book-luke" },
  { code: "JHN", name: "John", division: "Gospels", testament: "NT", chapters: 21, entryId: "book-john" },
  { code: "ACT", name: "Acts", division: "Acts", testament: "NT", chapters: 28, entryId: "book-acts" },
  { code: "ROM", name: "Romans", division: "Epistles", testament: "NT", chapters: 16 },
  { code: "1CO", name: "1 Corinthians", division: "Epistles", testament: "NT", chapters: 16 },
  { code: "2CO", name: "2 Corinthians", division: "Epistles", testament: "NT", chapters: 13 },
  { code: "GAL", name: "Galatians", division: "Epistles", testament: "NT", chapters: 6 },
  { code: "EPH", name: "Ephesians", division: "Epistles", testament: "NT", chapters: 6 },
  { code: "PHP", name: "Philippians", division: "Epistles", testament: "NT", chapters: 4 },
  { code: "COL", name: "Colossians", division: "Epistles", testament: "NT", chapters: 4 },
  { code: "1TH", name: "1 Thessalonians", division: "Epistles", testament: "NT", chapters: 5 },
  { code: "2TH", name: "2 Thessalonians", division: "Epistles", testament: "NT", chapters: 3 },
  { code: "1TI", name: "1 Timothy", division: "Epistles", testament: "NT", chapters: 6 },
  { code: "2TI", name: "2 Timothy", division: "Epistles", testament: "NT", chapters: 4 },
  { code: "TIT", name: "Titus", division: "Epistles", testament: "NT", chapters: 3 },
  { code: "PHM", name: "Philemon", division: "Epistles", testament: "NT", chapters: 1 },
  { code: "HEB", name: "Hebrews", division: "Epistles", testament: "NT", chapters: 13 },
  { code: "JAS", name: "James", division: "Epistles", testament: "NT", chapters: 5 },
  { code: "1PE", name: "1 Peter", division: "Epistles", testament: "NT", chapters: 5 },
  { code: "2PE", name: "2 Peter", division: "Epistles", testament: "NT", chapters: 3 },
  { code: "1JN", name: "1 John", division: "Epistles", testament: "NT", chapters: 5 },
  { code: "2JN", name: "2 John", division: "Epistles", testament: "NT", chapters: 1 },
  { code: "3JN", name: "3 John", division: "Epistles", testament: "NT", chapters: 1 },
  { code: "JUD", name: "Jude", division: "Epistles", testament: "NT", chapters: 1 },
  { code: "REV", name: "Revelation", division: "Revelation", testament: "NT", chapters: 22, entryId: "book-revelation" },
];

const BY_CODE = new Map(CANON.map((b) => [b.code, b]));
export function getBook(code: string): CanonBook | undefined {
  return BY_CODE.get(code.toUpperCase());
}

/** The previous/next chapter across the whole canon (for reader navigation). */
export function adjacentChapter(
  code: string,
  chapter: number,
  dir: 1 | -1
): { code: string; chapter: number } | null {
  const idx = CANON.findIndex((b) => b.code === code.toUpperCase());
  if (idx < 0) return null;
  const book = CANON[idx];
  const next = chapter + dir;
  if (next >= 1 && next <= book.chapters) return { code: book.code, chapter: next };
  const nb = CANON[idx + dir];
  if (!nb) return null;
  return { code: nb.code, chapter: dir === 1 ? 1 : nb.chapters };
}
