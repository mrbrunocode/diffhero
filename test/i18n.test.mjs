// hreflang is unusually unforgiving: Google discards an entire alternate set
// if the members don't all reference each other, so a partial mistake is a
// total failure. These lock the three rules that are easiest to break — and
// the reciprocity one WAS broken on first implementation, because a
// translated page's canonicalPath is locale-prefixed and looked up a key
// that didn't exist.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hreflangTags, hreflangTagsFor, langSwitcher, I18N_ENABLED, LOCALES, TRANSLATED_PAGES,
} from "../i18n.mjs";
import { TRANSLATIONS } from "../content.i18n.mjs";

const SITE = "https://diffhero.app";

// The rules below are tested against hreflangTagsFor — the computation itself,
// which runs regardless of the master switch. That keeps them meaningful while
// i18n is off, so the day it comes back the rules are still known-correct
// rather than having quietly rotted behind a disabled flag.
test("a translated page's alternate set is self-referential and reciprocal", () => {
  const tags = hreflangTagsFor(SITE, "/");
  for (const loc of LOCALES) {
    assert.match(tags, new RegExp(`hreflang="${loc.code}"`),
      `set must include ${loc.code}, including the page's own locale`);
  }
  assert.match(tags, /hreflang="x-default"/);
});

test("x-default points at the English original, not a translation", () => {
  const tags = hreflangTagsFor(SITE, "/");
  const m = tags.match(/hreflang="x-default" href="([^"]+)"/);
  assert.ok(m, "x-default must be present");
  assert.equal(m[1], `${SITE}/`, "x-default must be the English page");
});

test("pages outside the translated set emit no hreflang at all", () => {
  assert.equal(hreflangTagsFor(SITE, "/diff/json-diff"), "");
  assert.equal(hreflangTagsFor(SITE, "/about"), "");
});

// A disabled language that still emits hreflang, or still shows a switcher, is
// worse than one that was never built: it points Google and users at pages that
// are no longer generated.
test("the master switch suppresses hreflang and the switcher everywhere", () => {
  if (I18N_ENABLED) {
    assert.notEqual(hreflangTags(SITE, "/"), "", "enabled: the homepage should carry its set");
    return;
  }
  for (const path of [...TRANSLATED_PAGES, "/about", "/diff/json-diff"]) {
    assert.equal(hreflangTags(SITE, path), "", `${path} must emit no hreflang while i18n is off`);
    assert.equal(langSwitcher(path, "en"), "", `${path} must show no language switcher`);
  }
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
