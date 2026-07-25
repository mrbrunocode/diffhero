// Regression tests for the actual shipped diff engine (assets/app.js), not a
// reimplementation — see test/load-app.mjs for how it's loaded without a DOM.
// These run under default options (no ignore-whitespace/case, word-level not
// character-level), since option checkboxes aren't available outside a page.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadDiffEngine } from "./helpers/load-app.mjs";

const engine = loadDiffEngine();

test("engine exports the expected pure functions", () => {
  for (const name of ["normalize", "lineKey", "lcs", "tokenMarks", "buildRows", "toUnifiedDiff", "parseUnifiedDiff", "prepPair"]) {
    assert.equal(typeof engine[name], "function", `expected ${name} to be exported`);
  }
});

test("normalize collapses CRLF and lone CR to LF", () => {
  assert.equal(engine.normalize("a\r\nb\rc\nd"), "a\nb\nc\nd");
});

test("lcs finds no-op diff for identical arrays", () => {
  const ops = engine.lcs(["a", "b", "c"], ["a", "b", "c"]);
  assert.deepEqual(ops.map((o) => o.t), [" ", " ", " "]);
});

test("lcs detects a single substitution as delete+insert", () => {
  const ops = engine.lcs(["a", "b", "c"], ["a", "x", "c"]);
  assert.deepEqual(ops.map((o) => o.t), [" ", "-", "+", " "]);
});

test("lcs detects a pure insertion", () => {
  const ops = engine.lcs(["a", "c"], ["a", "b", "c"]);
  assert.deepEqual(ops.map((o) => o.t), [" ", "+", " "]);
});

test("lcs detects a pure deletion", () => {
  const ops = engine.lcs(["a", "b", "c"], ["a", "c"]);
  assert.deepEqual(ops.map((o) => o.t), [" ", "-", " "]);
});

test("lcs bails out (returns null) above the size guard instead of hanging", () => {
  // n*m > 8,000,000 short-circuits rather than running an O(n*m) DP table.
  const big = new Array(3000).fill("x");
  assert.equal(engine.lcs(big, big.concat("y")), null);
});

test("buildRows: identical files produce only 'same' rows", () => {
  const rows = engine.buildRows(["one", "two", "three"], ["one", "two", "three"]);
  assert.equal(rows.length, 3);
  assert.ok(rows.every((r) => r.type === "same"));
});

test("buildRows: a changed middle line becomes a 'mod' row with word marks", () => {
  const rows = engine.buildRows(
    ["line one", "line two", "line three"],
    ["line one", "line TWO", "line three"]
  );
  assert.equal(rows.length, 3);
  assert.equal(rows[0].type, "same");
  assert.equal(rows[1].type, "mod");
  assert.equal(rows[2].type, "same");
  // word-level marks should isolate the changed word, not the whole line
  assert.ok(rows[1].dMarks.length > 0);
  assert.ok(rows[1].aMarks.length > 0);
});

test("buildRows: an appended line becomes a trailing 'add' row", () => {
  const rows = engine.buildRows(["a", "b"], ["a", "b", "c"]);
  assert.equal(rows.length, 3);
  assert.equal(rows[2].type, "add");
  assert.equal(rows[2].line, "c");
});

test("buildRows: common prefix/suffix trimming still numbers lines correctly", () => {
  const rows = engine.buildRows(
    ["same1", "same2", "old", "same3"],
    ["same1", "same2", "new", "same3"]
  );
  assert.deepEqual(
    rows.map((r) => [r.type, r.an, r.bn]),
    [["same", 1, 1], ["same", 2, 2], ["mod", 3, 3], ["same", 4, 4]]
  );
});

test("tokenMarks isolates the single changed word between two lines", () => {
  const marks = engine.tokenMarks("the quick fox", "the slow fox");
  // "quick" -> "slow" is the only change; both del/add ranges should be non-empty
  // and strictly inside the full string length (not "whole line changed").
  assert.ok(marks.del.length >= 1);
  assert.ok(marks.add.length >= 1);
  const fullLen = "the quick fox".length;
  assert.ok(marks.del.some(([s, e]) => e - s < fullLen));
});

test("toUnifiedDiff produces empty string for a no-change diff", () => {
  const rows = engine.buildRows(["a", "b"], ["a", "b"]);
  assert.equal(engine.toUnifiedDiff(rows, 3), "");
});

test("toUnifiedDiff includes a hunk header and +/- lines for a real change", () => {
  const rows = engine.buildRows(["a", "b", "c"], ["a", "B", "c"]);
  const patch = engine.toUnifiedDiff(rows, 3);
  assert.match(patch, /^--- original\n\+\+\+ changed\n/);
  assert.match(patch, /^@@ /m);
  assert.match(patch, /^-b$/m);
  assert.match(patch, /^\+B$/m);
});

test("parseUnifiedDiff extracts original/changed from a single-file unified diff", () => {
  const diff = [
    "diff --git a/foo.js b/foo.js",
    "index abc123..def456 100644",
    "--- a/foo.js",
    "+++ b/foo.js",
    "@@ -1,3 +1,3 @@",
    " unchanged1",
    "-old line",
    "+new line",
    " unchanged2",
    "",
  ].join("\n");
  const result = engine.parseUnifiedDiff(diff);
  assert.equal(result.original, "unchanged1\nold line\nunchanged2\n");
  assert.equal(result.changed, "unchanged1\nnew line\nunchanged2\n");
  assert.equal(result.multiFile, false);
});

test("parseUnifiedDiff throws when there's no @@ hunk header", () => {
  assert.throws(() => engine.parseUnifiedDiff("this is not a diff at all"), /No @@ hunk header/);
});

test("parseUnifiedDiff stops at a second file's header instead of splicing its lines onto the first file", () => {
  const diff = [
    "diff --git a/foo.js b/foo.js",
    "--- a/foo.js",
    "+++ b/foo.js",
    "@@ -1,2 +1,2 @@",
    "-old foo line",
    "+new foo line",
    " unchanged foo",
    "diff --git a/bar.js b/bar.js",
    "--- a/bar.js",
    "+++ b/bar.js",
    "@@ -1,2 +1,2 @@",
    "-old bar line",
    "+new bar line",
    " unchanged bar",
    "",
  ].join("\n");
  const result = engine.parseUnifiedDiff(diff);
  assert.equal(result.multiFile, true);
  // only foo.js's lines should appear — bar.js's must not be spliced on
  assert.equal(result.original, "old foo line\nunchanged foo");
  assert.equal(result.changed, "new foo line\nunchanged foo");
  assert.ok(!result.original.includes("bar"));
  assert.ok(!result.changed.includes("bar"));
});

test("prepPair passes text through unchanged when format isn't json", () => {
  const result = engine.prepPair("text", "raw a", "raw b");
  assert.deepEqual(result, { a: "raw a", b: "raw b", fallback: false });
});

test("prepPair pretty-prints both sides when both are valid json", () => {
  const result = engine.prepPair("json", '{"b":2,"a":1}', '{"a": 1}');
  assert.equal(result.fallback, false);
  assert.equal(result.a, JSON.stringify({ b: 2, a: 1 }, null, 2));
  assert.equal(result.b, JSON.stringify({ a: 1 }, null, 2));
});

test("prepPair leaves BOTH sides as raw text if either fails to parse (no asymmetric reformatting)", () => {
  const result = engine.prepPair("json", '{"a":1}', "not json at all");
  assert.equal(result.fallback, true);
  // the valid side must stay as originally typed, not silently pretty-printed
  // against the other side's untouched raw text
  assert.equal(result.a, '{"a":1}');
  assert.equal(result.b, "not json at all");
});

// Regression: tokenMarks' character-detail mode used to index delStr[i]/
// addStr[i] directly — UTF-16 code UNITS, not code points. Any astral
// character (most emoji, some CJK Extension B+, math alphanumeric symbols)
// is stored as a surrogate PAIR, so that indexing split it into two invalid,
// individually meaningless lone-surrogate "characters", each diffed
// separately. codePointTokens (what character-detail mode now uses) fixes
// this by iterating with `for...of`, which yields whole code points.
test("codePointTokens keeps an astral character (surrogate pair) as one token, not two", () => {
  const tokens = engine.codePointTokens("a🎉b");
  assert.equal(tokens.length, 3, "🎉 must be ONE token, not two lone surrogates");
  assert.equal(tokens[0].x, "a");
  assert.equal(tokens[1].x, "🎉");
  assert.equal(tokens[2].x, "b");
});

test("codePointTokens produces no lone surrogate as its own token", () => {
  const tokens = engine.codePointTokens("👍🎉😀");
  for (const t of tokens) {
    const cc = t.x.charCodeAt(0);
    const isLoneHighSurrogate = cc >= 0xd800 && cc <= 0xdbff && t.x.length === 1;
    assert.ok(!isLoneHighSurrogate, `token "${t.x}" is an invalid lone surrogate`);
  }
});

test("codePointTokens keeps s/e offsets in UTF-16 units, so slicing the original string still works", () => {
  const tokens = engine.codePointTokens("a🎉b");
  // 🎉 is 2 UTF-16 units, so "b" must start at offset 3, not 2.
  assert.deepEqual(tokens.map((t) => [t.s, t.e]), [[0, 1], [1, 3], [3, 4]]);
  for (const t of tokens) assert.equal("a🎉b".slice(t.s, t.e), t.x);
});

test("tokenMarks itself still isolates a plain-ASCII word change correctly (word-level path unaffected)", () => {
  // Guards against the codePointTokens refactor having broken the (separate,
  // unchanged) word-level branch that runs when character-detail is off.
  const marks = engine.tokenMarks("the quick fox", "the slow fox");
  assert.ok(marks.del.length >= 1 && marks.add.length >= 1);
});
