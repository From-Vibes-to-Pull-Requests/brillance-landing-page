"use client"

import React, { useEffect, useState } from "react"

// NASA photo – Bruce McCandless untethered spacewalk above Earth
const PHOTO_URL = "/astronaut-space.jpg"

export default function AstronautIntro({ onComplete }: { onComplete: () => void }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 4300)
    const t2 = setTimeout(() => onComplete(), 5100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        background: "#000",
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 0.75s ease-in" : "none",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <style>{`
        /* ─── Cinematic zoom: pull back → reveal → push into visor ─── */
        @keyframes cinematicZoom {
          0%   {
            transform: scale(0.72);
            filter: brightness(0.45) contrast(1.08) saturate(0.80);
          }
          18%  {
            filter: brightness(0.58) contrast(1.10) saturate(0.90);
          }
          100% {
            transform: scale(1.85);
            filter: brightness(0.82) contrast(1.16) saturate(1.12);
          }
        }

        /* ─── Stars drift slightly outward (parallax depth) ─── */
        @keyframes starsDrift {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.45); opacity: 0.3; }
        }

        /* ─── Vignette pulses very slightly ─── */
        @keyframes vignettePulse {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 0.48; }
        }

        /* ─── Letterbox bars slide in ─── */
        @keyframes barSlideTop {
          0%   { transform: translateY(-100%); }
          12%  { transform: translateY(0%); }
          88%  { transform: translateY(0%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes barSlideBottom {
          0%   { transform: translateY(100%); }
          12%  { transform: translateY(0%); }
          88%  { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }

        /* ─── Film grain ─── */
        @keyframes grain {
          0%,100% { transform: translate(0,0); }
          10%     { transform: translate(-2%,-3%); }
          20%     { transform: translate(3%,2%); }
          30%     { transform: translate(-1%,4%); }
          40%     { transform: translate(2%,-2%); }
          50%     { transform: translate(-3%,1%); }
          60%     { transform: translate(1%,3%); }
          70%     { transform: translate(-2%,-1%); }
          80%     { transform: translate(3%,-3%); }
          90%     { transform: translate(-1%,2%); }
        }

        /* ─── Subtle dust/light particles ─── */
        @keyframes dustFloat {
          0%   { transform: translate(0px, 0px) scale(1);   opacity: 0; }
          20%  { opacity: 0.6; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0.5); opacity: 0; }
        }

        /* ─── Scan line travels top → bottom ─── */
        @keyframes scanPass {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* ── PHOTO LAYER – cinematic zoom ── */}
      <div
        style={{
          position: "absolute",
          inset: "-5%",
          backgroundImage: `url("${PHOTO_URL}")`,
          backgroundSize: "cover",
          backgroundPosition: "42% 28%",
          animation: "cinematicZoom 5s cubic-bezier(0.10, 0, 0.40, 1) forwards",
          transformOrigin: "42% 30%",
          willChange: "transform, filter",
        }}
      />

      {/* ── CINEMATIC VIGNETTE ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 65% at 42% 30%,
              transparent 25%,
              rgba(0,0,0,0.25) 52%,
              rgba(0,0,0,0.68) 78%,
              rgba(0,0,0,0.90) 100%
            )
          `,
          animation: "vignettePulse 3s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* ── FILM GRAIN overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          width: "120%",
          height: "120%",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          opacity: 0.55,
          mixBlendMode: "overlay",
          animation: "grain 0.15s steps(1) infinite",
          pointerEvents: "none",
        }}
      />

      {/* ── LETTERBOX TOP BAR ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "9%",
          background: "linear-gradient(to bottom, #000 60%, transparent 100%)",
          animation: "barSlideTop 5s ease forwards",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── LETTERBOX BOTTOM BAR ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "9%",
          background: "linear-gradient(to top, #000 60%, transparent 100%)",
          animation: "barSlideBottom 5s ease forwards",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── DUST PARTICLES (floating specks of light) ── */}
      <DustParticles />

      {/* ── SUBTLE SCAN LINE PASS (top to bottom) ── */}
      <ScanLine />
    </div>
  )
}

// ─── Floating dust/light-speck particles ────────────────────────────────────
function DustParticles() {
  const particles = [
    { x: 22, y: 65, dx: -18, dy: -22, size: 1.8, delay: 0.2, dur: 3.8 },
    { x: 68, y: 40, dx: 14,  dy: -28, size: 1.2, delay: 0.8, dur: 4.2 },
    { x: 44, y: 72, dx: -10, dy: -18, size: 2.2, delay: 0.0, dur: 3.5 },
    { x: 80, y: 55, dx: 20,  dy: -14, size: 1.5, delay: 1.2, dur: 4.5 },
    { x: 15, y: 48, dx: -22, dy: -8,  size: 1.0, delay: 0.5, dur: 3.2 },
    { x: 58, y: 80, dx: 8,   dy: -30, size: 1.8, delay: 1.5, dur: 4.8 },
    { x: 35, y: 30, dx: -14, dy: -20, size: 1.3, delay: 0.3, dur: 3.9 },
    { x: 72, y: 70, dx: 18,  dy: -16, size: 2.0, delay: 0.9, dur: 4.1 },
    { x: 50, y: 25, dx: -8,  dy: -24, size: 1.1, delay: 1.8, dur: 3.6 },
    { x: 28, y: 82, dx: -20, dy: -12, size: 1.6, delay: 0.6, dur: 4.4 },
    { x: 88, y: 38, dx: 24,  dy: -18, size: 1.4, delay: 1.1, dur: 3.7 },
    { x: 62, y: 58, dx: 10,  dy: -26, size: 2.4, delay: 0.4, dur: 4.6 },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(255,240,200,0.9)",
            boxShadow: `0 0 ${p.size * 3}px rgba(255,220,140,0.8)`,
            ...({ "--dx": `${p.dx}px`, "--dy": `${p.dy}px` } as React.CSSProperties),
            animation: `dustFloat ${p.dur}s ease-out ${p.delay}s infinite`,
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      ))}
    </>
  )
}

// ─── Single slow scan-line for cinematic feel ────────────────────────────────
function ScanLine() {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: 2,
        background:
          "linear-gradient(to right, transparent, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 70%, transparent)",
        animation: "scanPass 5s linear forwards",
        pointerEvents: "none",
        zIndex: 4,
      }}
    />
  )
}
