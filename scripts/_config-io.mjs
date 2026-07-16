/**
 * Tiny shared helper: read/patch exported string constants in site.config.mjs.
 *
 * Because every page is GENERATED from site.config.mjs, changing a value here
 * and rebuilding propagates it everywhere — no HTML files to hand-patch. This
 * is the big simplification over the CountLink build, where a rename or an
 * AdSense switch had to regex-patch each hand-written page's <head> separately.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const CONFIG_PATH = join(ROOT, "site.config.mjs");

export async function readConfig() {
  return readFile(CONFIG_PATH, "utf8");
}

/** Set `export const KEY = "value";` in the config text. Throws if KEY absent. */
export function setConst(src, key, value) {
  const re = new RegExp(`(export const ${key} = )"[^"]*"(;)`);
  if (!re.test(src)) throw new Error(`Could not find "export const ${key}" in site.config.mjs`);
  return src.replace(re, `$1${JSON.stringify(value)}$2`);
}

export async function writeConfig(src) {
  await writeFile(CONFIG_PATH, src, "utf8");
}
