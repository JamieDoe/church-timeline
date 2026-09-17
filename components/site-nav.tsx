"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Canvas" },
  { href: "/figures", label: "Figures" },
  { href: "/map", label: "Map" },
  { href: "/read", label: "Read" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: inline links. Collapses to a menu below sm, where five links
          plus the title and theme toggle cannot share one row. */}
      <nav className="hidden items-center gap-1 sm:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm transition-colors",
              isActive(pathname, l.href)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Mobile: hamburger opening the same links as a stacked menu. */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-label="Open menu"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
        >
          <Menu className="size-5" />
        </PopoverTrigger>
        <PopoverContent align="end" side="bottom" className="w-44 p-1.5">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  isActive(pathname, l.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </PopoverContent>
      </Popover>
    </>
  );
}
