'use client'
import { Player } from '@remotion/player'
import { InvitationAnimation } from '@/remotion/InvitationAnimation'

export default function HeroAnimation() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-espresso/10 border border-gold/20">
      <Player
        component={InvitationAnimation}
        durationInFrames={210}
        fps={30}
        compositionWidth={640}
        compositionHeight={420}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        loop
        autoPlay
        controls={false}
        clickToPlay={false}
      />
    </div>
  )
}
