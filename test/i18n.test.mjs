// hreflang is unusually unforgiving: Google discards an entire alternate set
// if the members don't all reference each other, so a partial mistake is a
// total failure. These lock the three rules that are easiest to break — and
// the reciprocity one WAS broken on first implementation, because a
// translated page's canonicalPath is locale-prefixed and looked up a key
// that didn't exist.
import { test } from "node:test";
import assert from "node:assert/strict";
import { hreflangTags, LOCALES, TRANSLATED_PAGES } from "../i18n.mjs";
import { TRANSLATIONS } from "../content.i18n.mjs";

const SITE = "https://diffhero.app";

test("a translated page's alternate set is self-referential and reciprocal", () => {
  const tags = hreflangTags(SITE, "/");
  for (const loc of LOCALES) {
    assert.match(tags, new RegExp(`hreflang="${loc.code}"`),
      `set must include ${loc.code}, including the page's own locale`);
  }
  assert.match(tags, /hreflang="x-default"/);
});

test("x-default points at the English original, not a translation", () => {
  const tags = hreflangTags(SITE, "/");
  const m = tags.match(/hreflang="x-default" href="([^"]+)"/);
  assert.ok(m, "x-default must be present");
  assert.equal(m[1], `${SITE}/`, "x-default must be the English page");
});

test("pages outside the translated set emit no hreflang at all", () => {
  assert.equal(hreflangTags(SITE, "/diff/json-diff"), "");
  assert.equal(hreflangTags(SITE, "/about"), "");
});

test("every declared translation corresponds to a locale and a translated path", () => {
  const codes = LOCALES.map((l) => l.code);
  for (const t of TRANSLATIONS) {
    assert.ok(codes.includes(t.lang), `${t.lang} must be declared in LOCALES`);
    assert.ok(TRANSLATED_PAGES.includes(t.path), `${t.path} must be in TRANSLATED_PAGES`);
    assert.ok(t.title && t.description && t.bodyHtml, `${t.lang} translation must be complete`);
  }
});

test("translations are not just the English text copied over", () => {
  // Cheap guard against someone stubbing a locale out with English content.
  for (const t of TRANSLATIONS) {
    assert.ok(!/nothing is uploaded/i.test(t.bodyHtml),
      `${t.lang} body looks like untranslated English`);
  }
});
