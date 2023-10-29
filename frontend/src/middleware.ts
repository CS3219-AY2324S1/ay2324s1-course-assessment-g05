import { NextRequest, NextResponse } from "next/server";

export const config = {
  // consume middleware for all API routes
  matcher: "/:path*",
};

export async function middleware(request: NextRequest) {
  const host = process.env.ENDPOINT || "http://localhost";

  // Needs to support cloud endpoint deployment without port number
  const port = host.startsWith("https") ? "" : ":5050";
  const authValidateEndpoint = `${host}${port}/auth/api/validate`;

  const publicRoutes = ["/_next", "/assets", "/logout", "/forgotpassword"];

  // no need to validate the token for these routes
  if (publicRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const rerouteContents = ["/login", "/", "/verify", "/error"];

  const jwtCookieString = request.cookies.get("jwt")?.value as string;

  if (!jwtCookieString) {
    if (rerouteContents.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  try {
    // call auth service POST /validate to validate the jwt token
    const res = await fetch(authValidateEndpoint, {
      method: "POST",
      headers: {
        Cookie: `jwt=${jwtCookieString}`,
      },
    });

    // handles authenicated user route navigation
    if (res.status === 200) {
      if (rerouteContents.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(
          new URL("/dashboard", request.nextUrl.origin)
        );
      }
      return NextResponse.next();
    }
    // handles error when auth or user service is down
    else if (res.status >= 500) {
      if (request.nextUrl.pathname !== "/error") {
        return NextResponse.redirect(new URL("/error", request.nextUrl.origin));
      }
    } else {
      if (rerouteContents.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
      }
    }
  } catch (error) {
    // handles unforseen error
    if (request.nextUrl.pathname !== "/error") {
      return NextResponse.redirect(new URL("/error", request.nextUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
}
