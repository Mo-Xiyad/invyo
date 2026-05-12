'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseBackgroundMusicOptions {
  url: string | undefined
  disabled?: boolean   // pass true in preview/editor mode
  volume?: number
}

export function useBackgroundMusic({ url, disabled = false, volume = 0.3 }: UseBackgroundMusicOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Create audio element
  useEffect(() => {
    if (disabled || !url || url === 'pending') return

    const audio = new Audio(url)
    audio.loop = true
    audio.volume = volume
    audio.preload = 'auto'
    audioRef.current = audio

    audio.addEventListener('canplaythrough', () => setIsReady(true), { once: true })

    // Stop on tab hide, resume on tab show
    const handleVisibility = () => {
      if (!audioRef.current) return
      if (document.hidden) {
        audioRef.current.pause()
      } else if (audioRef.current.currentTime > 0 && !audioRef.current.muted) {
        audioRef.current.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Stop on page navigate / back button
    const handlePageHide = () => {
      audio.pause()
      audio.currentTime = 0
    }
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [url, disabled, volume])

  // Play — called on user interaction (envelope open, tap, etc.)
  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }, [])

  return { play, toggleMute, isMuted, isReady }
}
