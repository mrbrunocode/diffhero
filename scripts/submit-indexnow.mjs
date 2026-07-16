#!/usr/bin/env node
/**
 * Submits every URL in sitemap.xml to IndexNow — a real, open protocol
 * (backed by Microsoft Bing, Yandex, Seznam, Naver) that tells search
 * engines a page is new/changed so they prioritize crawling it. One POST
 * reaches all participating engines at once. Google does not participate
 * in IndexNow (they have their own Search Console-based path — see
 * docs/seo-outreach-plan.md).
 *
 * This is the one part of SEO outreach that is 100% legitimately
 * automatable: it's a documented API meant to be called by scripts,
 * with no ToS ambiguity and no CAPTCHA/human-review step.
 *
 * Prerequisites:
 *   - The site must already be deployed at its real domain (this only
 *     works once SITE_URL in site.config.mjs is the real,
 *     live domain — IndexNow verifies ownership by fetching the key file
 *     from that domain, so it's meaningless against countlink.app).
 *   - Run once with no key file present to generate one (writes
 *     <key>.txt to the repo root — that file must be deployed as-is,
 *     it's how IndexNow verifies you own the domain).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs           # generate key if needed, submit all sitemap URLs
 *   node scripts/submit-indexnow.mjs --dry-run  # show what would be submitted, no network call
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DRY_RUN = process.argv.includes("--dry-run");

function makeKey() {
  return randomBytes(16).toString("hex"); // 32 chars, well within the 8-128 allowed range
}

async function findExistingKeyFile() {
  const files = await readdir(ROOT);
  const match = files.find(f => /^[a-f0-9]{32}\.txt$/.test(f));
  return match || null;
}

async function getOrCreateKey() {
  const existing = await findExistingKeyFile();
  if (existing) return existing.replace(".txt", "");
  const key = makeKey();
  await writeFile(join(ROOT, `${key}.txt`), key, "utf-8");
  console.log(`Generated new IndexNow key: ${key}`);
  console.log(`Wrote ${key}.txt to the repo root — deploy this file as-is (it must be reachable at https://yourdomain/${key}.txt).`);
  return key;
}

async function urlsFromSitemap() {
  const xml = await readFile(join(ROOT, "sitemap.xml"), "utf-8");
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  return urls;
}

async function main() {
  const urls = await urlsFromSitemap();
  if (urls.length === 0) {
    console.error("No URLs found in sitemap.xml — run engine/build.mjs first.");
    process.exit(1);
  }
  const host = new URL(urls[0]).host;
  if (host.endsWith(".example")) {
    console.error(`sitemap.xml still points at a placeholder domain (${host}).`);
    console.error("Update SITE_URL in site.config.mjs (or run rename-brand.mjs) to the real domain, then re-run this script.");
    process.exit(1);
  }
  const key = await getOrCreateKey();
  const payload = { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls };

  console.log(`Host: ${host}`);
  console.log(`URLs to submit (${urls.length}):`);
  for (const u of urls) console.log("  -", u);

  if (DRY_RUN) {
    console.log("\n--dry-run: no request sent.");
    return;
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  console.log(`\nIndexNow responded: ${res.status} ${res.statusText}`);
  if (res.status === 200 || res.status === 202) {
    console.log("Accepted. This reaches Bing, Yandex, Seznam and Naver — not Google (see docs/seo-outreach-plan.md for the Google path).");
  } else {
    console.log(await res.text());
  }
}

main();
