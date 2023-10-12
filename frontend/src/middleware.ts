import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/:path*",
};

export async function middleware(request: NextRequest) {
  const baseUrl = "http://localhost:3000";
  const publicContent = ["/_next", "/assets", "/logout", "/forgotpassword"];

  if (publicContent.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const jwtCookieString = request.cookies.get("jwt")?.value as string;
  const res = await fetch(`http://localhost:5050/api/auth/validate`, {
    method: "POST",
    headers: {
      Cookie: `jwt=${jwtCookieString}`,
    },
  });

  //authenticated
  if (res.status === 200) {
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/verify"
    ) {
      return NextResponse.redirect(new URL("/dashboard", baseUrl));
    }
    return NextResponse.next();
  }

  //not authenticated
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/verify"
  ) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", baseUrl));
}
