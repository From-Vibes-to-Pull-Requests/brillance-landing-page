import { NextResponse } from "next/server"
import { listPersonasForUi } from "@/lib/personas/load"

export const runtime = "nodejs"

export async function GET() {
  try {
    const personas = await listPersonasForUi()
    return NextResponse.json({ personas })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load personas"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
