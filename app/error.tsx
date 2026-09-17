"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Route-level error boundary (must be a Client Component). Catches unexpected
 * runtime errors — a chapter that fails to load, a canvas render fault — and
 * offers a retry rather than dropping the reader onto the framework's default
 * error screen. `unstable_retry` re-fetches and re-renders the failed subtree
 * (Next 16.2+); prefer it over reset(), which only clears the error state.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight">
        The ink smudged here
      </h1>
      <div className="gold-rule mx-auto mt-4 w-24" />
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
        This page failed to render. Nothing you did caused it, and nothing you
        have read is lost — reading progress is kept on your own device.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <Button variant="outline" onClick={() => unstable_retry()}>
          Try again
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to the canvas
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 font-mono text-[11px] text-muted-foreground/70">
          reference: {error.digest}
        </p>
      )}
    </main>
  );
}
