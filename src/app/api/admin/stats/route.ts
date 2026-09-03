import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import type { DashboardStats } from "@/types/admin";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const supabase = createServerClient();

    // 1. Fetch applications overview
    const { data: apps, error: appsErr } = await supabase
      .from("applications")
      .select("id, reference_code, full_name, level, application_status, city, team_environment_preference, current_status, submitted_at, updated_at")
      .order("submitted_at", { ascending: false });

    if (appsErr || !apps) {
      console.error("[admin/stats] Apps Error:", appsErr);
      return NextResponse.json({ success: false, error: "تعذر جلب الإحصائيات." }, { status: 500 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    let todayCount = 0;
    let last7DaysCount = 0;

    const byStatus: Record<string, number> = {
      submitted: 0,
      under_review: 0,
      preliminary_candidate: 0,
      accepted: 0,
      waitlisted: 0,
      rejected: 0,
      confirmed: 0,
      withdrawn: 0,
    };

    const byLevel = { foundation: 0, practitioner: 0, advanced: 0 };
    const byTeamEnv = { comfortable: 0, same_gender_only: 0 };
    const cityCountMap: Record<string, number> = {};

    for (const app of apps) {
      const subTime = new Date(app.submitted_at).getTime();
      if (subTime >= todayStart) todayCount++;
      if (subTime >= sevenDaysAgo) last7DaysCount++;

      // Status count
      if (byStatus[app.application_status] !== undefined) {
        byStatus[app.application_status]++;
      } else {
        byStatus[app.application_status] = 1;
      }

      // Level count
      if (app.level === "foundation" || app.level === "practitioner" || app.level === "advanced") {
        byLevel[app.level as keyof typeof byLevel]++;
      }

      // Team env
      if (app.team_environment_preference === "same_gender_only") {
        byTeamEnv.same_gender_only++;
      } else {
        byTeamEnv.comfortable++;
      }

      // City
      const c = app.city?.trim() || "أخرى";
      cityCountMap[c] = (cityCountMap[c] || 0) + 1;
    }

    // Top cities
    const topCities = Object.entries(cityCountMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 2. Fetch reviewed app IDs
    const { data: reviews } = await supabase
      .from("application_reviews")
      .select("application_id, understanding_score, motivation_score, technical_readiness_score, problem_solving_score, teamwork_score, communication_score");

    const reviewedAppIds = new Set((reviews || []).map((r) => r.application_id));
    const unreviewedCount = apps.filter((a) => !reviewedAppIds.has(a.id)).length;

    let totalScoreSum = 0;
    (reviews || []).forEach((r) => {
      totalScoreSum +=
        (Number(r.understanding_score) +
          Number(r.motivation_score) +
          Number(r.technical_readiness_score) +
          Number(r.problem_solving_score) +
          Number(r.teamwork_score) +
          Number(r.communication_score)) /
        6;
    });
    const avgScoreOverall = reviews && reviews.length > 0 ? parseFloat((totalScoreSum / reviews.length).toFixed(1)) : null;

    // 3. Fetch recent activities (audit logs)
    const { data: recentLogs } = await supabase
      .from("admin_audit_logs")
      .select("*, admin_users!actor_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(8);

    const formattedLogs = (recentLogs || []).map((l: any) => ({
      ...l,
      actor_name: l.admin_users?.full_name || "النظام",
    }));

    const stats: DashboardStats = {
      total: apps.length,
      submitted: byStatus.submitted || 0,
      under_review: byStatus.under_review || 0,
      preliminary_candidate: byStatus.preliminary_candidate || 0,
      accepted: byStatus.accepted || 0,
      waitlisted: byStatus.waitlisted || 0,
      rejected: byStatus.rejected || 0,
      confirmed: byStatus.confirmed || 0,
      withdrawn: byStatus.withdrawn || 0,
      today: todayCount,
      last_7_days: last7DaysCount,
      by_level: byLevel,
      by_status: byStatus,
      by_team_env: byTeamEnv,
      top_cities: topCities,
      unreviewed_count: unreviewedCount,
      avg_score_overall: avgScoreOverall,
      recent_applications: apps.slice(0, 10) as any,
      recent_activities: formattedLogs,
    };

    return NextResponse.json({ success: true, stats });
  } catch (err) {
    console.error("[admin/stats] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
