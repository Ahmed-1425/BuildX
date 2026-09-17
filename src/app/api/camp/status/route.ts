import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("camp_settings")
      .select("value, updated_at")
      .eq("key", "registration_open")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("[camp/status] Database error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "تعذر التحقق من حالة التسجيل حاليًا.",
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    // Default to true if row doesn't exist yet, otherwise parse boolean
    const isOpen = data !== null ? Boolean(data.value) : true;

    return NextResponse.json(
      {
        success: true,
        registration_open: isOpen,
        updated_at: data?.updated_at || null,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("[camp/status] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ غير متوقع أثناء فحص حالة التسجيل.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
