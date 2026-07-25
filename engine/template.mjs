/**
 * The shared page shell: <head> (SEO + JSON-LD + analytics + ads loader),
 * the top bar, the layout grid, the ad slot, and the footer. Every collection
 * page and — via the same helpers — every hand-written page renders through
 * here, so the chrome and the SEO/structured-data scaffolding live in exactly
 * one place.
 *
 * THE LAYOUT, and why it is not one centred column. Every page used to be
 * `nav > main.wrap > section.hero > section.tool > stacked sections` inside a
 * 1080px centred column — the same skeleton for the tool, the guides and the
 * privacy policy. That sameness, not the colours, is what reads as generated.
 * So there are now two shells, chosen per page type via `layout`, both
 * full-bleed with a persistent left rail (see renderDocument):
 *
 *   "app"   — the workbench. Tool-first, the way Excalidraw or regex101 put
 *             the instrument on the page instead of a hero above it.
 *   "docs"  — three columns: rail, a measured reading column, sticky on-page
 *             contents. The MDN/Stripe reading layout.
 *
 * The proven structure this encodes (from the CountLink/vClock build):
 *   - unique <title>/<meta description>/canonical per page (duplicate meta is
 *     the #1 reason programmatic pages get filtered out of Google's index),
 *   - Open Graph + Twitter card so shared links preview well,
 *   - three JSON-LD blocks: WebApplication, BreadcrumbList, and (if the page
 *     has FAQs) FAQPage — the visible FAQ HTML is generated from the SAME
 *     array so structured data can never drift from what's on screen,
 *   - exactly ONE ad slot, in the vClock-proven position (directly below the
 *     tool, above supporting content), that reserves its height (no layout
 *     shift) and only renders when AdSense is configured.
 *
 * Analytics and ads are DATA-DRIVEN off site.config.mjs (GA_ID / ADSENSE_PUB /
 * ADSENSE_SLOT). An unconfigured app emits no dead tags; wiring them up is a
 * one-line config change (see scripts/enable-adsense.mjs), not an HTML edit.
 */
import * as C from "../site.config.mjs";
import { hreflangTags, langSwitcher } from "../i18n.mjs";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Content-hash version stamp for asset URLs. _headers caches /assets/* for
// 24h while HTML revalidates hourly — without a version query, a deploy can
// pair fresh HTML with day-old JS/CSS (new controls present but dead). The
// hash changes only when the file does, so unchanged assets stay cached.
const assetV = (name) => {
  try {
    return createHash("md5")
      .update(readFileSync(new URL("../assets/" + name, import.meta.url)))
      .digest("hex")
      .slice(0, 8);
  } catch {
    return "0";
  }
};
const CSS_V = assetV("style.css");
const JS_V = assetV("app.js");

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Depth-aware relative prefix so /tools/foo can reach ../assets while / uses
// ./assets. depth 0 = repo root page, depth 1 = a collection page.
const rel = (depth) => (depth > 0 ? "../".repeat(depth) : "./");

function analytics() {
  if (!C.GA_ID) return "";
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${C.GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());gtag('config','${C.GA_ID}');</script>`;
}

/**
 * Mediavine Grow loader. Renders nothing until GROW_SITE_ID is set, same
 * contract as analytics()/adsenseLoader() above.
 *
 * Grow is a prerequisite for Journey by Mediavine, which requires it to have
 * been running for 30+ days before a site is evaluated — so this goes in early,
 * at zero traffic, to start that clock. See site.config.mjs for the full note
 * and boring-app-factory/docs/monetization.md for why Journey matters.
 *
 * This reproduces Grow's documented non-WordPress loader. The Publisher Portal
 * is the source of truth: check the snippet it shows matches this before
 * relying on it.
 */
function growScript() {
  if (!C.GROW_SITE_ID) return "";
  return `<script data-grow-initializer="">
!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","${C.GROW_SITE_ID}");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();
</script>`;
}

function adsenseLoader() {
  if (!C.ADSENSE_PUB || !C.ADSENSE_SLOT) return "";
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${C.ADSENSE_PUB}" crossorigin="anonymous"></script>`;
}

/**
 * The single ad slot. Renders the live AdSense unit when both PUB and SLOT are
 * set; a reserved, non-rendering placeholder otherwise (so the layout is
 * identical before and after monetization is switched on — no CLS surprise on
 * launch day). `.ad-slot` is hidden in any fullscreen/overlay mode via CSS, so
 * an ad can never end up on a projector or in a stream.
 */
export function adSlot() {
  if (C.ADSENSE_PUB && C.ADSENSE_SLOT) {
    return `<div class="ad-slot">
    <ins class="adsbygoogle" style="display:block;min-height:90px"
         data-ad-client="${C.ADSENSE_PUB}" data-ad-slot="${C.ADSENSE_SLOT}"
         data-ad-format="auto" data-full-width-responsive="true"></ins>
    <script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
  </div>`;
  }
  return `<div class="ad-slot ad-slot--placeholder" aria-hidden="true"><!-- ad slot reserved; height is held so the layout never shifts --></div>`;
}

/**
 * A single, clearly-labeled affiliate recommendation card. Renders nothing
 * until AFFILIATE_PARTNER/AFFILIATE_URL are set in site.config.mjs (same
 * off-by-default pattern as adSlot()) — never a dead or placeholder link.
 * Deliberately one partner, one line of copy, no banner imagery: it should
 * read as a genuine adjacent recommendation, not an ad unit. Sits AFTER the
 * ad slot and FAQ, so it never competes with the paid ad or the tool itself.
 */
// cfg defaults to the real site.config.mjs values; tests pass an explicit
// cfg so both the "off" and "configured" branches are checkable without
// mocking a module of `const` bindings.
export function affiliateSlot(cfg = { name: C.AFFILIATE_NAME, url: C.AFFILIATE_URL, blurb: C.AFFILIATE_BLURB }) {
  if (!cfg.url || !cfg.name || !cfg.blurb) return "";
  return `
  <aside class="affiliate-card">
    <p class="affiliate-label">Sponsored</p>
    <p>${esc(cfg.blurb)}</p>
    <a href="${esc(cfg.url)}" rel="sponsored noopener" target="_blank">Try ${esc(cfg.name)} →</a>
  </aside>`;
}

export const faqSchema = (faq) =>
  faq && faq.length
    ? `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      })}</script>`
    : "";

export const faqHtml = (faq) =>
  faq && faq.length
    ? `
  <section class="faq">
    <h2>Common questions</h2>
    <dl class="faq-grid">
      ${faq.map((f) => `<div class="faq-item"><h3>${esc(f.q)}</h3><dd>${esc(f.a)}</dd></div>`).join("\n      ")}
    </dl>
  </section>`
    : "";

/**
 * Build a full HTML document.
 *
 * @param {object}   o
 * @param {string}   o.title            page <title> (without the brand suffix)
 * @param {string}   o.description      meta description + OG/Twitter description
 * @param {string}   o.canonicalPath    path after the origin, e.g. "/tools/word-counter" or "/"
 * @param {string}   o.bodyHtml         the page's <main> inner content (tool UI, prose, FAQ…)
 * @param {number}  [o.depth=0]         directory depth for relative asset URLs (0=root, 1=/collection/)
 * @param {string}  [o.eyebrow]         breadcrumb leaf name (defaults to title)
 * @param {Array}   [o.faq]             FAQ array → FAQPage JSON-LD (visible HTML is your responsibility via faqHtml)
 * @param {string}  [o.themeColor]      override the browser-chrome color
 * @param {string}  [o.bodyClass]       extra class on <body>
 * @param {string}  [o.headExtra]       extra markup injected at end of <head>
 * @param {"app"|"docs"} [o.layout]     which shell to build (see below)
 * @param {string}  [o.rail]            left-rail navigation markup (both layouts)
 * @param {string}  [o.aside]           right-rail markup — the on-page ToC (docs only)
 */
export function renderDocument(o) {
  const {
    title,
    description,
    canonicalPath,
    bodyHtml,
    depth = 0,
    eyebrow,
    faq,
    themeColor = C.THEME_COLOR,
    bodyClass = "",
    headExtra = "",
    // ── Shell ────────────────────────────────────────────────────────────
    // "app"  — the workbench: dense header strip, then the tool at the full
    //          width of the content column, then supporting prose below it.
    //          Used by the homepage and all 50 collection pages.
    // "docs" — the reading layout: left rail, a measured 68ch column, and a
    //          sticky on-page contents rail on the right. Used by guides,
    //          articles and the hand-written prose pages.
    //
    // Neither is a centred column. That skeleton — nav, then one 900–1080px
    // <main> holding a centred hero and a stack of full-width sections — is
    // what reads as templated, and it was identical on every page here.
    layout = "app",
    rail = "",
    aside = "",
    // Last time this page's content actually changed (see content-dates.mjs).
    // Falls back to the site-wide constant for pages not yet tracked.
    dateModified = C.CONTENT_DATE,
    // Locale of THIS document. Drives <html lang>, the hreflang set and the
    // language switcher. Defaults to the English original.
    lang = "en",
    // The LOGICAL page path, independent of locale ("/" for the homepage in
    // every language). hreflang sets are keyed on this, not on canonicalPath —
    // a translated page's canonicalPath is locale-prefixed ("/es/"), and using
    // that would look up a key that doesn't exist, emit no alternates, and
    // silently break reciprocity. Google discards a set whose members don't
    // all point back at each other, so that failure is total, not partial.
    i18nPath = canonicalPath,
  } = o;
  const r = rel(depth);
  const canonical = `${C.SITE_URL}${canonicalPath}`;
  const ogImage = `${C.SITE_URL}/assets/og-image.png`;
  const isHome = canonicalPath === "/";
  // The rail is real navigation, so a page rendered without one collapses the
  // grid to a single column rather than leaving an empty gutter.
  const shellClass = ["shell", `shell--${layout}`, rail ? "" : "shell--norail", aside ? "has-aside" : ""]
    .filter(Boolean)
    .join(" ");

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: C.NAME,
    url: canonical,
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    // Named maintainer on every tool page, not just the guide articles.
    // Google's "Who created it?" test is applied per page, and the tool pages
    // are the overwhelming majority of the site — leaving them anonymous made
    // the whole domain read as unattributed.
    author: { "@type": "Person", name: C.AUTHOR_NAME, url: C.AUTHOR_URL },
    datePublished: C.CONTENT_DATE,
    dateModified,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: isHome
      ? [{ "@type": "ListItem", position: 1, name: C.NAME, item: `${C.SITE_URL}/` }]
      : [
          { "@type": "ListItem", position: 1, name: C.NAME, item: `${C.SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: eyebrow || title, item: canonical },
        ],
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}${isHome ? "" : ` | ${esc(C.NAME)}`}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${hreflangTags(C.SITE_URL, i18nPath)}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" type="image/svg+xml" href="${r}assets/favicon.svg">
<meta name="theme-color" content="${themeColor}">
${C.BING_VERIFY ? `<meta name="msvalidate.01" content="${C.BING_VERIFY}">\n` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${C.FONT_HREF}" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/style.css?v=${CSS_V}">
${analytics()}
<script type="application/ld+json">${JSON.stringify(webApp)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
${faqSchema(faq)}
${adsenseLoader()}
${growScript()}
${headExtra}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar">
  <a class="logo" href="/">
    <svg class="logo-mark" width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="3" width="7" height="16" fill="currentColor"/><rect x="13" y="7" width="7" height="12" fill="currentColor" opacity="0.45"/></svg>
    ${esc(C.NAME)}
  </a>
  <nav class="topnav" aria-label="Main">
    ${C.NAV_MAIN.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join("\n    ")}
  </nav>
  <div class="topbar-end">
    ${langSwitcher(i18nPath, lang)}
    <span class="topbar-note">no upload · no account</span>
    <button type="button" class="theme-toggle" id="themeToggle" aria-label="Toggle light/dark">
      <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>
      <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 14.6A8.5 8.5 0 1 1 9.4 3.8a7 7 0 0 0 10.8 10.8Z"/></svg>
    </button>
  </div>
</header>
<div class="${shellClass}">
${rail}
<main class="content" id="main">
${bodyHtml}
</main>
${aside}
</div>
<footer>
  <div class="foot-in">
    <div><span class="fb">${esc(C.NAME)}</span> — ${esc(C.TAGLINE)} · ${C.NAV.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join(" · ")} · <a href="mailto:${C.CONTACT_EMAIL}">${esc(C.CONTACT_EMAIL)}</a></div>
    <div>Free. No signup, no upload — everything runs in your browser.<br>
    Built and maintained by <a href="${C.AUTHOR_URL}" rel="author noopener" target="_blank">${esc(C.AUTHOR_NAME)}</a>, an independent developer in Edinburgh.</div>
  </div>
</footer>
<script src="${r}assets/app.js?v=${JS_V}" defer></script>
</body>
</html>
`;
}

export { C as config, esc };
