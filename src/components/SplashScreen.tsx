"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("buildx-splash-seen");
    if (seen) {
      setShow(false);
      onComplete();
      return;
    }

    const duration = 3000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);

      if (pct < 80) {
        setProgress(Math.floor(pct * 1.2375));
      } else if (pct < 98) {
        setProgress(99);
      } else {
        setProgress(100);
      }

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        sessionStorage.setItem("buildx-splash-seen", "true");
        setTimeout(() => {
          setShow(false);
          onComplete();
        }, 400);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg opacity-30" />

          {/* GIF Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-4"
          >
            <Image
              src="/assets/side/splash-animation.gif"
              alt="BUILDx"
              width={280}
              height={280}
              className="object-contain"
              unoptimized
              priority
            />
          </motion.div>

          {/* Slogan logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10 mb-8"
          >
            <Image
              src="/assets/logos/logo-white-slogan.png"
              alt="BUILDx - From a prompt you say to a product that works"
              width={220}
              height={60}
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 w-64 sm:w-80"
          >
            {/* Progress bar container */}
            <div className="relative h-6 border-3 border-primary bg-dark-secondary/30 overflow-hidden">
              {/* Pixel segments */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-dark/30"
                  />
                ))}
              </div>
              {/* Fill */}
              <div
                className="h-full bg-gradient-to-r from-lime to-lime/80 transition-all duration-200 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(12,16,24,0.3)_4px,rgba(12,16,24,0.3)_8px)]" />
              </div>
            </div>

            {/* Percentage */}
            <div className="flex justify-between items-center mt-2">
              <span
                className="text-xs text-light/60"
                style={{ fontFamily: "var(--font-janna)" }}
              >
                {t.splash.loading}
              </span>
              <span
                className="text-sm text-lime"
                style={{ fontFamily: "var(--font-arapix)" }}
              >
                {progress}%
              </span>
            </div>
          </motion.div>

          {/* Corner pixels */}
          <div className="absolute top-6 left-6 w-4 h-4 border-2 border-primary/40 opacity-50" />
          <div className="absolute top-6 right-6 w-4 h-4 border-2 border-lime/40 opacity-50" />
          <div className="absolute bottom-6 left-6 w-4 h-4 border-2 border-pink/40 opacity-50" />
          <div className="absolute bottom-6 right-6 w-4 h-4 border-2 border-primary/40 opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
