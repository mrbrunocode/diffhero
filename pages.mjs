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
    howto: [
      "Paste or type the original version into the left box, and the changed version into the right.",
      "Read the result: additions and deletions are colour-coded, and the exact changed words are highlighted inside each changed line.",
      "Turn on \"Ignore whitespace\" or \"Ignore case\" if reformatting or capitalisation is drowning out the real edits.",
      "Switch between Split and Unified view, and use the up and down arrows to jump between changes.",
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
      { q: "Is Python's indentation handled properly?", a: "Yes — the line-by-line view lines up directly with the logic that changed, which is what you want for indentation-sensitive languages like Python and YAML." },
      { q: "Can I diff a schema or contract where field order matters?", a: "Yes, and for those a plain line-level diff is the safer choice precisely because it hides nothing. A renumbered Protobuf field tag or a reordered Solidity storage variable can silently break wire compatibility or change gas cost — you want to see the literal lines, not a semantically \"tidied\" view." },
    ],
  },
  /*
   * Consolidation target for six per-format config pages (Dockerfile,
   * docker-compose, nginx, Terraform, Protobuf, INI), removed 2026-07-29.
   *
   * All six were `format: "text"` — the identical tool with different prose —
   * and Search Console had 51 of diffhero's 55 URLs sitting in "Discovered –
   * currently not indexed" with zero Google organic sessions. Splitting one
   * tool across dozens of near-identical URLs is what triggers that judgement,
   * so the crawl budget now points at one page per genuine intent instead.
   *
   * Note this was NOT a thin-content cull: those pages measured 93–95% unique
   * prose. They were merged because the *intent* was one intent, and their
   * format-specific detail is preserved in the section below.
   */
  {
    slug: "config-diff",
    eyebrow: "Config Diff",
    title: "Config File Diff — Compare Dockerfiles, Terraform, nginx & INI",
    description:
      "Compare two config files — Dockerfile, docker-compose.yml, Terraform, nginx.conf, .proto or .ini — and see exactly which directives changed. Client-side, nothing uploaded.",
    intro:
      "Paste the old and new version of a config file to see precisely which lines changed before you rebuild, reload or redeploy. Nothing is uploaded, so private module names, hostnames and service definitions stay on your device.",
    format: "text",
    faq: [
      { q: "Which config formats does this handle?", a: "Any text-based config: Dockerfile, docker-compose.yml, Terraform .tf, nginx.conf, .proto schemas, and any key=value or [section]-style .ini/.conf/.cfg file. The diff is on the text, so the format doesn't need to be declared." },
      { q: "Why not use a format-aware diff?", a: "For config, a literal line-level diff is usually what you want — it hides nothing. A semantically \"tidied\" view can mask exactly the change that matters, like a renumbered Protobuf field tag or a reordered block." },
      { q: "Is my config uploaded anywhere?", a: "No. The comparison runs entirely in your browser, so private infrastructure details — internal hostnames, resource names, environment values — never leave your device." },
      { q: "Does indentation matter for docker-compose?", a: "Yes, it's YAML, so indentation carries meaning — and the line-by-line view maps directly onto that. Leave \"Ignore whitespace\" off when indentation itself is what you're checking." },
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
    howto: [
      "Paste the common ancestor of the file into Base (original) — the version both sides started from.",
      "Paste your version into Mine, and the other version into Theirs.",
      "Read the Merged result: non-overlapping changes from both sides are combined automatically, and genuine conflicts are marked for you to decide.",
      "Resolve each marked conflict, then use Copy merged result to take the finished file back to your editor.",
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
    howto: [
      "Paste the first export into Original CSV and the second into Changed CSV.",
      "Read the comparison as an aligned table rather than raw text: added rows, removed rows and edited cells are marked in place.",
      "Check that both exports use the same column order — a reordered header changes which cells line up.",
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
    slug: "prompt-diff",
    eyebrow: "Prompt Diff",
    title: "Prompt Diff — Compare Two AI Prompt Versions",
    description:
      "Paste two versions of an AI prompt or system prompt and see exactly what changed, word by word. Free, browser-only, nothing uploaded.",
    intro:
      "Paste an earlier and a revised version of a prompt — a system prompt, a few-shot example set, an instruction block — to see precisely what changed between them, highlighted word by word, so you can track what an edit actually did to a prompt's wording instead of re-reading the whole thing side by side.",
    format: "text",
    faq: [
      { q: "Why does this matter for prompt engineering specifically?", a: "A single reworded sentence in a system prompt can change a model's behavior in ways that are easy to miss by eye when the prompt is long — a word-level diff makes the exact change visible instead of relying on spotting it in a wall of text." },
      { q: "Does it handle a prompt with example blocks or XML tags in it?", a: "Yes — it's a plain text diff, so any structure inside the prompt (XML tags, markdown, fenced code, JSON examples) is preserved and compared exactly as written, tags included." },
      { q: "Is my prompt uploaded anywhere?", a: "No — the comparison runs entirely in your browser, so a proprietary system prompt or an unreleased product's instructions never leave your device." },
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
    howto: [
      "Drag one PDF onto the left box and the other onto the right — the text is extracted locally in your browser, so neither file is uploaded.",
      "Wait a moment for extraction on longer documents; the text appears in the boxes once it is done.",
      "Read the highlighted comparison: added and removed passages are colour-coded, with changed words marked inline.",
      "Turn on \"Ignore whitespace\" if the two PDFs wrap or space text differently, which is common between exports.",
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
    howto: [
      "Paste the output of `git diff`, a GitHub or GitLab patch, or any unified-diff text into the box.",
      "Click \"Parse into Original / Changed\" to reconstruct both sides of the patch from the diff text.",
      "Read the rebuilt comparison in Split or Unified view, with word-level highlighting inside each changed line.",
      "Use the Original / Changed / Both toggle to read either reconstructed side on its own.",
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
    howto: [
      "Drop the original file onto Original image and the new one onto Changed image.",
      "Read the highlighted mask: every pixel that differs between the two images is marked, so a shifted element or a changed colour is obvious.",
      "Use Download diff image to save the highlighted comparison, for a bug report or a design review.",
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
    <label class="diff-label merge-output-label" for="mergeOutput">Merged result</label>
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
        <span class="change-count" id="changeCount" aria-live="polite"></span>
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

/**
 * The sidebar taxonomy: the 50 collection pages grouped into named families.
 *
 * WHY THIS EXISTS AS DATA RATHER THAN AS MARKUP: the persistent tool rail on
 * every page renders from this, so the navigation and the page set cannot
 * drift apart — a new PAGES row that nobody files into a group fails the
 * "every slug is in exactly one group" test rather than quietly vanishing
 * from the site's navigation.
 *
 * Order matters twice over: within a group it is the display order in the
 * rail, and across groups it is the reading order of the whole index (general
 * tools first, then the things people arrive looking for by name).
 */
export const GROUPS = [
  {
    name: "General",
    slugs: ["online-diff-checker", "code-diff", "compare-two-lists", "private-diff-checker"],
  },
  {
    name: "Merge & patch",
    slugs: ["merge-conflict-resolver", "git-diff-viewer"],
  },
  {
    name: "Data",
    slugs: ["json-diff", "csv-diff", "csv-table-diff", "xml-diff", "yaml-diff", "sql-diff"],
  },
  {
    name: "Markup & styles",
    slugs: ["markdown-diff", "html-diff", "css-diff"],
  },
  // The "Languages" group (16 slugs, python-diff … julia-diff) was removed
  // 2026-07-29 and folded into code-diff, which those pages' own descriptions
  // already admitted was the same thing — every one of them was
  // `format: "text"` and described itself as "language-agnostic". Six config
  // pages went the same way into config-diff. See the comment beside the
  // config-diff entry in PAGES for the indexation reasoning.
  {
    name: "Config & DevOps",
    slugs: ["config-diff", "env-diff", "package-json-diff", "log-diff"],
  },
  {
    name: "Documents",
    slugs: ["contract-diff", "resume-diff", "essay-diff", "pdf-diff", "word-diff", "subtitle-diff"],
  },
  {
    name: "AI & prompts",
    slugs: ["prompt-diff"],
  },
  {
    name: "Inspect",
    slugs: ["image-diff", "invisible-character-checker"],
  },
];

/** slug → group name, for the "you are here" state in the rail. */
export const GROUP_OF = Object.fromEntries(
  GROUPS.flatMap((g) => g.slugs.map((s) => [s, g.name])),
);
