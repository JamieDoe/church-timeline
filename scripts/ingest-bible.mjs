// USFM → structured Bible JSON (the §4 shape: chapters → blocks → verse spans).
//
// Source: public-domain USFM from eBible.org
//   WEB (World English Bible, Protestant 66-book): https://ebible.org/Scriptures/engwebp_usfm.zip
//   KJV (King James Version, 1769):                https://ebible.org/Scriptures/eng-kjv_usfm.zip
//
// Preserves paragraph breaks, poetry indentation, section/psalm headings, and
// words-of-Christ (WEB). Footnotes, cross-references, and Strong's word tags are
// stripped. Output: <outDir>/<CODE>.json, one file per book, lazy-loaded at runtime.
//
// Usage: node scripts/ingest-bible.mjs <usfmDir> <translationId> <outDir>

import fs from "node:fs";
import path from "node:path";

const [usfmDir, translation, outDir] = process.argv.slice(2);
if (!usfmDir || !translation || !outDir) {
  console.error("usage: node scripts/ingest-bible.mjs <usfmDir> <translationId> <outDir>");
  process.exit(1);
}

// Protestant 66-book canon: USFM code → expected chapter count (for validation).
const CANON = {
  GEN: 50, EXO: 40, LEV: 27, NUM: 36, DEU: 34, JOS: 24, JDG: 21, RUT: 4,
  "1SA": 31, "2SA": 24, "1KI": 22, "2KI": 25, "1CH": 29, "2CH": 36, EZR: 10,
  NEH: 13, EST: 10, JOB: 42, PSA: 150, PRO: 31, ECC: 12, SNG: 8, ISA: 66,
  JER: 52, LAM: 5, EZK: 48, DAN: 12, HOS: 14, JOL: 3, AMO: 9, OBA: 1, JON: 4,
  MIC: 7, NAM: 3, HAB: 3, ZEP: 3, HAG: 2, ZEC: 14, MAL: 4, MAT: 28, MRK: 16,
  LUK: 24, JHN: 21, ACT: 28, ROM: 16, "1CO": 16, "2CO": 13, GAL: 6, EPH: 6,
  PHP: 4, COL: 4, "1TH": 5, "2TH": 3, "1TI": 6, "2TI": 4, TIT: 3, PHM: 1,
  HEB: 13, JAS: 5, "1PE": 5, "2PE": 3, "1JN": 5, "2JN": 1, "3JN": 1, JUD: 1,
  REV: 22,
};

const PARA = new Set(["p", "m", "nb", "pi", "pi1", "pi2", "pc", "pr", "pmo", "pm", "po", "cls", "lit", "pmr", "pmc", "ph", "ph1", "ph2"]);
const POET = new Set(["q", "q1", "q2", "q3", "q4", "qr", "qc", "qm", "qm1", "qm2", "qm3", "qd"]);
const HEAD = new Set(["s", "s1", "s2", "s3", "s4", "ms", "ms1", "ms2", "mr", "sr", "sp", "sd", "d", "r", "qa"]);
// Line markers whose content is metadata, not scripture — skip the whole line.
const SKIP_LINE = new Set(["id", "ide", "h", "toc1", "toc2", "toc3", "mt", "mt1", "mt2", "mt3", "mt4", "rem", "sts", "usfm", "cl", "cp", "ie", "iex", "ib", "imt", "imt1", "imt2", "is", "ip", "ipi", "im", "io", "io1", "io2", "ior", "rq"]);

function cleanRaw(s) {
  return s
    .replace(/\|[a-z0-9-]+="[^"]*"/gi, "") // strip \w attributes (|strong="H1")
    .replace(/\\f\b[\s\S]*?\\f\*/g, "") // footnotes
    .replace(/\\x\b[\s\S]*?\\x\*/g, "") // cross references
    .replace(/\\fig\b[\s\S]*?\\fig\*/g, "") // figures
    .replace(/¶/g, ""); // ¶ pilcrow (KJV)
}

function tidy(t) {
  return t
    .replace(/\\\+?[a-z]+[0-9]?\*?/g, "") // any stray leftover markers
    .replace(/\s+/g, " ")
    .replace(/ ([,.;:!?’”)\]])/g, "$1") // no space before closing punctuation
    .replace(/([“‘([]) /g, "$1") // no space after opening punctuation
    .trim();
}

function parseBook(raw, code) {
  raw = cleanRaw(raw);
  const chapters = [];
  let chap = null;
  let block = null;
  let verse = 0;
  let wj = false;
  let spanText = "";
  let spanVerse = 0;
  let spanWj = false;

  function flush() {
    const t = tidy(spanText);
    spanText = "";
    if (!block || !t) return;
    if (block.kind === "heading") {
      block.spans.push({ verse: 0, text: t });
    } else {
      const sp = { verse: spanVerse, text: t };
      if (spanWj) sp.wordsOfChrist = true;
      block.spans.push(sp);
    }
  }
  function newBlock(kind, level) {
    flush();
    block = { kind, ...(level != null ? { level } : {}), spans: [] };
    if (chap) chap.blocks.push(block);
    spanVerse = verse;
    spanWj = wj;
  }

  const re = /\\(\+?[a-z]+[0-9]?)(\*)?/g;
  let last = 0;
  let m;
  while ((m = re.exec(raw))) {
    const content = raw.slice(last, m.index);
    if (content) spanText += content;
    last = re.lastIndex;
    const base = m[1].replace(/^\+/, "");
    const star = m[2];
    // A single space after an opening marker is the marker's delimiter, not
    // text (USFM). Consuming it prevents spurious spaces like “ Rabbi / can’ t.
    if (!star && raw[last] === " ") {
      last += 1;
      re.lastIndex = last;
    }

    if (base === "c") {
      flush();
      const nm = raw.slice(last).match(/^\s*(\d+)/);
      chap = { number: nm ? +nm[1] : 0, blocks: [] };
      chapters.push(chap);
      block = null;
      verse = 0;
      wj = false;
      spanVerse = 0;
      spanWj = false;
      if (nm) { last += nm[0].length; re.lastIndex = last; }
    } else if (base === "v") {
      flush();
      const nm = raw.slice(last).match(/^\s*(\d+)[a-z]?(?:[-,]\d+[a-z]?)?\s*/);
      verse = nm ? +nm[1] : verse;
      spanVerse = verse;
      spanWj = wj;
      if (!block) newBlock("paragraph");
      if (nm) { last += nm[0].length; re.lastIndex = last; }
    } else if (base === "wj") {
      flush();
      wj = !star;
      spanWj = wj;
    } else if (PARA.has(base)) {
      newBlock("paragraph");
    } else if (POET.has(base)) {
      newBlock("poetry", +(base.match(/(\d)/)?.[1] || 1));
    } else if (HEAD.has(base)) {
      let level = 1;
      if (base === "d") level = 4;
      else if (base === "r" || base === "sr" || base === "mr") level = 3;
      else level = +(base.match(/(\d)/)?.[1] || 1);
      newBlock("heading", level);
    } else if (base === "b") {
      // stanza / blank line — block boundaries already come from \q and \p
    } else if (SKIP_LINE.has(base)) {
      spanText = ""; // discard any content accrued from this metadata line
      const nl = raw.indexOf("\n", last);
      if (nl >= 0) { last = nl + 1; re.lastIndex = last; }
    }
    // char markers (\w \+w \nd \add \tl \qs \wh \bk … and their \…* closings)
    // are transparent: their text content simply accrues into the current span.
  }
  const tailC = raw.slice(last);
  if (tailC) spanText += tailC;
  flush();

  for (const c of chapters) c.blocks = c.blocks.filter((b) => b.spans.length > 0);
  return { translation, book: code, chapters };
}

// ---- run over every USFM file, keep only the 66 canon books ----
fs.mkdirSync(outDir, { recursive: true });
const files = fs.readdirSync(usfmDir).filter((f) => f.endsWith(".usfm"));
const found = {};
for (const f of files) {
  const raw = fs.readFileSync(path.join(usfmDir, f), "utf8");
  const idm = raw.match(/\\id\s+([0-9A-Z]{3})/);
  if (!idm) continue;
  const code = idm[1];
  if (!(code in CANON)) continue; // skip front matter, glossary, apocrypha
  const book = parseBook(raw, code);
  found[code] = book.chapters.length;
  fs.writeFileSync(path.join(outDir, `${code}.json`), JSON.stringify(book));
}

// ---- validate completeness ----
let ok = true;
const missing = [];
for (const [code, chapters] of Object.entries(CANON)) {
  if (!(code in found)) { missing.push(code); ok = false; }
  else if (found[code] !== chapters) {
    console.error(`  ! ${code}: got ${found[code]} chapters, expected ${chapters}`);
    ok = false;
  }
}
console.log(`[${translation}] wrote ${Object.keys(found).length}/66 books to ${outDir}`);
if (missing.length) console.error(`  ! missing: ${missing.join(", ")}`);
console.log(ok ? "  ✓ all 66 books present with correct chapter counts" : "  ✗ validation FAILED");
process.exit(ok ? 0 : 1);
