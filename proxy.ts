import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Protects the admin pages. Server actions check the session themselves
// (lib/auth-guard.ts), so this only needs to cover page navigation.
export const proxy = auth((request) => {
  const isLoggedIn = Boolean(request.auth?.user);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
