(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- copy email ---------- */
  var toast = function (m) {
    var el = $('#toast'); el.textContent = m; el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 2200);
  };
  $('#copy').addEventListener('click', function () {
    var txt = $('#email').textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('Email copied'); }, function () { toast('Select the email and press Ctrl+C'); });
    else toast('Select the email and press Ctrl+C');
  });

  if (reduce) { return; }
  document.documentElement.classList.add('js');

  /* ---------- tiny spring engine: motion with mass ---------- */
  var springs = [];
  function Spring(v, k, d) { this.v = v; this.t = v; this.vel = 0; this.k = k || 170; this.d = d || 18; this.on = null; springs.push(this); }
  Spring.prototype.to = function (t) { this.t = t; };
  Spring.prototype.step = function (dt) {
    var a = this.k * (this.t - this.v) - this.d * this.vel;
    this.vel += a * dt; this.v += this.vel * dt;
    if (this.on) this.on(this.v);
  };
  var last = performance.now();
  (function loop(now) {
    var dt = Math.min(0.033, (now - last) / 1000); last = now;
    for (var i = 0; i < springs.length; i++) springs[i].step(dt);
    requestAnimationFrame(loop);
  })(last);

  /* run a one-shot spring 0 -> 1 after delay, calling fn(progress) */
  function play(delay, k, d, fn) {
    var s = new Spring(0, k, d); s.on = fn;
    setTimeout(function () { s.to(1); }, delay);
    return s;
  }

  /* ---------- hero: headline word by word ---------- */
  var h1 = $('#h1');
  (function splitWords(node) {
    var kids = Array.prototype.slice.call(node.childNodes);
    kids.forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          var s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) { splitWords(n); }
    });
  })(h1);
  $$('.w', h1).forEach(function (w, i) {
    play(150 + i * 70, 220, 20, function (p) {
      var q = Math.min(1, Math.max(0, p));
      w.style.opacity = q; w.style.filter = 'blur(' + (6 * (1 - q)) + 'px)';
      w.style.transform = 'translateY(' + (0.7 * (1 - p)) + 'em)';
    });
  });
  $$('[data-in]').forEach(function (el, i) {
    play(500 + i * 120, 160, 17, function (p) {
      el.style.opacity = Math.min(1, Math.max(0, p));
      el.style.transform = 'translateY(' + (18 * (1 - p)) + 'px)';
    });
  });

  /* ---------- hero: blob + photo + chips ---------- */
  var blob = $('#blob'), me = $('#me');
  play(200, 120, 13, function (p) {
    blob.style.opacity = Math.min(1, Math.max(0, p * 1.4));
    blob.style.transform = 'scale(' + (0.6 + 0.4 * p) + ')';
  });
  var photoIn = 0;
  play(450, 90, 11, function (p) { photoIn = p; me.style.opacity = Math.min(1, Math.max(0, p * 1.6)); });
  $$('[data-chip]').forEach(function (c, i) {
    play(1000 + i * 220, 200, 12, function (p) {
      c.style.opacity = Math.min(1, Math.max(0, p));
      c.dataset.p = p;
    });
  });

  /* cursor-follow parallax, springs give it weight */
  var px = new Spring(0, 60, 11), py = new Spring(0, 60, 11);
  if (fine) addEventListener('mousemove', function (e) {
    px.to((e.clientX / innerWidth - .5) * 2); py.to((e.clientY / innerHeight - .5) * 2);
  });
  var scrollY = new Spring(0, 90, 16);
  addEventListener('scroll', function () { scrollY.to(window.scrollY); }, { passive: true });
  var chips = $$('[data-chip]');
  var breathe = 0;
  (function frame(now) {
    breathe = now / 1000;
    var sy = Math.min(scrollY.v, 700);
    me.style.transform = 'translate3d(' + (px.v * 10) + 'px,' + ((1 - photoIn) * 60 + py.v * 5 - sy * 0.04) + 'px,0) rotateY(' + (px.v * 3) + 'deg)';
    var br = 46 + Math.sin(breathe * 0.9) * 4 + px.v * 3;
    blob.style.borderRadius = br + '% ' + (100 - br) + '% 0 0 / ' + (38 + Math.cos(breathe * .7) * 4) + '% 38% 0 0';
    blob.style.translate = (-px.v * 8) + 'px ' + (-sy * 0.02) + 'px';
    chips.forEach(function (c, i) {
      var p = parseFloat(c.dataset.p || 0), f = i ? 1 : -1;
      c.style.transform = 'translate3d(' + (px.v * 18 * f) + 'px,' + ((1 - p) * 24 + Math.sin(breathe * 1.3 + i * 2) * 4 + py.v * 8 * f - sy * 0.06 * (i ? 1.4 : .7)) + 'px,0) scale(' + (0.85 + 0.15 * p) + ')';
    });
    requestAnimationFrame(frame);
  })(performance.now());

  /* ---------- scroll progress + nav that tightens ---------- */
  var bar = $('#progress'), navInner = $('.nav-inner');
  var prog = new Spring(0, 200, 28), navH = new Spring(64, 220, 26);
  prog.on = function (v) { bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, v)) + ')'; };
  navH.on = function (v) { navInner.style.height = v + 'px'; };
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    prog.to(max > 0 ? window.scrollY / max : 0);
    navH.to(window.scrollY > 40 ? 52 : 64);
    litSteps();
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- scroll-driven lifecycle: steps light up as you scroll past ---------- */
  var steps = $$('.steps li'), stepsBox = $('.steps');
  function litSteps() {
    var r = stepsBox.getBoundingClientRect();
    var t = (innerHeight * 0.92 - r.top) / (innerHeight * 0.5);   // 0..1 across the viewport
    var n = Math.floor(Math.max(0, Math.min(1, t)) * (steps.length + 0.99));
    steps.forEach(function (s, i) { s.classList.toggle('lit', i < n); });
  }

  /* ---------- counters tick up with a spring when visible ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(function (el, i) {
        var end = +el.dataset.count; el.textContent = '0';
        play(i * 120, 70, 12, function (p) { el.textContent = Math.round(Math.max(0, end * p)); });
      });
    });
  }, { threshold: .6 });
  $$('.stats > div').forEach(function (d) { io.observe(d); });

  /* ---------- reveal on scroll with spring ---------- */
  var items = $$('.card, .method > div, .tl, .kit > div, .side, .steps li, .orbit');
  items.forEach(function (el) { el.classList.add('reveal'); });
  var io2 = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; io2.unobserve(e.target);
      var el = e.target, base = el.classList.contains('card') ? (items.indexOf(el) % 2) * 90 : 0;
      el.classList.add('in');
      play(base, 150, 18, function (p) {
        el.style.opacity = Math.min(1, Math.max(0, p));
        if (!el.__tilting) el.style.transform = 'translateY(' + (28 * (1 - p)) + 'px)';
      });
    });
  }, { threshold: .12 });
  items.forEach(function (el) { io2.observe(el); });

  /* ---------- magnetic buttons ---------- */
  if (fine) $$('.magnetic').forEach(function (b) {
    var sx = new Spring(0, 220, 15), sy = new Spring(0, 220, 15);
    var apply = function () { b.style.transform = 'translate(' + sx.v + 'px,' + sy.v + 'px)'; };
    sx.on = apply;
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      sx.to((e.clientX - (r.left + r.width / 2)) * .25); sy.to((e.clientY - (r.top + r.height / 2)) * .35);
    });
    b.addEventListener('mouseleave', function () { sx.to(0); sy.to(0); });
  });

  /* ---------- cards tilt toward cursor ---------- */
  if (fine) $$('.card').forEach(function (c) {
    var rx = new Spring(0, 160, 16), ry = new Spring(0, 160, 16), lift = new Spring(0, 160, 16);
    var apply = function () { if (c.__tilting) c.style.transform = 'perspective(800px) rotateX(' + rx.v + 'deg) rotateY(' + ry.v + 'deg) translateY(' + (-lift.v) + 'px)'; };
    rx.on = apply;
    c.addEventListener('mouseenter', function () { c.__tilting = true; lift.to(4); });
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect();
      ry.to(((e.clientX - r.left) / r.width - .5) * 6); rx.to(-((e.clientY - r.top) / r.height - .5) * 6);
    });
    c.addEventListener('mouseleave', function () {
      rx.to(0); ry.to(0); lift.to(0);
      setTimeout(function () { c.__tilting = false; c.style.transform = ''; }, 500);
    });
  });

  onScroll();
})();
