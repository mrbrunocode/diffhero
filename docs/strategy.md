# Diffhero strategy — winning the serverless diff-checker niche

Written 2026-07-17 from live competitor research. Goal: make Diffhero the best
**client-side** diff checker online and maximize AdSense income within the
family's one-slot discipline.

## 1. The competitive map (July 2026)

| Competitor | Model | Weakness we exploit |
|---|---|---|
| **diffchecker.com** (the giant) | Freemium, $15/mo Pro | Free tier caps unified view, char-level diff, whitespace-ignore, syntax highlighting, merge, hide-unchanged at **5–10 uses/month**. Server-side for shared diffs, ad-tracked, public share URLs. |
| **diffchecker.dev / diffchecker.io** | Free, client-side | Same privacy pitch as us; thin long-tail (few format-specific pages), no share links, weaker word-level UX. |
| **text-compare.com** | Free, ads | Dated UI, server-side, line-level only. |
| **textcompare.org** | Free, ads | Client-side but cluttered; many formats but shallow pages. |
| **Draftable** | Freemium B2B | PDF/Word/Excel focus; uploads for the free web tool. |

**The wedge:** everything Diffchecker charges $15/mo for, Diffhero gives away
unlimited — and nothing ever leaves the browser. Say this explicitly on the
homepage and the `/diff/private-diff-checker` page; it is the single most
persuasive true sentence we can write.

## 2. Feature roadmap (phased, all static-feasible)

**Status check 2026-07-21: nearly this entire roadmap is already built.**
Items 1–9 and 11 below are done (verified against the current `pages.mjs`/
`assets/app.js`, not just recalled) — this section was badly out of date
before this pass. Only item 10 (PWA/offline) is still open.

Already shipped and free-unlimited (Diffchecker gates all of these): split +
unified views, word-level inline diff, syntax highlighting, ignore
whitespace/case, collapse unchanged, wrap toggle, share link, .diff export,
drag-and-drop files, JSON normalization, dark/light, plus everything marked
✅ below.

### Phase 1 — cheap wins that close real gaps (each ~a session)
1. ✅ **Character-level diff toggle** — shipped ("Character detail" checkbox).
   Diffchecker Pro-gates this equivalent.
2. ✅ **Printable report / "Export PDF"** — shipped (Print / PDF button).
3. ✅ **Compressed share links** — shipped (`CompressionStream("deflate-raw")`).
4. ✅ **Invisible-character revealer** — shipped as its own page,
   `/diff/invisible-character-checker`, not just an in-tool toggle.
5. ✅ **Find & replace inside the editors** — shipped.

### Phase 2 — new tool surfaces (each unlocks a long-tail cluster)
6. ✅ **Image diff** — shipped 2026-07-21 (`/diff/image-diff`, canvas
   pixel-highlight with adjustable sensitivity). **Still open:** the
   originally-suggested png-diff/screenshot-compare sub-pages — right now
   there's one general image-diff page, not the finer-grained cluster.
7. ✅ **Word (.docx) diff** — shipped (`/diff/word-diff`, mammoth.js).
   The suggested cluster is covered too: `/diff/contract-diff`,
   `/diff/resume-diff`, `/diff/essay-diff` all exist.
8. ✅ **PDF text diff** — shipped (`/diff/pdf-diff`, pdf.js).
9. ✅ **Merge view** — shipped as `/diff/merge-conflict-resolver` (also
   satisfies item 11 below — same feature, one page).

### Phase 3 — moats
10. 🔲 **PWA / installable + offline — not built yet.** No `manifest.json` or
    service worker in this repo (CountLink has one; Diffhero doesn't). Still
    the one clearly-open item on this list — a manifest + tiny service worker
    makes "works offline" provable and adds a return loop (installed app =
    direct traffic, less SERP dependence).
11. ✅ **3-way diff / conflict resolver** — same feature as item 9,
    `/diff/merge-conflict-resolver`.

Skip (violate the model): real-time collaboration, folder diff at scale,
accounts, AI summaries (server + cost), anything requiring upload.

## 3. Usability bar
- Tool above the fold at 375×667; zero CLS (reserve heights); keep total
  page weight under ~60 KB gzipped on non-PDF pages.
- Every feature works keyboard-only; Alt+↑/↓ already navigates changes —
  document shortcuts in a footer hint.
- Never gate, never nag, never count uses. The absence of a paywall **is**
  the brand.

## 4. AdSense maximization (within the one-slot rule)
- **Traffic is the only real lever.** RPM tuning is noise until the site has
  thousands of sessions; page count × indexation is what compounds.
- Keep the single responsive slot below the tool (vClock-proven placement).
  Revisit only after approval + meaningful traffic, then A/B via AdSense
  Experiments (not by adding slots blindly).
- Bias new long-tail pages toward **high-CPC intent**: legal (contract
  redline), business (policy/proposal versions), dev-tools (config/infra
  diffs) — these advertisers pay multiples of generic "text tools".
- The docx/PDF clusters (Phase 2) are the RPM play: legal/business queries
  with commercial advertisers, currently answered only by upload-based tools.

## 5. Sequencing recommendation

**Done as of 2026-07-21** — see the status check at the top of §2. The
original recommendation here (Phase 1 items 1–3, then image-diff, then docx)
is exactly what happened, just also including everything else in Phase 1/2/3
except PWA/offline.

Next up, in order: (a) **PWA/offline** (§2 item 10, the one open item), (b)
split the general image-diff page into the originally-suggested finer-grained
cluster (png-diff, screenshot-compare) if that traffic looks worth it once
Diffhero has real Search Console data, (c) new ideas — this doc needs a fresh
research pass rather than reusing July 17's competitor snapshot, which is now
over two weeks stale. Keep adding `PAGES` rows *with* each feature — a
feature without its long-tail pages earns nothing.
