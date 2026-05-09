'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LanguageProvider } from './LanguageContext';
import { InvitationDataProvider } from './InvitationDataContext';
import { DEFAULT_INVITATION_DATA } from '@/lib/invitation-types';
import type { InvitationData } from '@/lib/invitation-types';
import EnvelopeScreen from './EnvelopeScreen';
import HeroNames from './HeroNames';
import CelebrationDetailsSection from './CelebrationDetailsSection';
import DateLocation from './DateLocation';
import VenueSection from './VenueSection';
import AboutCouple from './AboutCouple';
import DressCode from './DressCode';
import TimelineSection from './TimelineSection';
import RSVPSection from './RSVPSection';
import WeddingFooter from './WeddingFooter';
import LanguageToggle from './LanguageToggle';
import ConfettiEffect from './ConfettiEffect';

type Screen = 'envelope' | 'transitioning' | 'main';

interface ArabicMoorishProps {
  invitationId?: string;
  data?: InvitationData;
  previewMode?: boolean;
}

const ArabicMoorishTemplate = ({ invitationId, data = DEFAULT_INVITATION_DATA, previewMode = false }: ArabicMoorishProps) => {
  const [screen, setScreen] = useState<Screen>(previewMode ? 'main' : 'envelope');
  const [shakeConfetti, setShakeConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (previewMode) return;
    const audio = new Audio('/music/background.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        audio.pause();
      } else if (audio.currentTime > 0) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleEnvelopeOpen = useCallback(() => {
    audioRef.current?.play().catch(() => {});
    setScreen('transitioning');
    setTimeout(() => setScreen('main'), 1400);
  }, []);

  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0, lastTime = 0;
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;
      const now = Date.now();
      if (now - lastTime < 100) return;
      const dx = Math.abs(acc.x - lastX);
      const dy = Math.abs(acc.y - lastY);
      const dz = Math.abs(acc.z - lastZ);
      if (dx + dy + dz > 30) {
        setShakeConfetti(true);
        setTimeout(() => setShakeConfetti(false), 3000);
      }
      lastX = acc.x; lastY = acc.y; lastZ = acc.z; lastTime = now;
    };
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  const showMain = screen === 'transitioning' || screen === 'main';

  return (
    <InvitationDataProvider data={data} previewMode={previewMode}>
      <LanguageProvider>
        <div className="am-no-scrollbar">
          {shakeConfetti && <ConfettiEffect />}
          {showMain && (
            <>
              <LanguageToggle />
              <HeroNames />
              <CelebrationDetailsSection />
              <DateLocation showOnly={['wedding']} />
              <VenueSection />
              <TimelineSection />
              <AboutCouple />
              <DressCode />
              <RSVPSection invitationId={invitationId} />
              <WeddingFooter />
            </>
          )}
          {screen !== 'main' && <EnvelopeScreen onOpen={handleEnvelopeOpen} />}
        </div>
      </LanguageProvider>
    </InvitationDataProvider>
  );
};

export default ArabicMoorishTemplate;
