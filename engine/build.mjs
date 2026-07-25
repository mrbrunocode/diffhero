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
import { PAGES, GROUPS, GROUP_OF, renderTool } from "../pages.mjs";
import { GUIDES } from "../guides.mjs";
import { ARTICLES } from "../articles.mjs";
import { home, about, privacy, terms, contact, diffcheckerAlternative, embed } from "../content.mjs";
import { EMBEDDABLE, embedPage } from "./embed.mjs";
import { TRANSLATIONS } from "../content.i18n.mjs";
import { I18N_ENABLED, LOCALES, TRANSLATED_PAGES } from "../i18n.mjs";
import { makeDateTracker } from "./content-dates.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

// dateModified per page, changing only when that page's content changes.
// See engine/content-dates.mjs for why this is not just the build date.
const dates = makeDateTracker(join(ROOT, "content-dates.json"), new Date().toISOString().slice(0, 10));
const COLL = join(ROOT, C.COLLECTION_DIR);

// ── The persistent left rail ───────────────────────────────────────────────
// Every page carries navigation in a fixed column, the way a docs site does
// (MDN, Stripe) rather than burying it at the bottom of a scroll. Two flavours:
// the tool index on tool pages, the reading index on guides and prose pages.
//
// On tool pages this is SITE NAVIGATION, not body content — same markup, same
// position, every page, so it reads as chrome and is discounted as boilerplate.
// It does not replace the curated in-content `relatedLinks()` window below the
// fold, which stays contextual for exactly the reason documented there.
const BY_SLUG = Object.fromEntries(PAGES.map((p) => [p.slug, p]));

function toolRail(currentSlug) {
  const groups = GROUPS.map((g) => {
    const items = g.slugs
      .map((slug) => {
        const p = BY_SLUG[slug];
        const here = slug === currentSlug;
        return `<li><a href="/${C.COLLECTION_DIR}/${slug}"${here ? ' aria-current="page"' : ""}>${esc(p.eyebrow || p.title)}</a></li>`;
      })
      .join("\n          ");
    const open = currentSlug == null || GROUP_OF[currentSlug] === g.name;
    const id = `rail-${slugifyHeading(g.name)}`;
    return `
      <section class="rail-group">
        <p class="rail-head" id="${id}">${esc(g.name)}</p>
        <ul class="rail-list${open ? " is-here" : ""}" aria-labelledby="${id}">
          ${items}
        </ul>
      </section>`;
  }).join("");
  return `<nav class="rail" aria-label="All diff tools">
  <div class="rail-in">
    <p class="rail-title"><a href="/">${PAGES.length} diff tools</a></p>${groups}
  </div>
</nav>`;
}

function docsRail(currentPath) {
  const link = (href, label) =>
    `<li><a href="${href}"${href === currentPath ? ' aria-current="page"' : ""}>${esc(label)}</a></li>`;
  return `<nav class="rail" aria-label="Guides and site">
  <div class="rail-in">
    <p class="rail-title"><a href="/${GUIDES_DIR}">Guides</a></p>
    <section class="rail-group">
      <p class="rail-head" id="rail-reading">Reading</p>
      <ul class="rail-list is-here" aria-labelledby="rail-reading">
        ${ARTICLES.map((a) => link(`/${GUIDES_DIR}/${a.slug}`, a.title)).join("\n        ")}
      </ul>
    </section>
    <section class="rail-group">
      <p class="rail-head" id="rail-site">Site</p>
      <ul class="rail-list is-here" aria-labelledby="rail-site">
        ${link("/diffchecker-alternative", "Diffchecker alternative")}
        ${link("/embed", "Embed the diff checker")}
        ${link("/about", "About")}
        ${link("/privacy", "Privacy")}
        ${link("/terms", "Terms")}
        ${link("/contact", "Contact")}
      </ul>
    </section>
    <section class="rail-group">
      <p class="rail-head" id="rail-tools">Tools</p>
      <ul class="rail-list is-here" aria-labelledby="rail-tools">
        <li><a href="/">All ${PAGES.length} diff tools →</a></li>
      </ul>
    </section>
  </div>
</nav>`;
}

// ── On-page contents (the docs layout's right rail) ────────────────────────
// Built from the page's own <h2>s at build time: the headings get ids and the
// rail gets the list, from one pass, so the two can never disagree.
const slugifyHeading = (s) =>
  s.toLowerCase().replace(/&[a-z]+;/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function withToc(html) {
  const items = [];
  const used = new Set();
  const withIds = html.replace(/<h2(?![^>]*\sid=)([^>]*)>([\s\S]*?)<\/h2>/g, (m, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!text) return m;
    let id = slugifyHeading(text) || `section-${items.length + 1}`;
    while (used.has(id)) id = `${id}-${items.length + 1}`;
    used.add(id);
    items.push({ id, text });
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  // Two headings is a list, not a contents. Below that the rail is noise.
  if (items.length < 3) return { html: withIds, aside: "" };
  const aside = `<aside class="toc" aria-label="On this page">
  <div class="toc-in">
    <p class="toc-title">On this page</p>
    <ol>
      ${items.map((i) => `<li><a href="#${i.id}">${esc(i.text)}</a></li>`).join("\n      ")}
    </ol>
  </div>
</aside>`;
  return { html: withIds, aside };
}

// Internal linking: every page lists the others in the collection. This is the
// crawl-and-rank engine — hundreds of pages each one click from every other.
// Related-tools links. On a collection page we show a CURATED window of ~12
// thematically-adjacent tools (PAGES is ordered so neighbours are related),
// not the full wall of every sibling — a giant identical link list on every
// page is a classic doorway/low-value signal, and it buries the page's own
// content. Full crawl coverage still comes from the homepage (which lists all)
// and the sitemap. On the homepage (currentSlug === null) we intentionally
// list everything, since that page IS the index.
// Full crawl coverage now comes from the rail (every page carries all 50) and
// the sitemap, so this stays what it always was meant to be: a small, curated,
// genuinely contextual set, sitting in the margin beside the page's own prose.
const WINDOW = 10;
function relatedLinks(currentSlug) {
  const i = PAGES.findIndex((p) => p.slug === currentSlug);
  if (i < 0) return "";
  // A wrapping window centred on the current page, excluding itself.
  const chosen = [];
  for (let off = 1; chosen.length < WINDOW && off < PAGES.length; off++) {
    const before = PAGES[(i - off + PAGES.length) % PAGES.length];
    const after = PAGES[(i + off) % PAGES.length];
    if (after.slug !== currentSlug && !chosen.includes(after)) chosen.push(after);
    if (chosen.length < WINDOW && before.slug !== currentSlug && !chosen.includes(before)) chosen.push(before);
  }
  const links = chosen
    .map((p) => `<li><a href="/${C.COLLECTION_DIR}/${p.slug}">${esc(p.eyebrow || p.title)}</a></li>`)
    .join("\n      ");
  if (!links) return "";
  return `
  <nav class="related" aria-label="More tools">
    <h2>Related tools</h2>
    <ul class="related-list">
      ${links}
      <li><a class="related-all" href="/">All ${PAGES.length} tools →</a></li>
    </ul>
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

/**
 * A tool page in the "app" shell: a dense header strip, the instrument at the
 * full width of the content column, then the supporting prose in a measured
 * reading column with the contextual links in the margin beside it.
 *
 * The old shape put a centred hero above the tool and pushed the tool itself
 * halfway down the first screen — on a diff checker, where the two panes are
 * the entire product, that is the wrong thing at the top.
 */
function collectionPage(p) {
  const body = `
  <div class="toolhead">
    <div class="toolhead-id">
      <p class="crumb"><a href="/">Diff tools</a> <span aria-hidden="true">/</span> <span>${esc(GROUP_OF[p.slug] || "Tools")}</span></p>
      <h1>${esc(p.h1 || p.title)}</h1>
    </div>
    <p class="toolhead-lede">${esc(p.intro || p.description)}</p>
    <ul class="toolhead-spec">
      <li><span class="dot" aria-hidden="true"></span>Runs in your browser</li>
      <li>Nothing uploaded</li>
      <li>No account, no limit</li>
    </ul>
  </div>
  ${renderTool(p)}
  ${adSlot()}
  <div class="below">
    <div class="below-read">
      ${p.extra || GUIDES[p.slug] || ""}
      ${howToHtml(p.howto, p.eyebrow || C.NAME)}
      ${faqHtml(p.faq)}
      ${affiliateSlot()}
    </div>
    <div class="below-margin">
      ${relatedLinks(p.slug)}
    </div>
  </div>`;
  return renderDocument({
    title: p.h1 || p.title,
    description: p.description,
    canonicalPath: `/${C.COLLECTION_DIR}/${p.slug}`,
    eyebrow: p.eyebrow || p.title,
    faq: p.faq,
    depth: 1,
    layout: "app",
    rail: toolRail(p.slug),
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
  // Docs shell — rail, measured column, on-page contents. A privacy policy is
  // a reference document, so it gets the reference-document layout.
  const { html, aside } = withToc(page.bodyHtml);
  return renderDocument({
    title: page.title,
    description: page.description,
    canonicalPath: page.path,
    eyebrow: page.title,
    depth: 0,
    layout: "docs",
    rail: docsRail(page.path),
    aside,
    bodyHtml: html,
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
  const { html, aside } = withToc(a.bodyHtml);
  const body = `
  <article class="prose article">
    <span class="eyebrow">Guide</span>
    <h1>${esc(a.title)}</h1>
    ${byline(a)}
    ${html}
    ${authorBox()}
    <p class="article-back"><a href="/${GUIDES_DIR}">← All guides</a></p>
  </article>`;
  return renderDocument({
    title: a.title,
    description: a.description,
    canonicalPath: `/${GUIDES_DIR}/${a.slug}`,
    eyebrow: "Guides",
    depth: 1,
    layout: "docs",
    rail: docsRail(`/${GUIDES_DIR}/${a.slug}`),
    aside,
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
  <div class="page-head">
    <span class="eyebrow">Guides</span>
    <h1>${esc(C.NAME)} guides</h1>
    <p class="lede">Practical, plain-English writing on diffs, version control and comparing files — the concepts behind the tools, and how to use them well.</p>
  </div>
  <div class="guide-list">${cards}
  </div>`;
  return renderDocument({
    title: `${C.NAME} Guides — Diffs, Version Control & File Comparison`,
    description: `In-depth guides on diffing, version control and comparing files: what a diff is, reviewing pull requests, resolving merge conflicts, diffing config safely, and more.`,
    canonicalPath: `/${GUIDES_DIR}`,
    eyebrow: "Guides",
    depth: 0,
    layout: "docs",
    rail: docsRail(`/${GUIDES_DIR}`),
    bodyHtml: body,
  });
}

function homeDocument() {
  // The homepage is the workbench too: the rail carries the whole tool index,
  // so the full internal-link surface is present without the wall of pills
  // that used to sit under the fold.
  const body = `${home.bodyHtml}
  ${adSlot()}
  ${home.belowHtml}`;
  return renderDocument({
    title: home.title,
    description: home.description || C.DESCRIPTION,
    canonicalPath: "/",
    depth: 0,
    layout: "app",
    rail: toolRail(null),
    bodyHtml: body,
  });
}

function sitemap() {
  const all = [
    "/",
    `/${GUIDES_DIR}`,
    ...[about, privacy, terms, contact, diffcheckerAlternative, embed].map((p) => p.path),
    ...(I18N_ENABLED
      ? TRANSLATIONS.map((t) => (t.path === "/" ? `/${t.lang}/` : `/${t.lang}${t.path}`))
      : []),
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
- [Embed a diff checker on your site](${C.SITE_URL}/embed)

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
  for (const page of [about, privacy, terms, contact, diffcheckerAlternative, embed]) {
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

  // Translated pages (see i18n.mjs — deliberately a small, hand-written set).
  // Gated on I18N_ENABLED; when off, any previously generated locale directory
  // is removed so a disabled language can't linger as an orphaned live page.
  if (!I18N_ENABLED) {
    for (const loc of LOCALES) {
      if (loc.path) await rm(join(ROOT, loc.path.replace(/^\//, "")), { recursive: true, force: true });
    }
    console.log(`i18n disabled — no translated pages (see i18n.mjs).`);
  } else {
  for (const t of TRANSLATIONS) {
    const dir = join(ROOT, t.lang);
    await mkdir(dir, { recursive: true });
    const { html, aside } = withToc(t.bodyHtml);
    await writeFile(join(dir, "index.html"), renderDocument({
      title: t.title,
      description: t.description,
      canonicalPath: t.path === "/" ? `/${t.lang}/` : `/${t.lang}${t.path}`,
      depth: 1,
      layout: "docs",
      rail: toolRail(null),
      aside,
      bodyHtml: html,
      lang: t.lang,
      i18nPath: t.path,
      dateModified: dates.dateFor(`${t.lang}${t.path}`, [t.title, t.description, t.bodyHtml]),
    }));
  }
  console.log(`Wrote ${TRANSLATIONS.length} translated page(s): ${TRANSLATIONS.map((t) => "/" + t.lang).join(", ")}`);
  }

  const embedOut = join(ROOT, "embed");
  await mkdir(embedOut, { recursive: true });
  for (const item of EMBEDDABLE) {
    await writeFile(join(embedOut, `${item.slug}.html`), embedPage(item));
  }
  console.log(`Wrote ${EMBEDDABLE.length} embed widget(s) to embed/ (noindex, not in sitemap).`);

  await writeFile(join(ROOT, "sitemap.xml"), sitemap());
  await writeFile(join(ROOT, "robots.txt"), robots());
  await writeFile(join(ROOT, "llms.txt"), llmsTxt());

  const d = dates.save();
  console.log(`Built: index + ${[about, privacy, terms, contact, diffcheckerAlternative, embed].length} prose pages + ${n} ${C.COLLECTION_DIR} page(s) + sitemap/robots/llms.`);
  console.log(`dateModified: ${d.total} pages tracked, ${d.changed.length} changed this build.`);
  console.log(`Site: ${C.NAME} <${C.SITE_URL}>`);
  if (!C.ADSENSE_PUB) console.log("Note: AdSense not configured yet — ad slot renders as a reserved placeholder. See scripts/enable-adsense.mjs.");
}

main();
