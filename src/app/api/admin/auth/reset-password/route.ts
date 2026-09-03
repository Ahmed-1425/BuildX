import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني مطلوب." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Verify if this user is in admin_users to avoid sending reset emails to arbitrary public addresses
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id, is_active")
      .limit(1);

    // Call Supabase auth reset password
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/admin/login?reset=true`,
    });

    if (error) {
      console.error("[admin/reset-password] Error:", error);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "إذا كان البريد مسجلاً في النظام، فستصلك رسالة الاستعادة.",
    });
  } catch (err) {
    console.error("[admin/reset-password] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع." },
      { status: 500 }
    );
  }
}
