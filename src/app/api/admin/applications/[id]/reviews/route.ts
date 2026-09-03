import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const { id: applicationId } = await params;
    const body = await req.json();

    const {
      understanding_score,
      motivation_score,
      technical_readiness_score,
      problem_solving_score,
      teamwork_score,
      communication_score,
      overall_recommendation,
      strengths,
      concerns,
      internal_notes,
    } = body;

    // Validate scores between 1 and 5
    const scores = [
      understanding_score,
      motivation_score,
      technical_readiness_score,
      problem_solving_score,
      teamwork_score,
      communication_score,
    ];

    if (scores.some((s) => typeof s !== "number" || s < 1 || s > 5)) {
      return NextResponse.json(
        { success: false, error: "جميع درجات المعايير يجب أن تكون بين 1 و 5." },
        { status: 400 }
      );
    }

    const validRecommendations = ["strong_yes", "yes", "maybe", "no", "strong_no"];
    if (!validRecommendations.includes(overall_recommendation)) {
      return NextResponse.json(
        { success: false, error: "يرجى تحديد التوصية النهائية بشكل صحيح." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Upsert review for this (application_id, reviewer_id)
    const { data: savedReview, error: upsertErr } = await supabase
      .from("application_reviews")
      .upsert(
        {
          application_id: applicationId,
          reviewer_id: admin.id,
          understanding_score,
          motivation_score,
          technical_readiness_score,
          problem_solving_score,
          teamwork_score,
          communication_score,
          overall_recommendation,
          strengths: strengths?.trim() || null,
          concerns: concerns?.trim() || null,
          internal_notes: internal_notes?.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "application_id,reviewer_id" }
      )
      .select()
      .single();

    if (upsertErr) {
      console.error("[admin/reviews] Upsert Error:", upsertErr);
      return NextResponse.json({ success: false, error: "تعذر حفظ التقييم." }, { status: 500 });
    }

    // Record audit log
    await recordAuditLog({
      actor_id: admin.id,
      application_id: applicationId,
      action: "submit_review",
      new_data: { recommendation: overall_recommendation },
      note: `تقييم بواسطة المحكم ${admin.full_name}: توصية ${overall_recommendation}`,
    });

    return NextResponse.json({
      success: true,
      message: "تم حفظ التقييم بنجاح.",
      review: savedReview,
    });
  } catch (err) {
    console.error("[admin/reviews] Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء حفظ التقييم." }, { status: 500 });
  }
}
