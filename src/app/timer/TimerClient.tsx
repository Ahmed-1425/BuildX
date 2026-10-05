"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  CircleHelp,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import "./timer.css";
import {
  PHASE_BADGE,
  STORAGE_KEY,
  TIMERS,
  crossedAlert,
  durationMs,
  formatTime,
  getPhase,
  initialModel,
  remainingAt,
  restoreModel,
  secsFromMs,
  type Phase,
  type TimerKind,
  type TimerModel,
} from "./timerLogic";
import { playAlert, playTones, unlockAudio } from "./timerAudio";

type Dialog =
  | { type: "help" }
  | { type: "reset" }
  | { type: "select"; kind: TimerKind }
  | null;

type WakeLockSentinelLike = { release: () => Promise<void> };
type FsDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
};
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void };

const MASCOT: Record<Phase, string> = {
  green: "/assets/characters/ready.png",
  orange: "/assets/characters/thinking.png",
  red: "/assets/characters/error.png",
  done: "/assets/characters/error.png",
};

const SHORTCUTS: Array<[string, string]> = [
  ["Space", "ابدأ / إيقاف مؤقت / متابعة"],
  ["R", "إعادة المؤقت"],
  ["5", "اختيار مؤقت 5 دقائق"],
  ["2", "اختيار مؤقت دقيقتين"],
  ["F", "ملء الشاشة"],
  ["M", "تشغيل أو كتم الصوت"],
  ["Esc", "الخروج من ملء الشاشة"],
  ["؟", "عرض هذه النافذة"],
];

const CONTROLS_HIDE_MS = 4000;

export default function TimerClient() {
  const [model, setModel] = useState<TimerModel>(() => initialModel());
  const [secs, setSecs] = useState<number>(() => TIMERS.five.durationSec);
  const [hydrated, setHydrated] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [isFs, setIsFs] = useState(false);
  const [cssImmersive, setCssImmersive] = useState(false);
  const [ctlVisible, setCtlVisible] = useState(true);
  const [pulse, setPulse] = useState<{ phase: Phase; n: number } | null>(null);
  const [announce, setAnnounce] = useState("");

  const modelRef = useRef(model);
  const secsRef = useRef(secs);
  const dialogRef = useRef<Dialog>(null);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const cssRef = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const actionsRef = useRef<{
    toggleMain: () => void;
    requestReset: () => void;
    requestSelect: (k: TimerKind) => void;
    toggleFs: () => void;
    toggleSound: () => void;
    openHelp: () => void;
    closeDialog: () => void;
    exitImmersive: () => boolean;
  } | null>(null);

  const immersive = isFs || cssImmersive;

  /* ───────────── core state commit ───────────── */
  const commit = useCallback((next: TimerModel) => {
    modelRef.current = next;
    setModel(next);
    const s = secsFromMs(remainingAt(next, Date.now()));
    secsRef.current = s;
    setSecs(s);
  }, []);

  /* ───────────── wake lock ───────────── */
  const releaseWakeLock = useCallback(() => {
    const lock = wakeLockRef.current;
    wakeLockRef.current = null;
    if (lock) lock.release().catch(() => {});
  }, []);

  const acquireWakeLock = useCallback(async () => {
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinelLike> };
      };
      if (!nav.wakeLock || wakeLockRef.current) return;
      if (document.visibilityState !== "visible") return;
      const lock = await nav.wakeLock.request("screen");
      if (modelRef.current.status !== "running") {
        lock.release().catch(() => {});
        return;
      }
      wakeLockRef.current = lock;
    } catch {
      /* unsupported or denied — keep working normally */
    }
  }, []);

  /* ───────────── live sync from timestamps ───────────── */
  const sync = useCallback(() => {
    const m = modelRef.current;
    if (m.status !== "running" || m.endAt === null) return;
    const now = Date.now();
    const remaining = m.endAt - now;
    const next = secsFromMs(remaining);
    const prev = secsRef.current;

    if (remaining <= 0) {
      const done: TimerModel = { ...m, status: "finished", remainingMs: 0, endAt: null };
      commit(done);
      if (m.sound) playAlert(3);
      setPulse({ phase: "done", n: now });
      setAnnounce("انتهى الوقت");
      return;
    }
    if (next === prev) return;

    secsRef.current = next;
    setSecs(next);
    const level = crossedAlert(m.kind, prev, next);
    if (level) {
      if (m.sound) playAlert(level);
      const ph = getPhase(m.kind, next);
      setPulse({ phase: ph, n: now });
      setAnnounce(`${PHASE_BADGE[ph].text}. ${TIMERS[m.kind].support[ph]}`);
    }
  }, [commit]);

  /* ───────────── actions ───────────── */
  const start = useCallback(() => {
    const m = modelRef.current;
    if (m.status !== "idle" && m.status !== "paused") return;
    const rem = m.remainingMs > 0 ? m.remainingMs : durationMs(m.kind);
    commit({ ...m, status: "running", remainingMs: rem, endAt: Date.now() + rem });
    setAnnounce(m.status === "paused" ? "تمت المتابعة" : "بدأ المؤقت");
  }, [commit]);

  const pause = useCallback(() => {
    const m = modelRef.current;
    if (m.status !== "running") return;
    const rem = remainingAt(m, Date.now());
    commit({ ...m, status: "paused", remainingMs: rem, endAt: null });
    setAnnounce("تم إيقاف المؤقت مؤقتًا");
  }, [commit]);

  const resetNow = useCallback(() => {
    const m = modelRef.current;
    commit(initialModel(m.kind, m.sound));
    setPulse(null);
    setAnnounce("تمت إعادة المؤقت");
  }, [commit]);

  const selectNow = useCallback(
    (kind: TimerKind) => {
      const m = modelRef.current;
      commit(initialModel(kind, m.sound));
      setPulse(null);
      setAnnounce(`تم اختيار مؤقت ${TIMERS[kind].label}`);
    },
    [commit],
  );

  const needsConfirm = () => {
    const s = modelRef.current.status;
    return s === "running" || s === "paused";
  };

  const requestReset = useCallback(() => {
    if (needsConfirm()) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setDialog({ type: "reset" });
    } else {
      resetNow();
    }
  }, [resetNow]);

  const requestSelect = useCallback(
    (kind: TimerKind) => {
      if (kind === modelRef.current.kind) return;
      if (needsConfirm()) {
        returnFocusRef.current = document.activeElement as HTMLElement | null;
        setDialog({ type: "select", kind });
      } else {
        selectNow(kind);
      }
    },
    [selectNow],
  );

  const toggleMain = useCallback(() => {
    const s = modelRef.current.status;
    if (s === "running") pause();
    else if (s === "finished") resetNow();
    else start();
  }, [pause, resetNow, start]);

  const toggleSound = useCallback(() => {
    unlockAudio();
    const m = modelRef.current;
    const next = { ...m, sound: !m.sound };
    commit(next);
    setAnnounce(next.sound ? "الصوت مفعّل" : "الصوت مكتوم");
    if (next.sound) playTones(1, 660);
  }, [commit]);

  const openHelp = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setDialog({ type: "help" });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
    const el = returnFocusRef.current;
    returnFocusRef.current = null;
    if (el && document.contains(el)) el.focus();
  }, []);

  const confirmDialog = useCallback(() => {
    const d = dialogRef.current;
    setDialog(null);
    returnFocusRef.current = null;
    if (d?.type === "reset") resetNow();
    else if (d?.type === "select") selectNow(d.kind);
  }, [resetNow, selectNow]);

  /* ───────────── fullscreen ───────────── */
  const exitImmersive = useCallback((): boolean => {
    const doc = document as FsDoc;
    let did = false;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      did = true;
      try {
        if (doc.exitFullscreen) void doc.exitFullscreen().catch(() => {});
        else doc.webkitExitFullscreen?.();
      } catch {
        /* ignore */
      }
    }
    if (cssRef.current) did = true;
    cssRef.current = false;
    setCssImmersive(false);
    return did;
  }, []);

  const toggleFs = useCallback(async () => {
    const doc = document as FsDoc;
    const inFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
    if (inFs || cssImmersive) {
      exitImmersive();
      return;
    }
    const el = document.documentElement as FsEl;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: "hide" });
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else {
        cssRef.current = true;
        setCssImmersive(true);
      }
    } catch {
      cssRef.current = true;
      setCssImmersive(true); // e.g. iPhone Safari: fall back to an in-page full view
    }
  }, [cssImmersive, exitImmersive]);

  /* ───────────── effects ───────────── */
  // keep latest actions for the (stable) keyboard listener
  useEffect(() => {
    actionsRef.current = {
      toggleMain,
      requestReset,
      requestSelect,
      toggleFs: () => void toggleFs(),
      toggleSound,
      openHelp,
      closeDialog,
      exitImmersive,
    };
  });

  useEffect(() => {
    dialogRef.current = dialog;
  }, [dialog]);

  // hydrate from localStorage (client only — keeps SSR markup deterministic)
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const restored = restoreModel(JSON.parse(raw), Date.now());
          if (restored) {
            commit(restored);
            if (restored.status === "finished") setAnnounce("انتهى الوقت");
          }
        }
      } catch {
        /* corrupt storage — start fresh */
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [commit]);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
    } catch {
      /* storage full / blocked */
    }
  }, [model, hydrated]);

  // single ticking interval, only while running
  useEffect(() => {
    if (model.status !== "running") return;
    const id = window.setInterval(sync, 250);
    return () => window.clearInterval(id);
  }, [model.status, sync]);

  // wake lock follows running state
  useEffect(() => {
    if (model.status === "running") void acquireWakeLock();
    else releaseWakeLock();
  }, [model.status, acquireWakeLock, releaseWakeLock]);

  // resync when the tab comes back; reacquire wake lock (browser drops it when hidden)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      sync();
      if (modelRef.current.status === "running") void acquireWakeLock();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [sync, acquireWakeLock]);

  // cleanup on leave
  useEffect(() => {
    const onHide = () => releaseWakeLock();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      releaseWakeLock();
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [releaseWakeLock]);

  // audio unlock on first user interaction
  useEffect(() => {
    const events = ["pointerdown", "keydown", "touchend"] as const;
    const unlock = () => {
      unlockAudio();
      events.forEach((e) => window.removeEventListener(e, unlock));
    };
    events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, unlock));
  }, []);

  // fullscreen state
  useEffect(() => {
    const onChange = () => {
      const doc = document as FsDoc;
      setIsFs(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // auto-hide controls while immersive
  useEffect(() => {
    if (!immersive) return;
    const arm = () => {
      setCtlVisible(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        if (!dialogRef.current) setCtlVisible(false);
      }, CONTROLS_HIDE_MS);
    };
    const first = window.setTimeout(arm, 0);
    const evs = ["pointermove", "pointerdown", "touchstart", "keydown"] as const;
    evs.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => {
      window.clearTimeout(first);
      evs.forEach((e) => window.removeEventListener(e, arm));
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [immersive]);

  // keyboard shortcuts
  useEffect(() => {
    const isTyping = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      if (!el || !el.tagName) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTyping(e.target)) return;
      const a = actionsRef.current;
      if (!a) return;

      if (e.key === "Escape") {
        if (dialogRef.current) {
          a.closeDialog();
          e.preventDefault();
        } else if (a.exitImmersive()) {
          e.preventDefault();
        }
        return;
      }
      if (dialogRef.current) return; // let dialog buttons handle keys

      switch (true) {
        case e.code === "Space" || e.key === " ":
          e.preventDefault();
          if (!e.repeat) a.toggleMain();
          break;
        case e.code === "KeyR":
          e.preventDefault();
          if (!e.repeat) a.requestReset();
          break;
        case e.code === "Digit5" || e.code === "Numpad5":
          a.requestSelect("five");
          break;
        case e.code === "Digit2" || e.code === "Numpad2":
          a.requestSelect("two");
          break;
        case e.code === "KeyF":
          if (!e.repeat) a.toggleFs();
          break;
        case e.code === "KeyM":
          if (!e.repeat) a.toggleSound();
          break;
        case e.key === "?" || e.key === "؟":
          e.preventDefault();
          a.openHelp();
          break;
        default:
      }
    };
    // Space on a focused button would otherwise also "click" it on keyup.
    const onKeyUp = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.key === " ") && !dialogRef.current && !isTyping(e.target)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  /* ───────────── derived view ───────────── */
  const kind = model.kind;
  const cfg = TIMERS[kind];
  const status = model.status;
  const phase = getPhase(kind, secs);
  const timeStr = formatTime(secs);
  const mm = Math.floor(secs / 60);
  const ss = secs % 60;
  const progress = Math.max(0, Math.min(1, secs / cfg.durationSec));

  let badgeIcon: string;
  let badgeText: string;
  let supportText: string;
  if (status === "idle") {
    badgeIcon = "●";
    badgeText = "جاهز";
    supportText = "اختر المدة ثم اضغط «ابدأ»";
  } else if (status === "paused") {
    badgeIcon = "❚❚";
    badgeText = "متوقف مؤقتًا";
    supportText = cfg.support[phase];
  } else {
    badgeIcon = PHASE_BADGE[phase].icon;
    badgeText = PHASE_BADGE[phase].text;
    supportText = cfg.support[phase];
  }
  // idle shows the green palette; paused keeps the current phase colour
  const dataPhase: Phase = phase;

  const mainLabel =
    status === "running"
      ? "إيقاف مؤقت"
      : status === "paused"
        ? "متابعة"
        : status === "finished"
          ? "إعادة المؤقت"
          : "ابدأ";
  const MainIcon =
    status === "running" ? Pause : status === "finished" ? RotateCcw : Play;

  const rootClass = [
    "tm-root",
    immersive ? "is-immersive" : "",
    immersive && !ctlVisible ? "ctl-hidden" : "",
    status === "finished" ? "is-done" : "",
    status === "running" ? "is-running" : "",
    status === "paused" ? "is-paused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClass}
      data-phase={dataPhase}
      data-status={status}
      data-kind={kind}
      data-hydrated={hydrated ? "1" : "0"}
      dir="rtl"
    >
      <div className="tm-bg" aria-hidden="true">
        <span className="tm-px tm-px--a" />
        <span className="tm-px tm-px--b" />
        <span className="tm-px tm-px--c" />
        <span className="tm-px tm-px--d" />
      </div>

      {/* ── Header ── */}
      <header className="tm-header">
        <Image
          src="/assets/logos/logo-white.png"
          alt="BUILDx"
          width={1092}
          height={259}
          priority
          className="tm-logo"
        />
        <h1 className="tm-title">مؤقت العروض</h1>
        <div className="tm-mascot" aria-hidden="true">
          <Image
            key={dataPhase}
            src={MASCOT[dataPhase]}
            alt=""
            width={96}
            height={100}
            className="tm-mascot__img"
          />
          {dataPhase === "done" && <span className="tm-stop" />}
        </div>
      </header>

      {/* ── Timer chooser ── */}
      <div className="tm-select" role="group" aria-label="اختيار المؤقت">
        {(Object.keys(TIMERS) as TimerKind[]).map((k) => (
          <button
            key={k}
            type="button"
            id={`timer-select-${k}`}
            className="tm-seg"
            aria-pressed={kind === k}
            aria-label={`اختيار مؤقت ${TIMERS[k].label}`}
            onClick={() => requestSelect(k)}
          >
            {TIMERS[k].label}
          </button>
        ))}
      </div>

      {/* ── Stage: the time ── */}
      <main className="tm-stage" id="timer-stage">
        {pulse && (
          <span
            key={pulse.n}
            className={`tm-ring tm-ring--${pulse.phase}`}
            aria-hidden="true"
          />
        )}
        <p className="tm-badge" id="timer-badge">
          <span className="tm-badge__icon" aria-hidden="true">
            {badgeIcon}
          </span>
          {badgeText}
        </p>

        <div className="tm-time-wrap">
          <div
            key={kind}
            id="timer-display"
            className="tm-time"
            dir="ltr"
            role="timer"
            aria-label={`الوقت المتبقي ${mm} دقيقة و ${ss} ثانية`}
            data-testid="timer-display"
          >
            {timeStr}
          </div>
        </div>

        <p className="tm-support" id="timer-support">
          {supportText}
        </p>

        <div
          className="tm-progress"
          aria-hidden="true"
          style={{ ["--tm-p" as string]: progress }}
        >
          <span className="tm-progress__bar" />
        </div>
      </main>

      {/* ── Controls ── */}
      <section className="tm-controls" aria-label="أزرار التحكم">
        <div className="tm-controls__main">
          <button
            type="button"
            id="timer-main-btn"
            className={`tm-btn tm-btn--primary ${status === "running" ? "is-pause" : ""}`}
            onClick={toggleMain}
            aria-label={mainLabel}
          >
            <MainIcon aria-hidden="true" size={26} strokeWidth={2.6} />
            <span>{mainLabel}</span>
          </button>
        </div>

        <div className="tm-controls__tools">
          <button
            type="button"
            id="timer-reset-btn"
            className="tm-btn tm-btn--danger"
            onClick={requestReset}
            aria-label="إعادة من البداية"
          >
            <RotateCcw aria-hidden="true" size={20} strokeWidth={2.6} />
            <span>إعادة من البداية</span>
          </button>

          <div className="tm-controls__side">
            <button
              type="button"
              id="timer-sound-btn"
              className={`tm-btn tm-btn--ghost ${model.sound ? "" : "is-muted"}`}
              onClick={toggleSound}
              aria-pressed={model.sound}
              aria-label={model.sound ? "الصوت مفعّل، اضغط للكتم" : "الصوت مكتوم، اضغط للتشغيل"}
            >
              {model.sound ? (
                <Volume2 aria-hidden="true" size={20} strokeWidth={2.4} />
              ) : (
                <VolumeX aria-hidden="true" size={20} strokeWidth={2.4} />
              )}
              <span>{model.sound ? "الصوت مفعّل" : "الصوت مكتوم"}</span>
            </button>

            <button
              type="button"
              id="timer-fullscreen-btn"
              className="tm-btn tm-btn--ghost"
              onClick={() => void toggleFs()}
              aria-label={immersive ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
            >
              {immersive ? (
                <Minimize aria-hidden="true" size={20} strokeWidth={2.4} />
              ) : (
                <Maximize aria-hidden="true" size={20} strokeWidth={2.4} />
              )}
              <span>{immersive ? "خروج من العرض" : "ملء الشاشة"}</span>
            </button>

            <button
              type="button"
              id="timer-help-btn"
              className="tm-btn tm-btn--ghost tm-btn--icon"
              onClick={openHelp}
              aria-label="اختصارات لوحة المفاتيح"
            >
              <CircleHelp aria-hidden="true" size={22} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Colour legend ── */}
      <ul className="tm-legend" aria-label="دليل الألوان">
        <li className="tm-legend__i tm-legend__i--green">
          <span aria-hidden="true">●</span> الأخضر: كمل عرضك
        </li>
        <li className="tm-legend__i tm-legend__i--orange">
          <span aria-hidden="true">▲</span> البرتقالي: ابدأ بإنهاء أهم النقاط
        </li>
        <li className="tm-legend__i tm-legend__i--red">
          <span aria-hidden="true">■</span> الأحمر: اختتم الآن
        </li>
      </ul>

      <div className="tm-sr" role="status" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      {/* ── Dialogs ── */}
      {dialog && (
        <DialogShell
          dialog={dialog}
          onClose={closeDialog}
          onConfirm={confirmDialog}
        />
      )}
    </div>
  );
}

function DialogShell({
  dialog,
  onClose,
  onConfirm,
}: {
  dialog: Exclude<Dialog, null>;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const isHelp = dialog.type === "help";

  useEffect(() => {
    const first = boxRef.current?.querySelector<HTMLElement>("[data-autofocus]");
    first?.focus();
  }, []);

  const trapTab = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const nodes = boxRef.current?.querySelectorAll<HTMLElement>("button");
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="tm-modal"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={boxRef}
        className="tm-dialog"
        role={isHelp ? "dialog" : "alertdialog"}
        aria-modal="true"
        aria-labelledby="tm-dialog-title"
        onKeyDown={trapTab}
      >
        {isHelp ? (
          <>
            <div className="tm-dialog__head">
              <h2 id="tm-dialog-title">اختصارات لوحة المفاتيح</h2>
              <button
                type="button"
                className="tm-btn tm-btn--ghost tm-btn--icon"
                onClick={onClose}
                aria-label="إغلاق"
                data-autofocus
              >
                <X aria-hidden="true" size={22} />
              </button>
            </div>
            <ul className="tm-keys">
              {SHORTCUTS.map(([k, d]) => (
                <li key={k}>
                  <kbd>{k}</kbd>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2 id="tm-dialog-title" className="tm-dialog__q">
              {dialog.type === "reset"
                ? "هل تريد إعادة المؤقت من البداية؟"
                : `هل تريد التبديل إلى مؤقت ${TIMERS[dialog.kind].label}؟ سيُعاد المؤقت الحالي من البداية.`}
            </h2>
            <div className="tm-dialog__actions">
              <button
                type="button"
                className="tm-btn tm-btn--ghost"
                onClick={onClose}
                data-autofocus
              >
                إلغاء
              </button>
              <button
                type="button"
                id="timer-confirm-btn"
                className="tm-btn tm-btn--danger-solid"
                onClick={onConfirm}
              >
                {dialog.type === "reset" ? "نعم، أعد" : "نعم، بدّل"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
