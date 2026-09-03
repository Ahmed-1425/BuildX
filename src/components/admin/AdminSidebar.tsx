"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import type { AdminUser } from "@/types/admin";
import {
  LayoutDashboard,
  Files,
  Star,
  CircleCheckBig,
  Clock3,
  CircleX,
  UsersRound,
  ScrollText,
  Settings,
  LogOut,
  Shield,
  Sparkles,
} from "lucide-react";

interface Props {
  user: AdminUser;
}

interface NavSection {
  title: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    exact?: boolean;
    minRole?: "super_admin" | "admin" | "reviewer";
  }[];
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  }

  const sections: NavSection[] = [
    {
      title: "نظرة عامة",
      items: [
        { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      title: "إدارة الطلبات",
      items: [
        { href: "/admin/applications", label: "جميع الطلبات", icon: Files, exact: true },
        { href: "/admin/preliminary", label: "المرشحون مبدئيًا", icon: Star },
        { href: "/admin/accepted", label: "المقبولون", icon: CircleCheckBig },
        { href: "/admin/waitlist", label: "قائمة الانتظار", icon: Clock3 },
        { href: "/admin/rejected", label: "غير المقبولين", icon: CircleX },
      ],
    },
    {
      title: "إدارة المعسكر",
      items: [
        { href: "/admin/team-builder", label: "توزيع الفرق", icon: UsersRound },
      ],
    },
    {
      title: "النظام",
      items: [
        { href: "/admin/audit-logs", label: "سجل النشاط", icon: ScrollText },
        { href: "/admin/settings", label: "الإعدادات والحسابات", icon: Settings, minRole: "admin" },
      ],
    },
  ];

  // User initials for avatar
  const initials = (user.full_name || "أحمد")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <aside
      className="w-[280px] h-[100dvh] flex flex-col justify-between select-none relative z-40 font-janna"
      style={{
        background: "linear-gradient(180deg, rgba(14, 18, 28, 0.95) 0%, rgba(10, 13, 20, 0.98) 100%)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderLeft: "1px solid rgba(231, 237, 253, 0.1)",
      }}
      dir="rtl"
    >
      {/* Top Brand Header with Friendly Mascot Flare */}
      <div className="p-6 pb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="block focus:outline-none group transition-transform duration-200 hover:scale-[1.02]"
            aria-label="لوحة التحكم"
          >
            <div className="relative">
              <Image
                src="/assets/logos/logo-white-glow.png"
                alt="BUILDx"
                width={140}
                height={48}
                className="w-[135px] h-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                priority
              />
            </div>
          </Link>

          {/* Small Friendly Pixel Mascot Icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-xl bg-[#c3f937]/10 border border-[#c3f937]/30 flex items-center justify-center relative shadow-[0_0_12px_rgba(195,249,55,0.2)]"
            title="BUILDx Companion"
          >
            <Image
              src="/assets/characters/ready.png"
              alt="Mascot"
              width={24}
              height={24}
              className="w-5 h-5 object-contain image-pixelated"
            />
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#c3f937]/10 text-[#c3f937] border border-[#c3f937]/30 shadow-[0_0_12px_rgba(195,249,55,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f937] animate-ping" />
            <Shield className="w-3 h-3 text-[#c3f937]" aria-hidden="true" />
            <span>لوحة الإدارة المركزية</span>
          </span>
        </div>

        {/* Subtle Gradient Accent Divider */}
        <div
          className="w-full h-[1px] mt-2 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(195, 249, 55, 0.4), rgba(251, 80, 195, 0.3), transparent)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Navigation Groups with Smooth Spacing */}
      <nav className="flex-1 px-3.5 py-3 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
        {sections.map((section) => {
          // Filter items based on user role
          const visibleItems = section.items.filter((item) => {
            if (item.minRole === "super_admin" && user.role !== "super_admin") return false;
            if (item.minRole === "admin" && user.role === "reviewer") return false;
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="flex flex-col gap-1.5">
              <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h3>
              <div className="flex flex-col gap-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-3 px-3.5 h-[44px] rounded-xl text-sm font-semibold transition-all duration-200 group ${
                        isActive
                          ? "text-[#c3f937] font-bold shadow-[0_0_20px_rgba(195,249,55,0.12)]"
                          : "text-slate-300 hover:text-white hover:bg-white/[0.05] hover:translate-x-[-2px]"
                      }`}
                      style={
                        isActive
                          ? {
                              background:
                                "linear-gradient(90deg, rgba(195, 249, 55, 0.16) 0%, rgba(195, 249, 55, 0.04) 100%)",
                              border: "1px solid rgba(195, 249, 55, 0.25)",
                            }
                          : undefined
                      }
                    >
                      {/* Active neon indicator bar on right */}
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#c3f937] rounded-l-full shadow-[0_0_10px_rgba(195,249,55,0.8)]"
                          aria-hidden="true"
                        />
                      )}

                      <Icon
                        className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-[#c3f937]" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Profile & Logout Bottom Card with Friendly Personality */}
      <div
        className="p-4 border-t border-white/[0.08] flex flex-col gap-3"
        style={{
          background: "linear-gradient(180deg, rgba(12, 16, 24, 0.7) 0%, rgba(8, 10, 16, 0.95) 100%)",
        }}
      >
        <div className="flex items-center gap-3 px-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[#c3f937]/15 border border-[#c3f937]/35 text-[#c3f937] font-bold text-sm flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(195,249,55,0.2)]">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c1018]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate leading-tight">
              {user.full_name || "أحمد رشيد"}
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {user.role === "super_admin"
                ? "مدير عام النظام"
                : user.role === "admin"
                ? "مدير لوحة التحكم"
                : "محكم ومقيم"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-[40px] px-3 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-all duration-150 cursor-pointer group"
          aria-label="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
