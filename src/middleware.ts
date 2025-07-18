import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type TokenType = {
  name: string;
  email: string;
  sub: string;
  id: string;
  image: string;
  role: string;
  vendor_setup_complete: boolean;
  iat: number;
  exp: number;
  jti: string;
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  const userProtectedRoutes = [
    "/orders",
    "/favourite",
    "/settings",
    "/reviews",
  ];

  const vendorProtectedRoutes = [
    "/vendor/vehicles",
    "/vendor/vehicles/add",
    "/vendor/accessories",
    "/vendor/accessories/add",
    "/vendor/settings",
    "/dashboard",
  ];

  const token = (await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })) as TokenType | null;

  const matchesRoute = (routes: string[]) =>
    routes.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );

  if (
    matchesRoute(userProtectedRoutes) ||
    matchesRoute(vendorProtectedRoutes)
  ) {
    if (!token) {
      // Not authenticated, redirect to signin
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      let signinUrl = new URL("/auth/signin", request.url);
      if (redirectParam) {
        signinUrl.searchParams.set("redirect", redirectParam);
      }
      return NextResponse.redirect(signinUrl);
    }
  }

  // 2. Role-based protection
  if (matchesRoute(userProtectedRoutes) && token!.role !== "USER") {
    // Not a USER, redirect or show not authorized
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (matchesRoute(vendorProtectedRoutes) && token!.role !== "VENDOR") {
    // Not a VENDOR, redirect or show not authorized
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Vendor setup check
  if (
    matchesRoute(vendorProtectedRoutes) &&
    pathname !== "/vendor/settings" &&
    !token!.vendor_setup_complete
  ) {
    return NextResponse.redirect(new URL("/vendor/settings", request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
