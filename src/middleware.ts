import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth",
  "/admin-login",
  "/admin/login",
  "/api/auth",
  "/api/admin/check-auth",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always update session first
  const response = await updateSession(request);

  // Check if route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`))
  );

  // If accessing protected route (not public), check if user has valid session
  if (!isPublicRoute) {
    // Check if user session exists in cookies
    const hasSession = request.cookies
      .getAll()
      .some(
        ({ name }) =>
          name === "sb-access-token" ||
          name === "sb-refresh-token" ||
          /^sb-.*-auth-token/.test(name)
      );

    // If no session, redirect to the appropriate login entry.
    if (!hasSession) {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin-login", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
