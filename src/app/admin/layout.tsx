import React from "react";
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
  const admin = await getAuthenticatedAdmin();

  // If not authenticated, let the middleware/page handle redirect
  if (!admin) {
    return <>{children}</>;
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
    <div className="admin-bg min-h-[100dvh] w-full text-[#e7edfd] font-janna relative select-none">
      {/* Realtime live application notifications */}
      <RealtimeToast />

      {/* Responsive Shell: Deterministic LTR Grid on Desktop, Flex Column on Mobile */}
      <div className="admin-shell">
        {/* Desktop Sticky Sidebar (280px on physical right side) */}
        <div className="admin-sidebar hidden lg:block">
          <AdminSidebar user={admin} />
        </div>

        {/* Main Content Area (Column 1 on desktop, full width on mobile) */}
        <div className="admin-main flex flex-col min-w-0">
          {/* Mobile-only Header with Drawer toggle */}
          <div className="lg:hidden w-full sticky top-0 z-30">
            <AdminHeader user={admin} registrationOpen={registrationOpen} />
          </div>

          {/* Page Content Container */}
          <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 pb-20">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
