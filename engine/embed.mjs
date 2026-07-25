/**
 * Embeddable widgets.
 *
 * WHY THIS EXISTS: backlinks are the binding constraint on this whole family
 * (see docs/seo-strategy.md), and an embeddable tool is the one mechanism that
 * earns them passively — the word-counter equivalent on Textbench uses exactly this.
 *
 * THE CRITICAL DETAIL, easy to get wrong: an <iframe> on its own earns NOTHING.
 * A link inside the iframe belongs to the iframe's document — our domain — not
 * to the host page, so search engines never attribute it to the embedding site.
 * The backlink only exists if the copy-paste snippet also contains an <a> that
 * lands in the HOST page's own markup, outside the iframe. That's why
 * embedSnippet() emits an anchor next to the iframe rather than relying on the
 * "Powered by" line inside the widget. The in-widget line is for the human
 * looking at it; the outside anchor is the one that counts.
 *
 * The embed pages are deliberately noindex: they're stripped duplicates of
 * real tool pages, and letting Google index both is how you manufacture your
 * own duplicate-content problem.
 */
import * as C from "../site.config.mjs";
import { renderTool } from "../pages.mjs";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const assetV = (name) => {
  try {
    return createHash("md5")
      .update(readFileSync(new URL("../assets/" + name, import.meta.url)))
      .digest("hex").slice(0, 8);
  } catch { return "0"; }
};

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Which tools are offered as embeds. Kept deliberately small — an embed is a
 *  maintenance surface, and the counter is the one with real embed demand. */
export const EMBEDDABLE = [
  {
    slug: "text-compare",
    label: "Diff checker",
    height: 460,
    blurb: "A working two-pane diff checker your readers can use without leaving your page.",
  },
];

/** The standalone widget document served inside the iframe. */
export function embedPage(item) {
  const page = { slug: item.slug, format: "text" };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(item.label)} — ${esc(C.NAME)}</title>
<meta name="robots" content="noindex,follow">
<link rel="stylesheet" href="/assets/style.css?v=${assetV("style.css")}">
<style>
  /* Widget chrome only: no nav, no footer, no ads, no page padding. */
  body { padding: var(--space-4); background: var(--bg); }
  .embed-credit { margin-top: var(--space-3); font-size: var(--text-xs); color: var(--text-secondary); text-align: right; }
  .embed-credit a { color: var(--accent); font-weight: 600; text-decoration: none; }
  .embed-credit a:hover { text-decoration: underline; }
</style>
</head>
<body class="embed">
${renderTool(page)}
<p class="embed-credit">Powered by <a href="${C.SITE_URL}/${C.COLLECTION_DIR}/${item.slug}" target="_blank" rel="noopener">${esc(C.NAME)}</a></p>
<script src="/assets/app.js?v=${assetV("app.js")}" defer></script>
</body>
</html>
`;
}

/**
 * The copy-paste snippet. The <a> sits OUTSIDE the iframe on purpose — see the
 * file header. Without it this whole feature earns no links.
 */
export function embedSnippet(item) {
  return `<iframe src="${C.SITE_URL}/embed/${item.slug}" width="100%" height="${item.height}" style="border:1px solid #ddd;border-radius:8px;max-width:640px" title="${esc(item.label)} by ${esc(C.NAME)}" loading="lazy"></iframe>
<p style="font-size:13px"><a href="${C.SITE_URL}/${C.COLLECTION_DIR}/${item.slug}">${esc(item.label)}</a> by <a href="${C.SITE_URL}">${esc(C.NAME)}</a></p>`;
}
