"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
  const initials = (user.full_name || "مدير")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <aside
      className="w-[280px] h-[100dvh] flex flex-col justify-between select-none relative"
      style={{
        background: "rgba(12, 16, 24, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderLeft: "1px solid rgba(231, 237, 253, 0.08)",
      }}
      dir="rtl"
    >
      {/* Top Brand Header */}
      <div className="p-6 pb-4 space-y-3">
        <Link href="/admin" className="block focus:outline-none" aria-label="لوحة التحكم">
          <Image
            src="/assets/logos/logo-white-glow.png"
            alt="BUILDx"
            width={150}
            height={52}
            className="w-[150px] h-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#c3f937]/10 text-[#c3f937] border border-[#c3f937]/25">
            <Shield className="w-3 h-3" aria-hidden="true" />
            <span>لوحة الإدارة</span>
          </span>
        </div>

        {/* Subtle Thin Gradient Divider */}
        <div
          className="w-full h-[1px] mt-4"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(195, 249, 55, 0.35), rgba(251, 80, 195, 0.35), transparent)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto">
        {sections.map((section) => {
          // Filter items based on user role
          const visibleItems = section.items.filter((item) => {
            if (item.minRole === "super_admin" && user.role !== "super_admin") return false;
            if (item.minRole === "admin" && user.role === "reviewer") return false;
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-3 px-3.5 h-[48px] rounded-xl text-sm font-semibold transition-all duration-150 group ${
                        isActive
                          ? "text-[#c3f937] font-bold"
                          : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                      }`}
                      style={
                        isActive
                          ? {
                              background:
                                "linear-gradient(90deg, rgba(195, 249, 55, 0.14), rgba(195, 249, 55, 0.04))",
                            }
                          : undefined
                      }
                    >
                      {/* Active green indicator on right */}
                      {isActive && (
                        <span
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#c3f937] rounded-l-full shadow-[0_0_8px_rgba(195,249,55,0.7)]"
                          aria-hidden="true"
                        />
                      )}

                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive ? "text-[#c3f937]" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                        strokeWidth={1.8}
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

      {/* User Profile & Logout Bottom Card */}
      <div
        className="p-4 border-t border-white/[0.06] space-y-3"
        style={{ background: "rgba(10, 13, 20, 0.6)" }}
      >
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-xl bg-[#c3f937]/15 border border-[#c3f937]/30 text-[#c3f937] font-bold text-sm flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{user.full_name}</p>
            <p className="text-[11px] text-slate-400 truncate">
              {user.role === "super_admin"
                ? "مدير عام"
                : user.role === "admin"
                ? "مدير"
                : "محكم"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-[42px] px-3 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors cursor-pointer"
          aria-label="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
