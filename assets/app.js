/* Diffhero — client-side text/code diff. The whole "backend" is this file:
 *   • LCS line diff (common prefix/suffix trimmed for speed on large files)
 *   • word-level (intra-line) highlighting, merged cleanly with…
 *   • dependency-free syntax highlighting (char-scanning lexer, ~12 languages)
 *   • split and unified views with line-number gutters
 *   • collapse unchanged regions (lazy-rendered), similarity %, wrap toggle
 *   • jump-to-change navigation, file drag-and-drop, example loader
 *   • formatting-aware JSON normalization, ignore whitespace/case, CRLF-safe
 *   • shareable URL, copy/download unified .diff, shared light/dark theme toggle
 */
(function () {
  "use strict";

  // ── Theme toggle (shared across every app in the family) ──────────────────
  var root = document.documentElement;
  try { var s = localStorage.getItem("theme"); if (s) root.setAttribute("data-theme", s); } catch (e) {}
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // ── The tool ──────────────────────────────────────────────────────────────
  var elA = document.getElementById("original");
  var elB = document.getElementById("changed");
  if (!elA || !elB) return; // prose pages have no diff tool

  var toolEl = document.querySelector(".difftool");
  var format = (toolEl && toolEl.getAttribute("data-format")) || "text";
  var out = document.getElementById("diffOutput");
  var summary = document.getElementById("diffSummary");
  var optWs = document.getElementById("optWhitespace");
  var optCase = document.getElementById("optCase");
  var optCollapse = document.getElementById("optCollapse");
  var optWrap = document.getElementById("optWrap");
  var langSel = document.getElementById("langSel");
  var changeNav = document.getElementById("changeNav");

  var CTX = 3; // context lines kept around a collapsed unchanged region

  var view = "split"; // "split" | "unified"
  try { var vs = localStorage.getItem("diffhero-view"); if (vs === "unified" || vs === "split") view = vs; } catch (e) {}

  var lang = (toolEl && toolEl.getAttribute("data-lang")) || "plain";
  if (langSel) { langSel.value = lang; if (langSel.value !== lang) lang = "plain"; }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function normalize(t) { return t.replace(/\r\n?/g, "\n"); } // CRLF/CR → LF

  // ── Syntax highlighting: a small, safe char-scanning lexer ─────────────────
  var BOOLS = toSet("true false null None True False nil undefined NaN yes no");
  function toSet(str) { var s = Object.create(null); str.split(/\s+/).forEach(function (w) { if (w) s[w] = 1; }); return { has: function (k) { return s[k] === 1; } }; }
  var CLIKE = toSet("abstract as async await boolean break byte case catch chan char class const continue debugger def default defer delete do double dyn echo else enum export extends fallthrough final finally float fn for foreign from func function global go goto if impl implements import in instanceof int interface let lock long loop map match mod module namespace native new package private protected pub public range readonly record ref return select self short static strictfp struct super switch synchronized this throw throws trait transient try type typeof union unsafe use using var virtual void volatile where while with yield");
  var PY = toSet("and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case self print");
  var SQL = toSet("SELECT FROM WHERE INSERT INTO UPDATE DELETE CREATE ALTER DROP TABLE VIEW INDEX JOIN INNER LEFT RIGHT FULL OUTER CROSS ON USING GROUP BY ORDER HAVING LIMIT OFFSET UNION ALL DISTINCT AS AND OR NOT NULL IS IN LIKE BETWEEN EXISTS VALUES SET PRIMARY KEY FOREIGN REFERENCES CONSTRAINT UNIQUE DEFAULT CASCADE CASE WHEN THEN END COUNT SUM AVG MIN MAX WITH RETURNING BEGIN COMMIT ROLLBACK TRANSACTION IF ADD COLUMN INT INTEGER VARCHAR TEXT BOOLEAN DATE TIMESTAMP SERIAL");
  var JSONC = toSet("true false null");
  var YAMLC = toSet("true false null yes no on off True False Null Yes No");

  function grammarFor(l) {
    switch (l) {
      case "javascript": case "typescript": case "clike": case "go": case "java":
      case "php": case "c": case "cpp": case "csharp": case "rust": case "kotlin": case "swift":
        return { engine: "code", line: ["//"], block: [["/*", "*/"]], strings: ['"', "'", "`"], kw: CLIKE };
      case "python":
        return { engine: "code", line: ["#"], block: [], strings: ['"', "'"], triple: true, kw: PY };
      case "json":
        return { engine: "code", line: [], block: [], strings: ['"'], kw: JSONC, keyColon: true };
      case "yaml":
        return { engine: "code", line: ["#"], block: [], strings: ['"', "'"], kw: YAMLC, keyColon: true };
      case "sql":
        return { engine: "code", line: ["--"], block: [["/*", "*/"]], strings: ["'", '"'], kw: SQL, icase: true };
      case "css":
        return { engine: "code", line: [], block: [["/*", "*/"]], strings: ['"', "'"] };
      case "html": case "xml":
        return { engine: "markup" };
      default:
        return null; // plain
    }
  }

  function coalesce(segs) {
    var outSegs = [];
    for (var i = 0; i < segs.length; i++) {
      var last = outSegs[outSegs.length - 1];
      if (last && last.cls === segs[i].cls && last.e === segs[i].s) last.e = segs[i].e;
      else outSegs.push({ s: segs[i].s, e: segs[i].e, cls: segs[i].cls });
    }
    return outSegs;
  }

  function codeScan(line, cfg) {
    var segs = [], i = 0, n = line.length;
    function push(s, e, cls) { if (e > s) segs.push({ s: s, e: e, cls: cls }); }
    var wordStart = function (c) { return /[A-Za-z_$@]/.test(c); };
    var wordChar = function (c) { return /[A-Za-z0-9_$]/.test(c); };
    while (i < n) {
      var c = line[i], done = false, k;
      if (cfg.line) for (k = 0; k < cfg.line.length; k++) if (line.lastIndexOf(cfg.line[k], i) === i) { push(i, n, "com"); i = n; done = true; break; }
      if (done) break;
      if (cfg.block) for (k = 0; k < cfg.block.length; k++) {
        var o = cfg.block[k][0], cl = cfg.block[k][1];
        if (line.lastIndexOf(o, i) === i) { var idx = line.indexOf(cl, i + o.length); var end = idx < 0 ? n : idx + cl.length; push(i, end, "com"); i = end; done = true; break; }
      }
      if (done) continue;
      if (cfg.triple) { var t3 = line.lastIndexOf('"""', i) === i ? '"""' : (line.lastIndexOf("'''", i) === i ? "'''" : null);
        if (t3) { var ix = line.indexOf(t3, i + 3); var e3 = ix < 0 ? n : ix + 3; push(i, e3, "str"); i = e3; continue; } }
      if (cfg.strings && cfg.strings.indexOf(c) >= 0) {
        var q = c, j = i + 1;
        while (j < n) { if (line[j] === "\\") { j += 2; continue; } if (line[j] === q) { j++; break; } j++; }
        push(i, Math.min(j, n), "str"); i = Math.min(j, n); continue;
      }
      if (c >= "0" && c <= "9" && !(i > 0 && wordChar(line[i - 1]))) {
        var jn = i; while (jn < n && /[0-9a-fA-FxXoObB._]/.test(line[jn])) jn++; push(i, jn, "num"); i = jn; continue;
      }
      if (wordStart(c)) {
        var jw = i; while (jw < n && wordChar(line[jw])) jw++; var w = line.slice(i, jw), cls = null;
        if (BOOLS.has(w)) cls = "bool";
        else if (cfg.kw && cfg.kw.has(cfg.icase ? w.toUpperCase() : w)) cls = "kw";
        push(i, jw, cls); i = jw; continue;
      }
      push(i, i + 1, /[{}()\[\];,.:<>=+\-*/%!&|^~?]/.test(c) ? "punct" : null); i++;
    }
    if (cfg.keyColon) {
      for (var p = 0; p < segs.length; p++) {
        var sg = segs[p];
        if (sg.cls === "str" || sg.cls === null || sg.cls === "bool") {
          var m = p + 1;
          while (m < segs.length && line.slice(segs[m].s, segs[m].e).trim() === "") m++;
          if (m < segs.length && line[segs[m].s] === ":") {
            var txt = line.slice(sg.s, sg.e);
            if (sg.cls === "str" || /^[A-Za-z0-9_\-]+$/.test(txt)) sg.cls = "key";
          }
        }
      }
    }
    return coalesce(segs);
  }

  function markupScan(line) {
    var segs = [], i = 0, n = line.length;
    function push(s, e, cls) { if (e > s) segs.push({ s: s, e: e, cls: cls }); }
    var nameCh = function (c) { return /[A-Za-z0-9:_\-]/.test(c); };
    while (i < n) {
      if (line[i] === "<") {
        if (line.lastIndexOf("<!--", i) === i) { var c = line.indexOf("-->", i); var end = c < 0 ? n : c + 3; push(i, end, "com"); i = end; continue; }
        push(i, i + 1, "punct"); var j = i + 1;
        if (line[j] === "/" || line[j] === "!") { push(j, j + 1, "punct"); j++; }
        var ts = j; while (j < n && nameCh(line[j])) j++; push(ts, j, "tag");
        while (j < n && line[j] !== ">") {
          if (/\s/.test(line[j])) { var ws = j; while (j < n && /\s/.test(line[j])) j++; push(ws, j, null); continue; }
          if (line[j] === "/") { push(j, j + 1, "punct"); j++; continue; }
          var as = j; while (j < n && nameCh(line[j])) j++;
          if (j > as) push(as, j, "attr");
          if (line[j] === "=") {
            push(j, j + 1, "punct"); j++;
            if (line[j] === '"' || line[j] === "'") { var q = line[j], vs = j; j++; while (j < n && line[j] !== q) j++; if (j < n) j++; push(vs, j, "str"); }
          } else if (j === as) { push(j, j + 1, null); j++; } // guarantee progress
        }
        if (line[j] === ">") { push(j, j + 1, "punct"); j++; }
        i = j;
      } else {
        var t = i; while (i < n && line[i] !== "<") i++; push(t, i, null);
      }
    }
    return coalesce(segs);
  }

  var tokCache = Object.create(null), tokCacheN = 0;
  function tokenize(line, l) {
    if (l === "plain" || line.length > 2000) return [{ s: 0, e: line.length, cls: null }];
    var key = l + " " + line;
    if (tokCache[key]) return tokCache[key];
    var g = grammarFor(l), segs;
    try { segs = !g ? [{ s: 0, e: line.length, cls: null }] : (g.engine === "markup" ? markupScan(line) : codeScan(line, g)); }
    catch (e) { segs = [{ s: 0, e: line.length, cls: null }]; }
    if (tokCacheN > 4000) { tokCache = Object.create(null); tokCacheN = 0; }
    tokCache[key] = segs; tokCacheN++;
    return segs;
  }

  // Merge syntax segments with word-diff ranges → valid non-overlapping spans.
  function highlightLine(line, marks, markCls) {
    if (line === "") return "&nbsp;";
    marks = marks || [];
    var segs = tokenize(line, lang), html = "", mi = 0;
    for (var k = 0; k < segs.length; k++) {
      var seg = segs[k], pos = seg.s;
      while (pos < seg.e) {
        while (mi < marks.length && marks[mi][1] <= pos) mi++;
        var inMark = mi < marks.length && marks[mi][0] <= pos && pos < marks[mi][1];
        var next;
        if (inMark) next = Math.min(seg.e, marks[mi][1]);
        else next = (mi < marks.length && marks[mi][0] > pos) ? Math.min(seg.e, marks[mi][0]) : seg.e;
        var text = esc(line.slice(pos, next));
        var cls = (seg.cls ? "tok-" + seg.cls : "") + (inMark ? (seg.cls ? " " : "") + markCls : "");
        html += cls ? '<span class="' + cls + '">' + text + "</span>" : text;
        pos = next;
      }
    }
    return html || "&nbsp;";
  }

  // ── Diff core ──────────────────────────────────────────────────────────────
  var jsonFallback = false;
  function prep(text) {
    if (format === "json") {
      try { return JSON.stringify(JSON.parse(text), null, 2); }
      catch (e) { jsonFallback = true; return text; }
    }
    return text;
  }
  function lineKey(line) {
    var k = line;
    if (optWs && optWs.checked) k = k.replace(/\s/g, "");
    if (optCase && optCase.checked) k = k.toLowerCase();
    return k;
  }

  function lcs(a, b, keyFn) {
    var n = a.length, m = b.length;
    if (n * m > 8000000) return null;
    var ak = keyFn ? a.map(keyFn) : a, bk = keyFn ? b.map(keyFn) : b;
    var dp = [];
    for (var i = 0; i <= n; i++) dp.push(new Int32Array(m + 1));
    for (i = n - 1; i >= 0; i--)
      for (var j = m - 1; j >= 0; j--)
        dp[i][j] = ak[i] === bk[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    var ops = [], x = 0, y = 0;
    while (x < n && y < m) {
      if (ak[x] === bk[y]) { ops.push({ t: " ", ai: x, bi: y }); x++; y++; }
      else if (dp[x + 1][y] >= dp[x][y + 1]) { ops.push({ t: "-", ai: x }); x++; }
      else { ops.push({ t: "+", bi: y }); y++; }
    }
    while (x < n) ops.push({ t: "-", ai: x++ });
    while (y < m) ops.push({ t: "+", bi: y++ });
    return ops;
  }

  // Word-level diff between two changed lines → changed char-ranges per side.
  function tokenMarks(delStr, addStr) {
    var re = /(\s+|\S+)/g, m, at = [], bt = [];
    while ((m = re.exec(delStr))) at.push({ x: m[0], s: m.index, e: m.index + m[0].length });
    re.lastIndex = 0;
    while ((m = re.exec(addStr))) bt.push({ x: m[0], s: m.index, e: m.index + m[0].length });
    if (at.length * bt.length > 250000) return { del: [[0, delStr.length]], add: [[0, addStr.length]] };
    var ops = lcs(at.map(function (t) { return t.x; }), bt.map(function (t) { return t.x; }));
    if (!ops) return { del: [[0, delStr.length]], add: [[0, addStr.length]] };
    var del = [], add = [];
    function pushRange(arr, s, e) { var last = arr[arr.length - 1]; if (last && last[1] === s) last[1] = e; else arr.push([s, e]); }
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i];
      if (o.t === "-") pushRange(del, at[o.ai].s, at[o.ai].e);
      else if (o.t === "+") pushRange(add, bt[o.bi].s, bt[o.bi].e);
    }
    return { del: del, add: add };
  }

  function buildRows(aLines, bLines) {
    var n = aLines.length, m = bLines.length;
    var ak = aLines.map(lineKey), bk = bLines.map(lineKey);
    var p = 0; while (p < n && p < m && ak[p] === bk[p]) p++;
    var sa = n, sb = m; while (sa > p && sb > p && ak[sa - 1] === bk[sb - 1]) { sa--; sb--; }

    var rows = [], an = 1, bn = 1, i;
    for (i = 0; i < p; i++) rows.push({ type: "same", an: an++, bn: bn++, line: aLines[i] });

    var midAk = ak.slice(p, sa), midBk = bk.slice(p, sb);
    if (midAk.length * midBk.length > 8000000) return null;
    var ops = lcs(midAk, midBk);
    if (!ops) return null;
    var pd = [], pa = [];
    function flush() {
      var k = Math.min(pd.length, pa.length), q;
      for (q = 0; q < k; q++) {
        var mk = tokenMarks(pd[q], pa[q]);
        rows.push({ type: "mod", an: an + q, bn: bn + q, del: pd[q], add: pa[q], dMarks: mk.del, aMarks: mk.add });
      }
      for (q = k; q < pd.length; q++) rows.push({ type: "del", an: an + q, line: pd[q] });
      for (q = k; q < pa.length; q++) rows.push({ type: "add", bn: bn + q, line: pa[q] });
      an += pd.length; bn += pa.length; pd = []; pa = [];
    }
    for (var z = 0; z < ops.length; z++) {
      var o = ops[z];
      if (o.t === " ") { flush(); rows.push({ type: "same", an: an, bn: bn, line: aLines[p + o.ai] }); an++; bn++; }
      else if (o.t === "-") pd.push(aLines[p + o.ai]);
      else pa.push(bLines[p + o.bi]);
    }
    flush();
    for (i = sa; i < n; i++) rows.push({ type: "same", an: an++, bn: bn++, line: aLines[i] });
    return rows;
  }

  // Per-row HTML for one semantic row (unified may emit two physical lines).
  function rowHtml(r, v, anchor) {
    if (v === "unified") {
      if (r.type === "same")
        return '<div class="dline same"><span class="gut">' + r.an + '</span><span class="gut">' + r.bn + '</span><span class="dsign"> </span><span class="dtext">' + highlightLine(r.line, [], "") + "</span></div>";
      if (r.type === "mod")
        return '<div class="dline del"' + anchor + '><span class="gut">' + r.an + '</span><span class="gut"></span><span class="dsign">-</span><span class="dtext">' + highlightLine(r.del, r.dMarks, "wd-del") + "</span></div>" +
               '<div class="dline add"><span class="gut"></span><span class="gut">' + r.bn + '</span><span class="dsign">+</span><span class="dtext">' + highlightLine(r.add, r.aMarks, "wd-add") + "</span></div>";
      if (r.type === "del")
        return '<div class="dline del"' + anchor + '><span class="gut">' + r.an + '</span><span class="gut"></span><span class="dsign">-</span><span class="dtext">' + highlightLine(r.line, [], "") + "</span></div>";
      return '<div class="dline add"' + anchor + '><span class="gut"></span><span class="gut">' + r.bn + '</span><span class="dsign">+</span><span class="dtext">' + highlightLine(r.line, [], "") + "</span></div>";
    }
    var L, R;
    if (r.type === "same") {
      L = '<span class="gut">' + r.an + '</span><span class="dtext">' + highlightLine(r.line, [], "") + "</span>";
      R = '<span class="gut">' + r.bn + '</span><span class="dtext">' + highlightLine(r.line, [], "") + "</span>";
      return '<div class="drow"><div class="dcell">' + L + '</div><div class="dcell">' + R + "</div></div>";
    }
    if (r.type === "mod") {
      L = '<span class="gut">' + r.an + '</span><span class="dtext">' + highlightLine(r.del, r.dMarks, "wd-del") + "</span>";
      R = '<span class="gut">' + r.bn + '</span><span class="dtext">' + highlightLine(r.add, r.aMarks, "wd-add") + "</span>";
      return '<div class="drow"' + anchor + '><div class="dcell del">' + L + '</div><div class="dcell add">' + R + "</div></div>";
    }
    if (r.type === "del") {
      L = '<span class="gut">' + r.an + '</span><span class="dtext">' + highlightLine(r.line, [], "") + "</span>";
      return '<div class="drow"' + anchor + '><div class="dcell del">' + L + '</div><div class="dcell empty"></div></div>';
    }
    R = '<span class="gut">' + r.bn + '</span><span class="dtext">' + highlightLine(r.line, [], "") + "</span>";
    return '<div class="drow"' + anchor + '><div class="dcell empty"></div><div class="dcell add">' + R + "</div></div>";
  }

  // Render the diff. Long unchanged runs collapse to a lazy expander (rows are
  // rendered only when expanded — keeps big files fast to highlight).
  function renderDiff(rows, v) {
    var collapse = optCollapse && optCollapse.checked;
    var wrapCls = (optWrap && !optWrap.checked) ? " nowrap" : "";
    var html = '<div class="diff-view ' + v + wrapCls + '">';
    var i = 0, ci = -1, prevChange = false;
    while (i < rows.length) {
      if (rows[i].type === "same") {
        var j = i; while (j < rows.length && rows[j].type === "same") j++;
        var isStart = i === 0, isEnd = j === rows.length;
        var head = isStart ? 0 : CTX, tail = isEnd ? 0 : CTX;
        if (!collapse || (j - i) <= head + tail + 1) {
          for (var a = i; a < j; a++) html += rowHtml(rows[a], v, "");
        } else {
          for (var h = i; h < i + head; h++) html += rowHtml(rows[h], v, "");
          var hs = i + head, he = j - tail;
          html += '<button type="button" class="diff-expander" data-s="' + hs + '" data-e="' + he + '">▸ Show ' + (he - hs) + ' unchanged ' + ((he - hs) === 1 ? "line" : "lines") + "</button>";
          for (var t = j - tail; t < j; t++) html += rowHtml(rows[t], v, "");
        }
        prevChange = false;
        i = j;
      } else {
        var anchor = "";
        if (!prevChange) { ci++; anchor = ' data-ci="' + ci + '"'; }
        prevChange = true;
        html += rowHtml(rows[i], v, anchor);
        i++;
      }
    }
    return html + "</div>";
  }

  var lastRows = null, anchors = [], curAnchor = -1;

  function render() {
    jsonFallback = false;
    var rawA = elA.value, rawB = elB.value;
    if (!rawA && !rawB) {
      out.innerHTML = '<p class="diff-empty">Paste something into both boxes (or drop a file on each) to see the differences here.</p>';
      summary.textContent = ""; if (changeNav) changeNav.hidden = true; lastRows = null; anchors = []; return;
    }
    var a = prep(normalize(rawA)), b = prep(normalize(rawB));
    var aLines = a.length ? a.split("\n") : [];
    var bLines = b.length ? b.split("\n") : [];
    var rows = buildRows(aLines, bLines);
    lastRows = rows;
    if (!rows) {
      out.innerHTML = '<p class="diff-empty">These inputs are too large or too different to compare line-by-line in the browser. Try smaller sections.</p>';
      summary.textContent = ""; if (changeNav) changeNav.hidden = true; anchors = []; return;
    }
    var adds = 0, dels = 0, same = 0;
    for (var i = 0; i < rows.length; i++) {
      var ty = rows[i].type;
      if (ty === "add") adds++; else if (ty === "del") dels++;
      else if (ty === "mod") { adds++; dels++; } else same++;
    }
    if (adds === 0 && dels === 0) {
      out.innerHTML = '<p class="diff-empty diff-identical">The two inputs are identical' +
        (jsonFallback ? " as text." : (format === "json" ? " once formatting is normalised." : ".")) + "</p>";
      summary.textContent = "0 changes · 100% similar"; if (changeNav) changeNav.hidden = true; anchors = []; return;
    }
    out.innerHTML = renderDiff(rows, view);
    var total = aLines.length + bLines.length;
    var sim = total ? Math.round((2 * same / total) * 100) : 0;
    var parts = [adds + (adds === 1 ? " addition" : " additions"), dels + (dels === 1 ? " deletion" : " deletions"), sim + "% similar"];
    if (format === "json" && jsonFallback) parts.push("(JSON couldn't be parsed — compared as plain text)");
    summary.textContent = parts.join(" · ");
    anchors = Array.prototype.slice.call(out.querySelectorAll("[data-ci]"));
    curAnchor = -1;
    if (changeNav) changeNav.hidden = anchors.length === 0;
  }

  // Lazily render a collapsed region on expand (event-delegated).
  out.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".diff-expander");
    if (!btn || !lastRows) return;
    var s = parseInt(btn.getAttribute("data-s"), 10), en = parseInt(btn.getAttribute("data-e"), 10);
    var html = "";
    for (var i = s; i < en; i++) html += rowHtml(lastRows[i], view, "");
    btn.insertAdjacentHTML("afterend", html);
    btn.remove();
  });

  // Debounced render on input.
  var scheduled = false;
  function schedule() { if (scheduled) return; scheduled = true; (window.requestAnimationFrame || window.setTimeout)(function () { scheduled = false; render(); }); }
  elA.addEventListener("input", schedule);
  elB.addEventListener("input", schedule);
  [optWs, optCase, optCollapse, optWrap].forEach(function (el) { if (el) el.addEventListener("change", render); });
  if (langSel) langSel.addEventListener("change", function () { lang = langSel.value; render(); });

  // ── View toggle ───────────────────────────────────────────────────────────
  var viewSplit = document.getElementById("viewSplit");
  var viewUnified = document.getElementById("viewUnified");
  function reflectView() {
    if (viewSplit) { viewSplit.classList.toggle("is-active", view === "split"); viewSplit.setAttribute("aria-pressed", String(view === "split")); }
    if (viewUnified) { viewUnified.classList.toggle("is-active", view === "unified"); viewUnified.setAttribute("aria-pressed", String(view === "unified")); }
  }
  function setView(v) { view = v; try { localStorage.setItem("diffhero-view", v); } catch (e) {} reflectView(); render(); }
  if (viewSplit) viewSplit.addEventListener("click", function () { setView("split"); });
  if (viewUnified) viewUnified.addEventListener("click", function () { setView("unified"); });
  reflectView();

  // ── Jump-to-change navigation ──────────────────────────────────────────────
  function goToChange(dir) {
    if (!anchors.length) return;
    curAnchor = (curAnchor + dir + anchors.length) % anchors.length;
    var el = anchors[curAnchor];
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    anchors.forEach(function (a) { a.classList.remove("change-focus"); });
    el.classList.add("change-focus");
  }
  var prevBtn = document.getElementById("prevChange");
  var nextBtn = document.getElementById("nextChange");
  if (prevBtn) prevBtn.addEventListener("click", function () { goToChange(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goToChange(1); });
  document.addEventListener("keydown", function (e) {
    if (!e.altKey) return;
    if (e.key === "ArrowDown") { e.preventDefault(); goToChange(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); goToChange(-1); }
  });

  // ── File drag-and-drop (local FileReader; nothing uploaded) ────────────────
  function wireDrop(pane, textarea) {
    if (!pane) return;
    ["dragenter", "dragover"].forEach(function (ev) { pane.addEventListener(ev, function (e) { e.preventDefault(); pane.classList.add("dragover"); }); });
    ["dragleave", "dragend", "drop"].forEach(function (ev) { pane.addEventListener(ev, function (e) { e.preventDefault(); pane.classList.remove("dragover"); }); });
    pane.addEventListener("drop", function (e) {
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () { textarea.value = String(reader.result); render(); };
      reader.readAsText(file);
    });
  }
  wireDrop(document.querySelector('.diff-pane[data-side="a"]'), elA);
  wireDrop(document.querySelector('.diff-pane[data-side="b"]'), elB);

  // ── Buttons ────────────────────────────────────────────────────────────────
  var swapBtn = document.getElementById("swapBtn");
  if (swapBtn) swapBtn.addEventListener("click", function () { var t = elA.value; elA.value = elB.value; elB.value = t; render(); });
  var clearBtn = document.getElementById("clearBtn");
  if (clearBtn) clearBtn.addEventListener("click", function () {
    elA.value = ""; elB.value = ""; render(); elA.focus();
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  });
  var exampleBtn = document.getElementById("exampleBtn");
  if (exampleBtn) exampleBtn.addEventListener("click", function () {
    if (format === "json") {
      elA.value = '{\n  "name": "diffhero",\n  "version": "1.0.0",\n  "free": true,\n  "limits": { "perDay": 1 }\n}';
      elB.value = '{\n  "name": "diffhero",\n  "version": "1.1.0",\n  "free": true,\n  "limits": { "perDay": 0 },\n  "shareable": true\n}';
    } else if (lang === "python") {
      elA.value = "def greet(name):\n    msg = 'Hello, ' + name\n    print(msg)\n    return msg";
      elB.value = "def greet(name):\n    msg = f'Hi there, {name}!'\n    return msg";
    } else {
      elA.value = "function greet(name) {\n  const msg = \"Hello, \" + name;\n  console.log(msg);\n  return msg;\n}";
      elB.value = "function greet(name) {\n  const msg = `Hi there, ${name}!`;\n  return msg;\n}";
    }
    render();
  });

  // ── Shareable link (base64, UTF-8 safe) ────────────────────────────────────
  function b64encode(str) { return btoa(unescape(encodeURIComponent(str))); }
  function b64decode(str) { return decodeURIComponent(escape(atob(str))); }
  function flash(btn, msg) { var o = btn.textContent; btn.textContent = msg; setTimeout(function () { btn.textContent = o; }, 1600); }

  var shareBtn = document.getElementById("shareBtn");
  if (shareBtn) shareBtn.addEventListener("click", function () {
    var payload = "a=" + encodeURIComponent(b64encode(elA.value)) + "&b=" + encodeURIComponent(b64encode(elB.value));
    if (payload.length > 12000) { flash(shareBtn, "Too big to link — download instead"); return; }
    var url = location.origin + location.pathname + "#" + payload;
    history.replaceState(null, "", url);
    var done = function () { flash(shareBtn, "Link copied ✓"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
    else done();
  });

  function toUnifiedDiff(rows, ctx) {
    var flat = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (r.type === "same") flat.push({ t: " ", text: r.line, an: r.an, bn: r.bn });
      else if (r.type === "mod") { flat.push({ t: "-", text: r.del, an: r.an }); flat.push({ t: "+", text: r.add, bn: r.bn }); }
      else if (r.type === "del") flat.push({ t: "-", text: r.line, an: r.an });
      else flat.push({ t: "+", text: r.line, bn: r.bn });
    }
    var changed = [];
    for (i = 0; i < flat.length; i++) if (flat[i].t !== " ") changed.push(i);
    if (!changed.length) return "";
    var hunks = [], start = Math.max(0, changed[0] - ctx), end = Math.min(flat.length - 1, changed[0] + ctx);
    for (var c = 1; c < changed.length; c++) {
      if (changed[c] - ctx <= end + 1) end = Math.min(flat.length - 1, changed[c] + ctx);
      else { hunks.push([start, end]); start = Math.max(0, changed[c] - ctx); end = Math.min(flat.length - 1, changed[c] + ctx); }
    }
    hunks.push([start, end]);
    var lines = ["--- original", "+++ changed"];
    hunks.forEach(function (h) {
      var seg = flat.slice(h[0], h[1] + 1), aStart = 0, bStart = 0, aCount = 0, bCount = 0;
      seg.forEach(function (o) {
        if (o.t === " " || o.t === "-") { if (!aStart) aStart = o.an; aCount++; }
        if (o.t === " " || o.t === "+") { if (!bStart) bStart = o.bn; bCount++; }
      });
      lines.push("@@ -" + (aStart || 0) + "," + aCount + " +" + (bStart || 0) + "," + bCount + " @@");
      seg.forEach(function (o) { lines.push(o.t + o.text); });
    });
    return lines.join("\n") + "\n";
  }

  var copyBtn = document.getElementById("copyBtn");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    if (!lastRows) return;
    var text = toUnifiedDiff(lastRows, 3);
    if (!text) { flash(copyBtn, "No changes to copy"); return; }
    var done = function () { flash(copyBtn, "Copied ✓"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  });

  var downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) downloadBtn.addEventListener("click", function () {
    if (!lastRows) return;
    var text = toUnifiedDiff(lastRows, 3);
    if (!text) { flash(downloadBtn, "No changes to export"); return; }
    var blob = new Blob([text], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "diffhero.diff";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  });

  // ── Restore from a shared link on load ────────────────────────────────────
  (function restore() {
    if (location.hash && location.hash.length > 1) {
      var params = new URLSearchParams(location.hash.slice(1));
      try {
        if (params.has("a")) elA.value = b64decode(params.get("a"));
        if (params.has("b")) elB.value = b64decode(params.get("b"));
      } catch (e) {}
    }
    render();
  })();
})();
