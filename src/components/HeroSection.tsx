"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import CharacterState from "./CharacterState";
import PixelPromptWindow from "./PixelPromptWindow";
import PixelDecoration from "./PixelDecoration";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const { t, locale } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-secondary/20 via-transparent to-dark" />

      {/* Pixel decorations */}
      <div className="absolute top-20 left-8 hidden md:block">
        <PixelDecoration variant="3" color="volt" size={40} opacity={0.2} animate />
      </div>
      <div className="absolute top-40 right-12 hidden md:block">
        <PixelDecoration variant="2" color="pink" size={28} opacity={0.15} animate />
      </div>
      <div className="absolute bottom-32 left-16 hidden md:block">
        <PixelDecoration variant="1" color="volt" size={24} opacity={0.15} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text content */}
          <div className={`flex-1 text-center lg:text-start ${locale === "ar" ? "lg:text-right" : "lg:text-left"}`}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Camp title */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-light mb-2 leading-tight"
                style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
              >
                {t.hero.camp}
              </h1>

              {/* Subtitle */}
              <p
                className="text-lg sm:text-xl text-lime mb-4"
                style={{ fontFamily: "var(--font-arapix)" }}
              >
                {t.hero.subtitle}
              </p>

              {/* Slogan */}
              <p
                className="text-xl sm:text-2xl text-pink mb-4"
                style={{ fontFamily: "var(--font-janna-bold)" }}
              >
                {t.hero.slogan}
              </p>

              {/* Description */}
              <p
                className="text-base sm:text-lg text-light/70 max-w-xl mb-8 mx-auto lg:mx-0"
                style={{ fontFamily: "var(--font-janna)" }}
              >
                {t.hero.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="pixel-btn pixel-btn-primary text-base"
                >
                  {t.hero.registerBtn}
                </Link>
                <button
                  onClick={() => {
                    document
                      .getElementById("journey")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="pixel-btn pixel-btn-secondary text-base"
                >
                  {t.hero.exploreBtn}
                </button>
              </div>
            </motion.div>

            {/* Prompt window */}
            <div className="mt-8 flex justify-center lg:justify-start">
              <PixelPromptWindow />
            </div>
          </div>

          {/* Character + Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex-shrink-0 flex flex-col items-center gap-4"
          >
            {/* Glowing logo */}
            <Image
              src="/assets/logos/logo-white-glow.png"
              alt="BUILDx"
              width={200}
              height={200}
              className="object-contain hidden lg:block"
              priority
            />

            {/* Character */}
            <CharacterState
              state="ready"
              size={160}
              alt={locale === "ar" ? "شخصية BUILDx جاهزة" : "BUILDx character ready"}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
    </section>
  );
}
