// Tiny WebAudio sound effects: a two-note chime for a found difference, a
// soft low thud for a wrong click, and a little fanfare for a level win.
// No audio files — everything is an oscillator through a gain envelope.
let context = null;

function audioContext() {
  if (context === null) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

/** Play one sine note: frequency in Hz, starting at `when`, lasting `dur`. */
function note(ctx, frequency, when, dur, peak) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

/** Two-note rising chime (E5, then A5) for a found difference. */
export function playFoundChime() {
  const ctx = audioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  note(ctx, 659.25, now, 0.28, 0.22);
  note(ctx, 880.0, now + 0.09, 0.4, 0.22);
}

/** A soft low thud for a wrong click. */
export function playWrongThud() {
  const ctx = audioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  note(ctx, 155.56, now, 0.22, 0.16);
}

/** A short three-note fanfare for completing a level. */
export function playWinFanfare() {
  const ctx = audioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  note(ctx, 523.25, now, 0.22, 0.2);
  note(ctx, 659.25, now + 0.12, 0.22, 0.2);
  note(ctx, 783.99, now + 0.24, 0.5, 0.22);
}
