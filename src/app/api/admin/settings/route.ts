import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const supabase = createServerClient();

    // 1. Fetch camp settings
    const { data: settingRow } = await supabase
      .from("camp_settings")
      .select("value, updated_at, updated_by")
      .eq("key", "registration_open")
      .single();

    const registrationOpen = settingRow ? Boolean(settingRow.value) : true;
    let updaterName: string | null = null;

    if (settingRow?.updated_by) {
      const { data: updater } = await supabase
        .from("admin_users")
        .select("full_name")
        .eq("id", settingRow.updated_by)
        .single();
      if (updater) {
        updaterName = updater.full_name;
      }
    }

    // 2. If super_admin, fetch admin users list
    let adminUsersList: any[] = [];
    if (admin.role === "super_admin") {
      const { data: users } = await supabase
        .from("admin_users")
        .select("id, full_name, role, is_active, created_at, updated_at")
        .order("created_at", { ascending: true });

      // Fetch emails from auth.users via service role
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const emailMap = new Map((authUsers?.users || []).map((u) => [u.id, u.email]));

      adminUsersList = (users || []).map((u) => ({
        ...u,
        email: emailMap.get(u.id) || "—",
      }));
    }

    return NextResponse.json({
      success: true,
      registration_open: registrationOpen,
      registration_updated_at: settingRow?.updated_at || null,
      registration_updated_by_name: updaterName,
      admin_users: adminUsersList,
      current_user: admin,
    });
  } catch (err) {
    console.error("[admin/settings] GET Error:", err);
    return NextResponse.json({ success: false, error: "تعذر جلب الإعدادات." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const body = await req.json();
    const supabase = createServerClient();

    // ── Case A: Toggle Registration Open/Closed ──────────────
    if ("registration_open" in body) {
      if (admin.role === "reviewer") {
        return NextResponse.json({ success: false, error: "ليس لديك صلاحية تعديل حالة التسجيل." }, { status: 403 });
      }

      const isOpen = Boolean(body.registration_open);
      const nowIso = new Date().toISOString();

      const { error } = await supabase
        .from("camp_settings")
        .upsert({
          key: "registration_open",
          value: isOpen,
          updated_at: nowIso,
          updated_by: admin.id,
        });

      if (error) {
        console.error("[admin/settings] Update reg error:", error);
        return NextResponse.json({ success: false, error: "تعذر تحديث حالة التسجيل." }, { status: 500 });
      }

      // Broadcast realtime notification to connected clients
      try {
        const channel = supabase.channel("camp-settings-sync");
        await channel.send({
          type: "broadcast",
          event: "registration_status_changed",
          payload: {
            registration_open: isOpen,
            updated_at: nowIso,
            updated_by_name: admin.full_name,
          },
        });
        supabase.removeChannel(channel);
      } catch (broadcastErr) {
        console.warn("[admin/settings] Broadcast error (non-fatal):", broadcastErr);
      }

      await recordAuditLog({
        actor_id: admin.id,
        action: isOpen ? "open_registration" : "close_registration",
        new_data: { registration_open: isOpen },
        note: isOpen
          ? `فتح باب التسجيل في المعسكر بواسطة ${admin.full_name}`
          : `إغلاق باب التسجيل في المعسكر بواسطة ${admin.full_name}`,
      });

      return NextResponse.json({
        success: true,
        registration_open: isOpen,
        registration_updated_at: nowIso,
        registration_updated_by_name: admin.full_name,
        message: isOpen ? "تم فتح باب التسجيل بنجاح." : "تم إغلاق باب التسجيل بنجاح.",
      });
    }

    // ── Case B: Manage Admin Users (super_admin only) ─────────
    if ("target_user_id" in body) {
      if (admin.role !== "super_admin") {
        return NextResponse.json({ success: false, error: "صلاحية إدارة الحسابات مقتصرة على super_admin." }, { status: 403 });
      }

      const { target_user_id, role, is_active, full_name } = body;
      const updates: Record<string, any> = { updated_at: new Date().toISOString() };

      if (role !== undefined) {
        if (!["super_admin", "admin", "reviewer"].includes(role)) {
          return NextResponse.json({ success: false, error: "الدور المحدد غير صالح." }, { status: 400 });
        }
        updates.role = role;
      }

      if (is_active !== undefined) {
        // Prevent disabling yourself if you are the active super_admin
        if (target_user_id === admin.id && is_active === false) {
          return NextResponse.json({ success: false, error: "لا يمكنك تعطيل حسابك الخاص." }, { status: 400 });
        }
        updates.is_active = Boolean(is_active);
      }

      if (full_name) updates.full_name = full_name.trim();

      const { data: updatedUser, error } = await supabase
        .from("admin_users")
        .update(updates)
        .eq("id", target_user_id)
        .select()
        .single();

      if (error) {
        console.error("[admin/settings] Update user error:", error);
        return NextResponse.json({ success: false, error: "تعذر تحديث المستخدم الإداري." }, { status: 500 });
      }

      await recordAuditLog({
        actor_id: admin.id,
        action: "update_admin_user",
        new_data: updates,
        note: `تعديل بيانات الحساب الإداري ${updatedUser.full_name} بواسطة ${admin.full_name}`,
      });

      return NextResponse.json({
        success: true,
        message: "تم تحديث بيانات المستخدم الإداري بنجاح.",
        user: updatedUser,
      });
    }

    return NextResponse.json({ success: false, error: "طلب غير صالح." }, { status: 400 });
  } catch (err) {
    console.error("[admin/settings] PATCH Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
