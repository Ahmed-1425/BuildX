import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    if (admin.role === "reviewer") {
      return NextResponse.json({ success: false, error: "ليس لديك صلاحية تصدير البيانات." }, { status: 403 });
    }

    const { application_ids, status, level } = await req.json();
    const supabase = createServerClient();

    let query = supabase
      .from("applications")
      .select("reference_code, full_name, birth_date, phone, email, city, organization, specialization, current_status, level, application_status, team_environment_preference, submitted_at")
      .order("submitted_at", { ascending: false });

    if (application_ids && Array.isArray(application_ids) && application_ids.length > 0) {
      query = query.in("id", application_ids);
    } else {
      if (status) query = query.eq("application_status", status);
      if (level) query = query.eq("level", level);
    }

    const { data: rows, error } = await query;
    if (error || !rows) {
      return NextResponse.json({ success: false, error: "تعذر استخراج البيانات." }, { status: 500 });
    }

    // Status translations
    const statusMap: Record<string, string> = {
      submitted: "طلب جديد",
      under_review: "قيد المراجعة",
      preliminary_candidate: "مرشح مبدئي",
      accepted: "مقبول",
      waitlisted: "قائمة الانتظار",
      rejected: "غير مقبول",
      confirmed: "تم تأكيد القبول",
      withdrawn: "منسحب",
    };

    const levelMap: Record<string, string> = {
      foundation: "مبتدئ (Foundation)",
      practitioner: "ممارس (Practitioner)",
      advanced: "متقدم (Advanced)",
    };

    const headers = [
      "رقم الطلب",
      "الاسم الكامل",
      "تاريخ الميلاد",
      "رقم الجوال",
      "البريد الإلكتروني",
      "المدينة",
      "الجهة",
      "التخصص",
      "الحالة الحالية",
      "المستوى",
      "حالة الطلب",
      "تفضيل بيئة الفريق",
      "تاريخ التسجيل",
    ];

    const csvLines = [headers.map(escapeCSV).join(",")];

    for (const r of rows) {
      csvLines.push(
        [
          r.reference_code,
          r.full_name,
          r.birth_date,
          r.phone,
          r.email,
          r.city,
          r.organization,
          r.specialization,
          r.current_status,
          levelMap[r.level] || r.level,
          statusMap[r.application_status] || r.application_status,
          r.team_environment_preference === "comfortable" ? "يناسبني تمامًا" : "نفس الجنس فقط",
          new Date(r.submitted_at).toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" }),
        ]
          .map(escapeCSV)
          .join(",")
      );
    }

    // UTF-8 BOM (\uFEFF) ensures Excel displays Arabic text properly
    const csvContent = "\uFEFF" + csvLines.join("\r\n");

    await recordAuditLog({
      actor_id: admin.id,
      action: "export_csv",
      note: `تصدير بيانات ${rows.length} متقدم إلى CSV بواسطة ${admin.full_name}`,
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="buildx-applications-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("[admin/export] Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
