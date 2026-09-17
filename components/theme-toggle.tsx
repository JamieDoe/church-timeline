"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Fresh vellum ↔ aged (candlelit) vellum. */
export function ThemeToggle() {
  const [aged, setAged] = useState<boolean | null>(null);

  useEffect(() => {
    setAged(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("vellum", next ? "aged" : "fresh");
    } catch {}
    setAged(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={aged ? "Switch to fresh vellum" : "Switch to aged vellum"}
      title={aged ? "Fresh vellum" : "Aged vellum"}
    >
      {aged === false ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  );
}
