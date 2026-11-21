// Game state and rules: screens, timer, scoring, hints, level flow.
// Screens: 'title' | 'play' | 'levelComplete' | 'gameComplete' | 'timeUp'.
// A found difference is +100; finishing a level adds the seconds left as a
// bonus. A wrong click costs 5 seconds. Hints: 3 per level, 20s cooldown.
import { LEVELS, differenceAt } from './differences.js';
import { playFoundChime, playWrongThud, playWinFanfare } from './audio.js';
import {
  drawScene,
  updateHUD,
  addFoundRing,
  addWrongMark,
  pulseHint,
  showOverlay,
  hideOverlay,
  announce,
} from './render.js';

const HINT_COOLDOWN = 20;
const WRONG_CLICK_PENALTY = 5;
const POINTS_PER_FIND = 100;

export function createGame() {
  const state = {
    screen: 'title',
    levelIndex: 0,
    found: new Set(),
    timeLeft: LEVELS[0].timeLimit,
    score: 0,
    hintsLeft: 3,
    hintCooling: 0,
    levelScores: [],
    frozen: false, // shot mode: the timer never ticks
  };

  let timerId = null;

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (state.frozen) return;
    timerId = window.setInterval(() => {
      if (state.screen !== 'play') return;
      state.timeLeft -= 0.25;
      if (state.hintCooling > 0) state.hintCooling = Math.max(0, state.hintCooling - 0.25);
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        timeUp();
      }
      updateHUD(state);
    }, 250);
  }

  function showTitle() {
    state.screen = 'title';
    stopTimer();
    drawScene(0);
    updateHUD(state);
    showOverlay(`
      <h1>🏮 Lantern Row</h1>
      <p class="big">Spot the Difference</p>
      <p>Two pictures of the same street — but seven things changed.
         Find them all before the lanterns burn down.</p>
      <p class="sub">Level 1 · Lantern Row &nbsp;·&nbsp; Level 2 · Harbour Dawn<br>
         7 differences per level · 3:00 per level · 3 hints per level</p>
      <button type="button" id="start-btn">Start hunting</button>
      <p class="sub">Click a difference · H hint · R restart · Esc title</p>`);
    const button = document.getElementById('start-btn');
    if (button) button.addEventListener('click', () => startLevel(0));
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.timeLeft = LEVELS[index].timeLimit;
    state.hintsLeft = 3;
    state.hintCooling = 0;
    state.screen = 'play';
    hideOverlay();
    drawScene(index);
    updateHUD(state);
    announce(`${LEVELS[index].name}. Find 7 differences.`);
    startTimer();
  }

  function levelComplete() {
    state.screen = 'levelComplete';
    stopTimer();
    const bonus = Math.ceil(state.timeLeft);
    const levelScore = state.found.size * POINTS_PER_FIND + bonus;
    state.score += bonus;
    state.levelScores.push(levelScore);
    playWinFanfare();
    updateHUD(state);
    const list = LEVELS[state.levelIndex].differences
      .map((d) => `<li>${d.label}</li>`)
      .join('');
    const last = state.levelIndex === LEVELS.length - 1;
    showOverlay(`
      <h2>${last ? '🏆 You found them all!' : '🎉 Level complete!'}</h2>
      <p class="big">${LEVELS[state.levelIndex].name}</p>
      <div class="row">
        <div>Found<b>7 / 7</b></div>
        <div>Time left<b>${Math.ceil(state.timeLeft)}s</b></div>
        <div>Level score<b>${levelScore}</b></div>
      </div>
      <p class="sub">What changed:</p>
      <ul class="changes">${list}</ul>
      <button type="button" id="next-btn">${last ? 'See final score' : 'Next level →'}</button>`);
    const button = document.getElementById('next-btn');
    if (button) {
      button.addEventListener('click', () => {
        if (last) showFinal();
        else startLevel(state.levelIndex + 1);
      });
    }
  }

  function showFinal() {
    state.screen = 'gameComplete';
    const total = state.levelScores.reduce((a, b) => a + b, 0);
    const minutes = Math.floor(total / 60);
    showOverlay(`
      <h2>🏮 Lantern Row — Complete!</h2>
      <p class="big">You spotted all 14 differences.</p>
      <div class="row">
        <div>Total score<b>${total}</b></div>
        <div>Levels<b>2 / 2</b></div>
      </div>
      <p class="sub">Two quiet streets, fourteen small secrets — nicely hunted.</p>
      <button type="button" id="again-btn">Play again</button>`);
    const button = document.getElementById('again-btn');
    if (button) button.addEventListener('click', () => startLevel(0));
  }

  function timeUp() {
    state.screen = 'timeUp';
    stopTimer();
    updateHUD(state);
    showOverlay(`
      <h2>⏰ Time's up!</h2>
      <p class="big">You found ${state.found.size} of 7 differences.</p>
      <p>The lanterns burned down before the last secret showed itself.</p>
      <button type="button" id="retry-btn">Try this level again</button>`);
    const button = document.getElementById('retry-btn');
    if (button) button.addEventListener('click', () => startLevel(state.levelIndex));
  }

  function onPanelClick(side, x, y) {
    if (state.screen !== 'play') return;
    const level = LEVELS[state.levelIndex];
    const hit = differenceAt(level, state.found, x, y);
    if (hit) {
      state.found.add(hit.id);
      state.score += POINTS_PER_FIND;
      playFoundChime();
      addFoundRing(hit);
      announce(`Found ${state.found.size} of 7: ${hit.label}.`);
      updateHUD(state);
      if (state.found.size === level.differences.length) levelComplete();
    } else {
      state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_PENALTY);
      playWrongThud();
      addWrongMark(side, x, y);
      announce('Not a difference. Five seconds lost.');
      updateHUD(state);
      if (state.timeLeft <= 0) timeUp();
    }
  }

  function onHint() {
    if (state.screen !== 'play') return;
    if (state.hintsLeft <= 0 || state.hintCooling > 0) return;
    const level = LEVELS[state.levelIndex];
    const remaining = level.differences.filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.hintCooling = HINT_COOLDOWN;
    pulseHint(pick);
    announce('Hint: look where the gold ring pulses.');
    updateHUD(state);
  }

  function onRestart() {
    if (state.screen === 'play' || state.screen === 'timeUp') startLevel(state.levelIndex);
  }

  function onEscape() {
    if (state.screen !== 'title') showTitle();
  }

  return {
    state,
    showTitle,
    startLevel,
    onPanelClick,
    onHint,
    onRestart,
    onEscape,
    /** Freeze the timer (used by deterministic screenshot scenes). */
    freeze() {
      state.frozen = true;
      stopTimer();
    },
    /** Put the game into an exact staged state (used by shots.js). */
    stage(staged) {
      Object.assign(state, staged);
      drawScene(state.levelIndex);
      updateHUD(state);
      for (const id of state.found) {
        const d = LEVELS[state.levelIndex].differences.find((item) => item.id === id);
        if (d) addFoundRing(d);
      }
      if (state.screen === 'levelComplete') {
        // Re-show the win card without re-awarding the bonus.
        stopTimer();
        const bonus = Math.ceil(state.timeLeft);
        const levelScore = state.found.size * POINTS_PER_FIND + bonus;
        const list = LEVELS[state.levelIndex].differences
          .map((d) => `<li>${d.label}</li>`)
          .join('');
        showOverlay(`
          <h2>🎉 Level complete!</h2>
          <p class="big">${LEVELS[state.levelIndex].name}</p>
          <div class="row">
            <div>Found<b>7 / 7</b></div>
            <div>Time left<b>${Math.ceil(state.timeLeft)}s</b></div>
            <div>Level score<b>${levelScore}</b></div>
          </div>
          <p class="sub">What changed:</p>
          <ul class="changes">${list}</ul>
          <button type="button">Next level →</button>`);
      }
      if (state.screen === 'title') showTitle();
    },
  };
}
