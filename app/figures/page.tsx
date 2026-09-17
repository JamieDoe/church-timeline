import { FiguresDirectory } from "@/components/figures-directory";
import { getFigures } from "@/lib/entries";

export const metadata = { title: "Figures · The Illuminated Timeline" };

export default function FiguresPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl">Figures</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every figure on the canvas — searchable, sortable, honest about its dates.
      </p>
      <FiguresDirectory figures={getFigures()} />
    </main>
  );
}
