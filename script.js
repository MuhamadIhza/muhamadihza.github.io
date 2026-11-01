(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var smooth = function (a, b, v) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

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

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { document.documentElement.classList.add('static'); return; }

  /* ---------- spring engine: motion with mass ---------- */
  var springs = [];
  function Spring(v, k, d) { this.v = v; this.t = v; this.vel = 0; this.k = k; this.d = d; springs.push(this); }
  Spring.prototype.to = function (t) { this.t = t; };

  /* ---------- layout metrics ---------- */
  var vh = innerHeight, vw = innerWidth;
  var hero = $('#hero'), journey = $('#journey'), band = $('#industries'), product = $('#product');
  var sec = { hero: hero, journey: journey, band: band, product: product, exp: $('#experience') };
  function top(el) { return el.getBoundingClientRect().top + scrollY; }
  function prog(el) {                                   // 0..1 across a pinned section
    var t = top(el), h = el.offsetHeight - vh;
    return h > 0 ? clamp((ys.v - t) / h, 0, 1) : 0;
  }

  var ys = new Spring(scrollY, 90, 19);                 // smoothed scroll
  var isMobile = function () { return vw < 760; };

  /* ---------- THREE: one real 3D object, tied to scroll ---------- */
  var gl = null;
  var canvas = $('#gl');
  try {
    if (window.THREE) {
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      var scene = new THREE.Scene();
      var cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      cam.position.set(0, 0, 14);
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      var dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(4, 6, 8); scene.add(dl);
      var fl = new THREE.DirectionalLight(0x4fc8a4, 0.5); fl.position.set(-6, -3, 4); scene.add(fl);

      var group = new THREE.Group(); scene.add(group);
      var COLORS = [0x0e6e55, 0x0f1a16, 0xffffff, 0xe2a84f, 0x4fc8a4, 0x16805f];
      var DEPTH = [0.5, 0.9, 0.6, 0.8, 0.5, 1.0];
      var rnd = (function (s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })(7);
      var tiles = [];
      for (var i = 0; i < 6; i++) {
        var col = i % 3, row = Math.floor(i / 3);
        var g = new THREE.Group();
        var mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: COLORS[i], roughness: 0.5, metalness: 0.05 }));
        var edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), new THREE.LineBasicMaterial({ color: 0x0f1a16, transparent: true, opacity: 0.3 }));
        mesh.add(edges);
        g.add(mesh);
        var barMat = new THREE.MeshBasicMaterial({ color: (i === 2 || i === 4 || i === 3) ? 0x0f1a16 : 0xf4f2ec, transparent: true, opacity: 0.85 });
        var bar1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), barMat), bar2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), barMat);
        g.add(bar1); g.add(bar2);
        group.add(g);
        tiles.push({
          g: g, mesh: mesh, b1: bar1, b2: bar2,
          wall: new THREE.Vector3((col - 1) * 1.3, row === 0 ? 0.6 : -0.6, (DEPTH[i] - 1) / 2),
          wd: [1.22, 1.1, DEPTH[i]],
          stairD: [1.0, 0.7 + 0.45 * i, 1.0],
          stair: new THREE.Vector3((i - 2.5) * 1.25, -1.5 + (0.7 + 0.45 * i) / 2, 0),
          scat: new THREE.Vector3((rnd() - .5) * 5.2, (rnd() - .5) * 3.6, (rnd() - .9) * 3.4),
          srot: new THREE.Vector3((rnd() - .5) * 3.2, (rnd() - .5) * 3.2, (rnd() - .5) * 2.4),
          a: new Spring(1, 110, 9)
        });
      }
      gl = true;
    }
  } catch (e) { gl = null; if (canvas) canvas.style.display = 'none'; }

  var sx = new Spring(0, 55, 13), sy = new Spring(0, 55, 13), ss = new Spring(0, 60, 13), sst = new Spring(0, 70, 14);
  var mx = new Spring(0, 40, 10), my = new Spring(0, 40, 10);
  addEventListener('mousemove', function (e) { mx.to((e.clientX / vw - .5) * 2); my.to((e.clientY / vh - .5) * 2); });

  function resize() {
    vh = innerHeight; vw = innerWidth;
    if (gl) { renderer.setSize(vw, vh, false); cam.aspect = vw / vh; cam.updateProjectionMatrix(); }
  }
  addEventListener('resize', resize); resize();

  /* ---------- DOM drivers ---------- */
  var scene3d = $('.scene'), heroMeta = $('#heroMeta'), cue = $('#cue'), flood = $('#flood');
  var bar = $('#progress');
  var jItems = $$('#jSteps li'), jNum = $('#jNum');
  var slides = $$('.slide'), pTrack = $('#pTrack'), pDots = $$('#pDots i');
  var lastJ = -1, activeSlide = -1;

  function counter(slide) {
    var el = $('[data-val]', slide); if (!el) return;
    var end = +el.dataset.val, pre = el.dataset.pre, suf = el.dataset.suf;
    var s = new Spring(0, 60, 10); s.to(1);
    var stop = setInterval(function () {
      el.textContent = pre + Math.round(Math.max(0, end * s.v)) + suf;
      if (Math.abs(s.v - 1) < .003 && Math.abs(s.vel) < .01) { el.textContent = pre + end + suf; clearInterval(stop); var ix = springs.indexOf(s); if (ix > -1) springs.splice(ix, 1); }
    }, 16);
    s.on = true;
  }

  var last = performance.now();
  var t0 = last;
  function frame(now) {
    var dt = Math.min(0.033, (now - last) / 1000); last = now;
    ys.t = scrollY;
    for (var i = 0; i < springs.length; i++) {
      var s = springs[i], a = s.k * (s.t - s.v) - s.d * s.vel;
      s.vel += a * dt; s.v += s.vel * dt;
    }

    var hp = prog(hero), jp = prog(journey), pp = prog(product);
    var mid = ys.v + vh * 0.5;
    var jTop = top(journey), bTop = top(band), pTop = top(product), eTop = top(sec.exp);

    /* progress bar */
    var maxS = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + clamp(ys.v / maxS, 0, 1) + ')';

    /* hero: layers lift into 3D, labelled, then snap back */
    var e = smooth(.06, .34, hp) * (1 - smooth(.52, .70, hp));
    scene3d.style.setProperty('--e', e.toFixed(4));
    var metaO = 1 - smooth(.01, .12, hp);
    heroMeta.style.opacity = metaO; heroMeta.style.pointerEvents = metaO < .3 ? 'none' : '';
    cue.style.opacity = metaO;
    /* flood: the 3D object zooms at the camera and the screen turns green */
    var fr = smooth(.70, .96, hp);
    var floodOn = ys.v < jTop;
    flood.style.display = floodOn ? 'block' : 'none';
    flood.style.clipPath = 'circle(' + (fr * 150).toFixed(2) + '% at 50% 50%)';

    /* journey: stage index from scroll */
    var si = clamp(Math.floor(clamp((jp - .015) / .97, 0, .999) * 6), 0, 5);
    if (si !== lastJ) {
      lastJ = si;
      jItems.forEach(function (li, k) { li.classList.toggle('on', k === si); });
      jNum.textContent = '0' + (si + 1);
    }

    /* product: horizontal slides driven by scroll */
    var f0 = pp * 3, fi = Math.min(2, Math.floor(f0)), f = fi + smooth(.3, .7, f0 - fi) ; if (f0 >= 3) f = 3;
    pTrack.style.transform = 'translate3d(' + (-f * 25) + '%,0,0)';
    slides.forEach(function (sl, k) { sl.style.opacity = clamp(1 - Math.abs(k - f) * 1.15, .12, 1); });
    var ai = Math.round(f);
    if (ai !== activeSlide) {
      activeSlide = ai;
      pDots.forEach(function (d, k) { d.classList.toggle('on', k === ai); });
      slides.forEach(function (sl, k) { sl.classList.toggle('on', k === ai); });
      counter(slides[ai]);
    }

    /* ---------- 3D object state ---------- */
    if (gl) {
      var section = 'hero';
      if (mid >= jTop) section = 'journey';
      if (mid >= bTop) section = 'band';
      if (mid >= pTop) section = 'product';
      if (mid >= eTop) section = 'rest';

      var halfH = Math.tan(cam.fov * Math.PI / 360) * cam.position.z, halfW = halfH * cam.aspect;
      var mob = isMobile();
      var fit = function (frac) { return Math.min(frac * 2 * halfW / 3.9, .56 * 2 * halfH / 2.4); };
      var T;
      if (section === 'hero') T = mob ? { x: .1, y: .1, s: fit(.62) } : { x: .5, y: -.2, s: fit(.27) };
      else if (section === 'journey') T = mob ? { x: 0, y: -.5, s: fit(.78) } : { x: .5, y: 0, s: fit(.44) };
      else if (section === 'product') T = mob ? { x: 0, y: -.64, s: fit(.44) } : { x: -.56, y: -.5, s: fit(.2) };
      else T = { x: 0, y: 0, s: 0 };

      var zoom = 1 + 7.5 * smooth(.74, .97, hp);
      if (section !== 'hero') zoom = 1;
      sx.to(T.x); sy.to(T.y); ss.to(T.s);
      sst.to(section === 'product' ? 1 : 0);

      /* tiles: assembled in hero & after the journey; one by one during it */
      var s6 = lastJ;
      tiles.forEach(function (tl, k) {
        var target = 1;
        if (section === 'journey' || (section === 'hero' && hp > .78)) target = k <= s6 ? 1 : 0;
        tl.a.to(target);
      });

      group.visible = ss.v > 0.03;
      if (group.visible) {
        var sc = Math.max(0, ss.v) * zoom;
        group.scale.setScalar(sc);
        group.position.set(sx.v * halfW, sy.v * halfH, 0);
        var tt = (now - t0) / 1000;
        group.rotation.y = Math.sin(tt * .5) * .3 + mx.v * .3 + (section === 'journey' ? (jp - .5) * .9 : 0);
        group.rotation.x = -.12 + my.v * .15 + Math.cos(tt * .4) * .05;
        var st = sst.v;
        tiles.forEach(function (tl) {
          var a = tl.a.v;
          var w = lerp(tl.wd[0], tl.stairD[0], st), h = lerp(tl.wd[1], tl.stairD[1], st), d = lerp(tl.wd[2], tl.stairD[2], st);
          var px = lerp(tl.wall.x, tl.stair.x, st), py = lerp(tl.wall.y, tl.stair.y, st), pz = lerp(tl.wall.z, tl.stair.z, st);
          tl.g.position.set(lerp(tl.scat.x, px, a), lerp(tl.scat.y, py, a), lerp(tl.scat.z, pz, a));
          var r = 1 - a;
          tl.g.rotation.set(tl.srot.x * r, tl.srot.y * r, tl.srot.z * r);
          tl.mesh.scale.set(w, h, d);
          var bw = Math.min(.62 * w, 1.1);
          tl.b1.position.set(-w / 2 + .14 + bw / 2, h / 2 - .17, d / 2 + .003); tl.b1.scale.set(bw, .07, 1);
          tl.b2.position.set(-w / 2 + .14 + bw * .3, h / 2 - .31, d / 2 + .003); tl.b2.scale.set(bw * .6, .05, 1);
        });
        renderer.render(scene, cam);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
