// components/AudioPlayer.tsx
'use client'
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'

export interface AudioPlayerHandle {
  startMusic: () => void
}

const AudioPlayer = forwardRef<AudioPlayerHandle>((_, ref) => {
  const audioRef      = useRef<HTMLAudioElement>(null)
  const fadeRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const wasPlayingRef = useRef(false)
  const [muted, setMuted] = useState(false)
  const [visible,  setVisible]  = useState(false)

  // Pause when tab is hidden; resume when it comes back.
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        wasPlayingRef.current = !audio.paused
        audio.pause()
      } else if (wasPlayingRef.current) {
        wasPlayingRef.current = false
        void audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (fadeRef.current) clearInterval(fadeRef.current)
    }
  }, [])

  // Called by ScratchReveal on the first real user gesture so mobile browsers allow autoplay.
  useImperativeHandle(ref, () => ({
    startMusic() {
      const audio = audioRef.current
      if (!audio) return
      if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null }
      audio.volume = 0
      audio.muted = false
      setMuted(false)
      setVisible(true)
      // Start play and fade in volume simultaneously — don't wait for promise so
      // the interval starts in the same gesture call stack (required on iOS).
      void audio.play().catch(() => {
        // Autoplay blocked — button is already visible, user can tap manually.
      })
      const step = 0.5 / 30
      let v = 0
      fadeRef.current = setInterval(() => {
        v = Math.min(0.5, v + step)
        if (audioRef.current) audioRef.current.volume = v
        if (v >= 0.5 && fadeRef.current) {
          clearInterval(fadeRef.current)
          fadeRef.current = null
        }
      }, 50)
    },
  }))

  const toggleAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      // Reset volume in case startMusic set it to 0 before autoplay was blocked.
      if (audio.volume === 0) audio.volume = 0.5
      audio.muted = false
      setMuted(false)
      setVisible(true)
      void audio.play().catch(() => {})
    } else {
      audio.muted = !audio.muted
      setMuted(audio.muted)
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/GooGooDolls-Iris.mp3" loop preload="auto" />
      {visible && (
        <button
          type="button"
          onClick={toggleAudio}
          className="fixed bottom-5 right-5 z-50 w-9 h-9 rounded-full bg-espresso/80 border border-gold/30 flex items-center justify-center transition-opacity duration-300"
          aria-label={muted ? 'Unmute music' : 'Mute music'}
        >
          {muted ? (
            /* Muted speaker */
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#c9a96e' }}>
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" strokeWidth="0"/>
              <line x1="16" y1="9" x2="22" y2="15"/>
              <line x1="22" y1="9" x2="16" y2="15"/>
            </svg>
          ) : (
            /* Speaker */
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#c9a96e' }}>
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" strokeWidth="0"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>
      )}
    </>
  )
})

AudioPlayer.displayName = 'AudioPlayer'
export default AudioPlayer
