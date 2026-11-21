// Deterministic screenshot scenes behind ?shot=start|play|end (seed is
// accepted but the scenes are fixed, so every load renders the same frame).
//   start — the title screen over Level 1.
//   play  — Level 1 mid-game: exactly 3 differences found (gold rings on
//           them), 4 still unfound, counter "Found 3 / 7", timer at 2:37.
//   end   — Level 1 complete: all 7 marked, score and time shown.
// No clicks are needed: the query parameter alone stages the scene, and the
// timer is frozen so the frame never changes between loads.
import { LEVELS } from './differences.js';

const PLAY_FOUND = ['lantern', 'sign', 'cat'];
const PLAY_TIME_LEFT = 157; // 2:37
const END_TIME_LEFT = 98; // 1:38
const END_SCORE = 700 + END_TIME_LEFT;

export function shotFromURL(search) {
  const params = new URLSearchParams(search);
  return params.get('shot') || null;
}

/** Stage the game for the named shot and return true when one applied. */
export function stageShot(game, name) {
  if (name === 'start') {
    game.freeze();
    game.stage({
      screen: 'title',
      levelIndex: 0,
      found: new Set(),
      timeLeft: LEVELS[0].timeLimit,
      score: 0,
      hintsLeft: 3,
      hintCooling: 0,
    });
    return true;
  }
  if (name === 'play') {
    game.freeze();
    game.stage({
      screen: 'play',
      levelIndex: 0,
      found: new Set(PLAY_FOUND),
      timeLeft: PLAY_TIME_LEFT,
      score: PLAY_FOUND.length * 100,
      hintsLeft: 2,
      hintCooling: 0,
    });
    return true;
  }
  if (name === 'end') {
    game.freeze();
    game.stage({
      screen: 'levelComplete',
      levelIndex: 0,
      found: new Set(LEVELS[0].differences.map((d) => d.id)),
      timeLeft: END_TIME_LEFT,
      score: END_SCORE,
      hintsLeft: 3,
      hintCooling: 0,
    });
    return true;
  }
  return false;
}
