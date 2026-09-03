import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { createServerClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import RealtimeToast from "@/components/admin/RealtimeToast";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "لوحة مؤشرات BUILDx | BUILDx Command Center",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-admin-pathname") || "";
  const isLoginPage = pathname === "/admin/login";

  const admin = await getAuthenticatedAdmin();

  // If this is the login page:
  if (isLoginPage) {
    if (admin) {
      redirect("/admin");
    }
    return <>{children}</>;
  }

  // If NOT authenticated on any protected admin route, redirect to login
  if (!admin) {
    redirect("/admin/login");
  }

  // Fetch camp registration status
  let registrationOpen = true;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("camp_settings")
      .select("value")
      .eq("key", "registration_open")
      .single();
    if (data) registrationOpen = Boolean(data.value);
  } catch {}

  return (
    <div className="admin-bg" dir="rtl">
      {/* Realtime live application notifications */}
      <RealtimeToast />

      {/* Responsive Shell: Deterministic LTR Grid on Desktop, Flex Column on Mobile */}
      <div className="admin-shell">
        {/* Main Content Area (Column 1 on desktop, full width on mobile) */}
        <div className="admin-main">
          {/* Mobile-only Header with Drawer toggle */}
          <div className="lg:hidden w-full sticky top-0 z-30">
            <AdminHeader user={admin} registrationOpen={registrationOpen} />
          </div>

          {/* Page Content Container */}
          <main className="admin-content">
            {children}
          </main>
        </div>

        {/* Desktop Sticky Sidebar (280px on physical right side, Column 2) */}
        <div className="admin-sidebar hidden lg:block">
          <AdminSidebar user={admin} />
        </div>
      </div>
    </div>
  );
}
