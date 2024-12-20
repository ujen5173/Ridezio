import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Store the current request URL in a custom header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  // Logic for vendor routes
  if (pathname.startsWith("/vendor") || pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    if (pathname !== "/vendor/profile" && !token.vendor_setup_complete) {
      return NextResponse.redirect(new URL("/vendor/profile", request.url));
    }
  }

  // Return the response with updated headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
