'use client';

import { useState } from 'react';
import ConfettiEffect from './ConfettiEffect';
import { useInvitationData } from './InvitationDataContext';

type Stage = 'sealed' | 'burst' | 'opening' | 'revealed' | 'fading';

const EnvelopeScreen = ({ onOpen }: { onOpen: () => void }) => {
  const [stage, setStage] = useState<Stage>('sealed');
  const d = useInvitationData();

  const isOpening = stage === 'opening' || stage === 'revealed' || stage === 'fading';
  const isRevealed = stage === 'revealed' || stage === 'fading';
  const showConfetti = stage === 'burst' || stage === 'opening';

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('burst');
    setTimeout(() => setStage('opening'), 500);
    setTimeout(() => setStage('revealed'), 2400);
    setTimeout(() => setStage('fading'), 4400);
    setTimeout(onOpen, 3400);// chnaged this value to 3400 from 5400 for testing purposes
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity ${
        stage === 'fading' ? 'duration-[1200ms] opacity-0' : 'duration-500 opacity-100'
      }`}
      style={{ background: '#1A1A2E' }}
    >
      {showConfetti && <ConfettiEffect />}

      {/* Dense zellige background */}
      <div className="absolute inset-0 am-am-zellige-bg-dense opacity-[0.12]" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(200,129,58,0.12) 0%, transparent 60%)',
      }} />

      {/* 3D perspective container */}
      <div className="absolute inset-0" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>

        {/* Invitation card behind doors */}
        <div
          className="absolute left-1/2 top-[8%] z-[2] w-[88%] max-w-[380px] -translate-x-1/2"
          style={{
            transform: isRevealed
              ? 'translateX(-50%) translateY(0%) scale(1)'
              : 'translateX(-50%) translateY(30%) scale(0.85)',
            opacity: isRevealed ? 1 : 0,
            transition: 'transform 1s ease-out, opacity 1s ease-out',
          }}
        >
          <div className="relative rounded-[1.5rem] border-2 border-[#C8813A]/40 px-6 pb-8 pt-7 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #F5ECD7 0%, #F0E4C8 60%, #EBD9B0 100%)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}>
            <div className="absolute inset-3 rounded-[1.2rem] border border-[#C8813A]/20" />
            <div className="absolute inset-5 rounded-[1rem] border border-[#3D6B5E]/10" />
            <div className="absolute inset-0 am-am-zellige-bg-rich opacity-[0.06]" />
            <KunaaBand className="absolute top-0 inset-x-0" />
            <div className="relative z-10 flex flex-col items-center pt-6">
              <ArabesqueRosette size={72} />
              <p className="mt-4 font-amiri text-sm text-[#1A1A2E]/40" dir="rtl">بسم الله الرحمن الرحيم</p>
              <p className="mt-3 font-lato text-[0.6rem] uppercase tracking-[0.5em] text-[#1A1A2E]/35">Wedding Invitation</p>
              <h2 className="mt-4 font-playfair text-[1.8rem] leading-none text-[#1A1A2E]">{d.groomNameEn}{d.groomLastNameEn ? ` ${d.groomLastNameEn}` : ''}</h2>
              <span className="my-2 font-playfair text-2xl italic text-[#8B1A2E]/70">&amp;</span>
              <h3 className="font-playfair text-[1.8rem] leading-none text-[#1A1A2E]">{d.brideNameEn}{d.brideLastNameEn ? ` ${d.brideLastNameEn}` : ''}</h3>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-px w-10 bg-[#C8813A]/25" />
                <EightPointStar size={10} />
                <div className="h-px w-10 bg-[#C8813A]/25" />
              </div>
              <p className="mt-4 font-lato text-[0.65rem] uppercase tracking-[0.3em] text-[#1A1A2E]/45">Joyfully invite you to celebrate</p>
              <p className="mt-1.5 font-amiri text-sm text-[#1A1A2E]/50" dir="rtl">نتشرف بدعوتكم لمشاركتنا فرحة الزفاف</p>
              <div className="mt-5 rounded-full border border-[#C8813A]/25 px-5 py-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-[#1A1A2E]/50">{d.weddingDate.split(' ')[1] ?? '27'} · 06 · {d.weddingYear} · {d.cityEn}</div>
            </div>
            <KunaaBand className="absolute bottom-0 inset-x-0 rotate-180" />
          </div>
        </div>

        {/* LEFT DOOR */}
        <div
          className="absolute left-0 top-0 h-full w-1/2"
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            transform: isOpening ? 'rotateY(-110deg)' : 'rotateY(0deg)',
            transition: isOpening ? 'transform 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
            zIndex: isOpening ? 5 : 10,
            background: 'linear-gradient(135deg, #1A1A2E 0%, #252545 50%, #1A1A2E 100%)',
            borderRight: '2px solid rgba(200,129,58,0.3)',
          }}
        >
          <DoorPanel mirrored />
        </div>

        {/* RIGHT DOOR */}
        <div
          className="absolute right-0 top-0 h-full w-1/2"
          style={{
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
            transform: isOpening ? 'rotateY(110deg)' : 'rotateY(0deg)',
            transition: isOpening ? 'transform 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
            zIndex: isOpening ? 5 : 10,
            background: 'linear-gradient(225deg, #1A1A2E 0%, #252545 50%, #1A1A2E 100%)',
            borderLeft: '2px solid rgba(200,129,58,0.3)',
          }}
        >
          <DoorPanel />
        </div>

        {/* Gold seam line where doors meet */}
        <div className="absolute left-1/2 -translate-x-[0.5px] top-0 bottom-0 w-[1px] z-[15]" style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(200,129,58,0.4) 10%, rgba(200,129,58,0.3) 90%, transparent 100%)',
          opacity: isOpening ? 0 : 1,
          transition: 'opacity 0.5s',
        }} />

        {/* Central heart seal */}
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open the wedding invitation"
          className="absolute left-1/2 top-1/2 z-[20] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{
            opacity: isOpening ? 0 : 1,
            transform: `translate(-50%, -50%) scale(${isOpening ? 0.5 : 1})`,
            transition: isOpening ? 'opacity 0.7s, transform 0.7s' : 'transform 0.3s',
            pointerEvents: isOpening ? 'none' : 'auto',
          }}
        >
          <div className="am-animate-pulse-glow">
            <WaxSealHeart />
          </div>
          <p className="mt-4 font-lato text-[0.6rem] uppercase tracking-[0.35em] text-[#F5ECD7]/50">Tap to open</p>
          <p className="mt-1 font-amiri text-sm text-[#F5ECD7]/60" dir="rtl">اضغط لفتح الدعوة</p>
        </button>
      </div>
    </div>
  );
};

/* ── Door Panel with dense arabesque patterns ── */
const DoorPanel = ({ mirrored = false }: { mirrored?: boolean }) => (
  <div className="absolute inset-0 overflow-hidden" style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}>
    <svg className="absolute right-0 top-0 h-full w-6" viewBox="0 0 24 800" preserveAspectRatio="none" fill="none">
      {Array.from({ length: 40 }, (_, i) => (
        <g key={i}>
          <path d={`M0 ${i * 20} L12 ${i * 20 + 10} L24 ${i * 20} L12 ${i * 20 - 10}Z`}
            stroke="#C8813A" strokeWidth="0.8" fill="rgba(200,129,58,0.06)" />
          <circle cx="12" cy={i * 20} r="1.2" fill="#C8813A" fillOpacity="0.25" />
        </g>
      ))}
    </svg>

    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 800" preserveAspectRatio="xMidYMid slice" fill="none">
      {[[100, 100], [50, 250], [150, 400], [100, 550], [60, 700]].map(([cx, cy], i) => (
        <g key={`star-${i}`} opacity={0.15 + (i % 3) * 0.05}>
          <path d={`M${cx} ${cy - 40}L${cx + 12} ${cy - 14}L${cx + 40} ${cy - 12}L${cx + 16} ${cy + 6}L${cx + 24} ${cy + 38}L${cx} ${cy + 18}L${cx - 24} ${cy + 38}L${cx - 16} ${cy + 6}L${cx - 40} ${cy - 12}L${cx - 12} ${cy - 14}Z`}
            stroke="#C8813A" strokeWidth="0.7" />
          <circle cx={cx} cy={cy} r="8" stroke="#C8813A" strokeWidth="0.5" />
          <circle cx={cx} cy={cy} r="3" fill="#C8813A" fillOpacity="0.15" />
        </g>
      ))}
      <path d="M30 0 Q60 80 40 160 Q20 240 50 320 Q70 400 35 480 Q15 560 45 640 Q65 720 30 800" stroke="#C8813A" strokeWidth="0.6" opacity="0.2" />
      <path d="M170 0 Q140 80 160 160 Q180 240 150 320 Q130 400 165 480 Q185 560 155 640 Q135 720 170 800" stroke="#C8813A" strokeWidth="0.6" opacity="0.2" />
      {[60, 180, 340, 500, 660].map((y, i) => (
        <g key={`leaf-${i}`}>
          <path d={`M${40 + (i % 2) * 100} ${y} Q${30 + (i % 2) * 100} ${y - 12} ${45 + (i % 2) * 100} ${y - 18} Q${55 + (i % 2) * 100} ${y - 8} ${40 + (i % 2) * 100} ${y}Z`}
            fill="#3D6B5E" fillOpacity="0.1" stroke="#3D6B5E" strokeWidth="0.4" opacity="0.3" />
        </g>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <g key={`lattice-${i}`}>
          <path d={`M80 ${i * 65 + 30}L100 ${i * 65 + 10}L120 ${i * 65 + 30}L100 ${i * 65 + 50}Z`}
            stroke="#D4AF7A" strokeWidth="0.5" opacity="0.12" />
        </g>
      ))}
      <g transform="translate(60, 350)" opacity="0.08">
        <ellipse cx="20" cy="20" rx="18" ry="14" fill="#3D6B5E" />
        <circle cx="20" cy="6" r="6" fill="#3D6B5E" />
        <ellipse cx="4" cy="12" rx="6" ry="3" fill="#3D6B5E" transform="rotate(-30, 4, 12)" />
        <ellipse cx="36" cy="12" rx="6" ry="3" fill="#3D6B5E" transform="rotate(30, 36, 12)" />
        <ellipse cx="6" cy="30" rx="5" ry="3" fill="#3D6B5E" transform="rotate(20, 6, 30)" />
        <ellipse cx="34" cy="30" rx="5" ry="3" fill="#3D6B5E" transform="rotate(-20, 34, 30)" />
      </g>
      <g transform="translate(130, 600)" opacity="0.1">
        <path d="M10 40 Q12 30 8 20 Q6 10 10 0" stroke="#8B1A2E" strokeWidth="1" fill="none" />
        <path d="M8 20 Q2 15 0 8" stroke="#8B1A2E" strokeWidth="0.8" fill="none" />
        <path d="M10 25 Q16 18 20 10" stroke="#8B1A2E" strokeWidth="0.8" fill="none" />
      </g>
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
        <circle key={`dot-${i}`} cx={20 + (i % 4) * 50} cy={50 + Math.floor(i / 4) * 260} r="1.5" fill="#C8813A" fillOpacity="0.2" />
      ))}
    </svg>

    <svg className="absolute top-4 left-4 right-10" viewBox="0 0 180 100" fill="none" opacity="0.15">
      <path d="M10 100 Q10 20 90 15 Q170 20 170 100" stroke="#C8813A" strokeWidth="1" />
      <path d="M25 100 Q25 35 90 30 Q155 35 155 100" stroke="#D4AF7A" strokeWidth="0.6" />
      <circle cx="90" cy="55" r="15" stroke="#C8813A" strokeWidth="0.7" />
      <path d="M82 55 L82 85 L98 85 L98 55" stroke="#C8813A" strokeWidth="0.5" />
    </svg>
  </div>
);

/* ── Heart-shaped wax seal ── */
const WaxSealHeart = () => (
  <svg viewBox="0 0 120 114" className="h-28 w-28 drop-shadow-2xl" fill="none">
    <path d="M60 108C40 94 14 76 6 50C-1 28 12 10 32 10C44 10 54 18 60 28C66 18 76 10 88 10C108 10 121 28 114 50C106 76 80 94 60 108Z"
      fill="#8B1A2E" stroke="#C8813A" strokeWidth="2.5" />
    <path d="M60 98C44 87 24 72 18 52C12 34 22 20 36 20C46 20 54 28 60 36C66 28 74 20 84 20C98 20 108 34 102 52C96 72 76 87 60 98Z"
      fill="rgba(139,26,46,0.5)" />
    <path d="M28 36C36 24 50 18 60 20" stroke="rgba(245,236,215,0.25)" strokeWidth="3" strokeLinecap="round" />
    <path d="M60 38L63 48L72 42L66 51L76 54L66 57L72 66L63 60L60 70L57 60L48 66L54 57L44 54L54 51L48 42L57 48Z"
      fill="#C8813A" fillOpacity="0.5" stroke="#C8813A" strokeWidth="0.6" />
    <circle cx="60" cy="54" r="5" fill="#F5ECD7" fillOpacity="0.3" />
    <text x="60" y="57" textAnchor="middle" className="font-playfair" fontSize="8" fill="#F5ECD7" fillOpacity="0.9" letterSpacing="1">M · R</text>
    <text x="60" y="82" textAnchor="middle" className="font-lato" fontSize="7" fill="#F5ECD7" fillOpacity="0.7" letterSpacing="3">OPEN</text>
  </svg>
);

const EightPointStar = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="#C8813A" fillOpacity="0.5">
    <path d="M7 0L8.3 4.7L13 5.5L9.1 8L10 13L7 10L4 13L4.9 8L1 5.5L5.7 4.7Z" />
  </svg>
);

const ArabesqueRosette = ({ size = 72 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <path d="M40 4L44 26L58 10L50 28L76 32L50 38L60 56L44 46L40 76L36 46L20 56L30 38L4 32L30 28L20 10L36 26Z"
      stroke="#C8813A" strokeWidth="0.8" fill="rgba(200,129,58,0.06)" />
    <circle cx="40" cy="40" r="14" stroke="#C8813A" strokeWidth="0.6" opacity="0.4" />
    <circle cx="40" cy="40" r="8" stroke="#3D6B5E" strokeWidth="0.5" opacity="0.3" />
    <circle cx="40" cy="40" r="3" fill="#8B1A2E" fillOpacity="0.2" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 40 + Math.cos(rad) * 28;
      const cy = 40 + Math.sin(rad) * 28;
      return <circle key={i} cx={cx} cy={cy} r="1.2" fill="#C8813A" fillOpacity="0.3" />;
    })}
  </svg>
);

const KunaaBand = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 400 16" preserveAspectRatio="none" fill="none" style={{ height: 16 }}>
    {Array.from({ length: 20 }, (_, i) => (
      <g key={i}>
        <path d={`M${i * 20} 8 L${i * 20 + 10} 0 L${i * 20 + 20} 8 L${i * 20 + 10} 16Z`}
          stroke="#C8813A" strokeWidth="0.6" fill="rgba(200,129,58,0.08)" />
        <circle cx={i * 20 + 10} cy={8} r="1" fill="#C8813A" fillOpacity="0.3" />
      </g>
    ))}
    <line x1="0" y1="0" x2="400" y2="0" stroke="#C8813A" strokeWidth="0.5" opacity="0.3" />
    <line x1="0" y1="16" x2="400" y2="16" stroke="#C8813A" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

export default EnvelopeScreen;