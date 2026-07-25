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
  <section class="hero hero--home hero--split">
    <div class="hero-copy">
      <span class="badge"><span class="dot" aria-hidden="true"></span>Every feature free and unmetered — nothing uploaded</span>
      <h1>${C.NAME}</h1>
      <p class="lede">A diff checker that doesn't hold anything back: syntax highlighting across ~17 languages, character-level detail, split and unified views, 3-way merge, image and CSV comparison — all free, all unlimited, all running on your own machine.</p>
      <p class="lede lede--sub">Most free diff tools do plain line comparison and stop. The big paid one meters syntax highlighting at five uses a month. <a href="/diffchecker-alternative">See the comparison →</a></p>
    </div>
    <div class="hero-sample" aria-hidden="true">
      <div class="hero-sample-head"><span class="dtext">config.yml</span></div>
      <div class="diff-view unified">
        <div class="dline"><span class="gut">4</span><span class="dsign"> </span><span class="dtext">  retries: 3</span></div>
        <div class="dline del"><span class="gut">5</span><span class="dsign">−</span><span class="dtext">  timeout: <span class="wd-del">10s</span></span></div>
        <div class="dline add"><span class="gut">5</span><span class="dsign">+</span><span class="dtext">  timeout: <span class="wd-add">30s</span></span></div>
        <div class="dline add"><span class="gut">6</span><span class="dsign">+</span><span class="dtext">  <span class="wd-add">backoff: exponential</span></span></div>
        <div class="dline"><span class="gut">7</span><span class="dsign"> </span><span class="dtext">  region: us-east-1</span></div>
      </div>
    </div>
  </section>
  ${renderTool({ format: "text" })}

  <section class="feature-list" aria-label="Features">
    <div class="feature-row feature-row--add"><h3>Word-level highlighting</h3><p>Not just which lines changed — the exact words inside a changed line are marked, so you see the real edit at a glance.</p></div>
    <div class="feature-row feature-row--del"><h3>Split &amp; unified views</h3><p>Compare side by side with line numbers, or switch to a single unified column. Your choice is remembered.</p></div>
    <div class="feature-row feature-row--add"><h3>Nothing is uploaded</h3><p>Every comparison runs in your browser. Your text and code never touch a server, so it's safe for private files and works offline.</p></div>
    <div class="feature-row feature-row--del"><h3>Free, no signup, no limits</h3><p>No account, no daily cap, no paywall. Open the page and compare — every feature is free, immediately.</p></div>
    <div class="feature-row feature-row--add"><h3>Formatting-aware JSON</h3><p>On the JSON page, both sides are normalised first, so a minified and a pretty-printed file with the same data read as identical.</p></div>
    <div class="feature-row feature-row--del"><h3>Share &amp; export</h3><p>Copy a link that reopens the same comparison, or download a standard unified <code>.diff</code> patch.</p></div>
  </section>

  <section class="howto">
    <h2>How to compare two files with ${C.NAME}</h2>
    <div class="howto-grid">
      ${HOME_HOWTO.map((s) => `<div class="howto-step"><p>${s}</p></div>`).join("\n      ")}
    </div>
  </section>

  <section class="guide">
    <h2>What a diff checker is for</h2>
    <p>A diff (short for "difference") checker takes two versions of the same text and works out the smallest set of changes that turns one into the other — then shows you those changes instead of making you hunt for them line by line. It's the engine behind the <code>diff</code> command, the review view on GitHub, and the "compare versions" feature in a word processor, distilled to a single page with nothing to install.</p>
    <p>You reach for one whenever you have a "before" and an "after" and need to know exactly what moved: two drafts of a document, a config file before and after an edit, a code snippet you're refactoring, two exports that are supposed to match, or a contract that came back from the other side with "just a couple of tweaks." ${C.NAME} highlights not only which <em>lines</em> differ but the exact <em>words</em> inside a changed line, so a one-character fix doesn't light up the whole row.</p>

    <h2>Text, code, data and documents</h2>
    <p>Because the comparison works on text, it's language- and format-agnostic. ${C.NAME} has dedicated pages tuned to the formats people compare most — each with guidance on that format's particular pitfalls:</p>
    <ul>
      <li><strong>Code</strong> in any language, with syntax highlighting and whitespace handling that respects indentation-sensitive languages like Python and YAML.</li>
      <li><strong>Structured data</strong> — <a href="/${C.COLLECTION_DIR}/json-diff">JSON</a>, <a href="/${C.COLLECTION_DIR}/csv-diff">CSV</a>, <a href="/${C.COLLECTION_DIR}/xml-diff">XML</a>, <a href="/${C.COLLECTION_DIR}/yaml-diff">YAML</a> — where key order and formatting can hide the real change.</li>
      <li><strong>Config and DevOps</strong> files — <a href="/${C.COLLECTION_DIR}/dockerfile-diff">Dockerfiles</a>, <a href="/${C.COLLECTION_DIR}/env-diff">.env</a>, <a href="/${C.COLLECTION_DIR}/terraform-diff">Terraform</a>, <a href="/${C.COLLECTION_DIR}/nginx-config-diff">nginx</a> — where a one-line change has outsized effects.</li>
      <li><strong>Documents</strong> — <a href="/${C.COLLECTION_DIR}/pdf-diff">PDF</a>, <a href="/${C.COLLECTION_DIR}/word-diff">Word</a>, <a href="/${C.COLLECTION_DIR}/contract-diff">contracts</a> and <a href="/${C.COLLECTION_DIR}/resume-diff">résumés</a> — with text extracted from the file in your browser.</li>
    </ul>

    <h2>Why "nothing uploaded" matters</h2>
    <p>Most online diff tools send your text to a server to compute the comparison. ${C.NAME} doesn't: the whole diff runs in your browser with JavaScript, so whatever you paste — proprietary code, a draft agreement, a config file full of secrets, personal data — never leaves your device. You can confirm it yourself in your browser's Network tab, and the tool keeps working offline once it has loaded. That makes it safe for exactly the material you shouldn't paste into a typical web tool.</p>
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
    <p>${C.NAME} is a small, single-purpose tool: paste two versions of any text or code and instantly see what changed — every added, removed and altered line, with the exact changed words highlighted inline. It's the same idea as the <code>diff</code> command or the review view on a code host, distilled to one page with nothing to install and nothing to sign up for.</p>

    <h2>Who makes it</h2>
    <p>${C.NAME} is built and maintained independently by a working software developer, not a company or a funded startup — someone who reaches for a diff tool most days and got tired of the ones that wall the useful parts behind a signup or upload your code to a server to do the comparison. It's a focused side project, kept deliberately small. Bug reports and feature requests go straight to the person who maintains it, at <a href="mailto:${C.CONTACT_EMAIL}">${C.CONTACT_EMAIL}</a>.</p>

    <h2>How it works</h2>
    <p>The entire comparison runs in your browser using JavaScript — your text and code are diffed on your own device and never sent anywhere. You can confirm that in your browser's Network tab (you'll see no request carrying your content), and the tool keeps working offline once the page has loaded. That "nothing uploaded" design is the whole point: it means you can safely compare proprietary code, a draft contract, or a config file full of secrets, without handing any of it to a third party. Files you drag in (<code>.txt</code>, <code>.pdf</code>, <code>.docx</code>) are read locally the same way.</p>

    <h2>Why it exists</h2>
    <p>Because the popular diff checkers each fall down somewhere: some upload your input to a server, some cap you after a few uses, some bury word-level highlighting or file support behind a paywall. ${C.NAME} keeps the genuinely useful features — word-level highlighting, split and unified views, syntax awareness, file drag-and-drop, shareable links and <code>.diff</code> export — free and client-side, with per-format guidance on each tool's page (the real gotchas, like why "ignore whitespace" is dangerous for Python or YAML).</p>
    <p>It stays free by showing a single, unobtrusive ad, and nothing more — no upsell, no account, no data collection. Found a bug or want a format supported? <a href="/contact">Get in touch</a>.</p>
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

// Commercial-intent comparison page targeting "diffchecker alternative".
//
// Every claim about Diffchecker below is taken from their own published
// pricing page and marketing copy, checked 2026-07-24, and dated in the text
// so a reader can tell how fresh it is. Competitor pricing changes — if this
// page is being revised, re-check https://www.diffchecker.com/pricing/ rather
// than trusting these numbers. The page deliberately says where Diffchecker
// is the better tool: a comparison that never concedes anything reads as
// marketing, ranks worse, and isn't true.
export const diffcheckerAlternative = {
  path: "/diffchecker-alternative",
  title: `A Free Diffchecker Alternative — ${C.NAME} vs Diffchecker`,
  description:
    "An honest comparison of Diffhero and Diffchecker: what each one does free, what Diffchecker meters or charges for, and which to pick for your case.",
  bodyHtml: `
  <section class="prose">
    <h1>A free Diffchecker alternative</h1>
    <p>Diffchecker is the tool most people mean when they say "online diff checker" — it's mature, well built, and has been around far longer than ${C.NAME}. This page is a straight comparison of the two, including the cases where Diffchecker is the one you should use.</p>
    <p><strong>Short version:</strong> if you want to compare two pieces of text or code in a browser, ${C.NAME} does it free and unmetered, and never sends your input anywhere. If you need to compare <em>folders</em>, run diffs offline in a desktop app, or plug diffing into Git or a document-management system, Diffchecker does things ${C.NAME} doesn't.</p>

    <h2>What Diffchecker's free tier limits</h2>
    <p>Diffchecker's tools are free to open, but several features are metered per month on the free plan. Taken from <a href="https://www.diffchecker.com/pricing/" rel="nofollow noopener" target="_blank">Diffchecker's published pricing</a> as of July 2026:</p>
    <ul>
      <li>Syntax highlighting — 5 uses/month</li>
      <li>Unified view — 5 uses/month</li>
      <li>Character-level differences — 10 uses/month</li>
      <li>Hide whitespace changes — 5 uses/month</li>
      <li>Custom ignore rules — 5 uses/month</li>
      <li>Merge changes — 10 uses/month</li>
      <li>Export as PDF — 5 uses/month</li>
    </ul>
    <p>Lifting those limits means Diffchecker Pro, listed at $15/month. Folder and batch comparison, the desktop app, offline use, and the Git and iManage integrations are paid-only regardless.</p>
    <p>In ${C.NAME} every one of the metered features above is simply on, with no counter, no account, and no monthly reset: <a href="/diff/code-diff">syntax highlighting across ~17 languages</a>, split and unified views, character-level detail, ignore-whitespace and ignore-case, <a href="/diff/merge-conflict-resolver">3-way merge</a>, and print-to-PDF plus <code>.diff</code> download.</p>

    <h2>Where your text actually goes</h2>
    <p>This is the difference that matters most if you paste anything sensitive. Diffchecker markets its <em>desktop</em> app with the line "the most secure way to run Diffchecker — your diffs never leave your computer", which is a fair description of a desktop app and also tells you what it implies about the web one.</p>
    <p>${C.NAME} has no server to send anything to. The comparison is done in JavaScript on your own machine, so pasting proprietary code, an unsigned contract, or a config file full of credentials doesn't hand that content to anyone. You don't have to take that on trust either — open your browser's Network tab while you diff and you'll see no request carrying your text, and the page keeps working with your connection switched off. That's the same guarantee Diffchecker reserves for its paid desktop app, except it's the default and it's free.</p>

    <h2>When Diffchecker is the better choice</h2>
    <p>Genuinely, not as a formality:</p>
    <ul>
      <li><strong>Comparing folders or many files at once.</strong> ${C.NAME} compares two inputs. Diffchecker does folder and batch comparison; ${C.NAME} has no equivalent.</li>
      <li><strong>You want a real desktop application.</strong> ${C.NAME} is a web page. It works offline once loaded and can be installed to your dock, but it isn't a native app with filesystem access.</li>
      <li><strong>Integrations.</strong> If you need diffing wired into Git tooling or iManage, that's a Diffchecker Pro feature with no counterpart here.</li>
      <li><strong>Rich document comparison.</strong> Diffchecker handles Word/PDF/spreadsheet comparison more thoroughly. ${C.NAME} reads <code>.txt</code>, <code>.pdf</code> and <code>.docx</code> as text and compares <a href="/diff/csv-table-diff">CSV as a table</a>, but it isn't a full redline tool.</li>
    </ul>

    <h2>When ${C.NAME} is the better choice</h2>
    <ul>
      <li>You want the useful options — syntax highlighting, unified view, character detail — without a monthly counter.</li>
      <li>The content is sensitive and you'd rather it never reach a server.</li>
      <li>You want to send someone a comparison: <a href="/diff/online-diff-checker">the share link encodes both sides in the URL</a>, no account on either end.</li>
      <li>You're diffing a specific format and want the gotchas spelled out — <a href="/diff/python-diff">why ignoring whitespace breaks Python diffs</a>, <a href="/diff/json-diff">how JSON key order trips up comparisons</a>, <a href="/diff/csv-diff">why re-sorted CSV rows all look changed</a>.</li>
    </ul>

    <h2>Both are free to try</h2>
    <p>There's no signup here to get in the way, so the fastest way to decide is to <a href="/">paste your own text into ${C.NAME}</a> and see whether it covers what you need. If it doesn't, Diffchecker is a good tool and this page will still be here.</p>
    <p class="note">Diffchecker is a product of Checker Software Inc. ${C.NAME} is not affiliated with it. Pricing and feature limits described above were checked in July 2026 and may have changed since.</p>
  </section>`,
};

// The public "embed this" page. Each embed places a real link on someone
// else's site, which is the family's binding constraint (docs/seo-strategy.md).
export const embed = {
  path: "/embed",
  title: `Embed a free diff checker on your site — ${C.NAME}`,
  description:
    "Put a working diff checker on your own page for free. One line of HTML, no account, no tracking — and nothing your readers paste leaves their browser.",
  bodyHtml: `
  <section class="prose">
    <h1>Embed a diff checker on your site</h1>
    <p>If you write documentation, a programming tutorial, a migration guide or a style guide, you can drop a working ${C.NAME} diff checker straight into the page. It's free, there's no account, and there's nothing to keep updated.</p>
    <p>It's most useful where you're already asking a reader to compare two things — a before-and-after config, two versions of a snippet, the output of a command run twice. Instead of describing the difference, let them paste it in.</p>

    <h2>The snippet</h2>
    <pre class="embed-code"><code>&lt;iframe src="${C.SITE_URL}/embed/text-compare" width="100%" height="460"
        style="border:1px solid #ddd;border-radius:8px"
        title="Diff checker by ${C.NAME}" loading="lazy"&gt;&lt;/iframe&gt;
&lt;p style="font-size:13px"&gt;&lt;a href="${C.SITE_URL}/${C.COLLECTION_DIR}/text-compare"&gt;Diff checker&lt;/a&gt;
   by &lt;a href="${C.SITE_URL}"&gt;${C.NAME}&lt;/a&gt;&lt;/p&gt;</code></pre>
    <p><a href="/embed/text-compare" target="_blank" rel="noopener">Preview the widget →</a></p>

    <h2>Why the credit line is separate from the iframe</h2>
    <p>The small line underneath is the only thing we ask for, and it's deliberately plain, visible HTML rather than something buried. A link inside an iframe belongs to the iframe's own document rather than to your page, so without that line an embed gives us nothing at all. The widget works either way; we'd just appreciate it.</p>

    <h2>The details</h2>
    <ul>
      <li><strong>Nothing your readers paste is uploaded.</strong> The widget runs the same client-side diff as the rest of the site — safe for readers pasting a config or a private snippet.</li>
      <li><strong>No account, no key, no rate limit.</strong> Use it on as many pages as you like.</li>
      <li><strong>Give it room.</strong> A diff needs more height than most widgets; 460px is a sensible floor and taller is better on a wide layout.</li>
      <li><strong>It won't break.</strong> The embed URL is stable and picks up improvements automatically.</li>
    </ul>
    <p>Want a format-specific version — <a href="/${C.COLLECTION_DIR}/json-diff">JSON</a> for an API guide, or <a href="/${C.COLLECTION_DIR}/yaml-diff">YAML</a> for a config walkthrough? <a href="/contact">Ask</a> and it'll likely get added.</p>
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
