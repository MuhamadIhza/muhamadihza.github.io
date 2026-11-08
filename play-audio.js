/* play-audio.js — Lightweight Web Audio synth for arcade SFX (default muted) */
window.ArcadeAudio = (function () {
  'use strict';
  var ctx = null;
  var isMuted = true;

  function init() {
    if (!ctx) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function setMuted(val) {
    isMuted = !!val;
    if (!isMuted) init();
    return isMuted;
  }

  function toggleMuted() {
    return setMuted(!isMuted);
  }

  function getMuted() {
    return isMuted;
  }

  function tone(freq, type, duration, gainLevel, slideToFreq) {
    if (isMuted) return;
    init();
    if (!ctx) return;
    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var now = ctx.currentTime;
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      if (slideToFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, slideToFreq), now + duration);
      }
      var g = gainLevel || 0.08;
      gain.gain.setValueAtTime(g, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      /* ignore audio context restrictions */
    }
  }

  return {
    setMuted: setMuted,
    toggleMuted: toggleMuted,
    getMuted: getMuted,
    init: init,
    playKey: function () { tone(480, 'sine', 0.04, 0.03); },
    playDelete: function () { tone(260, 'sine', 0.05, 0.03); },
    playFlip: function (idx) { tone(320 + idx * 80, 'triangle', 0.08, 0.05); },
    playShake: function () { tone(140, 'sawtooth', 0.12, 0.05, 80); },
    playWin: function () {
      [523.25, 659.25, 783.99, 1046.50].forEach(function (f, i) {
        setTimeout(function () { tone(f, 'sine', 0.22, 0.06); }, i * 90);
      });
    },
    playLose: function () {
      [360, 320, 280, 220].forEach(function (f, i) {
        setTimeout(function () { tone(f, 'sawtooth', 0.18, 0.04); }, i * 110);
      });
    },
    playJump: function () { tone(220, 'square', 0.14, 0.05, 580); },
    playFlag: function () {
      tone(587, 'sine', 0.08, 0.06);
      setTimeout(function () { tone(880, 'sine', 0.15, 0.07); }, 70);
    },
    playHit: function () { tone(160, 'sawtooth', 0.2, 0.08, 40); },
    playBounce: function (pitch) { tone(200 + (pitch || 0) * 15, 'sine', 0.06, 0.03); }
  };
})();
