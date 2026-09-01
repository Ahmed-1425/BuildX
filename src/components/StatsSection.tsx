"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import Image from "next/image";

interface StatCardProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon: string;
  iconAlt: string;
  started: boolean;
  delay: number;
}

function StatCard({
  value,
  prefix = "",
  suffix = "",
  label,
  icon,
  iconAlt,
  started,
  delay,
}: StatCardProps) {
  const count = useCountUp(value, 2000, started);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="pixel-card p-6 flex flex-col items-center text-center group"
    >
      <div className="mb-3 relative">
        <Image
          src={icon}
          alt={iconAlt}
          width={48}
          height={48}
          className="object-contain"
        />
      </div>
      <div
        className="text-3xl sm:text-4xl text-lime mb-1"
        style={{ fontFamily: "var(--font-arapix)" }}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <p
        className="text-sm text-light/70"
        style={{ fontFamily: "var(--font-janna)" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();

  const stats = [
    {
      value: 1200,
      prefix: "+",
      suffix: "",
      label: t.stats.registrations,
      icon: "/assets/icons/network.png",
      iconAlt: locale === "ar" ? "أيقونة التسجيلات" : "Registrations icon",
    },
    {
      value: 32,
      prefix: "",
      suffix: "",
      label: t.stats.participants,
      icon: "/assets/icons/people.png",
      iconAlt: locale === "ar" ? "أيقونة المشاركين" : "Participants icon",
    },
    {
      value: 3,
      prefix: "",
      suffix: "%",
      label: t.stats.acceptanceRate,
      icon: "/assets/icons/diamond.png",
      iconAlt: locale === "ar" ? "أيقونة نسبة القبول" : "Acceptance rate icon",
    },
    {
      value: 8,
      prefix: "",
      suffix: "",
      label: t.stats.teams,
      icon: "/assets/icons/challenge.png",
      iconAlt: locale === "ar" ? "أيقونة الفرق" : "Teams icon",
    },
    {
      value: 8,
      prefix: "",
      suffix: "",
      label: t.stats.products,
      icon: "/assets/icons/product.png",
      iconAlt: locale === "ar" ? "أيقونة المنتجات" : "Products icon",
    },
    {
      value: 28,
      prefix: "",
      suffix: "",
      label: t.stats.hours,
      icon: "/assets/icons/development.png",
      iconAlt: locale === "ar" ? "أيقونة الساعات" : "Hours icon",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-secondary/10 to-dark" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl text-center text-light mb-12"
          style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
        >
          {t.stats.title}
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              {...stat}
              started={hasBeenInView}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
