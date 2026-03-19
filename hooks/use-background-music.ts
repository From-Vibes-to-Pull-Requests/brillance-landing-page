"use client"

import { useRef, useState, useCallback, useEffect } from "react"

const LOOP_DURATION = 15 // seconds

// ── HAPPY VIBES ──────────────────────────────────────────────────────────────
// Key: D major  |  Tempo: 120 BPM (quarter = 0.5s, 8th = 0.25s)
// Style: bouncy staccato melody + bass plucks + bright chord stabs

// D major scale frequencies
// D4=293.66  E4=329.63  F#4=369.99  G4=392.00  A4=440.00  B4=493.88  C#5=554.37
// D5=587.33  E5=659.25  F#5=739.99  G5=784.00  A5=880.00  B5=987.77  D6=1174.66

// Melody — triangle wave, staccato (0.18–0.22s notes), bouncy ascending/descending runs
const MELODY: { freq: number; time: number; dur: number }[] = [
  // Phrase 1: sunny ascending run  (bar 1)
  { freq: 587.33, time: 0.00, dur: 0.18 },  // D5
  { freq: 659.25, time: 0.25, dur: 0.18 },  // E5
  { freq: 739.99, time: 0.50, dur: 0.18 },  // F#5
  { freq: 784.00, time: 0.75, dur: 0.18 },  // G5
  { freq: 880.00, time: 1.00, dur: 0.38 },  // A5 (held — peak)
  { freq: 784.00, time: 1.50, dur: 0.18 },  // G5
  { freq: 739.99, time: 1.75, dur: 0.18 },  // F#5

  // Phrase 2: bouncy leap + descent  (bar 2)
  { freq: 659.25, time: 2.00, dur: 0.18 },  // E5
  { freq: 587.33, time: 2.25, dur: 0.18 },  // D5
  { freq: 880.00, time: 2.50, dur: 0.22 },  // A5 (leap!)
  { freq: 784.00, time: 2.75, dur: 0.18 },  // G5
  { freq: 659.25, time: 3.00, dur: 0.18 },  // E5
  { freq: 587.33, time: 3.25, dur: 0.18 },  // D5
  { freq: 493.88, time: 3.50, dur: 0.18 },  // B4
  { freq: 587.33, time: 3.75, dur: 0.18 },  // D5

  // Phrase 3: high note flourish  (bar 3)
  { freq: 739.99, time: 4.00, dur: 0.18 },  // F#5
  { freq: 880.00, time: 4.25, dur: 0.18 },  // A5
  { freq: 987.77, time: 4.50, dur: 0.18 },  // B5
  { freq: 1174.66,time: 4.75, dur: 0.38 },  // D6 (sparkle!)
  { freq: 987.77, time: 5.25, dur: 0.18 },  // B5
  { freq: 880.00, time: 5.50, dur: 0.18 },  // A5
  { freq: 784.00, time: 5.75, dur: 0.18 },  // G5

  // Phrase 4: warm mid-range groove  (bar 4)
  { freq: 739.99, time: 6.00, dur: 0.18 },  // F#5
  { freq: 659.25, time: 6.25, dur: 0.18 },  // E5
  { freq: 587.33, time: 6.50, dur: 0.18 },  // D5
  { freq: 659.25, time: 6.75, dur: 0.18 },  // E5
  { freq: 739.99, time: 7.00, dur: 0.18 },  // F#5
  { freq: 880.00, time: 7.25, dur: 0.38 },  // A5
  { freq: 739.99, time: 7.75, dur: 0.18 },  // F#5

  // Phrase 5: skippy repeated pattern  (bar 5)
  { freq: 587.33, time: 8.00, dur: 0.18 },  // D5
  { freq: 739.99, time: 8.25, dur: 0.18 },  // F#5
  { freq: 587.33, time: 8.50, dur: 0.18 },  // D5
  { freq: 739.99, time: 8.75, dur: 0.18 },  // F#5
  { freq: 880.00, time: 9.00, dur: 0.18 },  // A5
  { freq: 987.77, time: 9.25, dur: 0.18 },  // B5
  { freq: 880.00, time: 9.50, dur: 0.18 },  // A5
  { freq: 784.00, time: 9.75, dur: 0.18 },  // G5

  // Phrase 6: playful call-and-response  (bar 6)
  { freq: 659.25, time: 10.00, dur: 0.18 }, // E5
  { freq: 784.00, time: 10.25, dur: 0.18 }, // G5
  { freq: 659.25, time: 10.50, dur: 0.18 }, // E5
  { freq: 587.33, time: 10.75, dur: 0.18 }, // D5
  { freq: 493.88, time: 11.00, dur: 0.18 }, // B4
  { freq: 587.33, time: 11.25, dur: 0.18 }, // D5
  { freq: 659.25, time: 11.50, dur: 0.38 }, // E5 (held)
  { freq: 739.99, time: 11.75, dur: 0.18 }, // F#5 (no wait, overlaps - adjust)

  // Phrase 7: triumphant close  (bar 7)
  { freq: 880.00, time: 12.00, dur: 0.18 }, // A5
  { freq: 784.00, time: 12.25, dur: 0.18 }, // G5
  { freq: 739.99, time: 12.50, dur: 0.18 }, // F#5
  { freq: 659.25, time: 12.75, dur: 0.18 }, // E5
  { freq: 587.33, time: 13.00, dur: 0.18 }, // D5
  { freq: 659.25, time: 13.25, dur: 0.18 }, // E5
  { freq: 739.99, time: 13.50, dur: 0.18 }, // F#5
  { freq: 880.00, time: 13.75, dur: 1.10 }, // A5 — big joyful landing
]

// Bass plucks — sawtooth, fast attack, exponential decay (punchy + warm)
// Alternates D3 / A3 / G3 on quarter-note beats
const BASS: { freq: number; time: number }[] = [
  { freq: 146.83, time: 0.00 },  // D3
  { freq: 220.00, time: 0.50 },  // A3
  { freq: 146.83, time: 1.00 },  // D3
  { freq: 220.00, time: 1.50 },  // A3
  { freq: 146.83, time: 2.00 },  // D3
  { freq: 196.00, time: 2.50 },  // G3
  { freq: 146.83, time: 3.00 },  // D3
  { freq: 220.00, time: 3.50 },  // A3
  { freq: 146.83, time: 4.00 },  // D3
  { freq: 220.00, time: 4.50 },  // A3
  { freq: 146.83, time: 5.00 },  // D3
  { freq: 196.00, time: 5.50 },  // G3
  { freq: 146.83, time: 6.00 },  // D3
  { freq: 246.94, time: 6.50 },  // B3
  { freq: 220.00, time: 7.00 },  // A3
  { freq: 146.83, time: 7.50 },  // D3
  { freq: 146.83, time: 8.00 },  // D3
  { freq: 220.00, time: 8.50 },  // A3
  { freq: 146.83, time: 9.00 },  // D3
  { freq: 196.00, time: 9.50 },  // G3
  { freq: 146.83, time: 10.00 }, // D3
  { freq: 220.00, time: 10.50 }, // A3
  { freq: 146.83, time: 11.00 }, // D3
  { freq: 246.94, time: 11.50 }, // B3
  { freq: 220.00, time: 12.00 }, // A3
  { freq: 196.00, time: 12.50 }, // G3
  { freq: 146.83, time: 13.00 }, // D3
  { freq: 220.00, time: 13.50 }, // A3
  { freq: 146.83, time: 14.00 }, // D3
  { freq: 220.00, time: 14.50 }, // A3
]

// Chord stabs — sine, on off-beats (half-time feel), D major voicing
// D4 + F#4 + A4  =  293.66, 369.99, 440.00
const CHORD_TIMES = [0.50, 1.50, 2.50, 3.50, 4.50, 5.50, 6.50, 7.50,
                     8.50, 9.50, 10.50, 11.50, 12.50, 13.50, 14.50]
const CHORD_FREQS = [293.66, 369.99, 440.00] // D4, F#4, A4

function pluckBass(ctx: AudioContext, dest: AudioNode, freq: number, time: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "sawtooth"
  osc.frequency.setValueAtTime(freq, time)
  gain.gain.setValueAtTime(0.28, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45)
  osc.connect(gain)
  gain.connect(dest)
  osc.start(time)
  osc.stop(time + 0.5)
}

function scheduleLoop(ctx: AudioContext, masterGain: GainNode, startTime: number) {
  const now = startTime

  // Melody — bright triangle, staccato with soft attack
  MELODY.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(freq, now + time)
    gain.gain.setValueAtTime(0, now + time)
    gain.gain.linearRampToValueAtTime(0.30, now + time + 0.03)  // snappy attack
    gain.gain.linearRampToValueAtTime(0.18, now + time + dur * 0.6)
    gain.gain.linearRampToValueAtTime(0, now + time + dur)
    osc.connect(gain)
    gain.connect(masterGain)
    osc.start(now + time)
    osc.stop(now + time + dur + 0.01)
  })

  // Bass plucks
  BASS.forEach(({ freq, time }) => {
    pluckBass(ctx, masterGain, freq, now + time)
  })

  // Chord stabs — airy sine, very short and light
  CHORD_TIMES.forEach((time) => {
    CHORD_FREQS.forEach((freq) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, now + time)
      gain.gain.setValueAtTime(0, now + time)
      gain.gain.linearRampToValueAtTime(0.08, now + time + 0.02)
      gain.gain.linearRampToValueAtTime(0, now + time + 0.22)
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start(now + time)
      osc.stop(now + time + 0.25)
    })
  })
}

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loopCountRef = useRef(0)

  const scheduleNextLoop = useCallback((ctx: AudioContext, masterGain: GainNode, iteration: number) => {
    scheduleLoop(ctx, masterGain, ctx.currentTime + (iteration === 0 ? 0.05 : 0))

    timerRef.current = setTimeout(() => {
      if (audioCtxRef.current && masterGainRef.current) {
        loopCountRef.current += 1
        scheduleNextLoop(audioCtxRef.current, masterGainRef.current, loopCountRef.current)
      }
    }, (LOOP_DURATION - 0.05) * 1000)
  }, [])

  const play = useCallback(() => {
    const ctx = new AudioContext()
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.45, ctx.currentTime)
    masterGain.connect(ctx.destination)

    audioCtxRef.current = ctx
    masterGainRef.current = masterGain
    loopCountRef.current = 0

    scheduleNextLoop(ctx, masterGain, 0)
    setIsPlaying(true)
  }, [scheduleNextLoop])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    // Capture and immediately clear refs so play() can safely re-enter
    // during the fade-out window without hitting the guard.
    const ctx = audioCtxRef.current
    const gain = masterGainRef.current
    audioCtxRef.current = null
    masterGainRef.current = null

    if (gain && ctx) {
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
      // Track this timeout so the unmount cleanup can cancel it if the
      // component unmounts before the 350ms fade completes.
      fadeTimerRef.current = setTimeout(() => {
        ctx.close()
        fadeTimerRef.current = null
      }, 350)
    }
    setIsPlaying(false)
  }, [])

  // Cancel any in-flight fade-out timer when the hook's owner unmounts.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop()
    } else {
      play()
    }
  }, [isPlaying, play, stop])

  return { isPlaying, toggle }
}
