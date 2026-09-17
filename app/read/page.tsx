import Link from "next/link";
import { LibraryShelf } from "@/components/bible/library";

export const metadata = { title: "The Library · The Illuminated Timeline" };

export default function LibraryPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl">The Library</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        The books of Scripture as a shelf of illuminated volumes — each gilded as you
        read it. Public-domain WEB and KJV; the Protestant 66-book canon (the
        deuterocanon differs by tradition — see{" "}
        <Link href="/entry/the-new-testament-canon" className="underline underline-offset-2 hover:text-foreground">
          the canon
        </Link>
        ). Progress is kept privately on this device.
      </p>
      <LibraryShelf />
    </main>
  );
}
