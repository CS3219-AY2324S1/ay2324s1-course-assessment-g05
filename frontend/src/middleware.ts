import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLogger } from "./helpers/logger";

const logger = getLogger("middleware");

/**
 * Process request from client -> server
 * can be use for auth (jwt token from client)
 * @param request
 * @returns
 */
export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-hello-from-middleware1", "hello");
  requestHeaders.set("Content-Type", "application/json");
  //   console.log(request.url)
  //   console.log(`${request.method}: [${request.url}] \n${request.body || ""}`);

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  // Set a new response header `x-hello-from-middleware2`
  //   response.headers.set('x-hello-from-middleware2', 'hello')
  return response;
}

// export const config = {
//     matcher: '/',
// }
