// Entry point: build the game, wire input, then either stage a deterministic
// screenshot scene (?shot=start|play|end) or show the title screen.
import { createGame } from './game.js';
import { bindInput } from './render.js';
import { shotFromURL, stageShot } from './shots.js';

const game = createGame();

bindInput({
  onPanelClick: (side, x, y) => game.onPanelClick(side, x, y),
  onHint: () => game.onHint(),
  onRestart: () => game.onRestart(),
  onEscape: () => game.onEscape(),
});

const shot = shotFromURL(window.location.search);
if (shot && stageShot(game, shot)) {
  // Screenshot scene staged; the timer stays frozen.
} else {
  game.showTitle();
}
