/**
 * The programmatic-SEO collection for Diffhero + the shared diff tool renderer.
 *
 * THE GROWTH LEVER: one row per indexed long-tail page (a format or language
 * people search "X diff / compare two X" for), all funnelling into the same
 * diff tool + one ad slot. Every title/description/intro/faq is unique — the
 * discipline that keeps programmatic pages indexed instead of filtered.
 *
 * Fields: slug, eyebrow, title, description, intro, format (diff hint the tool
 * reads via data-format: "text" default, "json" enables formatting-aware
 * normalization), faq, howto (optional array of step strings → HowTo JSON-LD +
 * visible steps), extra (optional page-specific HTML).
 */

export const PAGES = [
  {
    slug: "text-compare",
    eyebrow: "Text Compare",
    title: "Text Compare — Find the Difference Between Two Texts",
    description:
      "Paste two versions of any text and see every added, removed and changed line — with the exact words highlighted — instantly. Free, browser-only, nothing uploaded.",
    intro:
      "Drop your original text on the left and the changed version on the right. Diffhero lines them up and highlights exactly what was added, removed or altered — down to the individual words inside a changed line — the moment you stop typing.",
    format: "text",
    faq: [
      { q: "Is my text uploaded anywhere?", a: "No. The comparison runs entirely in your browser with JavaScript, so your text never leaves your device and it works offline once the page has loaded." },
      { q: "How does it decide what changed?", a: "It aligns the two texts with a longest-common-subsequence match over lines, then runs a second word-level pass inside each changed line so you see the precise words that differ, not just the whole line." },
      { q: "Can I ignore spacing or capitalisation?", a: "Yes. Toggle \"Ignore whitespace\" and \"Ignore case\" to treat lines that differ only in spacing or letter case as identical." },
    ],
    howto: [
      "Paste or type the original text into the left box.",
      "Paste or type the changed version into the right box.",
      "Read the highlighted result: green marks additions, red marks deletions, and changed words are highlighted inline.",
      "Switch between Split and Unified view, and use the up/down arrows to jump between changes.",
    ],
  },
  {
    slug: "compare-two-text-files",
    eyebrow: "Compare Two Files",
    title: "Compare Two Text Files Online — Drag, Drop, Diff",
    description:
      "Compare two text files in your browser — drag and drop both files and see every difference highlighted. Nothing is uploaded; the files never leave your device.",
    intro:
      "Drag one file onto each side (or paste their contents) and Diffhero shows exactly what changed between them, line by line and word by word. Because everything runs locally, you can safely compare files you could never upload to a website.",
    format: "text",
    faq: [
      { q: "How do I load a file?", a: "Drag a file straight onto either box, or click into the box and paste its contents. The file is read locally in your browser — it is never uploaded anywhere." },
      { q: "What file types work?", a: "Any plain-text file: .txt, source code, .csv, .json, .md, config files and more. Binary files (images, PDFs, office documents) can't be compared as text." },
      { q: "Is there a file-size limit?", a: "No hard limit, but very large files (many tens of thousands of lines) may pause briefly while diffing, since the whole comparison runs on your device." },
    ],
  },
  {
    slug: "online-diff-checker",
    eyebrow: "Diff Checker",
    title: "Online Diff Checker — Compare Text & Code Free",
    description:
      "A free online diff checker: paste two versions of text or code and instantly see the differences, with word-level highlighting, split and unified views. No signup.",
    intro:
      "Diffhero is a fast, free diff checker that runs entirely in your browser. Paste two versions of anything — prose, code, config, data — and see the differences with the changed words highlighted, in whichever view you prefer.",
    format: "text",
    faq: [
      { q: "Do I need an account?", a: "No — there's no signup, no login and no paywall. Open the page and start comparing; every feature is free and available immediately." },
      { q: "How is this different from other diff checkers?", a: "Diffhero is genuinely free with no per-day limit, does word-level highlighting inside changed lines, offers both split and unified views, and never uploads your content — it all runs client-side." },
      { q: "Can I share a comparison?", a: "Yes — the \"Copy share link\" button encodes both sides into the URL, so anyone you send it to opens the same comparison. For anything sensitive, don't share the link." },
    ],
  },
  {
    slug: "code-diff",
    eyebrow: "Code Diff",
    title: "Code Diff Checker — Compare Two Snippets of Code",
    description:
      "Compare two versions of a code snippet and see inserted, deleted and modified lines — with changed tokens highlighted. No signup, runs client-side, any language.",
    intro:
      "Paste the before and after of any snippet to see a clean diff with the exact changed tokens highlighted. Language-agnostic — it compares the text, so it works for any language your editor does, without sending your code to a server.",
    format: "text",
    faq: [
      { q: "Does it work for my programming language?", a: "Yes. Diffhero compares lines and words of text, so it is completely language-agnostic — Python, JavaScript, Go, Rust, SQL, anything. There is nothing to configure per language." },
      { q: "Is it safe to paste proprietary code?", a: "Your code is never transmitted. All diffing happens locally in your browser, so pasting internal or client code carries no upload risk — check your dev tools' Network tab to confirm nothing is sent." },
      { q: "Can it ignore reformatting noise?", a: "Turn on \"Ignore whitespace\" so re-indentation and trailing spaces don't drown out the real changes you care about." },
    ],
  },
  {
    slug: "json-diff",
    eyebrow: "JSON Diff",
    title: "JSON Diff — Compare Two JSON Files, Formatting-Aware",
    description:
      "Compare two JSON documents without formatting noise. Diffhero pretty-prints both sides first, so only real value changes show up — not whitespace or key spacing.",
    intro:
      "Paste two JSON documents. Diffhero parses and re-formats each side with consistent indentation before comparing, so a minified file and a pretty-printed one with the same data show as identical — and only genuine changes are highlighted, down to the value.",
    format: "json",
    faq: [
      { q: "What makes this different from a plain text diff on JSON?", a: "A raw text diff flags every reformatting difference — indentation, minification, key spacing. Diffhero normalises both sides by parsing and re-printing them first, so you only see real changes to values or structure." },
      { q: "What if my JSON is invalid?", a: "If either side can't be parsed, Diffhero falls back to a plain line-by-line comparison and marks that the JSON couldn't be normalised, so you can still see the raw differences." },
      { q: "Does it reorder object keys?", a: "It keeps keys in their original order rather than sorting them, so a genuine reordering still shows as a change. Consistent indentation is normalised; key order is preserved." },
    ],
  },
  {
    slug: "compare-two-lists",
    eyebrow: "Compare Lists",
    title: "Compare Two Lists — What's Added, Removed & Common",
    description:
      "Paste two lists and instantly see which items were added, which were removed, and which appear in both. Line-based, browser-only, nothing uploaded.",
    intro:
      "Put one list on each side to see exactly how they differ — new items, dropped items, and the ones they share. Handy for comparing keyword sets, email columns, inventory exports or any two lists of lines.",
    format: "text",
    faq: [
      { q: "Does order matter?", a: "By default the comparison is order-sensitive, so a reordered list shows as changed. If you only care about which items are present, sort both lists the same way first (many tools can do this in one click)." },
      { q: "Can it ignore case differences?", a: "Yes — turn on \"Ignore case\" so \"Apple\" and \"apple\" are treated as the same item rather than an add and a remove." },
      { q: "How do I see only the differences?", a: "Switch to Unified view and use the up/down arrows to jump straight between changes, skipping the lines the two lists have in common." },
    ],
  },
  {
    slug: "csv-diff",
    eyebrow: "CSV Diff",
    title: "CSV Diff — Compare Two CSV Files Online",
    description:
      "Spot added, removed and changed rows between two CSV files, with the changed cells highlighted. Line-based comparison, entirely in your browser.",
    intro:
      "Paste two CSV exports to see which rows were added, removed or edited between them — and within an edited row, which cell actually changed. Diffhero compares row by row, so a new record or an edited field stands out immediately.",
    format: "text",
    faq: [
      { q: "Does it compare row by row?", a: "Yes — each line (row) is treated as a unit, so an inserted or deleted row shifts cleanly and only the genuinely different rows are highlighted, with the changed cell marked inline." },
      { q: "Can it handle large exports?", a: "It comfortably handles thousands of rows in-browser. Extremely large files (hundreds of thousands of rows) may pause briefly while diffing, since the whole comparison runs on your device." },
      { q: "Will reordered rows show as changes?", a: "Yes. A CSV diff is order-sensitive, so if rows are sorted differently they'll appear changed. Sort both files the same way first if you only care about added/removed records." },
    ],
  },
  {
    slug: "xml-diff",
    eyebrow: "XML Diff",
    title: "XML Diff Checker — Compare Two XML Documents",
    description:
      "Compare two XML files line by line and see exactly what changed, with changed values highlighted. Free, no upload, runs in your browser.",
    intro:
      "Paste two XML documents to see the differences highlighted line by line and word by word. Great for spotting what changed between two config files, two API responses, or two versions of a feed — without pasting anything into a server.",
    format: "text",
    faq: [
      { q: "Does it understand XML structure?", a: "Diffhero compares XML as text, which is ideal when the two files are formatted the same way. For the cleanest results, pretty-print both sides with the same formatter first." },
      { q: "Is my XML sent anywhere?", a: "No. Everything runs client-side, so configuration files and API payloads you paste never leave your browser." },
      { q: "Can I ignore indentation differences?", a: "Yes — enable \"Ignore whitespace\" so re-indented XML doesn't register as changed when the content is actually the same." },
    ],
  },
  {
    slug: "yaml-diff",
    eyebrow: "YAML Diff",
    title: "YAML Diff — Compare Two YAML Files",
    description:
      "Compare two YAML files and highlight every changed line and value. Ideal for Kubernetes manifests, CI configs and app settings. Browser-only, nothing uploaded.",
    intro:
      "Paste two YAML files — manifests, CI pipelines, app configs — and Diffhero shows exactly which lines and values changed. Because YAML is whitespace-sensitive, the line-by-line view maps directly onto what actually matters.",
    format: "text",
    faq: [
      { q: "Is a line diff right for YAML?", a: "Yes — YAML is line- and indentation-oriented, so a line-by-line diff maps neatly onto real changes in keys, values and nesting. Keep \"Ignore whitespace\" off for YAML, since indentation is significant." },
      { q: "Can I compare two Kubernetes manifests?", a: "That's a common use. Paste the old and new manifest to see exactly which fields changed before you apply — all locally, so cluster configs never leave your machine." },
      { q: "Does it validate the YAML?", a: "No — Diffhero compares the text as written and doesn't parse or validate YAML, so it won't flag syntax errors, only differences between the two versions." },
    ],
  },
  {
    slug: "sql-diff",
    eyebrow: "SQL Diff",
    title: "SQL Diff — Compare Two SQL Scripts",
    description:
      "Compare two SQL scripts or schema dumps and see what changed line by line, with changed clauses highlighted. Free, client-side — nothing leaves your browser.",
    intro:
      "Paste two SQL scripts — migrations, schema dumps, or query versions — to see added, removed and changed lines highlighted. A fast way to review what a migration actually changes before you run it.",
    format: "text",
    faq: [
      { q: "Can I diff two schema dumps?", a: "Yes. Paste both dumps to see which tables, columns or constraints changed. For the tidiest diff, generate both dumps with the same tool and options so only real schema changes stand out." },
      { q: "Is it safe for production SQL?", a: "Your SQL is never uploaded — the comparison runs entirely in your browser, so migration scripts and schema details stay on your device." },
      { q: "Does it understand SQL syntax?", a: "No — it's a text diff, so it doesn't parse SQL. That makes it language- and dialect-agnostic: it works the same for Postgres, MySQL, SQLite and the rest." },
    ],
  },
  {
    slug: "markdown-diff",
    eyebrow: "Markdown Diff",
    title: "Markdown Diff — Compare Two Markdown Documents",
    description:
      "Compare two Markdown documents and see every changed line and word. Perfect for docs, READMEs and drafts. Runs in your browser with nothing uploaded.",
    intro:
      "Paste two versions of a Markdown document — a README, a doc page, a draft — and Diffhero highlights what changed between them, line by line and word by word, so edits and revisions are easy to review.",
    format: "text",
    faq: [
      { q: "Does it render the Markdown?", a: "No — it compares the raw Markdown source, which is what you want when reviewing edits, since you can see exactly which characters and lines changed rather than just the rendered output." },
      { q: "Good for reviewing doc pull requests?", a: "Yes. Paste the old and new version of a doc to preview the change before committing — useful when you don't have a side-by-side review view handy." },
      { q: "Can it ignore reflowed paragraphs?", a: "Line-based diffing will flag a re-wrapped paragraph as changed, but the inline word highlighting still shows which words actually differ. If you hard-wrap prose, keep line widths consistent for the cleanest diff." },
    ],
  },
  {
    slug: "html-diff",
    eyebrow: "HTML Diff",
    title: "HTML Diff — Compare Two HTML Files or Snippets",
    description:
      "Compare two pieces of HTML and see exactly what changed in the markup, with changed tags and attributes highlighted. Client-side, nothing uploaded.",
    intro:
      "Paste the old and new HTML to see a clean diff of the source — changed tags, attributes and text highlighted inline. It compares the markup as text, so it's perfect for reviewing template or email-HTML changes before they ship.",
    format: "text",
    faq: [
      { q: "Does it compare rendered pages or source?", a: "It compares the HTML source, which is what you want when reviewing what changed in a template or component — you see the exact markup differences, not just the visual result." },
      { q: "Can it ignore attribute reordering?", a: "No — it's a text diff, so reordered attributes show as a change. Format both sides consistently first if attribute order isn't meaningful to you." },
      { q: "Is my HTML uploaded?", a: "No. Everything runs in your browser, so proprietary templates and email HTML never leave your device." },
    ],
  },
  {
    slug: "python-diff",
    eyebrow: "Python Diff",
    title: "Python Diff — Compare Two Python Files",
    description:
      "Compare two Python files or snippets and highlight every changed line and token. Client-side and language-agnostic — your code never leaves the browser.",
    intro:
      "Paste two versions of a Python file to see inserted, deleted and modified lines clearly marked, with changed tokens highlighted inline. Because Python is indentation-sensitive, the line-by-line view lines up directly with the logic that changed.",
    format: "text",
    faq: [
      { q: "Will it respect Python indentation?", a: "Yes — it compares lines exactly as written, including leading whitespace, so indentation changes (which matter in Python) are visible. Keep \"Ignore whitespace\" off to see them." },
      { q: "Is my code uploaded?", a: "No. All diffing runs locally in your browser, so pasting Python from a private or work project carries no upload risk." },
      { q: "Can it ignore comment-only changes?", a: "Not automatically — it diffs the raw text. A changed comment shows as a changed line, which is usually what you want when reviewing edits." },
    ],
  },
  {
    slug: "javascript-diff",
    eyebrow: "JavaScript Diff",
    title: "JavaScript Diff — Compare Two JS Files",
    description:
      "Compare two JavaScript files or snippets and see exactly what changed, with changed tokens highlighted. Works for TypeScript and JSX too. Nothing uploaded.",
    intro:
      "Paste the old and new version of a JavaScript file to see a clean diff with the changed tokens highlighted. It works just as well for TypeScript, JSX and TSX, since it compares the text rather than parsing the language.",
    format: "text",
    faq: [
      { q: "Does it work for TypeScript and JSX?", a: "Yes. Diffhero compares text, so TypeScript, JSX and TSX all work exactly the same as plain JavaScript — there's nothing to switch." },
      { q: "Can it hide reformatting from Prettier?", a: "Turn on \"Ignore whitespace\" to stop re-indentation and spacing changes from cluttering the diff, so you see the substantive edits under the formatting." },
      { q: "Is pasted JS sent to a server?", a: "Never — the comparison is done entirely in your browser, so bundled or proprietary JavaScript stays on your device." },
    ],
  },
  {
    slug: "typescript-diff",
    eyebrow: "TypeScript Diff",
    title: "TypeScript Diff — Compare Two TS or TSX Files",
    description:
      "Compare two TypeScript files and highlight every changed line and token, including types and generics. Works for TSX. Client-side, nothing uploaded.",
    intro:
      "Paste two versions of a TypeScript file to see exactly what changed — type annotations, generics, interfaces and logic — with the changed tokens highlighted inline. TSX works the same way, since the diff is on the text.",
    format: "text",
    faq: [
      { q: "Does it handle type annotations and generics?", a: "Yes — they're just text to the diff, so a changed type, a new generic parameter or an edited interface all show up like any other change, with the specific tokens highlighted." },
      { q: "Is TSX supported?", a: "Yes. TSX, JSX, TS and JS all diff identically because Diffhero compares the source text rather than parsing the language." },
      { q: "Is my code private?", a: "Completely — the comparison runs in your browser and nothing is uploaded, so work or client code is safe to paste." },
    ],
  },
  {
    slug: "go-diff",
    eyebrow: "Go Diff",
    title: "Go Diff — Compare Two Go Files",
    description:
      "Compare two Go source files and highlight every changed line and token. Client-side and language-agnostic — your code never leaves the browser.",
    intro:
      "Paste two versions of a Go file to see added, removed and modified lines clearly marked, with the exact changed tokens highlighted. Useful for reviewing a change before committing, or seeing what gofmt actually did.",
    format: "text",
    faq: [
      { q: "Will gofmt changes clutter the diff?", a: "If both files are already gofmt-formatted, the diff stays clean. If one isn't, turn on \"Ignore whitespace\" to focus on the substantive changes rather than formatting." },
      { q: "Does it understand Go syntax?", a: "No — it's a text diff, which is exactly what you want for reviewing edits. That also means it works for any language, not just Go." },
      { q: "Is my Go code uploaded?", a: "No. Everything runs locally in your browser, so private or proprietary Go stays on your device." },
    ],
  },
  {
    slug: "java-diff",
    eyebrow: "Java Diff",
    title: "Java Diff — Compare Two Java Files",
    description:
      "Compare two Java source files and highlight every changed line and token. Free, browser-only, works for Kotlin and other JVM languages too. Nothing uploaded.",
    intro:
      "Paste two versions of a Java file to see a clean line-by-line diff with the changed tokens highlighted. It works just as well for Kotlin, Scala and other JVM-language sources, since it compares the text.",
    format: "text",
    faq: [
      { q: "Does it work for Kotlin and Scala too?", a: "Yes — Diffhero compares text, so any JVM language (or any language at all) diffs the same way, with no per-language setting." },
      { q: "Can it ignore import reordering?", a: "Not automatically — reordered imports show as changes. Sort imports consistently first if you don't want to see those." },
      { q: "Is my code sent to a server?", a: "No — the comparison happens entirely in your browser, so enterprise or client Java stays on your device." },
    ],
  },
  {
    slug: "php-diff",
    eyebrow: "PHP Diff",
    title: "PHP Diff — Compare Two PHP Files",
    description:
      "Compare two PHP files or snippets and see exactly what changed, with changed tokens highlighted. Client-side and language-agnostic — nothing uploaded.",
    intro:
      "Paste two versions of a PHP file to see inserted, deleted and modified lines clearly marked, with the changed tokens highlighted inline. Handy for reviewing a patch or a plugin change before you deploy it.",
    format: "text",
    faq: [
      { q: "Does it handle mixed HTML and PHP?", a: "Yes — it compares the raw text, so a file that mixes HTML markup and PHP tags diffs cleanly, with changes highlighted wherever they occur." },
      { q: "Can it ignore formatting differences?", a: "Turn on \"Ignore whitespace\" so re-indentation and spacing changes don't obscure the real edits." },
      { q: "Is my PHP uploaded?", a: "No — everything runs in your browser, so proprietary or client PHP never leaves your device." },
    ],
  },
];

/**
 * The diff tool body, embedded on every collection page and the home page.
 * `p.format` ("text" | "json") is written to data-format so app.js can apply
 * formatting-aware normalization for JSON. Behaviour lives in assets/app.js.
 */
// Default syntax-highlighting language per collection page (users can change it
// with the in-tool dropdown). Slugs not listed default to "plain".
const LANG_BY_SLUG = {
  "code-diff": "clike", "json-diff": "json", "xml-diff": "xml", "yaml-diff": "yaml",
  "sql-diff": "sql", "html-diff": "html", "python-diff": "python", "javascript-diff": "javascript",
  "typescript-diff": "typescript", "go-diff": "go", "java-diff": "java", "php-diff": "php",
};

const LANG_OPTIONS = [
  ["plain", "Plain text"], ["clike", "Code (C-like)"], ["javascript", "JavaScript / TS"],
  ["python", "Python"], ["json", "JSON"], ["html", "HTML / XML"], ["css", "CSS"],
  ["sql", "SQL"], ["yaml", "YAML"], ["go", "Go"], ["java", "Java"], ["php", "PHP"],
];

export function renderTool(p = {}) {
  const format = p.format || "text";
  const lang = p.lang || LANG_BY_SLUG[p.slug] || "plain";
  const langOpts = LANG_OPTIONS.map(
    ([v, label]) => `<option value="${v}"${v === lang ? " selected" : ""}>${label}</option>`
  ).join("");
  return `
  <section class="tool difftool" data-format="${format}" data-lang="${lang}">
    <div class="diff-inputs">
      <div class="diff-pane" data-side="a">
        <div class="diff-pane-head">
          <label class="diff-label" for="original">Original</label>
          <span class="diff-drop-hint">paste, type, or drop a file</span>
        </div>
        <textarea id="original" class="editor code" placeholder="Paste the original version here…" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      </div>
      <div class="diff-pane" data-side="b">
        <div class="diff-pane-head">
          <label class="diff-label" for="changed">Changed</label>
          <span class="diff-drop-hint">paste, type, or drop a file</span>
        </div>
        <textarea id="changed" class="editor code" placeholder="Paste the changed version here…" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      </div>
    </div>
    <div class="tool-bar">
      <div class="view-toggle" role="group" aria-label="Diff view">
        <button type="button" class="seg is-active" id="viewSplit" data-view="split" aria-pressed="true">Split</button>
        <button type="button" class="seg" id="viewUnified" data-view="unified" aria-pressed="false">Unified</button>
      </div>
      <label class="opt lang-opt"><span class="sr-only">Syntax language</span><select id="langSel" class="lang-sel" aria-label="Syntax highlighting language">${langOpts}</select></label>
      <label class="opt"><input type="checkbox" id="optWhitespace"> Ignore whitespace</label>
      <label class="opt"><input type="checkbox" id="optCase"> Ignore case</label>
      <label class="opt"><input type="checkbox" id="optCollapse" checked> Collapse unchanged</label>
      <label class="opt"><input type="checkbox" id="optWrap" checked> Wrap</label>
      <div class="change-nav" id="changeNav" hidden>
        <button type="button" class="btn-icon" id="prevChange" aria-label="Previous change" title="Previous change (Alt+↑)">↑</button>
        <button type="button" class="btn-icon" id="nextChange" aria-label="Next change" title="Next change (Alt+↓)">↓</button>
      </div>
      <span class="diff-summary" id="diffSummary" role="status" aria-live="polite"></span>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn primary" id="swapBtn">Swap sides</button>
      <button type="button" class="btn" id="exampleBtn">Load example</button>
      <button type="button" class="btn" id="shareBtn">Copy share link</button>
      <button type="button" class="btn" id="copyBtn">Copy result</button>
      <button type="button" class="btn" id="downloadBtn">Download .diff</button>
      <button type="button" class="btn" id="clearBtn">Clear</button>
    </div>
    <div class="diff-output" id="diffOutput" aria-live="polite"></div>
  </section>`;
}
