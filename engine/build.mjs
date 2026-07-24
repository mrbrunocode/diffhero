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
import { GUIDES } from "../guides.mjs";
import { ARTICLES } from "../articles.mjs";
import { home, about, privacy, terms, contact, diffcheckerAlternative } from "../content.mjs";
import { makeDateTracker } from "./content-dates.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

// dateModified per page, changing only when that page's content changes.
// See engine/content-dates.mjs for why this is not just the build date.
const dates = makeDateTracker(join(ROOT, "content-dates.json"), new Date().toISOString().slice(0, 10));
const COLL = join(ROOT, C.COLLECTION_DIR);

// Internal linking: every page lists the others in the collection. This is the
// crawl-and-rank engine — hundreds of pages each one click from every other.
// Related-tools links. On a collection page we show a CURATED window of ~12
// thematically-adjacent tools (PAGES is ordered so neighbours are related),
// not the full wall of every sibling — a giant identical link list on every
// page is a classic doorway/low-value signal, and it buries the page's own
// content. Full crawl coverage still comes from the homepage (which lists all)
// and the sitemap. On the homepage (currentSlug === null) we intentionally
// list everything, since that page IS the index.
const WINDOW = 12;
function relatedLinks(currentSlug) {
  let chosen;
  if (currentSlug == null) {
    chosen = PAGES;
  } else {
    const i = PAGES.findIndex((p) => p.slug === currentSlug);
    // A wrapping window centred on the current page, excluding itself.
    chosen = [];
    for (let off = 1; chosen.length < WINDOW && off < PAGES.length; off++) {
      const before = PAGES[(i - off + PAGES.length) % PAGES.length];
      const after = PAGES[(i + off) % PAGES.length];
      if (after.slug !== currentSlug && !chosen.includes(after)) chosen.push(after);
      if (chosen.length < WINDOW && before.slug !== currentSlug && !chosen.includes(before)) chosen.push(before);
    }
  }
  const links = chosen
    .filter((p) => p.slug !== currentSlug)
    .map((p) => `<a href="/${C.COLLECTION_DIR}/${p.slug}">${esc(p.eyebrow || p.title)}</a>`)
    .join("\n      ");
  if (!links) return "";
  const browseAll =
    currentSlug == null
      ? ""
      : `\n      <a class="related-all" href="/">Browse all ${PAGES.length} tools →</a>`;
  return `
  <nav class="related" aria-label="More tools">
    <h2>${currentSlug == null ? "All tools" : "Related tools"}</h2>
    <div class="related-grid">
      ${links}${browseAll}
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
  ${p.extra || GUIDES[p.slug] || ""}
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
    dateModified: dates.dateFor(`${C.COLLECTION_DIR}/${p.slug}`, [
      p.title, p.h1, p.description, p.intro, p.faq, p.howto,
      p.extra || GUIDES[p.slug] || "",
    ]),
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
    dateModified: dates.dateFor(page.path, [page.title, page.description, page.bodyHtml]),
  });
}

// ── Editorial articles (/guides) ───────────────────────────────────────────
const GUIDES_DIR = "guides";
const fmtDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// Author byline — a real, named person linking to their own site is the
// E-E-A-T "Who" signal AdSense and Google's quality raters look for.
function byline(a) {
  return `
  <p class="byline">By <a href="${C.AUTHOR_URL}" rel="author noopener" target="_blank">${esc(C.AUTHOR_NAME)}</a>
    · <time datetime="${a.date}">${fmtDate(a.date)}</time>
    · ${a.read} min read</p>`;
}

function authorBox() {
  return `
  <aside class="author-box">
    <p class="author-box-name">${esc(C.AUTHOR_NAME)}</p>
    <p>${esc(C.AUTHOR_BIO)} <a href="${C.AUTHOR_URL}" rel="author noopener" target="_blank">${esc(C.AUTHOR_NAME.replace(/ FK$/, ""))}'s site →</a></p>
  </aside>`;
}

function articleSchema(a) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    author: { "@type": "Person", name: C.AUTHOR_NAME, url: C.AUTHOR_URL },
    publisher: { "@type": "Organization", name: C.NAME },
    datePublished: a.date,
    dateModified: a.date,
    mainEntityOfPage: `${C.SITE_URL}/${GUIDES_DIR}/${a.slug}`,
  })}</script>`;
}

function articleDocument(a) {
  const body = `
  <article class="prose article">
    <span class="eyebrow">Guide</span>
    <h1>${esc(a.title)}</h1>
    ${byline(a)}
    ${a.bodyHtml}
    ${authorBox()}
    <p class="article-back"><a href="/${GUIDES_DIR}">← All guides</a></p>
  </article>`;
  return renderDocument({
    title: a.title,
    description: a.description,
    canonicalPath: `/${GUIDES_DIR}/${a.slug}`,
    eyebrow: "Guides",
    depth: 1,
    bodyHtml: body,
    headExtra: articleSchema(a),
  });
}

function guidesIndexDocument() {
  const cards = ARTICLES.map(
    (a) => `
    <a class="guide-card" href="/${GUIDES_DIR}/${a.slug}">
      <h2>${esc(a.title)}</h2>
      <p>${esc(a.excerpt)}</p>
      <span class="guide-card-meta">${a.read} min read</span>
    </a>`
  ).join("\n");
  const body = `
  <section class="hero">
    <span class="eyebrow">Guides</span>
    <h1>${esc(C.NAME)} guides</h1>
    <p class="lede">Practical, plain-English writing on diffs, version control and comparing files — the concepts behind the tools, and how to use them well.</p>
  </section>
  <div class="guide-list">${cards}
  </div>`;
  return renderDocument({
    title: `${C.NAME} Guides — Diffs, Version Control & File Comparison`,
    description: `In-depth guides on diffing, version control and comparing files: what a diff is, reviewing pull requests, resolving merge conflicts, diffing config safely, and more.`,
    canonicalPath: `/${GUIDES_DIR}`,
    eyebrow: "Guides",
    depth: 0,
    bodyHtml: body,
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
    `/${GUIDES_DIR}`,
    ...[about, privacy, terms, contact, diffcheckerAlternative].map((p) => p.path),
    ...ARTICLES.map((a) => `/${GUIDES_DIR}/${a.slug}`),
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
- [Guides](${C.SITE_URL}/${GUIDES_DIR})
- [About](${C.SITE_URL}/about)
- [Privacy policy](${C.SITE_URL}/privacy)
- [Terms of Service](${C.SITE_URL}/terms)
- [Contact](${C.SITE_URL}/contact)
- [Diffchecker alternative — how Diffhero compares](${C.SITE_URL}/diffchecker-alternative)

## Guides
${ARTICLES.map((a) => `- [${a.title}](${C.SITE_URL}/${GUIDES_DIR}/${a.slug}): ${a.description}`).join("\n")}

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
  for (const page of [about, privacy, terms, contact, diffcheckerAlternative]) {
    await writeFile(join(ROOT, page.path.replace(/^\//, "") + ".html"), proseDocument(page));
  }

  // Editorial articles: /guides index + /guides/<slug> pages.
  const guidesOut = join(ROOT, GUIDES_DIR);
  await rm(guidesOut, { recursive: true, force: true });
  await mkdir(guidesOut, { recursive: true });
  await writeFile(join(ROOT, `${GUIDES_DIR}.html`), guidesIndexDocument());
  for (const a of ARTICLES) {
    await writeFile(join(guidesOut, `${a.slug}.html`), articleDocument(a));
  }

  await writeFile(join(ROOT, "sitemap.xml"), sitemap());
  await writeFile(join(ROOT, "robots.txt"), robots());
  await writeFile(join(ROOT, "llms.txt"), llmsTxt());

  const d = dates.save();
  console.log(`Built: index + ${[about, privacy, terms, contact, diffcheckerAlternative].length} prose pages + ${n} ${C.COLLECTION_DIR} page(s) + sitemap/robots/llms.`);
  console.log(`dateModified: ${d.total} pages tracked, ${d.changed.length} changed this build.`);
  console.log(`Site: ${C.NAME} <${C.SITE_URL}>`);
  if (!C.ADSENSE_PUB) console.log("Note: AdSense not configured yet — ad slot renders as a reserved placeholder. See scripts/enable-adsense.mjs.");
}

main();
