import Link from "next/link";
import { CertaintyBadge } from "@/components/badges";

export const metadata = { title: "About the sources · The Illuminated Timeline" };

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl">About the sources</h1>

      <div className="article-prose mt-5 space-y-4">
        <p>
          The Illuminated Timeline is a personal study aid: an
          illuminated-manuscript timeline of the Bible, its figures, and the
          church history that flows from it. Its entries were drafted with AI
          assistance and reviewed by hand. <strong>It may contain errors.</strong>{" "}
          Treat it as a map, not the territory — and cross-check anything that
          matters against the works listed below.
        </p>

        <h2 className="font-display text-2xl">Three registers, kept separate</h2>
        <p>
          Every entry tries to keep three kinds of claims visibly distinct:
          what <em>scripture narrates</em> (with references), what{" "}
          <em>the church has held</em> (tradition, labelled as such), and what{" "}
          <em>historians can or cannot corroborate</em>. Scriptural narrative
          is never presented as settled secular history, and scholarly caution
          is never presented as disproof. Where Catholic, Orthodox, and
          Protestant traditions genuinely disagree, the entry shows the views
          side by side and endorses none.
        </p>

        <h2 className="font-display text-2xl">The certainty markers</h2>
        <ul className="list-none space-y-2">
          <li>
            <CertaintyBadge certainty="attested" /> — externally corroborated:
            inscriptions, contemporary documents, broad historical consensus
            (e.g. the crucifixion of Jesus under Pontius Pilate; the Council of
            Nicaea).
          </li>
          <li>
            <CertaintyBadge certainty="traditional" /> — carried by scripture
            and/or church tradition without external corroboration; said
            plainly, not embarrassed and not overstated (e.g. Peter&apos;s
            martyrdom in Rome).
          </li>
          <li>
            <CertaintyBadge certainty="contested" /> — genuinely disputed among
            serious scholars; the entry shows the disagreement rather than
            picking a false single number (e.g. the date of the Exodus).
          </li>
        </ul>

        <h2 className="font-display text-2xl">How dates work here</h2>
        <p>
          Years are signed: negative numbers are BC, positive AD, and there is
          no year zero. Approximate dates are marked <em>c.</em> (circa), and a
          contested date is displayed as its live alternatives (&ldquo;c. 1446
          BC or c. 1250 BC&rdquo;) — a node&apos;s position on the canvas is a
          placement convenience, never a verdict. Biblical chronology is itself
          a debated scholarly field; where the cross-check sources disagree,
          the entry says so.
        </p>
        <p>
          The far-left <strong>beginnings zone</strong> — Creation, Adam, Noah
          — sits before datable history. Scripture gives those narratives no
          calendar, so this app assigns them no years at all and orders them by
          story. Computed dates like Ussher&apos;s 4004 BC are reported as one
          tradition&apos;s calculation, not as consensus history.
        </p>

        <h2 className="font-display text-2xl">No invented faces</h2>
        <p>
          Nobody knows what Moses, David, or Peter looked like, and this app
          never pretends otherwise. Figures are drawn as emblems tied to their
          stories — the ark, the tablets, the harp, the crossed keys. Where a
          detail page shows a historical depiction, it is public domain, its
          source and license are credited, and it is labelled for what it is: a
          later depiction, not a likeness. Icons are labelled as icons; their
          place in worship is a matter the traditions dispute, and this app
          presents that dispute without taking a side.
        </p>

        <h2 className="font-display text-2xl">The cross-check canon</h2>
        <p>Entries cite, and should be checked against:</p>
        <ul className="list-disc space-y-1 pl-6 text-base">
          <li>Justo L. González, <em>The Story of Christianity</em>, vols. 1–2</li>
          <li>Bruce L. Shelley, <em>Church History in Plain Language</em></li>
          <li>Diarmaid MacCulloch, <em>Christianity: The First Three Thousand Years</em></li>
          <li>Henry Chadwick, <em>The Early Church</em></li>
          <li><em>The Oxford Dictionary of the Christian Church</em></li>
          <li>A study Bible with historical notes (ESV/NIV) for scriptural entries</li>
        </ul>
        <p>
          Scripture links open the passage on Bible Gateway — the point of this
          app is to drive you into the Bible, not to replace it.
        </p>

        <h2 className="font-display text-2xl">A word about tone</h2>
        <p>
          The project is neutral and academic in method, and unembarrassed
          about its subject: it presents what the church has confessed as what
          the church has confessed, what historians know as what historians
          know, and leaves the reader free before both. Where it fails that
          standard, that is a bug —{" "}
          <Link href="/" className="underline underline-offset-2 hover:text-gold">
            the canvas
          </Link>{" "}
          should teach, never preach.
        </p>
      </div>
    </main>
  );
}
