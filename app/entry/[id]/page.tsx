import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CertaintyBadge, LayerChip, RegisterBadge } from "@/components/badges";
import { Emblem } from "@/components/emblems";
import { getEntries, getEntry, getIncoming } from "@/lib/entries";
import { EDGE_STYLES } from "@/lib/canvas-model";
import { scriptureUrl } from "@/lib/scripture";
import { entryBookCode, parseReadingRef } from "@/lib/bible/reference";
import { getBook } from "@/lib/bible/types";
import type { RelationType } from "@/lib/types";

export function generateStaticParams() {
  return getEntries().map((e) => ({ id: e.id }));
}

export async function generateMetadata(props: PageProps<"/entry/[id]">) {
  const { id } = await props.params;
  const entry = getEntry(id);
  return {
    title: entry
      ? `${entry.title} · The Illuminated Timeline`
      : "Not found · The Illuminated Timeline",
  };
}

function relationLabel(type: RelationType): string {
  return EDGE_STYLES[type]?.label ?? type;
}

export default async function EntryPage(props: PageProps<"/entry/[id]">) {
  const { id } = await props.params;
  const entry = getEntry(id);
  if (!entry) notFound();

  const outgoing = (entry.relationships ?? [])
    .map((r) => ({ target: getEntry(r.targetId), type: r.type }))
    .filter((r) => r.target);
  const incoming = getIncoming(entry.id);

  // In-app reader deep link: a book entry opens at chapter 1; any entry with a
  // readingPointer opens at the passage it names.
  const bookCode = entryBookCode(entry.id);
  const ref = parseReadingRef(entry.readingPointer);
  const readTarget = bookCode
    ? { code: bookCode, chapter: 1, label: getBook(bookCode)!.name }
    : ref;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to the canvas
      </Link>

      <header className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Emblem
          symbol={entry.symbol}
          framed
          type={entry.type}
          size={112}
          className="shrink-0"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {entry.type === "figure" ? "Figure" : entry.type === "text" ? "Text" : "Event"}
          </p>
          <h1 className="font-display text-4xl leading-tight">{entry.title}</h1>
          <p className="mt-1 font-display text-lg italic text-muted-foreground">
            {entry.undated ? "before datable history" : entry.dateDisplay}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <CertaintyBadge certainty={entry.certainty} />
            {entry.registers.map((r) => (
              <RegisterBadge key={r} register={r} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {entry.layers.map((l) => (
              <LayerChip key={l} layer={l} />
            ))}
            <span className="text-xs text-muted-foreground">
              {entry.categories.join(" · ")}
            </span>
          </div>
        </div>
      </header>

      <p className="mt-5 border-l-2 border-gold pl-4 font-display text-xl italic leading-snug text-foreground/90">
        {entry.summary}
      </p>

      <div className="my-6 gold-rule" />

      <div className="article-prose drop-cap">
        <ReactMarkdown>{entry.article}</ReactMarkdown>
      </div>

      {(entry.readingPointer || readTarget) && (
        <aside className="mt-6 rounded-lg border border-gold/40 bg-gold/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Read it yourself</p>
          {entry.readingPointer && (
            <p className="mt-1 font-display text-lg">{entry.readingPointer}</p>
          )}
          {readTarget && (
            <Link
              href={`/read/${readTarget.code}/${readTarget.chapter}`}
              className="mt-3 inline-block rounded-full border border-gold bg-gold/15 px-4 py-1.5 text-sm hover:bg-gold/25"
            >
              {bookCode ? `Read ${readTarget.label}` : `Open the reader: ${readTarget.label}`} →
            </Link>
          )}
        </aside>
      )}

      {entry.scriptureRefs && entry.scriptureRefs.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-xl">Scripture</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Links open the passage on Bible Gateway (ESV) — the text stays with the Bible, not this app.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {entry.scriptureRefs.map((ref) => (
              <a
                key={ref}
                href={scriptureUrl(ref)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-3 py-1 text-sm hover:border-gold hover:bg-gold/10"
              >
                {ref} ↗
              </a>
            ))}
          </div>
        </section>
      )}

      {entry.traditions && (
        <section className="mt-8">
          <h2 className="font-display text-xl">How the traditions see it</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Presented side by side; none endorsed here.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(
              [
                ["catholic", "Catholic"],
                ["orthodox", "Orthodox"],
                ["protestant", "Protestant"],
              ] as const
            ).map(([key, label]) =>
              entry.traditions?.[key] ? (
                <div key={key} className="rounded-lg border border-border bg-card p-3">
                  <p className="font-display text-base">{label}</p>
                  <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
                    {entry.traditions[key]}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {entry.image && (
        <figure className="mt-8">
          {/* Detail pages only; public-domain only; never a canvas node. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.image.src}
            alt={`${entry.title} — ${entry.image.note ?? "public-domain depiction"}`}
            loading="lazy"
            className="max-h-[28rem] rounded-md border border-border"
          />
          <figcaption className="mt-2 text-xs text-muted-foreground">
            {entry.image.note && (
              <span className="mb-0.5 block font-medium text-crimson">
                {entry.image.note}
              </span>
            )}
            {entry.image.credit} · {entry.image.license}
          </figcaption>
        </figure>
      )}

      {(outgoing.length > 0 || incoming.length > 0) && (
        <section className="mt-8">
          <h2 className="font-display text-xl">Connections</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {outgoing.map((r, i) => (
              <li key={`o${i}`}>
                <span className="italic text-muted-foreground">{relationLabel(r.type)} →</span>{" "}
                <Link
                  href={`/entry/${r.target!.id}`}
                  className="underline underline-offset-2 hover:text-gold"
                >
                  {r.target!.title}
                </Link>
              </li>
            ))}
            {incoming.map((r, i) => (
              <li key={`i${i}`}>
                <Link
                  href={`/entry/${r.source.id}`}
                  className="underline underline-offset-2 hover:text-gold"
                >
                  {r.source.title}
                </Link>{" "}
                <span className="italic text-muted-foreground">→ {relationLabel(r.type as RelationType)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {entry.location && (
        <p className="mt-6 text-sm text-muted-foreground">
          Place: <span className="text-foreground">{entry.location.name}</span> —{" "}
          <Link href="/map" className="underline underline-offset-2 hover:text-gold">
            see the map
          </Link>
        </p>
      )}

      {entry.sources && entry.sources.length > 0 && (
        <section className="mt-8 rounded-lg border border-border bg-card/60 p-4">
          <h2 className="font-display text-lg">Sources consulted</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {entry.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs italic text-muted-foreground">
            AI-assisted entry for personal study; may contain errors — cross-check
            against these works. <Link href="/about" className="underline">About the sources</Link>
          </p>
        </section>
      )}
    </main>
  );
}
