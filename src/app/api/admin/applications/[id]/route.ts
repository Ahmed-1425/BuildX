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

    // Admin users map for resolving user names safely
    const { data: adminUsers } = await supabase.from("admin_users").select("id, full_name");
    const adminMap = new Map((adminUsers || []).map((u) => [u.id, u.full_name]));

    // 2. Fetch reviews with reviewer details
    const { data: reviews } = await supabase
      .from("application_reviews")
      .select("*")
      .eq("application_id", id)
      .order("created_at", { ascending: false });

    const formattedReviews = (reviews || []).map((rev: any) => ({
      ...rev,
      reviewer_name: adminMap.get(rev.reviewer_id) || "محكم",
    }));

    // 3. Fetch notes (non-deleted)
    const { data: notes } = await supabase
      .from("application_notes")
      .select("*")
      .eq("application_id", id)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    const formattedNotes = (notes || []).map((n: any) => ({
      ...n,
      author_name: adminMap.get(n.author_id) || "عضو فريق",
    }));

    // 4. Fetch status history
    const { data: history } = await supabase
      .from("application_status_history")
      .select("*")
      .eq("application_id", id)
      .order("created_at", { ascending: false });

    const formattedHistory = (history || []).map((h: any) => ({
      ...h,
      actor_name: adminMap.get(h.actor_id) || "النظام",
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
      laptop_commitment: app.laptop_commitment ?? (app.level_answers as any)?.laptop_commitment ?? true,
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
    const { status: newStatus, note, expected_updated_at, gender: newGender } = (await req.json()) as {
      status?: ExtendedApplicationStatus;
      note?: string;
      expected_updated_at?: string;
      gender?: "male" | "female";
    };

    if (!newStatus && !newGender) {
      return NextResponse.json({ success: false, error: "البيانات المطلوبة للتحديث مفقودة." }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Fetch current record for optimistic concurrency check
    const { data: currentApp, error: fetchErr } = await supabase
      .from("applications")
      .select("id, full_name, application_status, gender, updated_at")
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

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (newStatus) updates.application_status = newStatus;
    if (newGender) updates.gender = newGender;

    // 2. Update application
    const { error: updateErr } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", id);

    if (updateErr) {
      console.error("[admin/applications/[id]] Update Error:", updateErr);
      return NextResponse.json({ success: false, error: "تعذر تحديث البيانات." }, { status: 500 });
    }

    // 3. Record in status history if status changed
    if (newStatus && newStatus !== currentApp.application_status) {
      await supabase.from("application_status_history").insert({
        application_id: id,
        actor_id: admin.id,
        previous_status: currentApp.application_status,
        new_status: newStatus,
        note: note || null,
      });

      await recordAuditLog({
        actor_id: admin.id,
        application_id: id,
        action: "status_change",
        previous_data: { status: currentApp.application_status },
        new_data: { status: newStatus },
        note: note || `تغيير حالة طلب ${currentApp.full_name} من ${currentApp.application_status} إلى ${newStatus}`,
      });
    }

    // 4. Record audit log if gender changed
    if (newGender && newGender !== currentApp.gender) {
      await recordAuditLog({
        actor_id: admin.id,
        application_id: id,
        action: "gender_update",
        previous_data: { gender: currentApp.gender },
        new_data: { gender: newGender },
        note: `تحديث جنس طلب ${currentApp.full_name} من ${currentApp.gender || "غير محدد"} إلى ${newGender}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث البيانات بنجاح.",
      new_status: newStatus || currentApp.application_status,
      new_gender: newGender || currentApp.gender,
    });
  } catch (err) {
    console.error("[admin/applications/[id]] PATCH Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
