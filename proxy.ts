import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const hasSession = req.cookies.has("session");
  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    !req.nextUrl.pathname.startsWith("/admin/login") &&
    !hasSession
  ) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
