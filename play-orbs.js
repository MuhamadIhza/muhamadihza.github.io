/* play-orbs.js — Interactive Gravity Orbs Physics Playground */
window.ArcadeOrbs = (function () {
  'use strict';

  var canvas, ctx;
  var orbs = [];
  var isZeroG = false;
  var cursor = { x: -1000, y: -1000, isDown: false };
  var MAX_ORBS = 36;
  var COLORS = ['#4fc8a4', '#e2a84f', '#0e6e55', '#79d7bc', '#fbfaf6', '#edbe73'];

  function Orb(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r || (Math.random() * 6 + 6);
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6;
    this.color = color || COLORS[Math.floor(Math.random() * COLORS.length)];
    this.restitution = 0.78;
    this.mass = this.r * 0.2;
  }

  function spawnOrbs(count, originX, originY) {
    var ox = originX !== undefined ? originX : canvas.width / 2;
    var oy = originY !== undefined ? originY : canvas.height / 3;
    for (var i = 0; i < count; i++) {
      if (orbs.length >= MAX_ORBS) orbs.shift();
      var orb = new Orb(
        ox + (Math.random() - 0.5) * 40,
        oy + (Math.random() - 0.5) * 40
      );
      orbs.push(orb);
    }
    updateUI();
  }

  function update() {
    var w = canvas.width;
    var h = canvas.height;
    var gravity = isZeroG ? 0 : 0.28;
    var isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var drag = isReduced ? 0.94 : 0.99;

    for (var i = 0; i < orbs.length; i++) {
      var o = orbs[i];
      o.vy += gravity;
      o.vx *= drag;
      o.vy *= drag;

      /* Cursor attraction/repulsion well */
      if (cursor.x > 0 && cursor.y > 0) {
        var dx = cursor.x - o.x;
        var dy = cursor.y - o.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1 && dist < 160) {
          var force = (160 - dist) / 160;
          var pull = cursor.isDown ? -0.8 : 0.45;
          o.vx += (dx / dist) * force * pull;
          o.vy += (dy / dist) * force * pull;
        }
      }

      o.x += o.vx;
      o.y += o.vy;

      /* Boundary walls with bounce */
      var bounced = false;
      if (o.x - o.r < 0) {
        o.x = o.r;
        o.vx = -o.vx * o.restitution;
        bounced = true;
      } else if (o.x + o.r > w) {
        o.x = w - o.r;
        o.vx = -o.vx * o.restitution;
        bounced = true;
      }

      if (o.y - o.r < 0) {
        o.y = o.r;
        o.vy = -o.vy * o.restitution;
        bounced = true;
      } else if (o.y + o.r > h) {
        o.y = h - o.r;
        o.vy = -o.vy * o.restitution;
        bounced = true;
      }

      if (bounced && Math.abs(o.vx) + Math.abs(o.vy) > 2.5) {
        if (window.ArcadeAudio) window.ArcadeAudio.playBounce(Math.floor(o.r));
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Subtle grid line */
    ctx.strokeStyle = '#152520';
    ctx.lineWidth = 1;
    for (var x = 32; x < canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (var y = 32; y < canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    /* Draw Orbs */
    for (var i = 0; i < orbs.length; i++) {
      var o = orbs[i];
      ctx.save();
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = o.color;
      ctx.shadowColor = o.color;
      ctx.shadowBlur = 8;
      ctx.fill();

      /* Specular highlight dot */
      ctx.beginPath();
      ctx.arc(o.x - o.r * 0.3, o.y - o.r * 0.3, o.r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fill();
      ctx.restore();
    }

    /* Draw cursor ripple if active */
    if (cursor.x > 0 && cursor.y > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, cursor.isDown ? 24 : 14, 0, Math.PI * 2);
      ctx.strokeStyle = cursor.isDown ? '#e2a84f' : '#4fc8a4';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  function updateUI() {
    var countBadge = document.getElementById('orbs-count-badge');
    var gravBtn = document.getElementById('orbs-gravity-btn');
    if (countBadge) countBadge.textContent = orbs.length + ' Orbs';
    if (gravBtn) gravBtn.textContent = isZeroG ? 'Gravity: Zero-G' : 'Gravity: Normal';
  }

  function init() {
    canvas = document.getElementById('orbs-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    canvas.width = 512;
    canvas.height = 320;

    spawnOrbs(20);

    var gravBtn = document.getElementById('orbs-gravity-btn');
    if (gravBtn) {
      gravBtn.addEventListener('click', function () {
        isZeroG = !isZeroG;
        updateUI();
      });
    }

    var spawnBtn = document.getElementById('orbs-spawn-btn');
    if (spawnBtn) {
      spawnBtn.addEventListener('click', function () {
        spawnOrbs(6);
      });
    }

    var clearBtn = document.getElementById('orbs-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        orbs = [];
        spawnOrbs(16);
      });
    }

    /* Pointer interaction */
    function updatePos(e) {
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      cursor.x = (e.clientX - rect.left) * scaleX;
      cursor.y = (e.clientY - rect.top) * scaleY;
    }

    canvas.addEventListener('pointerdown', function (e) {
      cursor.isDown = true;
      updatePos(e);
      spawnOrbs(2, cursor.x, cursor.y);
      if (window.ArcadeAudio) window.ArcadeAudio.playKey();
    });

    window.addEventListener('pointerup', function () {
      cursor.isDown = false;
    });

    canvas.addEventListener('pointermove', function (e) {
      updatePos(e);
    });

    canvas.addEventListener('pointerleave', function () {
      cursor.x = -1000;
      cursor.y = -1000;
      cursor.isDown = false;
    });

    requestAnimationFrame(loop);
  }

  return {
    init: init,
    spawnOrbs: spawnOrbs
  };
})();
