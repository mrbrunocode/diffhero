/**
 * SINGLE SOURCE OF TRUTH for this app's identity, domain, and monetization IDs.
 * Edit these, then run `node engine/build.mjs` to regenerate the site.
 */

export const NAME = "Diffhero";
export const NAME_LOWER = "diffhero";
export const TAGLINE = "See exactly what changed.";
export const SITE_URL = "https://diffhero.app"; // set to the real domain once bought
export const CONTACT_EMAIL = "hello@diffhero.app";
export const DESCRIPTION =
  "A free diff checker for text and code. See what changed between two versions, " +
  "with the exact words highlighted. No signup, nothing uploaded.";

// The subdirectory holding the programmatic-SEO collection pages.
export const COLLECTION_DIR = "diff";

export const NAV = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export const LAST_UPDATED = "July 15, 2026";
export const CONTENT_DATE = "2026-07-15";

// ── Monetization / analytics IDs (empty until wired up) ────────────────────
export const GA_ID = "";
export const ADSENSE_PUB = "";
export const ADSENSE_SLOT = "";

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap";

export const THEME_COLOR = "#0a0d12";
