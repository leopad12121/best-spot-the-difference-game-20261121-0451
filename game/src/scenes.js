// Two original night-and-dawn scenes, drawn entirely as hand-authored inline
// SVG. buildScene(level, side) returns the full <svg> for one panel:
// side 'left' is the original, side 'right' carries the 7 hidden changes
// listed in differences.js. Scene space is 640x480 in both panels.
import { LEVELS } from './differences.js';

const SVG_OPEN = (uid) =>
  `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Spot the difference scene">`;

/** One paper lantern hanging from the wire at (x, y). */
function lantern(x, y, color) {
  return `<g>
    <line x1="${x}" y1="70" x2="${x}" y2="${y - 18}" stroke="#2c2440" stroke-width="2"/>
    <rect x="${x - 6}" y="${y - 20}" width="12" height="5" rx="2" fill="#8a6d3b"/>
    <ellipse cx="${x}" cy="${y}" rx="17" ry="20" fill="${color}" stroke="#b3541e" stroke-width="1.5"/>
    <line x1="${x - 8}" y1="${y - 14}" x2="${x - 8}" y2="${y + 14}" stroke="#b3541e" stroke-width="1" opacity="0.6"/>
    <line x1="${x + 8}" y1="${y - 14}" x2="${x + 8}" y2="${y + 14}" stroke="#b3541e" stroke-width="1" opacity="0.6"/>
    <line x1="${x}" y1="${y - 18}" x2="${x}" y2="${y + 18}" stroke="#b3541e" stroke-width="1" opacity="0.6"/>
    <rect x="${x - 6}" y="${y + 16}" width="12" height="5" rx="2" fill="#8a6d3b"/>
    <line x1="${x}" y1="${y + 21}" x2="${x}" y2="${y + 30}" stroke="#f2b544" stroke-width="2"/>
  </g>`;
}

/** A small sitting cat silhouette, facing left. */
function cat(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="#241d33">
    <path d="M0 0 C -14 -2 -20 -14 -18 -26 L -16 -34 L -10 -28 L -4 -34 L 0 -26 C 6 -24 8 -12 6 0 Z"/>
    <circle cx="-6" cy="-30" r="9"/>
    <path d="M-14 -36 L -12 -44 L -7 -38 Z M-2 -38 L 2 -45 L 5 -37 Z"/>
    <path d="M6 0 C 16 -2 20 -10 18 -18" fill="none" stroke="#241d33" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}

/** A hanging fish; flipped=true mirrors it upside down (the difference). */
function fish(x, y, flipped) {
  const inner = `<g>
    <ellipse cx="0" cy="0" rx="22" ry="10" fill="#c9d6e8" stroke="#5a6b84" stroke-width="1.5"/>
    <path d="M22 0 L34 -9 L34 9 Z" fill="#c9d6e8" stroke="#5a6b84" stroke-width="1.5"/>
    <circle cx="-10" cy="-2" r="2.5" fill="#241d33"/>
    <path d="M-2 -8 Q6 -4 14 -8" fill="none" stroke="#5a6b84" stroke-width="1.5"/>
  </g>`;
  const flip = flipped ? ' transform="rotate(180)"' : '';
  return `<g>
    <line x1="${x}" y1="238" x2="${x}" y2="${y - 12}" stroke="#2c2440" stroke-width="1.5"/>
    <g transform="translate(${x} ${y})"><g${flip}>${inner}</g></g>
  </g>`;
}

/** A four-point star that glows. */
function star(x, y, r = 4) {
  return `<g fill="#ffe9a8">
    <circle cx="${x}" cy="${y}" r="${r + 5}" opacity="0.25"/>
    <path d="M${x} ${y - r} L${x + 1.6} ${y - 1.6} L${x + r} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + r} L${x - 1.6} ${y + 1.6} L${x - r} ${y} L${x - 1.6} ${y - 1.6} Z"/>
  </g>`;
}

/** Level 1 — Lantern Row: a night-market street at dusk. */
function lanternRow(side, uid) {
  const right = side === 'right';
  const stripe = right ? '#2a9d8f' : '#d94f3d';
  const signChar = right ? '火' : '灯';
  const price = right ? '6' : '8';
  const lanternXs = right ? [90, 190, 390, 490] : [90, 190, 290, 390, 490];
  const stars = right
    ? [star(200, 40), star(320, 30), star(470, 44), star(560, 70)]
    : [star(92, 58), star(200, 40), star(320, 30), star(470, 44), star(560, 70)];
  const extraCat = right ? cat(472, 232, 0.9) : '';
  const awningStripes = [60, 85, 110, 135, 160, 185, 210, 235]
    .map((x, i) => {
      const color = x === 135 ? stripe : i % 2 === 0 ? '#d94f3d' : '#f6e3c5';
      return `<rect x="${x}" y="192" width="25" height="40" fill="${color}"/>`;
    })
    .join('');

  return `${SVG_OPEN(uid)}
  <defs>
    <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#232a4a"/><stop offset="0.55" stop-color="#6b4a72"/>
      <stop offset="0.85" stop-color="#c96f4a"/><stop offset="1" stop-color="#e89a5a"/>
    </linearGradient>
    <linearGradient id="street-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a3f5e"/><stop offset="1" stop-color="#2e2740"/>
    </linearGradient>
  </defs>
  <rect width="640" height="380" fill="url(#sky-${uid})"/>
  ${stars.join('')}
  <circle cx="560" cy="80" r="24" fill="#f7e8b0"/>
  <circle cx="552" cy="74" r="5" fill="#e8d18a"/><circle cx="568" cy="88" r="4" fill="#e8d18a"/>
  <path d="M0 360 L0 300 L60 300 L70 330 L150 320 L170 360 Z" fill="#332a4d"/>
  <path d="M470 360 L480 310 L540 310 L560 335 L620 320 L640 360 Z" fill="#2c2440"/>
  <rect y="360" width="640" height="120" fill="url(#street-${uid})"/>
  <ellipse cx="120" cy="420" rx="90" ry="10" fill="#241d33" opacity="0.5"/>
  <ellipse cx="520" cy="420" rx="100" ry="10" fill="#241d33" opacity="0.5"/>
  <line x1="20" y1="70" x2="620" y2="70" stroke="#1d1830" stroke-width="2.5"/>
  ${lanternXs.map((x) => lantern(x, 96, '#f2a03d')).join('')}
  ${cat(96, 296, 1)}
  <g>
    <rect x="70" y="232" width="6" height="128" fill="#5a4632"/>
    <rect x="250" y="232" width="6" height="128" fill="#5a4632"/>
    ${awningStripes}
    <rect x="60" y="192" width="200" height="40" fill="none" stroke="#8a6d3b" stroke-width="2"/>
    <line x1="150" y1="128" x2="150" y2="192" stroke="#2c2440" stroke-width="2"/>
    <rect x="120" y="128" width="60" height="40" rx="6" fill="#f6e3c5" stroke="#8a6d3b" stroke-width="2"/>
    <text x="150" y="157" text-anchor="middle" font-size="26" font-family="serif" fill="#8a2f23">${signChar}</text>
    <rect x="66" y="320" width="194" height="40" fill="#7a5a3a" stroke="#5a4632" stroke-width="2"/>
    <circle cx="100" cy="312" r="10" fill="#f28c2e"/><circle cx="124" cy="310" r="10" fill="#f2a03d"/>
    <circle cx="148" cy="312" r="10" fill="#f28c2e"/><circle cx="172" cy="310" r="10" fill="#f2a03d"/>
    <circle cx="196" cy="312" r="10" fill="#f28c2e"/>
    <rect x="232" y="318" width="40" height="28" rx="4" fill="#f6e3c5" stroke="#8a6d3b" stroke-width="2"/>
    <text x="252" y="339" text-anchor="middle" font-size="20" font-family="serif" fill="#8a2f23">${price}</text>
  </g>
  <g>
    <rect x="388" y="238" width="6" height="122" fill="#5a4632"/>
    <rect x="594" y="238" width="6" height="122" fill="#5a4632"/>
    <rect x="380" y="200" width="220" height="38" fill="#3f6d8e"/>
    <rect x="380" y="200" width="220" height="10" fill="#2f5470"/>
    ${extraCat}
    <rect x="384" y="322" width="212" height="38" fill="#7a5a3a" stroke="#5a4632" stroke-width="2"/>
    <rect x="400" y="300" width="34" height="22" fill="#8a6d3b" stroke="#5a4632" stroke-width="2"/>
    <rect x="444" y="300" width="34" height="22" fill="#8a6d3b" stroke="#5a4632" stroke-width="2"/>
    ${fish(522, 302, right)}
    <circle cx="560" cy="312" r="9" fill="#7fb3d5"/><circle cx="580" cy="312" r="9" fill="#7fb3d5"/>
  </g>
  <g fill="#241d33" opacity="0.35">
    <ellipse cx="90" cy="392" rx="14" ry="4"/><ellipse cx="220" cy="410" rx="16" ry="4"/>
    <ellipse cx="350" cy="396" rx="14" ry="4"/><ellipse cx="470" cy="414" rx="16" ry="4"/>
    <ellipse cx="600" cy="400" rx="14" ry="4"/>
  </g>
  <g>
    <ellipse cx="330" cy="442" rx="46" ry="8" fill="#f2a03d" opacity="0.22"/>
    <path d="M310 440 L310 424 Q330 416 350 424 L350 440 Z" fill="#8a6d3b" stroke="#5a4632" stroke-width="2"/>
    <circle cx="322" cy="420" r="6" fill="#f28c2e"/><circle cx="336" cy="418" r="6" fill="#f2a03d"/>
    <circle cx="348" cy="421" r="5" fill="#f28c2e"/>
  </g>
  </svg>`;
}

/** A gull in flight. */
function gull(x, y, s = 1) {
  return `<path d="M${x - 12 * s} ${y} Q${x - 5 * s} ${y - 8 * s} ${x} ${y} Q${x + 5 * s} ${y - 8 * s} ${x + 12 * s} ${y}"
    fill="none" stroke="#3a3a3a" stroke-width="2" stroke-linecap="round"/>`;
}

/** Level 2 — Harbour Dawn: a fishing harbour at first light. */
function harbourDawn(side, uid) {
  const right = side === 'right';
  const flag = right ? '#2a6db0' : '#d94f3d';
  const windowFill = right ? '#2c2440' : '#ffd97a';
  const beam = right
    ? ''
    : `<polygon points="132,146 330,112 330,182" fill="#ffe9a8" opacity="0.35"/>`;
  const extraGull = right ? gull(430, 80, 1) : '';
  const buoy = right
    ? ''
    : `<g><ellipse cx="540" cy="398" rx="16" ry="7" fill="#d94f3d"/><path d="M524 398 Q540 372 556 398 Z" fill="#e8734a"/><circle cx="540" cy="376" r="4" fill="#f2b544"/></g>`;
  const extraCrate = right
    ? `<rect x="292" y="366" width="40" height="30" fill="#8a6d3b" stroke="#5a4632" stroke-width="2"/><line x1="292" y1="381" x2="332" y2="381" stroke="#5a4632" stroke-width="2"/>`
    : '';
  const rope = right
    ? ''
    : `<g fill="none" stroke="#b08d57" stroke-width="3"><circle cx="200" cy="430" r="18"/><circle cx="200" cy="430" r="11"/><circle cx="200" cy="430" r="5"/></g>`;

  return `${SVG_OPEN(uid)}
  <defs>
    <linearGradient id="dawn-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7fb3d5"/><stop offset="0.55" stop-color="#f2c078"/>
      <stop offset="1" stop-color="#f2a65a"/>
    </linearGradient>
    <linearGradient id="sea-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a7a96"/><stop offset="1" stop-color="#2c4a63"/>
    </linearGradient>
  </defs>
  <rect width="640" height="300" fill="url(#dawn-${uid})"/>
  <circle cx="520" cy="90" r="30" fill="#ffdf8a"/>
  <g stroke="#ffdf8a" stroke-width="3" stroke-linecap="round">
    <line x1="520" y1="44" x2="520" y2="52"/><line x1="520" y1="128" x2="520" y2="136"/>
    <line x1="474" y1="90" x2="482" y2="90"/><line x1="558" y1="90" x2="566" y2="90"/>
  </g>
  <ellipse cx="180" cy="80" rx="70" ry="16" fill="#ffffff" opacity="0.75"/>
  <ellipse cx="230" cy="70" rx="46" ry="12" fill="#ffffff" opacity="0.75"/>
  <ellipse cx="420" cy="150" rx="60" ry="13" fill="#ffffff" opacity="0.6"/>
  ${gull(300, 70, 1)}${gull(360, 55, 0.85)}${extraGull}
  <rect y="300" width="640" height="180" fill="url(#sea-${uid})"/>
  <g stroke="#7fb3d5" stroke-width="2" opacity="0.5" fill="none">
    <path d="M40 330 Q90 324 140 330"/><path d="M300 350 Q360 344 420 350"/>
    <path d="M460 320 Q510 314 560 320"/><path d="M120 400 Q180 394 240 400"/>
  </g>
  <g>
    <rect x="86" y="150" width="40" height="210" fill="#e8e0d0" stroke="#8a6d3b" stroke-width="2"/>
    <rect x="80" y="132" width="52" height="20" rx="4" fill="#3a3a3a"/>
    <circle cx="106" cy="142" r="8" fill="#ffd97a"/>
    <rect x="96" y="120" width="20" height="14" rx="3" fill="#3a3a3a"/>
    <rect x="98" y="224" width="16" height="20" rx="3" fill="${windowFill}" stroke="#8a6d3b" stroke-width="1.5"/>
    <rect x="98" y="272" width="16" height="20" rx="3" fill="#ffd97a" stroke="#8a6d3b" stroke-width="1.5"/>
    ${beam}
    <rect x="70" y="356" width="72" height="14" fill="#8a6d3b"/>
  </g>
  <g>
    <path d="M330 330 L330 200 L334 200 L334 330 Z" fill="#5a4632"/>
    <polygon points="334,200 366,212 334,224" fill="${flag}"/>
    <path d="M300 330 L410 330 L392 356 L318 356 Z" fill="#7a4a2e" stroke="#5a3018" stroke-width="2"/>
    <path d="M310 330 L400 330 L396 340 L314 340 Z" fill="#8a5a3a"/>
    <rect x="336" y="312" width="34" height="18" fill="#3f6d8e"/>
  </g>
  <g>
    <rect x="150" y="400" width="490" height="26" fill="#8a6d3b" stroke="#5a4632" stroke-width="2"/>
    <rect x="150" y="426" width="490" height="14" fill="#7a5a3a"/>
    <g stroke="#5a4632" stroke-width="1.5"><line x1="230" y1="400" x2="230" y2="426"/><line x1="320" y1="400" x2="320" y2="426"/><line x1="410" y1="400" x2="410" y2="426"/><line x1="500" y1="400" x2="500" y2="426"/></g>
    <rect x="272" y="396" width="40" height="30" fill="#8a6d3b" stroke="#5a4632" stroke-width="2"/>
    <rect x="292" y="396" width="40" height="30" fill="#a07a45" stroke="#5a4632" stroke-width="2"/>
    ${extraCrate}
    ${rope}
    <circle cx="580" cy="392" r="8" fill="#7fb3d5"/><circle cx="600" cy="398" r="6" fill="#7fb3d5"/>
  </g>
  ${buoy}
  <g fill="#ffffff" opacity="0.5"><ellipse cx="240" cy="470" rx="60" ry="5"/><ellipse cx="480" cy="462" rx="70" ry="5"/></g>
  </svg>`;
}

const BUILDERS = { lantern: lanternRow, harbour: harbourDawn };

/** Full SVG markup for one panel of a level: side 'left' or 'right'. */
export function sceneSVG(levelIndex, side) {
  const level = LEVELS[levelIndex];
  const uid = `${level.scene}-${side}`;
  return BUILDERS[level.scene](side, uid);
}
