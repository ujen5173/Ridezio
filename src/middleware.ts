import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Store the current request URL in a custom header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  const protectedRoutes = [
    "/vendor/vehicles",
    "/vendor/vehicles/add",
    "/vendor/accessories",
    "/vendor/accessories/add",
    "/vendor/profile",
    "/dashboard",
    "/settings",
  ];

  // Logic for vendor routes
  if (protectedRoutes.includes(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Check for redirect param
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      let signinUrl = new URL("/auth/signin", request.url);
      if (redirectParam) {
        signinUrl.searchParams.set("redirect", redirectParam);
      }
      return NextResponse.redirect(signinUrl);
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
