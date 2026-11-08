/* play-wordle.js — 5-Letter Word Puzzle module */
window.ArcadeWordle = (function () {
  'use strict';

  var WORDS = [
    /* 70% punchy general words */
    'APPLE','BEACH','BRAVE','CLOUD','DREAM','EARTH','FLAME','GRACE','HEART','LIGHT',
    'MAGIC','NIGHT','OCEAN','PEACE','PLANT','PRIDE','RIVER','SHINE','SMILE','SPACE',
    'SPARK','STORM','TRACK','VOICE','WATER','WORLD','YOUTH','BLOOM','CANDY','DANCE',
    'FLASH','FOCUS','GHOST','HONEY','LUCKY','MANGO','PIZZA','PULSE','QUEST','ROBOT',
    'SHARP','SOLAR','SUGAR','TIGER','VIVID','WHEAT','ZEBRA','AMBER','BLAZE','CHILL',
    /* 30% work, ERP, and ops terms */
    'AUDIT','STOCK','QUOTE','SCOPE','BATCH','LEDGE','ORDER','ASSET','ROUTE','FLOAT',
    'PATCH','DRAFT','CYCLE','ENTRY','INBOX','INDEX','PHASE','QUERY','SCALE','SHARE',
    'SHIFT','STAKE','TABLE','TOKEN','TRACE','VALUE','YIELD','MERGE','STAGE','SPRINT'
  ];

  var VALID_EXTRAS = [
    'ABOUT','ABOVE','ACTOR','ACUTE','ADMIT','ADOPT','ADULT','AFTER','AGAIN','AGENT',
    'AGREE','AHEAD','ALARM','ALBUM','ALERT','ALIKE','ALIVE','ALLOW','ALONE','ALONG',
    'ALTER','AMONG','ANGER','ANGLE','ANGRY','APART','APPLY','ARENA','ARGUE','ARISE',
    'ARRAY','ASIDE','AVOID','AWAIT','AWAKE','AWARD','AWARE','BADLY','BAKER','BASIC',
    'BASIS','BEAST','BEGIN','BEING','BELOW','BENCH','BIRTH','BLACK','BLAME','BLANK',
    'BLIND','BLOCK','BOARD','BOOST','BOOTH','BOUND','BRAIN','BRAND','BREAD','BREAK',
    'BRIEF','BRING','BROAD','BROWN','BUILD','BUYER','CABLE','CALIF','CARRY','CATCH',
    'CAUSE','CHAIN','CHAIR','CHART','CHASE','CHEAP','CHECK','CHEST','CHIEF','CHILD',
    'CIVIL','CLAIM','CLASS','CLEAN','CLEAR','CLIMB','CLOCK','CLOSE','COACH','COAST',
    'COUNT','COURT','COVER','CRAFT','CRASH','CREAM','CRIME','CROSS','CROWD','CROWN',
    'CURVE','DAILY','DEALER','DEBUT','DELAY','DEPTH','DOING','DOUBT','DOZEN','DRAWN',
    'DRESS','DRILL','DRINK','DRIVE','DROVE','DYING','EAGER','EARLY','EIGHT','ELITE',
    'EMPTY','ENEMY','ENJOY','ENTER','EQUAL','ERROR','EVENT','EVERY','EXACT','EXIST',
    'EXTRA','FAITH','FALSE','FAULT','FIBER','FIELD','FIFTH','FIFTY','FIGHT','FINAL',
    'FIRST','FIXED','FLOOR','FLUID','FORCE','FORTH','FORTY','FORUM','FOUND','FRAME',
    'FRESH','FRONT','FRUIT','FULLY','FUNNY','GIANT','GIVEN','GLASS','GLOBE','GOING',
    'GRADE','GRAND','GRANT','GRASS','GREAT','GREEN','GROSS','GROUP','GROWN','GUARD',
    'GUESS','GUEST','GUIDE','HAPPY','HARRY','HEAVY','HENCE','HORSE','HOTEL','HOUSE',
    'HUMAN','IDEAL','IMAGE','IMPLY','INNER','INPUT','ISSUE','JAPAN','JOINT','JUDGE',
    'JUICE','KNOWN','LABEL','LARGE','LASER','LATER','LAUGH','LAYER','LEARN','LEASE',
    'LEAST','LEAVE','LEGAL','LEVEL','LIMIT','LOCAL','LOGIC','LOOSE','LOWER','LUNCH',
    'MAJOR','MAKER','MARCH','MATCH','MAYBE','MAYOR','MEANT','MEDIA','METAL','MIGHT',
    'MINOR','MINUS','MIXED','MODEL','MONEY','MONTH','MORAL','MOTOR','MOUNT','MOUSE',
    'MOUTH','MOVIE','MUSIC','NEEDS','NEVER','NEWLY','NOBLE','NOISE','NORTH','NOTED',
    'NOVEL','NURSE','OCCUR','OFFER','OFTEN','ORDER','OTHER','OUGHT','PAINT','PANEL',
    'PAPER','PARTY','PATIO','PENAL','PENCE','PERIL','PHONE','PHOTO','PIECE','PILOT',
    'PITCH','PLACE','PLAIN','PLANE','PLATE','POINT','POUND','POWER','PRESS','PRICE',
    'PRIME','PRIOR','PRIZE','PROOF','PROUD','PROVE','QUEEN','QUICK','QUIET','QUITE',
    'RADIO','RAISE','RANGE','RAPID','RATIO','REACH','READY','REFER','RIGHT','RIVAL',
    'ROUND','ROYAL','RURAL','SALES','SCALE','SCENE','SCOPE','SCORE','SENSE','SERVE',
    'SEVEN','SHALL','SHAPE','SHARE','SHARP','SHEET','SHELF','SHELL','SHIFT','SHIRT',
    'SHOCK','SHOOT','SHORT','SHOWN','SIGHT','SINCE','SIXTH','SIXTY','SIZED','SKILL',
    'SLEEP','SLIDE','SMALL','SMART','SOLID','SOLVE','SORRY','SOUND','SOUTH','SPACE',
    'SPARE','SPEAK','SPEED','SPEND','SPENT','SPLIT','SPOKE','SPORT','STAFF','STAGE',
    'STAND','START','STATE','STEAM','STEEL','STICK','STILL','STOCK','STONE','STOOD',
    'STORE','STORM','STORY','STRIP','STUDY','STUFF','STYLE','SUGAR','SUITE','SUPER',
    'SWEET','TABLE','TAKEN','TASTE','TAXES','TEACH','TEETH','TERRY','TEXAS','THANK',
    'THEFT','THEIR','THEME','THERE','THESE','THICK','THING','THINK','THIRD','THIRTY',
    'THOSE','THREE','THREW','THROW','TIGHT','TIMES','TIRED','TITLE','TODAY','TOPIC',
    'TOTAL','TOUCH','TOUGH','TOWER','TRACK','TRADE','TRAIN','TREAT','TREND','TRIAL',
    'TRIED','TRIES','TRUCK','TRULY','TRUST','TRUTH','TWICE','UNDER','UNDUE','UNION',
    'UNITY','UNTIL','UPPER','UPSET','URBAN','USAGE','USUAL','VALID','VALUE','VIDEO',
    'VIRUS','VISIT','VITAL','VOICE','WASTE','WATCH','WATER','WHEEL','WHERE','WHICH',
    'WHILE','WHITE','WHOLE','WHOSE','WOMAN','WOMEN','WORLD','WORRY','WORSE','WORST',
    'WORTH','WOULD','WOUND','WRITE','WRONG','WROTE','YIELD','YOUNG','YOURS','YOUTH'
  ];

  var VALID_SET = Object.create(null);
  WORDS.forEach(function (w) { VALID_SET[w] = true; });
  VALID_EXTRAS.forEach(function (w) { VALID_SET[w] = true; });

  var boardEl, bannerEl, kbEl, fxCanvas, fxCtx;
  var currentWord = '';
  var isDaily = true;
  var dailyIndex = 1;
  var currentRow = 0;
  var currentCol = 0;
  var grid = [];
  var isGameOver = false;
  var keyStateMap = {};

  var confettiParticles = [];
  var confettiTimer = 0;

  function getDailyWord() {
    var now = new Date();
    var start = new Date(2026, 0, 1);
    var dayDiff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    if (dayDiff < 0) dayDiff = 0;
    dailyIndex = dayDiff + 1;
    var idx = dayDiff % WORDS.length;
    return { word: WORDS[idx], index: dailyIndex };
  }

  function getRandomWord() {
    var idx = Math.floor(Math.random() * WORDS.length);
    return { word: WORDS[idx], index: idx + 1 };
  }

  function initBoard() {
    boardEl.innerHTML = '';
    grid = [];
    for (var r = 0; r < 6; r++) {
      var rowEl = document.createElement('div');
      rowEl.className = 'word-row';
      rowEl.setAttribute('role', 'row');
      var rowCells = [];
      for (var c = 0; c < 5; c++) {
        var tile = document.createElement('div');
        tile.className = 'word-tile';
        tile.setAttribute('role', 'gridcell');
        tile.setAttribute('aria-label', 'Row ' + (r + 1) + ', Letter ' + (c + 1));
        rowEl.appendChild(tile);
        rowCells.push(tile);
      }
      boardEl.appendChild(rowEl);
      grid.push(rowCells);
    }
  }

  function initKeyboard() {
    kbEl.innerHTML = '';
    var layout = [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['ENTER','Z','X','C','V','B','N','M','BACK']
    ];
    layout.forEach(function (row) {
      var rowEl = document.createElement('div');
      rowEl.className = 'kb-row';
      row.forEach(function (key) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'kb-key' + (key === 'ENTER' || key === 'BACK' ? ' kb-wide' : '');
        btn.textContent = key === 'BACK' ? '⌫' : key;
        btn.setAttribute('data-key', key);
        btn.addEventListener('click', function () {
          handleKey(key);
        });
        rowEl.appendChild(btn);
      });
      kbEl.appendChild(rowEl);
    });
  }

  function setBanner(text, tone) {
    bannerEl.textContent = text;
    if (tone) bannerEl.setAttribute('data-tone', tone);
    else bannerEl.removeAttribute('data-tone');
  }

  function evaluateGuess(guess, target) {
    var result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    var targetLetters = target.split('');
    var guessLetters = guess.split('');
    var letterCounts = {};

    for (var i = 0; i < 5; i++) {
      var ch = targetLetters[i];
      letterCounts[ch] = (letterCounts[ch] || 0) + 1;
    }

    /* First pass: exact matches */
    for (var i = 0; i < 5; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = 'correct';
        letterCounts[guessLetters[i]]--;
      }
    }

    /* Second pass: present matches */
    for (var i = 0; i < 5; i++) {
      if (result[i] !== 'correct') {
        var ch = guessLetters[i];
        if (letterCounts[ch] && letterCounts[ch] > 0) {
          result[i] = 'present';
          letterCounts[ch]--;
        }
      }
    }
    return result;
  }

  function updateKeyboardColors(guess, evals) {
    var rank = { 'correct': 3, 'present': 2, 'absent': 1 };
    for (var i = 0; i < 5; i++) {
      var letter = guess[i];
      var state = evals[i];
      var curState = keyStateMap[letter];
      if (!curState || rank[state] > (rank[curState] || 0)) {
        keyStateMap[letter] = state;
        var btn = kbEl.querySelector('[data-key="' + letter + '"]');
        if (btn) btn.setAttribute('data-state', state);
      }
    }
  }

  function shakeRow(rowIdx) {
    var row = boardEl.children[rowIdx];
    if (!row) return;
    row.classList.remove('shake');
    void row.offsetWidth;
    row.classList.add('shake');
    if (window.ArcadeAudio) window.ArcadeAudio.playShake();
  }

  function startConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!fxCanvas) return;
    fxCanvas.width = fxCanvas.offsetWidth || 340;
    fxCanvas.height = fxCanvas.offsetHeight || 380;
    confettiParticles = [];
    var colors = ['#0e6e55', '#4fc8a4', '#e2a84f', '#fbfaf6', '#0a3a2e'];
    for (var i = 0; i < 48; i++) {
      confettiParticles.push({
        x: fxCanvas.width / 2 + (Math.random() - 0.5) * 60,
        y: fxCanvas.height * 0.45,
        vx: (Math.random() - 0.5) * 9,
        vy: -Math.random() * 8 - 3,
        size: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 1.0
      });
    }

    if (confettiTimer) cancelAnimationFrame(confettiTimer);
    function renderConfetti() {
      if (!fxCtx) return;
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      var alive = false;
      for (var i = 0; i < confettiParticles.length; i++) {
        var p = confettiParticles[i];
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.22; /* gravity */
          p.rotation += p.rotSpeed;
          p.life -= 0.014;
          fxCtx.save();
          fxCtx.translate(p.x, p.y);
          fxCtx.rotate(p.rotation * Math.PI / 180);
          fxCtx.fillStyle = p.color;
          fxCtx.globalAlpha = Math.max(0, p.life);
          fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          fxCtx.restore();
        }
      }
      if (alive) confettiTimer = requestAnimationFrame(renderConfetti);
      else fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    }
    renderConfetti();
  }

  function submitGuess() {
    if (currentCol < 5) {
      shakeRow(currentRow);
      setBanner('Word must be 5 letters!', 'warn');
      return;
    }
    var guess = '';
    for (var c = 0; c < 5; c++) {
      guess += grid[currentRow][c].textContent;
    }

    if (!VALID_SET[guess]) {
      shakeRow(currentRow);
      setBanner('Not in dictionary! Try another word.', 'warn');
      return;
    }

    var evals = evaluateGuess(guess, currentWord);
    var rowTiles = grid[currentRow];
    var isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (var c = 0; c < 5; c++) {
      (function (idx) {
        var tile = rowTiles[idx];
        var state = evals[idx];
        setTimeout(function () {
          tile.classList.add('flip');
          tile.setAttribute('data-state', state);
          if (window.ArcadeAudio) window.ArcadeAudio.playFlip(idx);
        }, isReduced ? 0 : idx * 110);
      })(c);
    }

    setTimeout(function () {
      updateKeyboardColors(guess, evals);

      if (guess === currentWord) {
        isGameOver = true;
        setBanner('Splendid! You cracked it in ' + (currentRow + 1) + ' tries.', 'win');
        if (window.ArcadeAudio) window.ArcadeAudio.playWin();
        startConfetti();
        for (var c = 0; c < 5; c++) {
          (function (idx) {
            setTimeout(function () {
              rowTiles[idx].classList.add('win-bounce');
            }, idx * 70);
          })(c);
        }
        recordStats(true);
      } else if (currentRow === 5) {
        isGameOver = true;
        setBanner('Good try! The word was ' + currentWord + '.', 'lose');
        if (window.ArcadeAudio) window.ArcadeAudio.playLose();
        recordStats(false);
      } else {
        currentRow++;
        currentCol = 0;
        setBanner('Keep going! Row ' + (currentRow + 1) + ' of 6.');
      }
    }, isReduced ? 50 : 580);
  }

  function recordStats(won) {
    try {
      var streak = parseInt(localStorage.getItem('dex_word_streak') || '0', 10);
      var totalWon = parseInt(localStorage.getItem('dex_word_won') || '0', 10);
      if (won) {
        streak++;
        totalWon++;
      } else {
        streak = 0;
      }
      localStorage.setItem('dex_word_streak', streak);
      localStorage.setItem('dex_word_won', totalWon);
      updateStatsUI();
    } catch (e) {}
  }

  function updateStatsUI() {
    try {
      var streakEl = document.getElementById('word-streak');
      var wonEl = document.getElementById('word-won');
      if (streakEl) streakEl.textContent = localStorage.getItem('dex_word_streak') || '0';
      if (wonEl) wonEl.textContent = localStorage.getItem('dex_word_won') || '0';
    } catch (e) {}
  }

  function handleKey(key) {
    if (isGameOver) return;
    key = key.toUpperCase();
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK' || key === 'BACKSPACE') {
      if (currentCol > 0) {
        currentCol--;
        var tile = grid[currentRow][currentCol];
        tile.textContent = '';
        tile.removeAttribute('data-filled');
        if (window.ArcadeAudio) window.ArcadeAudio.playDelete();
      }
    } else if (/^[A-Z]$/.test(key)) {
      if (currentCol < 5) {
        var tile = grid[currentRow][currentCol];
        tile.textContent = key;
        tile.setAttribute('data-filled', 'true');
        tile.classList.remove('pop');
        void tile.offsetWidth;
        tile.classList.add('pop');
        currentCol++;
        if (window.ArcadeAudio) window.ArcadeAudio.playKey();
      }
    }
  }

  function startNewGame(random) {
    isDaily = !random;
    var info = isDaily ? getDailyWord() : getRandomWord();
    currentWord = info.word;
    currentRow = 0;
    currentCol = 0;
    isGameOver = false;
    keyStateMap = {};

    var badge = document.getElementById('word-mode-badge');
    if (badge) badge.textContent = isDaily ? ('Daily #' + info.index) : 'Random Mode';
    var dailyBtn = document.getElementById('word-daily-btn');
    if (dailyBtn) dailyBtn.hidden = isDaily;

    initBoard();
    initKeyboard();
    setBanner('Type 5 letters and press Enter.');
    updateStatsUI();
  }

  function init() {
    boardEl = document.getElementById('word-board');
    bannerEl = document.getElementById('word-banner');
    kbEl = document.getElementById('word-kb');
    fxCanvas = document.getElementById('word-fx-canvas');
    if (fxCanvas) fxCtx = fxCanvas.getContext('2d');

    var randomBtn = document.getElementById('word-random-btn');
    if (randomBtn) randomBtn.addEventListener('click', function () { startNewGame(true); });
    var dailyBtn = document.getElementById('word-daily-btn');
    if (dailyBtn) dailyBtn.addEventListener('click', function () { startNewGame(false); });

    window.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Enter') {
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('BACK');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    });

    startNewGame(false);
  }

  return {
    init: init,
    startNewGame: startNewGame
  };
})();
