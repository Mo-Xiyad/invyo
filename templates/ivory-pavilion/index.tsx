'use client'

import { useCallback, useRef, useState } from 'react'
import { IVORY_PAVILION_DEFAULTS } from '@/lib/invitation-types'
import type { InvitationData } from '@/lib/invitation-types'
import { useBackgroundMusic } from '@/lib/useBackgroundMusic'
import { InvitationDataProvider } from './InvitationDataContext'
import HeroSection from './HeroSection'
import CountdownSection from './CountdownSection'
import TimelineSection from './TimelineSection'
import VenueSection from './VenueSection'
import DressCodeSection from './DressCodeSection'
import CoupleStorySection from './CoupleStorySection'
import RSVPSection from './RSVPSection'
import FooterSection from './FooterSection'

type Screen = 'idle' | 'playing' | 'fading' | 'main'

interface IvoryPavilionTemplateProps {
  invitationId?: string
  data?: InvitationData
  previewMode?: boolean
}

function MusicToggle({ isMuted, onToggle }: { isMuted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      className="fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#C8B99A]/60 bg-[#FAF8F5]/85 text-[#2C2416] shadow-[0_12px_30px_rgba(44,36,22,0.12)] backdrop-blur-sm transition hover:scale-105"
    >
      {isMuted ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
          <path d="m16 9 5 6" />
          <path d="m21 9-5 6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
          <path d="M15.5 8.5a5.5 5.5 0 0 1 0 7" />
          <path d="M18 6a9 9 0 0 1 0 12" />
        </svg>
      )}
    </button>
  )
}

export default function IvoryPavilionTemplate({
  invitationId,
  data = IVORY_PAVILION_DEFAULTS,
  previewMode = false,
}: IvoryPavilionTemplateProps) {
  const [screen, setScreen] = useState<Screen>(previewMode ? 'main' : 'idle')
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadingRef = useRef(false)

  const { play, toggleMute, isMuted } = useBackgroundMusic({
    url: data.musicUrl || undefined,
    disabled: previewMode,
  })

  const handleTap = useCallback(() => {
    if (screen !== 'idle') return
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
    setScreen('playing')
  }, [screen])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || fadingRef.current) return
    const { currentTime, duration } = video
    if (!isFinite(duration)) return
    const remaining = duration - currentTime
    const fadeAt = Math.min(3.8, Math.max(0.6, duration * 0.2))
    if (remaining <= fadeAt) {
      fadingRef.current = true
      setScreen('fading')
      window.setTimeout(() => {
        setScreen('main')
        play()
      }, 1200)
    }
  }, [play])

  const showOverlay = screen !== 'main'
  const showMain = screen === 'fading' || screen === 'main'

  return (
    <InvitationDataProvider data={data} previewMode={previewMode}>
      <div
        className="min-h-screen overflow-hidden transition-colors duration-1000"
        style={{ backgroundColor: screen === 'main' ? '#F5F0EB' : '#1A120A' }}
      >
        {showMain && (
          <main className={`overflow-x-hidden transition-opacity duration-700 ${screen === 'fading' ? 'opacity-0' : 'opacity-100'}`}>
            {!previewMode && data.musicUrl && data.musicUrl !== 'pending' && (
              <MusicToggle isMuted={isMuted} onToggle={toggleMute} />
            )}
            <HeroSection />
            <CountdownSection />
            <TimelineSection />
            <VenueSection />
            <DressCodeSection />
            <CoupleStorySection />
            <RSVPSection invitationId={invitationId} />
            <FooterSection />
          </main>
        )}

        {!previewMode && showOverlay && (
          <div
            role="button"
            tabIndex={0}
            onClick={handleTap}
            onKeyDown={(event) => event.key === 'Enter' && handleTap()}
            className={`fixed inset-0 z-50 overflow-hidden bg-[#1A120A] transition-opacity duration-1000 ${
              screen === 'fading' ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src="/templates/ivory-pavilion/opening.mp4"
              muted
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
            />

            {screen === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(26,18,10,0.15),rgba(26,18,10,0.72))]">
                <div className="pointer-events-none flex flex-col items-center gap-4 text-center">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-[#C8B99A]/25" />
                    <span className="absolute inline-flex h-16 w-16 rounded-full border border-[#E8DFD0]/40" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#C8B99A]/70 bg-[#FAF8F5]/12 shadow-[0_0_30px_rgba(200,185,154,0.18)] backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#E8DFD0]" fill="currentColor">
                        <path d="M8.5 8.5a1 1 0 0 1 1.53-.85l6 3.5a1 1 0 0 1 0 1.7l-6 3.5A1 1 0 0 1 8.5 15V8.5Z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-[0.45em] text-[#E8DFD0]"
                      style={{ fontFamily: "'Source Serif 4', serif" }}
                    >
                      tap to open
                    </p>
                    <p
                      className="mt-2 text-xl italic text-[#C8B99A]"
                      style={{ fontFamily: "'Source Serif 4', serif" }}
                    >
                      An invitation in ivory
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </InvitationDataProvider>
  )
}
