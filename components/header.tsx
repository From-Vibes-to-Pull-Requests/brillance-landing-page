"use client"

import { Button } from "@/components/ui/button"
import { useBackgroundMusic } from "@/hooks/use-background-music"
import { Music, Music2 } from "lucide-react"

export function Header() {
  const { isPlaying, toggle } = useBackgroundMusic()

  return (
    <header className="w-full border-b border-[#37322f]/6 bg-[#f7f5f3]">
      <div className="max-w-[1060px] mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <div className="text-[#37322f] font-semibold text-lg">Brillance</div>
            <div className="hidden md:flex items-center space-x-6">
              <button className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">Products</button>
              <button className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">Pricing</button>
              <button className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">Docs</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label={isPlaying ? "Turn off background music" : "Turn on background music"}
              title={isPlaying ? "Music on — click to turn off" : "Music off — click to turn on"}
              className={`p-2 rounded-md transition-all duration-200 ${
                isPlaying
                  ? "text-[#37322f] bg-[#37322f]/10 hover:bg-[#37322f]/15"
                  : "text-[#37322f]/40 hover:text-[#37322f]/70 hover:bg-[#37322f]/5"
              }`}
            >
              {isPlaying ? (
                <Music2
                  size={18}
                  className="animate-[pulse_1.5s_ease-in-out_infinite]"
                />
              ) : (
                <Music size={18} />
              )}
            </button>
            <Button variant="ghost" className="text-[#37322f] hover:bg-[#37322f]/5">
              Log in
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
