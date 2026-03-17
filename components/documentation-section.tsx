"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Calendar, Handshake, Lightbulb } from "lucide-react"

// Badge component for consistency
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

export default function DocumentationSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  const cards = [
    {
      title: "Plan your schedules",
      description: "Explore your data, build your dashboard,\nbring your team together.",
      image: "/modern-dashboard-interface-with-data-visualization.jpg",
    },
    {
      title: "Data to insights in minutes",
      description: "Transform raw data into actionable insights\nwith powerful analytics tools.",
      image: "/analytics-dashboard.png",
    },
    {
      title: "Collaborate seamlessly",
      description: "Work together in real-time with your team\nand share insights instantly.",
      image: "/team-collaboration-interface-with-shared-workspace.jpg",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length)
      setAnimationKey((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [cards.length])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setAnimationKey((prev) => prev + 1)
  }

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          <Badge
            icon={
              <div className="w-[10.50px] h-[10.50px] outline outline-[1.17px] outline-[#37322F] outline-offset-[-0.58px] rounded-full"></div>
            }
            text="Platform Features"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Streamline your business operations
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            Manage schedules, analyze data, and collaborate with your team
            <br />
            all in one powerful platform.
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="self-stretch px-4 md:px-9 overflow-hidden flex justify-start items-center">
        <div className="flex-1 py-8 md:py-11 flex flex-col md:flex-row justify-start items-center gap-6 md:gap-12">
          {/* Left Column - Feature Cards */}
          <div className="w-full md:w-auto md:max-w-[400px] flex flex-col justify-center items-center gap-4 order-2 md:order-1">
            {cards.map((card, index) => {
              const isActive = index === activeCard

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`w-full overflow-hidden flex flex-col justify-start items-start transition-all duration-300 cursor-pointer ${
                    isActive
                      ? card.title === "Plan your schedules"
                        ? "shadow-[0px_0px_0px_0.75px_#39FF14_inset]"
                        : card.title === "Data to insights in minutes"
                          ? "shadow-[0px_0px_0px_0.75px_#FF6600_inset]"
                          : card.title === "Collaborate seamlessly"
                            ? "shadow-[0px_0px_0px_0.75px_#00D4FF_inset]"
                            : "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
                      : "border border-[rgba(2,6,23,0.08)]"
                  }`}
                  style={
                    isActive && card.title === "Plan your schedules"
                      ? { backgroundColor: "#CCFFCC" }
                      : isActive && card.title === "Data to insights in minutes"
                        ? { backgroundColor: "#FFE0CC" }
                        : isActive && card.title === "Collaborate seamlessly"
                          ? { backgroundColor: "#CCF5FF" }
                          : undefined
                  }
                >
                  <div
                    className={`w-full h-0.5 bg-[rgba(50,45,43,0.08)] overflow-hidden ${isActive ? "opacity-100" : "opacity-0"}`}
                  >
                    <div
                      key={animationKey}
                      className="h-0.5 bg-[#322D2B] animate-[progressBar_5s_linear_forwards] will-change-transform"
                    />
                  </div>
                  <div className="px-6 py-5 w-full flex flex-col gap-2">
                    <div
                      className="self-stretch flex items-center gap-2 text-sm font-semibold leading-6 font-sans"
                      style={{
                        color: isActive &&
                          (card.title === "Plan your schedules" ||
                            card.title === "Data to insights in minutes" ||
                            card.title === "Collaborate seamlessly")
                          ? "#4169E1"
                          : card.title === "Plan your schedules"
                            ? "#228B22"
                            : card.title === "Data to insights in minutes"
                              ? "#C2410C"
                              : card.title === "Collaborate seamlessly"
                                ? "#001f3f"
                                : "#49423D",
                      }}
                    >
                      {card.title === "Plan your schedules" && (
                        <Calendar className="h-4 w-4 shrink-0" />
                      )}
                      {card.title === "Data to insights in minutes" && (
                        <Lightbulb className="h-4 w-4 shrink-0" />
                      )}
                      {card.title === "Collaborate seamlessly" && (
                        <Handshake className="h-4 w-4 shrink-0" />
                      )}
                      <span>{card.title}</span>
                    </div>
                    <div
                      className="self-stretch text-[13px] font-normal leading-[22px] font-sans whitespace-pre-line"
                      style={{
                        color: isActive &&
                          (card.title === "Plan your schedules" ||
                            card.title === "Data to insights in minutes" ||
                            card.title === "Collaborate seamlessly")
                          ? "#4169E1"
                          : card.title === "Plan your schedules"
                            ? "#228B22"
                            : card.title === "Data to insights in minutes"
                              ? "#C2410C"
                              : card.title === "Collaborate seamlessly"
                                ? "#001f3f"
                                : "#605A57",
                      }}
                    >
                      {card.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column - Image */}
          <div className="w-full md:w-auto rounded-lg flex flex-col justify-center items-center gap-2 order-1 md:order-2 md:px-0 px-[00]">
            <div className="w-full md:w-[580px] h-[250px] md:h-[420px] bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-lg flex flex-col justify-start items-start">
              <div
                className="relative w-full h-full transition-all duration-300 flex flex-col items-start justify-start p-4 overflow-hidden"
                style={{
                  background:
                    activeCard === 0
                      ? "linear-gradient(to bottom right, #CCFFCC, #99FF99)"
                      : activeCard === 1
                        ? "linear-gradient(to bottom right, #FFE0CC, #FFCC99)"
                        : activeCard === 2
                          ? "linear-gradient(to bottom right, #CCF5FF, #99E5FF)"
                          : undefined,
                }}
              >
                <div className="flex flex-row items-center gap-3 md:gap-4 w-full shrink-0">
                  <div
                    className={`flex shrink-0 items-center justify-center ${
                      activeCard === 0 || activeCard === 1 || activeCard === 2
                        ? "w-[100px] h-[100px] md:w-[140px] md:h-[140px]"
                        : "w-[160px] h-[160px] md:w-[224px] md:h-[224px]"
                    }`}
                  >
                    <Calendar
                      size={activeCard === 0 ? 100 : 160}
                      strokeWidth={2}
                      color="#228B22"
                      className={activeCard === 0 ? "block" : "hidden"}
                    />
                    <Lightbulb
                      size={activeCard === 1 ? 100 : 160}
                      strokeWidth={2}
                      color="#C2410C"
                      className={activeCard === 1 ? "block" : "hidden"}
                    />
                    <Handshake
                      size={activeCard === 2 ? 100 : 160}
                      strokeWidth={2}
                      color="#001f3f"
                      className={activeCard === 2 ? "block" : "hidden"}
                    />
                  </div>
                  {activeCard === 0 && (
                    <p
                      className="flex-1 min-w-0 text-sm md:text-base font-semibold leading-snug italic break-words"
                      style={{ color: "#228B22", fontStyle: "italic" }}
                    >
                      My schedules are now fully planned
                    </p>
                  )}
                  {activeCard === 1 && (
                    <p
                      className="flex-1 min-w-0 text-sm md:text-base font-semibold leading-snug italic break-words"
                      style={{ color: "#C2410C", fontStyle: "italic" }}
                    >
                      I have insights in minutes from my data
                    </p>
                  )}
                  {activeCard === 2 && (
                    <p
                      className="flex-1 min-w-0 text-sm md:text-base font-semibold leading-snug italic break-words"
                      style={{ color: "#001f3f", fontStyle: "italic" }}
                    >
                      I can collaborate without seams
                    </p>
                  )}
                </div>
                {activeCard === 0 && (
                  <div className="flex-1 min-h-0 w-full mt-2 overflow-hidden rounded-md relative">
                    <img
                      src="/schedule-dashboard.svg"
                      alt="Schedule planning dashboard"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                {activeCard === 1 && (
                  <div className="flex-1 min-h-0 w-full mt-2 overflow-hidden rounded-md relative">
                    <img
                      src="/insights-bar-chart.svg"
                      alt="Data insights bar chart"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                {activeCard === 2 && (
                  <div className="flex-1 min-h-0 w-full mt-2 overflow-hidden rounded-md relative">
                    <img
                      src="/collaborate-video-call.svg"
                      alt="Team collaborating on video call"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  )
}
