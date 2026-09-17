import { HolyLandMap } from "@/components/holy-land-map";
import { getEntries } from "@/lib/entries";
import { getJourneys } from "@/lib/journeys";

export const metadata = { title: "Map · The Illuminated Timeline" };

export default function MapPage() {
  const located = getEntries().filter((e) => e.location);
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl">The lands of the story</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every entry with a known place, on a stylized chart of the
          Mediterranean world — drawn in the manuscript spirit, not to survey
          accuracy. The ancient lands (with their modern countries) are sketched
          only approximately. Zoom into the Holy Land, click a place to see
          everything that happened there, play the scrubber to watch the story
          move, or trace the great journeys.
        </p>
        <HolyLandMap entries={located} journeys={getJourneys()} />
      </div>
    </main>
  );
}
