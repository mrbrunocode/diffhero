/**
 * Per-page supporting content ("guide"), keyed by slug. Rendered on each
 * collection page between the tool and the FAQ (see engine/build.mjs, the
 * `${p.extra || GUIDES[p.slug] || ""}` line). Every block is written for its
 * specific format or language — the whole point is that no two pages share
 * this section, so each URL is a genuinely useful, standalone page rather than
 * a thin "same tool, one word swapped" duplicate. Keep them concrete: real
 * format gotchas, real reasons to reach for the tool, real trade-offs. HTML is
 * emitted as-is, so it must be valid and self-contained.
 *
 * Wrap each block in <section class="guide">…</section>. Use <h2> for the lead
 * heading and <h3> for sub-points; <ul>/<ol> for lists.
 */

const g = (html) => `\n  <section class="guide">${html}\n  </section>`;

// Shared closing note reused verbatim would be a duplication signal, so each
// block writes its own; this helper only exists to keep the privacy point
// consistent in wording where a page genuinely needs to make it.
export const GUIDES = {
  "text-compare": g(`
    <h2>Comparing two blocks of text, line by line</h2>
    <p>A text compare is the most general form of diff: paste an original and a changed version, and it lines them up and highlights exactly what moved, what was added, and what was removed — down to the individual words within a changed line, not just "this line is different."</p>
    <p>It's the right tool whenever you have two versions of the same prose and need to see precisely what changed: two drafts of an email or a policy, a document someone returned with edits, a block of config someone pasted into chat, or two copies of a list you suspect have quietly drifted apart.</p>
    <h3>Getting a clean result</h3>
    <ul>
      <li><b>Ignore whitespace</b> when re-wrapping or re-indentation is drowning out the real edits — it collapses spacing noise so only substantive changes show.</li>
      <li><b>Ignore case</b> when a difference in capitalisation isn't a change you care about.</li>
      <li>Switch between <b>split</b> (side-by-side) and <b>unified</b> (one column) depending on whether you're eyeballing structure or reading changes in reading order.</li>
    </ul>
    <p>Everything runs in your browser — the two texts are never uploaded, so it's safe for anything confidential.</p>`),

  "compare-two-text-files": g(`
    <h2>Comparing two files without a desktop diff tool</h2>
    <p>Sometimes you just have two files — <code>report-v1.txt</code> and <code>report-v2.txt</code>, two exports, two copies of the same document — and you want to know what changed without installing a diff app or firing up the command line. Drop both files in (or paste their contents) and the changed lines and words are highlighted immediately.</p>
    <p>Because it accepts <code>.txt</code>, <code>.pdf</code> and <code>.docx</code>, you can compare files that aren't plain text at all — the text is extracted in your browser and diffed, so a Word document and a PDF of the "same" letter can be lined up side by side.</p>
    <h3>When file comparison beats a manual read</h3>
    <ul>
      <li>Two exports from a system that "shouldn't" differ, to catch a silent change.</li>
      <li>A document that came back from review with no tracked changes turned on.</li>
      <li>Confirming a "final" file really is identical to the one you signed off on.</li>
    </ul>
    <p>Nothing is uploaded: the files are read and compared locally, which matters when they're contracts, drafts, or anything you'd rather not send to a server.</p>`),

  "online-diff-checker": g(`
    <h2>What a diff checker actually does</h2>
    <p>A diff checker takes two versions of some text and computes the smallest set of insertions and deletions that turns one into the other — then shows you that as highlights instead of making you hunt for changes by eye. It's the same idea behind the <code>diff</code> command and the review view on GitHub, without any setup.</p>
    <h3>Reading the output</h3>
    <ul>
      <li><b>Removed</b> content (in the original but not the changed version) and <b>added</b> content are colour-coded so you can see direction at a glance.</li>
      <li><b>Word-level</b> highlighting within a changed line pinpoints the exact token that moved, so a one-character fix doesn't light up the whole line.</li>
      <li><b>Collapse unchanged</b> hides the untouched stretches so a small change in a large file isn't buried.</li>
    </ul>
    <p>Reach for it any time you need to answer "what changed between these two?" — code, prose, config, data, or a copied-and-pasted block someone swears they didn't touch. It's browser-only, so nothing you paste leaves your machine.</p>`),

  "code-diff": g(`
    <h2>Diffing code snippets in any language</h2>
    <p>This is for the quick case that doesn't warrant a commit: a snippet a colleague pasted in chat versus the one in your editor, a Stack Overflow answer versus your adaptation of it, or "before and after" of a function you're refactoring. Paste both and the changed tokens are highlighted precisely.</p>
    <p>It's language-agnostic because it compares the text, so it works for anything your editor does. Turn on syntax highlighting for the language you're working in to make the diff easier to read, but the comparison itself doesn't depend on it.</p>
    <h3>Tips for code specifically</h3>
    <ul>
      <li>Use <b>Ignore whitespace</b> when a reformat or re-indent is obscuring the real logic change — but leave it <i>off</i> for whitespace-sensitive languages like Python or YAML, where indentation is meaningful.</li>
      <li><b>Show invisibles</b> reveals tabs-vs-spaces and trailing whitespace, a common source of "identical but not equal" confusion.</li>
    </ul>
    <h3>The small tokens that matter, by language</h3>
    <p>The diff is the same whatever you paste. What changes is which one-character edits carry real behaviour, and are therefore worth slowing down for:</p>
    <ul>
      <li><b>Python</b> — tabs vs spaces, trailing whitespace and blank-line changes, and above all a dedent that silently pulls a line out of a block. Never ignore whitespace here.</li>
      <li><b>JavaScript</b> — semicolon and comma changes, quote style, and arrow-vs-<code>function</code> rewrites that change what <code>this</code> binds to.</li>
      <li><b>TypeScript</b> — type annotations and interfaces, <code>import type</code> changes, and Prettier noise drowning the real edit. TSX diffs identically.</li>
      <li><b>Go</b> — error-handling blocks, import grouping and ordering, and a changed receiver name or pointer-vs-value method: small tokens, real behaviour. Useful for seeing what <code>gofmt</code> actually did.</li>
      <li><b>Java</b> — modifier and type changes, annotations, and imports. Covers Kotlin and Scala sources too.</li>
      <li><b>Kotlin</b> — nullability (<code>?</code>), <code>val</code> vs <code>var</code>, and scope-function swaps. Android and Jetpack Compose sources are just Kotlin.</li>
      <li><b>Swift</b> — optionals, <code>let</code> vs <code>var</code>, and access control. The same for UIKit and SwiftUI.</li>
      <li><b>C#</b> — nullable reference annotations, <code>using</code> directives and namespaces, expression-bodied vs block members.</li>
      <li><b>Rust</b> — ownership markers, lifetimes and generics, and <code>Result</code>/<code>Option</code> handling. Handy before <code>rustfmt</code> and CI see it.</li>
      <li><b>Ruby</b> — symbol vs string, block style, and implicit returns.</li>
      <li><b>PHP</b> — mixed PHP and HTML, quote style and string interpolation, array syntax.</li>
      <li><b>Elixir</b> — pattern-match clauses, pipe order, atoms vs strings. The same for Phoenix controllers and LiveView modules.</li>
      <li><b>Zig</b> — error unions, <code>comptime</code> blocks, optionals. No hidden control flow, so a line-level diff maps straight onto runtime behaviour.</li>
      <li><b>Gleam</b> — custom types and constructors, <code>case</code> arms, pipe order. With no null and no exceptions, the meaningful diffs sit in signatures and match arms.</li>
      <li><b>Julia</b> — type annotations in signatures, broadcasting dots, and 1-based indexing edits. Multiple dispatch means a function can gain or lose methods without any call site changing.</li>
      <li><b>Solidity</b> — visibility and mutability, modifiers, arithmetic, and the compiler pragma. Before a re-audit or deploy: even a tightened <code>require</code> or a reordered storage variable can change behaviour or gas cost.</li>
    </ul>
    <p>For infrastructure and service configuration rather than application source, see the <a href="/diff/config-diff">config diff</a> page.</p>
    <p>Your code is never transmitted — all diffing happens locally, so pasting internal or client code carries no upload risk.</p>`),

  "config-diff": g(`
    <h2>Comparing two config files before you deploy</h2>
    <p>Config is where a one-line change has the most outsized effect, and where you least want a surprise. A base-image tag, a reordered <code>location</code> block, a renumbered field tag — each is a couple of characters that changes what actually runs. Paste the old and new version and read the lines.</p>
    <p>A literal line-level diff is deliberately the right tool here: it hides nothing. A semantically "tidied" view can mask exactly the change that matters.</p>
    <h3>What matters, by format</h3>
    <ul>
      <li><b>Dockerfile</b> — base image tags (<code>FROM node:20</code> vs <code>node:20-alpine</code> changes the whole runtime); instruction <em>order</em>, since moving a <code>COPY</code> above or below a <code>RUN npm install</code> changes what gets cached and rebuilt; added flags or packages in a <code>RUN</code>; and pinned versions or digests quietly drifting.</li>
      <li><b>docker-compose.yml</b> — service definitions, ports, volumes and environment blocks. It's YAML, so indentation <em>is</em> structure: a change in leading spaces can re-nest a key under a different parent. Leave "Ignore whitespace" off, and turn on show-invisibles to catch a stray tab (YAML forbids tabs for indentation).</li>
      <li><b>nginx.conf</b> — the order and specificity of <code>location</code> blocks decides which one handles a request, so a reordered block can silently reroute traffic. Also watch <code>proxy_pass</code> targets and TLS directives.</li>
      <li><b>Terraform (.tf)</b> — some argument changes update a resource in place; others force it to be destroyed and recreated. Know which before you apply. Also watch provider version constraints and variable defaults.</li>
      <li><b>Protobuf (.proto)</b> — field <em>numbers</em>, not names, define the wire format. A renumbered or removed tag can silently break compatibility between an old client and a new server, so tag changes deserve more attention than renames.</li>
      <li><b>INI / .conf / .cfg</b> — which <code>[section]</code>s were added or removed and which values changed, for anything from app settings to service files.</li>
    </ul>
    <p>For application source rather than configuration, see the <a href="/diff/code-diff">code diff</a> page. For <code>.env</code> files specifically there's a <a href="/diff/env-diff">dedicated env diff</a>, since comparing secrets has its own rules.</p>
    <p>Everything runs in your browser, so private infrastructure details — internal hostnames, registry paths, resource names — never leave your device.</p>`),

  "merge-conflict-resolver": g(`
    <h2>Making sense of a merge conflict</h2>
    <p>When Git can't reconcile two changes it leaves conflict markers in the file: <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> for the start of your side, <code>=======</code> as the divider, and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> for the incoming side. In a dense conflict those markers are easy to misread — and resolving one wrong is how you accidentally drop someone's work.</p>
    <p>Paste the conflicted block here to see the two sides laid out as a clean diff, so you can tell exactly what each branch changed before you decide what to keep. Then edit down to the version you want and remove every marker.</p>
    <h3>Before you commit the resolution</h3>
    <ul>
      <li>Confirm no <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> or <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> lines remain — leftover markers compile in some languages and break silently.</li>
      <li>Check you didn't keep only one side when the correct answer was to combine both.</li>
    </ul>
    <p>The conflicted code stays in your browser, which is the right default for work-in-progress from a private repo.</p>`),

  "json-diff": g(`
    <h2>Diffing JSON without getting lost in formatting</h2>
    <p>Two JSON documents can be logically identical but textually very different — reordered keys, different indentation, single versus double spacing — so a plain text diff over raw JSON is often all noise. The useful comparison is structural: which keys and values actually changed.</p>
    <h3>JSON-specific things to watch</h3>
    <ul>
      <li><b>Key order</b> doesn't matter to JSON semantics but does to a text diff — pretty-print both sides consistently first so reordering doesn't masquerade as a change.</li>
      <li><b>Trailing commas</b> are invalid in strict JSON; if one side has them it may be config-flavoured JSON5, worth noting before you trust the parse.</li>
      <li><b>Number formatting</b> (<code>1.0</code> vs <code>1</code>, exponent notation) reads as a change textually even when the value is the same.</li>
    </ul>
    <p>It's the everyday tool for comparing two API responses, a config before and after an edit, or a fixture against live output to see what drifted. Nothing is uploaded — safe for responses containing tokens or personal data.</p>`),

  "compare-two-lists": g(`
    <h2>Finding what's in one list but not the other</h2>
    <p>Comparing two lists is the "which of these changed?" question in its simplest form: two columns of emails, SKUs, usernames, URLs or IDs, and you need to know what was added, what was removed, and what's common to both. Paste one list per side, one item per line, and the additions and removals are highlighted.</p>
    <h3>Get accurate results</h3>
    <ul>
      <li>Turn on <b>Ignore whitespace</b> so a stray trailing space doesn't make two otherwise-identical entries look different.</li>
      <li>Use <b>Ignore case</b> for things like email addresses, where <code>User@x.com</code> and <code>user@x.com</code> should count as the same.</li>
      <li><b>Sort both sides</b> first if the lists are in different orders — otherwise every line reads as moved.</li>
    </ul>
    <p>Typical uses: reconciling a subscriber export against a suppression list, checking an inventory count, or diffing two permission sets. All local — your lists never leave the browser.</p>`),

  "csv-diff": g(`
    <h2>Comparing CSV data line by line</h2>
    <p>A raw CSV diff treats each row as a line of text, which is exactly what you want when rows are supposed to stay in order and you're checking what was added, removed, or edited between two exports of the same dataset.</p>
    <h3>Where CSVs trip up a diff</h3>
    <ul>
      <li><b>Row order:</b> if the two files were sorted differently, sort both by a key column first, or nearly every row will show as changed. (For a column-aware, order-independent comparison, the CSV Table Diff is the better fit.)</li>
      <li><b>Quoting and delimiters:</b> a field containing a comma is quoted; a mix of quoting styles between the two files can create spurious differences.</li>
      <li><b>Line endings and a trailing newline</b> differ between systems and can make an otherwise-identical file look changed — <b>Ignore whitespace</b> helps.</li>
    </ul>
    <p>Good for spotting exactly which records changed between yesterday's and today's export. The data stays in your browser, which matters for anything with customer rows.</p>`),

  "csv-table-diff": g(`
    <h2>A column-aware diff for spreadsheets and exports</h2>
    <p>Unlike a raw line diff, a table diff understands that a CSV has columns. It lines the two files up as a grid so you can see a changed <i>cell</i> — "row 340, the price column went from 9.99 to 12.99" — rather than a whole row lighting up because one field moved.</p>
    <h3>When to use the table view</h3>
    <ul>
      <li>Comparing two exports where rows may have been re-sorted — align on a key column instead of on position.</li>
      <li>Auditing a data edit where you care <i>which field</i> changed, not just which row.</li>
      <li>Reconciling a spreadsheet someone returned against your master copy.</li>
    </ul>
    <p>Make sure both files share the same header row so columns align. For files that are meant to stay in a fixed order and where you only care about added/removed rows, the plain CSV Diff is lighter. Everything is parsed and compared locally — no upload of what may be sensitive tabular data.</p>`),

  "xml-diff": g(`
    <h2>Diffing XML around the noise</h2>
    <p>XML is verbose and whitespace-tolerant, so two documents that mean the same thing can look wildly different as text: reindented trees, attributes in a different order, self-closing versus explicit empty tags. The changes that matter are in the elements, attributes and text content.</p>
    <h3>XML-specific gotchas</h3>
    <ul>
      <li><b>Attribute order</b> is not significant in XML but is to a text diff — reformatting can help normalise it.</li>
      <li><b>Whitespace between elements</b> is usually insignificant; turn on <b>Ignore whitespace</b> so reindentation doesn't dominate.</li>
      <li><b>Namespaces and encoding declarations</b> can differ harmlessly between two exports of the "same" document.</li>
    </ul>
    <p>Handy for comparing two config files, SVGs, RSS feeds, or SOAP/API payloads. It runs entirely in your browser, so proprietary schemas and payloads stay on your machine.</p>`),

  "yaml-diff": g(`
    <h2>Comparing YAML where indentation is the meaning</h2>
    <p>YAML is unusual: indentation isn't cosmetic, it defines structure. That makes <b>Ignore whitespace</b> dangerous here — turning it on can hide a change that actually re-nests a key under a different parent. Leave it off for YAML and read the indentation carefully.</p>
    <h3>What to look for</h3>
    <ul>
      <li><b>Indentation shifts</b> that move a key into or out of a block — a real, easy-to-miss semantic change.</li>
      <li><b>Tabs vs spaces:</b> YAML forbids tabs for indentation; <b>Show invisibles</b> catches a stray tab that a plain view hides.</li>
      <li><b>List vs map</b> and quoted vs unquoted scalars (<code>yes</code>, <code>on</code>, <code>1.0</code> can be booleans, numbers or strings depending on quoting).</li>
    </ul>
    <p>It's the everyday tool for diffing two Kubernetes manifests, CI pipelines, or app config files. Your YAML — often full of hostnames and settings you'd rather not share — never leaves the browser.</p>`),

  "sql-diff": g(`
    <h2>Comparing two SQL statements or scripts</h2>
    <p>SQL diffs come up constantly: two versions of a migration, a query you optimised versus the original, or a schema dump before and after a change. Paste both and the changed clauses and identifiers are highlighted so you can see precisely what moved.</p>
    <h3>Reading a SQL diff well</h3>
    <ul>
      <li><b>Ignore case</b> is often right — SQL keywords are case-insensitive, so <code>SELECT</code> vs <code>select</code> usually isn't a real change — but leave it off if your identifiers (table or column names) are case-sensitive on your database.</li>
      <li><b>Ignore whitespace</b> tames the reformatting that SQL editors love to apply, so only the logic change shows.</li>
      <li>Watch for reordered <code>JOIN</code>s or <code>WHERE</code> conditions that are logically equivalent but textually different.</li>
    </ul>
    <p>Everything runs client-side, so queries containing schema names or embedded values never get uploaded.</p>`),

  "markdown-diff": g(`
    <h2>Diffing Markdown source</h2>
    <p>This compares the raw Markdown, not the rendered output — which is usually what you want when reviewing edits to a README, a doc, or a blog post, because you can see the exact syntax that changed: a heading level, a link target, a list marker, a code fence.</p>
    <h3>Markdown-specific notes</h3>
    <ul>
      <li><b>Soft vs hard wrapping:</b> some editors hard-wrap paragraphs at a column and others keep one line per paragraph — that reflows text and can make an unchanged paragraph look edited. <b>Ignore whitespace</b> helps, but a reflowed paragraph still diffs word-by-word.</li>
      <li><b>Reference vs inline links</b> render identically but read as a change in source.</li>
      <li><b>Trailing spaces</b> are significant in Markdown (two of them force a line break) — <b>Show invisibles</b> makes them visible.</li>
    </ul>
    <p>Good for reviewing a docs PR outside the code host, or comparing two drafts. Nothing is uploaded.</p>`),

  "html-diff": g(`
    <h2>Comparing HTML source</h2>
    <p>This diffs the HTML markup itself — tags, attributes and text content — rather than the rendered page. That's the right view when you're checking what actually changed in a template, an email's HTML, or a scraped snippet, because a tiny source change (one attribute, one class) can have an outsized visual effect that a rendered comparison would make you hunt for.</p>
    <h3>HTML gotchas</h3>
    <ul>
      <li><b>Attribute order</b> and quote style (<code>'</code> vs <code>"</code>) don't change the rendered result but do show up in a text diff.</li>
      <li><b>Insignificant whitespace</b> between block elements collapses in the browser; <b>Ignore whitespace</b> keeps reindentation from dominating.</li>
      <li><b>Minified vs pretty-printed</b> versions of the same page are textually unrecognisable — pretty-print both before diffing.</li>
    </ul>
    <p>All local, so template markup and email HTML stay on your machine.</p>`),










  "css-diff": g(`
    <h2>Comparing CSS and stylesheets</h2>
    <p>CSS diffs are deceptively fiddly because the order of properties within a rule usually doesn't matter to the browser, but does to a text diff. A stylesheet run through a formatter or a different property-sort order can look heavily changed when nothing visual actually is.</p>
    <h3>Reading a CSS diff</h3>
    <ul>
      <li><b>Property reordering</b> within a selector is typically cosmetic — focus on values, not position.</li>
      <li><b>Specificity and selector changes</b> are the high-impact ones: a changed selector can restyle far more than the one rule it's in.</li>
      <li><b>Units and colour formats</b> (<code>#fff</code> vs <code>#ffffff</code> vs <code>rgb()</code>) can be equivalent yet diff as changes.</li>
    </ul>
    <p>Useful for comparing a component's styles before and after, or two themes. It's browser-only, so design-system source stays private.</p>`),










  "env-diff": g(`
    <h2>Comparing .env files safely</h2>
    <p>Comparing two environment files — staging vs production, or <code>.env</code> vs <code>.env.example</code> — is how you catch the missing variable that breaks a deploy. But env files are also where secrets live, which is exactly why an in-browser, nothing-uploaded diff is the right tool: your keys never touch a server.</p>
    <h3>What to look for</h3>
    <ul>
      <li><b>Missing keys:</b> a variable present in one file and absent in the other is the classic deploy-breaker.</li>
      <li><b>Changed values</b> — but be careful sharing the result if those values are live secrets.</li>
      <li><b>Quoting and trailing spaces</b> around values, which some loaders treat as part of the value; <b>Show invisibles</b> reveals them.</li>
    </ul>
    <p>Because the comparison is entirely client-side, you can safely diff files containing real credentials — nothing is transmitted or stored.</p>`),

  "package-json-diff": g(`
    <h2>Diffing package.json</h2>
    <p>Most <code>package.json</code> changes are dependency bumps, and it's easy to miss which package moved or whether a caret quietly widened a range. A structured look at the two files shows exactly what changed in <code>dependencies</code>, <code>scripts</code> and the rest.</p>
    <h3>package.json-specific notes</h3>
    <ul>
      <li><b>Version range operators:</b> <code>1.2.3</code> vs <code>^1.2.3</code> vs <code>~1.2.3</code> — the pin changed even if the number looks similar.</li>
      <li><b>Key order</b> doesn't matter to npm but does to a text diff; alphabetise both sides if reordering is noisy.</li>
      <li><b>scripts changes</b> — an edited build or test command is easy to overlook among dependency lines.</li>
      <li>Remember the real source of truth for installed versions is the lockfile, not this file.</li>
    </ul>
    <p>Everything runs locally — your dependency list and private-registry references stay on your machine.</p>`),




  "contract-diff": g(`
    <h2>Comparing two versions of a contract</h2>
    <p>When a contract comes back from the other side, the changes are what matter — and "we only tweaked a couple of clauses" deserves verification. Drop both versions in (it reads <code>.pdf</code> and <code>.docx</code>, not just plain text) and every changed word is highlighted, so nothing slips through in a redraft.</p>
    <h3>Why an in-browser tool suits legal documents</h3>
    <ul>
      <li><b>Confidentiality:</b> the documents are never uploaded — the text is extracted and compared locally — so you're not sending a draft agreement to a third-party server.</li>
      <li><b>Word-level detail</b> catches the single word ("shall" to "may", a changed number, an added "not") that changes meaning.</li>
      <li><b>Ignore whitespace</b> keeps reformatting between Word versions from masking the substantive edits.</li>
    </ul>
    <p>It's a fast first pass; for anything high-stakes, a lawyer's review still applies — but you'll walk in knowing exactly what changed.</p>`),

  "resume-diff": g(`
    <h2>Comparing two versions of a résumé</h2>
    <p>Tailoring a résumé for each role means juggling versions, and it's easy to lose track of what you changed between them. Paste or drop two versions (<code>.pdf</code> and <code>.docx</code> work) and see exactly which bullet points, dates and phrasing differ.</p>
    <h3>Handy uses</h3>
    <ul>
      <li>Confirm the version you're about to send is the one tailored to <i>this</i> job, not last week's.</li>
      <li>Check that a small edit (a date, a title, a metric) didn't introduce an inconsistency elsewhere.</li>
      <li>Compare your résumé against a job description pasted on the other side to spot missing keywords by eye.</li>
    </ul>
    <p>Your résumé often contains your address and contact details — and none of it is uploaded, since the comparison runs entirely in your browser.</p>`),

  "essay-diff": g(`
    <h2>Diffing two drafts of an essay</h2>
    <p>Between drafts it's genuinely hard to remember what you changed — a diff shows you, so you can see whether an edit tightened the argument or quietly dropped a point you meant to keep. Paste two drafts (or drop <code>.pdf</code>/<code>.docx</code> files) and every changed word and sentence is highlighted.</p>
    <h3>Getting a readable result on prose</h3>
    <ul>
      <li><b>Ignore whitespace</b> so a reflowed paragraph doesn't read as entirely rewritten.</li>
      <li>Use the <b>word-level</b> view to see a reworded sentence's actual changes rather than the whole line lighting up.</li>
      <li>Compare your draft against feedback pasted on the other side to check you addressed each note.</li>
    </ul>
    <p>Nothing is uploaded — useful for coursework or anything you'd rather not paste into an online service that stores it.</p>`),

  "prompt-diff": g(`
    <h2>Why prompt edits deserve a real diff, not a re-read</h2>
    <p>A system prompt or a long instruction block can run to hundreds of words, and the change that actually matters — a swapped word, a tightened constraint, a dropped example — is easy to miss re-reading the whole thing top to bottom. A word-level diff puts the exact change in front of you instead, the same way it would for a line of code.</p>
    <h3>Where this earns its keep</h3>
    <ul>
      <li><b>Tracking prompt iterations:</b> see precisely what an edit changed between a prompt that worked and one that didn't, instead of guessing which tweak mattered.</li>
      <li><b>Reviewing a teammate's prompt change:</b> paste the before and after to review a pull-request-style edit to a shared system prompt, the same way you'd review a code diff.</li>
      <li><b>Comparing model-specific variants:</b> when the same prompt gets tuned slightly differently for two models, a diff shows exactly where the versions diverge.</li>
    </ul>
    <h3>Structure is preserved, not stripped</h3>
    <p>This is a plain text diff, so anything inside the prompt — XML tags delimiting a document or instructions, markdown formatting, fenced code blocks, a JSON example — is compared exactly as written, not parsed or reformatted. Turn on <b>ignore whitespace</b> if reflowed line breaks from copy-pasting are cluttering the result. Everything runs in your browser, so an unreleased product's system prompt is never uploaded anywhere.</p>`),

  "pdf-diff": g(`
    <h2>Comparing the text of two PDFs</h2>
    <p>PDFs aren't plain text, so a normal diff can't read them. This one extracts the text from each PDF in your browser and compares that — so you can see what changed between two versions of a report, an invoice, a statement, or a signed document.</p>
    <h3>What to know about PDF comparison</h3>
    <ul>
      <li>It compares <b>text content</b>, not layout or images — a moved logo or a font change won't show, but changed wording and numbers will.</li>
      <li><b>Scanned PDFs</b> (images of pages, with no text layer) have no extractable text; this works on PDFs that contain real text.</li>
      <li>Extraction can reorder text from complex multi-column layouts — worth a sanity check on unusual documents.</li>
    </ul>
    <p>The files are read locally and never uploaded, which matters for statements and contracts that carry personal or financial detail.</p>`),

  "word-diff": g(`
    <h2>Comparing two Word documents</h2>
    <p>You don't need Word's own compare feature — or Word at all. Drop two <code>.docx</code> files here and the text is extracted and diffed in your browser, highlighting exactly which words and sentences changed between them. It's ideal when a document came back edited but "Track Changes" was never switched on.</p>
    <h3>Notes on .docx comparison</h3>
    <ul>
      <li>It compares the <b>text</b>, so wording, numbers and added or removed sentences show clearly; pure formatting changes (bold, font, margins) won't.</li>
      <li><b>Ignore whitespace</b> keeps paragraph reflow from masking the real edits.</li>
      <li>For a document with tracked changes already accepted, this reconstructs what actually differs between the two files.</li>
    </ul>
    <p>The documents never leave your machine — the extraction and comparison are entirely client-side.</p>`),

  "private-diff-checker": g(`
    <h2>A diff checker that never sees your data</h2>
    <p>Most "online" diff tools send your text to a server to compute the comparison. This one doesn't: the entire diff runs in your browser using JavaScript, so whatever you paste — proprietary code, a contract, a config file full of secrets, personal data — stays on your device.</p>
    <h3>How to verify that for yourself</h3>
    <ul>
      <li>Open your browser's <b>developer tools → Network tab</b>, then run a comparison. You'll see no request carrying your text — the diff happens locally.</li>
      <li>The tool works <b>offline</b>: disconnect from the network, reload once it's cached, and it still diffs. A tool that needed a server couldn't.</li>
    </ul>
    <p>That makes it suitable for exactly the material you shouldn't paste into a typical web tool: pre-release code, client documents, credentials, and regulated data. No account, no logging, nothing stored.</p>`),

  "log-diff": g(`
    <h2>Diffing log files to find what changed</h2>
    <p>Comparing a "good" run against a "bad" one is one of the fastest ways to localise a problem — the diff points straight at the lines that appeared, disappeared, or changed. Paste two log excerpts and the differences are highlighted.</p>
    <h3>Taming log noise</h3>
    <ul>
      <li><b>Timestamps</b> differ on every run and will dominate a naive diff — trim or align them first, or focus on the message text, so the real difference isn't buried.</li>
      <li><b>Ignore whitespace</b> helps with variable-width columns and padding.</li>
      <li><b>Request/trace IDs and PIDs</b> change every run too; mentally discount those and look for changed messages and new errors.</li>
    </ul>
    <p>Logs frequently contain IPs, user IDs and internal hostnames — all of which stay in your browser, since nothing is uploaded.</p>`),

  "git-diff-viewer": g(`
    <h2>Viewing a git diff or patch, prettified</h2>
    <p>Raw <code>git diff</code> output and <code>.patch</code>/<code>.diff</code> files are readable but dense — a wall of <code>+</code> and <code>-</code> lines with <code>@@</code> hunk headers. Paste one here to see it laid out with clear colour-coding and word-level highlighting, without a terminal or a code host.</p>
    <h3>Handy when</h3>
    <ul>
      <li>Someone pastes a patch in chat and you want to read it comfortably before applying.</li>
      <li>You're reviewing a diff away from the machine that has the repo.</li>
      <li>You want to see the exact intra-line change that unified <code>+</code>/<code>-</code> lines make you reconstruct by eye.</li>
    </ul>
    <p>You can also paste two file versions directly and let the tool generate the diff for you. Everything is rendered locally — the patch, and any code in it, never leaves your browser.</p>`),

  "subtitle-diff": g(`
    <h2>Comparing subtitle files</h2>
    <p>Comparing two subtitle files — <code>.srt</code> or <code>.vtt</code>, an original against a corrected pass, or two translations — shows exactly which caption text or timing changed. Paste both and the differences are highlighted line by line.</p>
    <h3>Subtitle-specific things to watch</h3>
    <ul>
      <li><b>Timing lines</b> (<code>00:01:23,456 --&gt; 00:01:25,000</code>) versus <b>caption text</b> — a re-sync changes the timings while leaving the words alone, and vice versa.</li>
      <li><b>Cue numbering</b> shifting when a caption is inserted or removed, which can make everything after it look changed.</li>
      <li><b>SRT vs VTT</b> formatting differences (comma vs dot in timestamps, a <code>WEBVTT</code> header).</li>
    </ul>
    <p>Everything is compared in your browser — nothing about the file or its content is uploaded.</p>`),

  "invisible-character-checker": g(`
    <h2>Finding the invisible characters two texts don't share</h2>
    <p>Sometimes two strings look identical but aren't equal, and the culprit is a character you can't see: a non-breaking space instead of a normal space, a zero-width space, a smart quote pasted from a word processor, or a Windows <code>\\r\\n</code> line ending versus a Unix <code>\\n</code>. This surfaces them.</p>
    <h3>What it catches</h3>
    <ul>
      <li><b>Whitespace impostors:</b> non-breaking spaces (U+00A0), tabs, and trailing spaces.</li>
      <li><b>Zero-width characters</b> that occupy no visual space but break string comparisons and sometimes sneak in from copied web text.</li>
      <li><b>Smart punctuation</b> (curly quotes, en/em dashes) swapped for their ASCII equivalents.</li>
      <li><b>Line-ending mismatches</b> between two otherwise-identical files.</li>
    </ul>
    <p>Turn on <b>Show invisibles</b> to render these explicitly. It's the tool for "these two are the same — so why does the comparison fail?" All local, nothing uploaded.</p>`),


  "image-diff": g(`
    <h2>Spotting the difference between two images</h2>
    <p>Unlike the text tools here, this compares two images pixel by pixel and highlights where they differ — the visual equivalent of a diff. It's built for the "spot the change" cases where two pictures are meant to be identical but might not be.</p>
    <h3>What it's good for</h3>
    <ul>
      <li><b>Visual regression checks:</b> a screenshot before and after a code change, to see exactly which pixels moved.</li>
      <li><b>Export comparisons:</b> confirming two renders or two compressions of the same image really match.</li>
      <li><b>Catching subtle edits</b> — a changed number on a graphic, a moved element — that the eye glosses over.</li>
    </ul>
    <p>Both images are loaded and compared entirely in your browser; they're never uploaded, so screenshots of private work stay private. For best results, compare images of the same dimensions.</p>`),
};
