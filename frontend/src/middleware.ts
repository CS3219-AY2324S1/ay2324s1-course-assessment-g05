import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "./helpers/auth/auth_api_wrappers";

export const config = {
  matcher: "/:path*",
};

export async function middleware(request: NextRequest) {
  const baseUrl = "http://localhost:3000";
  const publicContent = ["/_next", "/assets", "/logout"];
  if (publicContent.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }
  try {
    const rawUser = await AuthService.validateUser();

    if (rawUser) {
      if (
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/"
      ) {
        return NextResponse.redirect(new URL("/dashboard", baseUrl));
      }
      return NextResponse.next();
    }
  } catch (error) {
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/"
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", baseUrl));
  }
}
