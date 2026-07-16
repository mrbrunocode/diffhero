#!/usr/bin/env node
/**
 * Switch Google AdSense on across the whole site, in the two phases AdSense
 * actually happens in — by setting config values and rebuilding, not by
 * patching HTML (the engine renders the loader/unit off these values).
 *
 *   Phase 1 — application/verification (run the day you apply):
 *       node scripts/enable-adsense.mjs ca-pub-1234567890123456
 *     Sets ADSENSE_PUB → the loader <script> appears in every page's <head>
 *     (how AdSense verifies you own the site) and ads.txt is written. No
 *     visible change: no ad unit renders yet (SLOT still empty).
 *
 *   Phase 2 — after approval, once you've created ONE Display/responsive unit:
 *       node scripts/enable-adsense.mjs ca-pub-1234567890123456 --slot 1234567890
 *     Also sets ADSENSE_SLOT → the live ad unit renders in the reserved slot
 *     below the tool (the vClock-proven single-slot position).
 *
 * Safe to re-run; values are updated in place. Rebuilds the whole site itself.
 * After approval, also enable the EEA/UK consent message in AdSense → Privacy &
 * messaging (required for ads in the UK/EEA; dashboard toggle, no code).
 */
import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ROOT, readConfig, setConst, writeConfig } from "./_config-io.mjs";

const args = process.argv.slice(2);
const pub = args.find((a) => !a.startsWith("--"));
const slotIdx = args.indexOf("--slot");
const slot = slotIdx !== -1 ? args[slotIdx + 1] : null;

if (!pub || !/^ca-pub-\d{16}$/.test(pub)) {
  console.error("Usage: node scripts/enable-adsense.mjs ca-pub-<16 digits> [--slot <digits>]");
  console.error("Publisher ID: AdSense → Account → Account information.");
  process.exit(1);
}
if (slotIdx !== -1 && !/^\d{8,12}$/.test(slot ?? "")) {
  console.error("--slot must be the numeric ad-unit ID from AdSense → Ads → By ad unit.");
  process.exit(1);
}

let src = await readConfig();
src = setConst(src, "ADSENSE_PUB", pub);
if (slot) src = setConst(src, "ADSENSE_SLOT", slot);
await writeConfig(src);

const adsTxt = `google.com, ${pub.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n`;
await writeFile(join(ROOT, "ads.txt"), adsTxt);
console.log(`Set ADSENSE_PUB=${pub}${slot ? `, ADSENSE_SLOT=${slot}` : ""}; wrote ads.txt.`);
if (!slot) console.log("Application phase: loader + ads.txt only. Re-run with --slot after approval to render the live unit.");

execFileSync("node", ["engine/build.mjs"], { cwd: ROOT, stdio: "inherit" });
console.log("\nDone. Commit + push to deploy. Verify one page in the browser first.");
if (slot) console.log("Post-approval: enable the EEA/UK consent message in AdSense → Privacy & messaging.");
