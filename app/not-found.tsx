import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Not found · The Illuminated Timeline" };

/**
 * Rendered whenever a route segment calls notFound() — an unknown entry id, or
 * a book/chapter outside the canon. Composes with the root layout, so the nav
 * and footer stay put rather than dropping the reader onto a bare error page.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Not found
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight">
        This leaf is missing from the book
      </h1>
      <div className="gold-rule mx-auto mt-4 w-24" />
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
        No entry, book, or chapter answers to that address. The link may be
        mistaken, or it may point to something this timeline does not carry.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to the canvas
        </Link>
        <Link href="/read" className={cn(buttonVariants({ variant: "outline" }))}>
          The Library
        </Link>
        <Link href="/figures" className={cn(buttonVariants({ variant: "outline" }))}>
          Figures
        </Link>
      </div>
    </main>
  );
}
