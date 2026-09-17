"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getSource, TRANSLATIONS, DEFAULT_TRANSLATION } from "@/lib/bible/source";
import { adjacentChapter, getBook, type Chapter, type VerseSpan } from "@/lib/bible/types";
import { getProgressStore } from "@/lib/bible/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type Layout = "traditional" | "readers";

export function Reader({ code, chapter }: { code: string; chapter: number }) {
  const router = useRouter();
  const book = getBook(code);

  const [translation, setTranslation] = useState(DEFAULT_TRANSLATION);
  const [layout, setLayout] = useState<Layout>("traditional");
  const [data, setData] = useState<Chapter | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [read, setRead] = useState(false);

  // Restore saved preferences (translation + layout persist across sessions).
  useEffect(() => {
    try {
      const t = localStorage.getItem("bible-translation");
      if (t && TRANSLATIONS.some((x) => x.id === t)) setTranslation(t);
      const l = localStorage.getItem("bible-layout");
      if (l === "traditional" || l === "readers") setLayout(l);
    } catch {}
  }, []);

  // Load the chapter (switching translation refetches the same place).
  useEffect(() => {
    let alive = true;
    setStatus("loading");
    getSource(translation)
      .getChapter(code, chapter)
      .then((ch) => alive && (setData(ch), setStatus("ready")))
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [translation, code, chapter]);

  // Is this chapter already marked read?
  useEffect(() => {
    let alive = true;
    getProgressStore()
      .getProgress(code)
      .then((chs) => alive && setRead(chs.includes(chapter)));
    return () => {
      alive = false;
    };
  }, [code, chapter]);

  const toggleRead = useCallback(async () => {
    const store = getProgressStore();
    if (read) await store.unmark(code, chapter);
    else await store.markChapterRead(code, chapter);
    setRead(!read);
  }, [read, code, chapter]);

  const pickTranslation = useCallback((id: string) => {
    setTranslation(id);
    try {
      localStorage.setItem("bible-translation", id);
    } catch {}
  }, []);
  const pickLayout = useCallback((l: Layout) => {
    setLayout(l);
    try {
      localStorage.setItem("bible-layout", l);
    } catch {}
  }, []);

  const go = useCallback(
    (target: { code: string; chapter: number } | null) => {
      if (target) router.push(`/read/${target.code}/${target.chapter}`);
    },
    [router]
  );

  if (!book) return null;
  const prev = adjacentChapter(code, chapter, -1);
  const next = adjacentChapter(code, chapter, 1);
  const source = getSource(translation);

  return (
    <main className="flex flex-1 flex-col">
      {/* Controls */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
          <Link href="/read" className="text-sm text-muted-foreground hover:text-foreground">
            ← The Library
          </Link>
          <h1 className="font-display text-lg leading-none">
            {book.name} <span className="text-gold">{chapter}</span>
          </h1>

          <div className="ml-auto flex items-center gap-2">
            {/* Layout toggle */}
            <ToggleGroup
              variant="outline"
              size="sm"
              spacing={0}
              value={[layout]}
              onValueChange={(v) => {
                const next = (v as string[])[0];
                if (next) pickLayout(next as Layout);
              }}
            >
              <ToggleGroupItem
                value="traditional"
                className="data-[state=on]:bg-gold/15 data-[state=on]:text-foreground"
              >
                Traditional
              </ToggleGroupItem>
              <ToggleGroupItem
                value="readers"
                className="data-[state=on]:bg-gold/15 data-[state=on]:text-foreground"
              >
                Reader’s
              </ToggleGroupItem>
            </ToggleGroup>
            {/* Translation selector */}
            <Select value={translation} onValueChange={(v) => v && pickTranslation(v)}>
              <SelectTrigger size="sm" aria-label="Translation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATIONS.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.id.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reading surface */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <header className="mb-6 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{source.name}</p>
          <h2 className="mt-1 font-display text-3xl">
            {book.name} {chapter}
          </h2>
          <div className="gold-rule mx-auto mt-3 w-24" />
        </header>

        {status === "loading" && (
          <p className="py-16 text-center text-sm italic text-muted-foreground">Opening the page…</p>
        )}
        {status === "error" && (
          <p className="py-16 text-center text-sm italic text-crimson">
            This chapter could not be loaded.
          </p>
        )}
        {status === "ready" && data && (
          <article className={cn("bible-prose mx-auto", layout === "readers" && "readers")}>
            {renderChapter(data, layout)}
          </article>
        )}

        {/* Chapter navigation */}
        {/* Prev/next flank the chapter picker; on narrow screens the picker
            drops to its own centered row so the buttons never overflow. */}
        <nav className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" className="order-1" onClick={() => go(prev)} disabled={!prev}>
            ← {prev ? `${getBook(prev.code)!.name} ${prev.chapter}` : "Start"}
          </Button>
          <label className="order-3 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground sm:order-2 sm:w-auto">
            Chapter
            <Select
              value={String(chapter)}
              onValueChange={(v) => v && go({ code, chapter: Number(v) })}
            >
              <SelectTrigger size="sm" aria-label="Jump to chapter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <Button variant="outline" className="order-2 sm:order-3" onClick={() => go(next)} disabled={!next}>
            {next ? `${getBook(next.code)!.name} ${next.chapter}` : "End"} →
          </Button>
        </nav>

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={toggleRead}
            className={cn(read && "border-gold bg-gold/15 text-foreground hover:bg-gold/25")}
          >
            {read ? `✓ Read — ${book.name} ${chapter}` : "Mark chapter read"}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">{source.license}</p>
      </div>
    </main>
  );
}

// ---- render the same structured chapter in either layout --------------------
function renderChapter(chapter: Chapter, layout: Layout) {
  const showNums = layout === "traditional";
  let prevVerse = 0;

  const spans = (list: VerseSpan[]) =>
    list.map((s, i) => {
      const num = showNums && s.verse > 0 && s.verse !== prevVerse ? s.verse : null;
      if (s.verse > 0) prevVerse = s.verse;
      return (
        <span key={i} className={s.wordsOfChrist ? "text-crimson" : undefined}>
          {num != null && <sup className="verse-num">{num}</sup>}
          {s.text}{" "}
        </span>
      );
    });

  return chapter.blocks.map((b, bi) => {
    if (b.kind === "heading") {
      const text = b.spans.map((s) => s.text).join(" ");
      return b.level === 4 ? (
        <p key={bi} className="psalm-title">
          {text}
        </p>
      ) : (
        <h3 key={bi} className="section-heading">
          {text}
        </h3>
      );
    }
    if (b.kind === "poetry") {
      return (
        <div
          key={bi}
          className="poetry-line"
          style={{ paddingLeft: `${((b.level ?? 1) - 1) * 1.3}rem` }}
        >
          {spans(b.spans)}
        </div>
      );
    }
    return (
      <p key={bi} className="reader-para">
        {spans(b.spans)}
      </p>
    );
  });
}
