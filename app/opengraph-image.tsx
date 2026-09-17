import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site";

export const alt = "The Illuminated Timeline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hex equivalents of the light "fresh vellum" palette in globals.css — the
// image renderer (Satori) cannot parse oklch().
const PARCHMENT = "#f4eede";
const INK = "#3a3128";
const GOLD = "#c2921f";
const MUTED = "#6f6151";

/**
 * The link-preview card. Generated at build time, so it costs nothing at
 * request time. Deliberately typographic — no invented faces, in keeping with
 * the project's image rules (see /about).
 *
 * Mirrors the site's type hierarchy: EB Garamond for the wordmark, the sans
 * for supporting text. The font is read from the repo rather than fetched, so
 * the build has no network dependency; next/font's own files can't be reused
 * here because the image renderer needs .ttf, not .woff2.
 */
export default async function OpenGraphImage() {
  // A static instance, not a variable font — the image renderer cannot parse a
  // weight axis and fails the build with a cryptic TypeError if given one.
  const garamond = await readFile(
    join(process.cwd(), "assets/fonts/EBGaramond-Regular.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: PARCHMENT,
          padding: 64,
        }}
      >
        {/* Inner rule frame */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: `1px solid ${GOLD}55`,
          }}
        />

        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: 28,
          }}
        >
          Scripture · People · Church
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "EB Garamond",
            fontSize: 92,
            color: INK,
          }}
        >
          <span>The&nbsp;</span>
          <span style={{ color: GOLD }}>Illuminated</span>
          <span>&nbsp;Timeline</span>
        </div>

        <div
          style={{
            width: 260,
            height: 2,
            marginTop: 34,
            marginBottom: 34,
            background: `linear-gradient(90deg, ${PARCHMENT}, ${GOLD}, ${PARCHMENT})`,
          }}
        />

        <div
          style={{
            fontSize: 28,
            lineHeight: 1.45,
            color: MUTED,
            textAlign: "center",
            maxWidth: 860,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "EB Garamond",
          data: garamond,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
