// Difference data for each level: where each hidden change lives in the
// 640x480 scene coordinates, and a short label shown on the win screen.
// The x/y/r circle is the click target on either panel.
export const LEVELS = [
  {
    name: 'Level 1 — Lantern Row',
    scene: 'lantern',
    timeLimit: 180,
    differences: [
      { id: 'lantern', x: 290, y: 96, r: 34, label: 'The middle lantern is gone' },
      { id: 'sign', x: 150, y: 148, r: 30, label: 'The sign character changed' },
      { id: 'cat', x: 472, y: 206, r: 32, label: 'A cat appeared on the awning' },
      { id: 'stripe', x: 138, y: 216, r: 30, label: 'An awning stripe changed colour' },
      { id: 'fish', x: 522, y: 302, r: 30, label: 'The hanging fish flipped over' },
      { id: 'star', x: 92, y: 58, r: 22, label: 'A star went out' },
      { id: 'price', x: 252, y: 332, r: 26, label: 'The stall price changed' },
    ],
  },
  {
    name: 'Level 2 — Harbour Dawn',
    scene: 'harbour',
    timeLimit: 180,
    differences: [
      { id: 'beam', x: 176, y: 148, r: 44, label: 'The lighthouse beam went dark' },
      { id: 'gull', x: 430, y: 80, r: 24, label: 'An extra gull joined the sky' },
      { id: 'flag', x: 372, y: 214, r: 26, label: 'The boat flag changed colour' },
      { id: 'buoy', x: 540, y: 392, r: 26, label: 'A buoy drifted away' },
      { id: 'crate', x: 312, y: 386, r: 30, label: 'An extra crate on the pier' },
      { id: 'window', x: 106, y: 232, r: 20, label: 'The lighthouse window went dark' },
      { id: 'rope', x: 200, y: 430, r: 26, label: 'The coiled rope is gone' },
    ],
  },
];

/** The difference under scene point (x, y) that is still unfound, or null. */
export function differenceAt(level, found, x, y) {
  for (const d of level.differences) {
    if (found.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return d;
  }
  return null;
}
