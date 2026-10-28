import { NextRequest, NextResponse } from "next/server";
import { token } from "./lib/auth";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (req.cookies.get("admin")?.value !== (await token()))
    return NextResponse.redirect(new URL("/admin/login", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
