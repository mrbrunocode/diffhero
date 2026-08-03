/**
 * Editorial articles — the "proof" layer that a tool site needs for AdSense /
 * E-E-A-T: standalone, long-form, genuinely useful pieces separate from the
 * tool pages. Each is rendered at /guides/<slug> with an author byline (see
 * engine/build.mjs), and listed on the /guides index. Written to be genuinely
 * helpful and original — not padding — and to link naturally into the tools.
 *
 * Fields: slug, title, description (meta), date (ISO), read (minutes),
 * excerpt (index card), bodyHtml (the article; use <h2>/<h3>, <p>, lists).
 */
const D = "diff"; // COLLECTION_DIR, kept local so links read clearly below

export const ARTICLES = [
  {
    slug: "what-is-a-diff",
    title: "What is a diff? How software compares two versions of a file",
    description:
      "A plain-English explanation of what a diff is, how the comparison actually works, and why it underpins version control, code review and document editing.",
    date: "2026-07-23",
    read: 6,
    excerpt:
      "The word shows up everywhere — git diff, “diff the files”, the review tab on GitHub. Here's what a diff actually is, and how the comparison is computed.",
    bodyHtml: `
    <p>If you've spent any time near code, documents or configuration, you've met the word <em>diff</em> — short for "difference". You <code>git diff</code>, someone asks you to "diff the two files", a review tool shows you a wall of red and green. But what is a diff, really, and how does a computer work out what changed between two versions of some text? It's worth understanding, because once you know how the comparison is computed you also know its limits — and when it will mislead you.</p>

    <h2>A diff is the shortest set of edits between two texts</h2>
    <p>At its core, a diff answers a precise question: what is the smallest set of insertions and deletions that turns version A into version B? "Smallest" matters. Almost any change can be described as "delete everything, then type the new version", but that would be useless — it tells you nothing about <em>what</em> changed. A good diff finds the minimal edit script, so that the parts which stayed the same are recognised as unchanged and only the genuine edits are highlighted.</p>
    <p>Concretely, if the original says "the quick brown fox" and the new version says "the quick red fox", a naive comparison might flag the whole line as different. A diff worth using recognises that "the quick " and " fox" are untouched and that only "brown" became "red". That is the difference between a tool that points at the actual change and one that makes you find it yourself.</p>

    <h2>How the comparison is computed</h2>
    <p>The classic approach treats the two versions as sequences — usually sequences of lines — and looks for the <strong>longest common subsequence</strong>: the longest run of lines that appears, in order, in both versions. Anything not part of that common backbone is either an insertion (present in the new version only) or a deletion (present in the old version only). Most real diff tools, including the Unix <code>diff</code> command and Git, use refinements of an algorithm published by Eugene Myers in 1986 that finds this efficiently.</p>
    <p>Line-level diffing is fast and it's what version control shows you, but it's coarse: change one word and the whole line is marked. That's why better tools add a second pass — a <strong>word-level</strong> or <strong>character-level</strong> diff <em>within</em> each changed line — so a one-character fix doesn't light up eighty characters of unchanged text. When you use a <a href="/${D}/online-diff-checker">diff checker</a> and see the exact changed token highlighted inside a line, that's the second pass at work.</p>

    <h2>Where you already rely on diffs</h2>
    <ul>
      <li><strong>Version control.</strong> Every commit in Git is stored and shown as a diff against what came before. Code review on GitHub, GitLab and the rest is diff-reading as a job.</li>
      <li><strong>Patches.</strong> A <code>.patch</code> or <code>.diff</code> file <em>is</em> a diff, written in a standard format so it can be emailed and re-applied to a codebase. That's how open-source contributions travelled for decades.</li>
      <li><strong>Document editing.</strong> "Track changes" in a word processor and "suggesting mode" in a docs app are diffs with a friendly face.</li>
      <li><strong>Backups and sync.</strong> Tools that store or transfer only what changed are computing diffs under the hood to avoid moving whole files.</li>
    </ul>

    <h2>The limits worth knowing</h2>
    <p>A text diff compares <em>text</em>, which means it's blind to meaning. Two things follow. First, a change that's semantically trivial can look large: reformatting a file, re-indenting a block, or re-wrapping a paragraph rewrites many lines without changing what any of it means. That's why "ignore whitespace" exists — it tells the diff to treat spacing changes as noise. Second, a change that's semantically huge can look tiny: flipping a single <code>&lt;</code> to <code>&gt;</code>, or deleting one "not", is a one-character diff with outsized consequences. The tool shows you <em>where</em> things differ; judging <em>how much it matters</em> is still your job.</p>
    <p>There's also the question of order. A text diff assumes the two versions are meant to be in the same sequence. If you compare two lists that were simply sorted differently, nearly every line will read as moved, even though the sets are identical — the fix is to <a href="/${D}/compare-two-lists">sort both sides first</a>, or use a comparison that ignores order.</p>

    <h2>The takeaway</h2>
    <p>A diff is a minimal, mechanical description of what changed between two texts — nothing more, nothing less. Understanding that it works on text (not meaning) and assumes a shared order tells you when to trust it at a glance and when to slow down: turn on "ignore whitespace" when formatting is drowning the signal, read word-level highlights for the real edit, and treat a small-looking change in something high-stakes with the same care as a large one. Everything a good <a href="/${D}/code-diff">diff checker</a> does is in service of one goal — showing you the change instead of making you hunt for it.</p>`,
  },
  {
    slug: "how-to-review-a-pull-request",
    title: "How to review a pull request well",
    description:
      "A practical guide to reviewing code changes: what to actually look for, how to read a diff efficiently, and how to give feedback that helps.",
    date: "2026-07-23",
    read: 7,
    excerpt:
      "Good code review is a skill, not a rubber stamp. Here's a repeatable way to read a diff, what to prioritise, and how to leave feedback people can act on.",
    bodyHtml: `
    <p>Reviewing a pull request is one of the highest-leverage things a developer does and one of the least taught. Done well, review catches bugs early, spreads knowledge across a team, and keeps a codebase coherent. Done as a rubber stamp — "LGTM" thirty seconds after it lands — it does none of those things and quietly trains everyone to expect nothing. Here's a way to review that's thorough without being slow, built around actually reading the diff.</p>

    <h2>Start with the description, not the code</h2>
    <p>Before you read a single line, read what the change claims to do. What problem does it solve? What's the intended approach? A pull request that can't explain itself in a few sentences is a review finding on its own. Knowing the intent gives you something to check the code <em>against</em> — otherwise you're just reading code with no way to tell whether it does the right thing.</p>

    <h2>Read the diff in the right order</h2>
    <p>Don't read a large change top to bottom in file order; that's how you drown. Instead:</p>
    <ol>
      <li><strong>Find the core change first.</strong> Most PRs have one file where the real work happens and several that just follow from it (tests, call-site updates, generated files). Read the core first so the rest makes sense.</li>
      <li><strong>Collapse the noise.</strong> Lockfiles, generated code, and pure formatting changes don't need line-by-line attention. Use "collapse unchanged" and "hide whitespace" so the diff shows you the substance, not the reflow.</li>
      <li><strong>Read tests as a spec.</strong> The tests tell you what the author thinks the code should do. If the tests are thin or missing for the risky part, that's often the most important comment you'll leave.</li>
    </ol>
    <p>When a PR mixes a real change with a big automated reformat, the review is far easier if you can see them separately. Pasting the before/after of a specific function into a <a href="/${D}/code-diff">code diff</a> with "ignore whitespace" on is a quick way to isolate the logic change from the formatter's churn.</p>

    <h2>What to actually look for</h2>
    <p>Prioritise, roughly in this order:</p>
    <ul>
      <li><strong>Correctness.</strong> Does it do what it claims? Walk the important path with a real input in your head. Check the edges: empty input, zero, null, the boundary value, the error case.</li>
      <li><strong>Security and data safety.</strong> Untrusted input reaching a query or the DOM, secrets in the diff, a permission check quietly removed. These are worth blocking on.</li>
      <li><strong>Clarity.</strong> Will the next person understand this in six months? Naming, a function doing three things, a comment that explains "why" where the code can't.</li>
      <li><strong>Consistency.</strong> Does it match how the surrounding code already solves this problem, or does it invent a second way to do the same thing?</li>
    </ul>
    <p>Deliberately <em>not</em> at the top: style nits a linter should catch, and personal preference dressed up as principle. If a formatter can decide it, don't spend a human's review budget on it.</p>

    <h2>Give feedback people can act on</h2>
    <p>Be specific and be kind — they're the same skill. "This is confusing" helps no one; "this returns early when <code>items</code> is empty, so the counter never resets — was that intended?" is a comment the author can act on in one read. A few habits that help:</p>
    <ul>
      <li><strong>Ask, don't decree,</strong> when you're not certain. The author usually has context you don't.</li>
      <li><strong>Separate blocking from optional.</strong> Mark the "must fix before merge" clearly and let the "nice to have" be nice to have. A wall of equally-weighted comments is exhausting and hides the one that matters.</li>
      <li><strong>Praise the good parts.</strong> Review that only ever points at problems trains people to dread it.</li>
    </ul>

    <h2>Know when to stop</h2>
    <p>A review is not a demand for perfection; it's a check that the change is a net improvement that's safe to ship. If it's correct, clear enough, and tested, approve it — even if you'd have written it slightly differently. Perpetual back-and-forth over taste is how teams learn to route around review entirely. The goal is a codebase that stays healthy and a team that keeps learning from each other, and both of those depend on review being something people can actually finish.</p>`,
  },
  {
    slug: "merge-conflicts-explained",
    title: "Merge conflicts explained, and how to resolve them without losing work",
    description:
      "Why merge conflicts happen, what the conflict markers mean, and a safe step-by-step approach to resolving one without dropping anyone's changes.",
    date: "2026-07-23",
    read: 6,
    excerpt:
      "Conflict markers look scary but the mental model is simple: two edits to the same place, and Git wants you to decide. Here's how to resolve one safely.",
    bodyHtml: `
    <p>Few things stop a developer's momentum like <code>CONFLICT (content): Merge conflict in app.js</code>. But a merge conflict isn't an error or a sign you did something wrong — it's Git being honest. It happens whenever two branches changed the same part of a file in ways Git can't safely combine on its own, so instead of guessing (and risking dropping someone's work) it hands the decision to you. Understanding what it's actually showing you turns a conflict from a panic into a two-minute job.</p>

    <h2>Why conflicts happen</h2>
    <p>Most of the time, Git merges branches automatically: if you edited the top of a file and a colleague edited the bottom, it takes both, no questions asked. A conflict arises only when both branches touched <em>the same lines</em> — or one branch edited a line the other deleted. Git has two plausible versions of that spot and no way to know which is right, so it marks the region and asks.</p>
    <p>This is why conflicts cluster in files that everyone edits — a central config, a shared constants file, an import list — and why long-lived branches conflict more: the longer a branch lives away from the mainline, the more the two histories drift apart.</p>

    <h2>Reading the conflict markers</h2>
    <p>When Git marks a conflict, it rewrites the region between three markers:</p>
    <pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
your current branch's version
=======
the incoming branch's version
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-branch</code></pre>
    <p>Everything between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> and <code>=======</code> is <em>your</em> side (the branch you're on). Everything between <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> is the <em>incoming</em> side. Your job is to replace the whole block — markers included — with the single correct version.</p>
    <p>In a dense conflict, those two sides can be hard to compare by eye. Pasting them into a <a href="/${D}/merge-conflict-resolver">side-by-side view</a> makes it obvious what each branch actually changed, so you're deciding based on the real difference rather than squinting at interleaved lines.</p>

    <h2>A safe resolution routine</h2>
    <ol>
      <li><strong>Understand both sides before you touch anything.</strong> What was each branch trying to do here? The right answer is often not "pick one" but "combine both" — keep your change <em>and</em> theirs.</li>
      <li><strong>Edit down to the intended result.</strong> Delete the markers and the version(s) you don't want, and shape what remains into correct, working code.</li>
      <li><strong>Remove every marker.</strong> Search the file for <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>. A leftover marker compiles in some languages and breaks silently in others — either way it's a bug you'll regret.</li>
      <li><strong>Test before you commit the resolution.</strong> A conflict resolved wrong is worse than the conflict, because now the code looks finished. Run it.</li>
    </ol>

    <h2>The mistake that actually loses work</h2>
    <p>The dangerous move is resolving a conflict by keeping only one side when the correct answer was both. It's easy to do under time pressure — "I'll just take mine" — and it silently deletes a colleague's change that had merged cleanly right up until this moment. Whenever you "take one side", pause and confirm the other side's change is genuinely obsolete and not just inconvenient. When in doubt, diff the resolved file against both original versions to see exactly what you kept and what you dropped.</p>

    <h2>Preventing them in the first place</h2>
    <p>You can't avoid conflicts entirely, but you can make them small: merge or rebase from the mainline often so your branch never drifts far, keep branches short-lived, and avoid sweeping reformats in the same change as real logic (a formatting-only commit conflicts with everything). Conflicts are a normal cost of people working in parallel — the goal isn't zero conflicts, it's conflicts that are small enough to resolve with confidence.</p>`,
  },
  {
    slug: "diffing-config-files-safely",
    title: "How to diff config files without breaking production",
    description:
      "Config files punch above their weight — a one-line change can take a service down. A practical guide to comparing YAML, JSON, .env and other config safely.",
    date: "2026-07-23",
    read: 6,
    excerpt:
      "A one-line config change can take a whole service down. Here's how to compare config files carefully — and the format-specific traps that catch people out.",
    bodyHtml: `
    <p>Config files are where a tiny change does maximum damage. A single wrong port, a missing environment variable, a mis-indented key, and a service that was fine a moment ago won't start. Because config is edited less often than code and reviewed less carefully, it's exactly where a careful diff earns its keep. But config formats each have their own traps, and a naive comparison can both miss real changes and invent fake ones. Here's how to compare config safely.</p>

    <h2>Always diff before you deploy config</h2>
    <p>The habit worth building is simple: before applying a config change to anything that matters, compare the new version against the running one and read every difference. Not skim — read. Config diffs are usually short, so this costs seconds, and it catches the class of outage that's purely "we didn't notice what this change also did". If your deploy tooling can show you the effective change (Terraform's <code>plan</code>, Kubernetes' diff), read that too — it's the difference between diffing what you <em>wrote</em> and diffing what will actually <em>change</em>.</p>

    <h2>The whitespace trap: know your format</h2>
    <p>The single most important question when diffing config is whether whitespace matters, because it decides whether "ignore whitespace" is a helpful de-noiser or a dangerous blindfold.</p>
    <ul>
      <li><strong>YAML</strong> (including <a href="/${D}/config-diff">docker-compose</a> and Kubernetes manifests): indentation <em>is</em> structure. A change in leading spaces can re-nest a key under a different parent — a real, easy-to-miss semantic change. <strong>Never</strong> ignore whitespace when diffing <a href="/${D}/yaml-diff">YAML</a>, and turn on "show invisibles" to catch a stray tab (YAML forbids tabs for indentation).</li>
      <li><strong>JSON</strong>: whitespace is insignificant, so ignoring it is safe and useful — but key <em>order</em> isn't significant either, which a text diff doesn't know. Pretty-print both sides consistently first, or reordered keys will read as changes.</li>
      <li><strong>INI, TOML, .env, nginx</strong>: mostly whitespace-tolerant, but each has its own quirks — quoting rules, comment styles, and directives whose order matters.</li>
    </ul>

    <h2>What to look for, by file</h2>
    <p>Different config files fail in different ways, so know the high-signal changes for each:</p>
    <ul>
      <li><a href="/${D}/env-diff"><strong>.env files</strong></a>: the classic breaker is a <em>missing</em> key — a variable present in one environment and absent in the other. Diff staging against production, or <code>.env</code> against <code>.env.example</code>, to catch it. (And because these hold secrets, use a comparison that runs locally and never uploads them.)</li>
      <li><a href="/${D}/config-diff"><strong>Dockerfiles</strong></a>: watch the base image tag (<code>node:20</code> vs <code>node:20-alpine</code> is a different OS) and instruction <em>order</em>, which changes what gets cached and rebuilt.</li>
      <li><a href="/${D}/config-diff"><strong>nginx</strong></a>: the order and specificity of <code>location</code> blocks decides which one handles a request; a reordered block can silently reroute traffic.</li>
      <li><a href="/${D}/config-diff"><strong>Terraform</strong></a>: some argument changes update a resource in place; others force it to be destroyed and recreated. Know which before you apply.</li>
    </ul>

    <h2>Keep secrets out of harm's way</h2>
    <p>Config is where credentials live, which shapes <em>how</em> you should diff it. Pasting a production <code>.env</code> or a config full of API keys into a web tool that uploads it to a server is a quiet security incident. Prefer a <a href="/${D}/private-diff-checker">comparison that runs entirely in your browser</a>, where the files never leave your machine — you can confirm nothing is sent in your browser's Network tab. And be careful sharing the <em>result</em> of a secret-bearing diff, too: the changed values may be live credentials.</p>

    <h2>The habit that prevents outages</h2>
    <p>Most config-driven outages aren't caused by a hard change — they're caused by an <em>unnoticed</em> one: a value nudged, a key dropped, an indent shifted. A thirty-second diff-and-read before every config deploy, with the whitespace setting matched to the format, catches almost all of them. It's the cheapest reliability practice there is.</p>`,
  },
  {
    slug: "line-word-and-semantic-diffs",
    title: "Line, word and semantic diffs: which comparison you actually need",
    description:
      "Not all diffs are the same. Understanding line-level, word-level and structure-aware comparison helps you pick the right view and avoid being misled.",
    date: "2026-07-23",
    read: 5,
    excerpt:
      "“The files are different” is rarely enough. Line, word, and structure-aware diffs each answer a different question — here's when to reach for which.",
    bodyHtml: `
    <p>"These two files are different" is almost never the answer you want. You want to know <em>how</em> they differ, and at what level of detail — and that's where it helps to know that "a diff" isn't one thing. Line, word and structure-aware comparisons each answer a different question, and picking the wrong one means either missing the change you cared about or being buried in noise you didn't.</p>

    <h2>Line-level: the default, and its blind spot</h2>
    <p>The standard diff — what Git shows, what a <a href="/${D}/online-diff-checker">diff checker</a> does by default — works line by line. It's fast, it maps cleanly onto how code is written, and it's what everyone means by "the diff". Its blind spot is granularity: change one word and the entire line is marked as removed-and-re-added. For code that's usually fine, but for prose, where a "line" might be a whole paragraph, it can flag an eighty-word paragraph as changed because you fixed one typo.</p>

    <h2>Word- and character-level: seeing the real edit</h2>
    <p>A word-level diff runs a second comparison <em>inside</em> each changed line, highlighting just the tokens that moved. This is what lets you see that "the quick brown fox" became "the quick red fox" with only one word touched, rather than the whole line lighting up. For editing prose, reviewing a reworded sentence, or spotting a one-character code change buried in a long line, word- or character-level detail is the difference between the tool pointing at the change and you hunting for it. When you <a href="/${D}/online-diff-checker">compare two blocks of text</a>, it's usually the view you want.</p>

    <h2>Whitespace-aware vs whitespace-blind</h2>
    <p>Cutting across all of this is the whitespace question. "Ignore whitespace" tells the diff to treat spacing and indentation changes as nothing — invaluable when a formatter or a re-wrap has churned a file without changing meaning. But it's a genuine trap in whitespace-significant formats: in <a href="/${D}/code-diff">Python</a> and <a href="/${D}/yaml-diff">YAML</a>, indentation <em>is</em> the logic, so ignoring it can hide a change that moves a statement into or out of a block. The rule of thumb: ignore whitespace to cut formatting noise in languages where it's cosmetic; keep it on where indentation carries meaning.</p>

    <h2>Structure-aware: when text order lies</h2>
    <p>Sometimes even a perfect text diff gives the wrong answer, because the meaning doesn't live in the line order. Two examples:</p>
    <ul>
      <li><strong>Data with reordered rows or keys.</strong> Two <a href="/${D}/json-diff">JSON</a> objects with the same data but different key order are logically identical; a text diff calls them different. A <a href="/${D}/csv-table-diff">table-aware CSV comparison</a> lines up columns and rows regardless of order, so you see a changed <em>cell</em>, not a whole row moved.</li>
      <li><strong>Lists.</strong> Two lists containing the same items in a different order aren't really "different", but a line diff marks nearly everything as moved. <a href="/${D}/compare-two-lists">Sort both sides first</a>, and only the genuine additions and removals remain.</li>
    </ul>

    <h2>Choosing quickly</h2>
    <p>A short decision guide: for code, start with a line diff and turn on word-level highlighting for the changed lines. For prose, use word-level from the start and ignore whitespace so reflow doesn't dominate. For data where order might differ, sort or use a structure-aware comparison before you trust the result. And in any indentation-sensitive format, leave whitespace <em>on</em>. The tool can show you the difference at any of these levels — knowing which level answers your question is what makes the difference useful.</p>`,
  },
  {
    slug: "client-side-tools-and-privacy",
    title: "Why “nothing leaves your browser” matters for developer tools",
    description:
      "Many online tools quietly upload your input to a server. Here's why client-side processing matters for code, config and documents — and how to verify it.",
    date: "2026-07-23",
    read: 5,
    excerpt:
      "That online formatter you pasted your API keys into? It may have sent them to a server. Here's why client-side tools matter, and how to check for yourself.",
    bodyHtml: `
    <p>Developers paste sensitive things into online tools constantly: a JSON response with a live token in it, a config file full of credentials, a snippet of proprietary code, a chunk of a customer's data to reformat. Most of the time nothing bad happens. But the quiet assumption behind that habit — that the tool is just doing the work in your browser — is often wrong. Plenty of "online" tools upload whatever you paste to a server to process it, and once your data has left your machine, you've lost control of it.</p>

    <h2>The hidden upload</h2>
    <p>There's no visible difference between a tool that formats your JSON locally and one that POSTs it to a backend and sends the result back. Both show you a formatted result. But in the second case, your input has travelled across the internet to someone else's computer, where it may be logged, cached, retained, or — in the worst cases — inspected. For a to-do list that's harmless. For an API key, a client contract, a database dump, or an internal config, it's a data leak you performed yourself.</p>
    <p>This isn't hypothetical paranoia. It's the reason security teams at many companies block or discourage pasting code and secrets into arbitrary web tools, and why "I just used an online formatter" has been the opening line of more than one incident report.</p>

    <h2>Why client-side is different</h2>
    <p>A client-side tool does all its work in your browser using JavaScript. Your input is processed on your own device and never sent anywhere. That single architectural choice changes what's safe to do with it:</p>
    <ul>
      <li>You can <a href="/${D}/private-diff-checker">compare proprietary code</a> without it leaving your laptop.</li>
      <li>You can <a href="/${D}/env-diff">diff a production .env file</a> full of secrets without uploading your credentials.</li>
      <li>You can process a customer's data without becoming a third party that "shared" it.</li>
      <li>It keeps working offline, because there's no server for it to depend on.</li>
    </ul>
    <p>There's nothing on the tool's side to log, breach, or subpoena, because your data was never there.</p>

    <h2>How to verify a tool is really local</h2>
    <p>You don't have to take a claim on faith — you can check, in under a minute:</p>
    <ol>
      <li><strong>Open your browser's developer tools and watch the Network tab</strong> while you use the tool. A genuinely client-side tool makes no request carrying your input. If you paste a big blob and see a matching request go out, it's uploading.</li>
      <li><strong>Go offline and try it.</strong> Disconnect from the network, reload the page once it's cached, and use the tool. If it still works, the processing is happening locally. If it breaks, it needed a server.</li>
    </ol>
    <p>These two checks work for any web tool, and they're worth doing once for anything you plan to feed sensitive data.</p>

    <h2>A sensible default</h2>
    <p>The rule of thumb: if what you're about to paste is something you wouldn't email to a stranger — code you don't own, credentials, personal data, an unreleased document — use a tool that does the work in your browser, and verify it does. For everything else, convenience is fine. But building the habit around the sensitive case costs nothing and closes off a whole category of self-inflicted leak. Good developer tools should earn your trust by not needing it — by never seeing your data in the first place.</p>`,
  },
  {
    slug: "comparing-documents-without-track-changes",
    title: "How to compare two documents when Track Changes wasn't on",
    description:
      "Someone edited your document and never turned on Track Changes. Here's how to find exactly what changed between two versions of a contract, résumé or report.",
    date: "2026-07-23",
    read: 5,
    excerpt:
      "A document came back edited, with no tracked changes. Rather than re-reading both versions line by line, you can diff them — even PDFs and Word files.",
    bodyHtml: `
    <p>It's a familiar sinking feeling: a contract, a report, or a proposal comes back from the other side "with a few small changes", and Track Changes was never switched on. Now you're staring at two versions that look almost identical, knowing something moved but not what — and the something might be a single word that changes what the whole document means. Re-reading both versions in parallel is slow and unreliable; the human eye is exactly the wrong instrument for spotting a quiet edit. A diff is the right one.</p>

    <h2>Why a diff beats re-reading</h2>
    <p>When two documents are 98% identical, your attention slides over the unchanged parts and you tune out — which is precisely where a small change hides. A comparison tool doesn't get bored. It lines the two versions up, ignores everything that matches, and highlights only what's actually different, down to the individual word. A changed number, an inserted "not", a deleted clause, "shall" softened to "may" — the edits that matter most are often the smallest, and they're the ones a diff surfaces reliably and re-reading misses.</p>

    <h2>It works on real documents, not just plain text</h2>
    <p>The catch with document comparison is that contracts and résumés aren't plain text — they're <code>.pdf</code> and <code>.docx</code> files. A good comparison handles this by extracting the text from each file first, then diffing that. So you can drop in two <a href="/${D}/word-diff">Word documents</a>, two <a href="/${D}/pdf-diff">PDFs</a>, or one of each, and compare the "same" letter across formats. A few things to know about how this works:</p>
    <ul>
      <li>It compares <strong>text content</strong>, not layout. A moved logo, a font change, or reformatting won't show — but changed wording and numbers will, which is usually exactly what you care about in a contract or résumé.</li>
      <li>It needs <strong>real text</strong> in the file. A scanned PDF that's really an image of pages has no extractable text, so there's nothing to compare (you'd need OCR first).</li>
      <li>Turn on <strong>ignore whitespace</strong> so that a reflowed paragraph — common when a document has been through a different editor — doesn't read as entirely rewritten.</li>
    </ul>

    <h2>Common situations where this saves you</h2>
    <ul>
      <li><strong>Contracts and agreements.</strong> Verify "we only changed a couple of clauses" is true before you sign. A <a href="/${D}/contract-diff">contract comparison</a> catches the single word that shifts liability.</li>
      <li><strong>Résumés and applications.</strong> Confirm the version you're about to send is the one tailored to <em>this</em> role, and that a quick edit didn't introduce an inconsistency elsewhere.</li>
      <li><strong>Reports and proposals.</strong> See exactly what a collaborator changed between drafts, so nothing slips through unreviewed.</li>
    </ul>

    <h2>Keep the documents private</h2>
    <p>Documents like these are often confidential — a draft agreement, a personal résumé with your address on it, an internal report. That makes it worth using a comparison that runs entirely in your browser, where the files are read locally and never uploaded to anyone's server. You get the answer without turning a private document into something you've handed to a third party.</p>

    <h2>The bottom line</h2>
    <p>When Track Changes wasn't on, you're not stuck re-reading and hoping. Extract-and-diff turns "something changed and I can't find it" into a highlighted list of exactly what moved, works across PDF and Word, and — done client-side — does it without compromising a confidential document. It's a two-minute check that can save you from signing the version you didn't agree to.</p>`,
  },
];
