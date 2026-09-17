"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useRegistrationStatus } from "@/context/RegistrationStatusContext";
import Image from "next/image";
import Link from "next/link";

// Available character states for playful user interaction
const CHARACTER_STATES = [
  { state: "ready", file: "/assets/characters/ready.png", label: "READY" },
  { state: "success", file: "/assets/characters/success.png", label: "WINK // +XP" },
  { state: "building", file: "/assets/characters/building.png", label: "BUILDING" },
  { state: "thinking", file: "/assets/characters/thinking.png", label: "THINKING" },
];

export default function HeroSection() {
  const { t, locale } = useLanguage();
  const { isOpen, openClosedModal } = useRegistrationStatus();
  const isRTL = locale === "ar";

  // Mouse Parallax tracking (reduced from 6 springs to 2 for performance)
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Only 2 springs: slow for background elements, fast for character
  const smoothXSlow = useSpring(mouseX, { stiffness: 50, damping: 25 });
  const smoothYSlow = useSpring(mouseY, { stiffness: 50, damping: 25 });
  const smoothXFast = useSpring(mouseX, { stiffness: 100, damping: 18 });
  const smoothYFast = useSpring(mouseY, { stiffness: 100, damping: 18 });

  // Interactive character state & XP particle effect
  const [charIndex, setCharIndex] = useState(1);
  const [xpFloats, setXpFloats] = useState<{ id: number; text: string; x: number; y: number }[]>([]);


  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCharacterClick = (e: React.MouseEvent) => {
    setCharIndex((prev) => (prev + 1) % CHARACTER_STATES.length);
    const newId = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    setXpFloats((prev) => [
      ...prev.slice(-3),
      {
        id: newId,
        text: charIndex === 0 ? "+500 XP! ⚡" : "+100 XP! 🚀",
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    ]);
  };

  // Automatically cycle character expressions every 5 seconds (reduced from 2s for perf)
  useEffect(() => {
    const autoCycleTimer = setInterval(() => {
      setCharIndex((prev) => (prev + 1) % CHARACTER_STATES.length);
    }, 5000);

    return () => clearInterval(autoCycleTimer);
  }, []);

  // Typing effect inside Code Fragment
  const fullCodeLines = [
    { prefix: 'prompt("ابنِ منتجًا فعّالاً")', color: "text-pink/90" },
    { prefix: "ai.synthesize(code);", color: "text-lime/90" },
    { prefix: "return product.deploy();", color: "text-yellow-400/90" },
  ];
  const [typedChars, setTypedChars] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < fullCodeLines.length) {
        if (charIdx < fullCodeLines[lineIdx].prefix.length) {
          charIdx++;
          setTypedChars((prev) => {
            const next = [...prev];
            next[lineIdx] = charIdx;
            return next;
          });
        } else {
          lineIdx++;
          charIdx = 0;
        }
      } else {
        // Pause and reset gently
        clearInterval(interval);
        setTimeout(() => {
          setTypedChars([0, 0, 0]);
        }, 3000);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [typedChars[0] === 0 && typedChars[1] === 0 && typedChars[2] === 0]);

  const scrollToJourney = () => {
    document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero-section relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-dark select-none pt-16 sm:pt-20 pb-16 lg:py-0"
    >
      {/* ============================================================ */}
      {/* 1. ATMOSPHERIC GAME WORLD: GRID, DEPTH LAYERS, SCANLINES      */}
      {/* ============================================================ */}

      {/* Retro Cyber Pixel Grid with Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(195, 249, 55, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(195, 249, 55, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0.1) 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0.1) 85%)",
        }}
      />

      {/* Subtle Digital Scanline Overlay for Retro Game Feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #e7edfd, #e7edfd 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Strategic Ambient Glows (Controlled, not blurry blobs) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-lime/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-pink/10 rounded-full blur-[100px] pointer-events-none" />


      {/* ============================================================ */}
      {/* 2. DEEP PARALLAX PIXEL ARTIFACTS (SPACED ACROSS THE CANVAS)  */}
      {/* ============================================================ */}

      {/* Far Background: Faint Pixel Star (Top Center-Right) — CSS animation only, no spring */}
      <motion.div
        className="absolute top-24 right-1/3 hidden md:block pointer-events-none z-0"
        animate={{ y: [0, -10, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/assets/icons/pixel/pixel-3-white.png"
          alt=""
          width={22}
          height={22}
          className="opacity-30 image-pixelated"
        />
      </motion.div>

      {/* Far Background: Volt Pixel (Bottom Left Edge) — CSS animation only */}
      <motion.div
        className="absolute bottom-28 left-12 hidden lg:block pointer-events-none z-0"
        animate={{ y: [0, 8, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/assets/icons/pixel/pixel-1-volt.png"
          alt=""
          width={20}
          height={20}
          className="opacity-25 image-pixelated"
        />
      </motion.div>

      {/* Mid-field: Neon Pink Gem (Top Far Left) — CSS animation only */}
      <motion.div
        className="absolute top-36 left-16 hidden lg:block pointer-events-none z-0"
        animate={{ y: [0, -12, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/assets/icons/pixel/pixel-2-pink.png"
          alt=""
          width={28}
          height={28}
          className="opacity-40 image-pixelated"
        />
      </motion.div>

      {/* Mid-field: Yellow Pixel Challenge Indicator (Bottom Right) — CSS animation only */}
      <motion.div
        className="absolute bottom-20 right-16 hidden lg:block pointer-events-none z-0"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/assets/icons/pixel/pixel-1-yellow.png"
          alt=""
          width={24}
          height={24}
          className="opacity-35 image-pixelated"
        />
      </motion.div>

      {/* ============================================================ */}
      {/* 3. MAIN HERO COMPOSITION (PLENTY OF BREATHING ROOM)           */}
      {/* ============================================================ */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 xl:gap-20 items-center">
          
          {/* -------------------------------------------------------- */}
          {/* RIGHT SIDE (Desktop leading) / TOP BLOCK (Mobile)         */}
          {/* -------------------------------------------------------- */}
          <div
            className={`w-full lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start lg:-mt-4 xl:-mt-6 ${
              isRTL ? "lg:text-right" : "lg:text-left"
            }`}
          >
            {/* Camp Info Badges (Location + Camp Type) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mb-4 lg:ps-8 xl:ps-12">
              <div className="location-badge">
                <Image
                  src="/assets/icons/location-white.png"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain shrink-0"
                />
                <span className="font-arapix text-xs sm:text-sm tracking-wide font-medium whitespace-nowrap">
                  {isRTL ? "حضوريًا في الرياض" : "In Person — Riyadh"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-lime/10 border border-lime/30 text-lime text-xs font-bold font-arapix tracking-wider min-h-[42px]">
                <span className="w-1.5 h-1.5 bg-lime rounded-full animate-ping" />
                <span>VIBE CODING CAMP ⚡</span>
              </div>
            </div>

            {/* BUILDx Glowing Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="mb-4 sm:mb-6 w-full flex justify-center lg:justify-start lg:ps-8 xl:ps-12"
            >
              <Image
                src="/assets/logos/logo-white-glow.png"
                alt="BUILDx"
                width={1151}
                height={328}
                priority
                className="w-64 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[34rem] h-auto object-contain drop-shadow-[0_0_20px_rgba(195,249,55,0.3)] mx-auto lg:mx-0"
              />
            </motion.div>

            {/* THE OFFICIAL TAGLINE IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 sm:mb-8 lg:mb-10 w-full"
            >
              <h1 className="flex justify-center lg:justify-start lg:ps-12 xl:ps-16">
                <span className="sr-only">من برومبتٍ يُقال… إلى منتجٍ فعّال!</span>
                <Image
                  src="/assets/logos/slogan.png"
                  alt="من برومبتٍ يُقال… إلى منتجٍ فعّال!"
                  width={1092}
                  height={96}
                  priority
                  className="w-full max-w-[280px] sm:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain image-pixelated drop-shadow-[0_0_25px_rgba(251,80,195,0.4)] mx-auto lg:mx-0"
                />
              </h1>
            </motion.div>

            {/* Description Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
              className="text-base sm:text-lg text-light/80 max-w-[440px] lg:max-w-xl xl:max-w-2xl leading-relaxed lg:ps-12 xl:ps-16 mx-auto lg:mx-0"
              style={{ fontFamily: "var(--font-janna)", marginBottom: "48px" }}
            >
              {t.hero.description}
            </motion.p>

            {/* Notice when registration is closed */}
            {isOpen === false && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-semibold mb-4 w-fit mx-auto lg:mx-0 shadow-lg shadow-rose-950/20"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                <div>
                  <strong className="text-white block sm:inline ml-1 font-bold">
                    {locale === "ar" ? "تم إغلاق التسجيل:" : "Registration Closed:"}
                  </strong>
                  <span>
                    {locale === "ar"
                      ? "نعتذر، تم إغلاق التسجيل في معسكر BUILDx."
                      : "Sorry, registration for the BUILDx Camp is now closed."}
                  </span>
                </div>
              </motion.div>
            )}

            {/* 4. Gaming CTA Group with Guaranteed Clean Separation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:flex lg:flex-row items-center gap-4 sm:gap-6 w-full max-w-[460px] lg:max-w-none mb-10 sm:mb-14 lg:mb-16 lg:ps-12 xl:ps-16 mx-auto lg:mx-0"
              style={{ marginTop: "16px" }}
            >
              {/* Primary Action: START / PLAY or CLOSED */}
              {isOpen === false ? (
                <button
                  type="button"
                  onClick={openClosedModal}
                  className="group relative flex items-center justify-center gap-4 px-6 sm:px-7 w-full lg:w-64 min-h-[54px] sm:h-14 bg-gradient-to-r from-rose-500/20 via-rose-500/30 to-pink-500/20 text-white text-base sm:text-lg font-bold border-2 border-rose-500/60 shadow-[5px_5px_0px_0px_#34155f] hover:shadow-[0_0_25px_rgba(244,63,94,0.5),8px_8px_0px_0px_#34155f] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 transition-all duration-150 cursor-pointer overflow-hidden backdrop-blur-md"
                  style={{ fontFamily: "var(--font-janna-bold)" }}
                  title={locale === "ar" ? "التسجيل مغلق حاليًا" : "Registration Closed"}
                >
                  <span className="w-5 h-5 flex items-center justify-center bg-rose-500/40 text-rose-200 text-xs font-black shrink-0">
                    ✕
                  </span>
                  <span className="leading-none pt-0.5 tracking-wide text-white font-black">
                    {locale === "ar" ? "التسجيل مغلق" : "Registration Closed"}
                  </span>
                </button>
              ) : (
                <Link
                  href="/register"
                  className="group relative flex items-center justify-center gap-4 px-6 sm:px-7 w-full lg:w-64 min-h-[54px] sm:h-14 bg-gradient-to-r from-lime via-lime to-[#aef01e] text-dark text-base sm:text-lg font-bold border-2 border-lime shadow-[5px_5px_0px_0px_#34155f] hover:shadow-[0_0_25px_rgba(195,249,55,0.7),8px_8px_0px_0px_#34155f] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_#34155f] transition-all duration-150 cursor-pointer overflow-hidden backdrop-blur-md"
                  style={{ fontFamily: "var(--font-janna-bold)" }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: "repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 3px)",
                    }}
                  />
                  <span className="absolute top-0.5 right-2 text-[8px] font-bold tracking-widest text-dark/70 font-arapix">
                    ACT.01
                  </span>
                  <span className="absolute bottom-0 left-0 w-2 h-2 bg-dark" />
                  
                  <span className="w-5 h-5 flex items-center justify-center bg-dark text-lime text-xs font-black group-hover:scale-125 transition-transform duration-200 shrink-0">
                    ▶
                  </span>
                  
                  <span className="leading-none pt-0.5 tracking-wide text-dark font-black drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                    {t.hero.registerBtn}
                  </span>
                  
                  <span className="w-1.5 h-1.5 bg-dark rounded-full animate-ping ml-0.5 shrink-0" />
                </Link>
              )}

              {/* Secondary Action: QUEST LOG / JOURNEY */}
              <button
                type="button"
                onClick={scrollToJourney}
                className="group relative flex items-center justify-center gap-4 px-6 sm:px-7 w-full lg:w-64 min-h-[54px] sm:h-14 bg-dark/85 hover:bg-dark-secondary/80 text-light text-base sm:text-lg font-bold border-2 border-primary/60 hover:border-lime hover:text-lime shadow-[5px_5px_0px_0px_#180b33] hover:shadow-[0_0_25px_rgba(195,249,55,0.4),8px_8px_0px_0px_#34155f] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 transition-all duration-150 cursor-pointer overflow-hidden backdrop-blur-md"
                style={{ fontFamily: "var(--font-janna-bold)" }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-15"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 4px)",
                  }}
                />
                <span className="absolute top-0.5 right-2 text-[8px] font-bold tracking-widest text-light/40 font-arapix group-hover:text-lime/70 transition-colors">
                  LOG // QST
                </span>
                <span className="absolute top-0 left-0 w-2 h-2 bg-primary/40 group-hover:bg-lime transition-colors" />
                
                <span className="text-lime text-base group-hover:rotate-45 group-hover:scale-125 transition-all duration-200 shrink-0">
                  ✦
                </span>
                
                <span className="leading-none pt-0.5 tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(195,249,55,0.6)]">
                  {t.hero.exploreBtn}
                </span>
              </button>
            </motion.div>

            {/* Micro decorative element balancing the height on desktop */}
            <div className="hidden lg:flex items-center gap-3 mb-4 lg:ps-12 xl:ps-16 text-light/20 text-[10px] select-none">
              <span className="w-1.5 h-1.5 bg-primary/40 inline-block" />
              <span className="h-[1px] w-24 bg-gradient-to-r from-primary/40 via-lime/20 to-transparent" />
              <span className="font-mono text-[9px] tracking-widest text-light/30">SYSTEM_READY</span>
            </div>

            {/* 5. Micro Gaming Telemetry Bar (Desktop Status Bar) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="hidden lg:flex flex-wrap items-center justify-start gap-4 sm:gap-5 text-xs sm:text-[13px] text-light/70 pt-4 border-t-2 border-primary/30 w-full max-w-xl lg:ms-12 xl:ms-16 bg-dark/40 px-3 py-2 border border-primary/20 shadow-[2px_2px_0px_0px_rgba(52,21,95,0.5)]"
              style={{ fontFamily: "var(--font-arapix)" }}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime" />
                </span>
                <span className="tracking-wider text-light/90 font-medium">AI</span>
              </div>
              <span className="text-light/25">•</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink inline-block animate-pulse" />
                <span className="tracking-wider text-light/90">VIBE CODING MODE</span>
              </div>
              <span className="text-light/25">•</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 inline-block" />
                <span className="tracking-wider text-light/90">CO-OP HACKATHON</span>
              </div>
              <span className="text-light/25">•</span>
              <div className="flex items-center gap-1.5 text-lime font-bold">
                <span>XP +100</span>
              </div>
            </motion.div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* LEFT SIDE (Desktop) / BOTTOM STACK (Mobile)              */}
          {/* Cleanly stacked on mobile: Character, then Code Window   */}
          {/* -------------------------------------------------------- */}
          <div className="w-full lg:col-span-5 relative flex flex-col items-center justify-center min-h-[auto] lg:min-h-[540px] mt-4 lg:mt-0">
            
            {/* Holographic Ground Pedestal on Desktop */}
            <div className="hidden lg:block absolute bottom-6 w-64 sm:w-80 h-16 rounded-[100%] border-2 border-lime/30 bg-gradient-to-t from-lime/10 to-transparent blur-[1px] pointer-events-none transform -rotate-x-45" />

            {/* Decorative Element 1: Magic Wand (Subtle on corners) */}
            <motion.div
              className="absolute -top-6 left-4 lg:-top-10 lg:left-1/2 lg:-translate-x-1/2 z-10 pointer-events-none opacity-40 lg:opacity-75"
              animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative">
                <Image
                  src="/assets/icons/magic-wand.png"
                  alt=""
                  width={34}
                  height={34}
                  className="object-contain drop-shadow-[0_0_12px_rgba(251,80,195,0.5)]"
                />
              </div>
            </motion.div>

            {/* Main Floating Character (Centered, proportional on mobile) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 flex flex-col items-center w-full max-w-[260px] sm:max-w-[290px] lg:max-w-none my-2 lg:my-0"
            >
              {/* Floating Player HUD Status Tag above character */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-3 px-3 py-1 bg-dark/95 border-2 border-lime/50 shadow-[3px_3px_0px_#34155f] text-[10px] sm:text-[11px] text-lime flex items-center gap-2 pointer-events-none"
                style={{ fontFamily: "var(--font-arapix)" }}
              >
                <span className="w-2 h-2 bg-lime rounded-full animate-ping inline-block" />
                <span>PLAYER 01 // {CHARACTER_STATES[charIndex].label}</span>
                <span className="text-pink font-bold">LVL 99</span>
              </motion.div>

              {/* Interactive Character */}
              <div
                onClick={handleCharacterClick}
                className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 group"
                title="اضغط للتفاعل مع الشخصية!"
              >
                <div className="absolute inset-0 bg-lime/20 rounded-full blur-2xl group-hover:bg-lime/35 transition-colors" />

                <Image
                  src={CHARACTER_STATES[charIndex].file}
                  alt="BUILDx Player"
                  width={220}
                  height={220}
                  priority
                  className="relative z-10 w-44 sm:w-52 lg:w-[220px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] select-none image-pixelated mx-auto"
                />

                {/* Interactive Click Hint */}
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-dark-secondary/90 border border-pink/40 text-[9px] text-pink opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                  style={{ fontFamily: "var(--font-arapix)" }}
                >
                  PRESS TO BUILD ⚡
                </div>

                {/* Floating XP particles on click */}
                <AnimatePresence>
                  {xpFloats.map((xp) => (
                    <motion.div
                      key={xp.id}
                      initial={{ opacity: 1, y: 0, scale: 0.9 }}
                      animate={{ opacity: 0, y: -60, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute z-30 pointer-events-none text-lime font-bold text-sm drop-shadow-[0_0_8px_#c3f937]"
                      style={{
                        left: xp.x,
                        top: xp.y,
                        fontFamily: "var(--font-arapix)",
                      }}
                    >
                      {xp.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Floating 3D Bubble with {X} (Edge decoration, desktop only or unobtrusive) */}
            <motion.div
              className="hidden lg:block absolute top-2 -left-8 sm:-left-6 z-30 pointer-events-none"
              animate={{ y: [0, -10, 0], rotate: [-5, 3, -5] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative">
                <Image
                  src="/assets/characters/chat/bubble-x.png"
                  alt="BUILDx X Bubble"
                  width={84}
                  height={70}
                  className="object-contain drop-shadow-[0_10px_20px_rgba(52,21,95,0.6)] image-pixelated"
                />
                <span
                  className="absolute -bottom-2 -right-1 px-1.5 py-0.2 bg-dark border border-lime/40 text-[8px] text-lime font-bold"
                  style={{ fontFamily: "var(--font-arapix)" }}
                >
                  PROMPT
                </span>
              </div>
            </motion.div>

            {/* Diamond Icon (Desktop only) */}
            <motion.div
              className="hidden lg:block absolute bottom-8 -left-6 sm:left-0 z-25 pointer-events-none"
              animate={{ y: [0, -7, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="p-2 bg-dark/80 border border-lime/30 shadow-[3px_3px_0px_#34155f] backdrop-blur-sm">
                <Image
                  src="/assets/icons/diamond.png"
                  alt=""
                  width={28}
                  height={28}
                  className="object-contain drop-shadow-[0_0_8px_rgba(195,249,55,0.4)]"
                />
              </div>
            </motion.div>

            {/* Retro Prompt/Code Window (Desktop positioned on corner; Mobile positioned naturally below character) */}
            <motion.div
              className="relative lg:absolute lg:-bottom-8 lg:-right-4 xl:right-2 z-30 pointer-events-none w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[270px] mt-4 lg:mt-0"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bg-dark/95 border-2 border-primary/60 shadow-[4px_4px_0px_0px_#34155f] p-3 sm:p-3.5 w-full backdrop-blur-md mx-auto">
                <div
                  className="flex items-center justify-between pb-1.5 mb-2 border-b border-primary/40 text-[9px] text-light/50"
                  style={{ fontFamily: "var(--font-arapix)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-pink inline-block animate-pulse" />
                    <span>PROMPT.ENGINE</span>
                  </span>
                  <span className="text-lime flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-lime rounded-full animate-ping inline-block" />
                    RUNNING
                  </span>
                </div>

                <div className="font-mono text-[11px] leading-snug space-y-1 min-h-[58px]">
                  <div className="text-pink/90">
                    &gt; <span className="text-light">{fullCodeLines[0].prefix.slice(0, typedChars[0])}</span>
                    {typedChars[0] < fullCodeLines[0].prefix.length && (
                      <span className="inline-block w-1.5 h-3 bg-pink ml-0.5 animate-pulse" />
                    )}
                  </div>
                  <div className="text-lime/90">
                    {typedChars[1] > 0 && (
                      <>
                        &gt; {fullCodeLines[1].prefix.slice(0, typedChars[1])}
                        {typedChars[1] < fullCodeLines[1].prefix.length && (
                          <span className="inline-block w-1.5 h-3 bg-lime ml-0.5 animate-pulse" />
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-yellow-400/90">
                    {typedChars[2] > 0 && (
                      <>
                        &gt; {fullCodeLines[2].prefix.slice(0, typedChars[2])}
                        {typedChars[2] < fullCodeLines[2].prefix.length && (
                          <span className="inline-block w-1.5 h-3 bg-yellow-400 ml-0.5 animate-pulse" />
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-primary/30 flex items-center justify-between text-[9px] font-arapix">
                  <span className="text-light/50">BUILD_STATE:</span>
                  <span className="text-lime font-bold">100% COMPLETE 🚀</span>
                </div>
              </div>
            </motion.div>

            {/* Stars Pair decoration (Desktop only) */}
            <motion.div
              className="hidden lg:block absolute -top-4 -right-2 sm:right-6 z-15 pointer-events-none"
              animate={{ y: [0, -6, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/assets/icons/stars-pair.png"
                alt=""
                width={36}
                height={36}
                className="object-contain opacity-70 drop-shadow-[0_0_10px_rgba(195,249,55,0.4)]"
              />
            </motion.div>

          </div>

        </div>
      </div>

      {/* Bottom subtle fade transition to subsequent sections */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark to-transparent pointer-events-none" />

    </section>
  );
}
