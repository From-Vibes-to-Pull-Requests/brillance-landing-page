"use client"

import Image from "next/image"

export function CinematicHero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Full-bleed background image — teacher & students */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-classroom.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Cinematic gradient overlay: dark bottom for readability, soft top */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 85%, rgba(0,0,0,0.88) 100%)",
          }}
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            boxShadow: "inset 0 0 20vmin rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* Hero content — centered, immersive (nav is fixed at page level) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 text-center">
        <h1 className="text-white font-serif font-normal max-w-[900px] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6rem] leading-[1.08] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]">
          Effortless custom
          <br />
          contract billing
        </h1>
        <p className="mt-5 sm:mt-6 md:mt-8 max-w-[480px] text-white/90 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
          Streamline your billing with seamless automation for every custom
          contract, tailored by Brillance.
        </p>
        <div className="mt-8 sm:mt-10 md:mt-12">
          <a
            href="#"
            className="inline-flex items-center justify-center h-12 px-8 md:px-10 rounded-full bg-[#37322F] text-white font-medium text-sm md:text-base shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] hover:bg-[#2A2520] transition-colors"
          >
            Sign up for free
          </a>
        </div>
      </div>
    </section>
  )
}
