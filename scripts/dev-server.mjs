#!/usr/bin/env node
/**
 * Minimal static file server for local preview, no dependencies.
 *
 * Why this exists instead of `python3 -m http.server`: that server sends no
 * Cache-Control header, so browsers apply heuristic caching and silently
 * keep serving stale CSS/JS after an edit — confusing during active
 * development. This server always sends `Cache-Control: no-store` so every
 * reload reflects the current files on disk. Not meant for production
 * (Cloudflare Pages handles real caching/deploys) — local preview only.
 *
 * Usage:
 *     node scripts/dev-server.mjs [port]   (default port 4173)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = Number(process.argv[2]) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (path.endsWith("/")) path += "index.html";
    let filePath = join(ROOT, path);

    let st;
    try {
      st = await stat(filePath);
      if (st.isDirectory()) { filePath = join(filePath, "index.html"); st = await stat(filePath); }
    } catch {
      // Clean-URL resolution, matching Cloudflare Pages: /about serves
      // about.html (Pages actually 308s .html → extensionless; locally we
      // just serve the file so extensionless internal links work in dev).
      if (!extname(filePath)) {
        try {
          st = await stat(filePath + ".html");
          filePath += ".html";
        } catch { /* fall through to 404 */ }
      }
      if (!st) {
        res.writeHead(404, { "Content-Type": "text/plain", "Cache-Control": "no-store" });
        res.end("404 Not Found: " + path);
        return;
      }
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain", "Cache-Control": "no-store" });
    res.end("500 Internal Server Error: " + err.message);
  }
});

server.listen(PORT, () => console.log(`Dev server (no-cache) running at http://localhost:${PORT}/`));
