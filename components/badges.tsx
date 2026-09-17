import type { Certainty, Layer, Register } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** attested = lapis, traditional = gold, contested = crimson — legend on /about. */
export function CertaintyBadge({ certainty, className }: { certainty: Certainty; className?: string }) {
  const styles: Record<Certainty, string> = {
    attested: "border-lapis/50 text-lapis",
    traditional: "border-gold/60 text-gold",
    contested: "border-crimson/50 text-crimson",
  };
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", styles[certainty], className)}
      title={
        certainty === "attested"
          ? "Externally corroborated by historical evidence"
          : certainty === "traditional"
            ? "Carried by scripture and tradition; not externally corroborated"
            : "Genuinely disputed — see the entry for the disagreement"
      }
    >
      {certainty}
    </Badge>
  );
}

export function RegisterBadge({ register }: { register: Register }) {
  const labels: Record<Register, string> = {
    scripture: "what scripture narrates",
    tradition: "what the church has held",
    history: "what historians weigh",
  };
  return (
    <Badge variant="secondary" className="bg-muted font-normal text-muted-foreground" title={labels[register]}>
      {register}
    </Badge>
  );
}

const LAYER_LABEL: Record<Layer, string> = {
  scripture: "Scripture",
  people: "People",
  church: "Church",
};

export function LayerChip({ layer, className }: { layer: Layer; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <span
        className="size-2 rounded-full"
        style={{ background: `var(--layer-${layer})` }}
      />
      {LAYER_LABEL[layer]}
    </span>
  );
}
