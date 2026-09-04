import { NextRequest, NextResponse } from "next/server";
import { applicationSchema, normalizePhone } from "@/lib/validation/applicationSchema";
import { createServerClient } from "@/lib/supabase/server";
import { generateReferenceCode } from "@/lib/utils/referenceCode";

const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 50; // Increased to prevent false-positive lockouts
const RATE_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  // Allow localhost / local dev without strict rate limiting
  if (ip === "unknown" || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") {
    return true;
  }
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "تجاوزت الحد المسموح به. حاول بعد 15 دقيقة.", code: "RATE_LIMIT" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "طلب غير صالح", code: "VALIDATION" }, { status: 400 });
  }

  // Check if registration is open in camp_settings
  try {
    const supabaseCheck = createServerClient();
    const { data: setting } = await supabaseCheck
      .from("camp_settings")
      .select("value")
      .eq("key", "registration_open")
      .single();

    if (setting && setting.value === false) {
      return NextResponse.json(
        {
          success: false,
          error: "تم إغلاق باب التسجيل في معسكر BUILDx حالياً. شكراً لاهتمامك وشغفك.",
          code: "REGISTRATION_CLOSED",
        },
        { status: 403 }
      );
    }
  } catch {}

  if (typeof body === "object" && body !== null && "honeypot" in body) {
    const hp = (body as Record<string, unknown>).honeypot;
    if (typeof hp === "string" && hp.length > 0) {
      return NextResponse.json({ success: true, reference_code: "BX-SPAM-000000" });
    }
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "البيانات المرسلة غير مكتملة أو غير صحيحة", code: "VALIDATION" },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const normalizedPhone = normalizePhone(data.phone);
  const normalizedEmail = data.email.toLowerCase().trim();

  const rawAnswers = data.level_answers as Record<string, unknown>;
  const levelAnswers: Record<string, string | boolean> = Object.fromEntries(
    Object.entries(rawAnswers).map(([k, v]) => [k, v as string | boolean])
  );
  const advancedVideoUrl = data.level === "advanced" ? (rawAnswers.video_url as string | undefined) ?? null : null;
  const advancedVideoConfirmed = data.level === "advanced" ? Boolean(rawAnswers.video_access_confirmed) : false;
  if (data.level === "advanced") {
    delete levelAnswers.video_url;
    delete levelAnswers.video_access_confirmed;
  }

  const referenceCode = generateReferenceCode();

  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("applications").insert({
      reference_code: referenceCode,
      full_name: data.full_name,
      birth_date: data.birth_date,
      gender: data.gender,
      phone: normalizedPhone,
      email: normalizedEmail,
      city: data.city,
      organization: data.organization,
      specialization: data.specialization,
      current_status: data.current_status,
      current_status_other: data.current_status_other ?? null,
      level: data.level,
      level_answers: {
        ...levelAnswers,
        laptop_commitment: data.laptop_commitment,
      },
      portfolio_links: data.portfolio_links,
      professional_links: data.professional_links,
      advanced_video_url: advancedVideoUrl,
      advanced_video_access_confirmed: advancedVideoConfirmed,
      team_environment_preference: data.team_environment_preference,
      declaration_information_accurate: data.declaration_information_accurate,
      declaration_full_attendance: data.declaration_full_attendance,
      declaration_application_not_acceptance: data.declaration_application_not_acceptance,
      declaration_data_processing: data.declaration_data_processing,
      idempotency_key: data.idempotency_key,
      application_status: "submitted",
    });

    if (error) {
      if (error.code === "23505" && error.message?.includes("idempotency_key")) {
        const { data: existing } = await supabase
          .from("applications")
          .select("reference_code")
          .eq("idempotency_key", data.idempotency_key)
          .single();
        return NextResponse.json({ success: true, reference_code: existing?.reference_code ?? referenceCode });
      }
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "يوجد طلب مسجل مسبقًا باستخدام هذا البريد الإلكتروني أو رقم الجوال.", code: "DUPLICATE_EMAIL" },
          { status: 409 }
        );
      }
      console.error("[applications] DB error:", error.code, error.message);
      return NextResponse.json(
        { success: false, error: "تعذر تسليم الطلب حاليًا. حاول مرة أخرى بعد قليل.", code: "SERVER_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, reference_code: referenceCode });
  } catch (err) {
    console.error("[applications] Unexpected:", err);
    return NextResponse.json(
      { success: false, error: "تعذر تسليم الطلب حاليًا. حاول مرة أخرى بعد قليل.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
