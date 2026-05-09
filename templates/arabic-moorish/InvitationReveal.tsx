'use client';

import { useLanguage } from './LanguageContext';
import CountdownTimer from './CountdownTimer';

const InvitationReveal = () => {
  const { t, isArabic } = useLanguage();

  return (
    <section className="min-h-screen flex flex-col items-center relative px-6 pt-0 pb-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5ECD7 0%, #F0E4C8 30%, #EDE0C8 60%, #F5ECD7 100%)' }}>

      {/* Draped curtain SVGs */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <svg viewBox="0 0 400 120" className="w-full" preserveAspectRatio="none" fill="none">
          {/* Left curtain drape */}
          <path d="M0 0 L0 100 Q20 85 40 95 Q60 105 80 90 Q95 80 100 70 L100 0Z"
            fill="url(#curtainL)" />
          {/* Right curtain drape */}
          <path d="M400 0 L400 100 Q380 85 360 95 Q340 105 320 90 Q305 80 300 70 L300 0Z"
            fill="url(#curtainR)" />
          {/* Swag across top */}
          <path d="M80 0 Q120 50 200 55 Q280 50 320 0"
            stroke="#D4AF7A" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M90 0 Q130 45 200 50 Q270 45 310 0"
            stroke="#C8813A" strokeWidth="0.5" fill="none" opacity="0.2" />
          {/* Beaded tassels */}
          {[100, 140, 180, 200, 220, 260, 300].map((x, i) => {
            const y = 50 + Math.sin((x - 100) / 200 * Math.PI) * 8;
            return (
              <g key={i}>
                <line x1={x} y1={y} x2={x} y2={y + 20} stroke="#D4AF7A" strokeWidth="0.4" opacity="0.3" />
                <circle cx={x} cy={y + 22} r="1.5" fill="#D4AF7A" fillOpacity="0.4" />
              </g>
            );
          })}
          {/* Gold bead line across swag */}
          {Array.from({ length: 30 }, (_, i) => {
            const t = i / 29;
            const x = 90 + t * 220;
            const y = 45 * Math.sin(t * Math.PI) + 2;
            return <circle key={i} cx={x} cy={y} r="1" fill="#D4AF7A" fillOpacity="0.25" />;
          })}
          <defs>
            <linearGradient id="curtainL" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E8D5AE" />
              <stop offset="100%" stopColor="#DCC89A" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="curtainR" x1="350" y1="0" x2="350" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E8D5AE" />
              <stop offset="100%" stopColor="#DCC89A" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Chandelier — swaying */}
      <div className="relative z-20 mt-2 am-animate-pendulum" style={{ transformOrigin: 'top center' }}>
        <svg viewBox="0 0 160 200" width="120" fill="none">
          {/* Chain */}
          <line x1="80" y1="0" x2="80" y2="40" stroke="#C8813A" strokeWidth="0.8" opacity="0.5" />
          {/* Top ornament */}
          <circle cx="80" cy="44" r="4" stroke="#C8813A" strokeWidth="0.6" fill="none" opacity="0.4" />
          {/* Main body frame */}
          <path d="M50 60 Q55 50 80 48 Q105 50 110 60" stroke="#D4AF7A" strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M40 80 Q45 65 80 60 Q115 65 120 80" stroke="#D4AF7A" strokeWidth="0.7" fill="none" opacity="0.4" />
          <path d="M35 100 Q40 85 80 78 Q120 85 125 100" stroke="#D4AF7A" strokeWidth="0.6" fill="none" opacity="0.35" />
          {/* Vertical arms */}
          {[50, 65, 80, 95, 110].map((x, i) => (
            <line key={i} x1={x} y1={60 - Math.abs(i - 2) * 3} x2={x - (i - 2) * 3} y2={100 - Math.abs(i - 2) * 4}
              stroke="#D4AF7A" strokeWidth="0.5" opacity="0.3" />
          ))}
          {/* Crystal drops */}
          {[35, 50, 65, 80, 95, 110, 125].map((x, i) => {
            const y = 100 - Math.abs(i - 3) * 5;
            return (
              <g key={i}>
                <line x1={x} y1={y} x2={x} y2={y + 15 + i * 2} stroke="#D4AF7A" strokeWidth="0.3" opacity="0.3" />
                <path d={`M${x - 3} ${y + 15 + i * 2} Q${x} ${y + 22 + i * 2} ${x + 3} ${y + 15 + i * 2}`}
                  fill="#C8813A" fillOpacity="0.15" stroke="#D4AF7A" strokeWidth="0.3" opacity="0.4" />
                <circle cx={x} cy={y + 24 + i * 2} r="1.2" fill="#D4AF7A" fillOpacity="0.3" />
              </g>
            );
          })}
          {/* Center large crystal */}
          <path d="M76 130 Q80 150 84 130" fill="#C8813A" fillOpacity="0.12" stroke="#D4AF7A" strokeWidth="0.4" />
          <circle cx="80" cy="154" r="2" fill="#D4AF7A" fillOpacity="0.35" />
          {/* Horizontal bead strings */}
          {[70, 85, 100].map((y, row) => (
            <g key={row}>
              {Array.from({ length: 8 }, (_, i) => {
                const spread = 30 + row * 0.4;
                const x = 80 + (i - 3.5) * (spread / 4);
                return <circle key={i} cx={x} cy={y} r="0.8" fill="#D4AF7A" fillOpacity="0.25" />;
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center mt-4 max-w-sm am-animate-fade-in-up">
        {/* Bismillah */}
        <p className="font-amiri text-[#1A1A2E]/25 text-sm mb-4" dir="rtl">بسم الله الرحمن الرحيم</p>

        {/* Decorative rosette */}
        <svg viewBox="0 0 60 60" className="w-10 h-10 mb-4" fill="none" opacity="0.4">
          <path d="M30 4L33 20L44 8L37 22L56 26L37 30L44 44L33 36L30 56L27 36L16 44L23 30L4 26L23 22L16 8L27 20Z"
            stroke="#C8813A" strokeWidth="0.6" />
          <circle cx="30" cy="30" r="8" stroke="#C8813A" strokeWidth="0.4" />
        </svg>

        <p className={`text-xs tracking-[0.3em] uppercase mb-6 ${isArabic ? 'font-amiri text-sm tracking-normal' : 'font-lato'}`}
          style={{ color: 'hsl(32, 55%, 50%)' }}>
          {t('We Are Getting Married', 'سنتزوج')}
        </p>

        {/* Names */}
        {isArabic ? (
          <h1 className="font-amiri text-[36px] md:text-5xl text-[#1A1A2E] text-center leading-tight" dir="rtl">
            عمر محمود
          </h1>
        ) : (
          <h1 className="font-playfair text-[34px] md:text-5xl text-[#1A1A2E] text-center leading-tight tracking-wide">
            Omar Mahmoud
          </h1>
        )}

        <div className="my-4 flex items-center gap-3">
          <div className="w-12 h-[0.5px] bg-gradient-to-r from-transparent to-[#C8813A]/30" />
          <span className={`text-4xl ${isArabic ? 'font-amiri' : 'font-playfair italic'}`} style={{ color: 'hsl(32, 55%, 50%, 0.6)' }}>
            {isArabic ? 'و' : '&'}
          </span>
          <div className="w-12 h-[0.5px] bg-gradient-to-l from-transparent to-[#C8813A]/30" />
        </div>

        {isArabic ? (
          <h2 className="font-amiri text-[36px] md:text-5xl text-[#1A1A2E] text-center leading-tight" dir="rtl">
            ليلى منصور
          </h2>
        ) : (
          <h2 className="font-playfair text-[34px] md:text-5xl text-[#1A1A2E] text-center leading-tight tracking-wide">
            Layla Mansour
          </h2>
        )}

        <p className={`mt-5 text-sm text-[#1A1A2E]/40 text-center leading-relaxed ${isArabic ? 'font-amiri text-base' : 'font-lato tracking-wide'}`}>
          {t('We would be honoured by your presence at the celebration of our marriage', 'يسعدنا ويشرفنا حضوركم حفل زفافنا')}
        </p>

        <CountdownTimer />

        <div className="mt-5 px-7 py-2.5 rounded-full border border-[#C8813A]/20 bg-[#C8813A]/[0.04]">
          <p className="font-lato text-[#1A1A2E]/45 text-sm tracking-[0.12em]">
            {t('June 27, 2026 · Tunis', '27 جوان 2026 تونس')}
          </p>
        </div>
      </div>

      {/* Side tropical accents */}
      <div className="absolute top-40 left-0 opacity-[0.08]">
        <svg viewBox="0 0 40 200" width="30" fill="none">
          <path d="M20 0 Q15 40 10 80 Q5 120 8 160 Q10 180 6 200" stroke="#3D6B5E" strokeWidth="0.8" />
          {[30, 70, 110, 150].map((y, i) => (
            <path key={i} d={`M${10 - i} ${y} Q${2} ${y - 12} ${4} ${y - 22} Q${8} ${y - 8} ${10 - i} ${y}Z`}
              fill="#3D6B5E" fillOpacity="0.2" />
          ))}
        </svg>
      </div>
      <div className="absolute top-40 right-0 opacity-[0.08]" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 40 200" width="30" fill="none">
          <path d="M20 0 Q15 40 10 80 Q5 120 8 160 Q10 180 6 200" stroke="#3D6B5E" strokeWidth="0.8" />
          {[30, 70, 110, 150].map((y, i) => (
            <path key={i} d={`M${10 - i} ${y} Q${2} ${y - 12} ${4} ${y - 22} Q${8} ${y - 8} ${10 - i} ${y}Z`}
              fill="#3D6B5E" fillOpacity="0.2" />
          ))}
        </svg>
      </div>

      {/* Zellige pattern background */}
      <div className="absolute inset-0 am-zellige-bg opacity-[0.04]" />
    </section>
  );
};

export default InvitationReveal;
