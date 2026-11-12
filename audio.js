// Motor de audio procedural navideño con Web Audio API (sin archivos externos)
window.NavidadAudio = (function () {
  let ctx = null;
  let muted = false;
  let musicEnabled = true;
  let musicTimer = null;
  let noteIndex = 0;

  // Melodía suave estilo caja de música ("Noche de Paz" / "Jingle Bells" híbrido festivo)
  const MELODY = [
    // Jingle Bells motivo
    { f: 659.25, d: 0.22 }, { f: 659.25, d: 0.22 }, { f: 659.25, d: 0.44 },
    { f: 659.25, d: 0.22 }, { f: 659.25, d: 0.22 }, { f: 659.25, d: 0.44 },
    { f: 659.25, d: 0.22 }, { f: 783.99, d: 0.22 }, { f: 523.25, d: 0.32 }, { f: 587.33, d: 0.14 },
    { f: 659.25, d: 0.65 }, { f: 0, d: 0.2 },
    { f: 698.46, d: 0.22 }, { f: 698.46, d: 0.22 }, { f: 698.46, d: 0.30 }, { f: 698.46, d: 0.16 },
    { f: 698.46, d: 0.22 }, { f: 659.25, d: 0.22 }, { f: 659.25, d: 0.22 }, { f: 659.25, d: 0.22 },
    { f: 659.25, d: 0.22 }, { f: 587.33, d: 0.22 }, { f: 587.33, d: 0.22 }, { f: 659.25, d: 0.22 },
    { f: 587.33, d: 0.44 }, { f: 783.99, d: 0.44 }, { f: 0, d: 0.35 }
  ];

  function ensureCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, duration, type = "sine", vol = 0.12, delay = 0, slideTo = null) {
    if (muted) return;
    const c = ensureCtx();
    if (!c) return;
    const now = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function keyHit(combo) {
    const pitchBoost = Math.min(combo, 25) * 14;
    playTone(580 + pitchBoost, 0.065, "triangle", 0.09);
    playTone(1160 + pitchBoost * 1.5, 0.04, "sine", 0.04);
  }

  function keyMiss() {
    playTone(170, 0.14, "sawtooth", 0.08, 0, 110);
  }

  function wordComplete(combo) {
    const base = 523.25 * (1 + Math.min(combo, 12) * 0.02);
    playTone(base, 0.11, "triangle", 0.12, 0);
    playTone(base * 1.25, 0.12, "triangle", 0.11, 0.055);
    playTone(base * 1.5, 0.18, "sine", 0.12, 0.11);
  }

  function powerup(kind) {
    if (kind === "freeze") {
      [880, 1046.5, 1318.5, 1567.98].forEach((f, i) =>
        playTone(f, 0.22, "sine", 0.09, i * 0.05)
      );
    } else if (kind === "clear") {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
        playTone(f, 0.18, "triangle", 0.12, i * 0.04)
      );
    } else {
      [440, 554.37, 659.25, 880].forEach((f, i) =>
        playTone(f, 0.2, "sine", 0.1, i * 0.06)
      );
    }
  }

  function lifeLost() {
    playTone(260, 0.2, "sawtooth", 0.1, 0, 140);
    playTone(190, 0.28, "triangle", 0.12, 0.1, 95);
  }

  function waveUp() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => playTone(f, 0.2, "triangle", 0.12, i * 0.08));
  }

  function gameOver() {
    const notes = [392, 349.23, 329.63, 261.63];
    notes.forEach((f, i) => playTone(f, 0.28, "triangle", 0.11, i * 0.14));
  }

  function scheduleNextMusicNote() {
    if (!musicEnabled || muted) return;
    const item = MELODY[noteIndex % MELODY.length];
    noteIndex++;
    if (item.f > 0) {
      playTone(item.f, item.d * 1.15, "sine", 0.032, 0);
      playTone(item.f * 0.5, item.d * 1.2, "triangle", 0.018, 0);
    }
    musicTimer = setTimeout(scheduleNextMusicNote, item.d * 1000);
  }

  function startMusic() {
    stopMusic();
    if (!musicEnabled || muted) return;
    ensureCtx();
    noteIndex = 0;
    scheduleNextMusicNote();
  }

  function stopMusic() {
    if (musicTimer) {
      clearTimeout(musicTimer);
      musicTimer = null;
    }
  }

  function setMuted(val) {
    muted = !!val;
    if (muted) stopMusic();
  }

  function setMusicEnabled(val) {
    musicEnabled = !!val;
    if (!musicEnabled) stopMusic();
  }

  return {
    ensureCtx,
    keyHit,
    keyMiss,
    wordComplete,
    powerup,
    lifeLost,
    waveUp,
    gameOver,
    startMusic,
    stopMusic,
    setMuted,
    setMusicEnabled,
    isMuted: () => muted,
    isMusicEnabled: () => musicEnabled
  };
})();
