// assets/app.js is a classic (non-module) browser script, and this package
// is "type": "module", so it can't be `import`ed or `require()`d directly.
// Wrap its source in a CJS function shell instead — the same trick Node
// itself uses to load CommonJS files — so its own `module.exports` shim
// (see the top of app.js) populates a real module object we can inspect.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appJsPath = join(__dirname, "..", "..", "assets", "app.js");

export function loadDiffEngine() {
  const src = readFileSync(appJsPath, "utf8");
  const mod = { exports: {} };
  const fn = new Function("module", "exports", "require", "__filename", "__dirname", src);
  fn(mod, mod.exports, createRequire(import.meta.url), appJsPath, dirname(appJsPath));
  return mod.exports;
}
