"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const LOOP_DURATION = 15

const MELODY: { freq: number; time: number; dur: number }[] = [
  { freq: 587.33, time: 0.0, dur: 0.18 },
  { freq: 659.25, time: 0.25, dur: 0.18 },
  { freq: 739.99, time: 0.5, dur: 0.18 },
  { freq: 784.0, time: 0.75, dur: 0.18 },
  { freq: 880.0, time: 1.0, dur: 0.38 },
  { freq: 784.0, time: 1.5, dur: 0.18 },
  { freq: 739.99, time: 1.75, dur: 0.18 },
  { freq: 659.25, time: 2.0, dur: 0.18 },
  { freq: 587.33, time: 2.25, dur: 0.18 },
  { freq: 880.0, time: 2.5, dur: 0.22 },
  { freq: 784.0, time: 2.75, dur: 0.18 },
  { freq: 659.25, time: 3.0, dur: 0.18 },
  { freq: 587.33, time: 3.25, dur: 0.18 },
  { freq: 493.88, time: 3.5, dur: 0.18 },
  { freq: 587.33, time: 3.75, dur: 0.18 },
  { freq: 739.99, time: 4.0, dur: 0.18 },
  { freq: 880.0, time: 4.25, dur: 0.18 },
  { freq: 987.77, time: 4.5, dur: 0.18 },
  { freq: 1174.66, time: 4.75, dur: 0.38 },
  { freq: 987.77, time: 5.25, dur: 0.18 },
  { freq: 880.0, time: 5.5, dur: 0.18 },
  { freq: 784.0, time: 5.75, dur: 0.18 },
  { freq: 739.99, time: 6.0, dur: 0.18 },
  { freq: 659.25, time: 6.25, dur: 0.18 },
  { freq: 587.33, time: 6.5, dur: 0.18 },
  { freq: 659.25, time: 6.75, dur: 0.18 },
  { freq: 739.99, time: 7.0, dur: 0.18 },
  { freq: 880.0, time: 7.25, dur: 0.38 },
  { freq: 739.99, time: 7.75, dur: 0.18 },
  { freq: 587.33, time: 8.0, dur: 0.18 },
  { freq: 739.99, time: 8.25, dur: 0.18 },
  { freq: 587.33, time: 8.5, dur: 0.18 },
  { freq: 739.99, time: 8.75, dur: 0.18 },
  { freq: 880.0, time: 9.0, dur: 0.18 },
  { freq: 987.77, time: 9.25, dur: 0.18 },
  { freq: 880.0, time: 9.5, dur: 0.18 },
  { freq: 784.0, time: 9.75, dur: 0.18 },
  { freq: 659.25, time: 10.0, dur: 0.18 },
  { freq: 784.0, time: 10.25, dur: 0.18 },
  { freq: 659.25, time: 10.5, dur: 0.18 },
  { freq: 587.33, time: 10.75, dur: 0.18 },
  { freq: 493.88, time: 11.0, dur: 0.18 },
  { freq: 587.33, time: 11.25, dur: 0.18 },
  { freq: 659.25, time: 11.5, dur: 0.38 },
  { freq: 739.99, time: 11.75, dur: 0.18 },
  { freq: 880.0, time: 12.0, dur: 0.18 },
  { freq: 784.0, time: 12.25, dur: 0.18 },
  { freq: 739.99, time: 12.5, dur: 0.18 },
  { freq: 659.25, time: 12.75, dur: 0.18 },
  { freq: 587.33, time: 13.0, dur: 0.18 },
  { freq: 659.25, time: 13.25, dur: 0.18 },
  { freq: 739.99, time: 13.5, dur: 0.18 },
  { freq: 880.0, time: 13.75, dur: 1.1 },
]

const BASS: { freq: number; time: number }[] = [
  { freq: 146.83, time: 0.0 },
  { freq: 220.0, time: 0.5 },
  { freq: 146.83, time: 1.0 },
  { freq: 220.0, time: 1.5 },
  { freq: 146.83, time: 2.0 },
  { freq: 196.0, time: 2.5 },
  { freq: 146.83, time: 3.0 },
  { freq: 220.0, time: 3.5 },
  { freq: 146.83, time: 4.0 },
  { freq: 220.0, time: 4.5 },
  { freq: 146.83, time: 5.0 },
  { freq: 196.0, time: 5.5 },
  { freq: 146.83, time: 6.0 },
  { freq: 246.94, time: 6.5 },
  { freq: 220.0, time: 7.0 },
  { freq: 146.83, time: 7.5 },
  { freq: 146.83, time: 8.0 },
  { freq: 220.0, time: 8.5 },
  { freq: 146.83, time: 9.0 },
  { freq: 196.0, time: 9.5 },
  { freq: 146.83, time: 10.0 },
  { freq: 220.0, time: 10.5 },
  { freq: 146.83, time: 11.0 },
  { freq: 246.94, time: 11.5 },
  { freq: 220.0, time: 12.0 },
  { freq: 196.0, time: 12.5 },
  { freq: 146.83, time: 13.0 },
  { freq: 220.0, time: 13.5 },
  { freq: 146.83, time: 14.0 },
  { freq: 220.0, time: 14.5 },
]

const CHORD_TIMES = [
  0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5,
  8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5,
]
const CHORD_FREQS = [293.66, 369.99, 440.0]

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
  MELODY.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(freq, startTime + time)
    gain.gain.setValueAtTime(0, startTime + time)
    gain.gain.linearRampToValueAtTime(0.3, startTime + time + 0.03)
    gain.gain.linearRampToValueAtTime(0.18, startTime + time + dur * 0.6)
    gain.gain.linearRampToValueAtTime(0, startTime + time + dur)
    osc.connect(gain)
    gain.connect(masterGain)
    osc.start(startTime + time)
    osc.stop(startTime + time + dur + 0.01)
  })

  BASS.forEach(({ freq, time }) => {
    pluckBass(ctx, masterGain, freq, startTime + time)
  })

  CHORD_TIMES.forEach((time) => {
    CHORD_FREQS.forEach((freq) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, startTime + time)
      gain.gain.setValueAtTime(0, startTime + time)
      gain.gain.linearRampToValueAtTime(0.08, startTime + time + 0.02)
      gain.gain.linearRampToValueAtTime(0, startTime + time + 0.22)
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start(startTime + time)
      osc.stop(startTime + time + 0.25)
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
    if (audioCtxRef.current || masterGainRef.current) return
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

    const ctx = audioCtxRef.current
    const gain = masterGainRef.current
    audioCtxRef.current = null
    masterGainRef.current = null

    if (ctx && gain) {
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
      fadeTimerRef.current = setTimeout(() => {
        ctx.close()
        fadeTimerRef.current = null
      }, 350)
    }
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) stop()
    else play()
  }, [isPlaying, play, stop])

  return { isPlaying, toggle }
}
