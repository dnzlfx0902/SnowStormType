(function () {
  "use strict";

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // Elementos HUD y pantallas
  const elScore = document.getElementById("hud-score");
  const elCombo = document.getElementById("hud-combo");
  const elWpm = document.getElementById("hud-wpm");
  const elAcc = document.getElementById("hud-acc");
  const elWave = document.getElementById("hud-wave");
  const elLives = document.getElementById("hud-lives");
  const elFreezeBanner = document.getElementById("freeze-banner");
  const elTargetStatus = document.getElementById("target-status");
  const elTargetPreview = document.getElementById("target-preview");

  const screenStart = document.getElementById("screen-start");
  const screenPause = document.getElementById("screen-pause");
  const screenGameover = document.getElementById("screen-gameover");

  const btnStart = document.getElementById("btn-start");
  const btnPause = document.getElementById("btn-pause");
  const btnMute = document.getElementById("btn-mute");
  const btnResume = document.getElementById("btn-resume");
  const btnRestartPause = document.getElementById("btn-restart-pause");
  const btnPlayAgain = document.getElementById("btn-play-again");
  const btnMenu = document.getElementById("btn-menu");

  const optFlexAccents = document.getElementById("opt-flex-accents");
  const optMusic = document.getElementById("opt-music");
  const diffButtons = Array.from(document.querySelectorAll(".diff-btn"));
  const vocabButtons = Array.from(document.querySelectorAll(".vocab-btn"));
  const elPowerupLegend = document.querySelector(".powerup-legend");

  const elMeaningCorner = document.getElementById("meaning-corner");
  const elMeaningState = document.getElementById("meaning-state");
  const elMeaningTerm = document.getElementById("meaning-term");
  const elMeaningDef = document.getElementById("meaning-def");
  const elMeaningEx = document.getElementById("meaning-ex");

  const elStartHighscore = document.getElementById("start-highscore");
  const elFinalHighscore = document.getElementById("final-highscore");
  const elFinalScore = document.getElementById("final-score");
  const elFinalWpm = document.getElementById("final-wpm");
  const elFinalAcc = document.getElementById("final-acc");
  const elFinalStreak = document.getElementById("final-streak");
  const elGameoverBadge = document.getElementById("gameover-badge");
  const elGameoverTitle = document.getElementById("gameover-title");
  const elGameoverMsg = document.getElementById("gameover-msg");

  const STORAGE_KEYS = {
    es: "navidad_mecanografia_highscore_v1",
    phrasal: "navidad_phrasal_highscore_v1"
  };
  const DIFFICULTIES = {
    easy: {
      baseSpeed: 36,
      speedPerWave: 5.5,
      spawnInterval: 2.35,
      minSpawnInterval: 1.05,
      maxWords: 5,
      tierWeights: [0.75, 0.25, 0.0]
    },
    normal: {
      baseSpeed: 50,
      speedPerWave: 7.5,
      spawnInterval: 1.85,
      minSpawnInterval: 0.78,
      maxWords: 7,
      tierWeights: [0.45, 0.42, 0.13]
    },
    hard: {
      baseSpeed: 68,
      speedPerWave: 9.5,
      spawnInterval: 1.4,
      minSpawnInterval: 0.6,
      maxWords: 9,
      tierWeights: [0.22, 0.48, 0.30]
    }
  };

  const GIFT_PALETTES = [
    { box: "#e63946", ribbon: "#ffd166" },
    { box: "#2a9d8f", ribbon: "#f8fafc" },
    { box: "#3a86ff", ribbon: "#ffd166" },
    { box: "#9b5de5", ribbon: "#f15bb5" },
    { box: "#f77f00", ribbon: "#fff3b0" }
  ];

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Estado del juego
  const state = {
    mode: "start", // start | playing | paused | gameover
    vocabMode: "es", // es | phrasal
    difficulty: "normal",
    flexAccents: true,
    score: 0,
    highScore: Number(localStorage.getItem(STORAGE_KEYS.es) || 0),
    lastCompletedEntry: null,
    lives: 5,
    maxLives: 5,
    wave: 1,
    wordsCompleted: 0,
    streak: 0,
    bestStreak: 0,
    correctChars: 0,
    totalKeystrokes: 0,
    elapsedActive: 0,
    spawnTimer: 0.5,
    freezeTimer: 0,
    shakeTimer: 0,
    sleigh: { active: false, x: -200, y: 120, speed: 150 },
    activeTargetId: null,
    nextId: 1,
    items: [],
    particles: [],
    beams: [],
    floatingTexts: [],
    stars: [],
    snow: [],
    trees: [],
    lastFrameTime: 0
  };

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initBackdropElements();
  }

  function initBackdropElements() {
    state.stars = [];
    const starCount = Math.min(110, Math.floor((width * height) / 11000));
    for (let i = 0; i < starCount; i++) {
      state.stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.65),
        r: 0.8 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 2.2
      });
    }

    state.snow = [];
    const snowCount = Math.min(130, Math.floor(width / 10));
    for (let i = 0; i < snowCount; i++) {
      state.snow.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.2 + Math.random() * 2.8,
        vy: 18 + Math.random() * 42,
        vx: -12 + Math.random() * 24,
        alpha: 0.35 + Math.random() * 0.55
      });
    }

    state.trees = [];
    const treeStep = 78;
    for (let x = 20; x < width + 40; x += treeStep) {
      if (Math.abs(x - width / 2) < 95) continue; // espacio para el cañón/trineo central
      state.trees.push({
        x: x + (Math.random() * 22 - 11),
        h: 44 + Math.random() * 42,
        w: 28 + Math.random() * 18,
        lit: Math.random() > 0.35
      });
    }
  }

  function normalizeChar(ch) {
    const lower = ch.toLowerCase();
    if (!state.flexAccents) return lower;
    switch (lower) {
      case "á": case "à": case "ä": case "â": return "a";
      case "é": case "è": case "ë": case "ê": return "e";
      case "í": case "ì": case "ï": case "î": return "i";
      case "ó": case "ò": case "ö": case "ô": return "o";
      case "ú": case "ù": case "ü": case "û": return "u";
      default: return lower;
    }
  }

  function getComboMultiplier() {
    return Math.min(5, 1 + Math.floor(state.streak / 5));
  }

  function getCurrentWpm() {
    if (state.elapsedActive < 1.5) return 0;
    const minutes = state.elapsedActive / 60;
    return Math.round((state.correctChars / 5) / minutes);
  }

  function getCurrentAccuracy() {
    if (state.totalKeystrokes === 0) return 100;
    return Math.max(0, Math.min(100, Math.round((state.correctChars / state.totalKeystrokes) * 100)));
  }

  function updateHud() {
    elScore.textContent = state.score.toLocaleString("es-ES");
    elCombo.textContent = "x" + getComboMultiplier() + (state.streak >= 3 ? ` (${state.streak})` : "");
    elWpm.textContent = getCurrentWpm();
    elAcc.textContent = getCurrentAccuracy() + "%";
    elWave.textContent = state.wave;

    const hearts = elLives.querySelectorAll(".heart-icon");
    hearts.forEach((h, idx) => {
      h.classList.toggle("lost", idx >= state.lives);
    });

    elFreezeBanner.classList.toggle("hidden", state.freezeTimer <= 0);

    const active = state.items.find((it) => it.id === state.activeTargetId);
    if (active) {
      const done = active.word.slice(0, active.progress);
      const rest = active.word.slice(active.progress);
      elTargetStatus.textContent = active.powerup ? active.powerup.label : "Fijado";
      elTargetPreview.innerHTML = `<span style="color:#2ec4b6">${escapeHtml(done)}</span><span style="color:#f8fafc">${escapeHtml(rest)}</span>`;
    } else {
      elTargetStatus.textContent = "Listo";
      elTargetPreview.textContent = state.mode === "playing" ? "Teclea la primera letra..." : "Teclea para atrapar regalos";
    }

    elStartHighscore.textContent = `Récord personal: ${state.highScore.toLocaleString("es-ES")} pts`;
    elFinalHighscore.textContent = `Récord personal: ${state.highScore.toLocaleString("es-ES")} pts`;
    updateMeaningCorner();
  }

  function updateMeaningCorner() {
    const show = state.vocabMode === "phrasal" && (state.mode === "playing" || state.mode === "paused");
    elMeaningCorner.classList.toggle("hidden", !show);
    if (!show) return;

    const active = state.items.find((it) => it.id === state.activeTargetId);
    let shown = active;
    let badge = "Fijado";
    let isLocked = true;

    if (!shown && state.items.length > 0) {
      shown = state.items.reduce((lowest, it) => (it.y > lowest.y ? it : lowest), state.items[0]);
      badge = "Próximo";
      isLocked = false;
    } else if (!shown && state.lastCompletedEntry) {
      shown = state.lastCompletedEntry;
      badge = "¡Acertado!";
      isLocked = true;
    }

    if (shown) {
      elMeaningState.textContent = badge;
      elMeaningState.classList.toggle("locked", isLocked);
      elMeaningTerm.textContent = shown.word;
      elMeaningDef.textContent = shown.meaning || "Expresión navideña en inglés";
      elMeaningEx.textContent = shown.example || "";
      elMeaningEx.classList.toggle("hidden", !shown.example);
    }
  }

  function updateStartLegend() {
    if (!elPowerupLegend) return;
    if (state.vocabMode === "phrasal") {
      elPowerupLegend.innerHTML = `
        <div class="legend-item"><strong>❄️ Snowstorm</strong>Congela la caída 4.5s</div>
        <div class="legend-item"><strong>🌟 Starlight</strong>Despeja toda la pantalla</div>
        <div class="legend-item"><strong>☕ Hot cocoa</strong>Recupera +1 vida</div>
      `;
    } else {
      elPowerupLegend.innerHTML = `
        <div class="legend-item"><strong>❄️ Escarcha</strong>Congela la caída 4.5s</div>
        <div class="legend-item"><strong>🌟 Destello</strong>Despeja toda la pantalla</div>
        <div class="legend-item"><strong>☕ Chocolate</strong>Recupera +1 vida</div>
      `;
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[m]));
  }

  function getWordBank() {
    return state.vocabMode === "phrasal" ? window.PHRASAL_WORDS : window.NAVIDAD_WORDS;
  }

  function normalizeEntry(entry) {
    if (typeof entry === "string") {
      return { word: entry, meaning: null, example: null };
    }
    return { word: entry.word, meaning: entry.meaning || null, example: entry.example || null };
  }

  function pickWord() {
    const bank = getWordBank();
    // 11% probabilidad de powerup si no hay ya uno en pantalla
    const hasPowerup = state.items.some((i) => i.powerup);
    if (!hasPowerup && state.items.length >= 1 && Math.random() < 0.11) {
      const pu = bank.powerups[Math.floor(Math.random() * bank.powerups.length)];
      return { word: pu.word, meaning: pu.meaning || null, example: pu.example || null, powerup: pu };
    }

    const cfg = DIFFICULTIES[state.difficulty];
    // Ajustar pesos por oleada
    const waveBoost = Math.min(0.28, (state.wave - 1) * 0.05);
    const w1 = Math.max(0.1, cfg.tierWeights[0] - waveBoost);
    const w3 = Math.min(0.55, cfg.tierWeights[2] + waveBoost * 0.8);
    const r = Math.random();
    let pool = bank.tier2;
    if (r < w1) pool = bank.tier1;
    else if (r > 1 - w3) pool = bank.tier3;

    // Evitar duplicados exactos o misma letra inicial si hay pocas palabras
    const activeWords = new Set(state.items.map((i) => i.word));
    const activeFirst = new Set(state.items.map((i) => normalizeChar(i.word[0])));

    for (let attempt = 0; attempt < 15; attempt++) {
      const candidate = normalizeEntry(pool[Math.floor(Math.random() * pool.length)]);
      if (!activeWords.has(candidate.word) && (!activeFirst.has(normalizeChar(candidate.word[0])) || attempt > 9)) {
        return { ...candidate, powerup: null };
      }
    }
    const fallback = normalizeEntry(pool[Math.floor(Math.random() * pool.length)]);
    return { ...fallback, powerup: null };
  }

  function spawnItem() {
    const cfg = DIFFICULTIES[state.difficulty];
    if (state.items.length >= cfg.maxWords) return;

    const picked = pickWord();
    const margin = Math.max(105, Math.min(180, picked.word.length * 8 + 45));
    const usableW = Math.max(120, width - margin * 2);
    let x = margin + Math.random() * usableW;
    for (let t = 0; t < 10; t++) {
      const cand = margin + Math.random() * usableW;
      const tooClose = state.items.some((it) => it.y < 245 && Math.abs(it.x - cand) < 135);
      if (!tooClose) {
        x = cand;
        break;
      }
    }

    const speedVar = 0.88 + Math.random() * 0.28;
    const base = cfg.baseSpeed + (state.wave - 1) * cfg.speedPerWave;
    const lengthFactor = picked.word.length > 12 ? 0.82 : 1;

    state.items.push({
      id: state.nextId++,
      word: picked.word,
      meaning: picked.meaning,
      example: picked.example,
      progress: 0,
      powerup: picked.powerup,
      x,
      y: 106,
      alpha: 0,
      vy: base * speedVar * lengthFactor,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmp: 6 + Math.random() * 10,
      kind: picked.powerup ? "powerup" : (Math.random() < 0.35 ? "ornament" : "gift"),
      palette: GIFT_PALETTES[Math.floor(Math.random() * GIFT_PALETTES.length)],
      hitFlash: 0
    });
    updateMeaningCorner();
  }

  function spawnParticles(x, y, color, count = 18) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 210;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 0.45 + Math.random() * 0.45,
        maxLife: 0.9,
        size: 2.5 + Math.random() * 4,
        color,
        star: Math.random() > 0.45
      });
    }
  }

  function addFloatingText(x, y, text, color = "#ffd166") {
    state.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 1.05,
      maxLife: 1.05
    });
  }

  function addBeam(targetX, targetY, color) {
    state.beams.push({
      x1: width / 2,
      y1: height - 68,
      x2: targetX,
      y2: targetY,
      color,
      life: 0.16,
      maxLife: 0.16
    });
  }

  function completeItem(item) {
    const mult = getComboMultiplier();
    const basePts = item.word.length * 12;
    const pts = basePts * mult;
    state.score += pts;
    state.wordsCompleted += 1;
    state.streak += 1;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;

    if (state.score > state.highScore) {
      state.highScore = state.score;
      try { localStorage.setItem(STORAGE_KEYS[state.vocabMode], String(state.highScore)); } catch (_) {}
    }
    // Subir oleada cada 12 palabras
    const newWave = 1 + Math.floor(state.wordsCompleted / 12);
    if (newWave > state.wave) {
      state.wave = newWave;
      window.NavidadAudio.waveUp();
      addFloatingText(width / 2, height * 0.34, `🎄 ¡OLEADA ${state.wave}!`, "#ffd166");
    }

    // Sacar trineo en rachas múltiplos de 10
    if (state.streak > 0 && state.streak % 10 === 0 && !state.sleigh.active) {
      state.sleigh = { active: true, x: -220, y: 110 + Math.random() * 70, speed: 210 };
    }

    if (item.powerup) {
      window.NavidadAudio.powerup(item.powerup.type);
      triggerPowerup(item.powerup, item);
    } else {
      window.NavidadAudio.wordComplete(state.streak);
      spawnParticles(item.x, item.y, item.palette.ribbon, 22);
      spawnParticles(item.x, item.y, item.palette.box, 12);
      addFloatingText(item.x, item.y - 18, `+${pts}`, mult >= 3 ? "#ffd166" : "#2ec4b6");
    }
    state.lastCompletedEntry = { word: item.word, meaning: item.meaning, example: item.example };
    state.items = state.items.filter((it) => it.id !== item.id);
    if (state.activeTargetId === item.id) state.activeTargetId = null;
  }

  function triggerPowerup(pu, originItem) {
    if (pu.type === "freeze") {
      state.freezeTimer = 4.5;
      spawnParticles(originItem.x, originItem.y, "#a8dadc", 28);
      addFloatingText(originItem.x, originItem.y - 20, "❄️ ¡ESCARCHA!", "#a8dadc");
    } else if (pu.type === "clear") {
      spawnParticles(originItem.x, originItem.y, "#ffd166", 34);
      addFloatingText(originItem.x, originItem.y - 20, "🌟 ¡ESTALLIDO ESTELAR!", "#ffd166");
      const others = state.items.filter((it) => it.id !== originItem.id);
      others.forEach((it) => {
        const bonus = it.word.length * 8;
        state.score += bonus;
        state.wordsCompleted += 1;
        spawnParticles(it.x, it.y, "#ffd166", 16);
        addFloatingText(it.x, it.y, `+${bonus}`, "#ffd166");
      });
      state.items = [originItem]; // completeItem eliminará originItem
    } else if (pu.type === "heal") {
      if (state.lives < state.maxLives) {
        state.lives += 1;
        addFloatingText(originItem.x, originItem.y - 20, "❤️ +1 VIDA", "#ff5964");
      } else {
        state.score += 150;
        addFloatingText(originItem.x, originItem.y - 20, "☕ +150 EXTRA", "#ffd166");
      }
      spawnParticles(originItem.x, originItem.y, "#ff5964", 24);
    }
  }

  function handleKeyPress(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "Escape") {
      if (state.mode === "playing") {
        pauseGame();
        e.preventDefault();
      } else if (state.mode === "paused") {
        resumeGame();
        e.preventDefault();
      }
      return;
    }

    if (e.key === "Enter" && state.mode === "start") {
      startGame();
      e.preventDefault();
      return;
    }

    if (state.mode !== "playing") return;

    if (e.key === "Tab") {
      e.preventDefault();
      state.activeTargetId = null;
      updateHud();
      return;
    }

    // Ignorar teclas no imprimibles
    if (e.key.length !== 1) return;
    if (e.key === " ") e.preventDefault();

    window.NavidadAudio.ensureCtx();
    const typedNorm = normalizeChar(e.key);

    let target = state.items.find((it) => it.id === state.activeTargetId);

    // Si no hay objetivo bloqueado, buscar el más cercano al suelo que empiece igual
    if (!target) {
      const candidates = state.items
        .filter((it) => normalizeChar(it.word[it.progress]) === typedNorm)
        .sort((a, b) => b.y - a.y);

      if (candidates.length > 0) {
        target = candidates[0];
        state.activeTargetId = target.id;
      }
    }

    state.totalKeystrokes += 1;

    if (target && normalizeChar(target.word[target.progress]) === typedNorm) {
      state.correctChars += 1;
      target.progress += 1;
      target.hitFlash = 1;
      addBeam(target.x, target.y, target.powerup ? "#a8dadc" : "#ffd166");
      spawnParticles(target.x, target.y, "#ffd166", 4);
      window.NavidadAudio.keyHit(state.streak);

      if (target.progress >= target.word.length) {
        completeItem(target);
      }
    } else {
      // Error: rompe la racha
      state.streak = 0;
      window.NavidadAudio.keyMiss();
      if (target) {
        target.hitFlash = -1;
      }
    }

    updateHud();
  }

  function startGame() {
    window.NavidadAudio.ensureCtx();
    state.mode = "playing";
    state.flexAccents = optFlexAccents.checked;
    window.NavidadAudio.setMusicEnabled(optMusic.checked);

    state.score = 0;
    state.lives = state.maxLives;
    state.wave = 1;
    state.wordsCompleted = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.correctChars = 0;
    state.totalKeystrokes = 0;
    state.elapsedActive = 0;
    state.spawnTimer = 0.25;
    state.freezeTimer = 0;
    state.shakeTimer = 0;
    state.sleigh.active = false;
    state.activeTargetId = null;
    state.lastCompletedEntry = null;
    state.items = [];
    state.beams = [];
    state.floatingTexts = [];

    screenStart.classList.add("hidden");
    screenPause.classList.add("hidden");
    screenGameover.classList.add("hidden");

    spawnItem();
    updateHud();
    window.NavidadAudio.startMusic();
  }

  function pauseGame() {
    if (state.mode !== "playing") return;
    state.mode = "paused";
    window.NavidadAudio.stopMusic();
    screenPause.classList.remove("hidden");
  }

  function resumeGame() {
    if (state.mode !== "paused") return;
    state.mode = "playing";
    screenPause.classList.add("hidden");
    window.NavidadAudio.startMusic();
  }

  function returnToMenu() {
    state.mode = "start";
    window.NavidadAudio.stopMusic();
    screenPause.classList.add("hidden");
    screenGameover.classList.add("hidden");
    screenStart.classList.remove("hidden");
    updateHud();
  }

  function endGame() {
    state.mode = "gameover";
    window.NavidadAudio.stopMusic();
    window.NavidadAudio.gameOver();

    const wpm = getCurrentWpm();
    const acc = getCurrentAccuracy();

    elFinalScore.textContent = state.score.toLocaleString("es-ES");
    elFinalWpm.textContent = `${wpm} PPM`;
    elFinalAcc.textContent = `${acc}%`;
    elFinalStreak.textContent = String(state.bestStreak);

    if (state.score > 0 && state.score >= state.highScore) {
      elGameoverBadge.textContent = "🏆 ¡NUEVO RÉCORD NAVIDEÑO!";
      elGameoverTitle.textContent = "¡Estrella del Taller!";
      elGameoverMsg.textContent = "Has superado tu mejor marca empaquetando regalos.";
    } else {
      elGameoverBadge.textContent = "🎄 Turno Completado";
      elGameoverTitle.textContent = "¡Fin de la Nochebuena!";
      elGameoverMsg.textContent = `Completaste ${state.wordsCompleted} palabras hasta la oleada ${state.wave}.`;
    }

    updateHud();
    screenGameover.classList.remove("hidden");
  }

  function update(dt) {
    // Nieve siempre animada
    const snowSpeedBoost = state.freezeTimer > 0 ? 1.8 : 1;
    for (const s of state.snow) {
      s.y += s.vy * snowSpeedBoost * dt;
      s.x += s.vx * dt + Math.sin(s.y * 0.02) * 10 * dt;
      if (s.y > height + 8) {
        s.y = -8;
        s.x = Math.random() * width;
      }
      if (s.x < -10) s.x = width + 10;
      if (s.x > width + 10) s.x = -10;
    }

    if (state.mode !== "playing") return;

    state.elapsedActive += dt;
    if (state.freezeTimer > 0) state.freezeTimer = Math.max(0, state.freezeTimer - dt);
    if (state.shakeTimer > 0) state.shakeTimer = Math.max(0, state.shakeTimer - dt);

    // Trineo decorativo
    if (state.sleigh.active) {
      state.sleigh.x += state.sleigh.speed * dt;
      if (state.sleigh.x > width + 240) state.sleigh.active = false;
    }

    // Spawn progresivo
    const cfg = DIFFICULTIES[state.difficulty];
    const currentInterval = Math.max(
      cfg.minSpawnInterval,
      cfg.spawnInterval - (state.wave - 1) * 0.12
    );
    state.spawnTimer -= dt * (state.freezeTimer > 0 ? 0.35 : 1);
    if (state.spawnTimer <= 0) {
      spawnItem();
      state.spawnTimer = currentInterval;
    }

    const groundY = height - 74;
    const speedFactor = state.freezeTimer > 0 ? 0.16 : 1;

    for (let i = state.items.length - 1; i >= 0; i--) {
      const it = state.items[i];
      it.y += it.vy * speedFactor * dt;
      it.alpha = Math.min(1, (it.alpha ?? 1) + dt * 3.2);
      it.swayPhase += dt * 1.6;
      if (it.hitFlash > 0) it.hitFlash = Math.max(0, it.hitFlash - dt * 5);
      if (it.hitFlash < 0) it.hitFlash = Math.min(0, it.hitFlash + dt * 5);

      if (it.y >= groundY) {
        // Regalo perdido
        const lostActive = it.id === state.activeTargetId;
        state.items.splice(i, 1);
        if (lostActive) state.activeTargetId = null;

        if (!it.powerup) {
          state.lives -= 1;
          state.streak = 0;
          state.shakeTimer = 0.28;
          window.NavidadAudio.lifeLost();
          spawnParticles(it.x, groundY, "#ff5964", 18);
          addFloatingText(it.x, groundY - 22, "¡Cayó!", "#ff5964");
          if (state.lives <= 0) {
            state.lives = 0;
            updateHud();
            endGame();
            return;
          }
        }
        updateHud();
      }
    }

    // Partículas
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
      if (p.life <= 0) state.particles.splice(i, 1);
    }

    // Rayos mágicos
    for (let i = state.beams.length - 1; i >= 0; i--) {
      state.beams[i].life -= dt;
      if (state.beams[i].life <= 0) state.beams.splice(i, 1);
    }

    // Textos flotantes
    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = state.floatingTexts[i];
      ft.life -= dt;
      ft.y -= 36 * dt;
      if (ft.life <= 0) state.floatingTexts.splice(i, 1);
    }

    // Actualizar PPM en HUD suavemente
    elWpm.textContent = getCurrentWpm();
    elFreezeBanner.classList.toggle("hidden", state.freezeTimer <= 0);
  }

  function drawBackground(timeSec) {
    // Cielo nocturno
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#050f1c");
    sky.addColorStop(0.55, "#0d2238");
    sky.addColorStop(1, "#15324a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Aurora boreal sutil
    ctx.save();
    ctx.globalAlpha = 0.14;
    const aurora = ctx.createLinearGradient(0, 40, width, 240);
    aurora.addColorStop(0, "#2ec4b6");
    aurora.addColorStop(0.5, "#74c0fc");
    aurora.addColorStop(1, "#a8dadc");
    ctx.fillStyle = aurora;
    ctx.beginPath();
    ctx.moveTo(0, 140);
    for (let x = 0; x <= width; x += 40) {
      const y = 115 + Math.sin(x * 0.008 + timeSec * 0.5) * 32 + Math.cos(x * 0.015 - timeSec * 0.3) * 18;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Estrellas titilantes
    for (const st of state.stars) {
      const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(timeSec * st.speed + st.phase));
      ctx.fillStyle = `rgba(255, 250, 224, ${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Luna invernal
    const moonX = width * 0.85;
    const moonY = Math.min(130, height * 0.18);
    ctx.save();
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 95);
    moonGlow.addColorStop(0, "rgba(255, 243, 196, 0.32)");
    moonGlow.addColorStop(1, "rgba(255, 243, 196, 0)");
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 95, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff3c4";
    ctx.beginPath();
    ctx.arc(moonX, moonY, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Trineo volador si está activo
    if (state.sleigh.active) {
      drawSleigh(state.sleigh.x, state.sleigh.y);
    }

    // Pinos nevados de fondo
    const floorY = height - 60;
    for (const tr of state.trees) {
      drawPineTree(tr.x, floorY + 6, tr.w, tr.h, tr.lit, timeSec);
    }

    // Suelo nevado con relieve
    ctx.fillStyle = "#dceefb";
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    for (let x = 0; x <= width; x += 60) {
      ctx.lineTo(x, floorY + Math.sin(x * 0.02) * 4);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Línea sutil de límite del taller
    ctx.strokeStyle = "rgba(168, 218, 220, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 74);
    ctx.lineTo(width, height - 74);
    ctx.stroke();

    // Cañón mágico / Trineo base en el centro inferior
    drawWorkshopLauncher(width / 2, height - 58);
  }

  function drawPineTree(x, baseY, w, h, lit, timeSec) {
    ctx.fillStyle = "#0b3b36";
    ctx.beginPath();
    ctx.moveTo(x, baseY - h);
    ctx.lineTo(x - w / 2, baseY);
    ctx.lineTo(x + w / 2, baseY);
    ctx.closePath();
    ctx.fill();

    // Gorro de nieve en la punta
    ctx.fillStyle = "#e6f4ff";
    ctx.beginPath();
    ctx.moveTo(x, baseY - h);
    ctx.lineTo(x - w * 0.18, baseY - h * 0.68);
    ctx.lineTo(x + w * 0.18, baseY - h * 0.68);
    ctx.closePath();
    ctx.fill();

    if (lit) {
      const pulse = 0.55 + 0.45 * Math.sin(timeSec * 3 + x);
      ctx.fillStyle = `rgba(255, 209, 102, ${pulse.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x - w * 0.14, baseY - h * 0.36, 2.2, 0, Math.PI * 2);
      ctx.arc(x + w * 0.16, baseY - h * 0.22, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSleigh(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(15, 28, 46, 0.85)";
    // Trineo
    ctx.beginPath();
    ctx.roundRect(-34, -8, 46, 16, 6);
    ctx.fill();
    // Patín
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-40, 12);
    ctx.quadraticCurveTo(15, 16, 24, 4);
    ctx.stroke();
    // Renos estilizados
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(46, -2, 5, 0, Math.PI * 2);
    ctx.arc(68, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    // Nariz roja de Rodolfo
    ctx.fillStyle = "#ff4d6d";
    ctx.beginPath();
    ctx.arc(74, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawWorkshopLauncher(cx, cy) {
    ctx.save();
    // Base festiva de madera y oro
    ctx.fillStyle = "#8d2b2b";
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - 46, cy - 18, 92, 28, 12);
    ctx.fill();
    ctx.stroke();

    // Estrella central del lanzador de chispas
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(cx, cy - 18, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawItems(timeSec) {
    for (const it of state.items) {
      const isTarget = it.id === state.activeTargetId;
      const swayX = it.x + Math.sin(it.swayPhase) * (isTarget ? 2 : it.swayAmp);
      const y = it.y;

      ctx.save();
      ctx.globalAlpha = it.alpha ?? 1;
      if (isTarget) {
        const glow = ctx.createRadialGradient(swayX, y, 6, swayX, y, 42);
        glow.addColorStop(0, "rgba(255, 209, 102, 0.48)");
        glow.addColorStop(1, "rgba(255, 209, 102, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(swayX, y, 42, 0, Math.PI * 2);
        ctx.fill();
      } else if (it.powerup) {
        const glow = ctx.createRadialGradient(swayX, y, 4, swayX, y, 36);
        glow.addColorStop(0, "rgba(168, 218, 220, 0.42)");
        glow.addColorStop(1, "rgba(168, 218, 220, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(swayX, y, 36, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dibujar objeto festivo
      if (it.powerup) {
        drawPowerupSprite(swayX, y, it.powerup, timeSec);
      } else if (it.kind === "ornament") {
        drawOrnamentSprite(swayX, y, it.palette);
      } else {
        drawGiftSprite(swayX, y, it.palette);
      }

      // Etiqueta de palabra
      drawWordPlaque(swayX, y + 32, it, isTarget);
      ctx.restore();
    }
  }

  function drawGiftSprite(x, y, palette) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = palette.box;
    ctx.beginPath();
    ctx.roundRect(-18, -16, 36, 32, 6);
    ctx.fill();

    // Tapa
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(-20, -16, 40, 8);

    // Cinta vertical y horizontal
    ctx.fillStyle = palette.ribbon;
    ctx.fillRect(-4, -16, 8, 32);
    ctx.fillRect(-18, -3, 36, 6);

    // Lazo superior
    ctx.strokeStyle = palette.ribbon;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(-6, -19, 6, 4, -0.3, 0, Math.PI * 2);
    ctx.ellipse(6, -19, 6, 4, 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawOrnamentSprite(x, y, palette) {
    ctx.save();
    ctx.translate(x, y);
    // Casquillo dorado
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(-5, -22, 10, 6);
    // Esfera
    const grad = ctx.createRadialGradient(-5, -6, 3, 0, 0, 18);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.25, palette.box);
    grad.addColorStop(1, "#0b192c");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();
    // Banda decorativa
    ctx.strokeStyle = palette.ribbon;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.stroke();
    ctx.restore();
  }

  function drawPowerupSprite(x, y, pu, timeSec) {
    ctx.save();
    ctx.translate(x, y);
    const scale = 1 + 0.08 * Math.sin(timeSec * 5);
    ctx.scale(scale, scale);

    ctx.fillStyle = pu.type === "freeze" ? "#48cae4" : pu.type === "clear" ? "#ffd166" : "#ff5964";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = "18px Segoe UI Emoji, Apple Color Emoji, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pu.icon, 0, 1);
    ctx.restore();
  }

  function drawWordPlaque(x, y, it, isTarget) {
    ctx.font = "700 17px 'Cascadia Code', Consolas, 'Courier New', monospace";
    const textW = ctx.measureText(it.word).width;
    const padX = 12;
    const boxW = textW + padX * 2;
    const boxH = 30;
    const left = x - boxW / 2;
    const top = y - boxH / 2;

    // Fondo de placa
    if (it.hitFlash < 0) {
      ctx.fillStyle = "rgba(180, 28, 42, 0.92)";
    } else if (isTarget) {
      ctx.fillStyle = "rgba(10, 29, 48, 0.96)";
    } else {
      ctx.fillStyle = "rgba(7, 19, 32, 0.88)";
    }

    ctx.strokeStyle = isTarget
      ? "#ffd166"
      : it.powerup
        ? "#a8dadc"
        : "rgba(255, 255, 255, 0.24)";
    ctx.lineWidth = isTarget ? 2.2 : 1.2;

    ctx.beginPath();
    ctx.roundRect(left, top, boxW, boxH, 9);
    ctx.fill();
    ctx.stroke();

    // Texto con prefijo ya tecleado resaltado
    const done = it.word.slice(0, it.progress);
    const rest = it.word.slice(it.progress);

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const startX = x - textW / 2;
    const doneW = ctx.measureText(done).width;

    if (done.length > 0) {
      ctx.fillStyle = "#2ec4b6";
      ctx.fillText(done, startX, y + 0.5);
    }

    ctx.fillStyle = isTarget ? "#ffd166" : "#f8fafc";
    ctx.fillText(rest, startX + doneW, y + 0.5);
  }

  function drawEffects() {
    // Rayos mágicos al teclear
    for (const b of state.beams) {
      const alpha = b.life / b.maxLife;
      ctx.save();
      ctx.strokeStyle = b.color;
      ctx.globalAlpha = alpha * 0.85;
      ctx.lineWidth = 3 * alpha + 1;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.restore();
    }

    // Partículas
    for (const p of state.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Copos de nieve del fondo
    for (const s of state.snow) {
      ctx.fillStyle = `rgba(248, 250, 252, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Textos flotantes de puntos / avisos
    for (const ft of state.floatingTexts) {
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "800 17px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = ft.color;
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 6;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // Viñeta helada si está activo CONGELAR
    if (state.freezeTimer > 0) {
      ctx.save();
      const vig = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.3, width / 2, height / 2, Math.max(width, height) * 0.72);
      vig.addColorStop(0, "rgba(168, 218, 220, 0)");
      vig.addColorStop(1, "rgba(168, 218, 220, 0.25)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  function render(nowMs) {
    const dt = state.lastFrameTime ? Math.min(0.05, (nowMs - state.lastFrameTime) / 1000) : 0.016;
    state.lastFrameTime = nowMs;

    update(dt);

    ctx.save();
    if (state.shakeTimer > 0) {
      const mag = state.shakeTimer * 22;
      ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
    }

    const timeSec = nowMs / 1000;
    drawBackground(timeSec);
    drawItems(timeSec);
    drawEffects();
    ctx.restore();

    requestAnimationFrame(render);
  }

  // Eventos UI
  vocabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      vocabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.vocabMode = btn.dataset.vocab;
      state.highScore = Number(localStorage.getItem(STORAGE_KEYS[state.vocabMode]) || 0);
      updateStartLegend();
      updateHud();
    });
  });

  diffButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      diffButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.difficulty = btn.dataset.diff;
    });
  });

  btnStart.addEventListener("click", startGame);
  btnPlayAgain.addEventListener("click", startGame);
  btnMenu.addEventListener("click", returnToMenu);
  btnRestartPause.addEventListener("click", returnToMenu);
  btnResume.addEventListener("click", resumeGame);

  btnPause.addEventListener("click", () => {
    if (state.mode === "playing") pauseGame();
    else if (state.mode === "paused") resumeGame();
  });

  btnMute.addEventListener("click", () => {
    const nextMuted = !window.NavidadAudio.isMuted();
    window.NavidadAudio.setMuted(nextMuted);
    btnMute.textContent = nextMuted ? "🔇" : "🔊";
    if (!nextMuted && state.mode === "playing" && optMusic.checked) {
      window.NavidadAudio.startMusic();
    }
  });

  window.addEventListener("keydown", handleKeyPress);
  window.addEventListener("resize", resizeCanvas);

  // Exponer solo lectura para inspección
  window.__NAVIDAD_GAME__ = {
    getState: () => ({
      mode: state.mode,
      vocabMode: state.vocabMode,
      score: state.score,
      lives: state.lives,
      wave: state.wave,
      streak: state.streak,
      wordsCompleted: state.wordsCompleted,
      freezeTimer: state.freezeTimer,
      meaningCorner: {
        visible: !elMeaningCorner.classList.contains("hidden"),
        state: elMeaningState.textContent,
        term: elMeaningTerm.textContent,
        def: elMeaningDef.textContent
      },
      items: state.items.map((i) => ({
        id: i.id,
        word: i.word,
        meaning: i.meaning,
        progress: i.progress,
        y: Math.round(i.y),
        powerup: i.powerup ? i.powerup.type : null
      }))
    })
  };
  resizeCanvas();
  updateHud();
  requestAnimationFrame(render);
})();
