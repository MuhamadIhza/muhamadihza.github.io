/* play.js — two small exercises. Vanilla, no dependencies. */
(function () {
  'use strict';

  var mq = matchMedia('(prefers-reduced-motion: reduce)');
  function reduce() { return mq.matches; }
  function $(id) { return document.getElementById(id); }

  /* ---------- tiny spring engine (rAF, only runs while something moves) ---------- */
  var springs = [], raf = 0, last = 0;
  function Spring(v) { this.v = v; this.t = v; this.vel = 0; springs.push(this); }
  var K = 320, D = 26, M = 1; // spec: stiffness 320, damping 26, mass 1
  function tick(now) {
    var dt = Math.min((now - last) / 1000, 1 / 30); last = now;
    var moving = false, i, s, n, a;
    for (i = 0; i < springs.length; i++) {
      s = springs[i];
      for (n = 0; n < 2; n++) { // 2 substeps for stability
        a = (K * (s.t - s.v) - D * s.vel) / M;
        s.vel += a * dt / 2; s.v += s.vel * dt / 2;
      }
      if (Math.abs(s.t - s.v) > 0.01 || Math.abs(s.vel) > 0.05) moving = true;
      else { s.v = s.t; s.vel = 0; }
    }
    paintAll();
    raf = moving ? requestAnimationFrame(tick) : 0;
  }
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function go(s, t, instant, vel) {
    s.t = t;
    if (instant || reduce()) { s.v = t; s.vel = 0; paintAll(); return; }
    if (vel) s.vel = vel;
    kick();
  }
  var painters = [];
  function paintAll() { for (var i = 0; i < painters.length; i++) painters[i](); }

  /* ================= 1. FIT-GAP SORTER ================= */
  var CARDS = [
    { req: 'Purchase orders above Rp50M need manager approval', ans: 'standard', why: 'Approval rules are built in.' },
    { req: 'Invoice shows each branch’s logo', ans: 'standard', why: 'A report template change, not code.' },
    { req: 'Sales commission in custom tiers by product line', ans: 'custom', why: 'No built-in rule fits. Worth it only if the tiers drive revenue.' },
    { req: 'Rename the ‘Customer’ field to ‘Partner’', ans: 'standard', why: 'A label rename, no code.' },
    { req: 'Sync stock to a marketplace every 5 minutes', ans: 'custom', why: 'Needs an integration. Cost it before you commit.' },
    { req: 'Margin report per project', ans: 'standard', why: 'Analytic accounts cover it.' }
  ];
  var fg = {
    card: $('fg-card'), stage: $('fg-stage'), req: $('fg-req'), count: $('fg-count'),
    zones: $('fg-zones'), fb: $('fg-feedback'), game: $('fg-game'), result: $('fg-result'), score: $('fg-score')
  };
  var zoneBtns = fg.zones.querySelectorAll('.zone');
  var sx = new Spring(0), sy = new Spring(0), sr = new Spring(0), ss = new Spring(1);
  var st = { i: 0, tries: 0, score: 0, locked: false, drag: null };

  painters.push(function () {
    fg.card.style.transform = 'translate3d(' + sx.v.toFixed(2) + 'px,' + sy.v.toFixed(2) + 'px,0) rotate(' + sr.v.toFixed(2) + 'deg) scale(' + ss.v.toFixed(3) + ')';
  });

  function resetSprings() { go(sx, 0, true); go(sy, 0, true); go(sr, 0, true); go(ss, 1, true); }
  function setHot(side) { zoneBtns.forEach(function (z) { z.classList.toggle('hot', z.dataset.pick === side); }); }
  function enableZones(on) { zoneBtns.forEach(function (z) { z.disabled = !on; }); }

  function showCard() {
    var c = CARDS[st.i];
    st.tries = 0; st.locked = false;
    fg.req.textContent = c.req;
    fg.count.textContent = (st.i + 1) + ' / ' + CARDS.length;
    fg.fb.innerHTML = '';
    fg.card.classList.remove('right', 'hidden', 'done', 'dragging', 'enter');
    resetSprings(); setHot(null); enableZones(true);
    void fg.card.offsetWidth; fg.card.classList.add('enter');
    fg.card.setAttribute('aria-label', 'Requirement ' + (st.i + 1) + ' of ' + CARDS.length + ': ' + c.req);
  }

  function chip(cls, text) { var s = document.createElement('span'); s.className = 'chip ' + cls; s.textContent = text; return s; }

  function feedback(ok, c, final) {
    fg.fb.innerHTML = '';
    fg.fb.appendChild(chip(ok ? 'ok' : 'no', ok ? (c.ans === 'standard' ? 'Fits Standard' : 'Needs custom') : 'Not quite'));
    var p = document.createElement('p'); p.className = 'why';
    p.textContent = c.why + (!ok && !final ? ' Try once more.' : '');
    fg.fb.appendChild(p);
    if (final) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn primary';
      b.textContent = st.i === CARDS.length - 1 ? 'See result' : 'Next';
      b.addEventListener('click', next);
      fg.fb.appendChild(b); b.focus({ preventScroll: true });
    }
  }

  function flyTo(side, ok) {
    // land in the centre of the chosen zone: zone centres sit at 1/4 and 3/4 of the stage width
    var sRect = fg.stage.getBoundingClientRect();
    var zRect = fg.zones.querySelector('[data-pick="' + side + '"]').getBoundingClientRect();
    go(sx, (zRect.left + zRect.width / 2) - (sRect.left + sRect.width / 2), false);
    go(sy, (zRect.top + zRect.height / 2) - (sRect.top + sRect.height / 2), false);
    go(sr, 0, false); go(ss, 0.3, false);
    fg.card.classList.add('done');
    if (ok) fg.card.classList.add('right');
    setTimeout(function () { fg.card.classList.add('hidden'); }, reduce() ? 0 : 380);
  }

  function answer(pick) {
    if (st.locked) return;
    var c = CARDS[st.i], ok = pick === c.ans;
    st.tries++;
    setHot(null);
    if (ok) {
      if (st.tries === 1) st.score++;
      st.locked = true; enableZones(false);
      flyTo(pick, true); feedback(true, c, true);
    } else if (st.tries === 1) {
      // spring back with a small wobble, one more try
      var dir = pick === 'standard' ? -1 : 1;
      go(sx, 0, false, dir * 700); go(sy, 0, false); go(sr, 0, false, dir * 60); go(ss, 1, false);
      feedback(false, c, false);
    } else {
      st.locked = true; enableZones(false);
      flyTo(c.ans, false); feedback(false, c, true);
      // show the right answer in the chip text too
      var extra = chip('ok', c.ans === 'standard' ? 'Fits Standard' : 'Needs custom');
      fg.fb.insertBefore(extra, fg.fb.firstChild.nextSibling);
    }
  }

  function next() {
    st.i++;
    if (st.i >= CARDS.length) {
      fg.game.hidden = true; fg.result.hidden = false;
      fg.score.textContent = st.score + '/' + CARDS.length;
      $('fg-again').focus({ preventScroll: true });
      return;
    }
    showCard(); fg.card.focus({ preventScroll: true });
  }

  function restartFg() {
    st.i = 0; st.score = 0;
    fg.result.hidden = true; fg.game.hidden = false;
    showCard(); fg.card.focus({ preventScroll: true });
  }

  // pointer drag (mouse + touch). touch-action:none lives on the card only.
  fg.card.addEventListener('pointerdown', function (e) {
    if (st.locked || (e.pointerType === 'mouse' && e.button !== 0)) return;
    st.drag = { x: e.clientX, y: e.clientY, id: e.pointerId };
    try { fg.card.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
    fg.card.classList.add('dragging');
    go(ss, 1.03, false);
  });
  fg.card.addEventListener('pointermove', function (e) {
    var d = st.drag; if (!d || e.pointerId !== d.id) return;
    var dx = e.clientX - d.x, dy = e.clientY - d.y, w = fg.stage.clientWidth;
    go(sx, dx, true); go(sy, dy * 0.4, true);
    go(sr, Math.max(-6, Math.min(6, dx / w * 12)), true);
    setHot(Math.abs(dx) > w * 0.22 ? (dx < 0 ? 'standard' : 'custom') : null);
  });
  function endDrag(e) {
    var d = st.drag; if (!d || e.pointerId !== d.id) return;
    st.drag = null; fg.card.classList.remove('dragging');
    var dx = sx.v, w = fg.stage.clientWidth;
    if (e.type === 'pointerup' && Math.abs(dx) > w * 0.25) answer(dx < 0 ? 'standard' : 'custom');
    else { setHot(null); go(sx, 0, false); go(sy, 0, false); go(sr, 0, false); go(ss, 1, false); }
  }
  fg.card.addEventListener('pointerup', endDrag);
  fg.card.addEventListener('pointercancel', endDrag);

  // keyboard + buttons (tap works on small phones)
  fg.card.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); answer('standard'); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); answer('custom'); }
  });
  zoneBtns.forEach(function (z) { z.addEventListener('click', function () { answer(z.dataset.pick); }); });
  $('fg-again').addEventListener('click', restartFg);
  showCard();

  /* ================= 2. UAT BUG-CATCHER ================= */
  var BUGS = [
    { id: 'total', label: 'Total ≠ sum of lines' },
    { id: 'ddate', label: 'Delivery date before order date' },
    { id: 'discount', label: 'Discount is 120%' },
    { id: 'status', label: 'Status Done, Confirm still active' },
    { id: 'tax', label: 'Tax is empty' }
  ];
  var DURATION = 30000;
  var form = $('uat-form'), bar = $('uat-bar'), timeEl = $('uat-time'), countEl = $('uat-found-count');
  var statusEl = $('uat-status'), foundEl = $('uat-found'), resultEl = $('uat-result');
  var btnStart = $('uat-start'), btnNo = $('uat-notimer'), btnFinish = $('uat-finish');
  var u = { running: false, timed: true, caught: {}, appeared: {}, timeouts: [], t0: 0, raf: 0, lastSec: -1 };

  function el(id) { return form.querySelector('[data-id="' + id + '"]'); }
  function chks() { return form.querySelectorAll('.chk'); }
  function countCaught() { return Object.keys(u.caught).length; }

  function setBad(id, on) {
    var b = el(id);
    if (id === 'status') {
      var c = $('uat-confirm'); if (c) c.classList.toggle('off', !on);
    } else {
      var v = b.querySelector('[data-good]');
      if (v) v.textContent = on ? v.dataset.bad : v.dataset.good;
    }
  }
  function resetForm() {
    chks().forEach(function (b) { b.classList.remove('shown', 'caught', 'missed', 'shake'); b.disabled = true; });
    BUGS.forEach(function (b) { setBad(b.id, false); });
  }
  function appear(id) {
    u.appeared[id] = true; setBad(id, true);
    var b = el(id); b.classList.remove('shown'); void b.offsetWidth; b.classList.add('shown');
  }
  function updateTimer(now) {
    var left = Math.max(0, DURATION - (now - u.t0));
    var sec = Math.ceil(left / 1000);
    if (!reduce() || sec !== u.lastSec) {
      bar.style.transform = 'scaleX(' + (left / DURATION).toFixed(4) + ')';
      if (sec !== u.lastSec) timeEl.textContent = sec + 's';
      u.lastSec = sec;
    }
    if (left <= 0) { finish(); return; }
    u.raf = requestAnimationFrame(updateTimer);
  }

  function start(timed) {
    resetForm(); resetUat();
    u.running = true; u.timed = timed; u.t0 = performance.now(); u.lastSec = -1;
    chks().forEach(function (b) { b.disabled = false; });
    btnStart.hidden = btnNo.hidden = true; btnFinish.hidden = false;
    resultEl.hidden = true;
    statusEl.textContent = 'Tap the field that looks wrong.';
    countEl.textContent = '0 / 5 found';
    var order = BUGS.map(function (b) { return b.id; });
    for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = order[i]; order[i] = order[j]; order[j] = t; }
    order.forEach(function (id, i) {
      var at = timed ? 1500 + i * 4200 + Math.random() * 2400 : 1200 + i * 3000 + Math.random() * 1500;
      u.timeouts.push(setTimeout(function () { if (u.running) appear(id); }, at));
    });
    if (timed) { u.raf = requestAnimationFrame(updateTimer); }
    else { timeEl.textContent = 'No timer'; bar.style.transform = 'scaleX(1)'; }
  }

  function resetUat() {
    u.timeouts.forEach(clearTimeout); u.timeouts = [];
    cancelAnimationFrame(u.raf);
    u.caught = {}; u.appeared = {}; foundEl.innerHTML = '';
  }

  function finish() {
    if (!u.running) return;
    u.running = false; resetUatTimers();
    var n = countCaught();
    chks().forEach(function (b) { b.disabled = true; });
    BUGS.forEach(function (b) {
      if (u.caught[b.id]) return;
      setBad(b.id, true); el(b.id).classList.add('missed');
      var li = document.createElement('li'); li.className = 'miss'; li.textContent = 'Missed: ' + b.label;
      foundEl.appendChild(li);
    });
    btnFinish.hidden = true;
    $('uat-score').textContent = n + '/5';
    $('uat-msg').textContent = 'Found ' + n + ' of 5. Good UAT finds it before go-live, not after.';
    resultEl.hidden = false; statusEl.textContent = '';
    $('uat-again').focus({ preventScroll: true });
  }
  function resetUatTimers() { u.timeouts.forEach(clearTimeout); u.timeouts = []; cancelAnimationFrame(u.raf); }

  form.addEventListener('click', function (e) {
    var b = e.target.closest('.chk'); if (!b || !u.running) return;
    var id = b.dataset.id;
    if (u.caught[id]) return;
    if (u.appeared[id]) {
      u.caught[id] = true;
      b.classList.remove('shown'); b.classList.add('caught');
      var bug = BUGS.filter(function (x) { return x.id === id; })[0];
      var li = document.createElement('li'); li.textContent = 'Found: ' + bug.label;
      foundEl.appendChild(li);
      countEl.textContent = countCaught() + ' / 5 found';
      statusEl.textContent = 'Found one.';
      if (countCaught() === BUGS.length) finish();
    } else {
      statusEl.textContent = 'Not a bug.';
      if (!reduce()) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
    }
  });
  btnStart.addEventListener('click', function () { start(true); });
  btnNo.addEventListener('click', function () { start(false); });
  btnFinish.addEventListener('click', finish);
  $('uat-again').addEventListener('click', function () {
    resetUat(); resetForm();
    resultEl.hidden = true; btnStart.hidden = btnNo.hidden = false; btnFinish.hidden = true;
    bar.style.transform = 'scaleX(1)'; timeEl.textContent = '30s'; countEl.textContent = '0 / 5 found';
    statusEl.textContent = 'Press Start. Bugs show up while the clock runs.';
    btnStart.focus({ preventScroll: true });
  });
  resetForm();
})();
