import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import type { AdminUser, AdminRole } from "@/types/admin";

export const ADMIN_COOKIE_NAME = "buildx_auth_admin_session";
export const ALLOWED_ADMIN_EMAIL = "ahmedrasheed121m@gmail.com";

export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) return null;

    const supabase = createServerClient();

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return null;

    // Strictly enforce single authorized admin email
    if (user.email?.toLowerCase() !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      return null;
    }

    // Verify user exists in admin_users and is_active = true
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("id, full_name, role, is_active, created_at, updated_at")
      .eq("id", user.id)
      .eq("is_active", true)
      .single();

    if (adminError || !adminRecord) return null;

    return {
      id: adminRecord.id,
      full_name: adminRecord.full_name,
      email: user.email,
      role: adminRecord.role as AdminRole,
      is_active: adminRecord.is_active,
      created_at: adminRecord.created_at,
      updated_at: adminRecord.updated_at,
    };
  } catch (err) {
    console.error("[getAuthenticatedAdmin] Error:", err);
    return null;
  }
}

export async function requireAdmin(allowedRoles?: AdminRole[]): Promise<AdminUser> {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    const err = new Error("UNAUTHORIZED");
    (err as unknown as { status: number }).status = 401;
    throw err;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
    const err = new Error("FORBIDDEN");
    (err as unknown as { status: number }).status = 403;
    throw err;
  }

  return admin;
}
