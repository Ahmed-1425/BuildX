import { useEffect, useRef, useState, useCallback } from 'react';
import type { HUDMode, MascotState } from './mobileNavigationConfig';

interface ScrollHUDState {
  mode: HUDMode;
  mascotState: MascotState;
  progress: number;
  isMobile: boolean;
  forceExpand: () => void;
}

export function useScrollHUD(currentPath: string): ScrollHUDState {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [mode, setMode] = useState<HUDMode>('expanded');
  const [mascotState, setMascotState] = useState<MascotState>('ready');
  const [progress, setProgress] = useState<number>(0);

  const prevScrollY = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockExpandedUntilRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Check mobile viewport breakpoint (< 768px)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Force expand immediately and lock for at least 1200ms
  const forceExpand = useCallback(() => {
    setMode('expanded');
    lockExpandedUntilRef.current = Date.now() + 1200;
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setMode('expanded');
    }

    const updateScrollHUD = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = Math.max(scrollHeight - clientHeight, 1);
      const normalizedProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const distanceToBottom = scrollHeight - (scrollY + clientHeight);
      const delta = scrollY - prevScrollY.current;

      setProgress(normalizedProgress);

      // 1. Calculate Mascot State (Section-aware with global scroll progress fallback)
      let nextMascot: MascotState = 'ready';

      // Section ID detection
      const elNama = document.getElementById('track-nama');
      const elSilsilah = document.getElementById('track-silsilah');
      const elMahara = document.getElementById('track-mahara');
      const elStage5 = document.getElementById('stage-section-5');
      const elStage4 = document.getElementById('stage-section-4');
      const elStage2 = document.getElementById('stage-section-2');
      const elStage1 = document.getElementById('stage-section-1');

      if (distanceToBottom <= 80 || normalizedProgress >= 0.94) {
        nextMascot = 'success';
      } else if (scrollY <= 24 || normalizedProgress < 0.15) {
        nextMascot = 'ready';
      } else if (elNama && elNama.getBoundingClientRect().top <= 320) {
        nextMascot = 'loading';
      } else if (elSilsilah && elSilsilah.getBoundingClientRect().top <= 320) {
        nextMascot = 'building';
      } else if (elMahara && elMahara.getBoundingClientRect().top <= 320) {
        nextMascot = 'thinking';
      } else if (elStage5 && elStage5.getBoundingClientRect().top <= 320) {
        nextMascot = 'success';
      } else if (elStage4 && elStage4.getBoundingClientRect().top <= 320) {
        nextMascot = 'loading';
      } else if (elStage2 && elStage2.getBoundingClientRect().top <= 320) {
        nextMascot = 'building';
      } else if (elStage1 && elStage1.getBoundingClientRect().top <= 320) {
        nextMascot = 'thinking';
      } else {
        // Threshold progress with small hysteresis
        if (normalizedProgress >= 0.70) {
          nextMascot = 'loading';
        } else if (normalizedProgress >= 0.38) {
          nextMascot = 'building';
        } else if (normalizedProgress >= 0.15) {
          nextMascot = 'thinking';
        } else {
          nextMascot = 'ready';
        }
      }

      setMascotState(nextMascot);

      // 2. Calculate Compact / Expanded Mode
      const isLocked = Date.now() < lockExpandedUntilRef.current;

      if (!prefersReducedMotion && !isLocked) {
        if (scrollY <= 24) {
          // Rule: Near top -> force expanded
          setMode('expanded');
        } else if (distanceToBottom <= 80) {
          // Rule: Near bottom -> force expanded + success
          setMode('expanded');
        } else if (delta > 6) {
          // Downward intentional scroll -> compact
          setMode('compact');
        } else if (delta < -6) {
          // Upward intentional scroll -> expand
          setMode('expanded');
        }
      }

      // 3. Idle Re-Expansion Timer
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      const idleDuration = distanceToBottom <= 80 ? 450 : 280;
      idleTimerRef.current = setTimeout(() => {
        setMode('expanded');
      }, idleDuration);

      prevScrollY.current = scrollY;
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updateScrollHUD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollHUD();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isMobile, currentPath]);

  return {
    mode,
    mascotState,
    progress,
    isMobile,
    forceExpand,
  };
}
