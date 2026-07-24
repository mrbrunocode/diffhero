/**
 * Per-page `dateModified`, driven by the content itself.
 *
 * WHY NOT just use the build date: bumping dateModified on every build is
 * "content churn for freshness signals" — an antipattern Google's own
 * helpful-content guidance calls out, and a claim that isn't true (nothing
 * changed; a script ran). WHY NOT leave it frozen at a hand-bumped constant:
 * that's the opposite lie, and it means a genuinely rewritten page still
 * advertises a stale date.
 *
 * So: hash each page's content-bearing fields and keep a committed manifest of
 * hash -> date. If the hash is unchanged since the last build, the stored date
 * is reused verbatim. If it changed (or the page is new), today's date is
 * recorded. The date then means exactly what it says — the last time the
 * content actually changed — and it updates with no one having to remember.
 *
 * The manifest is committed on purpose: it's the memory of when each page last
 * changed. Deleting it makes every page look edited today.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

export function makeDateTracker(manifestPath, today) {
  const stored = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf-8"))
    : {};
  // Only keys seen during this build are written back, so entries for deleted
  // pages get pruned instead of accumulating forever.
  const current = {};

  /**
   * @param {string} key   stable page identifier (slug or path)
   * @param {unknown} content  the content-bearing fields; anything
   *   JSON-serialisable. Must NOT include the date itself, or the hash
   *   changes every time the date does and the page never settles.
   */
  function dateFor(key, content) {
    const hash = createHash("sha256")
      .update(JSON.stringify(content))
      .digest("hex")
      .slice(0, 16);
    const prev = stored[key];
    const date = prev && prev.hash === hash ? prev.date : today;
    current[key] = { hash, date };
    return date;
  }

  function save() {
    const ordered = Object.fromEntries(
      Object.keys(current).sort().map((k) => [k, current[k]]),
    );
    writeFileSync(manifestPath, JSON.stringify(ordered, null, 2) + "\n");
    const changed = Object.keys(current).filter(
      (k) => !stored[k] || stored[k].hash !== current[k].hash,
    );
    return { total: Object.keys(current).length, changed };
  }

  return { dateFor, save };
}
