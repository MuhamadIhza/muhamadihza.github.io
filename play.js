/* play.js — Arcade orchestrator: initializes audio, Wordle, Runner, and Orbs */
(function () {
  'use strict';

  /* 1. FPS Monitor for header live badge */
  var fpsBadge = document.getElementById('fps-badge');
  var frameCount = 0;
  var lastFpsTime = performance.now();

  function fpsTick(now) {
    frameCount++;
    if (now - lastFpsTime >= 1000) {
      var currentFps = Math.round((frameCount * 1000) / (now - lastFpsTime));
      if (fpsBadge) {
        fpsBadge.textContent = currentFps + ' FPS · Canvas 2D';
      }
      frameCount = 0;
      lastFpsTime = now;
    }
    requestAnimationFrame(fpsTick);
  }
  requestAnimationFrame(fpsTick);

  /* 2. Web Audio Sound Toggle Button */
  var soundToggleBtn = document.getElementById('sound-toggle');
  var soundLabel = document.getElementById('sound-label');

  if (soundToggleBtn && window.ArcadeAudio) {
    soundToggleBtn.addEventListener('click', function () {
      var isMuted = window.ArcadeAudio.toggleMuted();
      soundToggleBtn.setAttribute('aria-pressed', (!isMuted).toString());
      if (soundLabel) {
        soundLabel.textContent = isMuted ? 'Sound: Off' : 'Sound: On';
      }
      if (!isMuted) {
        window.ArcadeAudio.playWin();
      }
    });
  }

  /* 3. Initialize all sub-modules when DOM is ready */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.ArcadeWordle) window.ArcadeWordle.init();
    if (window.ArcadeRunner) window.ArcadeRunner.init();
    if (window.ArcadeOrbs) window.ArcadeOrbs.init();
  });

  /* Fallback if DOMContentLoaded already fired */
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    if (window.ArcadeWordle) window.ArcadeWordle.init();
    if (window.ArcadeRunner) window.ArcadeRunner.init();
    if (window.ArcadeOrbs) window.ArcadeOrbs.init();
  }
})();
