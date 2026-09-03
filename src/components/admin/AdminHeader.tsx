"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import type { AdminUser } from "@/types/admin";
import {
  Menu,
  X,
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
  registrationOpen: boolean;
}

export default function AdminHeader({ user }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);
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

  // Get active page title
  function getPageTitle(path: string): string {
    if (path === "/admin") return "لوحة التحكم";
    if (path.startsWith("/admin/applications/")) return "تفاصيل المتقدم";
    if (path === "/admin/applications") return "جميع الطلبات";
    if (path === "/admin/preliminary") return "المرشحون مبدئيًا";
    if (path === "/admin/accepted") return "المقبولون";
    if (path === "/admin/waitlist") return "قائمة الانتظار";
    if (path === "/admin/rejected") return "غير المقبولين";
    if (path === "/admin/team-builder") return "توزيع الفرق";
    if (path === "/admin/audit-logs") return "سجل النشاط";
    if (path === "/admin/settings") return "الإعدادات";
    return "لوحة الإدارة";
  }

  const navItems = [
    { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
    { href: "/admin/applications", label: "جميع الطلبات", icon: Files, exact: true },
    { href: "/admin/preliminary", label: "المرشحون مبدئيًا", icon: Star },
    { href: "/admin/accepted", label: "المقبولون", icon: CircleCheckBig },
    { href: "/admin/waitlist", label: "قائمة الانتظار", icon: Clock3 },
    { href: "/admin/rejected", label: "غير المقبولين", icon: CircleX },
    { href: "/admin/team-builder", label: "توزيع الفرق", icon: UsersRound },
    { href: "/admin/audit-logs", label: "سجل النشاط", icon: ScrollText },
    { href: "/admin/settings", label: "الإعدادات", icon: Settings, minRole: "admin" },
  ];

  const initials = (user.full_name || "مدير")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header
        className="w-full h-16 px-4 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-xl select-none"
        style={{ background: "rgba(12, 16, 24, 0.88)" }}
        dir="rtl"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpenDrawer(true)}
            className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none"
            aria-label="فتح القائمة الجانبية"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
          <span className="text-sm font-bold text-white truncate">
            {getPageTitle(pathname)}
          </span>
        </div>

        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/assets/logos/logo-white-glow.png"
            alt="BUILDx"
            width={105}
            height={36}
            className="w-[100px] h-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Mobile Drawer Overlay */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setOpenDrawer(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            className="relative w-72 max-w-[85vw] h-full flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 select-none shadow-2xl"
            style={{
              background: "rgba(14, 18, 28, 0.96)",
              borderLeft: "1px solid rgba(231, 237, 253, 0.12)",
            }}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/logos/logo-white-glow.png"
                  alt="BUILDx"
                  width={120}
                  height={40}
                  className="w-[110px] h-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setOpenDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                if (item.minRole === "admin" && user.role === "reviewer") return null;

                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenDrawer(false)}
                    className={`flex items-center gap-3 px-3.5 h-12 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#c3f937]/15 text-[#c3f937] font-bold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-[#c3f937]" : "text-slate-400"}`}
                      strokeWidth={1.8}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer User Footer */}
            <div className="p-4 border-t border-white/10 space-y-3 bg-black/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#c3f937]/15 text-[#c3f937] font-bold text-xs flex items-center justify-center">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                  <p className="text-[10px] text-slate-400 truncate">
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
                className="w-full flex items-center justify-center gap-2 h-10 text-xs font-bold text-rose-400 hover:text-rose-300 rounded-xl border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
