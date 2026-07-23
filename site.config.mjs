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
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

// Author identity (E-E-A-T). Articles carry a byline linking here; the About
// page names the same person. brunofk.dev is the developer's own site.
export const AUTHOR_NAME = "Bruno FK";
export const AUTHOR_URL = "https://brunofk.dev";
export const AUTHOR_BIO =
  "Bruno FK is an Edinburgh-based software developer who builds small, fast, privacy-respecting web tools. He created Diffhero after one too many diff checkers that either paywalled the useful features or uploaded his code to a server.";

export const LAST_UPDATED = "July 18, 2026";
export const CONTENT_DATE = "2026-07-18";

// ── Monetization / analytics IDs (empty until wired up) ────────────────────
export const GA_ID = "G-Q907KGWEP4";
export const ADSENSE_PUB = "ca-pub-2653891546345771";
export const ADSENSE_SLOT = "";

// Bing Webmaster Tools site-ownership verification (empty until wired up).
export const BING_VERIFY = "5A4EFD6B7BD09C4C115B7ACCF3688E1C";

// Affiliate recommendation card (empty until an affiliate account exists —
// see boring-app-factory docs for the vetting checklist before filling these in).
export const AFFILIATE_NAME = "";
export const AFFILIATE_URL = "";
export const AFFILIATE_BLURB = "";

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap";

export const THEME_COLOR = "#0a0d12";
