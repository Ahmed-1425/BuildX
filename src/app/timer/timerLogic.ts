/**
 * Pure timer logic for /timer — no React, no DOM.
 * Everything is derived from the number of whole seconds left (ceil of remaining ms),
 * which is exactly what the screen displays, so colour changes always match the visible digits.
 */

export type TimerKind = "five" | "two";
export type TimerStatus = "idle" | "running" | "paused" | "finished";
export type Phase = "green" | "orange" | "red" | "done";

export interface TimerConfig {
  label: string;
  durationSec: number;
  /** Phase turns orange when displayed seconds <= orangeAt (inclusive). */
  orangeAt: number;
  /** Phase turns red when displayed seconds <= redAt (inclusive). */
  redAt: number;
  support: Record<Phase, string>;
}

export const TIMERS: Record<TimerKind, TimerConfig> = {
  five: {
    label: "5 دقائق",
    durationSec: 300,
    orangeAt: 150, // 02:30
    redAt: 30, // 00:30
    support: {
      green: "كمّل، وقتك ممتاز",
      orange: "ابدأ بإنهاء أهم النقاط",
      red: "اختتم العرض الآن",
      done: "انتهى الوقت",
    },
  },
  two: {
    label: "دقيقتان",
    durationSec: 120,
    orangeAt: 60, // 01:00
    redAt: 20, // 00:20
    support: {
      green: "الوقت متاح",
      orange: "باقي دقيقة",
      red: "اختتم الآن",
      done: "انتهى الوقت",
    },
  },
};

export const PHASE_BADGE: Record<Phase, { icon: string; text: string }> = {
  green: { icon: "●", text: "الوقت متاح" },
  orange: { icon: "▲", text: "ابدأ بالاختتام" },
  red: { icon: "■", text: "اختتم الآن" },
  done: { icon: "■", text: "انتهى الوقت" },
};

export const durationMs = (kind: TimerKind) => TIMERS[kind].durationSec * 1000;

/** Whole seconds shown on screen. Never negative. */
export function secsFromMs(ms: number): number {
  return Math.max(0, Math.ceil(ms / 1000));
}

export function getPhase(kind: TimerKind, secs: number): Phase {
  const cfg = TIMERS[kind];
  if (secs <= 0) return "done";
  if (secs <= cfg.redAt) return "red";
  if (secs <= cfg.orangeAt) return "orange";
  return "green";
}

export function formatTime(secs: number): string {
  const s = Math.max(0, Math.floor(secs));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/** Persisted model. */
export interface TimerModel {
  kind: TimerKind;
  durationMs: number;
  status: TimerStatus;
  remainingMs: number;
  /** Absolute epoch ms when the timer ends — only while running. */
  endAt: number | null;
  sound: boolean;
}

export const STORAGE_KEY = "buildx-timer-v1";

export function initialModel(kind: TimerKind = "five", sound = true): TimerModel {
  return {
    kind,
    durationMs: durationMs(kind),
    status: "idle",
    remainingMs: durationMs(kind),
    endAt: null,
    sound,
  };
}

/** Remaining ms for a model at a given moment (running models use endAt). */
export function remainingAt(model: TimerModel, now: number): number {
  if (model.status === "running" && model.endAt !== null) {
    return Math.max(0, model.endAt - now);
  }
  if (model.status === "finished") return 0;
  return Math.max(0, model.remainingMs);
}

/** Validate + normalise something read from localStorage. Returns null if unusable. */
export function restoreModel(raw: unknown, now: number): TimerModel | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<TimerModel>;
  if (r.kind !== "five" && r.kind !== "two") return null;
  const status = r.status;
  if (
    status !== "idle" &&
    status !== "running" &&
    status !== "paused" &&
    status !== "finished"
  ) {
    return null;
  }
  const full = durationMs(r.kind);
  const sound = typeof r.sound === "boolean" ? r.sound : true;
  const base = { kind: r.kind, durationMs: full, sound };

  if (status === "finished") {
    return { ...base, status: "finished", remainingMs: 0, endAt: null };
  }
  if (status === "running") {
    if (typeof r.endAt !== "number" || !Number.isFinite(r.endAt)) return null;
    const rem = r.endAt - now;
    if (rem <= 0) {
      return { ...base, status: "finished", remainingMs: 0, endAt: null };
    }
    return { ...base, status: "running", remainingMs: Math.min(rem, full), endAt: r.endAt };
  }
  const rem =
    typeof r.remainingMs === "number" && Number.isFinite(r.remainingMs)
      ? Math.min(Math.max(r.remainingMs, 0), full)
      : full;
  if (status === "paused" && rem <= 0) {
    return { ...base, status: "finished", remainingMs: 0, endAt: null };
  }
  return { ...base, status, remainingMs: status === "idle" ? full : rem, endAt: null };
}

/** Which alert tone (if any) should play when going from prevSecs to nextSecs. */
export function crossedAlert(
  kind: TimerKind,
  prevSecs: number,
  nextSecs: number,
): 1 | 2 | 3 | 0 {
  const cfg = TIMERS[kind];
  if (prevSecs > 0 && nextSecs <= 0) return 3;
  if (prevSecs > cfg.redAt && nextSecs <= cfg.redAt) return 2;
  if (prevSecs > cfg.orangeAt && nextSecs <= cfg.orangeAt) return 1;
  return 0;
}
