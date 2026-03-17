"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"

// ── Mini Earth SVG reused inside the modal ──────────────────────────────────
function MiniEarth() {
  return (
    <svg viewBox="0 0 72 72" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mGlobeGrad" cx="38%" cy="35%" r="62%">
          <stop offset="0%" stopColor="#a8e6ff" />
          <stop offset="40%" stopColor="#2db7f5" />
          <stop offset="100%" stopColor="#0a5fa8" />
        </radialGradient>
        <radialGradient id="mLandGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#7de89e" />
          <stop offset="100%" stopColor="#2a9d56" />
        </radialGradient>
        <clipPath id="mGlobeClip">
          <circle cx="36" cy="36" r="28" />
        </clipPath>
        <radialGradient id="mShimmer" cx="32%" cy="28%" r="52%">
          <stop offset="0%" stopColor="white" stopOpacity="0.38" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#48bbff" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#48bbff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#48bbff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <ellipse cx="36" cy="36" rx="34" ry="7" fill="none" stroke="url(#mRingGrad)" strokeWidth="2"
        style={{ animation: "ringRotate1 6s linear infinite", transformOrigin: "36px 36px" }} />
      <circle cx="36" cy="36" r="28" fill="url(#mGlobeGrad)" />
      <g clipPath="url(#mGlobeClip)">
        <g style={{ animation: "continentScroll 12s linear infinite", transformOrigin: "36px 36px" }}>
          {[-56, 0, 56].map((x) => (
            <g key={x} transform={`translate(${x}, 0)`}>
              <ellipse cx="22" cy="28" rx="9" ry="6" fill="url(#mLandGrad)" opacity="0.92" transform="rotate(-15 22 28)" />
              <ellipse cx="30" cy="38" rx="5" ry="3.5" fill="url(#mLandGrad)" opacity="0.88" />
              <ellipse cx="48" cy="25" rx="13" ry="7" fill="url(#mLandGrad)" opacity="0.9" transform="rotate(10 48 25)" />
              <ellipse cx="46" cy="40" rx="5.5" ry="8" fill="url(#mLandGrad)" opacity="0.85" />
            </g>
          ))}
        </g>
      </g>
      <circle cx="36" cy="36" r="28" fill="url(#mShimmer)" />
      <ellipse cx="36" cy="36" rx="34" ry="7" fill="none" stroke="url(#mRingGrad)" strokeWidth="1.2"
        strokeDasharray="40 174"
        style={{ animation: "ringRotate1 6s linear infinite", transformOrigin: "36px 36px" }} />
    </svg>
  )
}

// ── Product summary feature rows ─────────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="6" height="9" rx="1" stroke="#2db7f5" strokeWidth="1.4" fill="none"/>
        <rect x="10" y="2" width="6" height="11" rx="1" stroke="#2db7f5" strokeWidth="1.4" fill="none"/>
        <rect x="3" y="6" width="1.5" height="1.5" fill="#2db7f5"/>
        <rect x="5.5" y="6" width="1.5" height="1.5" fill="#2db7f5"/>
        <rect x="11" y="4" width="1.5" height="1.5" fill="#2db7f5"/>
        <rect x="13.5" y="4" width="1.5" height="1.5" fill="#2db7f5"/>
      </svg>
    ),
    title: "Custom Contract Billing",
    desc: "Automate billing for every unique contract structure — no manual work, no errors.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <polyline points="2,13 6,8 10,10 16,4" stroke="#7de89e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="16" cy="4" r="1.5" fill="#7de89e"/>
      </svg>
    ),
    title: "Analytics & Insights",
    desc: "Real-time dashboards that turn raw billing data into clear, actionable decisions.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="5" cy="9" r="3" stroke="#a78bfa" strokeWidth="1.4" fill="none"/>
        <circle cx="13" cy="9" r="3" stroke="#a78bfa" strokeWidth="1.4" fill="none"/>
        <line x1="8" y1="9" x2="10" y2="9" stroke="#a78bfa" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: "Seamless Integrations",
    desc: "Connect your favourite tools — CRMs, ERPs, payment gateways — in minutes.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="5" width="14" height="10" rx="1.5" stroke="#f5a623" strokeWidth="1.4" fill="none"/>
        <path d="M6 5V3.5a3 3 0 0 1 6 0V5" stroke="#f5a623" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        <circle cx="9" cy="10" r="1.5" fill="#f5a623"/>
      </svg>
    ),
    title: "Enterprise-Grade Security",
    desc: "SOC 2 compliant, end-to-end encrypted, with role-based access controls built in.",
  },
]

// ── Modal ────────────────────────────────────────────────────────────────────
function BrillanceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (typeof window === "undefined") return null

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Brillance product summary"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.28s ease",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(15,12,10,0.62)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#FDFCFB",
          borderRadius: 20,
          boxShadow: "0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(55,50,47,0.08)",
          transform: open ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Header gradient strip */}
        <div style={{
          background: "linear-gradient(135deg, #0a5fa8 0%, #2db7f5 50%, #7de89e 100%)",
          borderRadius: "20px 20px 0 0",
          padding: "28px 28px 24px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative ring behind title */}
          <div style={{
            position: "absolute", right: -20, top: -20,
            width: 140, height: 140,
            borderRadius: "50%",
            border: "28px solid rgba(255,255,255,0.10)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 28, top: -10,
            width: 80, height: 80,
            borderRadius: "50%",
            border: "12px solid rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: 14,
              padding: 6,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <MiniEarth />
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, fontFamily: "sans-serif" }}>
                Product Overview
              </div>
              <div style={{ color: "white", fontSize: 22, fontWeight: 700, lineHeight: 1.2, fontFamily: "sans-serif" }}>
                Brillance
              </div>
            </div>
          </div>

          <p style={{
            marginTop: 16,
            color: "rgba(255,255,255,0.88)",
            fontSize: 14,
            lineHeight: 1.65,
            fontFamily: "sans-serif",
            fontWeight: 400,
          }}>
            Brillance is a modern contract billing platform that eliminates the complexity of custom invoicing. Whether you manage one client or ten thousand, Brillance keeps your revenue flowing — automatically, accurately, and beautifully.
          </p>
        </div>

        {/* Features list */}
        <div style={{ padding: "24px 28px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9E9891", marginBottom: 16, fontFamily: "sans-serif" }}>
            What's inside
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "14px 16px",
                borderRadius: 12,
                background: "#F7F5F3",
                border: "1px solid rgba(55,50,47,0.07)",
              }}>
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  borderRadius: 10,
                  background: "white",
                  border: "1px solid rgba(55,50,47,0.08)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#37322F", fontFamily: "sans-serif", marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 12.5, color: "#7A746F", fontFamily: "sans-serif", lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, margin: "24px 28px 0", background: "rgba(55,50,47,0.08)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(55,50,47,0.08)" }}>
          {[
            { value: "10k+", label: "Contracts billed" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "3 min", label: "Avg. setup time" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#FDFCFB", padding: "16px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#37322F", fontFamily: "sans-serif", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#9E9891", fontFamily: "sans-serif", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA footer */}
        <div style={{ padding: "20px 28px 28px", display: "flex", gap: 10 }}>
          <button
            style={{
              flex: 1,
              height: 42,
              background: "#37322F",
              color: "white",
              border: "none",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "sans-serif",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.18), inset 0 0 0 1.5px rgba(255,255,255,0.06)",
              transition: "background 0.18s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#2A2520")}
            onMouseLeave={e => (e.currentTarget.style.background = "#37322F")}
          >
            Sign up for free
          </button>
          <button
            onClick={onClose}
            style={{
              height: 42,
              padding: "0 20px",
              background: "transparent",
              color: "#605A57",
              border: "1px solid rgba(55,50,47,0.18)",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "sans-serif",
              cursor: "pointer",
              transition: "border-color 0.18s ease, color 0.18s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(55,50,47,0.4)"; e.currentTarget.style.color = "#37322F" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(55,50,47,0.18)"; e.currentTarget.style.color = "#605A57" }}
          >
            Close
          </button>
        </div>

        {/* Close ✕ button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute", top: 16, right: 16,
            width: 30, height: 30,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.28)",
            color: "white",
            fontSize: 15,
            lineHeight: 1,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.18s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.38)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes continentScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-56px); }
        }
        @keyframes ringRotate1 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  )
}

// ── Main floating button ─────────────────────────────────────────────────────
export default function EarthFloatButton() {
  const [blink, setBlink] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000
      return setTimeout(() => {
        setBlink(true)
        setTimeout(() => setBlink(false), 150)
        scheduleBlink()
      }, delay)
    }
    const timer = scheduleBlink()
    return () => clearTimeout(timer)
  }, [])

  const handleClick = useCallback(() => {
    setClicked(true)
    setTimeout(() => setClicked(false), 600)
    setModalOpen(true)
  }, [])

  return (
    <>
      {/* Tooltip + button wrapper */}
      <div
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50, display: "flex", alignItems: "center", gap: 10 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Tooltip */}
        <div
          role="tooltip"
          style={{
            background: "#1E1916",
            color: "white",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "sans-serif",
            padding: "6px 12px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(8px)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}
        >
          View brillance earth
          {/* Arrow */}
          <span style={{
            position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)",
            width: 0, height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderLeft: "6px solid #1E1916",
          }} />
        </div>

        {/* The earth button */}
        <button
          onClick={handleClick}
          aria-label="View brillance earth"
          className="focus:outline-none"
          style={{
            width: 72, height: 72,
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            filter: hovered
              ? "drop-shadow(0 0 18px rgba(72,187,255,0.55)) drop-shadow(0 4px 16px rgba(0,0,0,0.28))"
              : "drop-shadow(0 4px 18px rgba(0,0,0,0.30))",
            transition: "filter 0.3s ease",
          }}
        >
          <svg
            viewBox="0 0 72 72"
            width="72"
            height="72"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: clicked
                ? "earthPop 0.6s cubic-bezier(0.36,0.07,0.19,0.97)"
                : "earthFloat 3.2s ease-in-out infinite",
              display: "block",
              transformOrigin: "center",
            }}
          >
            <defs>
              <radialGradient id="globeGrad" cx="38%" cy="35%" r="62%">
                <stop offset="0%" stopColor="#a8e6ff" />
                <stop offset="40%" stopColor="#2db7f5" />
                <stop offset="100%" stopColor="#0a5fa8" />
              </radialGradient>
              <radialGradient id="landGrad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#7de89e" />
                <stop offset="100%" stopColor="#2a9d56" />
              </radialGradient>
              <clipPath id="globeClip">
                <circle cx="36" cy="36" r="28" />
              </clipPath>
              <radialGradient id="shimmer" cx="32%" cy="28%" r="52%">
                <stop offset="0%" stopColor="white" stopOpacity="0.38" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ring1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#48bbff" stopOpacity="0.15" />
                <stop offset="40%" stopColor="#48bbff" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#48bbff" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="ring2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.10" />
                <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.60" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.10" />
              </linearGradient>
            </defs>

            <ellipse cx="36" cy="36" rx="34" ry="8" fill="none" stroke="url(#ring2Grad)" strokeWidth="2.2"
              transform="rotate(-18 36 36)"
              style={{ animation: "ringRotate2 9s linear infinite", transformOrigin: "36px 36px" }} />
            <ellipse cx="36" cy="36" rx="34" ry="7" fill="none" stroke="url(#ring1Grad)" strokeWidth="2.5"
              style={{ animation: "ringRotate1 6s linear infinite", transformOrigin: "36px 36px" }} />

            <circle cx="36" cy="36" r="28" fill="url(#globeGrad)" />

            <g clipPath="url(#globeClip)">
              <g style={{ animation: "continentScroll 12s linear infinite", transformOrigin: "36px 36px" }}>
                {[-56, 0, 56].map((xOffset) => (
                  <g key={xOffset} transform={`translate(${xOffset}, 0)`}>
                    <ellipse cx="22" cy="28" rx="9" ry="6" fill="url(#landGrad)" opacity="0.92" transform="rotate(-15 22 28)" />
                    <ellipse cx="30" cy="38" rx="5" ry="3.5" fill="url(#landGrad)" opacity="0.88" />
                    <ellipse cx="48" cy="25" rx="13" ry="7" fill="url(#landGrad)" opacity="0.90" transform="rotate(10 48 25)" />
                    <ellipse cx="46" cy="40" rx="5.5" ry="8" fill="url(#landGrad)" opacity="0.85" />
                    <ellipse cx="58" cy="42" rx="5" ry="3" fill="url(#landGrad)" opacity="0.80" />
                    <ellipse cx="14" cy="42" rx="3" ry="2" fill="url(#landGrad)" opacity="0.78" />
                  </g>
                ))}
              </g>
            </g>

            <circle cx="36" cy="36" r="28" fill="url(#shimmer)" />

            {/* Eyes */}
            <ellipse cx="29" cy="34" rx="4.5" ry={blink ? 0.5 : hovered ? 5.5 : 5} fill="white" style={{ transition: "ry 0.08s ease" }} />
            <ellipse cx={hovered ? 30 : 29} cy={hovered ? 33 : 34} rx="2.5" ry={blink ? 0.3 : 2.8} fill="#1a3aff" style={{ transition: "all 0.15s ease" }} />
            <ellipse cx={hovered ? 30.3 : 29} cy={hovered ? 33 : 34} rx="1.2" ry={blink ? 0.2 : 1.4} fill="#0a0a1a" style={{ transition: "all 0.15s ease" }} />
            <ellipse cx="30.2" cy="32.5" rx="0.8" ry="0.7" fill="white" opacity={blink ? 0 : 0.9} style={{ transition: "opacity 0.08s" }} />

            <ellipse cx="43" cy="34" rx="4.5" ry={blink ? 0.5 : hovered ? 5.5 : 5} fill="white" style={{ transition: "ry 0.08s ease" }} />
            <ellipse cx={hovered ? 44 : 43} cy={hovered ? 33 : 34} rx="2.5" ry={blink ? 0.3 : 2.8} fill="#1a3aff" style={{ transition: "all 0.15s ease" }} />
            <ellipse cx={hovered ? 44.3 : 43} cy={hovered ? 33 : 34} rx="1.2" ry={blink ? 0.2 : 1.4} fill="#0a0a1a" style={{ transition: "all 0.15s ease" }} />
            <ellipse cx="44.2" cy="32.5" rx="0.8" ry="0.7" fill="white" opacity={blink ? 0 : 0.9} style={{ transition: "opacity 0.08s" }} />

            {/* Smile */}
            <path
              d={hovered ? "M 28 42 Q 36 48 44 42" : "M 29 41.5 Q 36 46 43 41.5"}
              fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"
              style={{ transition: "d 0.2s ease" }} opacity="0.92"
            />

            <ellipse cx="36" cy="36" rx="34" ry="7" fill="none" stroke="url(#ring1Grad)" strokeWidth="1.5"
              strokeDasharray="40 174" strokeDashoffset="0"
              style={{ animation: "ringRotate1 6s linear infinite", transformOrigin: "36px 36px" }} />
          </svg>
        </button>
      </div>

      {/* Modal — only rendered client-side */}
      {mounted && <BrillanceModal open={modalOpen} onClose={() => setModalOpen(false)} />}

      <style>{`
        @keyframes earthFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          30%       { transform: translateY(-6px) rotate(1.5deg); }
          70%       { transform: translateY(-3px) rotate(-1deg); }
        }
        @keyframes earthPop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.22) rotate(-6deg); }
          60%  { transform: scale(0.92) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes continentScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-56px); }
        }
        @keyframes ringRotate1 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ringRotate2 {
          from { transform: rotate(-18deg); }
          to   { transform: rotate(342deg); }
        }
      `}</style>
    </>
  )
}
