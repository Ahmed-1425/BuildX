import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";
import type { ExtendedApplicationStatus } from "@/types/admin";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    if (admin.role === "reviewer") {
      return NextResponse.json(
        { success: false, error: "ليس لديك صلاحية تنفيذ إجراءات جماعية." },
        { status: 403 }
      );
    }

    const { application_ids, new_status, note } = (await req.json()) as {
      application_ids: string[];
      new_status: ExtendedApplicationStatus;
      note?: string;
    };

    if (!application_ids || !Array.isArray(application_ids) || application_ids.length === 0) {
      return NextResponse.json({ success: false, error: "يرجى تحديد طلب واحد على الأقل." }, { status: 400 });
    }

    if (!new_status) {
      return NextResponse.json({ success: false, error: "يرجى تحديد الحالة الجديدة." }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Update applications
    const { data: updated, error } = await supabase
      .from("applications")
      .update({
        application_status: new_status,
        updated_at: new Date().toISOString(),
      })
      .in("id", application_ids)
      .select("id, full_name, reference_code");

    if (error) {
      console.error("[admin/bulk] Error:", error);
      return NextResponse.json({ success: false, error: "تعذر تحديث الطلبات المحددة." }, { status: 500 });
    }

    // 2. Insert into history
    const historyEntries = application_ids.map((id) => ({
      application_id: id,
      actor_id: admin.id,
      new_status,
      note: note ? `إجراء جماعي: ${note}` : "تحديث جماعي للحالة",
    }));

    await supabase.from("application_status_history").insert(historyEntries);

    // 3. Record audit log
    await recordAuditLog({
      actor_id: admin.id,
      action: "bulk_status_change",
      new_data: { count: application_ids.length, new_status },
      note: `إجراء جماعي بواسطة ${admin.full_name}: تغيير حالة ${application_ids.length} طلب إلى ${new_status}`,
    });

    return NextResponse.json({
      success: true,
      message: `تم تحديث ${application_ids.length} طلب بنجاح إلى "${new_status}".`,
      updated_count: updated?.length || 0,
    });
  } catch (err) {
    console.error("[admin/bulk] Unexpected:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
