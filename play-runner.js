/* play-runner.js — Pixel Arcade Sprint Runner (128x96 logical integer-scaled Canvas) */
window.ArcadeRunner = (function () {
  'use strict';

  var LOGICAL_W = 128;
  var LOGICAL_H = 96;

  /* 24-color locked retro palette */
  var PAL = [
    '#0d1714', '#152520', '#1f3830', '#2a4c41', '#376254', '#467b6a', '#589582', '#6cb19b',
    '#0e6e55', '#4fc8a4', '#79d7bc', '#b1ebd8', '#e2a84f', '#edbe73', '#f5d8a2', '#fbfaf6',
    '#e15241', '#b83226', '#801e16', '#252030', '#413854', '#6a5b8a', '#9886be', '#000000'
  ];

  var canvas, ctx;
  var offCanvas, offCtx;
  var displayScale = 4;

  var state = 'IDLE'; /* IDLE, RUN, JUMP, FALL, HIT */
  var score = 0;
  var flagsCollected = 0;
  var bestScore = 0;

  var player = {
    x: 16,
    y: 64,
    w: 8,
    h: 12,
    vy: 0,
    onGround: true,
    jumpsLeft: 2,
    runFrame: 0,
    animTick: 0
  };

  var GROUND_Y = 76;
  var speed = 1.0;
  var dist = 0;

  /* Pre-allocated entities & particle pool */
  var bugs = [];
  var flags = [];
  var bugSpawnTimer = 80;
  var flagSpawnTimer = 140;

  var PARTICLE_MAX = 64;
  var particles = [];
  for (var i = 0; i < PARTICLE_MAX; i++) {
    particles.push({ active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, color: '#fff' });
  }

  var shakeFrames = 0;
  var shakeMag = 0;

  function spawnParticle(x, y, vx, vy, color, life) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (var i = 0; i < PARTICLE_MAX; i++) {
      var p = particles[i];
      if (!p.active) {
        p.active = true;
        p.x = x;
        p.y = y;
        p.vx = vx;
        p.vy = vy;
        p.color = color;
        p.life = life || 20;
        return;
      }
    }
  }

  function shake(mag, duration) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    shakeMag = mag || 2;
    shakeFrames = duration || 10;
  }

  function jump() {
    if (state === 'IDLE' || state === 'HIT') {
      resetGame();
      state = 'RUN';
      return;
    }
    if (player.jumpsLeft > 0) {
      player.vy = -3.2;
      player.onGround = false;
      player.jumpsLeft--;
      state = 'JUMP';
      if (window.ArcadeAudio) window.ArcadeAudio.playJump();
      for (var i = 0; i < 6; i++) {
        spawnParticle(player.x + 4, player.y + player.h, (Math.random() - 0.5) * 1.5, Math.random() * 0.8, '#79d7bc', 15);
      }
    }
  }

  function resetGame() {
    state = 'RUN';
    score = 0;
    flagsCollected = 0;
    speed = 1.0;
    dist = 0;
    player.x = 16;
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.onGround = true;
    player.jumpsLeft = 2;
    bugs = [];
    flags = [];
    bugSpawnTimer = 90;
    flagSpawnTimer = 150;
    updateUI();
  }

  function update() {
    if (state === 'IDLE') return;

    dist += speed;
    score = Math.floor(dist * 0.1) + (flagsCollected * 25);
    speed = Math.min(2.2, 1.0 + (dist * 0.00015));

    /* Player physics */
    if (!player.onGround) {
      player.vy += 0.22; /* gravity */
      player.y += player.vy;
      if (player.vy > 0) state = 'FALL';
      if (player.y >= GROUND_Y - player.h) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.jumpsLeft = 2;
        state = 'RUN';
        for (var i = 0; i < 4; i++) {
          spawnParticle(player.x + 4, GROUND_Y, (Math.random() - 0.5) * 2, -Math.random() * 0.6, '#6cb19b', 12);
        }
      }
    } else {
      player.animTick++;
      if (player.animTick % 6 === 0) {
        player.runFrame = (player.runFrame + 1) % 4;
      }
    }

    /* Spawn bugs */
    bugSpawnTimer -= speed;
    if (bugSpawnTimer <= 0) {
      bugs.push({ x: LOGICAL_W + 8, y: GROUND_Y - 6, w: 7, h: 6, anim: 0 });
      bugSpawnTimer = Math.floor(Math.random() * 60 + 70);
    }

    /* Spawn flags */
    flagSpawnTimer -= speed;
    if (flagSpawnTimer <= 0) {
      flags.push({ x: LOGICAL_W + 12, y: GROUND_Y - 14 - Math.floor(Math.random() * 16), w: 6, h: 8 });
      flagSpawnTimer = Math.floor(Math.random() * 90 + 110);
    }

    /* Move and collide bugs */
    for (var i = bugs.length - 1; i >= 0; i--) {
      var b = bugs[i];
      b.x -= speed * 1.1;
      b.anim++;
      if (b.x + b.w < 0) {
        bugs.splice(i, 1);
        continue;
      }
      /* Box collision */
      if (player.x + player.w > b.x && player.x < b.x + b.w &&
          player.y + player.h > b.y && player.y < b.y + b.h) {
        state = 'HIT';
        shake(3, 14);
        if (window.ArcadeAudio) window.ArcadeAudio.playHit();
        for (var p = 0; p < 16; p++) {
          spawnParticle(player.x + 4, player.y + 6, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, '#e15241', 25);
        }
        if (score > bestScore) {
          bestScore = score;
          try { localStorage.setItem('dex_runner_best', bestScore); } catch (e) {}
        }
        updateUI();
        break;
      }
    }

    /* Move and collect flags */
    for (var j = flags.length - 1; j >= 0; j--) {
      var fl = flags[j];
      fl.x -= speed;
      if (fl.x + fl.w < 0) {
        flags.splice(j, 1);
        continue;
      }
      if (player.x + player.w > fl.x && player.x < fl.x + fl.w &&
          player.y + player.h > fl.y && player.y < fl.y + fl.h) {
        flagsCollected++;
        flags.splice(j, 1);
        if (window.ArcadeAudio) window.ArcadeAudio.playFlag();
        for (var p = 0; p < 10; p++) {
          spawnParticle(player.x + 4, player.y + 4, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, '#4fc8a4', 20);
        }
        updateUI();
      }
    }

    /* Update particle pool */
    for (var k = 0; k < PARTICLE_MAX; k++) {
      var pt = particles[k];
      if (pt.active) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) pt.active = false;
      }
    }

    updateUI();
  }

  function render() {
    /* 1. Clear offscreen logical canvas */
    offCtx.fillStyle = '#0d1714';
    offCtx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    /* 2. Parallax Skyline (Layer 1 - distant buildings) */
    offCtx.fillStyle = '#152520';
    var skyOffset = Math.floor((dist * 0.15) % 32);
    for (var b = -1; b < 6; b++) {
      var bx = b * 28 - skyOffset;
      var bh = 24 + ((b * 7) % 18);
      offCtx.fillRect(bx, GROUND_Y - bh - 16, 20, bh + 16);
    }

    /* Parallax Servers (Layer 2 - midground racks) */
    offCtx.fillStyle = '#1f3830';
    var midOffset = Math.floor((dist * 0.45) % 24);
    for (var m = -1; m < 7; m++) {
      var mx = m * 22 - midOffset;
      offCtx.fillRect(mx, GROUND_Y - 20, 14, 20);
      /* blinking server led */
      offCtx.fillStyle = ((m + Math.floor(dist * 0.05)) % 3 === 0) ? '#4fc8a4' : '#e2a84f';
      offCtx.fillRect(mx + 3, GROUND_Y - 16, 2, 2);
      offCtx.fillStyle = '#1f3830';
    }

    /* 3. Track Ground */
    offCtx.fillStyle = '#2a4c41';
    offCtx.fillRect(0, GROUND_Y, LOGICAL_W, LOGICAL_H - GROUND_Y);
    offCtx.fillStyle = '#4fc8a4';
    offCtx.fillRect(0, GROUND_Y, LOGICAL_W, 1);
    /* Ground track dashes */
    var trackOffset = Math.floor(dist % 16);
    offCtx.fillStyle = '#376254';
    for (var gx = -trackOffset; gx < LOGICAL_W; gx += 16) {
      offCtx.fillRect(gx, GROUND_Y + 4, 8, 2);
    }

    /* 4. Draw Go-Live Flags */
    for (var f = 0; f < flags.length; f++) {
      var fl = flags[f];
      var fx = Math.round(fl.x);
      var fy = Math.round(fl.y);
      offCtx.fillStyle = '#fbfaf6';
      offCtx.fillRect(fx, fy, 1, 8); /* pole */
      offCtx.fillStyle = '#4fc8a4';
      offCtx.fillRect(fx + 1, fy, 4, 3); /* flag body */
      offCtx.fillStyle = '#e2a84f';
      offCtx.fillRect(fx + 1, fy + 3, 3, 2);
    }

    /* 5. Draw Bugs */
    for (var bg = 0; bg < bugs.length; bg++) {
      var bug = bugs[bg];
      var bx = Math.round(bug.x);
      var by = Math.round(bug.y);
      offCtx.fillStyle = '#e15241';
      offCtx.fillRect(bx + 1, by + 1, 5, 4);
      offCtx.fillStyle = '#fbfaf6';
      offCtx.fillRect(bx + 2, by + 2, 1, 1); /* eye */
      /* Crawling legs */
      offCtx.fillStyle = '#801e16';
      var legStep = (Math.floor(bug.anim / 4) % 2 === 0);
      offCtx.fillRect(bx, by + (legStep ? 4 : 5), 1, 1);
      offCtx.fillRect(bx + 6, by + (legStep ? 5 : 4), 1, 1);
    }

    /* 6. Draw Consultant Sprite */
    var px = Math.round(player.x);
    var py = Math.round(player.y);

    if (state === 'HIT') {
      /* Dead / tumble pose */
      offCtx.fillStyle = '#e2a84f'; /* head */
      offCtx.fillRect(px + 4, py + 8, 4, 4);
      offCtx.fillStyle = '#0e6e55'; /* suit */
      offCtx.fillRect(px, py + 6, 4, 5);
    } else {
      /* Head */
      offCtx.fillStyle = '#f5d8a2';
      offCtx.fillRect(px + 2, py, 4, 4);
      /* Glasses / eye */
      offCtx.fillStyle = '#0d1714';
      offCtx.fillRect(px + 4, py + 1, 2, 1);
      /* Jacket / Tie */
      offCtx.fillStyle = '#0e6e55';
      offCtx.fillRect(px + 1, py + 4, 6, 5);
      offCtx.fillStyle = '#e2a84f'; /* tie */
      offCtx.fillRect(px + 3, py + 5, 1, 3);
      /* Pants & Shoes */
      offCtx.fillStyle = '#152520';
      if (player.onGround) {
        var rf = player.runFrame;
        if (rf === 0 || rf === 2) {
          offCtx.fillRect(px + 2, py + 9, 2, 3);
          offCtx.fillRect(px + 4, py + 9, 2, 3);
        } else if (rf === 1) {
          offCtx.fillRect(px + 1, py + 9, 2, 3);
          offCtx.fillRect(px + 5, py + 8, 2, 2);
        } else {
          offCtx.fillRect(px + 1, py + 8, 2, 2);
          offCtx.fillRect(px + 5, py + 9, 2, 3);
        }
      } else {
        /* Jumping pose */
        offCtx.fillRect(px + 1, py + 9, 2, 2);
        offCtx.fillRect(px + 4, py + 8, 2, 2);
      }
    }

    /* 7. Draw Active Particles */
    for (var p = 0; p < PARTICLE_MAX; p++) {
      var pt = particles[p];
      if (pt.active) {
        offCtx.fillStyle = pt.color;
        offCtx.fillRect(Math.round(pt.x), Math.round(pt.y), 1, 1);
      }
    }

    /* 8. Blit to display canvas with integer scaling + screen shake */
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#0d1714';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var sx = 0, sy = 0;
    if (shakeFrames > 0) {
      shakeFrames--;
      sx = Math.round((Math.random() - 0.5) * shakeMag * displayScale);
      sy = Math.round((Math.random() - 0.5) * shakeMag * displayScale);
    }
    ctx.drawImage(offCanvas, sx, sy, LOGICAL_W * displayScale, LOGICAL_H * displayScale);
  }

  function updateUI() {
    var scoreEl = document.getElementById('runner-score');
    var bestEl = document.getElementById('runner-best');
    var flagsEl = document.getElementById('runner-flags');
    var statusEl = document.getElementById('runner-status');

    if (scoreEl) scoreEl.textContent = String(score).padStart(4, '0');
    if (bestEl) bestEl.textContent = String(bestScore).padStart(4, '0');
    if (flagsEl) flagsEl.textContent = String(flagsCollected);

    if (statusEl) {
      if (state === 'IDLE') statusEl.textContent = 'Press Space or Tap to start sprint.';
      else if (state === 'HIT') statusEl.textContent = 'Bug caught! Final Score: ' + score + '. Tap to retry.';
      else statusEl.textContent = 'Speed: ' + speed.toFixed(1) + 'x · Double jump available!';
    }
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  function init() {
    canvas = document.getElementById('runner-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    offCanvas = document.createElement('canvas');
    offCanvas.width = LOGICAL_W;
    offCanvas.height = LOGICAL_H;
    offCtx = offCanvas.getContext('2d');

    try {
      bestScore = parseInt(localStorage.getItem('dex_runner_best') || '0', 10);
    } catch (e) {}

    displayScale = 4;
    canvas.width = LOGICAL_W * displayScale;
    canvas.height = LOGICAL_H * displayScale;

    var actionBtn = document.getElementById('runner-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        jump();
      });
    }

    var restartBtn = document.getElementById('runner-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        resetGame();
      });
    }

    canvas.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      jump();
    });

    window.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        /* If runner section in viewport */
        var rect = canvas.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          e.preventDefault();
          jump();
        }
      }
    });

    updateUI();
    requestAnimationFrame(loop);
  }

  return {
    init: init,
    jump: jump,
    reset: resetGame
  };
})();
