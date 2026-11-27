/* ═══ THE FLORIDA FILES · Exhibit Studio (G4 SS 4.13.01, Nov 2026) ═══════════════════════════════════════════════
   The course's final presentation tool, ported from G3 science 32.02's Park Slide Studio (optima-3rd-science,
   assets/sparkle/wf-studio.js). Bethany (22 Nov 2026): every G3–G5 course ends with a presentation like 32.02.
   4.13.01 BUILDS the exhibit: six slides (map, source, timeline, person or event, civic or economic connection,
   final claim), each a real public-domain picture from the year + the student's own words, Download .pptx.
   4.13.02 can PRESENT the same slides (cfg.present: present mode with a timer, a voice per slide kept in memory
   only, "Make my video"). Slides are kept in this browser under ONE key, oao.ff.studio, so 4.13.02 opens them.
   4.13.02 (cfg.mode 'show'): the show view — the six slides, a voice per slide, Present to your teacher (the layer's
   hooks add the teacher's one-line reaction per slide from the doorway), Make my video (ported from G3 science 32.02's
   movie(): the slides play on a canvas with the student's own voice and the browser records an .mp4 or .webm), and
   Edit my slides when a slide needs work or this computer has none saved (then the student builds them right here).
   No lesson content lives here: everything comes from the lesson's DATA.planner (type "studio").
   Mounted by the sparkle layer: FFStudio.mount(root, cfg, hooks) → {done, lines, summary}. Loaded only by lessons
   that use it. PptxGenJS (MIT) is loaded only when the student presses Download.
   ════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.FFStudio) return;
  var KEY = 'oao.ff.studio';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function words(t) { return ((t || '').trim().match(/[A-Za-z0-9'’$,.]+/g) || []).filter(function (w) { return /[A-Za-z0-9]/.test(w); }).length; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }

  function mount(root, ST, H) {
    H = H || {};
    var IMG = H.img || '', CR = ST.criteria || [], MAXW = ST.words || 35, MINW = ST.minWords || 8;
    var BANK = ST.bank || [], BYID = {}; BANK.forEach(function (b) { BYID[b.id] = b; });
    var S = load(); if (!S.slides || S.slides.length !== CR.length) S.slides = CR.map(function (c, i) { return (S.slides && S.slides[i]) || { text: '', img: null, up: null }; });
    var warned = false, cur = Math.min(S.cur || 0, CR.length - 1), editing = false;
    function hasAny() { return S.slides.some(function (s) { return (s.text || '').trim() || s.img || s.up; }); }
    function save() { S.v = 1; S.lesson = ST.lesson || ''; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { if (!warned) { warned = true; toast(ST.fullT || 'Your slides are too big to save in this browser. Download them before you close the page.'); } } if (H.change) H.change(); }
    function toast(m) { var t = document.createElement('div'); t.className = 'ffst-toast'; t.setAttribute('role', 'status'); t.innerHTML = esc(m) + '<button type="button" aria-label="Close">✕</button>'; document.body.appendChild(t); t.querySelector('button').onclick = function () { t.remove(); }; setTimeout(function () { t.remove(); }, 6000); }
    function name() { return (H.name && H.name()) || ''; }
    function src(b) { return b ? (b.src || IMG + b.file) : ''; }
    function picSrc(s) { return s.up || src(BYID[s.img]); }
    function capOf(s) { var b = BYID[s.img]; return s.up ? (ST.ownCap || 'My own picture') : (b ? b.cap : ''); }
    /* the checks (Bethany's mix-up: "an exhibit is a list of facts"), each a regex from DATA so they are lesson-owned */
    var RX = {}; Object.keys(ST.rx || {}).forEach(function (k) { RX[k] = new RegExp(ST.rx[k], 'i'); });
    function has(k, t) { return RX[k] ? RX[k].test(t || '') : true; }
    function checks(i) { var c = CR[i], s = S.slides[i], w = words(s.text);
      return (c.checks || ['words', 'pic', 'spec', 'why']).map(function (k) {
        var ok = k === 'words' ? (w >= MINW && w <= MAXW) : k === 'pic' ? !!picSrc(s) : has(k, s.text);
        var lab = k === 'words' ? MINW + ' to ' + MAXW + ' words' : ((ST.checkT || {})[k] || k);
        return { k: k, ok: ok, lab: lab }; }); }
    function slideOk(i) { return checks(i).every(function (c) { return c.ok; }); }
    function nDone() { return CR.filter(function (c, i) { return slideOk(i); }).length; }
    function lines() { return CR.map(function (c, i) { var t = S.slides[i].text.trim(); return t ? [c.name, t] : null; }).filter(Boolean); }

    /* ---------- one slide (editor preview, present mode and print all use this) ---------- */
    function slideHTML(i) {
      var c = CR[i], s = S.slides[i], pic = picSrc(s), cap = capOf(s), t = esc(s.text.trim()), nm = esc(name());
      if (c.title) return '<div class="ffst-sl ffst-title">' + (pic ? '<img class="bg" src="' + esc(pic) + '" alt="' + esc(cap) + '">' : '') +
        '<div class="tt"><small>' + esc(ST.deckKicker || '') + '</small><h4>' + esc(c.name) + '</h4><p>' + (t || '<i>' + esc(c.hint) + '</i>') + '</p>' + (nm ? '<em>' + esc(ST.byT || 'by') + ' ' + nm + '</em>' : '') + '</div>' + (cap ? '<span class="cap">📷 ' + esc(cap) + '</span>' : '') + '</div>';
      return '<div class="ffst-sl ffst-std" style="--pc:' + esc(c.color || '#1E8C8C') + '"><div class="pic">' + (pic ? '<img src="' + esc(pic) + '" alt="' + esc(cap) + '">' + (cap ? '<span class="cap">📷 ' + esc(cap) + '</span>' : '') : '<span class="nopic">📷 ' + esc(ST.pickPicT || 'Pick a picture') + '</span>') + '</div>' +
        '<div class="side"><div class="k">' + esc(c.icon || '') + ' ' + esc(c.name) + '</div><p class="tx">' + (t || '<i>' + esc(c.hint) + '</i>') + '</p></div></div>';
    }
    function path(at) { var st = ST.steps || []; if (!st.length) return '';
      return '<ol class="ffst-path" aria-label="Your steps">' + st.map(function (t, i) { return '<li class="' + (i < at ? 'done' : i === at ? 'now' : '') + '"><b>' + (i < at ? '✓' : i + 1) + '</b>' + esc(t) + '</li>'; }).join('') + '</ol>'; }

    /* ---------- first visit: what an exhibit slide is, one strong and one weak example ---------- */
    function intro() { var I = ST.intro, ex = function (o, strong) { var b = BYID[I.img];
      return '<figure class="ffst-ex"><div class="ffst-sl ffst-std" style="--pc:' + (strong ? '#1E8C8C' : '#8A7F6A') + '"><div class="pic">' + (strong && b ? '<img src="' + esc(src(b)) + '" alt="' + esc(b.cap) + '"><span class="cap">📷 ' + esc(b.cap) + '</span>' : '<span class="nopic">' + esc(I.noPicT || 'no picture') + '</span>') + '</div>' +
        '<div class="side"><div class="k">' + esc(o.kicker) + '</div><p class="tx' + (strong ? '' : ' tiny') + '">' + esc(o.text) + '</p></div></div><figcaption class="' + (strong ? 'good' : 'weak') + '">' + esc(o.why) + '</figcaption></figure>'; };
      root.innerHTML = path(0) + '<div class="ffst-intro"><h4>' + esc(I.title) + '</h4><ul>' + I.points.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><div class="ffst-exs">' + ex(I.good, true) + ex(I.bad, false) + '</div><div class="ffst-c"><button type="button" class="ffst-btn gold" id="ffst-go">' + esc(I.go) + '</button></div></div>';
      root.querySelector('#ffst-go').onclick = function () { S.intro = 1; save(); draw(); }; }

    /* ---------- the studio ---------- */
    function draw() {
      if (ST.mode === 'show' && !editing) { drawShow(); return; }
      if (ST.intro && !S.intro) { intro(); return; }
      var s = S.slides[cur], c = CR[cur], w = words(s.text), n = nDone(), ck = checks(cur);
      var meter = '<div class="ffst-meter" role="img" aria-label="' + n + ' of ' + CR.length + ' slides ready">' + CR.map(function (x, i) { return '<i class="' + (slideOk(i) ? 'on' : '') + '" title="' + esc(x.name) + '">' + esc(x.icon || '') + '</i>'; }).join('') + '<span>' + n + ' of ' + CR.length + ' ' + esc(ST.readyT || 'slides ready') + '</span></div>';
      var rail = '<div class="ffst-rail" role="tablist" aria-label="My slides">' + CR.map(function (x, i) { return '<button type="button" role="tab" class="ffst-th' + (i === cur ? ' cur' : '') + (slideOk(i) ? ' ok' : '') + '" data-i="' + i + '" aria-selected="' + (i === cur) + '"><span>' + (i + 1) + '</span>' + esc(x.icon || '') + '<small>' + esc(x.short || x.name) + '</small></button>'; }).join('') + '</div>';
      var count = '<div class="ffst-count' + (w > MAXW ? ' over' : w >= MINW ? ' good' : '') + '">📝 ' + w + ' of ' + MAXW + ' words' + (w > MAXW ? ' · ' + esc((ST.overT || 'Too many! Cut {n}.').replace('{n}', w - MAXW)) : w < MINW ? ' · ' + esc((ST.underT || 'Write at least {n}.').replace('{n}', MINW)) : ' ✓') + '</div>';
      var chk = '<ul class="ffst-checks" aria-label="Strong slide checklist">' + ck.map(function (x) { return '<li class="' + (x.ok ? 'ok' : '') + '">' + esc(x.lab) + '</li>'; }).join('') + '</ul>';
      var nudge = ''; if (s.text.trim()) { var miss = ck.filter(function (x) { return !x.ok && x.k !== 'words' && x.k !== 'pic'; })[0]; if (miss) nudge = '<p class="ffst-ev">🔍 ' + esc((ST.nudgeT || {})[miss.k] || '') + '</p>'; }
      var FN = c.notes || [], fn = FN.length ? '<details class="ffst-notes"' + (s.text.trim() ? '' : ' open') + '><summary>' + esc(ST.notesLead || '📒 Ideas from the year') + '</summary><ul>' + FN.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><p>' + esc(ST.notesTip || '') + '</p></details>' : '';
      var starter = !s.text.trim() && c.starter ? '<button type="button" class="ffst-mini" id="ffst-start">✏️ ' + esc(ST.starterT || 'Use a sentence starter') + '</button>' : '';
      var mine = BANK.filter(function (b) { return (b.tags || []).indexOf(c.k) >= 0; }), rest = BANK.filter(function (b) { return (b.tags || []).indexOf(c.k) < 0; });
      var bank = '<p class="ffst-lab">📷 ' + esc(ST.bankT || 'Pick a real picture from the year (all public domain), or upload your own.') + '</p><div class="ffst-bank" role="listbox" aria-label="Picture bank">' +
        mine.concat(rest).map(function (b, j) { var on = s.img === b.id && !s.up; return (j === mine.length && mine.length ? '<span class="more">' + esc(ST.moreT || 'More from the year') + '</span>' : '') + '<button type="button" role="option" class="ffst-ph' + (on ? ' on' : '') + '" data-k="' + esc(b.id) + '" aria-selected="' + on + '" title="' + esc(b.cap) + '"><img loading="lazy" src="' + esc(b.thumbFile ? IMG + b.thumbFile : (b.thumb || src(b))) + '" alt="' + esc(b.cap) + '"><span>' + esc(b.short || '') + '</span></button>'; }).join('') + '</div>' +
        '<div class="ffst-uprow"><label class="ffst-mini">⬆️ ' + esc(ST.upT || 'Upload my own picture') + '<input type="file" accept="image/*" id="ffst-file" hidden></label>' + (s.up ? '<button type="button" class="ffst-mini" id="ffst-unup">✕ ' + esc(ST.unupT || 'Remove my picture') + '</button>' : '') + '</div>' +
        (s.up ? '<p class="ffst-ev">' + esc(ST.upWarnT || '') + '</p>' : '');
      var tools = fn + '<label class="ffst-lab" for="ffst-text">' + esc(c.icon || '') + ' ' + esc((ST.slideT || 'Slide') + ' ' + (cur + 1) + ': ' + c.ask) + '</label><textarea id="ffst-text" rows="3" placeholder="' + esc(c.hint) + '">' + esc(s.text) + '</textarea>' + starter + count + chk + nudge + bank + rec();
      var at = S.dl ? 3 : n === CR.length ? 2 : 1;
      root.innerHTML = path(at) + '<div class="ffst-top"><b>' + esc(ST.deckT || 'My exhibit') + '</b>' + meter + '</div>' + rail +
        '<div class="ffst-main"><div class="ffst-view" aria-live="polite">' + slideHTML(cur) + '</div><div class="ffst-tools">' + tools + '</div></div>' +
        '<div class="ffst-acts">' + (ST.mode === 'show' ? '<button type="button" class="ffst-btn gold" id="ffst-back">✅ ' + esc(ST.backT || 'Done: back to my show') + '</button>' : '') + (cur ? '<button type="button" class="ffst-btn ghost" id="ffst-prev">◂ ' + esc(ST.slideT || 'Slide') + ' ' + cur + '</button>' : '') + (cur < CR.length - 1 ? '<button type="button" class="ffst-btn ghost" id="ffst-next">' + esc(ST.nextT || 'Next: slide') + ' ' + (cur + 2) + ' ▸</button>' : '') +
        (ST.present && ST.mode !== 'show' ? '<button type="button" class="ffst-btn gold" id="ffst-show">▶ ' + esc(ST.presentT || 'Present') + '</button><button type="button" class="ffst-btn" id="ffst-vid">🎬 ' + esc(ST.videoT || 'Make my video') + '</button>' : '') +
        '<button type="button" class="ffst-btn' + (n === CR.length && !S.dl ? ' gold' : '') + '" id="ffst-dl">⬇️ ' + esc(ST.dlT || 'Download my slides') + '</button><button type="button" class="ffst-btn ghost" id="ffst-print">🖨️ ' + esc(ST.printT || 'Print or save as PDF') + '</button></div>' +
        '<p class="ffst-foot">' + (S.dl ? '✅ ' + esc(ST.dlDoneT || 'Downloaded.') + ' ' : (n === CR.length ? '⭐ ' + esc(ST.allT || '') + ' ' : '')) + esc(ST.keepT || 'Your words and pictures save in this browser.') + ' <button type="button" class="ffst-link" id="ffst-clear">🧹 ' + esc(ST.clearT || 'Clear my slides') + '</button></p>';
      wire();
    }


    /* ---------- the show view (4.13.02, cfg.mode 'show'): the deck, a voice per slide, Present, Make my video ---------- */
    function drawShow() {
      var n = nDone(), all = n === CR.length, any = hasAny(), recN = Object.keys(REC).length;
      if (!any) { root.innerHTML = '<div class="ffst-none"><span class="ic" aria-hidden="true">🗂️</span><h4>' + esc(ST.noneH || 'Your slides aren’t on this computer.') + '</h4><p>' + esc(ST.noneT || '') + '</p><div class="ffst-acts"><button type="button" class="ffst-btn gold" id="ffst-build">✏️ ' + esc(ST.buildT || 'Build my six slides here') + '</button></div>' + (ST.backLink ? '<p class="ffst-foot">' + esc(ST.backLinkT || '') + ' <a class="ffst-link" href="' + esc(ST.backLink) + '" target="_blank" rel="noopener">' + esc(ST.backLinkA || 'Open the last lesson') + '</a></p>' : '') + '</div>';
        root.querySelector('#ffst-build').onclick = function () { editing = true; draw(); if (H.change) H.change(); }; return; }
      var meter = '<div class="ffst-meter" role="img" aria-label="' + n + ' of ' + CR.length + ' slides ready">' + CR.map(function (x, i) { return '<i class="' + (slideOk(i) ? 'on' : '') + '" title="' + esc(x.name) + '">' + esc(x.icon || '') + '</i>'; }).join('') + '<span>' + n + ' of ' + CR.length + ' ' + esc(ST.readyT || 'slides ready') + '</span></div>';
      var rail = '<div class="ffst-rail" role="tablist" aria-label="My slides">' + CR.map(function (x, i) { return '<button type="button" role="tab" class="ffst-th' + (i === cur ? ' cur' : '') + (slideOk(i) ? ' ok' : '') + (REC[i] ? ' rec' : '') + '" data-i="' + i + '" aria-selected="' + (i === cur) + '"><span>' + (i + 1) + '</span>' + esc(x.icon || '') + '<small>' + esc(x.short || x.name) + '</small>' + (REC[i] ? '<em aria-label="voice recorded">🎙️</em>' : '') + '</button>'; }).join('') + '</div>';
      var warn = all ? '' : '<p class="ffst-ev">🔧 ' + esc((ST.fixT || '{n} of 6 slides are ready. Fix the others before you present: tap Edit my slides.').replace('{n}', n)) + '</p>';
      root.innerHTML = '<div class="ffst-top"><b>' + esc(ST.deckT || 'My exhibit') + (name() ? ' <small>' + esc(ST.byT || 'by') + ' ' + esc(name()) + '</small>' : '') + '</b>' + meter + '</div>' + rail +
        '<div class="ffst-main"><div class="ffst-view" aria-live="polite">' + slideHTML(cur) + '</div><div class="ffst-tools"><p class="ffst-lab">' + esc((ST.slideT || 'Slide') + ' ' + (cur + 1) + ' of ' + CR.length + ': ' + CR[cur].name) + '</p>' + warn + rec() +
        '<div class="ffst-navrow">' + (cur ? '<button type="button" class="ffst-mini" id="ffst-prev">◂ ' + esc(ST.slideT || 'Slide') + ' ' + cur + '</button>' : '') + (cur < CR.length - 1 ? '<button type="button" class="ffst-mini" id="ffst-next">' + esc(ST.nextT || 'Next: slide') + ' ' + (cur + 2) + ' ▸</button>' : '') + '</div></div></div>' +
        '<div class="ffst-acts"><button type="button" class="ffst-btn gold" id="ffst-show"' + (all ? '' : ' aria-disabled="true"') + '>▶ ' + esc(ST.presentT || 'Present') + '</button><button type="button" class="ffst-btn" id="ffst-vid"' + (all ? '' : ' aria-disabled="true"') + '>🎬 ' + esc(ST.videoT || 'Make my video') + '</button><button type="button" class="ffst-btn ghost" id="ffst-edit">✏️ ' + esc(ST.editT || 'Edit my slides') + '</button><button type="button" class="ffst-btn ghost" id="ffst-dl">⬇️ ' + esc(ST.dlT || 'Download my slides') + '</button></div>' +
        '<p class="ffst-foot">' + (S.shown ? '✅ ' + esc(ST.shownT || 'You presented your exhibit.') + ' ' : '') + (recN ? '🎙️ ' + esc((ST.recCountT || '{n} of 6 slides have your voice.').replace('{n}', recN)) + ' ' : '') + esc(ST.showFootT || '') + '</p>';
      var q = function (sel) { return root.querySelector(sel); };
      [].forEach.call(root.querySelectorAll('.ffst-th'), function (b) { b.onclick = function () { cur = S.cur = +b.dataset.i; save(); draw(); }; });
      var pv = q('#ffst-prev'), nx = q('#ffst-next'); if (pv) pv.onclick = function () { cur = S.cur = cur - 1; save(); draw(); }; if (nx) nx.onclick = function () { cur = S.cur = cur + 1; save(); draw(); };
      q('#ffst-show').onclick = function () { if (!all) { toast((ST.fixT || '').replace('{n}', n)); return; } show(); };
      q('#ffst-vid').onclick = function () { if (!all) { toast((ST.fixT || '').replace('{n}', n)); return; } movie(); };
      q('#ffst-edit').onclick = function () { editing = true; draw(); if (H.change) H.change(); };
      q('#ffst-dl').onclick = download;
      var rg = q('#ffst-recgo'), rs = q('#ffst-recstop'), rd = q('#ffst-recdel'), ix = cur;
      if (rg) rg.onclick = function () { record(ix); }; if (rs) rs.onclick = function () { if (recNow) recNow.stop(); }; if (rd) rd.onclick = function () { if (REC[ix]) URL.revokeObjectURL(REC[ix].url); delete REC[ix]; draw(); };
    }

    /* ---------- voice per slide (4.13.02 only: cfg.present). Kept in memory, never saved or sent anywhere. ---------- */
    var REC = {}, recNow = null, MAXREC = ST.maxRecord || 30;
    function rec() { if (!ST.present || ST.record === false) return ''; var r = REC[cur];
      return '<div class="ffst-rec"><p class="ffst-lab">🎙️ ' + esc(ST.recT || 'Your voice (optional)') + '</p>' + (recNow ? '<button type="button" class="ffst-mini on" id="ffst-recstop">⏹ Stop <span id="ffst-rect">0</span>s</button>' :
        r ? '<audio controls src="' + r.url + '"></audio><div><button type="button" class="ffst-mini" id="ffst-recgo">↻ Record again</button><button type="button" class="ffst-mini" id="ffst-recdel">✕ Delete</button></div>' :
        '<button type="button" class="ffst-mini" id="ffst-recgo">🎙️ ' + esc(ST.recGoT || 'Record my voice for this slide') + '</button>') + '<p class="ffst-note">' + esc((ST.recNoteT || 'Talk for up to {n} seconds. Your voice is not saved anywhere else, so download before you close this page.').replace('{n}', MAXREC)) + '</p><p class="ffst-ev" id="ffst-recmsg" hidden></p></div>'; }
    function record(ix) { var blocked = ST.micT || 'The microphone is blocked here. Your slides still work.';
      var m = function (t) { var e = root.querySelector('#ffst-recmsg'); if (e) { e.hidden = false; e.textContent = t; } };
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { m(blocked); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) { var chunks = [], mr; try { mr = new MediaRecorder(stream); } catch (e) { stream.getTracks().forEach(function (t) { t.stop(); }); m(blocked); return; }
        var t0 = Date.now(), tm = setInterval(function () { var s = Math.floor((Date.now() - t0) / 1000), e = root.querySelector('#ffst-rect'); if (e) e.textContent = s; if (s >= MAXREC && mr.state === 'recording') mr.stop(); }, 250);
        mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = function () { clearInterval(tm); stream.getTracks().forEach(function (t) { t.stop(); }); recNow = null; var blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' }); if (REC[ix]) URL.revokeObjectURL(REC[ix].url); if (blob.size) REC[ix] = { blob: blob, url: URL.createObjectURL(blob) }; draw(); };
        recNow = mr; mr.start(); draw(); }, function () { m(blocked); }); }

    function preview() { var v = root.querySelector('.ffst-view'); if (v) v.innerHTML = slideHTML(cur); }
    function wire() {
      var s = S.slides[cur], q = function (sel) { return root.querySelector(sel); };
      [].forEach.call(root.querySelectorAll('.ffst-th'), function (b) { b.onclick = function () { go(+b.dataset.i); }; });
      var ta = q('#ffst-text'); if (ta) ta.addEventListener('input', function () { s.text = ta.value; preview(); clearTimeout(ta._t); ta._t = setTimeout(function () { save(); var pos = ta.selectionStart; draw(); var t2 = q('#ffst-text'); if (t2) { t2.focus(); t2.setSelectionRange(pos, pos); } }, 700); });
      var sb = q('#ffst-start'); if (sb) sb.onclick = function () { s.text = CR[cur].starter; save(); draw(); var t2 = q('#ffst-text'); if (t2) { t2.focus(); t2.setSelectionRange(t2.value.length, t2.value.length); } };
      [].forEach.call(root.querySelectorAll('.ffst-ph'), function (b) { b.onclick = function () { s.img = b.dataset.k; s.up = null; save(); draw(); if (H.sfx) H.sfx('click'); }; });
      var f = q('#ffst-file'); if (f) f.onchange = function () { var file = f.files && f.files[0]; if (!file) return; shrink(file, function (url) { if (!url) { toast(ST.badPicT || 'That picture could not be opened. Try a JPG or PNG.'); return; } s.up = url; save(); draw(); }); };
      var un = q('#ffst-unup'); if (un) un.onclick = function () { s.up = null; save(); draw(); };
      var pv = q('#ffst-prev'), nx = q('#ffst-next'); if (pv) pv.onclick = function () { go(cur - 1); }; if (nx) nx.onclick = function () { go(cur + 1); };
      q('#ffst-dl').onclick = download; q('#ffst-print').onclick = print;
      var sh = q('#ffst-show'); if (sh) sh.onclick = show; var vd = q('#ffst-vid'); if (vd) vd.onclick = movie; var bk = q('#ffst-back'); if (bk) bk.onclick = function () { editing = false; draw(); if (H.change) H.change(); var t = root.getBoundingClientRect(); if (t.top < 0) root.scrollIntoView({ block: 'start' }); };
      var rg = q('#ffst-recgo'), rs = q('#ffst-recstop'), rd = q('#ffst-recdel'), ix = cur;
      if (rg) rg.onclick = function () { record(ix); }; if (rs) rs.onclick = function () { if (recNow) recNow.stop(); }; if (rd) rd.onclick = function () { if (REC[ix]) URL.revokeObjectURL(REC[ix].url); delete REC[ix]; draw(); };
      var cl = q('#ffst-clear'); cl.onclick = function () { if (!cl.dataset.sure) { cl.dataset.sure = 1; cl.textContent = ST.clearSureT || 'Tap again to erase all your slides on this computer'; setTimeout(function () { if (cl.isConnected) { delete cl.dataset.sure; cl.textContent = '🧹 ' + (ST.clearT || 'Clear my slides'); } }, 5000); return; }
        S = { slides: CR.map(function () { return { text: '', img: null, up: null }; }), intro: 1 }; cur = 0; save(); draw(); toast(ST.clearedT || 'Cleared. Your slides are erased from this computer.'); };
    }
    function go(i) { if (i < 0 || i >= CR.length) return; cur = S.cur = i; save(); draw(); var t = root.querySelector('.ffst-view'); if (t && t.getBoundingClientRect().top < 60) t.scrollIntoView({ block: 'start' }); }
    function shrink(file, cb) { var r = new FileReader(); r.onload = function () { var im = new Image(); im.onload = function () { var k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); try { cb(c.toDataURL('image/jpeg', .72)); } catch (e) { cb(null); } }; im.onerror = function () { cb(null); }; im.src = r.result; }; r.onerror = function () { cb(null); }; r.readAsDataURL(file); }

    /* ---------- present mode (4.13.02) ---------- */
    function show() { var i = 0, left = (ST.minutes || 3) * 60, o = document.createElement('div'); o.className = 'ffst-show'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', ST.presentT || 'Present');
      o.innerHTML = '<div class="stage"></div>' + (H.react ? '<div class="door" aria-live="polite"><span class="av" aria-hidden="true">👩‍🏫</span><span class="tx"></span></div>' : '') + '<div class="bar"><button type="button" data-a="prev" aria-label="Previous slide">◂</button><span class="n"></span><button type="button" data-a="next" aria-label="Next slide">▸</button><button type="button" data-a="say" class="say" hidden>🔊 ' + esc(ST.myVoiceT || 'My voice') + '</button><span class="clock"></span><button type="button" data-a="x">✕ Done</button></div>';
      document.body.appendChild(o); var stage = o.querySelector('.stage'), clock = o.querySelector('.clock');
      var door = o.querySelector('.door'), dt = 0, au = null, seen = {};
      function paint() { stage.innerHTML = slideHTML(i); o.querySelector('.n').textContent = (ST.slideT || 'Slide') + ' ' + (i + 1) + ' of ' + CR.length;
        if (au) { au.pause(); au = null; } var sb = o.querySelector('.say'); sb.hidden = !REC[i]; sb.textContent = '🔊 ' + (ST.myVoiceT || 'My voice');
        seen[i] = 1; if (door) { door.classList.remove('on'); clearTimeout(dt); var t = H.react(i, S.slides[i], CR[i]); if (t) dt = setTimeout(function () { door.querySelector('.tx').textContent = t; door.classList.add('on'); }, 1100); }
        if (i === CR.length - 1 && Object.keys(seen).length === CR.length && !S.shown) { S.shown = true; save(); if (H.shown) H.shown(); } }
      function tick() { left--; var m = Math.max(0, left); clock.textContent = '⏱ ' + Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); clock.classList.toggle('low', m <= 20); if (left === 0) clock.textContent = '⏰ ' + (ST.timeT || 'Time!'); }
      function close() { clearInterval(tm); clearTimeout(dt); if (au) au.pause(); if (ST.mode === 'show') draw(); document.removeEventListener('keydown', key); if (document.fullscreenElement) document.exitFullscreen().catch(function () {}); o.remove(); }
      function key(e) { if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); i = Math.min(CR.length - 1, i + 1); paint(); } else if (e.key === 'ArrowLeft') { i = Math.max(0, i - 1); paint(); } else if (e.key === 'Escape') close(); }
      o.addEventListener('click', function (e) { var a = e.target.closest('[data-a]'); if (!a) return; if (a.dataset.a === 'say') { if (!REC[i]) return; if (au) { au.pause(); au = null; a.textContent = '🔊 ' + (ST.myVoiceT || 'My voice'); return; } au = new Audio(REC[i].url); au.onended = function () { au = null; a.textContent = '🔊 ' + (ST.myVoiceT || 'My voice'); }; var pr = au.play(); if (pr && pr.catch) pr.catch(function () {}); a.textContent = '⏸ ' + (ST.myVoiceT || 'My voice'); return; } if (a.dataset.a === 'x') close(); else { i = Math.max(0, Math.min(CR.length - 1, i + (a.dataset.a === 'next' ? 1 : -1))); paint(); } });
      document.addEventListener('keydown', key); paint(); left++; tick(); var tm = setInterval(tick, 1000); try { if (o.requestFullscreen) o.requestFullscreen().catch(function () {}); } catch (e) {} }


    /* ---------- 🎬 Make my video (4.13.02; ported from G3 science 32.02's wf-studio.js movie()): the slides play in order
       on a canvas, each with the student's own recording (or about 6 seconds without one), and the browser records it as
       an .mp4 (Chrome, Edge, Safari) or .webm. It takes as long as the video. Nothing is uploaded. ---------- */
    function loadImg(u) { return new Promise(function (ok) { if (!u) return ok(null); var im = new Image(); im.crossOrigin = 'anonymous'; im.onload = function () { ok(im); }; im.onerror = function () { ok(null); }; im.src = u; }); }
    function cover(x, im, X0, Y0, W, Hh) { var r = W / Hh, iw = im.naturalWidth, ih = im.naturalHeight, sw = iw, sh = ih; if (iw / ih > r) sw = ih * r; else sh = iw / r; x.drawImage(im, (iw - sw) / 2, (ih - sh) / 2, sw, sh, X0, Y0, W, Hh); }
    function wrapT(x, t, X0, Y0, W, maxH, size, font, lh) { var s = size, L;
      for (;;) { x.font = font.replace('{s}', s); L = []; var line = ''; t.split(/\s+/).forEach(function (w) { var tt = line ? line + ' ' + w : w; if (x.measureText(tt).width > W && line) { L.push(line); line = w; } else line = tt; }); if (line) L.push(line);
        if (L.length * s * lh <= maxH || s <= 16) break; s -= 2; }
      L.forEach(function (l, j) { x.fillText(l, X0, Y0 + s + j * s * lh); }); return Y0 + L.length * s * lh; }
    function paintV(x, i, im) { var c = CR[i], s = S.slides[i], t = s.text.trim() || c.hint, G = c.color || '#1E8C8C', cap = capOf(s), nm = name();
      x.fillStyle = '#14213D'; x.fillRect(0, 0, 1280, 720); x.textBaseline = 'alphabetic'; x.textAlign = 'left';
      if (c.title) { if (im) cover(x, im, 0, 0, 1280, 720); var g = x.createLinearGradient(0, 300, 0, 720); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.35, 'rgba(0,0,0,.78)'); g.addColorStop(1, 'rgba(0,0,0,.86)'); x.fillStyle = g; x.fillRect(0, 300, 1280, 420);
        x.fillStyle = '#FFD25E'; x.font = 'bold 24px Arial'; x.fillText((ST.deckKicker || '').toUpperCase(), 60, 470); x.fillStyle = '#fff'; x.font = 'bold 58px Georgia'; x.fillText(c.name, 60, 535);
        var y = wrapT(x, t, 60, 552, 1160, 110, 32, '{s}px Arial', 1.3); if (nm) { x.fillStyle = '#FFD25E'; x.font = 'italic 26px Georgia'; x.fillText((ST.byT || 'by') + ' ' + nm, 60, Math.min(700, y + 34)); } }
      else { if (im) cover(x, im, 0, 0, 666, 720); else { x.fillStyle = '#0b1020'; x.fillRect(0, 0, 666, 720); } x.fillStyle = G; x.fillRect(666, 0, 10, 720);
        x.fillStyle = '#FFD25E'; x.font = 'bold 26px Arial'; x.fillText(((c.icon ? c.icon + '  ' : '') + c.name).toUpperCase(), 712, 90); x.fillStyle = '#fff'; wrapT(x, t, 712, 120, 520, 560, 40, '{s}px Arial', 1.32); }
      if (cap) { x.font = '16px Arial'; var w = x.measureText('📷 ' + cap).width + 16, X0 = c.title ? 1264 - w : 12; x.fillStyle = 'rgba(0,0,0,.6)'; x.fillRect(X0, 690, w, 24); x.fillStyle = '#fff'; x.fillText('📷 ' + cap, X0 + 8, 708); } }
    function movie() {
      var cant = ST.noVideoT || 'This browser can’t make videos. Use Download my slides instead.';
      if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) { toast(cant); return; }
      var types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4;codecs=avc1,opus', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'], type = types.filter(function (t) { return MediaRecorder.isTypeSupported(t); })[0];
      if (!type) { toast(cant); return; }
      var o = document.createElement('div'); o.className = 'ffst-show ffst-making'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', ST.makingVidT || 'Making my video');
      o.innerHTML = '<div class="mk"><h4>🎬 ' + esc(ST.makingVidT || 'Making your video…') + '</h4><canvas width="1280" height="720"></canvas><div class="bar2"><i></i></div><p class="mkt">' + esc(ST.readyingT || 'Getting ready…') + '</p><p class="ffst-note">' + esc(ST.keepOpenT || 'Keep this page open. Your video is made on this computer and isn’t uploaded anywhere.') + '</p><button type="button" class="ffst-btn ghost" data-x>' + esc(ST.cancelT || 'Cancel') + '</button></div>';
      document.body.appendChild(o); var cv = o.querySelector('canvas'), x = cv.getContext('2d'), bar = o.querySelector('.bar2 i'), msg = o.querySelector('.mkt'), stop = false, mr = null, AC = null, tk = 0;
      o.querySelector('[data-x]').onclick = function () { stop = true; clearInterval(tk); if (mr && mr.state === 'recording') mr.stop(); o.remove(); try { AC && AC.close(); } catch (e) {} };
      var AudioC = window.AudioContext || window.webkitAudioContext; try { AC = AudioC ? new AudioC() : null; } catch (e) { AC = null; } var dest = AC && AC.createMediaStreamDestination ? AC.createMediaStreamDestination() : null;
      /* a silent tone keeps the audio track running, so a video with no recorded voice keeps its full length (fix from G3 ms-studio k114) */
      if (AC && dest) { try { var hum = AC.createOscillator(), hz = AC.createGain(); hz.gain.value = 0; hum.connect(hz); hz.connect(dest); hum.start(); } catch (e) {} }
      Promise.all(CR.map(function (c, i) { return loadImg(picSrc(S.slides[i])); })).then(function (ims) {
        return Promise.all(CR.map(function (c, i) { var r = REC[i]; return r && AC ? r.blob.arrayBuffer().then(function (b) { return AC.decodeAudioData(b); }).catch(function () { return null; }) : Promise.resolve(null); })).then(function (bufs) { return [ims, bufs]; });
      }).then(function (res) { if (stop) return; var ims = res[0], bufs = res[1];
        var durs = CR.map(function (c, i) { return bufs[i] ? bufs[i].duration + 1.2 : (ST.silentSec || 6); }), total = durs.reduce(function (a, b) { return a + b; }, 0) + 1;
        try { paintV(x, 0, ims[0]); } catch (e) {}
        var stream = cv.captureStream(30); if (dest) dest.stream.getAudioTracks().forEach(function (t) { stream.addTrack(t); });
        var chunks = []; try { mr = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 2500000 }); } catch (e) { o.remove(); toast(cant); return; }
        mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = function () { clearInterval(tk); if (stop) return; try { AC && AC.close(); } catch (e) {} var ext = /mp4/.test(type) ? 'mp4' : 'webm', blob = new Blob(chunks, { type: type.split(';')[0] }), a = document.createElement('a');
          a.href = URL.createObjectURL(blob); a.download = (ST.fileName || 'my-florida-exhibit') + '-video.' + ext; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
          o.remove(); S.video = true; save(); draw(); toast(ST.videoDoneT || '🎬 Your video is in your Downloads. You can upload it to Canvas too.'); if (H.video) H.video(); if (H.sfx) H.sfx('win'); };
        if (AC && AC.state === 'suspended') AC.resume();
        mr.start(1000); var t0 = performance.now(), cu = -1, starts = [], acc = 0; durs.forEach(function (v) { starts.push(acc); acc += v; });
        tk = setInterval(function () { var t = (performance.now() - t0) / 1000, i = 0; while (i < CR.length - 1 && t >= starts[i + 1]) i++;
          if (i !== cu) { cu = i; if (bufs[i] && AC && dest) { var src = AC.createBufferSource(); src.buffer = bufs[i]; src.connect(dest); src.start(AC.currentTime + .4); } msg.textContent = (ST.slideT || 'Slide') + ' ' + (i + 1) + ' of ' + CR.length + (bufs[i] ? ' · ' + (ST.withVoiceT || 'with your voice') : ''); }
          try { paintV(x, i, ims[i]); } catch (e) {} bar.style.width = Math.min(100, t / total * 100) + '%'; if (t >= total && mr.state === 'recording') mr.stop(); }, 100);
      });
    }

    /* ---------- print / save as PDF ---------- */
    function print() { var w = window.open(''); if (!w) { toast(ST.popupT || 'Your browser blocked the print window. Allow pop-ups, then try again.'); return; }
      var css = [].slice.call(document.styleSheets).map(function (sh) { try { return [].slice.call(sh.cssRules).map(function (r) { return r.cssText; }).join('\n'); } catch (e) { return ''; } }).join('\n');
      w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>' + esc(ST.deckT || 'My exhibit') + '</title><style>' + css + '\nbody{margin:0;background:#fff}.ffst-print{width:960px;margin:0 auto}.ffst-print .ffst-sl{margin:0 0 18px;page-break-inside:avoid;break-inside:avoid}@page{size:landscape;margin:10mm}</style></head><body><div class="ffst-print">' +
        CR.map(function (c, i) { return slideHTML(i); }).join('') + '</div></body></html>');
      w.document.close(); setTimeout(function () { w.focus(); w.print(); }, 900); }

    /* ---------- a real PowerPoint file (PptxGenJS, loaded only now) ---------- */
    function lib(cb) { if (window.PptxGenJS) return cb(); var sc = document.createElement('script'); sc.src = new URL(ST.lib, document.baseURI).href; sc.onload = cb; sc.onerror = function () { toast(ST.libT || 'The slide maker could not load. Use Print or save as PDF instead.'); done(false); }; document.head.appendChild(sc); }
    function boxed(u, bw, bh, cb) { if (!u) return cb(null); var im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = function () { var r = bw / bh, W = im.naturalWidth, Hh = im.naturalHeight, sw = W, sh = Hh; if (W / Hh > r) sw = Hh * r; else sh = W / r; var c = document.createElement('canvas'), px = Math.min(1400, Math.round(sw)); c.width = px; c.height = Math.round(px / r);
        c.getContext('2d').drawImage(im, (W - sw) / 2, (Hh - sh) / 2, sw, sh, 0, 0, c.width, c.height); try { cb(c.toDataURL('image/jpeg', .85)); } catch (e) { cb(null); } }; im.onerror = function () { cb(null); }; im.src = u; }
    function done(ok) { var b = root.querySelector('#ffst-dl'); if (b) { b.disabled = false; b.textContent = '⬇️ ' + (ST.dlT || 'Download my slides'); } if (ok) { S.dl = true; save(); draw(); toast(ST.dlToastT || 'Downloaded! Find the file in your Downloads.'); if (H.sfx) H.sfx('win'); } }
    function download() { var b = root.querySelector('#ffst-dl'); if (b) { b.disabled = true; b.textContent = '⏳ ' + (ST.makingT || 'Making your file…'); }
      var pics = [], left = CR.length; CR.forEach(function (c, i) { boxed(picSrc(S.slides[i]), c.title ? 10 : 5.2, 5.625, function (u) { pics[i] = u; if (!--left) lib(function () { try { make(pics).then(function () { done(true); }, function () { toast(ST.failT || 'The file did not save. Try again, or use Print or save as PDF.'); done(false); }); } catch (e) { toast(ST.failT || 'The file did not save.'); done(false); } }); }); }); }
    function make(pics) { var X = new window.PptxGenJS(); X.layout = 'LAYOUT_16x9'; X.title = ST.deckT || 'My exhibit'; X.author = name() || (ST.authorT || 'Florida historian'); var nm = name();
      CR.forEach(function (c, i) { var s = S.slides[i], sl = X.addSlide(), tx = s.text.trim() || c.hint, b = BYID[s.img], cap = s.up ? 'Picture: ' + (ST.ownCap || 'my own picture') : b ? 'Picture: ' + b.cap + (b.lic ? ' (' + b.lic + ')' : '') : '', G = (c.color || '#1E8C8C').replace('#', '');
        sl.background = { color: '14213D' };
        if (c.title) { if (pics[i]) sl.addImage({ data: pics[i], x: 0, y: 0, w: 10, h: 5.625 });
          sl.addShape('rect', { x: 0, y: 2.7, w: 10, h: 2.925, fill: { color: '000000', transparency: 30 }, line: { color: '000000', transparency: 100 } });
          sl.addText((ST.deckKicker || '').toUpperCase(), { x: .5, y: 2.8, w: 9, h: .35, fontFace: 'Arial', fontSize: 12, bold: true, color: 'FFD25E', charSpacing: 2 });
          sl.addText(c.name, { x: .5, y: 3.1, w: 9, h: .7, fontFace: 'Georgia', fontSize: 32, bold: true, color: 'FFFFFF', fit: 'shrink' });
          sl.addText(tx, { x: .5, y: 3.8, w: 9, h: 1.2, fontFace: 'Arial', fontSize: 18, color: 'FFFFFF', fit: 'shrink', valign: 'top' });
          if (nm) sl.addText((ST.byT || 'by') + ' ' + nm, { x: .5, y: 5.0, w: 5, h: .35, fontFace: 'Georgia', fontSize: 14, italic: true, color: 'FFD25E' }); }
        else { if (pics[i]) sl.addImage({ data: pics[i], x: 0, y: 0, w: 5.2, h: 5.625 });
          sl.addShape('rect', { x: 5.2, y: 0, w: .08, h: 5.625, fill: { color: G }, line: { color: G } });
          sl.addText((c.icon ? c.icon + '  ' : '') + c.name.toUpperCase(), { x: 5.55, y: .35, w: 4.2, h: .7, fontFace: 'Arial', fontSize: 14, bold: true, color: 'FFD25E', fit: 'shrink' });
          sl.addText(tx, { x: 5.55, y: 1.1, w: 4.15, h: 4.1, fontFace: 'Arial', fontSize: 22, color: 'FFFFFF', valign: 'top', fit: 'shrink' }); }
        if (cap) sl.addText(cap, { x: .15, y: 5.3, w: c.title ? 9.7 : 5.0, h: .28, fontFace: 'Arial', fontSize: 8, color: 'FFFFFF', align: c.title ? 'right' : 'left', fit: 'shrink' });
        sl.addNotes(c.name + ': ' + c.ask); });
      var T = (ST.teacher || []).map(function (q) { var e = document.getElementById(q.id); return { q: q.label, v: (e && e.value || '').trim() || '(not answered yet)' }; });
      if (T.length) { var t = X.addSlide(); t.background = { color: 'FBF5E6' }; t.addText(ST.teacherT || 'For my teacher', { x: .5, y: .25, w: 9, h: .5, fontFace: 'Georgia', fontSize: 22, bold: true, color: '14213D' });
        t.addText(T.map(function (n) { return [{ text: n.q + '\n', options: { bold: true, fontSize: 12, color: '7A5520' } }, { text: n.v + '\n\n', options: { fontSize: 12, color: '14213D' } }]; }).reduce(function (a, b) { return a.concat(b); }, []), { x: .5, y: .85, w: 9, h: 4.55, fontFace: 'Arial', valign: 'top', fit: 'shrink' }); }
      return X.writeFile({ fileName: (ST.fileName || 'my-florida-exhibit') + '.pptx' }); }

    draw(); if (H.change) setTimeout(H.change, 0);
    return { done: function () { return nDone() === CR.length; }, n: nDone, shown: function () { return !!S.shown; }, video: function () { return !!S.video; }, hasAny: hasAny, editing: function () { return editing; }, present: show, movie: movie, lines: lines, slides: function () { return S.slides; }, downloaded: function () { return !!S.dl; },
      text: function () { return lines().map(function (l) { return l[0] + ': ' + l[1]; }).join('\n'); }, root: root };
  }
  window.FFStudio = { mount: mount, key: KEY };
})();
