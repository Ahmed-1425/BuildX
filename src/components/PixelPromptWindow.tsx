"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function PixelPromptWindow() {
  const { t, locale } = useLanguage();
  const [phase, setPhase] = useState(0);
  const [displayText, setDisplayText] = useState("");

  const prompts = [t.hero.prompt1, t.hero.prompt2, t.hero.prompt3];

  useEffect(() => {
    setPhase(0);
    setDisplayText("");
  }, [locale]);

  useEffect(() => {
    const currentPrompt = prompts[phase];
    let charIndex = 0;
    setDisplayText("");

    const typeInterval = setInterval(() => {
      if (charIndex < currentPrompt.length) {
        setDisplayText(currentPrompt.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Wait before moving to next phase
        const waitTime = phase === 2 ? 4000 : 2000;
        setTimeout(() => {
          setPhase((prev) => (prev + 1) % 3);
        }, waitTime);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [phase, locale]);

  const statusColor =
    phase === 0
      ? "text-light/60"
      : phase === 1
      ? "text-yellow-400"
      : "text-lime";
  const statusText =
    phase === 0 ? "input" : phase === 1 ? "building" : "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="w-full max-w-md"
    >
      {/* Window title bar */}
      <div className="flex items-center justify-between bg-dark-secondary/60 border-2 border-b-0 border-primary/40 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink" />
          <div className="w-2 h-2 bg-lime" />
          <div className="w-2 h-2 bg-primary" />
        </div>
        <span
          className="text-[10px] text-light/40"
          style={{ fontFamily: "var(--font-arapix)" }}
        >
          prompt.buildx
        </span>
      </div>

      {/* Window body */}
      <div className="bg-dark/80 border-2 border-primary/40 p-4">
        <div className="flex items-start gap-2">
          <span
            className="text-lime text-sm flex-shrink-0"
            style={{ fontFamily: "var(--font-arapix)" }}
          >
            {">"}
          </span>
          <div className="min-h-[24px]">
            <span
              className="text-light text-sm"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {displayText}
            </span>
            <span className="inline-block w-2 h-4 bg-lime ml-0.5 animate-blink align-middle" />
          </div>
        </div>

        {/* Status line */}
        <div className="mt-3 flex items-center gap-2 border-t border-primary/20 pt-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              phase === 1 ? "bg-yellow-400 animate-pulse" : phase === 2 ? "bg-lime" : "bg-light/40"
            }`}
          />
          <span
            className={`text-[10px] ${statusColor}`}
            style={{ fontFamily: "var(--font-arapix)" }}
          >
            [{statusText}]
          </span>
        </div>
      </div>
    </motion.div>
  );
}
