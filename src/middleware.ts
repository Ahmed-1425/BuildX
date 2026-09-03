import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run middleware on /admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Allow login page and login API endpoint without token
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/auth/login"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("buildx_admin_token")?.value;

  // Protect /api/admin endpoints
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك بالوصول." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect /admin pages
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
