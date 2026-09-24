"use client";

import { useState, useEffect } from "react";
import { getRiyadhNow } from "../agenda-data";

/**
 * Custom hook that provides the current Riyadh time in milliseconds,
 * updating every second. Only runs on the client to avoid hydration mismatches.
 */
export function useRiyadhTime(): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Use setTimeout for initial value to satisfy react-hooks/set-state-in-effect
    const initial = setTimeout(() => setNow(getRiyadhNow()), 10);
    const interval = setInterval(() => setNow(getRiyadhNow()), 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  return now;
}
