// Content-integrity checks for the programmatic-SEO page collection.
// Duplicated title/description/intro text across pages is the #1 reason
// these pages get filtered from Google's index instead of ranked (see
// boring-app-factory/docs/seo-manual-steps.md) — these tests catch that
// regression class, plus basic structural mistakes (bad slugs, missing FAQ).
import { test } from "node:test";
import assert from "node:assert/strict";
import { PAGES } from "../pages.mjs";
import { GUIDES } from "../guides.mjs";

test("every page has a unique slug", () => {
  const slugs = PAGES.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug found");
});

test("every slug is URL-safe (lowercase, digits, hyphens only)", () => {
  for (const p of PAGES) {
    assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug: ${p.slug}`);
  }
});

test("titles are unique across the collection", () => {
  const titles = PAGES.map((p) => p.title);
  assert.equal(new Set(titles).size, titles.length, "duplicate title found");
});

test("descriptions are unique across the collection", () => {
  const descriptions = PAGES.map((p) => p.description);
  assert.equal(new Set(descriptions).size, descriptions.length, "duplicate description found");
});

test("intros are unique across the collection", () => {
  const intros = PAGES.map((p) => p.intro);
  assert.equal(new Set(intros).size, intros.length, "duplicate intro found");
});

test("every page has a substantial, unique guide section", () => {
  // The AdSense "low value content" fix: each page must carry its own guide
  // block (unique supporting prose), not just the tool + a short intro + FAQ.
  const seen = new Map();
  for (const p of PAGES) {
    const g = p.extra || GUIDES[p.slug];
    assert.ok(g && g.trim().length > 0, `${p.slug} is missing guide/extra content`);
    // Rough floor on real text length (markup stripped) so a stub can't pass.
    const textLen = g.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
    assert.ok(textLen > 400, `${p.slug} guide is too thin (${textLen} chars of text)`);
    assert.ok(!seen.has(g), `${p.slug} shares guide content with ${seen.get(g)}`);
    seen.set(g, p.slug);
  }
});

test("every page has a non-empty FAQ with 2+ entries", () => {
  for (const p of PAGES) {
    assert.ok(Array.isArray(p.faq) && p.faq.length >= 2, `${p.slug} needs at least 2 FAQ entries`);
    for (const { q, a } of p.faq) {
      assert.ok(q && q.trim().length > 0, `${p.slug} has an empty FAQ question`);
      assert.ok(a && a.trim().length > 0, `${p.slug} has an empty FAQ answer`);
    }
  }
});

test("format is either 'text' or 'json'", () => {
  for (const p of PAGES) {
    const format = p.format || "text";
    assert.ok(["text", "json"].includes(format), `${p.slug} has unrecognized format: ${format}`);
  }
});

test("description stays within a reasonable meta-description length", () => {
  for (const p of PAGES) {
    assert.ok(p.description.length <= 200, `${p.slug} description is ${p.description.length} chars, too long for a meta description`);
  }
});
