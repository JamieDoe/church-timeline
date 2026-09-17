import { notFound } from "next/navigation";
import { Reader } from "@/components/bible/reader";
import { CANON, getBook } from "@/lib/bible/types";

// Prerender each book's first chapter (every Library link lands here); deeper
// chapters render on demand — the page is a thin client shell that fetches its
// text, so there's nothing to gain from prerendering all ~1,189.
export function generateStaticParams() {
  return CANON.map((b) => ({ book: b.code, chapter: "1" }));
}

type Params = Promise<{ book: string; chapter: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { book, chapter } = await params;
  const b = getBook(book);
  return {
    title: b
      ? `${b.name} ${chapter} · The Illuminated Timeline`
      : "Not found · The Illuminated Timeline",
  };
}

export default async function ReadChapterPage({ params }: { params: Params }) {
  const { book, chapter } = await params;
  const b = getBook(book);
  const ch = Number(chapter);
  if (!b || !Number.isInteger(ch) || ch < 1 || ch > b.chapters) notFound();
  return <Reader code={b.code} chapter={ch} />;
}
