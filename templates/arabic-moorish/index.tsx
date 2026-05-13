'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LanguageProvider } from './LanguageContext';
import { InvitationDataProvider } from './InvitationDataContext';
import { DEFAULT_INVITATION_DATA } from '@/lib/invitation-types';
import type { InvitationData } from '@/lib/invitation-types';
import { useBackgroundMusic } from '@/lib/useBackgroundMusic';
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
import ConfettiEffect from './ConfettiEffect'
import MusicToggle from './MusicToggle';

// Seconds before video end to start fade (computed dynamically from duration)
const FADE_BEFORE_END = 3.8

type Screen = 'idle' | 'playing' | 'fading' | 'main';

interface ArabicMoorishProps {
  invitationId?: string;
  data?: InvitationData;
  previewMode?: boolean;
}

const ArabicMoorishTemplate = ({ invitationId, data = DEFAULT_INVITATION_DATA, previewMode = false }: ArabicMoorishProps) => {
  const [screen, setScreen] = useState<Screen>(previewMode ? 'main' : 'idle');
  const [shakeConfetti, setShakeConfetti] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadingRef = useRef(false)

  const { play, toggleMute, isMuted } = useBackgroundMusic({
    url: data.musicUrl || undefined,
    disabled: previewMode,
  });

  // User taps → play video
  const handleTap = useCallback(() => {
    if (screen !== 'idle') return
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
    setScreen('playing')
  }, [screen])

  // Near end of video → fade out overlay, fade in main
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || fadingRef.current) return
    const { currentTime, duration } = video
    if (!isFinite(duration)) return
    const remaining = duration - currentTime
    // Compute inline so there's no race with onLoadedMetadata
    const fadeAt = Math.min(FADE_BEFORE_END, Math.max(0.6, duration * 0.2))
    if (remaining <= fadeAt) {
      fadingRef.current = true
      setScreen('fading')
      window.setTimeout(() => {
        setScreen('main')
        play()
      }, 1200)
    }
  }, [play])

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

  const showOverlay = screen !== 'main'
  const showMain = screen === 'fading' || screen === 'main'

  return (
    <InvitationDataProvider data={data} previewMode={previewMode}>
      <LanguageProvider>
        <div
          className="am-no-scrollbar min-h-screen transition-colors duration-1000"
          style={{ backgroundColor: screen === 'main' ? undefined : '#1A1008' }}
        >
          {shakeConfetti && <ConfettiEffect />}

          {/* Main content — mounted when fading begins so it's ready when overlay clears */}
          {showMain && (
            <div className={`transition-opacity duration-700 ${screen === 'fading' ? 'opacity-0' : 'opacity-100'}`}>
              <LanguageToggle />
              {!previewMode && data.musicUrl && data.musicUrl !== 'pending' && <MusicToggle isMuted={isMuted} onToggle={toggleMute} />}
              <HeroNames />
              <CelebrationDetailsSection />
              <DateLocation showOnly={['wedding']} />
              <VenueSection />
              <TimelineSection />
              <AboutCouple />
              <DressCode />
              <RSVPSection invitationId={invitationId} />
              <WeddingFooter />
            </div>
          )}

          {/* Opening overlay — video + tap prompt */}
          {!previewMode && showOverlay && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleTap}
              onKeyDown={(e) => e.key === 'Enter' && handleTap()}
              className={`fixed inset-0 z-50 overflow-hidden bg-[#1A1008] transition-opacity duration-1000 ${
                screen === 'fading' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="/templates/arabic-moorish/opening.mp4"
                muted
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
              />

              {/* Tap prompt — only shown on idle */}
              {screen === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="flex translate-x-8.5 translate-y-[-15px] flex-col items-center gap-3">
                    {/* Pulsing ring */}
                    <div className="relative flex h-16 w-16 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-[ping_1.75s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-[#C8813A] opacity-25" />
                      <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#C8813A]/60 bg-[#C8813A]/15 backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#D4AF7A]" fill="currentColor">
                          <path d="M9 12.5c0-.83.67-1.5 1.5-1.5h.5V8.5a1 1 0 012 0V11h.5c.28 0 .5.22.5.5v4a3 3 0 01-3 3h-1a2 2 0 01-2-2v-4zm5-8a1 1 0 00-2 0v1.17A3.5 3.5 0 008 9v1H7a1 1 0 000 2h1v1.5A3.5 3.5 0 0011.5 17H13a4 4 0 004-4V9.5A3.5 3.5 0 0014 6.17V4.5z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF7A]/80"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      tap to open
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </LanguageProvider>
    </InvitationDataProvider>
  );
};

export default ArabicMoorishTemplate;

