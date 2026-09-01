"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const SPLASH_BG = "#0c1018";

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  // Force background color on html/body while splash is showing
  useEffect(() => {
    if (!show) return;

    const html = document.documentElement;
    const body = document.body;
    const nextRoot = document.getElementById("__next");
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    const prevNextBg = nextRoot?.style.backgroundColor || "";

    html.style.backgroundColor = SPLASH_BG;
    body.style.backgroundColor = SPLASH_BG;
    if (nextRoot) nextRoot.style.backgroundColor = SPLASH_BG;

    return () => {
      html.style.backgroundColor = prevHtmlBg;
      body.style.backgroundColor = prevBodyBg;
      if (nextRoot) nextRoot.style.backgroundColor = prevNextBg;
    };
  }, [show]);

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
    <>
      <style jsx global>{`
        .splash-screen {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          min-height: 100vh;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: ${SPLASH_BG} !important;
          background-color: ${SPLASH_BG} !important;
          background-image: none !important;
          z-index: 99999;
        }

        .splash-content {
          position: relative;
          width: min(94vw, 820px);
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transform: translateY(-2vh);
        }

        .splash-character {
          width: clamp(230px, 18vw, 300px);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          margin-left: auto;
          margin-right: auto;
        }

        .splash-character img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          margin-inline: auto;
          background: transparent;
          border: 0;
          box-shadow: none;
          pointer-events: none;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        .splash-slogan {
          width: 100%;
          margin: 14px auto 0;
          padding: 0;
          text-align: center !important;
          direction: rtl;
          color: #fb50c3;
          font-family: var(--font-arapix);
          font-size: clamp(22px, 2.1vw, 34px);
          line-height: 1.6;
          white-space: nowrap;
          transform: none !important;
          position: static !important;
          margin-left: auto;
          margin-right: auto;
        }

        .splash-loading {
          width: min(88vw, 540px);
          margin: 24px auto 0;
          margin-left: auto;
          margin-right: auto;
        }

        .splash-loading-track {
          width: 100%;
          height: clamp(22px, 2vw, 30px);
          border: 3px solid #823419;
          background-color: rgba(130, 52, 25, 0.15);
          position: relative;
          overflow: hidden;
        }

        .splash-loading-status {
          font-size: clamp(13px, 1.1vw, 16px);
          color: rgba(231, 237, 253, 0.6);
          font-family: var(--font-janna);
        }

        .splash-loading-percentage {
          font-size: clamp(13px, 1.1vw, 16px);
          color: #c3f937;
          font-family: var(--font-arapix);
        }

        @media (max-width: 640px) {
          .splash-character {
            width: min(58vw, 220px);
          }

          .splash-slogan {
            width: 94vw;
            font-size: clamp(19px, 5vw, 25px);
            white-space: normal;
            text-wrap: balance;
            margin-top: 10px;
          }

          .splash-loading {
            width: min(86vw, 420px);
            margin-top: 22px;
          }
        }

        @media (max-height: 750px) {
          .splash-content {
            transform: scale(0.84);
            transform-origin: center;
          }
        }
      `}</style>

      <AnimatePresence>
        {show && (
          <motion.div
            className="splash-screen"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="splash-content">
              {/* Character */}
              <motion.div
                className="splash-character"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/side/splash-cropped.gif"
                  alt="BUILDx"
                />
              </motion.div>

              {/* Slogan as live text */}
              <motion.p
                className="splash-slogan"
                dir="rtl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                من برومبتٍ يُقال… إلى منتجٍ فعّال.
              </motion.p>

              {/* Loading */}
              <motion.div
                className="splash-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="splash-loading-track">
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                    }}
                  >
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          borderRight: "1px solid rgba(130, 52, 25, 0.2)",
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(to right, #c3f937, rgba(195, 249, 55, 0.8))",
                      transition: "width 200ms ease-out",
                      position: "relative",
                      width: `${progress}%`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.4,
                        background:
                          "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(12,16,24,0.3) 4px, rgba(12,16,24,0.3) 8px)",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <span className="splash-loading-status">
                    {t.splash.loading}
                  </span>
                  <span className="splash-loading-percentage">
                    {progress}%
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
