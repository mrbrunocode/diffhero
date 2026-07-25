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
  // Label is "Compare", not "Diffchecker alternative": this anchor repeats on
  // every page, and exact-match anchor text at that volume reads as
  // over-optimisation. The page's own title and h1 carry the query.
  { href: "/diffchecker-alternative", label: "Compare" },
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

// Mediavine Grow — required for Journey by Mediavine (the ad network we plan to
// graduate to from AdSense; see boring-app-factory/docs/monetization.md).
//
// WHY THIS IS HERE BEFORE WE NEED IT: Journey requires Grow to have been
// running for a MINIMUM OF 30 DAYS before a site is even evaluated, and that
// clock is independent of traffic. Installing it at zero traffic costs nothing
// and means the 30 days are already served by the time the 1,000-sessions
// threshold is reached. Every day it is not installed is a day added to the
// eventual timeline.
//
// Empty = renders nothing (same contract as GA_ID/ADSENSE_PUB above), so the
// site ships clean until Bruno pastes the real value.
//
// TO ENABLE: create a Grow publisher account, open the Publisher Portal, choose
// the MANUAL / non-WordPress install, and copy the data-grow-faves-site-id
// value out of the snippet it shows. Paste it here and rebuild. Then click
// "I've Installed the Script" in the portal to verify.
//
// VERIFY THE GENERATED SNIPPET against what the portal shows before relying on
// it — engine/template.mjs reproduces Grow's standard loader, and if Grow ever
// changes that format, the portal is the source of truth, not this repo.
export const GROW_SITE_ID = "U2l0ZTpiZTY1ZGY2My0zODg3LTQwOTEtYjliMi0zNTgzODU3ZWIxZTY=";

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
