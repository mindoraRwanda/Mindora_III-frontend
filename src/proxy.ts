import { NextResponse, type NextRequest } from "next/server";
import { isPublicPath } from "@/lib/public-paths";

// Fail-closed edge gate: only the routes listed in lib/public-paths.ts are
// public. Everything else requires a session (the refreshToken httpOnly
// cookie set by the backend at login - see auth-service/src/lib/session.ts)
// to even reach the page.
//
// This is NOT a replacement for RouteGuard (components/auth/RouteGuard.tsx)
// or for the backend's own enforcement (the real security boundary - every
// API call is independently authorized server-side regardless of what the
// frontend does). It closes one specific, real gap: previously, a fully
// logged-out visitor hitting a protected URL directly would still receive
// the full page shell and JS bundle, with RouteGuard only redirecting after
// hydration. This stops that at the edge, before any page code runs.
//
// It can only check for *a* session, not *which role*. The access token
// (which carries role) lives only in browser memory, deliberately never in
// a cookie, to keep it out of reach of anything but this tab's own JS (see
// lib/api.ts's comment on that choice). Role-specific gating (e.g. a
// PATIENT hitting /admin) still happens client-side in RouteGuard, same as
// before - changing that would mean adding a new role-carrying cookie,
// which is a real security-architecture tradeoff, not something to fold
// into a routing hardening pass.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Presence-only check - this cookie is httpOnly (invisible to this app's
  // own client JS) but not to the proxy, which reads it straight off the
  // request the same way any other server-side code would.
  const hasSession = request.cookies.has("refreshToken");
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    // Matches the exact param name LoginForm.tsx/SignupForm.tsx already
    // read and validate via lib/booking.ts's safeReturnUrl before using -
    // no new redirect-target validation needed here.
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static assets and Next internals - never worth a cookie check.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
