import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";
import type { ApplicationDetailItem, ExtendedApplicationStatus } from "@/types/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServerClient();

    // 1. Fetch application details
    const { data: app, error: appError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (appError || !app) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    // 2. Fetch reviews with reviewer details
    const { data: reviews } = await supabase
      .from("application_reviews")
      .select("*, admin_users!reviewer_id(full_name)")
      .eq("application_id", id)
      .order("created_at", { ascending: false });

    const formattedReviews = (reviews || []).map((rev: any) => ({
      ...rev,
      reviewer_name: rev.admin_users?.full_name || "محكم",
    }));

    // 3. Fetch notes (non-deleted)
    const { data: notes } = await supabase
      .from("application_notes")
      .select("*, admin_users!author_id(full_name)")
      .eq("application_id", id)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    const formattedNotes = (notes || []).map((n: any) => ({
      ...n,
      author_name: n.admin_users?.full_name || "عضو فريق",
    }));

    // 4. Fetch status history
    const { data: history } = await supabase
      .from("application_status_history")
      .select("*, admin_users!actor_id(full_name)")
      .eq("application_id", id)
      .order("created_at", { ascending: false });

    const formattedHistory = (history || []).map((h: any) => ({
      ...h,
      actor_name: h.admin_users?.full_name || "النظام",
    }));

    // Calculate score
    let totalScore = 0;
    formattedReviews.forEach((rev: any) => {
      totalScore +=
        (Number(rev.understanding_score) +
          Number(rev.motivation_score) +
          Number(rev.technical_readiness_score) +
          Number(rev.problem_solving_score) +
          Number(rev.teamwork_score) +
          Number(rev.communication_score)) /
        6;
    });
    const avgScore = formattedReviews.length > 0 ? parseFloat((totalScore / formattedReviews.length).toFixed(1)) : null;

    const detail: ApplicationDetailItem = {
      ...app,
      reviews_count: formattedReviews.length,
      avg_score: avgScore,
      has_video: Boolean(app.advanced_video_url),
      reviews: formattedReviews,
      notes: formattedNotes,
      history: formattedHistory,
      my_review: formattedReviews.find((r: any) => r.reviewer_id === admin.id) || null,
    };

    return NextResponse.json({ success: true, item: detail });
  } catch (err) {
    console.error("[admin/applications/[id]] GET Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء جلب الملف." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    // Reviewers cannot change final status unless admin/super_admin
    if (admin.role === "reviewer") {
      return NextResponse.json(
        { success: false, error: "ليس لديك صلاحية تغيير حالة الطلب. اتصل بمدير النظام." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { status: newStatus, note, expected_updated_at } = (await req.json()) as {
      status: ExtendedApplicationStatus;
      note?: string;
      expected_updated_at?: string;
    };

    if (!newStatus) {
      return NextResponse.json({ success: false, error: "الحالة الجديدة مطلوبة." }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Fetch current status & updated_at for optimistic concurrency check
    const { data: currentApp, error: fetchErr } = await supabase
      .from("applications")
      .select("id, full_name, application_status, updated_at")
      .eq("id", id)
      .single();

    if (fetchErr || !currentApp) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    // Optimistic Concurrency Control
    if (expected_updated_at && currentApp.updated_at !== expected_updated_at) {
      return NextResponse.json(
        {
          success: false,
          error: "تم تحديث هذا الطلب بواسطة مستخدم آخر. راجع آخر نسخة قبل حفظ التغييرات.",
          code: "CONCURRENCY_CONFLICT",
        },
        { status: 409 }
      );
    }

    const previousStatus = currentApp.application_status;

    // 2. Update application status
    const { error: updateErr } = await supabase
      .from("applications")
      .update({
        application_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateErr) {
      console.error("[admin/applications/[id]] Update Error:", updateErr);
      return NextResponse.json({ success: false, error: "تعذر تحديث الحالة." }, { status: 500 });
    }

    // 3. Record in status history
    await supabase.from("application_status_history").insert({
      application_id: id,
      actor_id: admin.id,
      previous_status: previousStatus,
      new_status: newStatus,
      note: note || null,
    });

    // 4. Record in audit log
    await recordAuditLog({
      actor_id: admin.id,
      application_id: id,
      action: "status_change",
      previous_data: { status: previousStatus },
      new_data: { status: newStatus },
      note: note || `تغيير حالة طلب ${currentApp.full_name} من ${previousStatus} إلى ${newStatus}`,
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الطلب بنجاح.",
      new_status: newStatus,
    });
  } catch (err) {
    console.error("[admin/applications/[id]] PATCH Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
