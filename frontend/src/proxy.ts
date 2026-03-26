import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token  = request.cookies.get("authToken")?.value;
  const role   = request.cookies.get("userRole")?.value;


  if (AUTH_ROUTES.some(r => pathname.startsWith(r)) && token) {
    if (role === "admin")          return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "hospital_admin") return NextResponse.redirect(new URL("/hospital-admin", request.url));
    return NextResponse.redirect(new URL("/hospital", request.url));
  }


  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));
    if (role !== "admin") return NextResponse.redirect(new URL("/hospital", request.url));
  }


  if (pathname.startsWith("/hospital-admin")) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));
    if (role !== "hospital_admin" && role !== "admin") {
      return NextResponse.redirect(new URL("/hospital", request.url));
    }
  }


  if (pathname.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "hospital_admin") return NextResponse.redirect(new URL("/hospital-admin", request.url));
    return NextResponse.redirect(new URL("/hospital", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/hospital-admin/:path*",
    "/dashboard/:path*",
    "/dispatcher/:path*",
    "/auth/login",
    "/auth/signup",
  ],
};
