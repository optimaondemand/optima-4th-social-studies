/* G4 Social Studies VR · Field Files / Desk Day engine (ported from the G3 Build the Diorama kit, Nov 2026). No week words: everything comes from window.VR (built from week.json). */
(function () {
  var V = window.VR || {}, G = V.game || {}, PRE = V.pre || 'g4ss-vr', DONEKEY = V.doneKey || 'oao.g4ss.vr.', ALT = V.alt || 'Desk Day', GRADE = V.gradeLine || 'Optima Academy Online · 4th Grade Social Studies';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function load() { try { return JSON.parse(localStorage.getItem(PRE) || '{}'); } catch (e) { return {}; } }
  var st = load();
  st.steps = st.steps || []; st.m = st.m || []; st.p = st.p || []; st.w = st.w || ['', ''];
  function save() { try { localStorage.setItem(PRE, JSON.stringify(st)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function words(s) { return (String(s).replace(/___/g, ' ').match(/[A-Za-z0-9’']+/g) || []).length; }

  /* details pill */
  var db = $('#wl-details-btn'), dd = $('#wl-details');
  if (db && dd) db.addEventListener('click', function () { var o = dd.classList.toggle('open'); db.setAttribute('aria-expanded', o); });

  /* audio */
  var audio = null, playing = null;
  $$('.vr-play').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = b.getAttribute('data-clip');
      if (audio) { audio.pause(); }
      $$('.vr-play').forEach(function (x) { x.classList.remove('on'); });
      if (playing === b) { playing = null; return; }
      audio = new Audio(V.clips[c]); playing = b; b.classList.add('on');
      audio.onended = function () { b.classList.remove('on'); playing = null; };
      audio.play().catch(function () { b.classList.remove('on'); });
    });
  });

  /* teacher video: shown only when the file exists */
  if (V.video && window.fetch) {
    fetch(V.video, { method: 'HEAD' }).then(function (r) {
      if (r.ok) { var w = $('#vr-video'); $('video', w).src = V.video; w.hidden = false; }
    }).catch(function () {});
  }

  /* path toggle */
  function showPath(id) {
    $$('.vr-path').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-path') === id); });
    $$('.vr-pane').forEach(function (p) { p.classList.toggle('on', p.id === id); });
    st.path = id; save();
  }
  $$('.vr-path').forEach(function (b) {
    b.addEventListener('click', function () {
      showPath(b.getAttribute('data-path'));
      var p = $('#' + b.getAttribute('data-path')); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  if (st.path) showPath(st.path);

  /* checklist */
  var steps = $$('.vr-step');
  function paintSteps() {
    var n = 0;
    steps.forEach(function (s, i) {
      var d = !!st.steps[i]; if (d) n++;
      s.classList.toggle('done', d);
      var b = $('.vr-chk', s); b.textContent = d ? '✓' : ''; b.setAttribute('aria-pressed', d);
    });
    var t = $('#vr-prog-t'), bar = $('#vr-prog-b');
    if (t) t.textContent = n + ' of ' + steps.length + ' steps done';
    if (bar) bar.style.width = (100 * n / steps.length) + '%';
    var sent = $('#vr-sent'); if (sent) sent.checked = !!st.sent;
    var bd = $('#vr-badge'); if (bd) bd.classList.toggle('on', n === steps.length && !!st.sent);
  }
  steps.forEach(function (s, i) {
    $('.vr-chk', s).addEventListener('click', function () { st.steps[i] = !st.steps[i]; save(); paintSteps(); });
  });
  var sent = $('#vr-sent');
  if (sent) sent.addEventListener('change', function () {
    st.sent = sent.checked;
    try { if (sent.checked) localStorage.setItem(DONEKEY + V.week, 'vr'); } catch (e) {}
    if (sent.checked) steps.forEach(function (s, i) { st.steps[i] = true; });
    save(); paintSteps();
  });
  paintSteps();

  /* help drawer: load the video and images only when opened */
  var help = $('#vr-help');
  if (help) help.addEventListener('toggle', function () {
    if (!help.open) return;
    var f = $('iframe[data-src]', help); if (f && !f.src) f.src = f.getAttribute('data-src');
  });

  /* ---------- 30-second practice timer (data-secs on .vr-timer) ---------- */
  $$('.vr-timer').forEach(function (t) {
    var secs = +t.getAttribute('data-secs') || 30, btn = $('button', t), clk = $('.clock', t), bar = $('.bar i', t), id = null, left = secs;
    function paint() { clk.textContent = '0:' + (left < 10 ? '0' : '') + left; clk.classList.toggle('low', left <= 5); bar.style.width = (100 * left / secs) + '%'; }
    btn.addEventListener('click', function () {
      if (id) { clearInterval(id); id = null; left = secs; paint(); btn.textContent = btn.getAttribute('data-start'); return; }
      left = secs; paint(); btn.textContent = '■ Stop';
      id = setInterval(function () { left--; paint(); if (left <= 0) { clearInterval(id); id = null; btn.textContent = btn.getAttribute('data-start'); clk.textContent = 'Time!'; } }, 1000);
    });
    btn.setAttribute('data-start', btn.textContent); paint();
  });

  /* ---------- Desk Day games (G3 called them Collections Day). G.type picks one; every word comes from DATA (week.json). ----------
     Each game: GAMES[type](host, G, gs, api) -> { done(), rows(), cols, auto() }
     gs = this game's saved state; api = { save, finish, fb, art, shake, wait } */
  var game = $('#vr-game');
  st.t = st.t || []; st.g = st.g || {};
  var gs = st.g;
  function art(o, cls) {
    if (!o) return '';
    if (o.img) return '<img class="' + (cls || '') + '" src="' + o.img + '" alt="' + esc(o.alt || '') + '">';
    if (o.icon) return '<span class="vr-ic ' + (cls || '') + '" role="img" aria-label="' + esc(o.alt || o.name || '') + '">' + o.icon + '</span>';
    return '';
  }
  function shake(el) { if (!el) return; el.classList.remove('no'); void el.offsetWidth; el.classList.add('no'); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function fb(ok, msg) { var f = $('#vr-fb', game); if (f) { f.className = 'vr-fb ' + (ok ? 'ok' : 'no'); f.textContent = msg; } }
  function fbBox() { return '<div class="vr-fb" id="vr-fb" aria-live="polite"></div>'; }
  function lbl(k, d) { return (G.labels && G.labels[k]) || d; }
  function dragify(src, data) { src.setAttribute('draggable', 'true'); src.addEventListener('dragstart', function (e) { try { e.dataTransfer.setData('text/plain', data); } catch (x) {} }); }
  function dropify(el, fn) {
    el.addEventListener('dragover', function (e) { e.preventDefault(); el.classList.add('drop'); });
    el.addEventListener('dragleave', function () { el.classList.remove('drop'); });
    el.addEventListener('drop', function (e) { e.preventDefault(); el.classList.remove('drop'); var d = ''; try { d = e.dataTransfer.getData('text/plain'); } catch (x) {} fn(d); });
  }
  function click(el) { if (el) el.click(); }
  var GAMES = {};

  /* timeline (week 17): one card at a time, tap or drag it to its time slot */
  GAMES.timeline = function (host, G) {
    var K = G.cards || [], SL = G.slots || [];
    function cur() { for (var i = 0; i < K.length; i++) if (!st.t[i]) return i; return -1; }
    function slotsHtml(active) {
      return '<div class="vr-tl" style="--n:' + SL.length + '" aria-label="Timeline">' + SL.map(function (s) {
        var chips = K.map(function (c, i) { return st.t[i] && c.slot === s.key ? '<span class="chip">' + (c.img ? '<img src="' + c.img + '" alt="">' : '<span class="vr-ic" aria-hidden="true">' + (c.icon || '') + '</span>') + esc(c.name) + '</span>' : ''; }).join('');
        return (active ? '<button type="button" class="vr-slot" data-s="' + s.key + '">' : '<div class="vr-slot">') + '<span class="when">' + esc(s.when) + '</span>' + chips + (active ? '</button>' : '</div>');
      }).join('') + '</div>';
    }
    function render() {
      var i = cur();
      if (i < 0) { host.innerHTML = slotsHtml(false) + '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var c = K[i];
      host.innerHTML = '<div class="vr-gstep">Card ' + (i + 1) + ' of ' + K.length + '</div>' +
        '<div class="vr-card" draggable="true" id="vr-cardnow">' + art(c) + '<div><b>' + esc(c.name) + '</b>' + esc(c.what) +
        '<br><span class="clue">🕰️ ' + esc(c.clue) + '</span></div></div>' + slotsHtml(true) + fbBox();
      function pick(k, el) {
        if (k === c.slot) { st.t[i] = true; save(); fb(true, c.ok); $$('.vr-slot', host).forEach(function (b) { b.disabled = true; }); setTimeout(render, 1600); }
        else { fb(false, G.miss); shake(el); }
      }
      $$('.vr-slot[data-s]', host).forEach(function (b) {
        b.addEventListener('click', function () { pick(b.getAttribute('data-s'), b); });
        dropify(b, function () { pick(b.getAttribute('data-s'), b); });
      });
      var cd = $('#vr-cardnow'); if (cd) cd.addEventListener('dragstart', function (e) { try { e.dataTransfer.setData('text/plain', 'c'); } catch (x) {} });
    }
    render();
    return {
      cols: ['When', 'Who'], done: function () { return cur() < 0; },
      rows: function () { return SL.map(function (sl) { return [sl.when, K.filter(function (c, i) { return st.t[i] && c.slot === sl.key; }).map(function (c) { return c.name; }).join(', ')]; }); },
      auto: async function () {
        while (cur() >= 0) { var c = K[cur()]; var w = SL.find(function (s) { return s.key !== c.slot; }); click($('.vr-slot[data-s="' + w.key + '"]', host)); click($('.vr-slot[data-s="' + c.slot + '"]', host)); await wait(1750); }
      }
    };
  };

  /* match: tap a picture on the left, then the line on the right that goes with it */
  GAMES.match = function (host, G) {
    var P = G.pairs, order = G.order || P.map(function (p, i) { return P.length - 1 - i; });
    gs.m = gs.m || []; var sel = -1;
    function render() {
      var n = gs.m.filter(Boolean).length;
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('step', 'Tap a picture, then tap the line that goes with it.')) + ' <span class="vr-cnt">' + n + ' of ' + P.length + '</span></div>' +
        '<div class="vr-match"><div class="col"><div class="hd">' + esc(lbl('left', '')) + '</div>' + P.map(function (p, i) {
          return '<button type="button" class="vr-mL' + (gs.m[i] ? ' set' : '') + (sel === i ? ' sel' : '') + '" data-i="' + i + '"' + (gs.m[i] ? ' disabled' : '') + '>' + art(p.left) + '<b>' + esc(p.left.name) + '</b>' + (gs.m[i] ? '<span class="n">' + gs.m[i] + '</span>' : '') + '</button>';
        }).join('') + '</div><div class="col"><div class="hd">' + esc(lbl('right', '')) + '</div>' + order.map(function (i) {
          return '<button type="button" class="vr-mR' + (gs.m[i] ? ' set' : '') + '" data-i="' + i + '"' + (gs.m[i] ? ' disabled' : '') + '>' + (gs.m[i] ? '<span class="n">' + gs.m[i] + '</span>' : '') + esc(P[i].right) + '</button>';
        }).join('') + '</div></div>' + fbBox();
      $$('.vr-mL', host).forEach(function (b) {
        var i = +b.getAttribute('data-i');
        b.addEventListener('click', function () { sel = i; render(); fb(true, lbl('picked', 'Now tap the line that goes with it.')); });
        dragify(b, String(i));
      });
      $$('.vr-mR', host).forEach(function (b) {
        var j = +b.getAttribute('data-i');
        function go(i) {
          if (i < 0 || isNaN(i)) { fb(false, lbl('first', 'Tap a picture on the left first.')); return; }
          if (i === j) { gs.m[i] = gs.m.filter(Boolean).length + 1; sel = -1; save(); render(); fb(true, P[i].ok); if (gs.m.filter(Boolean).length === P.length) { fb(true, G.done); api.finish(); } }
          else { fb(false, G.miss); shake(b); }
        }
        b.addEventListener('click', function () { go(sel); });
        dropify(b, function (d) { go(+d); });
      });
    }
    render();
    return {
      cols: G.cols || ['Picture', 'Goes with'], done: function () { return gs.m.filter(Boolean).length === P.length; },
      rows: function () { return P.map(function (p, i) { return [p.left.name, gs.m[i] ? p.right : '']; }); },
      auto: async function () {
        for (var i = 0; i < P.length; i++) { if (gs.m[i]) continue; click($('.vr-mL[data-i="' + i + '"]', host)); var w = (i + 1) % P.length; if (!gs.m[w]) click($('.vr-mR[data-i="' + w + '"]', host)); click($('.vr-mL[data-i="' + i + '"]', host)); click($('.vr-mR[data-i="' + i + '"]', host)); await wait(60); }
      }
    };
  };

  /* sort: every card waits in a tray; tap a card, then tap its box (or drag it) */
  GAMES.sort = function (host, G) {
    var K = G.cards, B = G.bins; gs.s = gs.s || []; var sel = -1;
    function render() {
      var left = K.map(function (c, i) { return i; }).filter(function (i) { return !gs.s[i]; });
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('step', 'Tap a card, then tap the box it goes in.')) + ' <span class="vr-cnt">' + (K.length - left.length) + ' of ' + K.length + '</span></div>' +
        '<div class="vr-tray">' + (left.length ? left.map(function (i) { var c = K[i]; return '<button type="button" class="vr-tc' + (sel === i ? ' sel' : '') + '" data-i="' + i + '">' + art(c) + '<b>' + esc(c.name) + '</b>' + (c.what ? '<small>' + esc(c.what) + '</small>' : '') + '</button>'; }).join('') : '<span class="vr-empty">' + esc(lbl('empty', 'The tray is empty.')) + '</span>') + '</div>' +
        '<div class="vr-bins" style="--n:' + B.length + '">' + B.map(function (b) {
          return '<button type="button" class="vr-bin" data-b="' + b.key + '"><span class="bh">' + (b.icon || '') + ' ' + esc(b.name) + '</span>' +
            K.map(function (c, i) { return gs.s[i] && c.bin === b.key ? '<span class="chip">' + (c.icon ? c.icon + ' ' : '') + esc(c.name) + '</span>' : ''; }).join('') + '</button>';
        }).join('') + '</div>' + fbBox();
      $$('.vr-tc', host).forEach(function (b) { var i = +b.getAttribute('data-i'); b.addEventListener('click', function () { sel = i; render(); }); dragify(b, String(i)); });
      $$('.vr-bin', host).forEach(function (el) {
        var k = el.getAttribute('data-b');
        function go(i) {
          if (i < 0 || isNaN(i) || gs.s[i]) { fb(false, lbl('first', 'Tap a card in the tray first.')); return; }
          var c = K[i];
          if (c.bin === k) { gs.s[i] = true; sel = -1; save(); render(); fb(true, c.ok); if (gs.s.filter(Boolean).length === K.length) { fb(true, G.done); api.finish(); } }
          else { fb(false, c.miss || G.miss); shake(el); }
        }
        el.addEventListener('click', function () { go(sel); });
        dropify(el, function (d) { go(+d); });
      });
    }
    render();
    return {
      cols: G.cols || ['Box', 'Cards'], done: function () { return gs.s.filter(Boolean).length === K.length; },
      rows: function () { return B.map(function (b) { return [b.name, K.filter(function (c, i) { return gs.s[i] && c.bin === b.key; }).map(function (c) { return c.name; }).join(', ')]; }); },
      auto: async function () {
        for (var i = 0; i < K.length; i++) { if (gs.s[i]) continue; click($('.vr-tc[data-i="' + i + '"]', host)); var w = B.find(function (b) { return b.key !== K[i].bin; }); click($('.vr-bin[data-b="' + w.key + '"]', host)); click($('.vr-bin[data-b="' + K[i].bin + '"]', host)); await wait(60); }
      }
    };
  };

  /* order: tap the steps in the order they happen; each right tap fills the next numbered spot */
  GAMES.order = function (host, G) {
    var S = G.steps, show = G.show || S.map(function (s, i) { return i; }).reverse(); gs.o = gs.o || 0;
    function render() {
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('step', 'Tap the step that comes next.')) + ' <span class="vr-cnt">' + gs.o + ' of ' + S.length + '</span></div>' +
        '<ol class="vr-line">' + S.map(function (s, i) { return '<li class="' + (i < gs.o ? 'set' : '') + '"><span class="n">' + (i + 1) + '</span>' + (i < gs.o ? art(s) + '<b>' + esc(s.name) + '</b>' : '<i>?</i>') + '</li>'; }).join('') + '</ol>' +
        '<div class="vr-tray">' + show.filter(function (i) { return i >= gs.o; }).map(function (i) { var s = S[i]; return '<button type="button" class="vr-tc" data-i="' + i + '">' + art(s) + '<b>' + esc(s.name) + '</b></button>'; }).join('') + '</div>' + fbBox();
      $$('.vr-tc', host).forEach(function (b) {
        var i = +b.getAttribute('data-i');
        b.addEventListener('click', function () {
          if (i === gs.o) { gs.o++; save(); render(); fb(true, S[i].ok); if (gs.o === S.length) { fb(true, G.done); api.finish(); } }
          else { fb(false, S[gs.o].hint || G.miss); shake(b); }
        });
      });
    }
    render();
    return {
      cols: G.cols || ['Step', 'What happens'], done: function () { return gs.o === S.length; },
      rows: function () { return S.map(function (s, i) { return [String(i + 1), i < gs.o ? s.name : '']; }); },
      auto: async function () { while (gs.o < S.length) { var w = S.length - 1; if (w !== gs.o) click($('.vr-tc[data-i="' + w + '"]', host)); click($('.vr-tc[data-i="' + gs.o + '"]', host)); await wait(40); } }
    };
  };

  /* odd: each round shows a few cards; tap the one that does NOT belong */
  GAMES.odd = function (host, G) {
    var R = G.rounds; gs.r = gs.r || 0;
    function render() {
      if (gs.r >= R.length) { host.innerHTML = '<div class="vr-fb ok">' + esc(G.done) + '</div>' + recap(); api.finish(); return; }
      api.unfinish();
      var r = R[gs.r];
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('round', 'Round')) + ' ' + (gs.r + 1) + ' of ' + R.length + '</div><p class="vr-q">' + esc(r.q) + '</p>' +
        '<div class="vr-odd">' + r.items.map(function (it, i) { return '<button type="button" class="vr-tc" data-i="' + i + '">' + art(it) + '<b>' + esc(it.name) + '</b></button>'; }).join('') + '</div>' + fbBox();
      $$('.vr-tc', host).forEach(function (b) {
        var i = +b.getAttribute('data-i');
        b.addEventListener('click', function () {
          if (i === r.odd) { b.classList.add('pick'); $$('.vr-tc', host).forEach(function (x) { x.disabled = true; }); fb(true, r.ok); gs.r++; save(); setTimeout(render, 1600); }
          else { fb(false, r.miss || G.miss); shake(b); }
        });
      });
    }
    function recap() { return '<ul class="vr-recap">' + R.map(function (r) { return '<li>' + art(r.items[r.odd]) + esc(r.items[r.odd].name) + ': ' + esc(r.why || '') + '</li>'; }).join('') + '</ul>'; }
    render();
    return {
      cols: G.cols || ['Group', 'Did not belong'], done: function () { return gs.r >= R.length; },
      rows: function () { return R.map(function (r, i) { return [r.group || r.q, i < gs.r ? r.items[r.odd].name : '']; }); },
      auto: async function () { while (gs.r < R.length) { var r = R[gs.r]; click($('.vr-tc[data-i="' + ((r.odd + 1) % r.items.length) + '"]', host)); click($('.vr-tc[data-i="' + r.odd + '"]', host)); await wait(1700); } }
    };
  };

  /* clue: Who am I? Read a clue, tap a person. A wrong pick shows the next clue. */
  GAMES.clue = function (host, G) {
    var P = G.people, R = G.rounds; gs.r = gs.r || 0; gs.c = gs.c || 1;
    function render() {
      if (gs.r >= R.length) { host.innerHTML = '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var r = R[gs.r], used = P.map(function (p, i) { return R.some(function (x, k) { return k < gs.r && x.answer === i; }); });
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('round', 'Who am I?')) + ' ' + (gs.r + 1) + ' of ' + R.length + '</div>' +
        '<div class="vr-clues">' + r.clues.slice(0, gs.c).map(function (c, i) { return '<div class="cl"><span class="n">' + esc(lbl('clue', 'Clue')) + ' ' + (i + 1) + '</span>' + esc(c) + '</div>'; }).join('') +
        (gs.c < r.clues.length ? '<button type="button" class="vr-more">' + esc(lbl('more', 'Show the next clue')) + '</button>' : '') + '</div>' +
        '<div class="vr-people">' + P.map(function (p, i) { return '<button type="button" class="vr-tc' + (used[i] ? ' used' : '') + '" data-i="' + i + '">' + art(p) + '<b>' + esc(p.name) + '</b>' + (used[i] ? '<small>✓</small>' : '') + '</button>'; }).join('') + '</div>' + fbBox();
      var m = $('.vr-more', host); if (m) m.addEventListener('click', function () { gs.c++; save(); render(); });
      $$('.vr-tc', host).forEach(function (b) {
        var i = +b.getAttribute('data-i');
        b.addEventListener('click', function () {
          if (i === r.answer) { b.classList.add('pick'); $$('.vr-tc', host).forEach(function (x) { x.disabled = true; }); fb(true, r.ok); gs.r++; gs.c = 1; save(); setTimeout(render, 1800); }
          else { var more = gs.c < r.clues.length; if (more) { gs.c++; save(); render(); } fb(false, (more ? lbl('next', 'Not this person. Read the next clue.') : G.miss)); shake($('.vr-tc[data-i="' + i + '"]', host)); }
        });
      });
    }
    render();
    return {
      cols: G.cols || ['Person', 'What they gave'], done: function () { return gs.r >= R.length; },
      rows: function () { return R.map(function (r, i) { return [P[r.answer].name, i < gs.r ? r.gave || r.clues[r.clues.length - 1] : '']; }); },
      auto: async function () { while (gs.r < R.length) { var r = R[gs.r]; click($('.vr-tc[data-i="' + ((r.answer + 1) % P.length) + '"]', host)); click($('.vr-tc[data-i="' + r.answer + '"]', host)); await wait(1900); } }
    };
  };

  /* regionmap: a simple map of the five U.S. regions; read each evidence card and tap its region */
  GAMES.regionmap = function (host, G) {
    var K = G.cards, RG = G.regions; gs.p = gs.p || [];
    function cur() { for (var i = 0; i < K.length; i++) if (!gs.p[i]) return i; return -1; }
    function map(active) {
      return '<div class="vr-usmap" aria-label="' + esc(lbl('map', 'Map of the five regions')) + '">' + RG.map(function (r) {
        var pins = K.map(function (c, i) { return gs.p[i] && c.region === r.key ? '<span class="pin" title="' + esc(c.name) + '">' + (c.icon || '📍') + '</span>' : ''; }).join('');
        return '<' + (active ? 'button type="button"' : 'div') + ' class="rg rg-' + r.key + '" data-r="' + r.key + '"><span class="nm">' + esc(r.name) + '</span><span class="pins">' + pins + '</span></' + (active ? 'button' : 'div') + '>';
      }).join('') + '</div>';
    }
    function render() {
      var i = cur();
      if (i < 0) { host.innerHTML = map(false) + '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var c = K[i];
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('card', 'Evidence card')) + ' ' + (i + 1) + ' of ' + K.length + '</div>' +
        '<div class="vr-ev" draggable="true">' + art(c) + '<div><b>' + esc(c.name) + '</b>' + esc(c.what || '') + '</div></div>' + map(true) + fbBox();
      dragify($('.vr-ev', host), 'c');
      $$('.rg[data-r]', host).forEach(function (b) {
        function go() { if (b.getAttribute('data-r') === c.region) { gs.p[i] = true; save(); fb(true, c.ok); $$('.rg', host).forEach(function (x) { x.disabled = true; }); setTimeout(render, 1600); } else { fb(false, c.miss || G.miss); shake(b); } }
        b.addEventListener('click', go); dropify(b, go);
      });
    }
    render();
    return {
      cols: G.cols || ['Evidence', 'Region'], done: function () { return cur() < 0; },
      rows: function () { return K.map(function (c, i) { return [c.name, gs.p[i] ? RG.find(function (r) { return r.key === c.region; }).name : '']; }); },
      auto: async function () { while (cur() >= 0) { var c = K[cur()]; var w = RG.find(function (r) { return r.key !== c.region; }); click($('.rg[data-r="' + w.key + '"]', host)); click($('.rg[data-r="' + c.region + '"]', host)); await wait(1700); } }
    };
  };

  /* trade: two places; pick what each one sends, then press Make the trade */
  GAMES.trade = function (host, G) {
    var R = G.rounds; gs.r = gs.r || 0; var pa = -1, pb = -1;
    function side(s, which, pick) {
      return '<div class="vr-town"><div class="tn">' + (s.icon || '') + ' ' + esc(s.name) + '</div><div class="tl">' + esc(s.line) + '</div>' +
        s.goods.map(function (g, i) { return '<button type="button" class="vr-good' + (pick === i ? ' sel' : '') + '" data-s="' + which + '" data-i="' + i + '">' + art(g) + esc(g.name) + '</button>'; }).join('') + '</div>';
    }
    function render() {
      if (gs.r >= R.length) { host.innerHTML = '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var r = R[gs.r];
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('round', 'Trade')) + ' ' + (gs.r + 1) + ' of ' + R.length + '</div><p class="vr-q">' + esc(lbl('step', 'Pick one thing each place sends. Then press Make the trade.')) + '</p>' +
        '<div class="vr-trade">' + side(r.a, 'a', pa) + '<div class="vr-swap">⇄</div>' + side(r.b, 'b', pb) + '</div>' +
        '<button type="button" class="vr-go">' + esc(lbl('go', 'Make the trade')) + '</button>' + fbBox();
      $$('.vr-good', host).forEach(function (b) { b.addEventListener('click', function () { if (b.getAttribute('data-s') === 'a') pa = +b.getAttribute('data-i'); else pb = +b.getAttribute('data-i'); render(); }); });
      $('.vr-go', host).addEventListener('click', function () {
        if (pa < 0 || pb < 0) { fb(false, lbl('both', 'Pick one thing from each place first.')); return; }
        var okA = pa === r.a.give, okB = pb === r.b.give;
        if (okA && okB) { gs.g = gs.g || []; gs.g[gs.r] = true; fb(true, r.ok); gs.r++; pa = pb = -1; save(); $('.vr-go', host).disabled = true; setTimeout(render, 1900); }
        else { fb(false, !okA ? r.a.miss : r.b.miss); shake($('.vr-go', host)); }
      });
    }
    render();
    return {
      cols: G.cols || ['Trade', 'Who sends what'], done: function () { return gs.r >= R.length; },
      rows: function () { return R.map(function (r, i) { return [r.a.name + ' and ' + r.b.name, i < gs.r ? r.a.name + ' sends ' + r.a.goods[r.a.give].name + '; ' + r.b.name + ' sends ' + r.b.goods[r.b.give].name : '']; }); },
      auto: async function () {
        while (gs.r < R.length) { var r = R[gs.r]; click($('.vr-good[data-s="a"][data-i="' + ((r.a.give + 1) % r.a.goods.length) + '"]', host)); click($('.vr-good[data-s="b"][data-i="' + r.b.give + '"]', host)); click($('.vr-go', host));
          click($('.vr-good[data-s="a"][data-i="' + r.a.give + '"]', host)); click($('.vr-go', host)); await wait(2000); }
      }
    };
  };

  /* checks: test each object; tap every test it passes, then press Check */
  GAMES.checks = function (host, G) {
    var T = G.tests, K = G.things; gs.r = gs.r || 0; var on = {};
    function render() {
      if (gs.r >= K.length) { host.innerHTML = '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var k = K[gs.r];
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('round', 'Object')) + ' ' + (gs.r + 1) + ' of ' + K.length + '</div>' +
        '<div class="vr-card vr-thing">' + art(k) + '<div><b>' + esc(k.name) + '</b>' + esc(k.what) + '</div></div>' +
        '<p class="vr-q">' + esc(lbl('step', 'Tap every test it passes. Then press Check.')) + '</p><div class="vr-tests">' +
        T.map(function (t) { return '<button type="button" class="vr-test' + (on[t.key] ? ' on' : '') + '" aria-pressed="' + !!on[t.key] + '" data-t="' + t.key + '"><span class="bx">' + (on[t.key] ? '✓' : '') + '</span>' + (t.icon || '') + ' ' + esc(t.name) + '</button>'; }).join('') +
        '</div><button type="button" class="vr-go">' + esc(lbl('go', 'Check')) + '</button>' + fbBox();
      $$('.vr-test', host).forEach(function (b) { b.addEventListener('click', function () { var t = b.getAttribute('data-t'); on[t] = !on[t]; render(); }); });
      $('.vr-go', host).addEventListener('click', function () {
        var wrong = T.filter(function (t) { return !!on[t.key] !== (k.pass.indexOf(t.key) >= 0); });
        if (!wrong.length) { fb(true, k.ok); gs.r++; on = {}; save(); $('.vr-go', host).disabled = true; setTimeout(render, 2000); }
        else { var t = wrong[0]; fb(false, (k.why && k.why[t.key]) || G.miss); shake($('.vr-test[data-t="' + t.key + '"]', host)); }
      });
    }
    render();
    return {
      cols: G.cols || ['Object', 'Tests it passes'], done: function () { return gs.r >= K.length; },
      rows: function () { return K.map(function (k, i) { return [k.name, i < gs.r ? (k.pass.length ? T.filter(function (t) { return k.pass.indexOf(t.key) >= 0; }).map(function (t) { return t.name; }).join(', ') : 'none') : '']; }); },
      auto: async function () {
        while (gs.r < K.length) { var k = K[gs.r]; click($('.vr-go', host)); if (!k.pass.length) { click($('.vr-test[data-t="' + T[0].key + '"]', host)); click($('.vr-go', host)); click($('.vr-test[data-t="' + T[0].key + '"]', host)); }
          k.pass.forEach(function (p) { if (!on[p]) click($('.vr-test[data-t="' + p + '"]', host)); }); click($('.vr-go', host)); await wait(2100); }
      }
    };
  };

  /* route: a map with places; for each cargo, tap the place that needs it and an arrow is drawn */
  GAMES.route = function (host, G) {
    var PL = G.places, K = G.cargo; gs.p = gs.p || [];
    function cur() { for (var i = 0; i < K.length; i++) if (!gs.p[i]) return i; return -1; }
    function P(k) { return PL.find(function (p) { return p.key === k; }); }
    function map(active, c) {
      var arrows = K.map(function (x, i) {
        if (!gs.p[i]) return ''; var a = P(x.from), b = P(x.to);
        return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" marker-end="url(#vrah)"/>';
      }).join('');
      return '<div class="vr-route"><svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="vrah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#B5532A"/></marker></defs>' + arrows + '</svg>' +
        PL.map(function (p) {
          var from = c && c.from === p.key;
          return '<' + (active && !from ? 'button type="button"' : 'div') + ' class="pl' + (from ? ' from' : '') + '" data-p="' + p.key + '" style="left:' + p.x + '%;top:' + (p.y / 0.7) + '%">' + (p.icon || '') + '<b>' + esc(p.name) + '</b>' + (from ? '<small>' + esc(lbl('from', 'from here')) + '</small>' : '') + '</' + (active && !from ? 'button' : 'div') + '>';
        }).join('') + '</div>';
    }
    function render() {
      var i = cur();
      if (i < 0) { host.innerHTML = map(false) + '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var c = K[i];
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('round', 'Cargo')) + ' ' + (i + 1) + ' of ' + K.length + '</div>' +
        '<div class="vr-ev" draggable="true">' + art(c) + '<div><b>' + esc(c.name) + '</b>' + esc(c.what) + '</div></div>' + map(true, c) + fbBox();
      dragify($('.vr-ev', host), 'c');
      $$('.pl[data-p]', host).forEach(function (b) {
        if (b.tagName !== 'BUTTON') return;
        function go() { if (b.getAttribute('data-p') === c.to) { gs.p[i] = true; save(); render(); fb(true, c.ok); $$('.pl', host).forEach(function (x) { x.disabled = true; }); setTimeout(render, 1700); } else { fb(false, c.miss || G.miss); shake(b); } }
        b.addEventListener('click', go); dropify(b, go);
      });
    }
    render();
    return {
      cols: G.cols || ['Cargo', 'Route'], done: function () { return cur() < 0; },
      rows: function () { return K.map(function (c, i) { return [c.name, gs.p[i] ? P(c.from).name + ' → ' + P(c.to).name : '']; }); },
      auto: async function () { while (cur() >= 0) { var c = K[cur()]; var w = PL.find(function (p) { return p.key !== c.to && p.key !== c.from; }); click($('button.pl[data-p="' + w.key + '"]', host)); click($('button.pl[data-p="' + c.to + '"]', host)); await wait(1800); } }
    };
  };

  /* dilemma: a short market story; pick what an honest, responsible person does. The meter fills. */
  GAMES.dilemma = function (host, G) {
    var R = G.rounds; gs.r = gs.r || 0;
    function meter() { return '<div class="vr-meter"><span>' + esc(lbl('meter', 'Trust in the market')) + '</span><div class="bar"><i style="width:' + (100 * gs.r / R.length) + '%"></i></div></div>'; }
    function render() {
      if (gs.r >= R.length) { host.innerHTML = meter() + '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var r = R[gs.r];
      host.innerHTML = meter() + '<div class="vr-gstep">' + esc(lbl('round', 'Market story')) + ' ' + (gs.r + 1) + ' of ' + R.length + '</div>' +
        '<div class="vr-card vr-scene">' + art(r) + '<div><b>' + esc(r.who) + '</b>' + esc(r.scene) + '</div></div><p class="vr-q">' + esc(r.q) + '</p>' +
        '<div class="vr-opts">' + r.options.map(function (o, i) { return '<button type="button" class="vr-optl" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>' + fbBox();
      $$('.vr-optl', host).forEach(function (b) {
        var i = +b.getAttribute('data-i');
        b.addEventListener('click', function () {
          if (i === r.right) { b.classList.add('pick'); $$('.vr-optl', host).forEach(function (x) { x.disabled = true; }); fb(true, r.ok); gs.r++; save(); var m = $('.vr-meter i', host); if (m) m.style.width = (100 * gs.r / R.length) + '%'; setTimeout(render, 2000); }
          else { fb(false, (r.miss && r.miss[i]) || G.miss); shake(b); }
        });
      });
    }
    render();
    return {
      cols: G.cols || ['Story', 'The honest choice'], done: function () { return gs.r >= R.length; },
      rows: function () { return R.map(function (r, i) { return [r.who, i < gs.r ? r.options[r.right] : '']; }); },
      auto: async function () { while (gs.r < R.length) { var r = R[gs.r]; click($('.vr-optl[data-i="' + ((r.right + 1) % r.options.length) + '"]', host)); click($('.vr-optl[data-i="' + r.right + '"]', host)); await wait(2100); } }
    };
  };

  /* fill: finish each sentence by tapping the missing word (or dragging it into the blank) */
  GAMES.fill = function (host, G) {
    var S = G.sentences, W = G.words; gs.r = gs.r || 0;
    function sent(s, filled) { var p = s.text.split('___'); return esc(p[0]) + (filled ? '<b class="fillw">' + esc(s.answer) + '</b>' : '<span class="blank">' + esc(lbl('blank', 'tap a word')) + '</span>') + esc(p[1] || ''); }
    function render() {
      var done = gs.r >= S.length;
      host.innerHTML = (G.doc ? '<div class="vr-doc">' + art(G.doc) + '</div>' : '') + '<div class="vr-gstep">' + (done ? '' : esc(lbl('round', 'Sentence')) + ' ' + (gs.r + 1) + ' of ' + S.length) + '</div>' +
        '<ol class="vr-sents">' + S.map(function (s, i) { return '<li class="' + (i < gs.r ? 'set' : i === gs.r ? 'cur' : 'later') + '">' + (i <= gs.r ? sent(s, i < gs.r) : '…') + '</li>'; }).join('') + '</ol>' +
        (done ? '<div class="vr-fb ok">' + esc(G.done) + '</div>' : '<div class="vr-words">' + W.map(function (w, i) { return '<button type="button" class="vr-word-b" data-w="' + esc(w) + '">' + esc(w) + '</button>'; }).join('') + '</div>' + fbBox());
      if (done) { api.finish(); return; }
      api.unfinish();
      var s = S[gs.r], bl = $('.vr-sents li.cur .blank', host);
      function go(w, el) { if (w === s.answer) { gs.r++; save(); render(); fb(true, s.ok); } else { fb(false, s.miss || G.miss); shake(el); } }
      $$('.vr-word-b', host).forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-w'), b); }); dragify(b, b.getAttribute('data-w')); });
      if (bl) dropify(bl, function (d) { go(d, bl); });
    }
    render();
    return {
      cols: G.cols || ['Sentence', 'My answer'], done: function () { return gs.r >= S.length; },
      rows: function () { return S.map(function (s, i) { return [s.text.replace('___', '____'), i < gs.r ? s.answer : '']; }); },
      auto: async function () { while (gs.r < S.length) { var s = S[gs.r]; var w = W.find(function (x) { return x !== s.answer; }); click($('.vr-word-b[data-w="' + w + '"]', host)); click($('.vr-word-b[data-w="' + s.answer + '"]', host)); await wait(40); } }
    };
  };

  /* memory: flip two cards; a picture and its name stay face up when they match */
  GAMES.memory = function (host, G) {
    var P = G.pairs, L = G.layout; gs.m = gs.m || []; var open = [], busy = false;
    function face(c) { var p = P[c.p]; return c.s === 'a' ? art(p.a) + '<b>' + esc(p.a.cap || '') + '</b>' : '<b class="nm">' + esc(p.b) + '</b>'; }
    function render() {
      var n = gs.m.filter(Boolean).length;
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('step', 'Flip two cards. Find a picture and its name.')) + ' <span class="vr-cnt">' + n + ' of ' + P.length + ' pairs</span></div>' +
        '<div class="vr-mem">' + L.map(function (c, i) {
          var up = gs.m[c.p] || open.indexOf(i) >= 0;
          return '<button type="button" class="mc' + (up ? ' up' : '') + (gs.m[c.p] ? ' got' : '') + '" data-i="' + i + '" aria-label="' + (up ? esc(c.s === 'a' ? P[c.p].a.alt : P[c.p].b) : esc(lbl('down', 'Face-down card')) + ' ' + (i + 1)) + '"' + (gs.m[c.p] ? ' disabled' : '') + '>' + (up ? face(c) : '<span class="back">🏛️</span>') + '</button>';
        }).join('') + '</div>' + fbBox();
      $$('.mc', host).forEach(function (b) {
        var i = +b.getAttribute('data-i');
        b.addEventListener('click', function () {
          if (busy || open.indexOf(i) >= 0) return;
          open.push(i); render();
          if (open.length === 2) {
            var a = L[open[0]], c = L[open[1]];
            if (a.p === c.p && a.s !== c.s) { gs.m[a.p] = true; open = []; save(); render(); fb(true, P[a.p].ok); if (gs.m.filter(Boolean).length === P.length) { fb(true, G.done); api.finish(); } }
            else { busy = true; fb(false, G.miss); setTimeout(function () { open = []; busy = false; render(); }, 1300); }
          }
        });
      });
    }
    render();
    return {
      cols: G.cols || ['Picture', 'Name'], done: function () { return gs.m.filter(Boolean).length === P.length; },
      rows: function () { return P.map(function (p, i) { return [p.a.cap || p.a.alt, gs.m[i] ? p.b : '']; }); },
      auto: async function () {
        for (var p = 0; p < P.length; p++) {
          if (gs.m[p]) continue;
          var ia = L.findIndex(function (c) { return c.p === p && c.s === 'a'; }), ib = L.findIndex(function (c) { return c.p === p && c.s === 'b'; });
          if (p === 0) { var w = L.findIndex(function (c) { return c.p !== p; }); click($('.mc[data-i="' + ia + '"]', host)); click($('.mc[data-i="' + w + '"]', host)); await wait(1450); }
          click($('.mc[data-i="' + ia + '"]', host)); click($('.mc[data-i="' + ib + '"]', host)); await wait(60);
        }
      }
    };
  };

  /* calendar: put each holiday in its month, then tell if it is a loud-and-bright day or a quiet-and-serious day */
  GAMES.calendar = function (host, G) {
    var K = G.cards, KD = G.kinds, M = G.months; gs.c = gs.c || []; gs.k = gs.k || [];
    function cur() { for (var i = 0; i < K.length; i++) if (!gs.k[i]) return i; return -1; }
    function cal(active) {
      return '<div class="vr-cal">' + M.map(function (m, mi) {
        var ch = K.map(function (c, i) { return gs.c[i] && c.month === mi + 1 ? '<span class="chip">' + (c.icon || '') + ' ' + esc(c.name) + '</span>' : ''; }).join('');
        return '<' + (active ? 'button type="button"' : 'div') + ' class="mo" data-m="' + (mi + 1) + '"><span class="mn">' + esc(m) + '</span>' + ch + '</' + (active ? 'button' : 'div') + '>';
      }).join('') + '</div>';
    }
    function render() {
      var i = cur();
      if (i < 0) { host.innerHTML = cal(false) + '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var c = K[i];
      var card = '<div class="vr-ev" draggable="true">' + art(c) + '<div><b>' + esc(c.name) + '</b>' + esc(c.when) + '</div></div>';
      if (!gs.c[i]) {
        host.innerHTML = '<div class="vr-gstep">' + esc(lbl('round', 'Holiday')) + ' ' + (i + 1) + ' of ' + K.length + ' · ' + esc(lbl('step1', 'Tap its month.')) + '</div>' + card + cal(true) + fbBox();
        dragify($('.vr-ev', host), 'c');
        $$('.mo', host).forEach(function (b) {
          function go() { if (+b.getAttribute('data-m') === c.month) { gs.c[i] = true; save(); render(); fb(true, c.okMonth); } else { fb(false, G.miss); shake(b); } }
          b.addEventListener('click', go); dropify(b, go);
        });
      } else {
        host.innerHTML = '<div class="vr-gstep">' + esc(lbl('round', 'Holiday')) + ' ' + (i + 1) + ' of ' + K.length + ' · ' + esc(lbl('step2', 'What kind of day is it?')) + '</div>' + card +
          '<p class="vr-q">' + esc(c.honors) + '</p><div class="vr-opts">' + KD.map(function (k) { return '<button type="button" class="vr-optl" data-k="' + k.key + '">' + (k.icon || '') + ' ' + esc(k.name) + '</button>'; }).join('') + '</div>' + cal(false) + fbBox();
        $$('.vr-optl', host).forEach(function (b) {
          b.addEventListener('click', function () { if (b.getAttribute('data-k') === c.kind) { gs.k[i] = true; save(); fb(true, c.ok); $$('.vr-optl', host).forEach(function (x) { x.disabled = true; }); setTimeout(render, 1800); } else { fb(false, c.miss || G.miss); shake(b); } });
        });
      }
    }
    render();
    return {
      cols: G.cols || ['Holiday', 'Month and kind of day'], done: function () { return cur() < 0; },
      rows: function () { return K.map(function (c, i) { return [c.name, gs.k[i] ? M[c.month - 1] + ' · ' + KD.find(function (k) { return k.key === c.kind; }).name : '']; }); },
      auto: async function () {
        while (cur() >= 0) { var c = K[cur()]; click($('.mo[data-m="' + (c.month % 12 + 1) + '"]', host)); click($('.mo[data-m="' + c.month + '"]', host));
          var w = KD.find(function (k) { return k.key !== c.kind; }); click($('.vr-optl[data-k="' + w.key + '"]', host)); click($('.vr-optl[data-k="' + c.kind + '"]', host)); await wait(1900); }
      }
    };
  };

  /* reveal: a picture hides under 9 tiles. Tap tiles to peek; name it as soon as you can. */
  GAMES.reveal = function (host, G) {
    var R = G.rounds; gs.r = gs.r || 0; gs.t = gs.t || []; var open = [];
    function render() {
      if (gs.r >= R.length) { host.innerHTML = '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var r = R[gs.r];
      host.innerHTML = '<div class="vr-gstep">' + esc(lbl('round', 'Picture')) + ' ' + (gs.r + 1) + ' of ' + R.length + ' · ' + esc(lbl('step', 'Tap a tile to peek. Name it when you know.')) + '</div>' +
        '<div class="vr-rev"><img src="' + r.img + '" alt="' + esc(open.length >= 9 ? r.alt : lbl('hidden', 'A hidden picture')) + '"><div class="tiles">' +
        [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (t) { return '<button type="button" class="tile' + (open.indexOf(t) >= 0 ? ' gone' : '') + '" data-t="' + t + '" aria-label="' + esc(lbl('tile', 'Tile')) + ' ' + (t + 1) + '"></button>'; }).join('') +
        '</div></div><p class="vr-q">' + esc(r.q) + '</p><div class="vr-opts">' + r.options.map(function (o, i) { return '<button type="button" class="vr-optl" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>' + fbBox();
      $$('.tile', host).forEach(function (b) { b.addEventListener('click', function () { var t = +b.getAttribute('data-t'); if (open.indexOf(t) < 0) open.push(t); b.classList.add('gone'); }); });
      $$('.vr-optl', host).forEach(function (b) {
        var i = +b.getAttribute('data-i');
        b.addEventListener('click', function () {
          if (i === r.right) { gs.t[gs.r] = open.length; open = [0, 1, 2, 3, 4, 5, 6, 7, 8]; $$('.tile', host).forEach(function (x) { x.classList.add('gone'); }); $('.vr-rev img', host).alt = r.alt; $$('.vr-optl', host).forEach(function (x) { x.disabled = true; }); b.classList.add('pick'); fb(true, r.ok); gs.r++; save(); setTimeout(function () { open = []; render(); }, 2200); }
          else { fb(false, r.miss || G.miss); shake(b); var shut = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(function (t) { return open.indexOf(t) < 0; }); if (shut.length) { open.push(shut[0]); var tl = $('.tile[data-t="' + shut[0] + '"]', host); if (tl) tl.classList.add('gone'); } }
        });
      });
    }
    render();
    return {
      cols: G.cols || ['Picture', 'Kind of evidence'], done: function () { return gs.r >= R.length; },
      rows: function () { return R.map(function (r, i) { return [r.options[r.right], i < gs.r ? r.kind + ' (' + gs.t[i] + ' tiles)' : '']; }); },
      auto: async function () { while (gs.r < R.length) { var r = R[gs.r]; click($('.tile[data-t="4"]', host)); click($('.vr-optl[data-i="' + ((r.right + 1) % r.options.length) + '"]', host)); click($('.vr-optl[data-i="' + r.right + '"]', host)); await wait(2300); } }
    };
  };

  /* panel: build the exhibit panel one part at a time; pick the strongest choice for each part */
  GAMES.panel = function (host, G) {
    var PT = G.parts; gs.p = gs.p || [];
    function cur() { for (var i = 0; i < PT.length; i++) if (gs.p[i] == null) return i; return -1; }
    function board() {
      return '<div class="vr-panel">' + PT.map(function (p, i) { return '<div class="fr' + (gs.p[i] != null ? ' set' : '') + '"><span class="pn">' + (p.icon || '') + ' ' + esc(p.name) + '</span>' + (gs.p[i] != null ? '<b>' + esc(p.choices[gs.p[i]].text) + '</b>' : '<i>' + esc(lbl('empty', 'empty')) + '</i>') + '</div>'; }).join('') + '</div>';
    }
    function render() {
      var i = cur();
      if (i < 0) { host.innerHTML = board() + '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var p = PT[i];
      host.innerHTML = board() + '<div class="vr-gstep">' + esc(lbl('round', 'Part')) + ' ' + (i + 1) + ' of ' + PT.length + ': ' + esc(p.name) + '</div><p class="vr-q">' + esc(p.q) + '</p>' +
        '<div class="vr-opts">' + p.choices.map(function (c, k) { return '<button type="button" class="vr-optl" data-k="' + k + '">' + esc(c.text) + '</button>'; }).join('') + '</div>' + fbBox();
      $$('.vr-optl', host).forEach(function (b) {
        var k = +b.getAttribute('data-k'), c = p.choices[k];
        b.addEventListener('click', function () { if (c.good) { gs.p[i] = k; save(); fb(true, c.why); $$('.vr-optl', host).forEach(function (x) { x.disabled = true; }); setTimeout(render, 1900); } else { fb(false, c.why); shake(b); } });
      });
    }
    render();
    return {
      cols: G.cols || ['Exhibit part', 'My choice'], done: function () { return cur() < 0; },
      rows: function () { return PT.map(function (p, i) { return [p.name, gs.p[i] != null ? p.choices[gs.p[i]].text : '']; }); },
      auto: async function () { while (cur() >= 0) { var p = PT[cur()]; var bad = p.choices.findIndex(function (c) { return !c.good; }), good = p.choices.findIndex(function (c) { return c.good; }); click($('.vr-optl[data-k="' + bad + '"]', host)); click($('.vr-optl[data-k="' + good + '"]', host)); await wait(2000); } }
    };
  };

  /* wheel: spin the year wheel; it stops on a museum room; answer that room's question */
  GAMES.wheel = function (host, G) {
    var SL = G.slices, n = SL.length; gs.r = gs.r || 0; var landed = false, rot = gs.r * (360 / n);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function wheel() {
      var seg = 360 / n;
      return '<div class="vr-wheel"><div class="ptr">▼</div><div class="wh" style="transform:rotate(' + (-rot) + 'deg)">' + SL.map(function (s, i) {
        return '<span class="sl' + (i < gs.r ? ' got' : '') + '" style="left:' + (50 + 33 * Math.sin(i * seg * Math.PI / 180)).toFixed(1) + '%;top:' + (50 - 33 * Math.cos(i * seg * Math.PI / 180)).toFixed(1) + '%"><span class="ic">' + (s.icon || '') + '</span><small>' + esc(s.name) + '</small></span>';
      }).join('') + '</div></div>';
    }
    function render() {
      if (gs.r >= n) { host.innerHTML = wheel() + '<div class="vr-fb ok">' + esc(G.done) + '</div>'; api.finish(); return; }
      api.unfinish();
      var s = SL[gs.r];
      host.innerHTML = wheel() + '<div class="vr-gstep">' + esc(lbl('round', 'Spin')) + ' ' + (gs.r + 1) + ' of ' + n + '</div>' +
        (landed ? '<p class="vr-q">' + (s.icon || '') + ' <b>' + esc(s.name) + '</b>: ' + esc(s.q) + '</p><div class="vr-opts">' + s.options.map(function (o, i) { return '<button type="button" class="vr-optl" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>'
          : '<button type="button" class="vr-go vr-spin">' + esc(lbl('spin', 'Spin the wheel')) + '</button>') + fbBox();
      var sp = $('.vr-spin', host);
      if (sp) sp.addEventListener('click', function () {
        sp.disabled = true; rot = gs.r * (360 / n) + (reduce ? 0 : 720); var wh = $('.wh', host);
        wh.style.transition = reduce ? 'none' : 'transform 1.2s cubic-bezier(.2,.7,.2,1)'; wh.style.transform = 'rotate(' + (-rot) + 'deg)';
        setTimeout(function () { rot = gs.r * (360 / n); landed = true; render(); }, reduce ? 0 : 1250);
      });
      $$('.vr-optl', host).forEach(function (b) {
        var i = +b.getAttribute('data-i');
        b.addEventListener('click', function () { if (i === s.right) { fb(true, s.ok); $$('.vr-optl', host).forEach(function (x) { x.disabled = true; }); b.classList.add('pick'); gs.r++; landed = false; save(); rot = gs.r * (360 / n); setTimeout(render, 1900); } else { fb(false, s.miss || G.miss); shake(b); } });
      });
    }
    render();
    return {
      cols: G.cols || ['Museum room', 'My answer'], done: function () { return gs.r >= n; },
      rows: function () { return SL.map(function (s, i) { return [s.name, i < gs.r ? s.options[s.right] : '']; }); },
      auto: async function () { while (gs.r < n) { click($('.vr-spin', host)); await wait(1400); var s = SL[gs.r]; click($('.vr-optl[data-i="' + ((s.right + 1) % s.options.length) + '"]', host)); click($('.vr-optl[data-i="' + s.right + '"]', host)); await wait(2000); } }
    };
  };

  var api = {
    finish: function () { var w = $('#vr-write'); if (w) w.hidden = false; checkStamp(); },
    unfinish: function () { var w = $('#vr-write'); if (w) w.hidden = true; }
  };
  var GM = game && GAMES[G.type] ? GAMES[G.type](game, G) : { done: function () { return true; }, rows: function () { return []; }, cols: ['', ''], auto: async function () {} };
  function render() { /* kept for VR_TEST */ }

  /* writing */
  var tas = $$('#vr-write textarea');
  var last = tas[0];
  tas.forEach(function (t, i) {
    t.value = st.w[i] || '';
    t.addEventListener('focus', function () { last = t; });
    t.addEventListener('input', function () { st.w[i] = t.value; save(); count(); });
  });
  $$('#vr-write .vr-chips button').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = last || tas[0]; if (!t) return;
      t.value = (t.value && !/\s$/.test(t.value) ? t.value + ' ' : t.value) + b.textContent;
      t.dispatchEvent(new Event('input')); t.focus();
    });
  });
  function total() { return tas.reduce(function (a, t) { return a + words(t.value); }, 0); }
  function eachStarted() { return tas.every(function (t) { return words(t.value) >= 4; }); }
  function count() {
    var n = total(), c = $('#vr-count');
    if (c) { c.textContent = n >= G.min ? (eachStarted() ? n + ' words ✓' : n + ' words · finish both sentences') : n + ' of ' + G.min + ' words'; c.classList.toggle('ok', n >= G.min && eachStarted()); }
    checkStamp();
  }
  function studioDone() { return !!GM && GM.done() && total() >= G.min && eachStarted(); }
  function checkStamp() { if (!GM || !tas) return; var s = $('#vr-stamp'); var d = studioDone(); if (s) s.classList.toggle('on', d); if (d) { try { if (localStorage.getItem(DONEKEY + V.week) !== 'vr') localStorage.setItem(DONEKEY + V.week, 'desk'); } catch (e) {} } }

  /* first name with a kind filter */
  var BAD = /(stupid|dumb|idiot|hate|kill|poop|butt|fart|ugly|loser|sex|damn|hell|crap|shit|fuck|bitch|ass\b)/i;
  var nm = $('#vr-name'), nmMsg = $('#vr-name-msg');
  if (nm) {
    nm.value = st.name || '';
    nm.addEventListener('input', function () {
      var v = nm.value.trim();
      if (BAD.test(v) || /[^A-Za-zÀ-ÿ' -]/.test(v)) { nmMsg.textContent = 'Please type just your first name.'; }
      else { nmMsg.textContent = ''; st.name = v; save(); }
    });
  }

  /* PDF */
  var pdf = $('#vr-pdf');
  if (pdf) pdf.addEventListener('click', function () {
    var name = (st.name || '').trim();
    if (!name) { nmMsg.textContent = 'Type your first name first.'; nm.focus(); return; }
    var rows = GM.rows().map(function (r) {
      return '<tr><td>' + esc(r[0]) + '</td><td>' + (r[1] ? esc(r[1]) : '<i>not done yet</i>') + '</td></tr>';
    }).join('');
    var sents = tas.map(function (t, i) { return '<p><b>' + esc(G.frames[i]) + '</b><br>' + (t.value ? esc(t.value) : '<i>(not written yet)</i>') + '</p>'; }).join('');
    var h = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(V.canvas) + ' · ' + esc(name) + '</title><style>body{font:16px/1.5 Arial,sans-serif;max-width:720px;margin:24px auto;padding:0 16px;color:#222}h1{font-size:22px;margin:4px 0}.k{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8A6A1E}table{border-collapse:collapse;width:100%}th{background:#0E1C42;color:#fff;text-align:left;padding:5px 8px;font-size:13px}td{border:1px solid #ddd;padding:6px 8px}.st{display:inline-block;border:3px solid #A3312B;color:#A3312B;font-weight:900;letter-spacing:2px;padding:3px 12px;border-radius:8px;transform:rotate(-3deg);text-transform:uppercase}@media print{button{display:none}}</style></head><body>' +
      '<div class="k">' + esc(GRADE) + ' · Week ' + V.week + '</div><h1>' + esc(V.canvas) + ' (' + esc(ALT) + ')</h1>' +
      '<p><b>Name:</b> ' + esc(name) + ' &nbsp; <b>Date:</b> ' + new Date().toLocaleDateString() + '</p>' +
      '<h2>' + esc(G.title) + '</h2><table><tr><th>' + esc(GM.cols[0]) + '</th><th>' + esc(GM.cols[1]) + '</th></tr>' + rows + '</table>' +
      '<h2>What I think (' + total() + ' words)</h2>' + sents + (studioDone() ? '<div class="st">' + esc(V.stamp) + '</div>' : '') +
      '<p style="margin-top:24px"><button onclick="print()">🖨 Print or save as PDF</button></p></body></html>';
    var w = null; try { w = window.open('', '_blank'); } catch (e) {}
    if (w && w.document) { w.document.open(); w.document.write(h); w.document.close(); setTimeout(function () { try { w.print(); } catch (e) {} }, 400); }
    else {
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([h], { type: 'text/html' }));
      a.download = 'week-' + V.week + '-vr-' + ALT.toLowerCase().replace(/\s+/g, '-') + '-' + name.replace(/\s+/g, '-') + '.html'; document.body.appendChild(a); a.click(); a.remove();
    }
  });

  count();
  window.VR_TEST = { state: st, game: GM, auto: function () { return GM.auto(); }, done: function () { return GM.done(); }, studioDone: studioDone };
})();
