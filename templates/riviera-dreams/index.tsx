'use client'

import { useCallback, useRef, useState } from 'react'
import { DEFAULT_INVITATION_DATA } from '@/lib/invitation-types'
import type { InvitationData } from '@/lib/invitation-types'
import { InvitationDataProvider } from '../arabic-moorish/InvitationDataContext'
import { RivieraLangProvider } from './LanguageContext'
import HeroSection from './HeroSection'
import EventDateSection from './CountdownTimer'
import VenueSection from './VenueSection'
import DressCodeSection from './DressCodeSection'
import CoupleSection from './CoupleSection'
import DetailsSection from './DetailsSection'
import RSVPSection from './RSVPSection'
import Footer from './Footer'
import LanguageToggle from './LanguageToggle'

// How many seconds before video end to start the fade
const FADE_BEFORE_END = 1.8

type Screen = 'idle' | 'playing' | 'fading' | 'main'

interface SidiBouSaidTemplateProps {
  data?: InvitationData
  previewMode?: boolean
  invitationId?: string
  controlledLang?: { value: 'lang1' | 'lang2'; onChange: (l: 'lang1' | 'lang2') => void }
}

export default function SidiBouSaidTemplate({
  data = DEFAULT_INVITATION_DATA,
  previewMode = false,
  invitationId,
  controlledLang,
}: SidiBouSaidTemplateProps) {
  const [screen, setScreen] = useState<Screen>(previewMode ? 'main' : 'idle')
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadingRef = useRef(false)

  // User taps the opening screen → start playing
  const handleTap = useCallback(() => {
    if (screen !== 'idle') return
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {/* browser may block; handled gracefully */})
    setScreen('playing')
  }, [screen])

  // Watch playback position — begin fade near the end
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || fadingRef.current) return
    const remaining = video.duration - video.currentTime
    if (isFinite(remaining) && remaining <= FADE_BEFORE_END) {
      fadingRef.current = true
      setScreen('fading')
      // After fade completes, show main content
      window.setTimeout(() => setScreen('main'), 1000)
    }
  }, [])

  const showOverlay = screen !== 'main'

  return (
    <InvitationDataProvider data={data} previewMode={previewMode}>
      <RivieraLangProvider controlled={controlledLang}>
        <div className="sbs-no-scrollbar bg-[#F5F7FA] text-[#1C2B4A]" style={{ fontFamily: "'Caveat', cursive" }}>

          {/* Main invitation content — always mounted, fades in when ready */}
          <main
            className={`transition-opacity duration-1000 ${
              screen === 'main' ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <HeroSection />

            <EventDateSection />
            <VenueSection />
            <DressCodeSection />

            <CoupleSection />
            <DetailsSection />
            <RSVPSection invitationId={invitationId} />
            <Footer />
          </main>

          {/* Floating language toggle — visible whenever main content is shown */}
          {screen === 'main' && <LanguageToggle />}

          {/* Opening overlay — video + tap prompt */}
          {!previewMode && showOverlay && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleTap}
              onKeyDown={(e) => e.key === 'Enter' && handleTap()}
              className={`fixed inset-0 z-50 overflow-hidden bg-[#10203f] transition-opacity duration-1000 ${
                screen === 'fading' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="/templates/riviera-dreams/opening.mp4"
                muted
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
              />


            </div>
          )}
        </div>
      </RivieraLangProvider>
    </InvitationDataProvider>
  )
}

