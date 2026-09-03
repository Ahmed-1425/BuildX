import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";

export async function POST() {
  const admin = await getAuthenticatedAdmin();

  if (admin) {
    await recordAuditLog({
      actor_id: admin.id,
      action: "admin_logout",
      note: `تسجيل خروج المدير: ${admin.full_name}`,
    });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}
