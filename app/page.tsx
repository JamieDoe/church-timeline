import { ManuscriptCanvas } from "@/components/canvas/ManuscriptCanvas";
import { getEntries, getLineOfPromise } from "@/lib/entries";

export default function Home() {
  const entries = getEntries();
  const promiseChain = getLineOfPromise().map((e) => e.id);
  return (
    <main className="relative flex-1">
      <div className="absolute inset-0">
        <ManuscriptCanvas entries={entries} promiseChain={promiseChain} />
      </div>
    </main>
  );
}
