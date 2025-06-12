import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Parse personalized codes from environment variable
const parsePersonalizedCodes = () => {
  const codes: { [key: string]: string } = {};
  const defaultPassword = process.env.PROTECTED_AREA_PASSWORD;

  if (defaultPassword) {
    codes.default = defaultPassword;
  }

  const personalizedCodes = process.env.PERSONALIZED_CODES;
  if (personalizedCodes) {
    personalizedCodes.split(",").forEach((entry) => {
      const [identifier, code] = entry.split(":").map((s) => s.trim());
      if (identifier && code) {
        codes[identifier] = code;
      }
    });
  }

  return codes;
};

export function middleware(request: NextRequest) {
  const { cookies } = request;
  const password = cookies.get("password")?.value;
  if (!password) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const loginUrl = new URL("/login", request.url);
    if (code) {
      loginUrl.searchParams.set("code", code);
    }
    return NextResponse.redirect(loginUrl);
  }

  const validCodes = parsePersonalizedCodes();
  const isValidPassword = Object.values(validCodes).includes(password);

  if (!isValidPassword) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/work/:path*"],
};
