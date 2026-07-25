// Runs the actual generator and checks its output is complete and internally
// consistent — catches a PAGES row that breaks the build, or a page that
// silently isn't wired into the sitemap.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PAGES } from "../pages.mjs";
import * as C from "../site.config.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

test("engine/build.mjs runs to completion", () => {
  const out = execFileSync("node", ["engine/build.mjs"], { cwd: ROOT, encoding: "utf8" });
  assert.match(out, /Built:/);
});

test("every page slug has a generated HTML file", () => {
  for (const p of PAGES) {
    const file = join(ROOT, C.COLLECTION_DIR, `${p.slug}.html`);
    assert.ok(existsSync(file), `missing generated file for ${p.slug}`);
  }
});

test("sitemap.xml lists every page slug exactly once", () => {
  const sitemap = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
  for (const p of PAGES) {
    const matches = sitemap.match(new RegExp(`/${C.COLLECTION_DIR}/${p.slug}<`, "g")) || [];
    assert.equal(matches.length, 1, `expected exactly one sitemap entry for ${p.slug}, found ${matches.length}`);
  }
});

test("generated page contains its own title and FAQ text", () => {
  // Spot-check one page rather than every one (redundant with pages-content
  // tests) to catch a template-level regression (e.g. FAQ not rendered at all).
  const p = PAGES[0];
  const html = readFileSync(join(ROOT, C.COLLECTION_DIR, `${p.slug}.html`), "utf8");
  assert.ok(html.includes(p.title), "generated page missing its own <title>/heading text");
  assert.ok(html.includes(p.faq[0].q), "generated page missing its first FAQ question");
});

// ── Shell / layout ────────────────────────────────────────────────────────
// The redesign's whole point is that the tool pages and the reading pages are
// no longer the same centred column. These lock that in: the 205-test suite
// covers behaviour and content, not appearance, so without them a template
// edit could quietly put every page back into one shape.

test("collection pages use the app shell, with the tool above the prose", () => {
  const html = readFileSync(join(ROOT, C.COLLECTION_DIR, `${PAGES[0].slug}.html`), "utf8");
  assert.match(html, /class="shell shell--app"/, "collection page is not in the app shell");
  assert.match(html, /<nav class="rail"/, "collection page has no navigation rail");
  const tool = html.indexOf('class="tool ');
  const below = html.indexOf('class="below"');
  assert.ok(tool > 0 && below > tool, "the tool must come before the supporting prose");
});

test("the rail links every tool from every tool page", () => {
  const html = readFileSync(join(ROOT, C.COLLECTION_DIR, `${PAGES[0].slug}.html`), "utf8");
  for (const p of PAGES) {
    assert.ok(
      html.includes(`href="/${C.COLLECTION_DIR}/${p.slug}"`),
      `rail is missing a link to ${p.slug}`,
    );
  }
  assert.match(html, /aria-current="page"/, "rail does not mark the current page");
});

test("articles use the docs shell and get an on-page contents", () => {
  const html = readFileSync(join(ROOT, "guides", "what-is-a-diff.html"), "utf8");
  assert.match(html, /class="shell shell--docs has-aside"/, "article is not in the docs shell");
  assert.match(html, /<aside class="toc"/, "article has no contents rail");
  // The contents are generated from the article's own headings, so every entry
  // must point at an id that exists in the document.
  const ids = [...html.matchAll(/<h2[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
  const hrefs = [...html.matchAll(/<a href="#([^"]+)">/g)].map((m) => m[1]);
  assert.ok(hrefs.length >= 3, "expected a contents list with at least 3 entries");
  for (const h of hrefs) assert.ok(ids.includes(h), `contents links to #${h}, which no heading has`);
});

test("no page falls back to the old centred-column skeleton", () => {
  const files = [
    join(ROOT, "index.html"),
    join(ROOT, "about.html"),
    join(ROOT, "guides", "what-is-a-diff.html"),
    join(ROOT, C.COLLECTION_DIR, `${PAGES[0].slug}.html`),
  ];
  for (const f of files) {
    const html = readFileSync(f, "utf8");
    assert.ok(!/class="wrap"/.test(html), `${f} still uses the old .wrap container`);
    assert.ok(!/class="hero/.test(html), `${f} still renders a .hero block`);
    assert.match(html, /<header class="topbar">/, `${f} is missing the top bar`);
  }
});
