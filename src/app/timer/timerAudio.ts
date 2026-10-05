/**
 * Tiny WebAudio helper for /timer. No audio files. Nothing plays until the user
 * has interacted with the page (the AudioContext is only created/resumed from a gesture).
 */

let ctx: AudioContext | null = null;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

/** Call from a user gesture (pointerdown / keydown / touchend). */
export function unlockAudio(): void {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext || (window as WebkitWindow).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    /* audio unavailable — ignore */
  }
}

/** Play `count` short soft beeps. Silently does nothing if audio is not unlocked. */
export function playTones(count: 1 | 2 | 3, freq: number): void {
  try {
    if (!ctx || ctx.state !== "running") return;
    const start = ctx.currentTime + 0.02;
    for (let i = 0; i < count; i++) {
      const t = start + i * 0.26;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  } catch {
    /* ignore */
  }
}

/** Alert level 1 = orange (light), 2 = red (two clear), 3 = finished (three). */
export function playAlert(level: 1 | 2 | 3): void {
  if (level === 1) playTones(1, 660);
  else if (level === 2) playTones(2, 880);
  else playTones(3, 988);
}
