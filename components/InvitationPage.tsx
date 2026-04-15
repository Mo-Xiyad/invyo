// components/InvitationPage.tsx
'use client'
import { useRef, useState } from 'react'
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

export default function InvitationPage({ arrivalTime }: { arrivalTime: '16:30' | '17:30' }) {
  const [phase, setPhase] = useState<'scratch' | 'open'>('scratch')
  const audioRef = useRef<AudioPlayerHandle>(null)

  const handleRevealed = () => {
    audioRef.current?.startMusic()
  }

  const handleOpen = () => {
    setPhase('open')
  }

  return (
    <div className="min-h-dvh flex items-start justify-center" style={{ background: '#0d0a07' }}>
      <div className="relative min-h-dvh w-full max-w-[430px]">
        {phase === 'scratch' && (
          <div className="h-dvh w-full">
            <ScratchReveal onRevealed={handleRevealed} onOpen={handleOpen} />
          </div>
        )}

        {phase === 'open' && (
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
