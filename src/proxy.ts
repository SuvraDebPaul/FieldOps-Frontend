import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { ROLE_HOME } from "@/constants/auth.constants";
import type { Role } from "@/types";

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

const ROLE_BY_PREFIX: [prefix: string, role: Role][] = [
  ["/admin", "ADMIN"],
  ["/dashboard", "CUSTOMER"],
  ["/technician", "TECHNICIAN"],
];

const AUTH_PAGES = ["/login", "/register"];

async function getRoleFromToken(token?: string): Promise<Role | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<{ role: Role }>(token, ACCESS_SECRET);
    return payload.role;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = await getRoleFromToken(
    request.cookies.get("accessToken")?.value,
  );

  if (AUTH_PAGES.includes(pathname)) {
    return role
      ? NextResponse.redirect(new URL(ROLE_HOME[role], request.url))
      : NextResponse.next();
  }

  if (!role) {
    if (request.cookies.has("refreshToken")) return NextResponse.next();

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const area = ROLE_BY_PREFIX.find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (area && area[1] !== role) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/technician/:path*",
    "/payment/:path*",
    "/login",
    "/register",
  ],
};
