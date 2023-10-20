import { NextRequest, NextResponse } from "next/server";
export const config = {
  matcher: "/:path*",
};

export async function middleware(request: NextRequest) {
  const host =
    process.env.NODE_ENV == "production"
      ? process.env.ENDPOINT_PROD
      : process.env.ENDPOINT_DEV;

  const baseUrl =
    process.env.NODE_ENV == "production"
      ? `http://${host}`
      : `http://${process.env.ENDPOINT_DEV}:${process.env.ENDPOINT_FRONTEND_PORT}`;

  const authValidateEndpoint = `http://${host}:${process.env.ENDPOINT_AUTH_PORT}/api/auth/validate`;

  const publicContent = ["/_next", "/assets", "/logout", "/forgotpassword"];

  if (publicContent.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const reRouteContent = ["/login", "/", "/verify", "/500"];

  const jwtCookieString = request.cookies.get("jwt")?.value as string;

  let isAuthenticated = false;

  try {
    const res = await fetch(authValidateEndpoint, {
      method: "POST",
      headers: {
        Cookie: `jwt=${jwtCookieString}`,
      },
    });

    // handles error when user service is down
    if (res.status === 503) {
      if (request.nextUrl.pathname !== "/500") {
        return NextResponse.redirect(new URL("/500", baseUrl));
      }
    }

    if (res.status === 200) {
      isAuthenticated = true;
    }
  } catch (err) {
    // handles error when auth service is down
    if (request.nextUrl.pathname !== "/500") {
      return NextResponse.redirect(new URL("/500", baseUrl));
    }
  }

  //authenticated
  if (isAuthenticated) {
    if (reRouteContent.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", baseUrl));
    }
    return NextResponse.next();
  }

  //not authenticated
  if (reRouteContent.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", baseUrl));
}
