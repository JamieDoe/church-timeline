import type { Metadata } from "next";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { IntroLoader } from "@/components/intro-loader";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Absolute-URL base for OG/Twitter images and canonical links. Resolved from
  // Vercel's production domain at build time — see lib/site.ts.
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const themeInit = `try{if(localStorage.getItem("vellum")==="aged"||(!localStorage.getItem("vellum")&&matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`;

// Suppress the intro veil (no flash before hydration) once it has played this
// session, or when the reader prefers reduced motion. See IntroLoader.
const introInit = `try{if(sessionStorage.getItem("intro-seen")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("intro-seen")}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ebGaramond.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Analytics />
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
        <Script
          id="intro-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: introInit }}
        />
        <IntroLoader />
        <header className="border-b border-border bg-card/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="group">
              <span className="font-display text-xl tracking-wide text-foreground sm:text-2xl">
                The <span className="text-gold">Illuminated</span> Timeline
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <SiteNav />
              <ThemeToggle />
            </div>
          </div>
          <div className="gold-rule" />
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <footer className="border-t border-border bg-card/60">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground sm:px-6">
            <p>
              AI-assisted, for personal study; may contain errors — cross-check
              against the source canon.{" "}
              <Link
                href="/about"
                className="underline underline-offset-2 hover:text-foreground"
              >
                About the sources
              </Link>
            </p>
            <p className="font-display italic">
              &ldquo;Your word is a lamp to my feet&rdquo;
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
