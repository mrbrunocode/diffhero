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

Already shipped and free-unlimited (Diffchecker gates all of these): split +
unified views, word-level inline diff, syntax highlighting (~17 langs), ignore
whitespace/case, collapse unchanged, wrap toggle, share link, .diff export,
drag-and-drop files, JSON normalization, dark/light.

### Phase 1 — cheap wins that close real gaps (each ~a session)
1. **Character-level diff toggle.** Diffchecker Pro-gates this. Our word-diff
   already computes token marks; add a per-character LCS fallback for changed
   word pairs. New checkbox "Character detail".
2. **Printable report / "Export PDF".** A print stylesheet + `window.print()`
   = free "PDF export" (another Pro-gated feature). Add a "Print / Save as
   PDF" button.
3. **Compressed share links.** `CompressionStream("deflate-raw")` is native in
   all modern browsers — gzip the payload before base64. Raises the ~12 KB
   share ceiling ~3–5×, no library. Keep the old decoder for existing links.
4. **Invisible-character revealer.** When two lines *look* identical but
   differ, show a "reveal invisible characters" affordance (NBSP, zero-width,
   smart quotes, CRLF). Nobody does this well; it's the #1 "why does my diff
   show a change?" confusion. Long-tail page: "why do identical-looking texts
   differ".
5. **Find & replace inside the editors.** Small, expected, retention-positive.

### Phase 2 — new tool surfaces (each unlocks a long-tail cluster)
6. **Image diff** (client-side canvas: side-by-side / slider / onion-skin /
   pixel-highlight). Diffchecker's is free but server-side; ours is private.
   Cluster: `/diff/image-diff`, png-diff, screenshot-compare (~5–10 pages).
7. **Word (.docx) diff.** A .docx is a zip of XML — unzip client-side
   (fflate is ~8 KB, vendored), extract paragraph text, feed the existing
   engine. "compare two word documents online free without upload" is a
   high-intent, high-RPM (legal/business) query the upload-based incumbents
   can't honestly answer. Cluster: docx-diff, contract-redline, resume
   versions (~5 pages).
8. **PDF text diff** via a vendored pdf.js text extractor. Heavier (~300 KB)
   — lazy-load it only on the pdf-diff page so the rest of the site stays
   lean. Same privacy story, same high-RPM legal/business intent.
9. **Merge view.** Accept/reject each change → produces merged output +
   download. Pro-gated at Diffchecker; genuinely rare among free tools.

### Phase 3 — moats
10. **PWA / installable + offline.** A manifest + tiny service worker makes
    "works offline" provable (install it, kill wifi, diff away) and adds a
    return loop (installed app = direct traffic, less SERP dependence).
11. **3-way diff / conflict resolver** for `<<<<<<<` git conflict blocks.
    Almost no free online tool does this; devs land from "resolve merge
    conflict online".

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
Phase 1 items 1–3 next session (small, visible, close Pro-gated gaps), then
the image-diff cluster (biggest new-query surface per effort), then docx.
Add `PAGES` rows *with* each feature — a feature without its long-tail pages
earns nothing.
