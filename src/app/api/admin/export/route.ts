import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";
import { getGenderLabel } from "@/types/registration";
import {
  getQuestionsForLevel,
  resolveApplicantAnswer,
} from "@/lib/admin/questionRegistry";

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
      .select("*")
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

    // Fetch reviews for exported applications
    const appIds = rows.map((r) => r.id);
    let reviewsMap = new Map<string, any[]>();
    if (appIds.length > 0) {
      try {
        const { data: allReviews } = await supabase
          .from("application_reviews")
          .select("application_id, understanding_score, motivation_score, technical_readiness_score, problem_solving_score, teamwork_score, communication_score, overall_recommendation, strengths, concerns, internal_notes")
          .in("application_id", appIds);

        (allReviews || []).forEach((rev) => {
          if (!reviewsMap.has(rev.application_id)) {
            reviewsMap.set(rev.application_id, []);
          }
          reviewsMap.get(rev.application_id)!.push(rev);
        });
      } catch (e) {
        console.error("[export] reviews fetch error:", e);
      }
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

    const currentStatusMap: Record<string, string> = {
      student: "طالب/ـة",
      graduate: "خريج/ـة",
      employed: "موظف/ـة",
      job_seeker: "باحث/ـة عن عمل",
      other: "أخرى",
    };

    const recMap: Record<string, string> = {
      strong_yes: "قبول مؤكد بقوة (Strong Yes)",
      yes: "قبول (Yes)",
      maybe: "قائمة انتظار / محتمل (Maybe)",
      no: "عدم قبول (No)",
      strong_no: "رفض مؤكد (Strong No)",
    };

    const headers = [
      // 1. البيانات الشخصية والأساسية
      "رقم الطلب",
      "الاسم الكامل",
      "تاريخ الميلاد",
      "الجنس",
      "رقم الجوال",
      "البريد الإلكتروني",
      "المدينة",
      "الجهة (دراسة أو عمل)",
      "التخصص / المجال",
      "الحالة المهنية",
      "توضيح الحالة المهنية (إن وجد)",
      "المستوى التقني",
      "حالة الطلب الإدارية",
      "تفضيل بيئة الفريق",
      "تاريخ ووقت التقديم",

      // 2. الروابط المرفقة
      "روابط معرض الأعمال والمشاريع (Portfolio / GitHub)",
      "الحسابات والروابط المهنية (LinkedIn / X)",
      "رابط فيديو العرض (للمستوى المتقدم)",
      "تأكيد إمكانية الوصول للفيديو",

      // 3. الإقرارات النظامية
      "إقرار إحضار الجهاز المحمول (Laptop)",
      "إقرار صحة البيانات",
      "إقرار التفرغ والحضور الكامل",
      "إقرار أن التقديم لا يعني القبول النهائي",
      "إقرار الموافقة على معالجة البيانات",

      // 4. ملخص إجابات المتقدم الشامل
      "النص الكامل لجميع أسئلة وإجابات المتقدم",

      // 5. أسئلة مسار المبتدئ (Foundation)
      "[مبتدئ] س1: التجربة الحالية مع التقنية والذكاء الاصطناعي",
      "[مبتدئ] س2: فهم مفهوم Vibe Coding",
      "[مبتدئ] س3: الدافع للتقديم وما يرغب باكتسابه",
      "[مبتدئ] س4: المشكلة وفكرة الحل بمنتج رقمي",
      "[مبتدئ] س5: تجربة التعلم الذاتي والتحديات",
      "[مبتدئ] س6: المساهمة والإضافة للفريق",

      // 6. أسئلة مسار الممارس (Practitioner)
      "[ممارس] س1: الخبرة الحالية في البرمجة وبناء المنتجات",
      "[ممارس] س2: الأدوات والتقنيات المستخدمة فعليًا",
      "[ممارس] س3: مشروع رقمي سابق وفكرته ودور المتقدم فيه",
      "[ممارس] س4: كيفية استخدام الذكاء الاصطناعي حاليًا أثناء البرمجة",
      "[ممارس] س5: نموذج الـ Prompt لصفحة التسجيل",
      "[ممارس] س6: التعامل مع أخطاء الذكاء الاصطناعي وتصحيحها",
      "[ممارس] س7: توظيف الخبرة والتعامل مع اختلاف مستويات الفريق",
      "[ممارس] س8: المهارة المستهدفة للتطوير للمستوى المتقدم",

      // 7. أسئلة مسار المتقدم (Advanced)
      "[متقدم] س1: أقوى منتج رقمي تم بناؤه أو تطويره",
      "[متقدم] س2: الانتقال من الفكرة إلى MVP في 48 ساعة",
      "[متقدم] س3: توظيف Vibe Coding وسير العمل في هندسة البرمجيات",
      "[متقدم] س4: نموذج Prompt متقدم وأثره البرمجي",
      "[متقدم] س5: أصعب مشكلة معمارية أو برمجية وكيفية حلها",
      "[متقدم] س6: قيادة الفريق التقني وتوزيع المسؤوليات ودعم الأعضاء",
      "[متقدم] س7: معايير ترتيب الأولويات واستبعاد الميزات في 48 ساعة",
      "[متقدم] س8: الجاهزية لإطلاق منتج متكامل بمفرده",

      // 8. تقييمات وملاحظات المحكمين
      "عدد تقييمات المحكمين",
      "متوسط التقييم العام (من 5)",
      "متوسط معيار الفهم (من 5)",
      "متوسط معيار الدافعية (من 5)",
      "متوسط الجاهزية التقنية (من 5)",
      "متوسط حل المشكلات (من 5)",
      "متوسط العمل الجماعي (من 5)",
      "متوسط التواصل (من 5)",
      "توصيات المحكمين",
      "نقاط القوة المرصودة من المحكمين",
      "النقاط المقلقة والملاحظات",
      "الملاحظات الداخلية للمحكمين",
    ];

    const csvLines = [headers.map(escapeCSV).join(",")];

    for (const r of rows) {
      const answers = (r.level_answers as Record<string, any>) || {};
      const isLaptopCommitted =
        r.laptop_commitment === true || answers.laptop_commitment === true;

      // Format links
      const portfolioLinksStr = Array.isArray(r.portfolio_links)
        ? r.portfolio_links.filter(Boolean).join(" | ")
        : "";
      const professionalLinksStr = Array.isArray(r.professional_links)
        ? r.professional_links.filter(Boolean).join(" | ")
        : "";

      // Format full transcript of all level questions
      const levelQuestions = getQuestionsForLevel(r.level);
      const fullTranscript = levelQuestions
        .map((q) => {
          const { value, hasValue } = resolveApplicantAnswer(q, r);
          const answerText = Array.isArray(value)
            ? value.join(" | ")
            : typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : String(value || "").trim();
          return `[س${q.order}] ${q.titleAr}\nالإجابة: ${hasValue && answerText ? answerText : "—"}`;
        })
        .join("\n\n---\n\n");

      // Extract level-specific answer values
      // Foundation answers:
      const fnd_exp = r.level === "foundation" ? answers.technical_experience || "" : "";
      const fnd_vibe = r.level === "foundation" ? answers.vibe_coding_understanding || "" : "";
      const fnd_mot = r.level === "foundation" ? answers.motivation || "" : "";
      const fnd_prob = r.level === "foundation" ? answers.problem_and_solution || "" : "";
      const fnd_learn = r.level === "foundation" ? answers.self_learning || "" : "";
      const fnd_team = r.level === "foundation" ? answers.team_contribution || "" : "";

      // Practitioner answers:
      const prac_prog = r.level === "practitioner" ? answers.programming_experience || answers.experience || answers.dev_experience || "" : "";
      const prac_tools = r.level === "practitioner" ? answers.tools_and_technologies || answers.tools || answers.tech_stack || "" : "";
      const prac_proj = r.level === "practitioner" ? answers.previous_project || answers.fast_mvp_experience || answers.project || "" : "";
      const prac_ai = r.level === "practitioner" ? answers.ai_usage || answers.ai_in_coding || answers.ai_tools_usage || "" : "";
      const prac_prompt = r.level === "practitioner" ? answers.registration_page_prompt || answers.prompt_engineering_example || answers.sample_prompt || "" : "";
      const prac_debug = r.level === "practitioner" ? answers.debugging_approach || answers.debugging_with_ai || answers.debugging || "" : "";
      const prac_team = r.level === "practitioner" ? answers.team_contribution || answers.team_role_practitioner || "" : "";
      const prac_growth = r.level === "practitioner" ? answers.growth_skill || answers.skill_to_grow || "" : "";

      // Advanced answers:
      const adv_prod = r.level === "advanced" ? answers.strongest_product || "" : "";
      const adv_mvp = r.level === "advanced" ? answers.idea_to_mvp || "" : "";
      const adv_flow = r.level === "advanced" ? answers.vibe_coding_workflow || "" : "";
      const adv_prompt = r.level === "advanced" ? answers.advanced_prompt_example || "" : "";
      const adv_prob = r.level === "advanced" ? answers.hardest_problem || "" : "";
      const adv_lead = r.level === "advanced" ? answers.team_leadership || "" : "";
      const adv_prio = r.level === "advanced" ? answers.mvp_prioritization || "" : "";
      const adv_cap = r.level === "advanced" ? answers.independent_capability || "" : "";

      // Reviews aggregation
      const appReviews = reviewsMap.get(r.id) || [];
      const reviewsCount = appReviews.length;
      let avgScore = "";
      let avgUnderstanding = "";
      let avgMotivation = "";
      let avgTechnical = "";
      let avgProblem = "";
      let avgTeamwork = "";
      let avgCommunication = "";
      let recommendationsStr = "";
      let strengthsStr = "";
      let concernsStr = "";
      let internalNotesStr = "";

      if (reviewsCount > 0) {
        let sumTotal = 0;
        let sumUnd = 0;
        let sumMot = 0;
        let sumTech = 0;
        let sumProb = 0;
        let sumTeam = 0;
        let sumComm = 0;

        const recs: string[] = [];
        const strengths: string[] = [];
        const concerns: string[] = [];
        const notes: string[] = [];

        for (const rev of appReviews) {
          const u = Number(rev.understanding_score) || 0;
          const m = Number(rev.motivation_score) || 0;
          const t = Number(rev.technical_readiness_score) || 0;
          const p = Number(rev.problem_solving_score) || 0;
          const tm = Number(rev.teamwork_score) || 0;
          const c = Number(rev.communication_score) || 0;

          sumUnd += u;
          sumMot += m;
          sumTech += t;
          sumProb += p;
          sumTeam += tm;
          sumComm += c;
          sumTotal += (u + m + t + p + tm + c) / 6;

          if (rev.overall_recommendation) {
            recs.push(recMap[rev.overall_recommendation] || rev.overall_recommendation);
          }
          if (rev.strengths?.trim()) strengths.push(rev.strengths.trim());
          if (rev.concerns?.trim()) concerns.push(rev.concerns.trim());
          if (rev.internal_notes?.trim()) notes.push(rev.internal_notes.trim());
        }

        avgScore = (sumTotal / reviewsCount).toFixed(1);
        avgUnderstanding = (sumUnd / reviewsCount).toFixed(1);
        avgMotivation = (sumMot / reviewsCount).toFixed(1);
        avgTechnical = (sumTech / reviewsCount).toFixed(1);
        avgProblem = (sumProb / reviewsCount).toFixed(1);
        avgTeamwork = (sumTeam / reviewsCount).toFixed(1);
        avgCommunication = (sumComm / reviewsCount).toFixed(1);

        recommendationsStr = [...new Set(recs)].join(" | ");
        strengthsStr = strengths.join(" \n ");
        concernsStr = concerns.join(" \n ");
        internalNotesStr = notes.join(" \n ");
      }

      csvLines.push(
        [
          // 1. البيانات الشخصية
          r.reference_code,
          r.full_name,
          r.birth_date,
          getGenderLabel(r.gender),
          r.phone,
          r.email,
          r.city,
          r.organization,
          r.specialization,
          currentStatusMap[r.current_status] || r.current_status,
          r.current_status_other || "",
          levelMap[r.level] || r.level,
          statusMap[r.application_status] || r.application_status,
          r.team_environment_preference === "comfortable" ? "يناسبني تمامًا" : "نفس الجنس فقط",
          new Date(r.submitted_at).toLocaleString("ar-SA-u-nu-latn", { timeZone: "Asia/Riyadh" }),

          // 2. الروابط المرفقة
          portfolioLinksStr,
          professionalLinksStr,
          r.advanced_video_url || "",
          r.advanced_video_access_confirmed === true ? "نعم تم التأكيد" : "لا",

          // 3. الإقرارات
          isLaptopCommitted ? "نعم (ملتزم بإحضاره)" : "غير محدد",
          r.declaration_information_accurate === true ? "نعم" : "لا",
          r.declaration_full_attendance === true ? "نعم" : "لا",
          r.declaration_application_not_acceptance === true ? "نعم" : "لا",
          r.declaration_data_processing === true ? "نعم" : "لا",

          // 4. النص الكامل لجميع الأسئلة والإجابات
          fullTranscript,

          // 5. أسئلة المبتدئ
          fnd_exp,
          fnd_vibe,
          fnd_mot,
          fnd_prob,
          fnd_learn,
          fnd_team,

          // 6. أسئلة الممارس
          prac_prog,
          prac_tools,
          prac_proj,
          prac_ai,
          prac_prompt,
          prac_debug,
          prac_team,
          prac_growth,

          // 7. أسئلة المتقدم
          adv_prod,
          adv_mvp,
          adv_flow,
          adv_prompt,
          adv_prob,
          adv_lead,
          adv_prio,
          adv_cap,

          // 8. تقييمات المحكمين
          reviewsCount > 0 ? String(reviewsCount) : "لم يُقيّم بعد",
          avgScore,
          avgUnderstanding,
          avgMotivation,
          avgTechnical,
          avgProblem,
          avgTeamwork,
          avgCommunication,
          recommendationsStr,
          strengthsStr,
          concernsStr,
          internalNotesStr,
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
      note: `تصدير بيانات ${rows.length} متقدم (تشمل كافة البيانات الشخصية والأسئلة والإجابات والتقييمات) إلى CSV بواسطة ${admin.full_name}`,
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="buildx-applications-full-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("[admin/export] Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع أثناء التصدير." }, { status: 500 });
  }
}
