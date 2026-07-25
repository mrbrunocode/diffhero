/**
 * Internationalisation — deliberately narrow.
 *
 * WHY THIS IS SMALL ON PURPOSE. editpad.org ranks for head diff terms partly
 * because it publishes in five languages, and "diff checker" is a
 * language-agnostic need with large non-English volume. So the lever is real.
 * But the obvious way to pull it — machine-translating all 50 collection pages
 * into five languages — would generate 250 pages of unreviewed text, which is
 * precisely the "scaled content abuse" pattern Google's March 2026 update
 * targeted and which docs/seo-outreach-plan.md warns about at length. Doing
 * that to chase a ranking would risk the whole domain.
 *
 * So: a small number of high-value pages, translated to a standard worth
 * publishing, with correct hreflang. Quality over surface area. Adding a
 * language means writing it properly, not running the English through a model.
 *
 * WHAT'S TRANSLATED: the homepage only, in Spanish and German — the two
 * largest non-English developer audiences among the languages a competent
 * reviewer could check. The tool itself is almost entirely non-verbal (two
 * boxes and a coloured diff), so a translated landing page delivers most of
 * the value of a translated site.
 *
 * HREFLANG RULES THIS ENCODES (the ones people get wrong):
 *   - every page in a set lists ALL alternates INCLUDING ITSELF (self-referential)
 *   - the set is reciprocal: if /es links /de, /de must link /es
 *   - x-default points at the English original
 *   - canonical points at the page ITSELF, never at the English version —
 *     canonicalising a translation to its English source de-indexes it, which
 *     is the single most common way sites break their own i18n
 */

/**
 * MASTER SWITCH — currently OFF (2026-07-25).
 *
 * Turned off because what actually shipped didn't clear the bar the comment
 * above sets for itself. /es/ and /de/ were ~450 words of (genuinely good)
 * translated prose with NO TOOL ON THE PAGE — the diff widget was never
 * rendered into them — wrapped in English chrome: English nav, English rail,
 * English footer. Both ended with a "see the full English site" link, which is
 * the tell: the page's only real job was to send you somewhere else.
 *
 * That made the hreflang set a false claim. `hreflang="es"` asserts /es/ is the
 * Spanish equivalent of the homepage; the homepage is a working tool and /es/
 * was an essay about one. And a thin, half-localised page with no functionality
 * is close to the profile that got CountLink knocked back for "low value
 * content" while Diffhero's own AdSense application is still pending. Risk with
 * no traffic upside.
 *
 * The reasoning in the header comment still stands and the Spanish/German copy
 * in content.i18n.mjs is worth keeping. Turning this back on means finishing
 * the job: translated tool UI, translated nav/footer, and enough translated
 * pages to be a real language cluster rather than two orphans.
 */
export const I18N_ENABLED = false;

/** Locales in the set. `path` is the URL prefix; "" is the English original. */
export const LOCALES = [
  { code: "en", path: "", label: "English" },
  { code: "es", path: "/es", label: "Español" },
  { code: "de", path: "/de", label: "Deutsch" },
];

/** Which pages exist in translation. Only add a slug here once it's genuinely
 *  written in that language — a missing translation is far better than a
 *  machine-generated one. */
export const TRANSLATED_PAGES = ["/"];

/**
 * hreflang <link> tags for a page, or "" when the page isn't part of a
 * translated set (most of the site). Self-referential and reciprocal by
 * construction, so the two rules above can't be violated by accident.
 */
export function hreflangTags(siteUrl, pagePath) {
  if (!I18N_ENABLED) return "";
  return hreflangTagsFor(siteUrl, pagePath);
}

/**
 * The hreflang computation itself, independent of the master switch — so the
 * self-referential/reciprocal/x-default rules stay under test while i18n is
 * off, and are still correct on the day it comes back.
 */
export function hreflangTagsFor(siteUrl, pagePath) {
  if (!TRANSLATED_PAGES.includes(pagePath)) return "";
  const href = (loc) =>
    `${siteUrl}${loc.path}${pagePath === "/" ? "/" : pagePath}`.replace(/\/{2,}$/, "/");
  const tags = LOCALES.map(
    (loc) => `<link rel="alternate" hreflang="${loc.code}" href="${href(loc)}">`,
  );
  tags.push(`<link rel="alternate" hreflang="x-default" href="${href(LOCALES[0])}">`);
  return tags.join("\n");
}

/** Visible language switcher. Only rendered on pages that have alternates. */
export function langSwitcher(pagePath, currentCode) {
  if (!I18N_ENABLED) return "";
  if (!TRANSLATED_PAGES.includes(pagePath)) return "";
  const items = LOCALES.map((loc) => {
    const href = `${loc.path}${pagePath === "/" ? "/" : pagePath}`.replace(/\/{2,}$/, "/");
    return loc.code === currentCode
      ? `<span aria-current="true">${loc.label}</span>`
      : `<a href="${href}" hreflang="${loc.code}">${loc.label}</a>`;
  });
  return `<nav class="lang-switch" aria-label="Language">${items.join("")}</nav>`;
}
