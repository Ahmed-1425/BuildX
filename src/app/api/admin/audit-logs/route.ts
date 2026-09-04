import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    if (admin.role === "reviewer") {
      return NextResponse.json({ success: false, error: "ليس لديك صلاحية الاطلاع على سجل النشاط." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "30", 10)));
    const offset = (page - 1) * limit;

    const supabase = createServerClient();

    const { data: adminUsers } = await supabase.from("admin_users").select("id, full_name");
    const adminMap = new Map((adminUsers || []).map((u) => [u.id, u.full_name]));

    const { data: logs, count, error } = await supabase
      .from("admin_audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[admin/audit-logs] Error:", error);
      return NextResponse.json({ success: false, error: "تعذر جلب سجل النشاط." }, { status: 500 });
    }

    const formatted = (logs || []).map((l: any) => ({
      ...l,
      actor_name: adminMap.get(l.actor_id) || "النظام",
    }));

    return NextResponse.json({
      success: true,
      logs: formatted,
      total: count || 0,
      page,
      limit,
    });
  } catch (err) {
    console.error("[admin/audit-logs] Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
