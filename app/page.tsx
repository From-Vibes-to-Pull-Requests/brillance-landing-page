"use client"

import dynamic from "next/dynamic"

const LandingPage = dynamic(() => import("./LandingPageContent"), { ssr: false })

export default function Page() {
  return <LandingPage />
}
