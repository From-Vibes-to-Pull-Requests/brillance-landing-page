import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Synthetic users — Brillance",
  description:
    "Persona-backed synthetic users for product and marketing brainstorming, grounded in Dovetail research.",
}

export default function SyntheticUsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
