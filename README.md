# Lantern Row — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/leopad12121/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/leopad12121/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A cozy spot-the-difference game set in a night-market street at dusk.
Two near-identical hand-drawn SVG scenes sit side by side — find the 7
hidden changes in each before the timer runs out.

- **Level 1 — Lantern Row:** a lantern-lit market street (a missing lantern,
  a changed sign character, a cat on the awning, a flipped fish, and more).
- **Level 2 — Harbour Dawn:** a fishing harbour at first light, with a
  harder set of 7 differences.

Found differences are marked with an expanding gold ring and a soft chime
(WebAudio oscillators — no audio files). Wrong clicks cost 5 seconds. Three
hints per level pulse the region of an unfound difference (20s cooldown).

## How to run

```sh
node serve.ts
```

Then open <http://localhost:8080> in a desktop browser.

## Controls

- **Mouse:** click a difference on either picture.
- **H:** hint · **R:** restart level · **Esc:** back to title.

## Screenshots

Deterministic scenes via URL query, no clicks needed:

- `?shot=start&seed=1` — title screen
- `?shot=play&seed=1` — mid-game, 3 of 7 found
- `?shot=end&seed=1` — level complete

## Layout

- `game/index.html` — page shell and styles
- `game/src/scenes.js` — the two original SVG scenes
- `game/src/differences.js` — difference data for both levels
- `game/src/game.js` — state, timer, scoring, hints, level flow
- `game/src/render.js` — panels, HUD, markers, overlays
- `game/src/audio.js` — WebAudio chimes
- `game/src/shots.js` — deterministic `?shot=` scenes
- `game/src/main.js` — entry point
- `main.ts` — hands the game in (copies `game/` and `screenshots/`, writes
  `dossier.json`)
- `serve.ts` — tiny static server for local play-testing

Everything is static files; the game makes no network requests. All art is
original inline SVG and all sounds are synthesized — no external images,
fonts, or audio.
