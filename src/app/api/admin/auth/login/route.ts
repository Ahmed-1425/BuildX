import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { ADMIN_COOKIE_NAME, ALLOWED_ADMIN_EMAIL } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Strictly enforce single authorized admin email
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "هذا الحساب غير مصرح له بالدخول إلى لوحة الإدارة." },
        { status: 403 }
      );
    }

    const supabase = createServerClient();

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError || !authData.user || !authData.session) {
      return NextResponse.json(
        { success: false, error: "بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور." },
        { status: 401 }
      );
    }

    const userId = authData.user.id;

    // 2. Verify existence and status in admin_users table
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("id, full_name, role, is_active")
      .eq("id", userId)
      .single();

    if (adminError || !adminRecord) {
      // User exists in auth but not in admin_users table
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          success: false,
          error: "هذا الحساب غير مصرح له بالدخول إلى لوحة الإدارة.",
          code: "NOT_ADMIN",
        },
        { status: 403 }
      );
    }

    if (!adminRecord.is_active) {
      // Admin account is disabled
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          success: false,
          error: "تم تعطيل هذا الحساب الإداري. تواصل مع مدير النظام.",
          code: "ACCOUNT_DISABLED",
        },
        { status: 403 }
      );
    }

    // 3. Log audit event
    await recordAuditLog({
      actor_id: userId,
      action: "admin_login",
      note: `تسجيل دخول ناجح للمدير: ${adminRecord.full_name} (${adminRecord.role})`,
    });

    // 4. Create response and set secure httpOnly cookie
    const res = NextResponse.json({
      success: true,
      user: {
        id: adminRecord.id,
        full_name: adminRecord.full_name,
        email: authData.user.email,
        role: adminRecord.role,
      },
    });

    // Set cookie for 7 days
    res.cookies.set(ADMIN_COOKIE_NAME, authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("[admin/login] Error:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
