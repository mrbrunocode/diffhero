/**
 * Hand-written prose pages: home, about, privacy, terms, contact.
 * The engine wraps each bodyHtml in the shared shell; all brand/domain/email
 * values interpolate from site.config.mjs so a rename updates them everywhere.
 */
import * as C from "./site.config.mjs";
import { renderTool } from "./pages.mjs";

const HOME_HOWTO = [
  "Paste or type the original version into the left box (or drag a file onto it).",
  "Paste the changed version into the right box.",
  "See the result instantly: additions in green, deletions in red, and the exact changed words highlighted inline.",
  "Switch between Split and Unified view, jump between changes with the arrows, or download a .diff.",
];

export const home = {
  title: `${C.NAME} — Free Online Diff Checker for Text & Code`,
  description: C.DESCRIPTION,
  bodyHtml: `
  <section class="hero hero--home">
    <span class="badge"><span class="dot" aria-hidden="true"></span>Runs entirely in your browser — nothing uploaded</span>
    <h1>${C.NAME}</h1>
    <p class="lede">${C.DESCRIPTION}</p>
  </section>
  ${renderTool({ format: "text" })}

  <section class="feature-grid" aria-label="Features">
    <div class="feature"><span class="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5"/></svg></span><h3>Word-level highlighting</h3><p>Not just which lines changed — the exact words inside a changed line are marked, so you see the real edit at a glance.</p></div>
    <div class="feature"><span class="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/></svg></span><h3>Split &amp; unified views</h3><p>Compare side by side with line numbers, or switch to a single unified column. Your choice is remembered.</p></div>
    <div class="feature"><span class="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span><h3>Nothing is uploaded</h3><p>Every comparison runs in your browser. Your text and code never touch a server, so it's safe for private files and works offline.</p></div>
    <div class="feature"><span class="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg></span><h3>Free, no signup, no limits</h3><p>No account, no daily cap, no paywall. Open the page and compare — every feature is free, immediately.</p></div>
    <div class="feature"><span class="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4c-2 0-3 1-3 3v2.5c0 1-1 2-2 2.5 1 .5 2 1.5 2 2.5V17c0 2 1 3 3 3"/><path d="M15 4c2 0 3 1 3 3v2.5c0 1 1 2 2 2.5-1 .5-2 1.5-2 2.5V17c0 2-1 3-3 3"/></svg></span><h3>Formatting-aware JSON</h3><p>On the JSON page, both sides are normalised first, so a minified and a pretty-printed file with the same data read as identical.</p></div>
    <div class="feature"><span class="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 10.7l7.4-3.4M8.3 13.3l7.4 3.4"/></svg></span><h3>Share &amp; export</h3><p>Copy a link that reopens the same comparison, or download a standard unified <code>.diff</code> patch.</p></div>
  </section>

  <section class="howto">
    <h2>How to compare two files with ${C.NAME}</h2>
    <ol>
      ${HOME_HOWTO.map((s) => `<li>${s}</li>`).join("\n      ")}
    </ol>
  </section>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to compare two files with ${C.NAME}`,
    step: HOME_HOWTO.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
  })}</script>`,
};

export const about = {
  path: "/about",
  title: `About ${C.NAME}`,
  description: `What ${C.NAME} is, who makes it, and why it's free.`,
  bodyHtml: `
  <section class="prose">
    <h1>About ${C.NAME}</h1>
    <p>${C.NAME} is a small, single-purpose tool: paste two versions of any text or code and instantly see what changed — every added, removed and altered line, with the exact changed words highlighted inline.</p>
    <p>It's deliberately simple. There's no account to make, nothing to install, and no data to hand over — the whole comparison runs in your browser, so your text and code never touch a server. That also means it works offline once the page has loaded, and it's safe to paste things you couldn't upload to someone else's site.</p>
    <p>Why another diff checker? Because the popular ones wall the good parts behind signups, daily limits or a paywall. ${C.NAME} keeps the useful features — word-level highlighting, split and unified views, file drag-and-drop, shareable links and <code>.diff</code> export — genuinely free, with nothing uploaded.</p>
    <p>It stays free by showing a single, unobtrusive ad, and nothing more. Found a bug or want a feature? <a href="/contact">Get in touch</a>.</p>
  </section>`,
};

export const privacy = {
  path: "/privacy",
  title: `Privacy Policy — ${C.NAME}`,
  description: `How ${C.NAME} handles your data (short version: it stays in your browser).`,
  bodyHtml: `
  <section class="prose">
    <h1>Privacy policy</h1>
    <p class="muted">Last updated: ${C.LAST_UPDATED}</p>

    <h2>The short version</h2>
    <p>Whatever you paste into ${C.NAME} is compared entirely in your own browser. It is never uploaded, stored, or sent to us. Close the tab and it's gone.</p>

    <h2>What we collect</h2>
    <p><strong>Your text and code: nothing.</strong> The diff runs client-side; your content never reaches a server we control. A share link, if you choose to create one, encodes your two inputs into the URL itself — it is not stored by us. Files you drag in are read locally in your browser and never uploaded.</p>
    <p><strong>Analytics:</strong> ${C.GA_ID
      ? `We use Google Analytics to understand aggregate, anonymous usage (pages viewed, rough country, device type). It does not see the text you compare.`
      : `We do not currently run analytics.`}</p>
    <p><strong>Advertising:</strong> ${C.ADSENSE_PUB
      ? `We show ads via Google AdSense. Google and its partners may use cookies to serve ads based on your prior visits to this and other sites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" rel="noopener" target="_blank">Google Ads Settings</a>. Visitors in the EEA/UK are shown a consent choice before any personalized ads load.`
      : `We do not currently show ads.`}</p>

    <h2>Cookies</h2>
    <p>${C.ADSENSE_PUB || C.GA_ID
      ? `Third-party cookies may be set by Google (for the services named above). The tool itself sets no tracking cookies of its own; any preferences (like light/dark theme or your split/unified choice) are stored locally in your browser and never transmitted.`
      : `The tool sets no tracking cookies. Any preferences (like light/dark theme or your split/unified choice) are stored locally in your browser and never transmitted.`}</p>

    <h2>Your rights</h2>
    <p>Because we don't hold your content or a profile of you, there's nothing on our side to access, export, or delete. For any third-party services above, refer to <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">Google's privacy policy</a>.</p>

    <h2>Contact</h2>
    <p>Questions about this policy: <a href="mailto:${C.CONTACT_EMAIL}">${C.CONTACT_EMAIL}</a>.</p>
  </section>`,
};

export const terms = {
  path: "/terms",
  title: `Terms of Service — ${C.NAME}`,
  description: `The terms of service for using ${C.NAME}, the free online diff checker for text and code.`,
  bodyHtml: `
  <section class="prose">
    <h1>Terms of service</h1>
    <p class="muted">Last updated: ${C.LAST_UPDATED}</p>

    <h2>Use of the service</h2>
    <p>${C.NAME} is provided free of charge, as-is, for your personal or professional use. You may use it for any lawful purpose.</p>

    <h2>No warranty</h2>
    <p>The tool is provided without warranties of any kind. It aims to highlight differences accurately, but results are for your own review and you are responsible for verifying anything you rely on — especially before applying a change to production code or data. We are not liable for any loss arising from use of the tool.</p>

    <h2>Availability</h2>
    <p>We may change, suspend, or discontinue the service at any time without notice. Because the tool runs in your browser, a page you already have open will keep working even if the site changes.</p>

    <h2>Third-party services</h2>
    <p>Pages may include Google AdSense and Google Analytics, which are governed by <a href="https://policies.google.com/terms" rel="noopener" target="_blank">Google's terms</a>.</p>

    <h2>Contact</h2>
    <p><a href="mailto:${C.CONTACT_EMAIL}">${C.CONTACT_EMAIL}</a></p>
  </section>`,
};

export const contact = {
  path: "/contact",
  title: `Contact — ${C.NAME}`,
  description: `Get in touch about ${C.NAME} — report a bug, request a feature, or ask a question about the diff checker.`,
  bodyHtml: `
  <section class="prose">
    <h1>Contact</h1>
    <p>Bug reports, feature ideas, or anything else — email <a href="mailto:${C.CONTACT_EMAIL}">${C.CONTACT_EMAIL}</a> and you'll get a reply.</p>
    <p>There's no contact form here on purpose: a form would need a backend, and part of the point of ${C.NAME} is that there isn't one.</p>
  </section>`,
};
