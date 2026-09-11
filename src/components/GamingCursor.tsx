"use client";

import { useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Ultra-lightweight gaming cursor — zero React re-renders during mouse movement.
 * All visual updates are done via direct DOM manipulation and CSS transforms
 * for GPU-accelerated compositing. No Framer Motion, no AnimatePresence.
 */
export default function GamingCursor() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const crossHRef = useRef<HTMLDivElement>(null);
  const crossVRef = useRef<HTMLDivElement>(null);

  // Smooth ring follow via lerp
  const ringPos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const isVisible = useRef(false);
  const isAdmin = pathname.startsWith("/admin");

  const tick = useCallback(() => {
    // Lerp ring towards cursor
    ringPos.current.x += (cursorPos.current.x - ringPos.current.x) * 0.18;
    ringPos.current.y += (cursorPos.current.y - ringPos.current.y) * 0.18;

    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px, 0)`;
    }

    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (isAdmin) return;

    // Only enable on non-touch devices with fine pointer
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    document.documentElement.style.cursor = "none";
    const style = document.createElement("style");
    style.id = "gaming-cursor-style";
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      cursorPos.current = { x, y };

      if (!isVisible.current) {
        isVisible.current = true;
        if (containerRef.current) containerRef.current.style.opacity = "1";
      }

      // Direct DOM updates — no React setState
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 5}px, ${y - 5}px, 0)`;
      }
      if (crossHRef.current) {
        crossHRef.current.style.transform = `translate3d(${x - 14}px, ${y}px, 0)`;
      }
      if (crossVRef.current) {
        crossVRef.current.style.transform = `translate3d(${x}px, ${y - 14}px, 0)`;
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (containerRef.current) containerRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible.current = true;
      if (containerRef.current) containerRef.current.style.opacity = "1";
    };

    const onMouseDown = () => {
      if (dotRef.current) {
        dotRef.current.style.backgroundColor = "#fb50c3";
        dotRef.current.style.boxShadow = "0 0 18px 6px rgba(251, 80, 195, 0.6)";
        dotRef.current.style.width = "14px";
        dotRef.current.style.height = "14px";
      }
      if (ringRef.current) {
        ringRef.current.style.borderColor = "rgba(251, 80, 195, 0.5)";
        ringRef.current.style.width = "28px";
        ringRef.current.style.height = "28px";
      }
    };

    const onMouseUp = () => {
      if (dotRef.current) {
        dotRef.current.style.backgroundColor = "#c3f937";
        dotRef.current.style.boxShadow = "0 0 12px 4px rgba(195, 249, 55, 0.6)";
        dotRef.current.style.width = "10px";
        dotRef.current.style.height = "10px";
      }
      if (ringRef.current) {
        ringRef.current.style.borderColor = "rgba(195, 249, 55, 0.3)";
        ringRef.current.style.width = "36px";
        ringRef.current.style.height = "36px";
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // Start animation loop
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafId.current);
      const s = document.getElementById("gaming-cursor-style");
      if (s) s.remove();
    };
  }, [isAdmin, tick]);

  if (isAdmin) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none hidden lg:block"
      style={{ opacity: 0, willChange: "auto" }}
    >
      {/* Outer glow ring (smooth lerp follow) */}
      <div
        ref={ringRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2px solid rgba(195, 249, 55, 0.3)",
          willChange: "transform",
          transition: "width 0.15s, height 0.15s, border-color 0.15s",
        }}
      />

      {/* Inner cursor dot (instant follow) */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#c3f937",
          boxShadow: "0 0 12px 4px rgba(195, 249, 55, 0.6)",
          willChange: "transform",
          transition: "background-color 0.12s, box-shadow 0.12s, width 0.12s, height 0.12s",
        }}
      />

      {/* Crosshair lines */}
      <div
        ref={crossHRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 28,
          height: 1,
          backgroundColor: "rgba(195, 249, 55, 0.15)",
          willChange: "transform",
        }}
      />
      <div
        ref={crossVRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 28,
          backgroundColor: "rgba(195, 249, 55, 0.15)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
