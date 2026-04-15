// components/InvitationPage.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import ScratchReveal from './ScratchReveal'
import HeroSection from './HeroSection'
import Countdown from './Countdown'
import EventDetails from './EventDetails'
import DressCode from './DressCode'
import VenueMap from './VenueMap'
import OrnamentDivider from './OrnamentDivider'
import PrivateNotice from './PrivateNotice'
import RSVPSection from './RSVPSection'
import AudioPlayer, { type AudioPlayerHandle } from './AudioPlayer'

const LOADER_SRC = '/assets/loader.png'
const CRITICAL_ASSETS = [
  '/assets/scratch-to-reveal.svg',
  '/assets/Elegant-vintage-floral-stationery-design.png',
  '/assets/Elegant-gold-wax-seal-monogram.png',
  '/assets/Elegant-floral-elegance-with-candlelight-glow.png',
]

export default function InvitationPage({ arrivalTime }: { arrivalTime: '16:30' | '17:30' }) {
  const [phase, setPhase] = useState<'scratch' | 'open'>('scratch')
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<AudioPlayerHandle>(null)
  const audioStartAttempted = useRef(false)

  const attemptStartMusic = () => {
    if (audioStartAttempted.current) return
    audioStartAttempted.current = true
    audioRef.current?.startMusic()
  }

  const handleRevealed = () => {
    attemptStartMusic()
  }

  const handleOpen = () => {
    setPhase('open')
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
            <img
              src={LOADER_SRC}
              alt="Loading invitation"
              width={1080}
              height={1920}
              decoding="async"
              className="h-full w-full object-cover object-center animate-hintPulse"
            />
          </div>
        )}

        {!loading && phase === 'scratch' && (
          <div className="h-dvh w-full">
            <ScratchReveal onRevealed={handleRevealed} onOpen={handleOpen} />
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
            <RSVPSection />
          </main>
        )}

        <AudioPlayer ref={audioRef} />
      </div>
    </div>
  )
}
