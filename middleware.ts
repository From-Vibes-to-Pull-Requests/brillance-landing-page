import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import {
  SYNTHETIC_USER_COOKIE_NAME,
  cookieMatchesGate,
} from "@/lib/gate-token"

export async function middleware(request: NextRequest) {
  const password = process.env.SYNTHETIC_USERS_PASSWORD
  if (!password) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/synthetic-user/auth")) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(SYNTHETIC_USER_COOKIE_NAME)?.value
  const ok = await cookieMatchesGate(cookie, password)

  if (ok) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/synthetic-user")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (pathname.startsWith("/synthetic-users/gate")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/synthetic-users")) {
    const url = request.nextUrl.clone()
    url.pathname = "/synthetic-users/gate"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/synthetic-users/:path*", "/api/synthetic-user/:path*"],
}
