// components/AudioPlayer.tsx
'use client'
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'

export interface AudioPlayerHandle {
  startMusic: () => void
}

const AudioPlayer = forwardRef<AudioPlayerHandle>((_, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(false)
  const [visible, setVisible] = useState(false)
  const wasPlaying = useRef(false)
  const fadeInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  useImperativeHandle(ref, () => ({
    startMusic() {
      const audio = audioRef.current
      if (!audio) return
      if (fadeInterval.current) {
        clearInterval(fadeInterval.current)
        fadeInterval.current = null
      }
      audio.volume = 0
      audio.muted = false
      void audio.play().catch(() => {})
      setVisible(true)
      const step = 0.5 / 30
      let v = 0
      fadeInterval.current = setInterval(() => {
        v = Math.min(0.5, v + step)
        if (audioRef.current) audioRef.current.volume = v
        if (v >= 0.5 && fadeInterval.current) {
          clearInterval(fadeInterval.current)
          fadeInterval.current = null
        }
      }, 50)
    },
  }))

  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        wasPlaying.current = !audio.paused
        audio.pause()
      } else if (wasPlaying.current) {
        void audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (fadeInterval.current) clearInterval(fadeInterval.current)
    }
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/GooGooDolls-Iris.mp3" loop preload="auto" />
      {visible && (
        <button
          type="button"
          onClick={toggleMute}
          className="fixed bottom-5 right-5 z-50 w-9 h-9 rounded-full bg-espresso/80 border border-gold/30 flex items-center justify-center text-base transition-opacity duration-300"
          aria-label={muted ? 'Unmute music' : 'Mute music'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}
    </>
  )
})

AudioPlayer.displayName = 'AudioPlayer'
export default AudioPlayer
