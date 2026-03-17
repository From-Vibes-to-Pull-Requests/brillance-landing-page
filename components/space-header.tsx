"use client"

import { useRef, useState, useCallback, type MouseEvent } from "react"

export default function SpaceHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const [asteroid, setAsteroid] = useState({ x: -100, y: -100, visible: false })

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!headerRef.current) return
      const rect = headerRef.current.getBoundingClientRect()
      setAsteroid({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true,
      })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setAsteroid((a) => ({ ...a, visible: false }))
  }, [])

  return (
    <header
      ref={headerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[84px] bg-[#0a0e1a] border-b border-white/10 overflow-hidden"
    >
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 11 + 7) % 100}%`,
              opacity: 0.3 + (i % 3) * 0.2,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Asteroid cursor follower */}
      <div
        className="pointer-events-none absolute w-6 h-6 transition-[transform] duration-75 ease-out z-30"
        style={{
          left: asteroid.x,
          top: asteroid.y,
          transform: `translate(-50%, -50%) ${asteroid.visible ? "scale(1)" : "scale(0)"}`,
          opacity: asteroid.visible ? 1 : 0,
        }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-600/90 drop-shadow-lg">
          <ellipse cx="12" cy="12" rx="10" ry="9" fill="currentColor" />
          <path
            d="M8 8c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2zm8 4c0-1-1-2-2-2s-2 1-2 2 1 2 2 2 2-1 2-2z"
            fill="#0a0e1a"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Astronaut flying in space */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:right-[12%] md:w-28 md:h-28 opacity-90">
        <div className="relative w-full h-full animate-float">
          <svg
            viewBox="0 0 64 64"
            className="w-full h-full drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
          >
            {/* Helmet */}
            <ellipse cx="32" cy="26" rx="18" ry="20" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
            <ellipse cx="32" cy="26" rx="14" ry="15" fill="rgba(100,180,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            {/* Visor reflection */}
            <path d="M24 22 Q32 18 40 22 Q32 26 24 22" fill="rgba(255,255,255,0.4)" />
            {/* Body / suit */}
            <path
              d="M22 44 Q32 52 42 44 L42 58 Q32 62 22 58 Z"
              fill="rgba(255,255,255,0.85)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.5"
            />
            {/* Arms (floating) */}
            <path d="M14 38 Q8 32 12 28 Q16 34 20 38" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M50 38 Q56 32 52 28 Q48 34 44 38" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Legs */}
            <path d="M26 58 L24 64 M38 58 L40 64" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Nav content */}
      <nav className="relative z-10 flex items-center justify-between w-full max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 h-[84px]">
        <div className="flex items-center gap-6 md:gap-8">
          <span className="text-white font-semibold text-lg md:text-xl tracking-tight">Brillance</span>
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <a href="#products" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Products
            </a>
            <a href="#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Docs
            </a>
          </div>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-medium border border-white/20 transition-colors"
        >
          Log in
        </button>
      </nav>
    </header>
  )
}
