"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useBackgroundMusic } from "@/hooks/use-background-music"
import { Music, Music2 } from "lucide-react"
import SmartSimpleBrilliant from "../components/smart-simple-brilliant"
import YourWorkInSync from "../components/your-work-in-sync"
import EffortlessIntegration from "../components/effortless-integration-updated"
import NumbersThatSpeak from "../components/numbers-that-speak"
import DocumentationSection from "../components/documentation-section"
import TestimonialsSection from "../components/testimonials-section"
import FAQSection from "../components/faq-section"
import PricingSection from "../components/pricing-section"
import CTASection from "../components/cta-section"
import FooterSection from "../components/footer-section"
import EarthFloatButton from "../components/earth-float-button"

// Reusable Badge Component
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

const NATURE_IMAGES = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85", label: "Misty Mountain Peaks" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85", label: "Sunlit Forest Path" },
  { src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1920&q=85", label: "Rolling Green Hills" },
  { src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1920&q=85", label: "Calm Lake Reflection" },
  { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=85", label: "Aerial Valley View" },
]

export default function LandingPage() {
  const { isPlaying: musicPlaying, toggle: toggleMusic } = useBackgroundMusic()
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(true)
  const [bgIndex, setBgIndex] = useState(0)
  const [bgNext, setBgNext] = useState(1)
  const [bgTransitioning, setBgTransitioning] = useState(false)
  const [bgProgress, setBgProgress] = useState(0)
  const [navScrolled, setNavScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return
      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) setActiveCard((current) => (current + 1) % 3)
          return 0
        }
        return prev + 2
      })
    }, 100)
    return () => {
      clearInterval(progressInterval)
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    // Track the inner timeout so cleanup can cancel it if it's still pending
    // when the component unmounts (e.g. if unmount happens in the 1s window
    // between setBgTransitioning(true) and the state-update callback).
    const slideTimeout = { current: null as ReturnType<typeof setTimeout> | null }

    const progressInterval = setInterval(() => {
      setBgProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 2
      })
    }, 100)

    const slideInterval = setInterval(() => {
      if (!mountedRef.current) return
      setBgTransitioning(true)
      slideTimeout.current = setTimeout(() => {
        if (!mountedRef.current) return
        setBgIndex((prev) => {
          const next = (prev + 1) % NATURE_IMAGES.length
          setBgNext((next + 1) % NATURE_IMAGES.length)
          return next
        })
        setBgTransitioning(false)
        setBgProgress(0)
      }, 1000)
    }, 5000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(slideInterval)
      if (slideTimeout.current) clearTimeout(slideTimeout.current)
    }
  }, [])

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return
    setActiveCard(index)
    setProgress(0)
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3] overflow-x-hidden">

      {/* ── STICKY FULL-WIDTH NAVIGATION ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled
            ? "bg-[#F7F5F3]/92 backdrop-blur-md shadow-[0_1px_0_rgba(55,50,47,0.10)]"
            : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between">
          {/* Logo + nav links */}
          <div className="flex items-center gap-8">
            <span
              className="text-[#2F3037] text-lg font-medium leading-5 font-sans cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Brillance
            </span>
            <nav className="hidden md:flex items-center gap-6">
              <span
                className="text-[rgba(49,45,43,0.80)] text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors"
                onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Products
              </span>
              <span
                className="text-[rgba(49,45,43,0.80)] text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors"
                onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Pricing
              </span>
              <span
                className="text-[rgba(49,45,43,0.80)] text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors"
                onClick={() => document.getElementById("docs-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Docs
              </span>
            </nav>
          </div>
          {/* CTA */}
          <div className="flex items-center gap-2">
            {/* Music toggle */}
            <button
              onClick={toggleMusic}
              aria-label={musicPlaying ? "Turn off background music" : "Turn on background music"}
              title={musicPlaying ? "Music on — click to turn off" : "Music off — click to turn on"}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                musicPlaying
                  ? "bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] text-[#37322F] hover:shadow-[0px_2px_4px_rgba(55,50,47,0.16)]"
                  : "text-[rgba(55,50,47,0.35)] hover:text-[#37322F] hover:bg-white/60"
              }`}
            >
              {musicPlaying ? (
                <Music2 size={15} className="animate-[pulse_1.5s_ease-in-out_infinite]" />
              ) : (
                <Music size={15} />
              )}
            </button>
            {/* Log in */}
            <div className="px-4 py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:shadow-[0px_2px_4px_rgba(55,50,47,0.16)] transition-shadow">
              <span className="text-[#37322F] text-[13px] font-medium leading-5 font-sans">Log in</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION — Full Viewport ── */}
      <section className="w-full min-h-screen relative flex flex-col items-center overflow-hidden">
        {/* Nature background slideshow */}
        <div className="absolute inset-0 z-0">
          <img
            src={NATURE_IMAGES[bgIndex].src}
            alt={NATURE_IMAGES[bgIndex].label}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.70 }}
          />
          <img
            src={NATURE_IMAGES[bgNext].src}
            alt={NATURE_IMAGES[bgNext].label}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: bgTransitioning ? 0.70 : 0,
              transition: bgTransitioning ? "opacity 1s ease-in-out" : "none",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F3]/10 via-[#F7F5F3]/40 to-[#F7F5F3]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(247,245,243,0.5)_100%)]" />
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto z-10">
          <div className="w-24 h-[2px] bg-[rgba(55,50,47,0.15)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[rgba(55,50,47,0.5)] rounded-full"
              style={{ width: `${bgProgress}%`, transition: "width 0.1s linear" }}
            />
          </div>
          <div className="flex gap-[6px] items-center">
            {NATURE_IMAGES.map((img, i) => (
              <button
                key={img.label}
                aria-label={img.label}
                onClick={() => {
                  setBgIndex(i)
                  setBgNext((i + 1) % NATURE_IMAGES.length)
                  setBgProgress(0)
                  setBgTransitioning(false)
                }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === bgIndex ? 20 : 6,
                  height: 6,
                  background: i === bgIndex ? "rgba(55,50,47,0.6)" : "rgba(55,50,47,0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero copy — centered, full-width */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center pt-32 pb-12 px-6">
          {/* Decorative pattern strip */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-[rgba(55,50,47,0.10)]" />

          <div className="w-full max-w-[748px] flex flex-col items-center gap-6">
            <div className="text-fuchsia-600 text-[40px] sm:text-[56px] md:text-[72px] lg:text-[80px] font-normal leading-[1.1] font-serif">
              Effortless custom contract
              <br />
              billing by Brillance
            </div>
            <div className="w-full max-w-[506px] text-[rgba(55,50,47,0.80)] text-base sm:text-lg font-medium leading-7 font-sans">
              Streamline your billing process with seamless automation
              <br className="hidden sm:block" />
              for every custom contract, tailored by Brillance.
            </div>
          </div>

          {/* CTA button */}
          <div className="mt-10 backdrop-blur-[8px]">
            <button className="h-12 px-12 py-2 relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors">
              <div className="w-44 h-[41px] absolute left-0 top-[-0.5px] bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply" />
              <span className="flex flex-col justify-center text-white text-[15px] font-medium leading-5 font-sans relative z-10">
                Sign up for free
              </span>
            </button>
          </div>
        </div>

        {/* Dashboard preview — wide, centered */}
        <div className="relative z-10 w-full max-w-[1024px] mx-auto px-6 pb-0">
          {/* Decorative mask pattern */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
            <img
              src="/mask-group-pattern.svg"
              alt=""
              className="w-[2808px] h-auto opacity-40 mix-blend-multiply"
              style={{ filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)" }}
            />
          </div>

          <div className="relative z-5 w-full h-[220px] sm:h-[360px] md:h-[500px] lg:h-[620px] bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[9px]">
            {/* Product Image 1 */}
            <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${activeCard === 0 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"}`}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dsadsadsa.jpg-xTHS4hGwCWp2H5bTj8np6DXZUyrxX7.jpeg"
                alt="Schedules Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Product Image 2 */}
            <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${activeCard === 1 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"}`}>
              <img
                src="/analytics-dashboard-with-charts-graphs-and-data-vi.jpg"
                alt="Analytics Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Product Image 3 */}
            <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${activeCard === 2 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"}`}>
              <img
                src="/data-visualization-dashboard-with-interactive-char.jpg"
                alt="Data Visualization Dashboard"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE STRIP — Full Width ── */}
      <section className="w-full border-t border-b border-[#E0DEDB] flex flex-col md:flex-row bg-[#F7F5F3]">
        <FeatureCard
          title="Plan your schedules"
          description="Streamline customer subscriptions and billing with automated scheduling tools."
          isActive={activeCard === 0}
          progress={activeCard === 0 ? progress : 0}
          onClick={() => handleCardClick(0)}
        />
        <div className="hidden md:block w-[1px] bg-[#E0DEDB] self-stretch" />
        <FeatureCard
          title="Analytics & insights"
          description="Transform your business data into actionable insights with real-time analytics."
          isActive={activeCard === 1}
          progress={activeCard === 1 ? progress : 0}
          onClick={() => handleCardClick(1)}
        />
        <div className="hidden md:block w-[1px] bg-[#E0DEDB] self-stretch" />
        <FeatureCard
          title="Collaborate seamlessly"
          description="Keep your team aligned with shared dashboards and collaborative workflows."
          isActive={activeCard === 2}
          progress={activeCard === 2 ? progress : 0}
          onClick={() => handleCardClick(2)}
        />
      </section>

      {/* ── SOCIAL PROOF — Full Width ── */}
      <section className="w-full border-b border-[rgba(55,50,47,0.12)]">
        {/* Header */}
        <div className="w-full flex flex-col items-center py-20 px-6 text-center border-b border-[rgba(55,50,47,0.12)]">
          <Badge
            icon={
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="4" height="6" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="7" y="1" width="4" height="8" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="2" y="4" width="1" height="1" fill="#37322F" />
                <rect x="3.5" y="4" width="1" height="1" fill="#37322F" />
                <rect x="2" y="5.5" width="1" height="1" fill="#37322F" />
                <rect x="3.5" y="5.5" width="1" height="1" fill="#37322F" />
                <rect x="8" y="2" width="1" height="1" fill="#37322F" />
                <rect x="9.5" y="2" width="1" height="1" fill="#37322F" />
                <rect x="8" y="3.5" width="1" height="1" fill="#37322F" />
                <rect x="9.5" y="3.5" width="1" height="1" fill="#37322F" />
                <rect x="8" y="5" width="1" height="1" fill="#37322F" />
                <rect x="9.5" y="5" width="1" height="1" fill="#37322F" />
              </svg>
            }
            text="Social Proof"
          />
          <div className="mt-5 w-full max-w-[480px] text-[#49423D] text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Confidence backed by results
          </div>
          <div className="mt-4 text-[#605A57] text-sm sm:text-base font-normal leading-7 font-sans">
            Our customers achieve more each day
            <br className="hidden sm:block" />
            because their tools are simple, powerful, and clear.
          </div>
        </div>

        {/* Logo grid — 4 columns, full width */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className={`h-28 sm:h-36 md:h-40 flex justify-center items-center gap-3
                border-b border-[rgba(227,226,225,0.8)]
                ${index % 2 !== 1 ? "border-r border-[rgba(227,226,225,0.8)]" : ""}
                sm:border-r sm:border-[rgba(227,226,225,0.8)]
                ${index % 4 === 3 ? "sm:border-r-0" : ""}
                ${index >= 4 ? "border-b-0" : ""}
              `}
            >
              <div className="w-9 h-9 relative shadow-[0px_-4px_8px_rgba(255,255,255,0.64)_inset] overflow-hidden rounded-full">
                <img src="/horizon-icon.svg" alt="Horizon" className="w-full h-full object-contain" />
              </div>
              <div className="text-[#37322F] text-xl md:text-2xl font-medium leading-9 font-sans">Acute</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENTO GRID — Full Width ── */}
      <section className="w-full border-b border-[rgba(55,50,47,0.12)]">
        {/* Header */}
        <div className="w-full flex flex-col items-center py-20 px-6 text-center border-b border-[rgba(55,50,47,0.12)]">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
              </svg>
            }
            text="Bento grid"
          />
          <div className="mt-5 w-full max-w-[598px] text-[#49423D] text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Built for absolute clarity and focused work
          </div>
          <div className="mt-4 text-[#605A57] text-sm sm:text-base font-normal leading-7 font-sans">
            Stay focused with tools that organize, connect
            <br />
            and turn information into confident decisions.
          </div>
        </div>

        {/* Bento cells — full-width 2-col grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2">
          {/* Top Left */}
          <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-8 sm:p-12 md:p-16 flex flex-col justify-start items-start gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-xl font-semibold leading-tight font-sans">Smart. Simple. Brilliant.</h3>
              <p className="text-[#605A57] text-base font-normal leading-relaxed font-sans">
                Your data is beautifully organized so you see everything clearly without the clutter.
              </p>
            </div>
            <div className="w-full h-[260px] sm:h-[300px] md:h-[340px] rounded-lg flex items-center justify-center overflow-hidden">
              <SmartSimpleBrilliant width="100%" height="100%" theme="light" className="scale-75 md:scale-90" />
            </div>
          </div>

          {/* Top Right */}
          <div className="border-b border-[rgba(55,50,47,0.12)] p-8 sm:p-12 md:p-16 flex flex-col justify-start items-start gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-xl font-semibold leading-tight font-sans">Your work, in sync</h3>
              <p className="text-[#605A57] text-base font-normal leading-relaxed font-sans">
                Every update flows instantly across your team and keeps collaboration effortless and fast.
              </p>
            </div>
            <div className="w-full h-[260px] sm:h-[300px] md:h-[340px] rounded-lg flex overflow-hidden items-center justify-center">
              <YourWorkInSync width="400" height="250" theme="light" className="scale-75 md:scale-90" />
            </div>
          </div>

          {/* Bottom Left */}
          <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-8 sm:p-12 md:p-16 flex flex-col justify-start items-start gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-xl font-semibold leading-tight font-sans">Effortless integration</h3>
              <p className="text-[#605A57] text-base font-normal leading-relaxed font-sans">
                All your favorite tools connect in one place and work together seamlessly by design.
              </p>
            </div>
            <div className="w-full h-[260px] sm:h-[300px] md:h-[340px] rounded-lg flex overflow-hidden justify-center items-center relative">
              <EffortlessIntegration width={400} height={250} className="max-w-full max-h-full" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom Right */}
          <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-start items-start gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-xl font-semibold leading-tight font-sans">Numbers that speak</h3>
              <p className="text-[#605A57] text-base font-normal leading-relaxed font-sans">
                Track growth with precision and turn raw data into confident decisions you can trust.
              </p>
            </div>
            <div className="w-full h-[260px] sm:h-[300px] md:h-[340px] rounded-lg flex overflow-hidden items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <NumbersThatSpeak width="100%" height="100%" theme="light" className="w-full h-full object-contain" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── REMAINING SECTIONS ── */}
      <div id="products-section">
        <div id="docs-section">
          <DocumentationSection />
        </div>
      </div>
      <TestimonialsSection />
      <div id="pricing-section">
        <PricingSection />
      </div>
      <FAQSection />
      <CTASection />
      <FooterSection />

      {/* ── FLOATING EARTH BUTTON ── */}
      <EarthFloatButton />

    </div>
  )
}

// FeatureCard component
function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string
  description: string
  isActive: boolean
  progress: number
  onClick: () => void
}) {
  return (
    <div
      className={`flex-1 px-8 md:px-10 py-6 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 transition-colors ${
        isActive ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]" : "bg-[#F7F5F3] hover:bg-white/50"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
          <div
            className="h-full bg-[#322D2B] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="text-[#49423D] text-sm font-semibold leading-6 font-sans">{title}</div>
      <div className="text-[#605A57] text-[13px] font-normal leading-[22px] font-sans">{description}</div>
    </div>
  )
}
