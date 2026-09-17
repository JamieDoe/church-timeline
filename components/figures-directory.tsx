"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CertaintyBadge, LayerChip } from "@/components/badges";
import { Emblem } from "@/components/emblems";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Entry, Layer } from "@/lib/types";

type SortKey = "date" | "name";

const LAYERS: Layer[] = ["scripture", "people", "church"];

export function FiguresDirectory({ figures }: { figures: Entry[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [layerFilter, setLayerFilter] = useState<Layer | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(figures.flatMap((f) => f.categories))].sort(),
    [figures]
  );

  const shown = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let list = figures.filter((f) => {
      if (ql && !f.title.toLowerCase().includes(ql) && !f.summary.toLowerCase().includes(ql))
        return false;
      if (layerFilter && !f.layers.includes(layerFilter)) return false;
      if (category && !f.categories.includes(category)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      // Date sort: beginnings-zone figures first (their file order is the
      // symbolic order), then by signed year.
      if (a.undated && b.undated) return 0;
      if (a.undated) return -1;
      if (b.undated) return 1;
      return a.yearStart! - b.yearStart!;
    });
    return list;
  }, [figures, q, sort, layerFilter, category]);

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search figures…"
          className="w-52"
        />
        <ToggleGroup
          variant="outline"
          size="sm"
          value={layerFilter ? [layerFilter] : []}
          onValueChange={(v) => setLayerFilter(((v as string[])[0] as Layer) ?? null)}
        >
          {LAYERS.map((l) => (
            <ToggleGroupItem
              key={l}
              value={l}
              className="gap-1.5 capitalize data-[state=on]:bg-accent data-[state=on]:text-foreground"
            >
              <span className="size-2 rounded-full" style={{ background: `var(--layer-${l})` }} />
              {l}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Select value={category ?? "all"} onValueChange={(v) => setCategory(v === "all" ? null : v)}>
          <SelectTrigger size="sm" className="w-44 text-muted-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">all categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          sort by
          <ToggleGroup
            variant="outline"
            size="sm"
            spacing={0}
            value={[sort]}
            onValueChange={(v) => {
              const s = (v as string[])[0];
              if (s) setSort(s as SortKey);
            }}
          >
            <ToggleGroupItem value="date" className="capitalize data-[state=on]:bg-accent data-[state=on]:text-foreground">
              date
            </ToggleGroupItem>
            <ToggleGroupItem value="name" className="capitalize data-[state=on]:bg-accent data-[state=on]:text-foreground">
              name
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((f) => (
          <li key={f.id}>
            <Link
              href={`/entry/${f.id}`}
              className="flex h-full gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-gold/60 hover:bg-gold/5"
            >
              <Emblem symbol={f.symbol} framed type="figure" size={64} className="shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-lg leading-tight">{f.title}</p>
                <p className="text-xs italic text-muted-foreground">
                  {f.undated ? "before datable history" : f.dateDisplay}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {f.summary}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <CertaintyBadge certainty={f.certainty} className="h-auto px-1.5 py-0 text-[10px]" />
                  {f.layers.map((l) => (
                    <LayerChip key={l} layer={l} className="text-[10px]" />
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <p className="mt-8 text-sm italic text-muted-foreground">
          No figures match — try clearing a filter.
        </p>
      )}
    </div>
  );
}
