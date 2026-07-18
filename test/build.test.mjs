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
