// DOM rendering: draws both SVG panels, the HUD, the gold-ring markers,
// wrong-click X marks, hint pulses, and the title / win overlay cards.
import { sceneSVG } from './scenes.js';
import { LEVELS } from './differences.js';

const SCENE_WIDTH = 640;
const SCENE_HEIGHT = 480;

const $ = (id) => document.getElementById(id);
const holders = { left: $('holder-left'), right: $('holder-right') };

/** Format seconds as m:ss. */
export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Paint both panels for a level. */
export function drawScene(levelIndex) {
  holders.left.innerHTML = sceneSVG(levelIndex, 'left');
  holders.right.innerHTML = sceneSVG(levelIndex, 'right');
}

/** Refresh the HUD from the game state. */
export function updateHUD(state) {
  const level = LEVELS[state.levelIndex];
  $('level-name').textContent = level.name;
  $('found-counter').innerHTML = `Found <b>${state.found.size} / ${level.differences.length}</b>`;
  const timer = $('timer');
  timer.textContent = `⏱ ${formatTime(state.timeLeft)}`;
  timer.classList.toggle('low', state.timeLeft <= 30 && state.screen === 'play');
  $('score').innerHTML = `Score <b>${state.score}</b>`;
  const hint = $('hint-btn');
  hint.textContent = state.hintCooling > 0
    ? `💡 Hint (${Math.ceil(state.hintCooling)}s)`
    : `💡 Hint ×${state.hintsLeft}`;
  hint.disabled = state.hintsLeft <= 0 || state.hintCooling > 0 || state.screen !== 'play';
}

/** Convert a click on a panel SVG to 640x480 scene coordinates. */
export function clickToScene(svg, clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * SCENE_WIDTH,
    y: ((clientY - rect.top) / rect.height) * SCENE_HEIGHT,
  };
}

/** Draw an expanding gold ring on both panels at a found difference. */
export function addFoundRing(difference) {
  for (const side of ['left', 'right']) {
    const svg = holders[side].querySelector('svg');
    if (!svg) continue;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', difference.x);
    circle.setAttribute('cy', difference.y);
    circle.setAttribute('r', difference.r + 6);
    circle.setAttribute('class', 'ring');
    svg.appendChild(circle);
  }
}

/** Draw a soft grey X where a wrong click landed; it fades away. */
export function addWrongMark(side, x, y) {
  const svg = holders[side].querySelector('svg');
  if (!svg) return;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'wrong-x');
  const size = 12;
  g.innerHTML = `<line x1="${x - size}" y1="${y - size}" x2="${x + size}" y2="${y + size}"/>
    <line x1="${x + size}" y1="${y - size}" x2="${x - size}" y2="${y + size}"/>`;
  svg.appendChild(g);
  window.setTimeout(() => g.remove(), 950);
}

/** Briefly pulse the region of one unfound difference on both panels. */
export function pulseHint(difference) {
  for (const side of ['left', 'right']) {
    const svg = holders[side].querySelector('svg');
    if (!svg) continue;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', difference.x);
    circle.setAttribute('cy', difference.y);
    circle.setAttribute('r', difference.r + 8);
    circle.setAttribute('class', 'hint-pulse');
    svg.appendChild(circle);
    window.setTimeout(() => circle.remove(), 1600);
  }
}

/** Show an overlay card (title / level complete / game complete). */
export function showOverlay(html) {
  const overlay = $('overlay');
  overlay.innerHTML = `<div class="card">${html}</div>`;
  overlay.classList.add('open');
}

export function hideOverlay() {
  const overlay = $('overlay');
  overlay.classList.remove('open');
  overlay.innerHTML = '';
}

/** Announce a short status line for screen readers. */
export function announce(text) {
  $('status').textContent = text;
}

/** Wire clicks on both panels and the hint button to the game callbacks. */
export function bindInput(callbacks) {
  for (const side of ['left', 'right']) {
    holders[side].addEventListener('click', (event) => {
      const svg = holders[side].querySelector('svg');
      if (!svg) return;
      const point = clickToScene(svg, event.clientX, event.clientY);
      callbacks.onPanelClick(side, point.x, point.y);
    });
  }
  $('hint-btn').addEventListener('click', () => callbacks.onHint());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') callbacks.onHint();
    if (event.key === 'r' || event.key === 'R') callbacks.onRestart();
    if (event.key === 'Escape') callbacks.onEscape();
  });
}
