// Regression tests for the actual shipped diff engine (assets/app.js), not a
// reimplementation — see test/load-app.mjs for how it's loaded without a DOM.
// These run under default options (no ignore-whitespace/case, word-level not
// character-level), since option checkboxes aren't available outside a page.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadDiffEngine } from "./helpers/load-app.mjs";

const engine = loadDiffEngine();

test("engine exports the expected pure functions", () => {
  for (const name of ["normalize", "lineKey", "lcs", "tokenMarks", "buildRows", "toUnifiedDiff"]) {
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
