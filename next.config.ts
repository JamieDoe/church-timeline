import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: `next dev` serves its client bundle to localhost alone, so opening
  // the site on a phone via your machine's LAN address silently loads the HTML
  // with no working JavaScript. To test on a device, pass your LAN address:
  //   DEV_ORIGIN=192.168.0.56 npm run dev
  // Has no effect on production builds, where this restriction doesn't apply.
  allowedDevOrigins: [...(process.env.DEV_ORIGIN ? [process.env.DEV_ORIGIN] : []), "*.local"],
  images: {
    // Public-domain images are hotlinked from Wikimedia Commons only
    // (detail pages only — see the image-honesty rules in AGENTS/brief).
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
    ],
  },
};

export default nextConfig;
