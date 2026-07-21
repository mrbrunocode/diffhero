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
    title: "Text Compare — Find Text Differences",
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
    slug: "merge-conflict-resolver",
    eyebrow: "Merge Conflict Resolver",
    title: "Merge Conflict Resolver — 3-Way Merge Online",
    description:
      "Paste a base version plus two changed versions (mine/theirs) and get an automatic 3-way merge, with real conflicts clearly marked. Free, browser-only.",
    intro:
      "Paste the common ancestor (Base) plus your version (Mine) and the other version (Theirs). Diffhero merges non-overlapping changes automatically and marks only genuine conflicts — where both sides changed the same lines differently — the same idea as `git merge-file`, done in your browser.",
    shape: "merge",
    format: "text",
    faq: [
      { q: "How is this different from a 2-way diff?", a: "A 2-way diff only ever compares two texts. This tool takes three — a common Base plus two edited versions — and merges them the way a real version-control merge does: changes that don't overlap combine automatically, and only lines both sides actually changed differently get flagged as conflicts." },
      { q: "What do the conflict markers mean?", a: "Where both sides edited the same lines differently, the merged result shows `<<<<<<< mine`, your version, `=======`, their version, then `>>>>>>> theirs` — identical to the markers Git itself uses. Edit the merged result directly to pick a side or combine them by hand." },
      { q: "What if both sides made the exact same edit?", a: "That's not treated as a conflict — if mine and theirs changed the same lines to the identical result, the merge takes it cleanly with no markers, same as a real merge tool would." },
      { q: "Is my code uploaded anywhere?", a: "No. The merge runs entirely in your browser — nothing from any of the three inputs is sent to a server." },
    ],
  },
  {
    slug: "json-diff",
    eyebrow: "JSON Diff",
    title: "JSON Diff — Compare Two JSON Files",
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
    slug: "csv-table-diff",
    eyebrow: "CSV Table Diff",
    title: "CSV Table Diff — Compare Two CSVs as a Table",
    description:
      "Compare two CSV files rendered as an actual aligned table — added and removed rows, and the exact cell that changed within an edited row. Free, browser-only.",
    intro:
      "Paste two CSV exports below and see them compared as a real table, columns aligned — not as raw text lines. Added rows, removed rows, and edited rows are colored distinctly, and within an edited row the exact cell that changed is outlined.",
    shape: "csv-table",
    format: "text",
    faq: [
      { q: "How is this different from the regular CSV Diff page?", a: "The regular CSV Diff treats each row as a line of text and highlights changed words inline. This page parses the CSV into actual columns and renders a real table, so a changed cell is outlined in its own column rather than just highlighted as text in a line." },
      { q: "Does it handle quoted fields with commas inside them?", a: "Yes — quoted CSV fields (e.g. \"Smith, John\") are parsed correctly as a single cell, not split on the comma inside the quotes." },
      { q: "What if the two files have different columns?", a: "The table uses the first file's header row for column count and labels; extra or missing columns in the second file may not align cleanly. For very different schemas, the regular text-based CSV Diff may be easier to read." },
      { q: "Is my data uploaded anywhere?", a: "No. Parsing and comparison both run entirely in your browser." },
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
  {
    slug: "csharp-diff",
    eyebrow: "C# Diff",
    title: "C# Diff — Compare Two C# Files",
    description:
      "Compare two C# files or snippets and see exactly what changed, with changed tokens highlighted. Client-side and language-agnostic, nothing uploaded.",
    intro:
      "Paste two versions of a C# file to see inserted, deleted and modified lines clearly marked, with changed tokens highlighted inline. Works for .cs files, Razor components, or a single method you're reviewing before a PR.",
    format: "text",
    faq: [
      { q: "Does it work for Razor or .cshtml too?", a: "Yes — it compares raw text, so mixed C#/HTML in Razor files diffs the same way as plain .cs files." },
      { q: "Can it ignore using-directive reordering?", a: "Not automatically — reordered \"using\" statements show as changes. Sort them consistently first if you don't want to see those." },
      { q: "Is my C# code uploaded?", a: "No — the comparison runs entirely in your browser, so proprietary or enterprise C# stays on your device." },
    ],
  },
  {
    slug: "rust-diff",
    eyebrow: "Rust Diff",
    title: "Rust Diff — Compare Two Rust Files",
    description:
      "Compare two Rust files or snippets and highlight every changed line and token. Client-side and language-agnostic, nothing uploaded.",
    intro:
      "Paste two versions of a .rs file to see exactly what changed — a signature, a lifetime, a match arm — with the changed tokens highlighted inline. Handy for reviewing a diff before rustfmt and CI see it.",
    format: "text",
    faq: [
      { q: "Will rustfmt changes clutter the diff?", a: "If both files are already rustfmt-formatted, the diff stays clean. If not, turn on \"Ignore whitespace\" to focus on substantive changes." },
      { q: "Does it understand borrow-checker semantics?", a: "No — it's a text diff, not a compiler. That's exactly what you want for reviewing what a change touches, before you run cargo check." },
      { q: "Is my Rust code uploaded?", a: "No. Everything runs locally in your browser, so private crates and proprietary code never leave your device." },
    ],
  },
  {
    slug: "ruby-diff",
    eyebrow: "Ruby Diff",
    title: "Ruby Diff — Compare Two Ruby Files",
    description:
      "Compare two Ruby files or snippets and see exactly what changed, with changed tokens highlighted. Client-side, nothing uploaded.",
    intro:
      "Paste two versions of a .rb file to see added, removed and modified lines clearly marked, with the changed tokens highlighted. Because Ruby is indentation-flexible, the line-by-line view lines up with what actually changed in the logic.",
    format: "text",
    faq: [
      { q: "Does it work for Rails files too?", a: "Yes — models, controllers, views (including ERB) and config files all diff the same way, since it compares raw text." },
      { q: "Can it ignore RuboCop-style reformatting?", a: "Turn on \"Ignore whitespace\" so re-indentation and spacing changes from an autoformatter don't obscure the real edits." },
      { q: "Is my Ruby code uploaded?", a: "No — the comparison happens entirely in your browser, so private gems and app code stay on your device." },
    ],
  },
  {
    slug: "css-diff",
    eyebrow: "CSS Diff",
    title: "CSS Diff — Compare Two Stylesheets",
    description:
      "Compare two CSS files or snippets and see exactly which selectors, properties or values changed. Client-side, nothing uploaded.",
    intro:
      "Paste two versions of a stylesheet to see which rules were added, removed or edited — a changed color, a new breakpoint, a reordered selector — with the changed tokens highlighted inline.",
    format: "text",
    faq: [
      { q: "Does it work for SCSS or LESS too?", a: "Yes — it compares raw text, so SCSS, LESS and plain CSS all diff the same way, including variables and nesting." },
      { q: "Can it ignore vendor-prefix changes?", a: "Not automatically — an added or removed -webkit-/-moz- prefix shows as a change, since that can be a meaningful edit. Turn on \"Ignore whitespace\" for formatting-only noise." },
      { q: "Is my stylesheet uploaded?", a: "No. Everything runs in your browser, so proprietary design tokens and brand colors never leave your device." },
    ],
  },
  {
    slug: "kotlin-diff",
    eyebrow: "Kotlin Diff",
    title: "Kotlin Diff — Compare Two Kotlin Files",
    description:
      "Compare two Kotlin files or snippets and highlight every changed line and token. Client-side and language-agnostic, nothing uploaded.",
    intro:
      "Paste two versions of a .kt file to see exactly what changed — a data class, a coroutine, a null-safety check — with the changed tokens highlighted inline. Works for plain Kotlin or Android/Compose source.",
    format: "text",
    faq: [
      { q: "Does it work for Jetpack Compose files?", a: "Yes — Compose is just Kotlin, so .kt files with composables diff exactly the same way as any other Kotlin source." },
      { q: "Can it ignore ktlint-style reformatting?", a: "Turn on \"Ignore whitespace\" if one file has been run through a formatter and the other hasn't, so you see the substantive edits only." },
      { q: "Is my Kotlin code uploaded?", a: "No — the comparison runs entirely client-side, so private Android or backend source stays on your device." },
    ],
  },
  {
    slug: "swift-diff",
    eyebrow: "Swift Diff",
    title: "Swift Diff — Compare Two Swift Files",
    description:
      "Compare two Swift files or snippets and highlight every changed line and token. Client-side, works for SwiftUI views too. Nothing uploaded.",
    intro:
      "Paste two versions of a .swift file to see exactly what changed — a property wrapper, an optional-binding tweak, a SwiftUI view's body — with the changed tokens highlighted inline. Works the same for UIKit and SwiftUI source.",
    format: "text",
    faq: [
      { q: "Does it handle optionals and property wrappers?", a: "Yes — they're compared as text, so a changed `?`/`!` or an added `@State`/`@Published` wrapper shows up like any other token change." },
      { q: "Does it work for SwiftUI view bodies?", a: "Yes, a SwiftUI `.swift` file diffs the same as any other Swift source — useful for reviewing a view's body before a PR without opening Xcode." },
      { q: "Is my Swift code uploaded?", a: "No. The comparison runs entirely in your browser, so App Store-bound or private source stays on your device." },
    ],
  },
  {
    slug: "zig-diff",
    eyebrow: "Zig Diff",
    title: "Zig Diff — Compare Two Zig Files",
    description:
      "Compare two Zig files or snippets and highlight every changed line and token. Free, client-side — useful for reviewing comptime and allocator changes.",
    intro:
      "Paste two versions of a .zig file to see exactly what changed — a comptime block, an allocator swap, an added error union — with the changed tokens highlighted. Zig has no hidden control flow, so a line-level diff maps directly onto what actually changed at runtime.",
    format: "text",
    faq: [
      { q: "Does it understand comptime?", a: "No — it's a text diff, not a Zig compiler. That's fine for review purposes: an edited `comptime` block or a changed allocator argument shows as a normal line/token change." },
      { q: "Does it work across Zig versions?", a: "Yes, since Zig's syntax has changed release to release (it's still pre-1.0), comparing a file before and after a version migration works exactly like any other text diff." },
      { q: "Is my Zig source uploaded?", a: "No. Everything runs client-side, so unreleased systems code stays on your device." },
    ],
  },
  {
    slug: "elixir-diff",
    eyebrow: "Elixir Diff",
    title: "Elixir Diff — Compare Two Elixir Files",
    description:
      "Compare two Elixir files or snippets and highlight every changed line and token. Client-side — works for Phoenix and LiveView modules too.",
    intro:
      "Paste two versions of a .ex or .exs file to see exactly what changed — a pattern-matched function clause, a pipe (|>) chain, a GenServer callback — with the changed tokens highlighted inline. Works the same for plain Elixir, Phoenix controllers, or LiveView modules.",
    format: "text",
    faq: [
      { q: "Does it handle multiple function clauses with pattern matching?", a: "Yes — each clause is just a line (or block) of text, so an added or reordered pattern-matched clause shows up as an insertion or move, same as any other language." },
      { q: "Does it work for LiveView .heex templates?", a: "Yes, .heex is text like any other source file, so template markup changes diff the same way as .ex module changes." },
      { q: "Is my Elixir code uploaded?", a: "No. The comparison runs entirely in your browser, so private Phoenix apps stay on your device." },
    ],
  },
  {
    slug: "gleam-diff",
    eyebrow: "Gleam Diff",
    title: "Gleam Diff — Compare Two Gleam Files",
    description:
      "Compare two Gleam files or snippets and highlight every changed line and token. Free, client-side diff for the type-safe language on the BEAM.",
    intro:
      "Paste two versions of a .gleam file to see exactly what changed — a type signature, a case expression, a new custom type variant — with the changed tokens highlighted. Since Gleam has no null and no exceptions, most meaningful diffs are in the type signatures and case-match arms, which a plain text diff surfaces clearly.",
    format: "text",
    faq: [
      { q: "Does it understand Gleam's type system?", a: "No — it's a text diff, so it doesn't check types. It still shows exactly which type signature or case-match arm changed, which is what a code review actually needs." },
      { q: "Does it work for gleam.toml too?", a: "Yes, any plain-text file works — paste the manifest to see dependency or version changes the same way." },
      { q: "Is my Gleam source uploaded?", a: "No. Everything runs in your browser, so unreleased source stays private." },
    ],
  },
  {
    slug: "solidity-diff",
    eyebrow: "Solidity Diff",
    title: "Solidity Diff — Compare Two Smart Contract Files",
    description:
      "Compare two Solidity (.sol) smart contract files and highlight every changed line and token — including changes that affect an audit. Nothing uploaded.",
    intro:
      "Paste the old and new version of a .sol contract to see precisely which functions, modifiers, or storage variables changed before a re-audit or a deploy. Because even a reordered storage variable or a tightened `require` can change a contract's behavior or gas cost, a full, unhidden line-by-line diff matters more here than in most languages.",
    format: "text",
    faq: [
      { q: "Should I collapse unchanged lines for an audit?", a: "Turn that option off for contract review — an audit needs to see the full file in context, not just the changed hunks, since storage layout order matters for upgradeable contracts." },
      { q: "Does it catch storage-layout-breaking reorders?", a: "It shows the reorder as a line move, but doesn't itself flag storage-slot incompatibility — that judgment call is still yours (or your audit tool's) to make from the diff." },
      { q: "Is my contract source uploaded anywhere?", a: "No. The comparison runs entirely client-side, so unaudited or pre-launch contract code never leaves your device." },
    ],
  },
  {
    slug: "julia-diff",
    eyebrow: "Julia Diff",
    title: "Julia Diff — Compare Two Julia Files",
    description:
      "Compare two Julia files or snippets and highlight every changed line and token. Free, client-side — useful for reviewing multiple-dispatch method changes.",
    intro:
      "Paste two versions of a .jl file to see exactly what changed — a new method for an existing function, a type annotation, a broadcasted operation — with the changed tokens highlighted inline. Julia's multiple dispatch means the same function name can gain or lose methods without the call site changing at all, so seeing the exact method signature that changed is what matters most in review.",
    format: "text",
    faq: [
      { q: "Does it show which dispatch method changed?", a: "It shows the exact line(s) that changed — for a new or edited method that's the method signature itself, which is the part of a Julia diff that actually matters." },
      { q: "Does it work for Jupyter-exported .jl scripts?", a: "Yes, any plain-text .jl file diffs the same way, whether hand-written or exported from a notebook." },
      { q: "Is my Julia code uploaded?", a: "No. Everything runs locally in your browser, so research or proprietary numerical code stays on your device." },
    ],
  },
  {
    slug: "dockerfile-diff",
    eyebrow: "Dockerfile Diff",
    title: "Dockerfile Diff — Compare Two Dockerfiles",
    description:
      "Compare two Dockerfiles and see exactly which instructions, base images or layers changed, line by line. Free, client-side, nothing uploaded.",
    intro:
      "Paste the old and new Dockerfile to see precisely which FROM, RUN, COPY or ENV lines changed before you rebuild. Useful for reviewing a base-image bump or a multi-stage build refactor without pulling the branch locally.",
    format: "text",
    faq: [
      { q: "Does it understand Dockerfile syntax?", a: "No — it's a text diff, so it doesn't parse instructions. That's enough for reviewing a change: added, removed and changed lines are exactly what a Dockerfile review needs." },
      { q: "Is my Dockerfile uploaded?", a: "No. The comparison runs entirely in your browser, so internal build configs and private image names stay on your device." },
      { q: "Can it ignore reformatted comments?", a: "Turn on \"Ignore whitespace\" if reformatted comments or re-indented instructions are cluttering the diff." },
    ],
  },
  {
    slug: "docker-compose-diff",
    eyebrow: "docker-compose Diff",
    title: "docker-compose.yml Diff — Compare Files",
    description:
      "Compare two docker-compose.yml files and see exactly which services, ports or volumes changed. Free, browser-only, nothing uploaded.",
    intro:
      "Paste the old and new docker-compose.yml to see precisely which service definitions, ports, volumes or environment blocks changed before you redeploy. Because it's YAML, indentation carries meaning — the line-by-line view maps directly onto that.",
    format: "text",
    faq: [
      { q: "Is this different from the general YAML diff?", a: "Same engine, tuned for the docker-compose use case — reviewing a service, port or volume change before a redeploy — rather than generic YAML." },
      { q: "Does it validate the compose file?", a: "No — it's a text diff and doesn't check compose schema. Run \"docker compose config\" for validation; use this to review what changed." },
      { q: "Is my compose file uploaded?", a: "No. Everything runs in your browser, so internal service names, image tags and volume paths never leave your device." },
    ],
  },
  {
    slug: "env-diff",
    eyebrow: "ENV Diff",
    title: ".env File Diff — Compare Two Environment Files",
    description:
      "Compare two .env files and see exactly which variables were added, removed or changed — without ever uploading real secrets. Free, browser-only.",
    intro:
      "Paste two .env files to see which keys were added, dropped or given a new value. Because everything runs locally, it's safe to compare files containing real credentials — nothing is sent anywhere, ever.",
    format: "text",
    faq: [
      { q: "Is it safe to paste real secrets?", a: "The comparison runs entirely client-side with no network request, so pasted values never leave your browser. For maximum caution, you can still redact values and compare just the variable names." },
      { q: "Does it show only the changed keys?", a: "Switch to Unified view and use the change navigator to jump straight between added, removed and edited lines, skipping the variables that are identical on both sides." },
      { q: "Can it ignore quoting differences?", a: "Not automatically — a value that gained or lost quotes shows as changed, since that can matter for how it's parsed. Keep quoting consistent between the two files for the cleanest diff." },
    ],
  },
  {
    slug: "package-json-diff",
    eyebrow: "package.json Diff",
    title: "package.json Diff — Compare Two package.json Files",
    description:
      "Compare two package.json files and see exactly which dependencies, scripts or fields changed. Formatting-aware, free, nothing uploaded.",
    intro:
      "Paste two package.json files to see which dependencies were bumped, added or removed, and which scripts or fields changed — pretty-printed first so formatting noise doesn't hide the real diff.",
    format: "json",
    faq: [
      { q: "Does it flag version bumps clearly?", a: "Yes — a version string change on a dependency line shows up as a word-level highlight, so a patch bump versus a major bump is easy to spot at a glance." },
      { q: "Will key reordering show as a change?", a: "Diffhero pretty-prints both sides with the same formatting before comparing, so inconsistent indentation is normalised — but it preserves key order, so a genuine reorder still shows as changed." },
      { q: "Is my package.json uploaded?", a: "No. Everything runs in your browser, so private dependency names and internal package scopes never leave your device." },
    ],
  },
  {
    slug: "terraform-diff",
    eyebrow: "Terraform Diff",
    title: "Terraform Diff — Compare Two .tf Files",
    description:
      "Compare two Terraform files and see exactly which resources, variables or blocks changed before you plan or apply. Free, client-side.",
    intro:
      "Paste the old and new version of a .tf file to review what changed — a resource block, a variable default, a provider version — before running terraform plan. Nothing is uploaded, so private module and resource names stay local.",
    format: "text",
    faq: [
      { q: "Does this replace terraform plan?", a: "No — this diffs the source files themselves, not the planned infrastructure changes. Use it for a quick source review before you run plan, not as a substitute for it." },
      { q: "Can it ignore HCL formatting differences?", a: "Turn on \"Ignore whitespace\" if one file was run through terraform fmt and the other wasn't, so re-alignment doesn't obscure the real changes." },
      { q: "Is my Terraform code uploaded?", a: "No — the comparison runs entirely client-side, so internal module names, resource IDs and provider configs never leave your browser." },
    ],
  },
  {
    slug: "nginx-config-diff",
    eyebrow: "Nginx Config Diff",
    title: "Nginx Config Diff — Compare Two nginx.conf Files",
    description:
      "Compare two Nginx configuration files and see exactly which directives, server blocks or locations changed. Free, browser-only, nothing uploaded.",
    intro:
      "Paste the old and new nginx.conf (or a single server block) to see precisely which directives changed before you reload. A fast way to review a proxy, TLS or routing change without diffing on the server itself.",
    format: "text",
    faq: [
      { q: "Does it validate Nginx syntax?", a: "No — it's a text diff, so it won't catch a syntax error. Run nginx -t on the actual file for that; use this to review what changed between two versions." },
      { q: "Can I compare a single server block?", a: "Yes — paste just the block you care about on each side rather than the whole file, if that's a cleaner comparison for your use case." },
      { q: "Is my config uploaded?", a: "No. Everything runs in your browser, so internal hostnames, upstream addresses and TLS paths never leave your device." },
    ],
  },
  {
    slug: "ini-diff",
    eyebrow: "INI Diff",
    title: "INI / Config File Diff — Compare Two Config Files",
    description:
      "Compare two INI or config files and see exactly which sections and key-value pairs changed. Free, line-based, nothing uploaded.",
    intro:
      "Paste two .ini, .conf or .cfg files to see which sections were added, removed, or had a value changed. Works for any key=value or [section]-style config, from app settings to service files.",
    format: "text",
    faq: [
      { q: "What config formats does it work with?", a: "Any line-based key-value or bracketed-section format — INI, .conf, .cfg, Windows-style config, systemd unit files and similar all diff cleanly as text." },
      { q: "Can it ignore comment-line changes?", a: "Not automatically — a changed comment shows as a changed line, which is usually useful when reviewing what someone actually edited." },
      { q: "Is my config file uploaded?", a: "No — the comparison happens entirely in your browser, so internal service names, ports and credentials in the file never leave your device." },
    ],
  },
  {
    slug: "contract-diff",
    eyebrow: "Contract Diff",
    title: "Contract Diff — Compare Two Versions of a Contract",
    description:
      "Paste two versions of a contract or legal document and see every added, removed or changed clause — with the exact words highlighted. Free, nothing uploaded.",
    intro:
      "Paste the original and the redlined or renegotiated version of a contract to see exactly which clauses changed, word by word — without emailing a sensitive document to a third-party service.",
    format: "text",
    faq: [
      { q: "Is this a substitute for legal review?", a: "No — it's a text-comparison tool, not legal advice. Use it to quickly spot exactly which clauses changed so a reviewer can focus their attention, not to replace their judgment." },
      { q: "Can I drop the actual contract file in, or do I need to paste text?", a: "Both work — drag a .pdf or .docx file straight onto either side and the text is extracted automatically, or paste text you've already copied out. Either way, extraction happens locally in your browser." },
      { q: "Is my contract uploaded anywhere?", a: "No. The whole comparison — including PDF/Word text extraction — runs client-side in your browser. Nothing is sent to a server, which matters for confidential or privileged documents." },
      { q: "Can it handle a long document?", a: "Yes — paste the full text of both versions. For very long contracts, comparing one section at a time can make the highlighted changes easier to review." },
    ],
  },
  {
    slug: "resume-diff",
    eyebrow: "Resume Diff",
    title: "Resume Diff — Compare Two Versions of a Resume",
    description:
      "Paste two versions of a resume or CV and see exactly what changed — wording, dates, bullet points — highlighted word by word. Free, nothing uploaded.",
    intro:
      "Paste an old and a revised version of your resume to see precisely what changed between drafts — a reworded bullet, an updated date range, a trimmed section — so you can track edits across revisions or compare notes with a reviewer.",
    format: "text",
    faq: [
      { q: "Does it work with a PDF or Word doc?", a: "Yes, two ways: drag the actual .pdf or .docx file straight onto either side and Diffhero extracts the text for you, or copy the text out yourself and paste it in. Either way it's the text content being compared, not the file's layout or formatting." },
      { q: "Will formatting differences show as changes?", a: "Line breaks and spacing from copy-pasting can show as differences. Turn on \"Ignore whitespace\" to focus on actual wording changes instead." },
      { q: "Is my resume uploaded?", a: "No — everything runs in your browser, so personal and contact details never leave your device." },
    ],
  },
  {
    slug: "essay-diff",
    eyebrow: "Essay Diff",
    title: "Essay Diff — Compare Two Drafts of an Essay",
    description:
      "Paste two drafts of an essay or article and see exactly which sentences and words changed between them. Free, browser-only, nothing uploaded.",
    intro:
      "Paste an earlier draft and a revised one to see exactly what changed — a reworded sentence, a cut paragraph, a tightened argument — highlighted word by word, so you can track your own revisions or review someone else's edit.",
    format: "text",
    faq: [
      { q: "Does it work for any length of writing?", a: "Yes — a paragraph, a full essay, or a long article all work the same way; very long drafts may take a moment longer to render." },
      { q: "Can I drop a .docx file instead of pasting?", a: "Yes — drag the Word file straight onto either side and Diffhero extracts its text automatically. A plain paste works just as well if you already have the text." },
      { q: "Will a reflowed paragraph show as fully changed?", a: "Line-based diffing can flag a re-wrapped paragraph as changed even if only a few words moved — the inline word highlighting still shows exactly which words differ within it." },
      { q: "Is my writing uploaded?", a: "No. The comparison runs entirely in your browser, so unpublished drafts stay private." },
    ],
  },
  {
    slug: "pdf-diff",
    eyebrow: "PDF Diff",
    title: "PDF Diff — Compare Two PDF Files Online",
    description:
      "Drop two PDF files in and see exactly what changed between them, text and word highlighted. Free, browser-only — the PDFs are never uploaded, only read locally.",
    intro:
      "Drag two PDF files onto the boxes below — Diffhero extracts the text from each locally in your browser (using the open-source pdf.js library, loaded on demand) and shows exactly what changed, word by word. Nothing about the files themselves is uploaded; only the extracted text is compared.",
    format: "text",
    faq: [
      { q: "Does it compare the visual layout, or just the text?", a: "Just the text content, in reading order — page position, fonts, and images aren't compared. For a contract or report where the wording is what matters, that's usually exactly what you want; for a design proof where layout matters, a visual diff tool would serve you better." },
      { q: "Is my PDF uploaded to a server?", a: "No. Text extraction runs entirely in your browser via pdf.js (fetched from a CDN the first time you drop a file, same as this page's fonts) — the PDF itself is read locally and never leaves your device." },
      { q: "What if a PDF is scanned images rather than real text?", a: "Extraction only works on PDFs with a real text layer. A scanned document with no OCR applied will extract as empty or garbled text — you'd need to run OCR first with a separate tool." },
    ],
  },
  {
    slug: "word-diff",
    eyebrow: "Word Diff",
    title: "Word Document Diff — Compare Two .docx Files Online",
    description:
      "Drop two Word (.docx) files in and see exactly what changed between them, word by word. Free, browser-only — nothing is uploaded, only read locally.",
    intro:
      "Drag two .docx files onto the boxes below — Diffhero extracts the text from each locally in your browser (using the open-source mammoth.js library, loaded on demand) and shows precisely what changed. Only the extracted text is compared; the files themselves never leave your device.",
    format: "text",
    faq: [
      { q: "Does it preserve formatting like bold or track changes?", a: "No — it extracts plain text content only, not formatting, styles, or Word's own tracked-changes markup. If a document already has Word's Track Changes turned on, Word's own review view will show more than this tool does." },
      { q: "Does it work with the old .doc format too?", a: "Only .docx (the modern, XML-based format). The legacy binary .doc format isn't supported — save it as .docx from Word first (File → Save As → Word Document) if you have an older file." },
      { q: "Is my document uploaded anywhere?", a: "No. Extraction runs entirely in your browser via mammoth.js (fetched from a CDN the first time you drop a file) — the file is read locally and never sent to a server." },
    ],
  },
  {
    slug: "private-diff-checker",
    eyebrow: "Private Diff Checker",
    title: "Private Diff Checker — Nothing Uploaded",
    description:
      "A diff checker that never uploads what you paste — the entire comparison runs client-side in your browser. Free, no signup, no server round-trip.",
    intro:
      "Built for text you can't paste into a random website — client code, internal docs, contracts, credentials. Diffhero runs the whole comparison in JavaScript in your browser; nothing is sent to a server, ever. Check your browser's Network tab to confirm it yourself.",
    format: "text",
    faq: [
      { q: "How can I verify nothing is uploaded?", a: "Open your browser's DevTools → Network tab before pasting, then run a comparison. You'll see no request carrying your text — the whole diff happens locally in JavaScript." },
      { q: "Does it work offline?", a: "Yes, once the page has loaded. Since the comparison logic runs entirely client-side, you can disconnect from the internet and it still works." },
      { q: "Is there a paid \"private\" tier?", a: "No — every comparison on Diffhero works this way. There's no free tier that phones home and a paid tier that doesn't; it's all local, always." },
    ],
  },
  {
    slug: "log-diff",
    eyebrow: "Log Diff",
    title: "Log Diff — Compare Two Log Files",
    description:
      "Compare two log files and see exactly which lines were added, removed or changed between them. Free, line-based, nothing uploaded.",
    intro:
      "Paste two log exports — before and after a deploy, or two runs of the same job — to see exactly which lines differ. Useful for spotting a new error, a missing line, or a changed pattern without scrolling through both by eye.",
    format: "text",
    faq: [
      { q: "Can it ignore timestamp differences?", a: "Not automatically, since timestamps are usually meaningful. If every line has a unique timestamp prefix and that's cluttering the diff, strip the timestamp column from both files first." },
      { q: "How large a log can I compare?", a: "Thousands of lines work smoothly. Very large logs (hundreds of thousands of lines) may pause briefly, since the whole comparison runs in your browser." },
      { q: "Is my log data uploaded?", a: "No — the comparison runs entirely client-side, so logs containing internal hostnames, IPs or stack traces never leave your device." },
    ],
  },
  {
    slug: "git-diff-viewer",
    eyebrow: "Git Diff Viewer",
    title: "Git Diff Viewer — Paste a `git diff` to Visualize It",
    description:
      "Paste raw `git diff` / unified-diff output and see it rendered as a clean side-by-side or unified view, with word-level highlighting. Free, browser-only.",
    intro:
      "Paste the output of `git diff`, a GitHub/GitLab patch, or any unified-diff text into the box below and click Parse — Diffhero reconstructs the original and changed versions and renders them the same way as every other page here, split or unified, with word-level highlighting.",
    format: "text",
    pasteDiff: true,
    faq: [
      { q: "What counts as a \"unified diff\"?", a: "The format `git diff`, `diff -u`, and GitHub/GitLab patch downloads all produce: a `@@ ... @@` hunk header, context lines with a leading space, removed lines starting with `-`, and added lines starting with `+`. That's what gets parsed here." },
      { q: "Does it handle a diff covering multiple files?", a: "It reconstructs all hunks it finds, but multiple files get concatenated into one Original/Changed pair rather than kept separate — for a multi-file diff, it's cleanest to paste one file's section at a time." },
      { q: "What if I don't have a real diff, just two files?", a: "You don't need this page at all then — paste the two versions directly into the Original/Changed boxes on any regular diff page instead; this page exists specifically for when you already have diff-formatted output." },
      { q: "Is the pasted diff uploaded anywhere?", a: "No — parsing and rendering both happen entirely in your browser." },
    ],
  },
  {
    slug: "subtitle-diff",
    eyebrow: "Subtitle Diff",
    title: "Subtitle Diff — Compare Two SRT or VTT Files",
    description:
      "Compare two subtitle files and see exactly which lines, timings or text changed between them. Free, browser-only, nothing uploaded.",
    intro:
      "Paste two .srt or .vtt subtitle files to see which timestamps or caption text changed between them — useful for reviewing a translation pass, a re-sync, or a captioning edit.",
    format: "text",
    faq: [
      { q: "Does it work for both SRT and VTT?", a: "Yes — both are line-based text formats, so they compare the same way." },
      { q: "Can it ignore timestamp-only changes?", a: "Not automatically — a re-synced timestamp shows as a changed line even if the caption text is identical. Compare just the caption text (stripped of timestamps) if you only care about wording." },
      { q: "Is my subtitle file uploaded?", a: "No. Everything runs in your browser, so unreleased scripts and captions stay private." },
    ],
  },
  {
    slug: "invisible-character-checker",
    eyebrow: "Invisible Characters",
    title: "Invisible Character Checker",
    description:
      "Two strings look identical but a comparison says they differ? Find the hidden non-breaking spaces, zero-width characters and smart quotes. Free, client-side.",
    intro:
      "Paste both versions and turn on “Show invisibles” in the toolbar: non-breaking spaces render as ⍽, zero-width characters as ∅, and tabs as →, so the character your eye can't see becomes the change you can. These sneak in constantly — Word and Google Docs convert straight quotes to curly ones, web pages copy out non-breaking spaces, and AI chat output often carries zero-width characters — and they make string comparisons, config parsers and spreadsheet lookups fail on text that looks identical. Use Find & replace below the tool to strip the culprit once you've spotted it.",
    format: "text",
    faq: [
      { q: "What invisible characters does it reveal?", a: "Non-breaking spaces (U+00A0, plus the narrow and figure variants), zero-width space/joiner/non-joiner (U+200B–U+200D), word joiner, the byte-order mark (U+FEFF), soft hyphens and tabs. Each renders as a distinct visible symbol with a tooltip naming it." },
      { q: "Where do these characters come from?", a: "The usual suspects: copying from Word or Google Docs (curly quotes, non-breaking spaces), copying from web pages (non-breaking spaces in prices and names), and text produced by chat AI tools (zero-width characters). Keyboards can also type them — Option+Space on a Mac inserts a non-breaking space." },
      { q: "How do I remove them once found?", a: "Open Find & replace under the tool, paste the offending character into Find (copy it straight from your text), leave Replace empty, and apply to both sides. For non-breaking spaces, replace with a normal space instead so words don't merge." },
    ],
  },
  {
    slug: "protobuf-diff",
    eyebrow: "Protobuf Diff",
    title: "Protobuf Diff — Compare Two .proto Schema Files",
    description:
      "Compare two Protocol Buffers (.proto) schema files and see exactly which fields, tags, or messages changed — including changes that break wire compatibility. Nothing uploaded.",
    intro:
      "Paste the old and new version of a .proto file to see precisely which message, field, or tag number changed before you ship a schema update. Protobuf's wire format depends on field numbers staying stable — a renumbered or removed field tag can silently break compatibility between an old client and a new server even though the .proto file still \"looks\" similar, so seeing the exact line that changed matters more here than the file's surface syntax.",
    format: "text",
    faq: [
      { q: "Can this tell me if a schema change breaks wire compatibility?", a: "It shows you exactly which lines changed — a reused or renumbered field tag, a field removed instead of marked reserved, a changed type on an existing tag — but it's a text diff, not a protobuf compiler, so judging whether a specific change is breaking is still yours to make from what it highlights." },
      { q: "What should I look for in the diff to catch a breaking change?", a: "Field tag numbers (the `= 1`, `= 2` at the end of each field) that were reused or renumbered, a field deleted without being added to `reserved`, and a field's type changed to one that isn't wire-compatible with the old type — all show up as ordinary changed lines." },
      { q: "Does it work for proto2 and proto3?", a: "Yes — both are plain text, so a `.proto` file compares the same way regardless of syntax version." },
      { q: "Is my schema uploaded anywhere?", a: "No. The comparison runs entirely in your browser, so an unreleased API schema never leaves your device." },
    ],
  },
  {
    slug: "image-diff",
    eyebrow: "Image Diff",
    title: "Image Diff — Compare Two Images Pixel by Pixel",
    description:
      "Drop two images in and see exactly which pixels changed, highlighted over the original. Free, browser-only — nothing is ever uploaded.",
    intro:
      "Drop two images onto the boxes below to see exactly what changed between them — every pixel that differs is highlighted, so a moved button, a shifted line of text, or a recolored icon jumps out instead of hiding in a side-by-side squint test. Comparison happens entirely on canvas in your browser; neither image is ever uploaded anywhere.",
    shape: "image",
    faq: [
      { q: "What counts as a \"different\" pixel?", a: "Each pixel's red, green, blue and alpha values are compared between the two images; if the combined difference passes a small threshold (to absorb harmless compression noise), it's marked as changed and highlighted in the result." },
      { q: "What if the two images are different sizes?", a: "The comparison canvas is sized to the larger of the two images; any area only one image covers counts as fully different, so a resized or cropped image will show a highlighted border or region rather than failing outright." },
      { q: "Are my images uploaded anywhere?", a: "No. Both images are decoded and compared entirely on an in-browser <canvas> element — nothing is sent to a server, and the comparison works offline once the page has loaded." },
      { q: "What image formats are supported?", a: "Anything your browser can decode natively — PNG, JPEG, WebP, GIF (first frame) and SVG all work, since the comparison operates on decoded pixel data, not the file format itself." },
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
  "typescript-diff": "javascript", "go-diff": "go", "java-diff": "java", "php-diff": "php",
  "csharp-diff": "csharp", "rust-diff": "rust", "kotlin-diff": "kotlin", "css-diff": "css",
  "package-json-diff": "json", "docker-compose-diff": "yaml", "swift-diff": "swift",
};

// Every value here must have a matching <option> below — app.js falls back to
// "plain" for any data-lang value that isn't a real dropdown option (the
// browser can't select a <select> to a value with no matching <option>).
const LANG_OPTIONS = [
  ["plain", "Plain text"], ["clike", "Code (C-like)"], ["javascript", "JavaScript / TS"],
  ["python", "Python"], ["json", "JSON"], ["html", "HTML / XML"], ["xml", "XML"], ["css", "CSS"],
  ["sql", "SQL"], ["yaml", "YAML"], ["go", "Go"], ["java", "Java"], ["php", "PHP"],
  ["csharp", "C#"], ["rust", "Rust"], ["kotlin", "Kotlin"], ["swift", "Swift"],
];

export function renderTool(p = {}) {
  // Merge/conflict resolver is a genuinely different tool shape — three
  // inputs (base/mine/theirs) and a merged-with-conflict-markers result,
  // not a two-way diff. Its own early return, same reasoning as every other
  // shape branch: it has nothing in common with the 2-way diff markup below.
  if (p.shape === "merge") {
    return `
  <section class="tool mergetool" data-slug="${p.slug || ""}">
    <div class="merge-inputs">
      <div class="diff-pane" data-side="base">
        <div class="diff-pane-head"><label class="diff-label" for="mergeBase">Base (original)</label></div>
        <textarea id="mergeBase" class="editor code" placeholder="Paste the common ancestor version here…" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      </div>
      <div class="diff-pane" data-side="mine">
        <div class="diff-pane-head"><label class="diff-label" for="mergeMine">Mine</label></div>
        <textarea id="mergeMine" class="editor code" placeholder="Paste your changed version here…" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      </div>
      <div class="diff-pane" data-side="theirs">
        <div class="diff-pane-head"><label class="diff-label" for="mergeTheirs">Theirs</label></div>
        <textarea id="mergeTheirs" class="editor code" placeholder="Paste the other changed version here…" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      </div>
    </div>
    <div class="tool-bar">
      <span class="merge-summary" id="mergeSummary" role="status" aria-live="polite"></span>
    </div>
    <label for="mergeOutput">Merged result</label>
    <pre class="editor code merge-output" id="mergeOutput" aria-live="polite"></pre>
    <div class="tool-actions">
      <button type="button" class="btn" id="mergeExampleBtn">Load example</button>
      <button type="button" class="btn" id="mergeCopyBtn">Copy merged result</button>
      <button type="button" class="btn" id="mergeClearBtn">Clear</button>
    </div>
  </section>`;
  }

  // CSV table diff: renders an actual aligned <table>, cell by cell, instead
  // of treating rows as plain text lines like the regular csv-diff page does.
  if (p.shape === "csv-table") {
    return `
  <section class="tool csvtable-tool" data-slug="${p.slug || ""}">
    <div class="diff-inputs">
      <div class="diff-pane" data-side="a">
        <div class="diff-pane-head"><label class="diff-label" for="csvA">Original CSV</label></div>
        <textarea id="csvA" class="editor code" placeholder="Paste the original CSV here…" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      </div>
      <div class="diff-pane" data-side="b">
        <div class="diff-pane-head"><label class="diff-label" for="csvB">Changed CSV</label></div>
        <textarea id="csvB" class="editor code" placeholder="Paste the changed CSV here…" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      </div>
    </div>
    <div class="tool-bar">
      <span class="merge-summary" id="csvTableSummary" role="status" aria-live="polite"></span>
    </div>
    <div id="csvTableOutput"></div>
    <div class="tool-actions">
      <button type="button" class="btn" id="csvExampleBtn">Load example</button>
      <button type="button" class="btn" id="csvClearBtn">Clear</button>
    </div>
  </section>`;
  }

  // Image diff: a genuinely different shape again — two file drops, a canvas
  // pixel comparison, and a visual (not textual) result.
  if (p.shape === "image") {
    return `
  <section class="tool imagetool" data-slug="${p.slug || ""}">
    <div class="diff-inputs image-diff-inputs">
      <div class="diff-pane image-pane" data-side="a">
        <div class="diff-pane-head"><label class="diff-label" for="imgA">Original image</label></div>
        <label class="image-drop" for="imgA" id="imgADrop">
          <span class="image-drop-hint">Click, or drag an image here</span>
          <img id="imgAPreview" alt="" hidden>
        </label>
        <input type="file" id="imgA" accept="image/*" class="sr-only">
      </div>
      <div class="diff-pane image-pane" data-side="b">
        <div class="diff-pane-head"><label class="diff-label" for="imgB">Changed image</label></div>
        <label class="image-drop" for="imgB" id="imgBDrop">
          <span class="image-drop-hint">Click, or drag an image here</span>
          <img id="imgBPreview" alt="" hidden>
        </label>
        <input type="file" id="imgB" accept="image/*" class="sr-only">
      </div>
    </div>
    <div class="tool-bar">
      <label class="opt"><input type="range" id="imgThreshold" min="0" max="128" value="24"> <span id="imgThresholdLabel">Sensitivity: 24</span></label>
      <span class="diff-summary" id="imageDiffSummary" role="status" aria-live="polite"></span>
    </div>
    <canvas id="imageDiffCanvas" class="image-diff-canvas" hidden></canvas>
    <div class="tool-actions">
      <button type="button" class="btn" id="imgExampleBtn">Load example</button>
      <button type="button" class="btn" id="imgDownloadBtn" disabled>Download diff image</button>
      <button type="button" class="btn" id="imgClearBtn">Clear</button>
    </div>
  </section>`;
  }

  const format = p.format || "text";
  const lang = p.lang || LANG_BY_SLUG[p.slug] || "plain";
  const langOpts = LANG_OPTIONS.map(
    ([v, label]) => `<option value="${v}"${v === lang ? " selected" : ""}>${label}</option>`
  ).join("");
  // Optional: a single "paste a git diff" box above the normal two-pane tool,
  // which parses a unified-diff blob into Original/Changed and fills those
  // panes — reusing the entire existing diff engine/UI rather than building
  // a separate renderer for it. Gated per-page so every other page is unaffected.
  const pasteDiffBox = p.pasteDiff ? `
    <div class="paste-diff-box">
      <label class="diff-label" for="pasteDiffInput">Paste a unified diff / \`git diff\` output</label>
      <textarea id="pasteDiffInput" class="editor code" placeholder="diff --git a/file.js b/file.js&#10;--- a/file.js&#10;+++ b/file.js&#10;@@ -1,3 +1,3 @@&#10; unchanged line&#10;-old line&#10;+new line" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      <div class="tool-actions">
        <button type="button" class="btn primary" id="pasteDiffParseBtn">Parse into Original / Changed</button>
      </div>
      <p class="paste-diff-error" id="pasteDiffError" role="alert"></p>
    </div>` : "";
  return `
  <section class="tool difftool" data-format="${format}" data-lang="${lang}" data-slug="${p.slug || ""}">
    ${pasteDiffBox}
    <div class="diff-inputs">
      <div class="diff-pane" data-side="a">
        <div class="diff-pane-head">
          <label class="diff-label" for="original">Original</label>
          <span class="diff-drop-hint">paste, type, or drop a file (.txt, .pdf, .docx)</span>
        </div>
        <textarea id="original" class="editor code" placeholder="Paste the original version here…" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
      </div>
      <div class="diff-pane" data-side="b">
        <div class="diff-pane-head">
          <label class="diff-label" for="changed">Changed</label>
          <span class="diff-drop-hint">paste, type, or drop a file (.txt, .pdf, .docx)</span>
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
      <label class="opt"><input type="checkbox" id="optChar" title="Mark the exact changed characters inside a changed word, not just the word"> Character detail</label>
      <label class="opt"><input type="checkbox" id="optInv" title="Render invisible characters (non-breaking spaces, zero-width characters, tabs) as visible symbols"> Show invisibles</label>
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
      <button type="button" class="btn" id="printBtn" title="Prints only the diff result — use your browser's 'Save as PDF' destination for a PDF report">Print / PDF</button>
      <button type="button" class="btn" id="clearBtn">Clear</button>
    </div>
    <details class="fr">
      <summary>Find &amp; replace</summary>
      <div class="fr-row">
        <input type="text" id="frFind" placeholder="Find (exact text)" autocomplete="off">
        <input type="text" id="frRepl" placeholder="Replace with" autocomplete="off">
        <button type="button" class="btn" id="frA">Original</button>
        <button type="button" class="btn" id="frB">Changed</button>
        <button type="button" class="btn" id="frBoth">Both</button>
      </div>
    </details>
    <div class="diff-output" id="diffOutput" aria-live="polite"></div>
  </section>`;
}
