// Regression tests for the image-diff tool's pure pixel-comparison function
// (assets/app.js) — see test/helpers/load-app.mjs for how it's loaded
// without a DOM/canvas. Uses plain flat RGBA arrays rather than real
// ImageData, since pixelDiff() only ever touches the array, never the canvas.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadDiffEngine } from "./helpers/load-app.mjs";

const { pixelDiff } = loadDiffEngine();

function rgba(...pixels) {
  // pixels: array of [r,g,b,a] tuples -> one flat array
  return pixels.flat();
}

test("identical images: zero pixels differ", () => {
  const a = rgba([10, 20, 30, 255], [0, 0, 0, 255]);
  const b = rgba([10, 20, 30, 255], [0, 0, 0, 255]);
  const r = pixelDiff(a, b, 0);
  assert.equal(r.total, 2);
  assert.equal(r.changed, 0);
  assert.deepEqual(r.diffMask, [false, false]);
});

test("a single differing pixel is detected and localized in the mask", () => {
  const a = rgba([10, 20, 30, 255], [0, 0, 0, 255], [5, 5, 5, 255]);
  const b = rgba([10, 20, 30, 255], [255, 255, 255, 255], [5, 5, 5, 255]);
  const r = pixelDiff(a, b, 0);
  assert.equal(r.changed, 1);
  assert.deepEqual(r.diffMask, [false, true, false]);
});

test("threshold: a small difference under the threshold does not count as changed", () => {
  const a = rgba([100, 100, 100, 255]);
  const b = rgba([105, 100, 100, 255]); // avg channel diff = 5/4 = 1.25
  assert.equal(pixelDiff(a, b, 24).changed, 0); // default sensitivity is 24
  assert.equal(pixelDiff(a, b, 0).changed, 1); // any threshold below the diff still catches it
});

test("threshold: a difference exactly at the boundary is NOT counted (strictly greater-than)", () => {
  // One channel off by 96 -> average diff across 4 channels = 96/4 = 24 exactly.
  const a = rgba([0, 0, 0, 0]);
  const b = rgba([96, 0, 0, 0]);
  assert.equal(pixelDiff(a, b, 24).changed, 0, "diff === threshold should not count");
  assert.equal(pixelDiff(a, b, 23).changed, 1, "diff > threshold should count");
});

test("alpha channel differences count toward the diff same as color channels", () => {
  const a = rgba([0, 0, 0, 255]);
  const b = rgba([0, 0, 0, 0]);
  assert.equal(pixelDiff(a, b, 0).changed, 1);
});

test("all-different images: every pixel is marked changed", () => {
  const a = rgba([0, 0, 0, 255], [0, 0, 0, 255]);
  const b = rgba([255, 255, 255, 255], [255, 255, 255, 255]);
  const r = pixelDiff(a, b, 0);
  assert.equal(r.changed, 2);
  assert.equal(r.total, 2);
  assert.deepEqual(r.diffMask, [true, true]);
});

test("empty input: total and changed are both zero, no crash", () => {
  const r = pixelDiff([], [], 0);
  assert.equal(r.total, 0);
  assert.equal(r.changed, 0);
  assert.deepEqual(r.diffMask, []);
});
