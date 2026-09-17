import { CANON, getBook } from "./types";

/**
 * Reading progress — local-first, stored in IndexedDB behind this interface so
 * a synced backend could replace it later (spec §2). A chapter is read by an
 * explicit mark; that is the source of truth. No accounts, no login.
 */

export interface OverallProgress {
  chaptersRead: number;
  totalChapters: number;
  booksCompleted: number;
  percent: number; // 0–100
}

export interface ProgressStore {
  getProgress(code: string): Promise<number[]>;
  getAll(): Promise<Record<string, number[]>>;
  markChapterRead(code: string, chapter: number): Promise<void>;
  unmark(code: string, chapter: number): Promise<void>;
  overall(): Promise<OverallProgress>;
}

export const TOTAL_CHAPTERS = CANON.reduce((n, b) => n + b.chapters, 0); // 1189

const DB_NAME = "illuminated-bible";
const STORE = "progress";

class IndexedDbProgressStore implements ProgressStore {
  private dbp: Promise<IDBDatabase> | null = null;

  private db(): Promise<IDBDatabase> {
    if (!this.dbp) {
      this.dbp = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) {
            db.createObjectStore(STORE, { keyPath: "code" });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return this.dbp;
  }

  async getProgress(code: string): Promise<number[]> {
    const db = await this.db();
    return new Promise((resolve) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).get(code.toUpperCase());
      req.onsuccess = () => resolve((req.result?.chapters as number[]) ?? []);
      req.onerror = () => resolve([]);
    });
  }

  async getAll(): Promise<Record<string, number[]>> {
    const db = await this.db();
    return new Promise((resolve) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
      req.onsuccess = () => {
        const out: Record<string, number[]> = {};
        for (const rec of req.result as { code: string; chapters: number[] }[]) {
          out[rec.code] = rec.chapters ?? [];
        }
        resolve(out);
      };
      req.onerror = () => resolve({});
    });
  }

  private async write(code: string, mutate: (set: Set<number>) => void): Promise<void> {
    const key = code.toUpperCase();
    const db = await this.db();
    const current = await this.getProgress(key);
    const set = new Set(current);
    mutate(set);
    const chapters = [...set].sort((a, b) => a - b);
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ code: key, chapters });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  markChapterRead(code: string, chapter: number): Promise<void> {
    return this.write(code, (s) => s.add(chapter));
  }
  unmark(code: string, chapter: number): Promise<void> {
    return this.write(code, (s) => s.delete(chapter));
  }

  async overall(): Promise<OverallProgress> {
    const all = await this.getAll();
    let chaptersRead = 0;
    let booksCompleted = 0;
    for (const b of CANON) {
      const read = (all[b.code] ?? []).filter((c) => c >= 1 && c <= b.chapters);
      const uniq = new Set(read).size;
      chaptersRead += uniq;
      if (uniq >= b.chapters) booksCompleted += 1;
    }
    return {
      chaptersRead,
      totalChapters: TOTAL_CHAPTERS,
      booksCompleted,
      percent: Math.round((chaptersRead / TOTAL_CHAPTERS) * 1000) / 10,
    };
  }
}

/** No-op fallback if IndexedDB is unavailable (SSR / private mode). */
class NullProgressStore implements ProgressStore {
  async getProgress() { return []; }
  async getAll() { return {}; }
  async markChapterRead() {}
  async unmark() {}
  async overall() {
    return { chaptersRead: 0, totalChapters: TOTAL_CHAPTERS, booksCompleted: 0, percent: 0 };
  }
}

let store: ProgressStore | null = null;
export function getProgressStore(): ProgressStore {
  if (store) return store;
  const ok = typeof window !== "undefined" && typeof indexedDB !== "undefined";
  store = ok ? new IndexedDbProgressStore() : new NullProgressStore();
  return store;
}

/** Fraction (0–1) of a book that has been read, given its read-chapter list. */
export function bookFraction(code: string, chapters: number[]): number {
  const book = getBook(code);
  if (!book) return 0;
  const uniq = new Set(chapters.filter((c) => c >= 1 && c <= book.chapters)).size;
  return uniq / book.chapters;
}
