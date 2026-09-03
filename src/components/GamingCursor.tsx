"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

interface TrailDot {
  x: number;
  y: number;
  id: number;
}

export default function GamingCursor() {
  const pathname = usePathname();
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const lastTrailTime = useRef(0);

  const cursorX = useSpring(useMotionValue(-100), { stiffness: 280, damping: 22 });
  const cursorY = useSpring(useMotionValue(-100), { stiffness: 280, damping: 22 });

  // Disable on admin routes entirely
  const isAdmin = pathname.startsWith("/admin");

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setCursorPos({ x, y });
    cursorX.set(x);
    cursorY.set(y);
    setIsVisible(true);

    // Throttle trail dots to every 40ms for performance
    const now = Date.now();
    if (now - lastTrailTime.current > 40) {
      lastTrailTime.current = now;
      setTrail((prev) => [...prev.slice(-7), { x, y, id: now }]);
    }
  }, [cursorX, cursorY]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    setTrail([]);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  useEffect(() => {
    // Disable on admin routes
    if (isAdmin) return;

    // Only enable on non-touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    document.documentElement.style.cursor = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Also hide cursor on all interactive elements
    const style = document.createElement("style");
    style.id = "gaming-cursor-style";
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      const s = document.getElementById("gaming-cursor-style");
      if (s) s.remove();
    };
  }, [isAdmin, handleMouseMove, handleMouseLeave, handleMouseEnter, handleMouseDown, handleMouseUp]);

  if (isAdmin || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none hidden lg:block">
      {/* Trail rings — expanding fade out */}
      <AnimatePresence>
        {trail.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ opacity: 0.4, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute rounded-full border border-lime/30"
            style={{
              left: dot.x - 6,
              top: dot.y - 6,
              width: 12,
              height: 12,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Outer glow ring (smooth spring follow) */}
      <motion.div
        className="absolute rounded-full border-2 transition-colors duration-150"
        style={{
          left: cursorX,
          top: cursorY,
          width: isClicking ? 28 : 36,
          height: isClicking ? 28 : 36,
          x: isClicking ? -14 : -18,
          y: isClicking ? -14 : -18,
          borderColor: isClicking ? "rgba(251, 80, 195, 0.5)" : "rgba(195, 249, 55, 0.3)",
        }}
      />

      {/* Inner cursor dot (instant) */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: isClicking ? 1.6 : 1,
          boxShadow: isClicking
            ? "0 0 18px 6px rgba(251, 80, 195, 0.6)"
            : "0 0 12px 4px rgba(195, 249, 55, 0.6)",
          backgroundColor: isClicking ? "#fb50c3" : "#c3f937",
        }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        style={{
          left: cursorPos.x - 5,
          top: cursorPos.y - 5,
          width: 10,
          height: 10,
        }}
      />

      {/* Crosshair lines */}
      <div
        className="absolute bg-lime/15"
        style={{
          left: cursorPos.x - 14,
          top: cursorPos.y,
          width: 28,
          height: 1,
        }}
      />
      <div
        className="absolute bg-lime/15"
        style={{
          left: cursorPos.x,
          top: cursorPos.y - 14,
          width: 1,
          height: 28,
        }}
      />
    </div>
  );
}
