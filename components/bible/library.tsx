"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CANON, DIVISIONS } from "@/lib/bible/types";
import {
  bookFraction,
  getProgressStore,
  TOTAL_CHAPTERS,
  type OverallProgress,
} from "@/lib/bible/progress";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/** Where to resume: the next unread chapter (read through 5 → open 6); a
 *  finished book opens again at 1; an untouched book at 1. */
function resumeChapter(read: number[], total: number): number {
  const max = read.filter((c) => c >= 1 && c <= total).reduce((a, b) => Math.max(a, b), 0);
  if (max === 0 || max >= total) return 1;
  return max + 1;
}

export function LibraryShelf() {
  const [progress, setProgress] = useState<Record<string, number[]>>({});
  const [overall, setOverall] = useState<OverallProgress | null>(null);

  useEffect(() => {
    const store = getProgressStore();
    store.getAll().then(setProgress);
    store.overall().then(setOverall);
  }, []);

  const pct = overall?.percent ?? 0;

  return (
    <>
      {/* Overall — quiet, no gamification */}
      <div className="mt-6 rounded-lg border border-border bg-card/50 px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-display text-sm">
            <span className="text-gold">{pct}%</span> of the Bible read
          </p>
          <p className="text-xs text-muted-foreground">
            {overall?.booksCompleted ?? 0} of 66 books · {overall?.chaptersRead ?? 0}/
            {TOTAL_CHAPTERS} chapters
          </p>
        </div>
        <Progress
          value={pct}
          className="mt-2 [&_[data-slot=progress-indicator]]:bg-gold [&_[data-slot=progress-track]]:bg-border"
        />
      </div>

      <div className="mt-8 space-y-8">
        {DIVISIONS.map((division) => (
          <section key={division}>
            <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              {division}
            </h2>
            <div className="gold-rule mt-1.5" />
            <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2.5">
              {CANON.filter((b) => b.division === division).map((b) => {
                const read = progress[b.code] ?? [];
                const readSet = new Set(read);
                const frac = bookFraction(b.code, read);
                const done = frac >= 1;
                const readCount = Math.round(frac * b.chapters);
                const resume = resumeChapter(read, b.chapters);
                return (
                  <Card
                    key={b.code}
                    className={cn("relative h-[4.75rem] gap-0 p-0", done && "ring-2 ring-gold")}
                  >
                    {/* gilding: the volume fills with gold as it is read */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 bg-gold/25"
                      style={{ height: `${Math.round(frac * 100)}%` }}
                    />
                    {/* the tile is a link — it resumes where you left off */}
                    <Link
                      href={`/read/${b.code}/${resume}`}
                      className="relative flex h-full flex-col justify-between px-2.5 py-2"
                    >
                      <span className="pr-5 font-display text-sm leading-tight">{b.name}</span>
                      <span className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          {readCount}/{b.chapters}
                        </span>
                        {done && <span className="text-gold">✦</span>}
                      </span>
                    </Link>
                    {/* jump to any chapter */}
                    <Popover>
                      <PopoverTrigger
                        aria-label={`Choose a chapter of ${b.name}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon-xs" }),
                          "absolute right-1 top-1 z-10 text-muted-foreground"
                        )}
                      >
                        <ChevronDown />
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        side="bottom"
                        className="w-[19rem] max-w-[84vw] p-3"
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-display text-sm">{b.name}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {b.chapters} {b.chapters === 1 ? "chapter" : "chapters"}
                          </span>
                        </div>
                        <div className="grid max-h-[65vh] grid-cols-[repeat(auto-fill,2.5rem)] justify-center gap-1.5 overflow-y-auto">
                          {Array.from({ length: b.chapters }, (_, i) => i + 1).map((n) => {
                            const chRead = readSet.has(n);
                            return (
                              <Link
                                key={n}
                                href={`/read/${b.code}/${n}`}
                                className={cn(
                                  buttonVariants({ variant: "outline" }),
                                  "relative size-10 rounded-md p-0 text-sm",
                                  chRead &&
                                    "border-gold bg-gold/20 text-foreground hover:bg-gold/30",
                                  !chRead && n === resume && "border-gold font-medium text-gold"
                                )}
                              >
                                {n}
                                {chRead && (
                                  <Check
                                    className="absolute right-0.5 top-0.5 size-2.5 text-gold"
                                    strokeWidth={3}
                                    aria-hidden
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                        {b.entryId && (
                          <Link
                            href={`/entry/${b.entryId}`}
                            className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
                          >
                            On the timeline →
                          </Link>
                        )}
                      </PopoverContent>
                    </Popover>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
