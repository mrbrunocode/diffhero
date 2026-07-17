# SEO action plan for a beginner (Bruno's checklist)

You've never done SEO. Good news: 80% of it for a site like this is already
automated by the build engine. What's left is a short list of one-time setups,
a tiny weekly habit, and patience. Do these **in order** — they're prioritized
by impact-per-minute.

The one mental model you need: **Google sends traffic to pages it has (a)
found, (b) trusted enough to index, and (c) ranked.** Everything below serves
one of those three.

---

## Priority 1 — One-time setup (do this week, ~1 hour total)

### 1.1 Confirm Search Console is wired (10 min) — *(a) found*
You already verified diffhero + submitted the sitemap (per repo notes). Verify
it's actually working: [search.google.com/search-console](https://search.google.com/search-console)
→ diffhero.app property → **Sitemaps** → should say "Success", and
**Pages** → some pages "Indexed". If sitemap says anything but Success,
resubmit with the FULL url: `https://diffhero.app/sitemap.xml`.

### 1.2 Bing Webmaster Tools (10 min) — *(a) found*
Bing powers Copilot answers and ~5-10% of search. Go to
[bing.com/webmasters](https://www.bing.com/webmasters), sign in, use
**"Import from Google Search Console"** (one click, no new verification),
submit the same sitemap URL. (Repo already has the Bing verification meta
tag, so this should be instant.)

### 1.3 IndexNow automation (0 min — shipped) — *(a) found*
`.github/workflows/indexnow.yml` now pings Bing/Yandex/etc. automatically on
every push to main. You never have to remember this again. Google ignores
IndexNow but re-reads the sitemap on its own.

### 1.4 Set a baseline (5 min) — *so you can tell if anything works*
In Search Console → **Performance**, note today's numbers (probably ~0
clicks). Screenshot it. SEO progress is invisible without a baseline.

---

## Priority 2 — The weekly habit (15 min, same day each week)

Open Search Console → Performance, look at exactly three things:
1. **Total impressions** (is Google *showing* us at all? — this moves first,
   weeks before clicks do. Rising impressions with zero clicks is *normal
   early progress*, not failure)
2. **Queries** — what searches are we appearing for? Any surprises = ideas
   for new `PAGES` rows.
3. **Pages → Not indexed** — if a page says "Crawled - currently not
   indexed", its copy is probably too thin/similar to a sibling page.
   That's a rewrite signal, not a Google bug.

Then close the tab. Don't check daily — nothing moves daily, and you'll
just demoralize yourself.

---

## Priority 3 — Content growth (the actual revenue lever, ongoing)

One new **genuinely differentiated** `PAGES` row per week beats twenty
templated ones shipped in a burst (Google's March 2026 update specifically
punishes find-and-replace template pages — see
`boring-app-factory/docs/seo-outreach-plan.md`).

A good new row answers a real query with a fact that is **only true of that
page** ("a .docx is a zip of XML, so..." on the docx page). Test: if you can
swap the noun and the paragraph still reads fine, it's too thin — rewrite.

Where to find query ideas, free:
- Search Console → Queries (see 2.2 above) — queries you get impressions
  for but have no dedicated page for yet.
- Type "diff" / "compare two" into Google and read the autocomplete +
  "People also ask" boxes.
- `docs/strategy.md` Phase 2 lists the planned clusters (image, docx, PDF).

---

## Priority 4 — Backlinks, explained from zero

**What they are:** a link from someone else's site to yours. Google treats
each one as a vote of confidence; votes from relevant, reputable sites count
far more than votes from junk. A handful of honest, relevant links is worth
more than hundreds of spammy ones — and spammy ones can get the whole domain
penalized.

**What never to do (can kill the site):** buy links, swap links "you link me
I link you", spam forums/comments, use "backlink services" on Fiverr. All of
it is detectable and manual-action-eligible.

**What actually works for a tool site, in effort order:**

1. **Directory & list submissions (do first, ~30 min each).** Free-tool
   directories and GitHub "awesome" lists exist to link to things like
   Diffhero. Targets: AlternativeTo (create listing as a Diffchecker
   alternative — high intent!), Product Hunt (also a launch venue), 
   free-for.dev, awesome-tools style GitHub lists (submit a PR), 
   ToolFinder-type directories. Honest one-line description, done. An agent
   can draft these; straightforward forms can even be submitted by one.
2. **"Show HN" / Reddit (one shot each, human-only, pick a calm day).**
   A "Show HN: I made a diff checker where nothing leaves your browser"
   post can bring thousands of visits and several organic links in a day.
   Rules: you post it yourself, you stay around to answer comments, you
   never repost the same thing. Relevant subreddits: r/webdev, r/SideProject,
   r/InternetIsBeautiful (read each sub's self-promo rules first).
   I can draft the copy; you choose the day and press the button.
3. **Be the citable answer (slow burn, free).** The invisible-characters
   page idea in `strategy.md` is the type of page bloggers and Stack
   Overflow answers link to *on their own* ("here's why your strings look
   identical but differ"). Useful reference content earns links passively;
   tool homepages rarely do.
4. **Skip for now:** paid backlink analysis tools (Ahrefs etc., ~$100/mo) —
   pointless before there's traffic. Revisit at ~1k visits/mo.

Reality check: expect single-digit backlinks in the first months. That's
fine. For long-tail queries with weak competition, on-page quality (already
automated) does most of the ranking work; links mainly accelerate it.

---

## Priority 5 — Quarterly (30 min)
- Re-run the audit skills from a Claude session: `seo-technical`,
  `seo-content` across PAGES (catches copy drifting toward templated),
  `seo-schema`.
- Check Search Console → Pages → Not indexed; fix those before adding more.
- Re-check the AdSense application status (submitted 2026-07-16); after
  approval, run `node scripts/enable-adsense.mjs ca-pub-… --slot …` and
  enable the EEA/UK consent message in the AdSense dashboard.

---

## What you should expect (so you don't quit at the trough)
- **Weeks 1–4:** impressions creep up, clicks ≈ 0. Normal.
- **Months 2–3:** first long-tail clicks (the weird specific queries rank
  first). AdSense approval hopefully lands → first cents.
- **Months 4–6:** if pages keep growing and stay differentiated, compounding
  starts. This is where most people quit; the model prices in months of ~$0.
- Signals worth reacting to: a page with impressions but terrible position
  (>50) after 3 months → rewrite it; a page with position <10 but no clicks
  → its title/description isn't clickable, rewrite those.
