#!/usr/bin/env node
/**
 * The generator. Regenerates the WHOLE static site from one command:
 *
 *     node engine/build.mjs
 *
 * Outputs, all from the same sources so nothing can drift:
 *   - index.html                          (home / the tool)                ← content.mjs `home`
 *   - about/privacy/terms/contact .html   (hand-written prose pages)       ← content.mjs
 *   - <COLLECTION_DIR>/<slug>.html        (programmatic long-tail pages)   ← pages.mjs `PAGES`
 *   - sitemap.xml, robots.txt, llms.txt   (crawl surface, generated last)
 *
 * Why generate the legal/about pages too (CountLink hand-wrote them)? Because
 * then a rename or an AdSense switch is a single config change that propagates
 * everywhere — no per-file HTML patching, no page left with a stale <head>.
 * This is the main lesson baked back in from the CountLink build.
 *
 * The GROWTH LEVER is PAGES in pages.mjs: each row is one indexed page
 * targeting one long-tail query, all funnelling into the same tool with the
 * same single ad slot. That page-volume shape — not one homepage — is what
 * earns. Add rows (unique title/description/intro/faq each — never boilerplate),
 * re-run this, commit. See docs/monetization.md.
 */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import * as C from "../site.config.mjs";
import { renderDocument, adSlot, affiliateSlot, faqHtml, esc } from "./template.mjs";
import { PAGES, renderTool } from "../pages.mjs";
import { home, about, privacy, terms, contact } from "../content.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const COLL = join(ROOT, C.COLLECTION_DIR);

// Internal linking: every page lists the others in the collection. This is the
// crawl-and-rank engine — hundreds of pages each one click from every other.
function relatedLinks(currentSlug) {
  const links = PAGES.filter((p) => p.slug !== currentSlug)
    .map((p) => `<a href="/${C.COLLECTION_DIR}/${p.slug}">${esc(p.eyebrow || p.title)}</a>`)
    .join("\n      ");
  if (!links) return "";
  return `
  <nav class="related" aria-label="More tools">
    <h2>More tools</h2>
    <div class="related-grid">
      ${links}
    </div>
  </nav>`;
}

// Optional "How to use" block: visible ordered steps + HowTo JSON-LD, both from
// the same `howto` string array so structured data can never drift from screen.
function howToHtml(steps, name) {
  if (!steps || !steps.length) return "";
  return `
  <section class="howto">
    <h2>How to use ${esc(name)}</h2>
    <ol>
      ${steps.map((s) => `<li>${esc(s)}</li>`).join("\n      ")}
    </ol>
  </section>`;
}
function howToSchema(steps, name) {
  if (!steps || !steps.length) return "";
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${name}`,
    step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
  })}</script>`;
}

function collectionPage(p) {
  const body = `
  <section class="hero">
    <span class="eyebrow">${esc(p.eyebrow || "")}</span>
    <h1>${esc(p.h1 || p.title)}</h1>
    <p class="lede">${esc(p.intro || p.description)}</p>
  </section>
  ${renderTool(p)}
  ${adSlot()}
  ${p.extra || ""}
  ${howToHtml(p.howto, p.eyebrow || C.NAME)}
  ${faqHtml(p.faq)}
  ${affiliateSlot()}
  ${relatedLinks(p.slug)}`;
  return renderDocument({
    title: p.h1 || p.title,
    description: p.description,
    canonicalPath: `/${C.COLLECTION_DIR}/${p.slug}`,
    eyebrow: p.eyebrow || p.title,
    faq: p.faq,
    depth: 1,
    bodyHtml: body,
    headExtra: howToSchema(p.howto, p.eyebrow || C.NAME),
  });
}

function proseDocument(page) {
  // about/privacy/terms/contact: prose bodies from content.mjs, no ad slot.
  return renderDocument({
    title: page.title,
    description: page.description,
    canonicalPath: page.path,
    eyebrow: page.title,
    depth: 0,
    bodyHtml: page.bodyHtml,
  });
}

function homeDocument() {
  const body = `${home.bodyHtml}
  ${adSlot()}
  ${relatedLinks(null)}`;
  return renderDocument({
    title: home.title,
    description: home.description || C.DESCRIPTION,
    canonicalPath: "/",
    depth: 0,
    bodyHtml: body,
  });
}

function sitemap() {
  const all = [
    "/",
    ...[about, privacy, terms, contact].map((p) => p.path),
    ...PAGES.map((p) => `/${C.COLLECTION_DIR}/${p.slug}`),
  ];
  const urls = all
    .map((path) => `  <url><loc>${C.SITE_URL}${path}</loc><lastmod>${C.CONTENT_DATE}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /

Sitemap: ${C.SITE_URL}/sitemap.xml
`;
}

// llms.txt — a Markdown index for LLM/agent crawlers, generated from the same
// PAGES array as the sitemap so it can never go stale independently.
function llmsTxt() {
  const list = PAGES.map((p) => `- [${p.eyebrow || p.title}](${C.SITE_URL}/${C.COLLECTION_DIR}/${p.slug}): ${p.description}`).join("\n");
  return `# ${C.NAME}

> ${C.DESCRIPTION}

${C.NAME} is a static web app: no signup, no backend, no per-visitor cost. Everything runs client-side.

## Primary pages
- [Home / the tool](${C.SITE_URL}/)
- [About](${C.SITE_URL}/about)
- [Privacy policy](${C.SITE_URL}/privacy)
- [Terms of Service](${C.SITE_URL}/terms)
- [Contact](${C.SITE_URL}/contact)

## ${C.COLLECTION_DIR}
${list}
`;
}

async function main() {
  await rm(COLL, { recursive: true, force: true });
  await mkdir(COLL, { recursive: true });

  let n = 0;
  for (const p of PAGES) {
    await writeFile(join(COLL, `${p.slug}.html`), collectionPage(p));
    n++;
  }

  await writeFile(join(ROOT, "index.html"), homeDocument());
  for (const page of [about, privacy, terms, contact]) {
    await writeFile(join(ROOT, page.path.replace(/^\//, "") + ".html"), proseDocument(page));
  }

  await writeFile(join(ROOT, "sitemap.xml"), sitemap());
  await writeFile(join(ROOT, "robots.txt"), robots());
  await writeFile(join(ROOT, "llms.txt"), llmsTxt());

  console.log(`Built: index + 4 prose pages + ${n} ${C.COLLECTION_DIR} page(s) + sitemap/robots/llms.`);
  console.log(`Site: ${C.NAME} <${C.SITE_URL}>`);
  if (!C.ADSENSE_PUB) console.log("Note: AdSense not configured yet — ad slot renders as a reserved placeholder. See scripts/enable-adsense.mjs.");
}

main();
