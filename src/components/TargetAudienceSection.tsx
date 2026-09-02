"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import Image from "next/image";

interface AudienceProfile {
  id: string;
  num: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  accent: "lime" | "pink" | "cyan" | "gold" | "purple";
}

const PROFILES_DATA: AudienceProfile[] = [
  {
    id: "profile-1",
    num: "01",
    titleAr: "طلاب وطالبات الجامعات",
    titleEn: "University Students",
    descAr: "من مختلف التخصصات الأكاديمية الراغبين في خوض تجربة تطبيقية وبناء منتجاتهم الرقمية الأولى.",
    descEn: "From all academic disciplines seeking practical experience and building their first digital products.",
    icon: "/assets/icons/knowledge-light.png",
    accent: "lime",
  },
  {
    id: "profile-2",
    num: "02",
    titleAr: "الخريجون والخريجات",
    titleEn: "Recent Graduates",
    descAr: "الراغبون في تعزيز مهاراتهم بالذكاء الاصطناعي وبناء سجل مشاريع حقيقي ومميز لسوق العمل.",
    descEn: "Looking to level up AI skills and build a portfolio of real-world products for the job market.",
    icon: "/assets/icons/growth-light.png",
    accent: "pink",
  },
  {
    id: "profile-3",
    num: "03",
    titleAr: "المهتمون بالذكاء الاصطناعي وVibe Coding",
    titleEn: "AI & Vibe Coding Enthusiasts",
    descAr: "الباحثون عن أدوات حديثة تختصر مسار بناء وتطوير الأنظمة والتطبيقات بالذكاء الاصطناعي.",
    descEn: "Seeking modern AI tools that transform prompts into functional software systems.",
    icon: "/assets/icons/development-light.png",
    accent: "cyan",
  },
  {
    id: "profile-4",
    num: "04",
    titleAr: "أصحاب الأفكار والمشاريع",
    titleEn: "Idea Owners & Founders",
    descAr: "المبتكرون الساعون لتحويل رؤاهم وأفكارهم إلى نماذج أولية ومنتجات قابلة للاختبار والإطلاق.",
    descEn: "Aspiring founders aiming to convert ideas into tested MVPs and live digital products.",
    icon: "/assets/icons/product-light.png",
    accent: "gold",
  },
  {
    id: "profile-5",
    num: "05",
    titleAr: "المهتمون بالابتكار وريادة الأعمال",
    titleEn: "Innovators & Entrepreneurs",
    descAr: "المتطلعون لبناء حلول رقمية مؤثرة وفرق عمل متكاملة تقود الابتكار.",
    descEn: "Passionate about building impactful digital solutions and collaborative startup teams.",
    icon: "/assets/icons/challenge-light.png",
    accent: "purple",
  },
];

export default function TargetAudienceSection() {
  const { locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const isRTL = locale === "ar";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync scroll indicator on mobile swipe
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollLeft = Math.abs(el.scrollLeft);
      const cardWidth = el.offsetWidth * 0.84 + 14;
      const index = Math.min(
        Math.max(Math.round(scrollLeft / cardWidth), 0),
        PROFILES_DATA.length - 1
      );
      setActiveIndex(index);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.84 + 14;
    el.scrollTo({
      left: isRTL ? -index * cardWidth : index * cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section id="target-audience" className="audience-section scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[24rem] bg-pink/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-8 right-1/4 w-[30rem] h-[18rem] bg-lime/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Subtle Ghost Watermark Character */}
      <div className="absolute -bottom-10 right-10 w-72 h-72 opacity-[0.035] pointer-events-none select-none">
        <Image
          src="/assets/characters/hollow-pink.png"
          alt=""
          width={300}
          height={300}
          className="object-contain"
        />
      </div>

      <div ref={ref} className="audience-container relative z-10 w-full">
        {/* ======================================================== */}
        {/* Section Heading                                          */}
        {/* ======================================================== */}
        <div className="audience-heading px-4 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-pink/10 border border-pink/30 text-pink text-xs font-bold mb-3 font-arapix tracking-wider">
            <span className="w-1.5 h-1.5 bg-pink inline-block animate-pulse" />
            <span>{isRTL ? "الفئات المستهدفة" : "TARGET AUDIENCE"}</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="section-title text-center w-full"
            style={{ fontFamily: isRTL ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {isRTL ? (
              <span className="inline-flex items-center justify-center gap-2 flex-wrap" dir="rtl">
                <span>لمن صُمم</span>
                <span className="text-lime" style={{ fontFamily: "var(--font-bauhaus)" }}>BUILDx</span>
                <span>؟</span>
              </span>
            ) : (
              "Who is BUILDx for?"
            )}
          </motion.h2>

          <p
            className="text-base sm:text-lg lg:text-xl text-light/75 max-w-2xl mx-auto mt-4 leading-relaxed text-center"
            style={{ fontFamily: "var(--font-janna)", textAlign: "center" }}
          >
            {isRTL
              ? "تجربة للشباب والشابات الذين يملكون الشغف بالتقنية والذكاء الاصطناعي وصناعة المنتجات الرقمية، ويرغبون في تحويل أفكارهم إلى حلول عملية."
              : "An experience for ambitious people passionate about technology, artificial intelligence, and building digital products."}
          </p>

          <div className="audience-heading-accent" />

          {/* Mobile Swipe Hint — Animated */}
          <div className="audience-swipe-hint md:hidden">
            <span className="audience-swipe-hint__hand">👆</span>
            <span className="audience-swipe-hint__text font-arapix">
              {isRTL ? "اسحب لاستكشاف جميع الفئات" : "Swipe to explore all profiles"}
            </span>
            <span className="audience-swipe-hint__arrows">
              {isRTL ? "← →" : "← →"}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Profiles Grid (Desktop: 5 Columns / Mobile: Swipeable)    */}
        {/* ======================================================== */}
        <div ref={scrollContainerRef} className="audience-grid">
          {PROFILES_DATA.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 30 }}
              animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
              className="audience-card audience-profile group cursor-pointer"
              onClick={() => scrollToCard(i)}
            >
              {/* Ghost Watermark Number in background */}
              <span className="audience-profile__ghost-number">
                {profile.num}
              </span>

              {/* Row 1: Icon + Number (42px) */}
              <div className="flex items-center justify-between gap-3 relative z-10 h-[42px]">
                <div className="p-2.5 bg-[#0c1018]/90 border border-light/20 rounded-xl group-hover:border-lime/50 transition-colors shadow-sm shrink-0">
                  <Image
                    src={profile.icon}
                    alt={profile.titleAr}
                    width={24}
                    height={24}
                    className="object-contain drop-shadow-[0_0_8px_rgba(231,237,253,0.4)]"
                  />
                </div>

                <span
                  className="text-xs font-bold text-light/40 font-arapix tracking-wider"
                  dir="ltr"
                >
                  // {profile.num}
                </span>
              </div>

              {/* Row 2: Title (minmax 92px, auto) */}
              <h3
                className="audience-card-title text-light group-hover:text-lime transition-colors"
                style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
              >
                {i === 2 && isRTL ? (
                  <span>
                    المهتمون بالذكاء الاصطناعي
                    <br />
                    و&nbsp;<span className="no-break">Vibe Coding</span>
                  </span>
                ) : (
                  <span>{isRTL ? profile.titleAr : profile.titleEn}</span>
                )}
              </h3>

              {/* Row 3: Description (1fr) */}
              <p
                className="audience-card-description"
                style={{ fontFamily: "var(--font-janna)" }}
              >
                {isRTL ? profile.descAr : profile.descEn}
              </p>

              {/* Row 4: Action "هذا المسار لك" (44px) */}
              <div className="audience-card-action border-t border-light/10 text-xs font-bold text-lime font-arapix">
                <span>{isRTL ? "هذا المسار لك" : "This path is for you"}</span>
                <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  {isRTL ? "←" : "→"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Pagination Dots Indicator */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-5">
          {PROFILES_DATA.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToCard(dotIdx)}
              className={`h-2 transition-all rounded-full ${
                activeIndex === dotIdx
                  ? "w-6 bg-lime shadow-[0_0_8px_#c3f937]"
                  : "w-2 bg-light/20 hover:bg-light/40"
              }`}
              aria-label={`Slide ${dotIdx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
