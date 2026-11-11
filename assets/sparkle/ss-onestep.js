/* One part at a time for social studies (ss-onestep.js), 11 Nov 2026.
   Ported from ELA's onestep.js (Bethany: "show one thing at a time, step by step,
   guide them, think like we are holding their hand").

   Per room (tab): the parts of the room show one at a time, with ◂ Back / Next ▸
   and "Part 2 of 5". The room sign always stays. Nothing is removed from the page:
   hidden parts keep their answers and progress, so saving, Gathered Answers and the
   room ✓ work as before. Only on while the grade's layer is on (CFG.root on <html>).
   ?steps=0 turns it off.

   The grade's layer sets window.SS_ONESTEP before loading this file:
     root      class on <html> while the layer is on
     always    parts that stay on screen in every part (the room sign)
     glueNext  starts a part and pulls in what follows (a section badge, the guide's note)
     gluePrev  stays with the part before it (think prompts, the checklist, the next-room door)
     title     where a part's name is read from, for "Next: <name>"
     names     fallbacks: [selector, fixed name or null to use that element's own words]
     word      "Part"
     pad       height of the sticky tab bar, so a new part lands below it */
(function () {
  if (window.__ssOneStep) return; window.__ssOneStep = true;
  if (/[?&]steps=0\b/.test(location.search)) return;
  var C = window.SS_ONESTEP || {}, H = document.documentElement, WORD = C.word || 'Part';
  var KEY = 'oao.ssos.' + location.pathname.split('/').pop();
  var ROOMS = [];

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function is(n, sel) { return !!sel && n.matches(sel); }
  function there(n) { return n.nodeType === 1 && !n.classList.contains('ssos-bar') && getComputedStyle(n).display !== 'none'; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(id, i) { try { var s = load(); s[id] = i; localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function tidy(s) { s = (s || '').replace(/\s+/g, ' ').replace(/^[^A-Za-z]+/, '').trim(); return s.length > 44 ? '' : s; }
  function nameOf(part) {
    var i, j, t;
    for (i = 0; i < part.length; i++) {
      t = C.title && (part[i].matches(C.title) ? part[i] : part[i].querySelector(C.title));
      if (t && tidy(t.textContent)) return tidy(t.textContent);
    }
    for (j = 0; j < (C.names || []).length; j++) for (i = 0; i < part.length; i++) {
      t = part[i].matches(C.names[j][0]) ? part[i] : part[i].querySelector(C.names[j][0]);
      if (t) { var s = C.names[j][1] || tidy(t.textContent); if (s && !C.names[j][1]) s = s.charAt(0) + s.slice(1).toLowerCase(); if (s) return s; }
    }
    return '';
  }

  /* cut a room into parts. A block that is hidden right now (a note that shows later, a video that
     has not loaded) never starts a part: it rides with its neighbour, so it turns up in the right part. */
  function cut(panel) {
    var parts = [], cur = null, pull = false, carry = [];
    [].slice.call(panel.children).forEach(function (k) {
      if (k.nodeType !== 1 || k.classList.contains('ssos-bar') || is(k, C.always)) return;
      if (getComputedStyle(k).display === 'none') { if (cur && !is(k, C.glueNext)) cur.push(k); else carry.push(k); return; }
      var join = cur && (pull || is(k, C.gluePrev));
      if (!join) { cur = []; parts.push(cur); }
      if (carry.length) { [].push.apply(cur, carry); carry = []; }
      cur.push(k);
      pull = is(k, C.glueNext) || (pull && is(k, C.gluePrev));   // a small card between the guide's note and its activity doesn't break them apart
    });
    if (carry.length && cur) [].push.apply(cur, carry);
    return parts;
  }

  function setup(panel) {
    if (panel.getAttribute('data-ssos-room')) return;
    var parts = cut(panel); if (parts.length < 2) return;
    panel.setAttribute('data-ssos-room', '1');
    var bar = el('div', 'ssos-bar'), back = el('button', 'ssos-back', '◂ Back'), dots = el('div', 'ssos-dots'),
        count = el('span', 'ssos-count'), next = el('button', 'ssos-next');
    back.type = next.type = 'button'; bar.setAttribute('role', 'navigation'); bar.setAttribute('aria-label', 'Parts of this page');
    parts.forEach(function () { dots.appendChild(el('span', 'ssos-dot')); });
    bar.appendChild(back); bar.appendChild(dots); bar.appendChild(count); bar.appendChild(next);
    function mark(n, j) { n.classList.add('ssos-part'); n.setAttribute('data-ssos', j); }
    parts.forEach(function (p, j) { p.forEach(function (n) { mark(n, j); }); });
    var R = { panel: panel, parts: parts, at: 0, names: parts.map(nameOf) };
    function seen(n) { return getComputedStyle(n).display !== 'none'; }
    function show(j, move) {
      j = Math.max(0, Math.min(parts.length - 1, j)); R.at = j; save(panel.id, j);
      parts.forEach(function (p, k) { p.forEach(function (n) { n.classList.toggle('ssos-hide', k !== j); }); });
      [].forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k <= j); });
      count.textContent = WORD + ' ' + (j + 1) + ' of ' + parts.length;
      back.style.visibility = j ? 'visible' : 'hidden';
      var last = j === parts.length - 1;
      next.hidden = last; next.textContent = '';
      if (!last) { var h = el('span', 'ssos-hand oao-hand', '👆');   /* oao-hand: the G4 / G5 tap guide sees a hand is already there and adds no second one */ h.setAttribute('aria-hidden', 'true'); next.appendChild(h); next.appendChild(document.createTextNode(R.names[j + 1] ? 'Next: ' + R.names[j + 1] + ' ▸' : 'Next ▸')); }
      /* the bar sits under the part; on the last part it sits above the next-room door */
      var p = parts[j].filter(function (n) { return n.parentNode === panel; }), tail = p[p.length - 1], door = null;
      if (last && C.door) for (var i = p.length - 1; i >= 0; i--) if (is(p[i], C.door)) { door = p[i]; break; }
      if (door) panel.insertBefore(bar, door); else if (tail) panel.insertBefore(bar, tail.nextSibling);
      if (move && H.classList.contains(C.root)) {
        var first = p.filter(seen)[0] || p[0];
        if (first) window.scrollTo(0, Math.max(0, first.getBoundingClientRect().top + window.pageYOffset - (C.pad || 130)));
      }
      try { window.dispatchEvent(new Event('resize')); } catch (e) {}
    }
    R.show = show;
    next.addEventListener('click', function () { show(R.at + 1, true); });
    back.addEventListener('click', function () { show(R.at - 1, true); });
    /* a block the layer adds later (or builds again) joins the part of the block beside it */
    function known(n) { return n && n.hasAttribute && n.hasAttribute('data-ssos') && n.parentNode === panel; }
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1 || n.parentNode !== panel || n === bar || n.hasAttribute('data-ssos') || is(n, C.always)) return;
        var a = n.previousElementSibling, b = n.nextElementSibling;
        while (a && !known(a)) a = a.previousElementSibling;
        while (b && !known(b)) b = b.nextElementSibling;
        var src = (is(n, C.glueNext) && b) || a || b; if (!src) return;
        var j = +src.getAttribute('data-ssos'); parts[j].push(n); mark(n, j); n.classList.toggle('ssos-hide', j !== R.at);
      }); });
    }).observe(panel, { childList: true });
    ROOMS.push(R);
    var s = load()[panel.id]; show(typeof s === 'number' ? s : 0, false);
  }

  /* anything that asks to be scrolled to (a "Show me" button, the guide pointing at something) opens its part first */
  function reveal(n) {
    if (!n || !n.closest || !H.classList.contains(C.root)) return;
    var p = n.closest('.ssos-part.ssos-hide'); if (!p) return;
    ROOMS.forEach(function (R) { if (R.panel === p.parentNode) R.show(+p.getAttribute('data-ssos'), false); });
  }
  var siv = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function () { try { reveal(this); } catch (e) {} return siv.apply(this, arguments); };
  window.__ssSteps = { reveal: reveal, rooms: ROOMS };

  function build() {
    H.classList.add('ssos');
    [].forEach.call(document.querySelectorAll(C.panels || '.tab-panel'), function (p) { try { setup(p); } catch (e) { if (window.console) console.error('ss-onestep', e); } });
  }
  function boot() {
    if (!C.root || !document.querySelector(C.panels || '.tab-panel')) return;
    if (H.classList.contains(C.root)) return build();
    /* the layer is off right now (plain view): cut the page the first time it comes on */
    var mo = new MutationObserver(function () { if (H.classList.contains(C.root)) { mo.disconnect(); setTimeout(build, 50); } });
    mo.observe(H, { attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'complete') setTimeout(boot, 400);
  else window.addEventListener('load', function () { setTimeout(boot, 400); });
})();
