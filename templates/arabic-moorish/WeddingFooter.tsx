'use client';

import { useLanguage } from './LanguageContext';
import { useInvitationData } from './InvitationDataContext';

/** Closing footer — Mediterranean coast, Tunis warmth, island / tropical ease */
const WeddingFooter = () => {
  const { t, isArabic } = useLanguage();
  const d = useInvitationData();

  return (
    <footer
      className="relative px-6 pt-16 pb-28 md:pb-32 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #E8F1EC 0%, #EDEFE4 22%, #F2EBDC 55%, #E5EFE8 88%, #D8E8E2 100%)',
      }}
    >
      {/* Sun-washed haze — slow “heat shimmer” */}
      <div
        className="absolute inset-0 pointer-events-none opacity-90 am-animate-footer-haze-breathe"
        style={{
          background:
            'radial-gradient(ellipse 100% 70% at 50% -10%, rgba(255, 248, 230, 0.7), transparent 50%), radial-gradient(ellipse 80% 50% at 100% 100%, rgba(61, 107, 94, 0.09), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 90%, rgba(200, 129, 58, 0.07), transparent 50%)',
        }}
      />
      <div className="absolute inset-0 am-am-zellige-bg-dense opacity-[0.05]" />

      {/* Top waves — horizontal drift */}
      <div className="absolute top-0 inset-x-0 h-14 overflow-hidden">
        <div className="absolute inset-y-0 w-[128%] min-w-[960px] -left-[14%] will-change-transform am-animate-footer-wave-drift">
          <svg viewBox="0 0 1440 56" className="w-full h-full" preserveAspectRatio="none" fill="none" aria-hidden>
            <path
              d="M0 36 Q240 18 480 36 T960 36 T1440 36 L1440 0 L0 0Z"
              fill="rgba(61, 107, 94, 0.06)"
            />
            <path
              d="M0 40 Q200 24 400 40 T800 40 T1200 40 T1440 40"
              stroke="#3D6B5E"
              strokeWidth="0.9"
              strokeOpacity="0.2"
            />
            <path
              d="M0 48 Q220 32 440 48 T880 48 T1320 48 T1440 48"
              stroke="#C8813A"
              strokeWidth="0.55"
              strokeOpacity="0.22"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center pt-6">

        {/* Shell & pearl divider — soft bob */}
        <div className="flex items-center justify-center gap-5 mb-10 opacity-80 am-animate-footer-shell-float">
          <svg viewBox="0 0 36 24" className="w-9 h-6 shrink-0" fill="none" aria-hidden>
            <path
              d="M6 18 Q18 4 30 18 Q18 22 6 18Z"
              stroke="#C8813A"
              strokeWidth="0.45"
              fill="rgba(200,129,58,0.08)"
            />
            <path d="M12 16 Q18 12 24 16" stroke="#3D6B5E" strokeWidth="0.35" strokeOpacity="0.5" />
          </svg>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#C8813A]/30 am-animate-footer-shimmer-line" />
          <svg
            viewBox="0 0 14 14"
            className="w-3.5 h-3.5 shrink-0 origin-center fill-[#C8813A] am-animate-footer-star-twinkle motion-reduce:animate-none"
            aria-hidden
          >
            <path d="M7 0L8.3 4.7L13 5.5L9.1 8L10 13L7 10L4 13L4.9 8L1 5.5L5.7 4.7Z" />
          </svg>
          <div
            className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#C8813A]/30 am-animate-footer-shimmer-line"
            style={{ animationDelay: '1.2s' }}
          />
          <svg viewBox="0 0 36 24" className="w-9 h-6 shrink-0 scale-x-[-1]" fill="none" aria-hidden>
            <path
              d="M6 18 Q18 4 30 18 Q18 22 6 18Z"
              stroke="#C8813A"
              strokeWidth="0.45"
              fill="rgba(200,129,58,0.08)"
            />
            <path d="M12 16 Q18 12 24 16" stroke="#3D6B5E" strokeWidth="0.35" strokeOpacity="0.5" />
          </svg>
        </div>

        {/* Rosette — slightly smaller, sea-tinted, soft glow pulse */}
        <svg
          viewBox="0 0 120 120"
          className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-8 am-animate-pulse-glow motion-reduce:animate-none"
          fill="none"
          opacity={0.55}
        >
          <path
            d="M60 8L65 36L82 16L72 38L108 44L72 50L84 72L65 58L60 108L55 58L36 72L48 50L12 44L48 38L36 16L55 36Z"
            stroke="#C8813A"
            strokeWidth="0.75"
            fill="rgba(200,129,58,0.05)"
          />
          <circle cx="60" cy="60" r="22" stroke="#3D6B5E" strokeWidth="0.45" opacity="0.35" />
          <circle cx="60" cy="60" r="14" stroke="#C8813A" strokeWidth="0.5" opacity="0.3" />
          <circle cx="60" cy="60" r="7" stroke="#8B1A2E" strokeWidth="0.35" opacity="0.25" />
          <circle cx="60" cy="60" r="3" fill="#C8813A" fillOpacity="0.18" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 60 + Math.cos(rad) * 38;
            const cy = 60 + Math.sin(rad) * 38;
            return <circle key={i} cx={cx} cy={cy} r="1.2" fill="#3D6B5E" fillOpacity="0.2" />;
          })}
        </svg>

        <p className={`text-lg md:text-xl text-[#1A1A2E]/50 mb-2 ${isArabic ? 'font-amiri' : 'font-lato'}`}>
          {t('With love & blessings,', 'مع الحب والبركة،')}
        </p>
        <p className={`text-2xl md:text-3xl text-[#1A1A2E] mt-1 ${isArabic ? 'font-amiri' : 'font-playfair'}`}>
          {isArabic ? `${d.groomNameAr} و${d.brideNameAr}` : `${d.groomNameEn}${d.groomLastNameEn ? ` ${d.groomLastNameEn}` : ''} & ${d.brideNameEn}${d.brideLastNameEn ? ` ${d.brideLastNameEn}` : ''}`}
        </p>

        <p className={`mt-6 text-sm text-[#3D6B5E]/45 ${isArabic ? 'font-amiri text-base' : 'font-lato tracking-wide'}`}>
          {isArabic ? `${d.cityAr} · ${d.weddingDateAr} ${d.weddingYear}` : `${d.cityEn} · ${d.weddingDate} ${d.weddingYear}`}
        </p>

        <p className="text-[#1A1A2E]/22 text-xs font-lato mt-10 tracking-[0.22em]">{d.hashtag}</p>
      </div>

      {/* Deep water waves — slower counter-drift for depth */}
      <div className="absolute bottom-0 inset-x-0 h-20 md:h-24 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 w-[132%] min-w-[1040px] -left-[16%] will-change-transform am-am-animate-footer-wave-drift-reverse">
          <svg viewBox="0 0 1440 80" className="w-full h-full" preserveAspectRatio="none" fill="none" aria-hidden>
            <path
              d="M0 48 Q180 28 360 48 T720 48 T1080 48 T1440 48 L1440 80 L0 80Z"
              fill="rgba(61, 107, 94, 0.07)"
            />
            <path
              d="M0 58 Q200 38 400 58 T800 58 T1200 58 T1440 58"
              stroke="#3D6B5E"
              strokeWidth="0.85"
              strokeOpacity="0.18"
            />
            <path
              d="M0 68 Q220 50 440 68 T880 68 T1320 68 T1440 68"
              stroke="#C8813A"
              strokeWidth="0.5"
              strokeOpacity="0.14"
            />
            <path
              d="M0 76 Q240 62 480 76 T960 76 T1440 76"
              stroke="#2D5A4E"
              strokeWidth="0.35"
              strokeOpacity="0.12"
            />
          </svg>
        </div>
        <div
          className="absolute inset-0 w-[125%] min-w-[1000px] -left-[10%] will-change-transform am-am-animate-footer-wave-drift-slow opacity-50"
          aria-hidden
        >
          <svg viewBox="0 0 1440 80" className="w-full h-full" preserveAspectRatio="none" fill="none">
            <path
              d="M0 52 Q190 34 380 52 T760 52 T1140 52 T1440 52"
              stroke="#3D6B5E"
              strokeWidth="0.5"
              strokeOpacity="0.12"
            />
          </svg>
        </div>
      </div>
    </footer>
  );
};

export default WeddingFooter;
