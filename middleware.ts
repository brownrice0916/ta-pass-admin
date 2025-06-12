import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  { prefix: "/admin", login: "/admin/login" },
  { prefix: "/ceo", login: "/ceo/login" },
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  for (const route of protectedRoutes) {
    if (
      pathname.startsWith(route.prefix) &&
      !pathname.startsWith(`${route.prefix}/login`) &&
      !pathname.startsWith(`${route.prefix}/signup`)
    ) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!token) {
        url.pathname = route.login;
        return NextResponse.redirect(url);
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/ceo/:path*"],
};
