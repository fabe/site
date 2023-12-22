import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { cookies } = request;
  const password = cookies.get("password")?.value;

  if (!password || password !== process.env.PROTECTED_AREA_PASSWORD) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*"],
};
