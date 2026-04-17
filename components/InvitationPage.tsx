// components/InvitationPage.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import EnvelopeEntry from './EnvelopeEntry'
import HeroSection from './HeroSection'
import Countdown from './Countdown'
import EventDetails from './EventDetails'
import DressCode from './DressCode'
import VenueMap from './VenueMap'
import OrnamentDivider from './OrnamentDivider'
import PrivateNotice from './PrivateNotice'
import RSVPSection from './RSVPSection'
import AudioPlayer, { type AudioPlayerHandle } from './AudioPlayer'
import type { InviteRoute } from '@/lib/rsvp'

const LOADING_SEAL_SRC = '/assets/vax-seal.png'
const CRITICAL_ASSETS = ['/assets/vax-seal.png', '/assets/Z-y-logo.png', '/assets/front-page-bg.png']

export default function InvitationPage({
  arrivalTime,
  inviteRoute,
}: {
  arrivalTime: '16:30' | '17:30'
  inviteRoute: InviteRoute
}) {
  const [phase, setPhase] = useState<'envelope' | 'open'>('envelope')
  const [openingEnvelope, setOpeningEnvelope] = useState(false)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<AudioPlayerHandle>(null)
  const audioStartAttempted = useRef(false)

  const attemptStartMusic = () => {
    if (audioStartAttempted.current) return
    audioStartAttempted.current = true
    audioRef.current?.startMusic()
  }

  const handleEnvelopeOpen = () => {
    setOpeningEnvelope(true)
    attemptStartMusic()
    window.setTimeout(() => {
      setPhase('open')
      setOpeningEnvelope(false)
    }, 1050)
  }

  useEffect(() => {
    let cancelled = false
    let loaded = 0
    const total = CRITICAL_ASSETS.length
    const timeout = window.setTimeout(() => {
      if (!cancelled) setLoading(false)
    }, 5000)

    const completeOne = () => {
      loaded += 1
      if (loaded >= total && !cancelled) {
        window.clearTimeout(timeout)
        setLoading(false)
      }
    }

    for (const src of CRITICAL_ASSETS) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = completeOne
      img.onerror = completeOne
      img.src = src
    }

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="min-h-dvh flex items-start justify-center" style={{ background: '#0d0a07' }}>
      <div className="relative min-h-dvh w-full max-w-[430px]">
        {loading && (
          <div className="absolute inset-0 z-[80] h-dvh w-full overflow-hidden bg-[#0d0a07]">
            <div
              className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center p-8"
              aria-hidden
            >
              <img
                src={LOADING_SEAL_SRC}
                alt=""
                width={512}
                height={512}
                decoding="async"
                draggable={false}
                className="w-[min(48vw,200px)] max-w-[220px] object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_1px_rgba(201,169,110,0.4)]"
              />
            </div>
          </div>
        )}

        {!loading && phase === 'envelope' && (
          <div className="h-dvh w-full">
            <EnvelopeEntry opening={openingEnvelope} onOpen={handleEnvelopeOpen} />
          </div>
        )}

        {!loading && phase === 'open' && (
          <main className="bg-parchment">
            <HeroSection />
            <Countdown arrivalTime={arrivalTime} />
            <EventDetails arrivalTime={arrivalTime} />
            <DressCode />
            <VenueMap />
            <OrnamentDivider />
            <PrivateNotice />
            <RSVPSection inviteRoute={inviteRoute} />
          </main>
        )}

        <AudioPlayer ref={audioRef} />
      </div>
    </div>
  )
}
