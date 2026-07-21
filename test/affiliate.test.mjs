// Regression tests for the affiliate recommendation card (engine/template.mjs).
// Two invariants: (1) never renders real content until AFFILIATE_NAME/URL/BLURB
// are actually configured in site.config.mjs — no dead link going live by
// accident — and (2) once configured, the markup is well-formed and carries
// rel="sponsored" per Google's guidance for paid/affiliate links.
import { test } from "node:test";
import assert from "node:assert/strict";
import { affiliateSlot } from "../engine/template.mjs";

const CONFIGURED = { name: "NordVPN", url: "https://nordvpn.com/", blurb: "Keep your browsing private too." };
const EMPTY = { name: "", url: "", blurb: "" };

test("renders nothing when config is empty (current real site.config.mjs state)", () => {
  assert.equal(affiliateSlot(EMPTY), "");
});

test("renders nothing if only some of the three config values are set", () => {
  assert.equal(affiliateSlot({ name: "NordVPN", url: "", blurb: "x" }), "");
  assert.equal(affiliateSlot({ name: "", url: "https://x.com", blurb: "x" }), "");
  assert.equal(affiliateSlot({ name: "NordVPN", url: "https://x.com", blurb: "" }), "");
});

test("renders the card when fully configured", () => {
  const html = affiliateSlot(CONFIGURED);
  assert.match(html, /Sponsored/);
  assert.match(html, /NordVPN/);
  assert.match(html, /href="https:\/\/nordvpn\.com\/"/);
  assert.match(html, /rel="sponsored noopener"/);
});

test("blurb text is HTML-escaped (defense against config containing special characters)", () => {
  const html = affiliateSlot({ name: "A & B", url: "https://x.com", blurb: "Use <this> & that" });
  assert.doesNotMatch(html, /<this>/);
  assert.match(html, /&lt;this&gt;/);
  assert.match(html, /A &amp; B/);
});

test("calling with no argument at all falls back to the real site.config.mjs values without throwing", () => {
  assert.doesNotThrow(() => affiliateSlot());
});
