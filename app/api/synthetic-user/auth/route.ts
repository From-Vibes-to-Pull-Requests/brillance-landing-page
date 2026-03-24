import { NextResponse } from "next/server"
import { z } from "zod"
import {
  SYNTHETIC_USER_COOKIE_NAME,
  expectedGateCookieValue,
} from "@/lib/gate-token"

export const runtime = "nodejs"

const BodySchema = z.object({
  password: z.string().min(1),
})

export async function POST(request: Request) {
  const expected = process.env.SYNTHETIC_USERS_PASSWORD
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Gate is not configured (SYNTHETIC_USERS_PASSWORD unset)." },
      { status: 400 },
    )
  }

  let body: z.infer<typeof BodySchema>
  try {
    const json = (await request.json()) as unknown
    body = BodySchema.parse(json)
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 })
  }

  if (body.password !== expected) {
    return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 })
  }

  const token = await expectedGateCookieValue(expected)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SYNTHETIC_USER_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
