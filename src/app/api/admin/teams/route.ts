import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";
import type { TeamItem, TeamMemberItem } from "@/types/admin";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const supabase = createServerClient();

    // 1. Fetch 8 teams
    const { data: teamsData, error: teamsErr } = await supabase
      .from("teams")
      .select("id, name, number")
      .order("number", { ascending: true });

    if (teamsErr) {
      return NextResponse.json({ success: false, error: "تعذر جلب الفرق." }, { status: 500 });
    }

    // 2. Fetch all team members with application details
    const { data: membersData, error: membersErr } = await supabase
      .from("team_members")
      .select("id, team_id, application_id, role_in_team, applications(id, full_name, level, city, team_environment_preference)");

    const teamMembersMap: Record<string, TeamMemberItem[]> = {};
    const assignedAppIds = new Set<string>();

    if (membersData) {
      for (const m of membersData as any[]) {
        if (!teamMembersMap[m.team_id]) teamMembersMap[m.team_id] = [];
        assignedAppIds.add(m.application_id);

        teamMembersMap[m.team_id].push({
          id: m.id,
          team_id: m.team_id,
          application_id: m.application_id,
          full_name: m.applications?.full_name || "عضو",
          level: m.applications?.level || "foundation",
          city: m.applications?.city || "الرياض",
          team_env: m.applications?.team_environment_preference || "comfortable",
          role_in_team: m.role_in_team,
        });
      }
    }

    const teams: TeamItem[] = (teamsData || []).map((t) => ({
      id: t.id,
      name: t.name,
      number: t.number,
      members: teamMembersMap[t.id] || [],
    }));

    // 3. Fetch eligible accepted/confirmed candidates who are not assigned yet
    const { data: eligibleCandidates } = await supabase
      .from("applications")
      .select("id, full_name, level, city, team_environment_preference, application_status")
      .in("application_status", ["accepted", "confirmed"])
      .order("submitted_at", { ascending: true });

    const unassigned = (eligibleCandidates || [])
      .filter((c) => !assignedAppIds.has(c.id))
      .map((c) => ({
        id: c.id,
        full_name: c.full_name,
        level: c.level,
        city: c.city,
        team_env: c.team_environment_preference,
        application_status: c.application_status,
      }));

    return NextResponse.json({
      success: true,
      teams,
      unassigned,
      total_accepted: eligibleCandidates?.length || 0,
    });
  } catch (err) {
    console.error("[admin/teams] GET Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    if (admin.role === "reviewer") {
      return NextResponse.json({ success: false, error: "ليس لديك صلاحية تعديل الفرق." }, { status: 403 });
    }

    const { teams } = (await req.json()) as { teams: TeamItem[] };
    if (!teams || !Array.isArray(teams)) {
      return NextResponse.json({ success: false, error: "بيانات الفرق غير صحيحة." }, { status: 400 });
    }

    const supabase = createServerClient();

    // Prepare all team_members rows
    const rowsToInsert: { team_id: string; application_id: string; role_in_team?: string | null }[] = [];
    const seenAppIds = new Set<string>();

    for (const team of teams) {
      for (const m of team.members) {
        if (seenAppIds.has(m.application_id)) {
          return NextResponse.json(
            { success: false, error: `المشارك ${m.full_name} مكرر في أكثر من فريق! لا يمكن حفظ توزيع مكرر.` },
            { status: 400 }
          );
        }
        seenAppIds.add(m.application_id);
        rowsToInsert.push({
          team_id: team.id,
          application_id: m.application_id,
          role_in_team: m.role_in_team || null,
        });
      }
    }

    // Clear existing assignments and reinsert
    await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    if (rowsToInsert.length > 0) {
      const { error: insertErr } = await supabase.from("team_members").insert(rowsToInsert);
      if (insertErr) {
        console.error("[admin/teams] Insert Error:", insertErr);
        return NextResponse.json({ success: false, error: "تعذر حفظ أعضاء الفرق." }, { status: 500 });
      }
    }

    await recordAuditLog({
      actor_id: admin.id,
      action: "save_teams",
      note: `تحديث وحفظ توزيع الفرق بواسطة ${admin.full_name} (${rowsToInsert.length} مشارك في ${teams.length} فرق)`,
    });

    return NextResponse.json({
      success: true,
      message: `تم حفظ توزيع ${rowsToInsert.length} مشارك في الفرق بنجاح.`,
    });
  } catch (err) {
    console.error("[admin/teams] POST Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء حفظ الفرق." }, { status: 500 });
  }
}
