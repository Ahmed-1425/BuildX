import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import type { ApplicationListItem } from "@/types/admin";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const level = searchParams.get("level");
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const gender = searchParams.get("gender");
    const currentStatus = searchParams.get("current_status");
    const teamEnv = searchParams.get("team_env");
    const hasVideo = searchParams.get("has_video");
    const sortBy = searchParams.get("sort_by") || "submitted_at";
    const sortOrder = searchParams.get("sort_order") === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    const supabase = createServerClient();

    // Base query without heavy answer columns for high-speed listing
    let query = supabase
      .from("applications")
      .select(
        "id, reference_code, full_name, email, phone, birth_date, gender, city, organization, specialization, current_status, current_status_other, level, level_answers, application_status, team_environment_preference, advanced_video_url, submitted_at, updated_at",
        { count: "exact" }
      );

    // Filters
    if (level) query = query.eq("level", level);
    if (status) query = query.eq("application_status", status);
    if (gender && gender !== "all") {
      if (gender === "unspecified") {
        query = query.is("gender", null);
      } else {
        query = query.eq("gender", gender);
      }
    }
    if (city) query = query.ilike("city", `%${city}%`);
    if (currentStatus) query = query.eq("current_status", currentStatus);
    if (teamEnv) query = query.eq("team_environment_preference", teamEnv);

    if (hasVideo === "yes") {
      query = query.not("advanced_video_url", "is", null).neq("advanced_video_url", "");
    } else if (hasVideo === "no") {
      query = query.or("advanced_video_url.is.null,advanced_video_url.eq.''");
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,reference_code.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,city.ilike.%${search}%,organization.ilike.%${search}%,specialization.ilike.%${search}%`
      );
    }

    // Sorting
    const allowedSorts = ["submitted_at", "full_name", "updated_at"];
    const sortCol = allowedSorts.includes(sortBy) ? sortBy : "submitted_at";
    query = query.order(sortCol, { ascending: sortOrder === "asc" });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: rows, count, error } = await query;

    if (error) {
      console.error("[admin/applications] Query error:", error);
      return NextResponse.json({ success: false, error: "تعذر جلب الطلبات." }, { status: 500 });
    }

    // Fetch review stats for current page's applications
    const appIds = (rows || []).map((r) => r.id);
    let reviewsMap: Record<string, { count: number; totalScore: number; myReview?: any }> = {};

    if (appIds.length > 0) {
      const { data: reviews } = await supabase
        .from("application_reviews")
        .select("id, application_id, reviewer_id, understanding_score, motivation_score, technical_readiness_score, problem_solving_score, teamwork_score, communication_score, overall_recommendation")
        .in("application_id", appIds);

      if (reviews) {
        for (const rev of reviews) {
          if (!reviewsMap[rev.application_id]) {
            reviewsMap[rev.application_id] = { count: 0, totalScore: 0 };
          }
          const item = reviewsMap[rev.application_id];
          item.count++;
          const score =
            (Number(rev.understanding_score) +
              Number(rev.motivation_score) +
              Number(rev.technical_readiness_score) +
              Number(rev.problem_solving_score) +
              Number(rev.teamwork_score) +
              Number(rev.communication_score)) /
            6;
          item.totalScore += score;
          if (rev.reviewer_id === admin.id) {
            item.myReview = rev;
          }
        }
      }
    }

    const items: ApplicationListItem[] = (rows || []).map((r) => {
      const revStat = reviewsMap[r.id];
      const avgScore = revStat && revStat.count > 0 ? parseFloat((revStat.totalScore / revStat.count).toFixed(1)) : null;

      return {
        id: r.id,
        reference_code: r.reference_code,
        full_name: r.full_name,
        email: r.email,
        phone: r.phone,
        birth_date: r.birth_date,
        gender: r.gender || null,
        city: r.city,
        organization: r.organization,
        specialization: r.specialization,
        current_status: r.current_status,
        current_status_other: r.current_status_other,
        level: r.level,
        application_status: r.application_status,
        team_environment_preference: r.team_environment_preference,
        laptop_commitment: (r.level_answers as any)?.laptop_commitment ?? true,
        submitted_at: r.submitted_at,
        updated_at: r.updated_at,
        reviews_count: revStat?.count || 0,
        avg_score: avgScore,
        has_video: Boolean(r.advanced_video_url),
        my_review: revStat?.myReview || null,
      };
    });

    return NextResponse.json({
      success: true,
      items,
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error("[admin/applications] Unexpected:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
