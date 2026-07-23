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
    <p>Your code is never transmitted — all diffing happens locally, so pasting internal or client code carries no upload risk.</p>`),

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

  "python-diff": g(`
    <h2>Diffing Python, where indentation is code</h2>
    <p>Python is the language where you must <b>not</b> "ignore whitespace" reflexively. Indentation defines blocks, so a change in leading spaces can move a statement into or out of a loop or an <code>if</code> — a real logic change that whitespace-insensitive diffing would hide entirely. Keep that option off and read the indentation deliberately.</p>
    <h3>Python-specific things a diff surfaces</h3>
    <ul>
      <li><b>Tabs vs spaces:</b> mixing them is a syntax error in Python 3. <b>Show invisibles</b> reveals a stray tab that looks like spaces.</li>
      <li><b>Trailing whitespace and blank-line changes</b> that linters flag but the eye misses.</li>
      <li>A dedent that silently pulls a line out of a <code>try</code>/<code>with</code>/<code>for</code> block — the highest-value thing to catch here.</li>
    </ul>
    <p>Ideal for reviewing a refactor or a snippet before you paste it back. Your code never leaves the browser.</p>`),

  "javascript-diff": g(`
    <h2>Comparing JavaScript and TypeScript snippets</h2>
    <p>Whether it's a function you're refactoring, two versions of a config, or a dependency's source before and after an update, this highlights the exact tokens that changed. JavaScript is whitespace-insensitive, so <b>Ignore whitespace</b> is usually safe and helps a Prettier reformat stop drowning out the real change.</p>
    <h3>Things worth catching in JS specifically</h3>
    <ul>
      <li><b>Semicolon and comma changes</b> — ASI (automatic semicolon insertion) means these occasionally matter more than they look.</li>
      <li><b>Quote style</b> (<code>'</code> vs <code>"</code> vs backticks) — often just a lint-rule reformat, not a real change.</li>
      <li><b>Arrow vs function, <code>let</code> vs <code>const</code></b> — small token diffs with real behavioural weight.</li>
    </ul>
    <p>Turn on JavaScript/TS syntax highlighting to read the result faster. Everything runs locally, so proprietary or client code is never uploaded.</p>`),

  "typescript-diff": g(`
    <h2>Diffing TypeScript, types included</h2>
    <p>TypeScript diffs carry an extra layer JavaScript doesn't: the types. A change from <code>string</code> to <code>string | null</code>, a new generic parameter, or a widened return type is exactly the kind of small textual edit with large downstream consequences — so it's worth diffing types as carefully as logic.</p>
    <h3>What to look for</h3>
    <ul>
      <li><b>Type annotations and interfaces:</b> a single added <code>?</code> (optional) or <code>| undefined</code> changes a contract.</li>
      <li><b>Import type changes</b> and <code>as const</code> assertions that reshape inference.</li>
      <li>Formatting noise from Prettier — <b>Ignore whitespace</b> is safe here since TS, like JS, isn't whitespace-sensitive.</li>
    </ul>
    <p>Use it to sanity-check a refactor or review a snippet outside your editor. Nothing is transmitted — the comparison is entirely client-side.</p>`),

  "go-diff": g(`
    <h2>Comparing Go code</h2>
    <p>Go has an advantage for diffing: <code>gofmt</code> means almost everyone's code shares one canonical format, so a diff between two <code>gofmt</code>'d snippets is nearly always a <i>real</i> change rather than a formatting artefact. If one side isn't formatted, run it through <code>gofmt</code> first so the comparison stays meaningful.</p>
    <h3>Go-specific things to notice</h3>
    <ul>
      <li><b>Error handling blocks</b> — the repetitive <code>if err != nil</code> patterns make it easy to miss which one changed; word-level highlighting pinpoints it.</li>
      <li><b>Import grouping and ordering</b> is managed by tooling; a reordered import block is usually not a logic change.</li>
      <li>A changed receiver name or a pointer-vs-value method — small tokens, real behaviour.</li>
    </ul>
    <p>Since Go is tab-indented by convention, <b>Show invisibles</b> confirms tabs weren't swapped for spaces. All comparison is local.</p>`),

  "java-diff": g(`
    <h2>Diffing Java source</h2>
    <p>Java's verbosity — access modifiers, type declarations, boilerplate — means a real change can hide among tokens that look almost identical. Word-level highlighting is especially useful here to spot the one changed identifier in a wall of similar-looking method signatures.</p>
    <h3>Worth catching in Java</h3>
    <ul>
      <li><b>Modifier and type changes:</b> <code>public</code> vs <code>protected</code>, or a return type widened from a concrete class to an interface.</li>
      <li><b>Annotation changes</b> (<code>@Override</code>, <code>@Nullable</code>) that alter contracts or wiring.</li>
      <li><b>Import changes</b> from an IDE reorganising them — usually noise, not logic.</li>
    </ul>
    <p>Java isn't whitespace-sensitive, so <b>Ignore whitespace</b> safely removes reformatting noise. Everything stays in your browser, so enterprise code is never uploaded.</p>`),

  "php-diff": g(`
    <h2>Comparing PHP snippets</h2>
    <p>From a WordPress template tweak to a controller refactor, PHP diffs are a daily need. Paste two versions to see the exact changes highlighted — variables (the <code>$</code> sigil makes them easy to track), function signatures, and the HTML that PHP so often interleaves with.</p>
    <h3>PHP-specific notes</h3>
    <ul>
      <li><b>Mixed PHP and HTML:</b> a change might be in the markup between <code>?&gt;</code> and <code>&lt;?php</code> rather than the code — the diff shows both.</li>
      <li><b>Quote style and string interpolation:</b> single vs double quotes changes whether <code>$vars</code> expand.</li>
      <li><b>Array syntax:</b> <code>array()</code> vs <code>[]</code> is equivalent but reads as a change.</li>
    </ul>
    <p>PHP isn't whitespace-sensitive, so <b>Ignore whitespace</b> is safe. All local — nothing you paste is sent anywhere.</p>`),

  "csharp-diff": g(`
    <h2>Diffing C# code</h2>
    <p>C# diffs often turn on small but consequential tokens: an access modifier, a <code>nullable</code> annotation, an <code>async</code>/<code>await</code> pair, or a LINQ clause. Word-level highlighting isolates the exact change so a reformatted method doesn't read as rewritten.</p>
    <h3>Things to watch in C#</h3>
    <ul>
      <li><b>Nullable reference annotations</b> (<code>string?</code>) — a single character that changes a contract.</li>
      <li><b>using directives and namespaces</b> reorganised by the IDE — usually noise.</li>
      <li><b>Expression-bodied vs block members</b> (<code>=&gt;</code> vs <code>{ }</code>) — equivalent, textually different.</li>
    </ul>
    <p>C# ignores whitespace, so turning on <b>Ignore whitespace</b> clears reformatting noise safely. The comparison runs entirely in your browser.</p>`),

  "rust-diff": g(`
    <h2>Comparing Rust code</h2>
    <p>Like Go, Rust has a canonical formatter (<code>rustfmt</code>), so diffs between formatted snippets tend to be genuine changes. The high-signal tokens in Rust are the ones the borrow checker cares about — and they're easy to miss by eye.</p>
    <h3>Rust-specific things a diff catches</h3>
    <ul>
      <li><b>Ownership markers:</b> a change in <code>&amp;</code>, <code>&amp;mut</code>, <code>ref</code>, or a <code>.clone()</code> appearing/disappearing.</li>
      <li><b>Lifetimes and generics</b> (<code>&lt;'a&gt;</code>, trait bounds) — small edits, big implications.</li>
      <li><b>Result/Option handling:</b> a <code>?</code>, <code>.unwrap()</code>, or match arm that changed.</li>
    </ul>
    <p>Run both sides through <code>rustfmt</code> first for the cleanest comparison. Everything is local — no upload of your crate's source.</p>`),

  "ruby-diff": g(`
    <h2>Diffing Ruby source</h2>
    <p>Ruby's expressiveness — blocks, symbols, implicit returns — means two snippets can differ in ways that are easy to overlook. Paste both to highlight exactly what changed, whether it's a method, a symbol, or the contents of a block.</p>
    <h3>Ruby-specific things to notice</h3>
    <ul>
      <li><b>Symbol vs string</b> (<code>:key</code> vs <code>"key"</code>) and the two hash syntaxes (<code>:k =&gt;</code> vs <code>k:</code>).</li>
      <li><b>Block style:</b> <code>do…end</code> vs <code>{…}</code> — equivalent, textually different.</li>
      <li><b>Implicit return</b> changes where the last line of a method was edited.</li>
    </ul>
    <p>Ruby isn't whitespace-sensitive, so <b>Ignore whitespace</b> is safe. All comparison happens in your browser; nothing is transmitted.</p>`),

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

  "kotlin-diff": g(`
    <h2>Diffing Kotlin code</h2>
    <p>Kotlin's null-safety and concise syntax put a lot of meaning into small tokens. A diff makes the consequential ones obvious: a <code>?</code> that makes a type nullable, a <code>!!</code> assertion, or a <code>val</code> that became a <code>var</code>.</p>
    <h3>Kotlin-specific things to watch</h3>
    <ul>
      <li><b>Nullability:</b> <code>String</code> vs <code>String?</code> and safe-call <code>?.</code> vs <code>!!</code> — one character, real behaviour.</li>
      <li><b>val vs var</b> — immutability changes that are easy to skim past.</li>
      <li><b>Scope functions</b> (<code>let</code>, <code>apply</code>, <code>also</code>) swapped for one another.</li>
    </ul>
    <p>Kotlin ignores whitespace, so <b>Ignore whitespace</b> safely removes formatter noise. The comparison is entirely client-side.</p>`),

  "swift-diff": g(`
    <h2>Comparing Swift code</h2>
    <p>Swift, like Kotlin, leans heavily on optionals and concise syntax, so the highest-value diffs are often a single character. Paste two versions to see exactly which token changed rather than scanning two similar-looking blocks.</p>
    <h3>Swift-specific things a diff surfaces</h3>
    <ul>
      <li><b>Optionals:</b> a <code>?</code> or <code>!</code> added or removed, or <code>guard let</code> vs <code>if let</code>.</li>
      <li><b>let vs var</b> and value-vs-reference (<code>struct</code> vs <code>class</code>) changes.</li>
      <li><b>Access control</b> (<code>private</code>, <code>fileprivate</code>, <code>public</code>) edits.</li>
    </ul>
    <p>Whitespace isn't significant in Swift, so <b>Ignore whitespace</b> clears formatting noise. Everything runs in your browser — nothing is uploaded.</p>`),

  "zig-diff": g(`
    <h2>Diffing Zig code</h2>
    <p>Zig is explicit by design — no hidden control flow, no operator overloading — which makes diffs unusually readable: what you see changing is what changes. That also means small tokens carry real weight, so word-level highlighting earns its keep.</p>
    <h3>Zig-specific things to notice</h3>
    <ul>
      <li><b>Error unions and <code>try</code>:</b> a <code>try</code> added or removed, or a change in the <code>!T</code> error-union type.</li>
      <li><b>comptime</b> markers and allocator parameters passed explicitly.</li>
      <li><b>Optionals</b> (<code>?T</code>) and pointer types (<code>*T</code>, <code>[]T</code>).</li>
    </ul>
    <p>Zig ships with <code>zig fmt</code>, so format both sides first for a clean comparison. All diffing is local — your source never leaves the page.</p>`),

  "elixir-diff": g(`
    <h2>Comparing Elixir code</h2>
    <p>Elixir's pattern matching and pipelines pack a lot of logic into compact expressions, so a diff is the fastest way to see which clause or pipe stage changed. Paste two versions and the changed tokens are highlighted precisely.</p>
    <h3>Elixir-specific things to watch</h3>
    <ul>
      <li><b>Pattern-match clauses:</b> a changed function head can route inputs completely differently.</li>
      <li><b>Pipe order</b> (<code>|&gt;</code>) — reordering stages changes behaviour even when all stages look familiar.</li>
      <li><b>Atoms vs strings</b> and map/keyword-list syntax.</li>
    </ul>
    <p>Elixir has <code>mix format</code>, so formatting both sides keeps the diff focused on logic. It runs entirely in your browser.</p>`),

  "gleam-diff": g(`
    <h2>Diffing Gleam code</h2>
    <p>Gleam is statically typed and runs on the BEAM, and its diffs turn on the same things any strongly-typed functional language does: the shapes of types and the branches of pattern matches. A small type change ripples, so it's worth diffing types closely.</p>
    <h3>What to look for</h3>
    <ul>
      <li><b>Custom type and constructor changes</b> that alter the shape of your data.</li>
      <li><b>case expression arms</b> — a changed or reordered pattern.</li>
      <li><b>Pipe (<code>|&gt;</code>) sequences</b> and <code>use</code> expressions.</li>
    </ul>
    <p>Gleam has a built-in formatter, so <code>gleam format</code> both sides for the cleanest result. All comparison is client-side — nothing is uploaded.</p>`),

  "solidity-diff": g(`
    <h2>Comparing Solidity contracts</h2>
    <p>With smart contracts the stakes of a missed change are unusually high — a diff is a basic safety step before deploying or auditing. Paste two versions of a contract to see exactly what changed in the logic, the state variables, and the modifiers.</p>
    <h3>High-signal Solidity changes</h3>
    <ul>
      <li><b>Visibility and mutability:</b> <code>public</code>/<code>external</code>/<code>internal</code>, and <code>view</code>/<code>pure</code>/<code>payable</code> — each has security implications.</li>
      <li><b>Modifiers</b> like <code>onlyOwner</code> added or removed from a function.</li>
      <li><b>Arithmetic and <code>require</code>/<code>revert</code> conditions</b> — the guards that protect funds.</li>
      <li><b>Compiler pragma</b> version changes.</li>
    </ul>
    <p>Your contract source stays entirely in your browser — nothing is sent to a server, which matters for unpublished or pre-audit code.</p>`),

  "julia-diff": g(`
    <h2>Diffing Julia code</h2>
    <p>Julia's multiple dispatch means a method's meaning depends on its argument types, so a diff over the type signatures is as important as one over the body. Paste two versions to see which method signature or which line of numerical code changed.</p>
    <h3>Julia-specific things to notice</h3>
    <ul>
      <li><b>Type annotations in signatures</b> (<code>::Float64</code>) — dispatch hinges on these.</li>
      <li><b>Broadcasting dots</b> (<code>.+</code>, <code>f.(x)</code>) added or removed — a real change to whether an operation is elementwise.</li>
      <li><b>1-based indexing edits</b> and <code>@</code> macro changes.</li>
    </ul>
    <p>Julia isn't whitespace-sensitive, so <b>Ignore whitespace</b> is safe. The comparison happens entirely on your machine.</p>`),

  "dockerfile-diff": g(`
    <h2>Comparing two Dockerfiles</h2>
    <p>A one-line change in a Dockerfile can rebuild half your image or bust the layer cache, so diffing before you rebuild is worth the ten seconds. Paste two versions to see exactly which instruction changed.</p>
    <h3>What matters in a Dockerfile diff</h3>
    <ul>
      <li><b>Base image tags:</b> <code>FROM node:20</code> vs <code>node:20-alpine</code> changes the whole runtime.</li>
      <li><b>Instruction order:</b> moving a <code>COPY</code> above or below a <code>RUN npm install</code> changes what gets cached and rebuilt.</li>
      <li><b>RUN command changes</b> — an added flag or package that alters the image contents.</li>
      <li><b>Pinned versions</b> drifting (a package version, a digest).</li>
    </ul>
    <p>It runs in your browser, so a Dockerfile referencing internal registries or build args stays private.</p>`),

  "docker-compose-diff": g(`
    <h2>Diffing a docker-compose file</h2>
    <p>Compose files are YAML, so the same rule applies: indentation is structural, and <b>Ignore whitespace</b> can hide a change that re-nests a key under a different service. Leave it off and read the indentation carefully.</p>
    <h3>Compose-specific things to watch</h3>
    <ul>
      <li><b>Ports, volumes and environment</b> lists — a changed port mapping or mount is a common source of "works on my machine."</li>
      <li><b>Image tags and build contexts</b> that drifted between two versions.</li>
      <li><b>depends_on and network</b> changes that alter start-up order or connectivity.</li>
      <li><b>Anchors and <code>extends</code></b> that make two files share structure in non-obvious ways.</li>
    </ul>
    <p>Compose files are full of hostnames, ports and secrets-by-reference — and none of it leaves your browser here.</p>`),

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

  "terraform-diff": g(`
    <h2>Comparing Terraform configuration</h2>
    <p>This diffs the HCL you write, which is different from <code>terraform plan</code> (the diff of what will change in your infrastructure). Both are useful: diff the config to review a code change, and read the plan to see its effect. Paste two <code>.tf</code> versions to see which resource arguments changed.</p>
    <h3>What matters in a Terraform diff</h3>
    <ul>
      <li><b>Resource arguments</b> that force replacement (many <code>name</code> or <code>id</code> fields) versus in-place updates.</li>
      <li><b>Variable and default</b> changes that ripple across modules.</li>
      <li><b>Provider and module version</b> pins.</li>
      <li>Block ordering in HCL is usually insignificant — focus on values.</li>
    </ul>
    <p>Terraform files reference account IDs, regions and resource names — all of which stay in your browser, since nothing is uploaded.</p>`),

  "nginx-config-diff": g(`
    <h2>Diffing an nginx config</h2>
    <p>A misplaced directive in an nginx config can take a site down or open it up, so comparing before you reload is a sensible habit. Paste two versions to see exactly which directive or block changed.</p>
    <h3>nginx-specific things to watch</h3>
    <ul>
      <li><b>location block order and matching:</b> nginx picks locations by specific rules, so a reordered or edited <code>location</code> can change which block handles a request.</li>
      <li><b>proxy_pass, root and try_files</b> — the directives that decide where traffic actually goes.</li>
      <li><b>Semicolons and braces:</b> a missing <code>;</code> is a syntax error; the diff makes an accidental deletion visible.</li>
      <li><b>SSL and header directives</b> that affect security.</li>
    </ul>
    <p>Configs full of hostnames and upstream addresses stay entirely in your browser.</p>`),

  "ini-diff": g(`
    <h2>Comparing INI and config files</h2>
    <p>INI-style files (<code>.ini</code>, many <code>.conf</code> and <code>.cfg</code> files, Git's config, PHP's) are simple key–value pairs under <code>[sections]</code> — which makes them easy to diff, with a couple of quirks worth knowing.</p>
    <h3>INI-specific notes</h3>
    <ul>
      <li><b>Key order within a section</b> usually doesn't matter to the parser but does to a text diff — sort if reordering is noisy.</li>
      <li><b>Comment styles</b> (<code>;</code> and <code>#</code>) and inline comments vary between parsers.</li>
      <li><b>Whitespace around <code>=</code></b> and quoted vs unquoted values can differ harmlessly.</li>
      <li><b>Duplicate keys</b> — some parsers take the last, some the first; a diff shows if one appeared twice.</li>
    </ul>
    <p>All comparison is client-side, so config with credentials or paths never leaves your browser.</p>`),

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

  "protobuf-diff": g(`
    <h2>Diffing Protocol Buffers schemas</h2>
    <p>Because a <code>.proto</code> file defines a wire contract, changes to it have compatibility consequences — some safe, some breaking. Diffing two schema versions before you regenerate and ship is how you catch the breaking one.</p>
    <h3>What to watch in a .proto diff</h3>
    <ul>
      <li><b>Field numbers</b> are the contract: reusing or changing a number breaks compatibility with existing serialized data. A changed number is the highest-signal thing here.</li>
      <li><b>Removed or renamed fields</b> — renaming is safe on the wire (numbers matter, not names) but removing and reusing a number is not.</li>
      <li><b>Type changes</b> and required/optional/repeated edits.</li>
      <li><b>Reserved</b> ranges added to protect retired field numbers.</li>
    </ul>
    <p>Your schema stays in your browser — nothing is uploaded, which suits internal service contracts.</p>`),

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
