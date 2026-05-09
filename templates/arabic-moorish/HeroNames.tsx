'use client';

import { useLanguage } from './LanguageContext';
import { useInvitationData, usePreviewMode } from './InvitationDataContext';
import { ChevronDown } from 'lucide-react';
import WeddingHeroBackgroundNew from './WeddingHeroBackground';

/** Quadratic Bézier M x0,y0 Q cx,cy x2,y2 */
type Quad = { x0: number; y0: number; cx: number; cy: number; x2: number; y2: number };

function quadPt(t: number, q: Quad) {
  const u = 1 - t;
  return {
    x: u * u * q.x0 + 2 * u * t * q.cx + t * t * q.x2,
    y: u * u * q.y0 + 2 * u * t * q.cy + t * t * q.y2,
  };
}

function beadsOnQuad(q: Quad, n: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 1; i < n; i++) pts.push(quadPt(i / n, q));
  return pts;
}

/** Layered top swags (cascading arcs) */
const CURTAIN_SWAGS: Quad[] = [
  { x0: 46, y0: 1, cx: 200, cy: 44, x2: 354, y2: 1 },
  { x0: 50, y0: 9, cx: 200, cy: 54, x2: 350, y2: 9 },
  { x0: 54, y0: 17, cx: 200, cy: 64, x2: 346, y2: 17 },
  { x0: 58, y0: 25, cx: 200, cy: 74, x2: 342, y2: 25 },
];

/** Side falls: inner edges frame the center opening */
const CURTAIN_LEFT_INNER: Quad = { x0: 46, y0: 28, cx: 92, cy: 108, x2: 188, y2: 172 };
const CURTAIN_RIGHT_INNER: Quad = { x0: 354, y0: 28, cx: 308, cy: 108, x2: 212, y2: 172 };

/** Softer outer gather lines */
const CURTAIN_LEFT_FOLD: Quad = { x0: 24, y0: 6, cx: 68, cy: 96, x2: 162, y2: 158 };
const CURTAIN_RIGHT_FOLD: Quad = { x0: 376, y0: 6, cx: 332, cy: 96, x2: 238, y2: 158 };

/** Slight S-curve along outer screen edge */
const CURTAIN_LEFT_EDGE: Quad = { x0: 0, y0: 0, cx: 6, cy: 88, x2: 0, y2: 176 };
const CURTAIN_RIGHT_EDGE: Quad = { x0: 400, y0: 0, cx: 394, cy: 88, x2: 400, y2: 176 };

const CURTAIN_BEAD_FILL = 'rgba(245, 236, 215, 0.35)';
const CURTAIN_BEAD_STROKE = '#9A7346';
const CURTAIN_LINE_PRIMARY = '#A67C52';
const CURTAIN_LINE_SOFT = '#C4B59A';

function flatBeadsWithKeys(
  layers: { id: string; pts: { x: number; y: number }[] }[],
): { key: string; x: number; y: number }[] {
  const out: { key: string; x: number; y: number }[] = [];
  for (const { id, pts } of layers) {
    pts.forEach((p, i) => out.push({ key: `${id}-${i}`, x: p.x, y: p.y }));
  }
  return out;
}

const CURTAIN_ALL_BEADS = flatBeadsWithKeys([
  ...CURTAIN_SWAGS.map((q, i) => ({ id: `sw${i}`, pts: beadsOnQuad(q, 16) })),
  { id: 'li', pts: beadsOnQuad(CURTAIN_LEFT_INNER, 18) },
  { id: 'ri', pts: beadsOnQuad(CURTAIN_RIGHT_INNER, 18) },
  { id: 'lf', pts: beadsOnQuad(CURTAIN_LEFT_FOLD, 14) },
  { id: 'rf', pts: beadsOnQuad(CURTAIN_RIGHT_FOLD, 14) },
  { id: 'le', pts: beadsOnQuad(CURTAIN_LEFT_EDGE, 15) },
  { id: 're', pts: beadsOnQuad(CURTAIN_RIGHT_EDGE, 15) },
]);

const HeroNames = () => {
  const { t, isArabic } = useLanguage();
  const d = useInvitationData();
  const preview = usePreviewMode();

  return (
    <section
      className={`${preview ? 'min-h-[760px]' : 'min-h-screen'} flex flex-col items-center justify-center relative px-6 py-6 overflow-hidden`}
      style={{
        background:
          'linear-gradient(180deg, #F5ECD7 0%, #F5ECD7 28%, #F3E9D8 52%, #FAF4EC 78%, #FDF6EF 100%)',
      }}
    >
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_90%_74%_at_50%_44%,rgba(253,246,239,0.65),transparent_72%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] am-am-zellige-bg-dense opacity-[0.04] pointer-events-none mix-blend-multiply"
        aria-hidden
      />
      {/* Engraving-style curtain: layered swags, side falls, pearl beads — open center for names */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <svg
          viewBox="0 0 400 182"
          className="w-full aspect-[400/182] max-h-[132px] sm:max-h-[148px] md:max-h-[158px]"
          preserveAspectRatio="xMidYMin meet"
          fill="none"
          aria-hidden
        >
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Back ghost lines (soft duplicate for vintage print depth) */}
            {CURTAIN_SWAGS.map((q, i) => (
              <path
                key={`swag-soft-${i}`}
                d={`M ${q.x0 + 0.6} ${q.y0 + 0.4} Q ${q.cx} ${q.cy + 0.8} ${q.x2 - 0.6} ${q.y2 + 0.4}`}
                stroke={CURTAIN_LINE_SOFT}
                strokeWidth={0.28}
                opacity={0.35}
              />
            ))}
            {/* Layered top swags */}
            {CURTAIN_SWAGS.map((q, i) => (
              <path
                key={`swag-${i}`}
                d={`M ${q.x0} ${q.y0} Q ${q.cx} ${q.cy} ${q.x2} ${q.y2}`}
                stroke={CURTAIN_LINE_PRIMARY}
                strokeWidth={0.42 + i * 0.04}
                opacity={0.88 - i * 0.06}
              />
            ))}
            {/* Outer screen edges (soft vertical drape) */}
            <path
              d={`M ${CURTAIN_LEFT_EDGE.x0} ${CURTAIN_LEFT_EDGE.y0} Q ${CURTAIN_LEFT_EDGE.cx} ${CURTAIN_LEFT_EDGE.cy} ${CURTAIN_LEFT_EDGE.x2} ${CURTAIN_LEFT_EDGE.y2}`}
              stroke={CURTAIN_LINE_PRIMARY}
              strokeWidth={0.48}
              opacity={0.82}
            />
            <path
              d={`M ${CURTAIN_RIGHT_EDGE.x0} ${CURTAIN_RIGHT_EDGE.y0} Q ${CURTAIN_RIGHT_EDGE.cx} ${CURTAIN_RIGHT_EDGE.cy} ${CURTAIN_RIGHT_EDGE.x2} ${CURTAIN_RIGHT_EDGE.y2}`}
              stroke={CURTAIN_LINE_PRIMARY}
              strokeWidth={0.48}
              opacity={0.82}
            />
            {/* Side falls — gathered inner lines framing the opening */}
            <path
              d={`M ${CURTAIN_LEFT_FOLD.x0} ${CURTAIN_LEFT_FOLD.y0} Q ${CURTAIN_LEFT_FOLD.cx} ${CURTAIN_LEFT_FOLD.cy} ${CURTAIN_LEFT_FOLD.x2} ${CURTAIN_LEFT_FOLD.y2}`}
              stroke={CURTAIN_LINE_SOFT}
              strokeWidth={0.32}
              opacity={0.62}
            />
            <path
              d={`M ${CURTAIN_LEFT_INNER.x0} ${CURTAIN_LEFT_INNER.y0} Q ${CURTAIN_LEFT_INNER.cx} ${CURTAIN_LEFT_INNER.cy} ${CURTAIN_LEFT_INNER.x2} ${CURTAIN_LEFT_INNER.y2}`}
              stroke={CURTAIN_LINE_PRIMARY}
              strokeWidth={0.52}
              opacity={0.9}
            />
            <path
              d={`M ${CURTAIN_RIGHT_FOLD.x0} ${CURTAIN_RIGHT_FOLD.y0} Q ${CURTAIN_RIGHT_FOLD.cx} ${CURTAIN_RIGHT_FOLD.cy} ${CURTAIN_RIGHT_FOLD.x2} ${CURTAIN_RIGHT_FOLD.y2}`}
              stroke={CURTAIN_LINE_SOFT}
              strokeWidth={0.32}
              opacity={0.62}
            />
            <path
              d={`M ${CURTAIN_RIGHT_INNER.x0} ${CURTAIN_RIGHT_INNER.y0} Q ${CURTAIN_RIGHT_INNER.cx} ${CURTAIN_RIGHT_INNER.cy} ${CURTAIN_RIGHT_INNER.x2} ${CURTAIN_RIGHT_INNER.y2}`}
              stroke={CURTAIN_LINE_PRIMARY}
              strokeWidth={0.52}
              opacity={0.9}
            />
            {/* Corner tieback curls */}
            <path
              d="M 18 2 Q 8 14 14 24 Q 22 18 18 2"
              stroke={CURTAIN_LINE_PRIMARY}
              strokeWidth={0.35}
              opacity={0.55}
            />
            <path
              d="M 382 2 Q 392 14 386 24 Q 378 18 382 2"
              stroke={CURTAIN_LINE_PRIMARY}
              strokeWidth={0.35}
              opacity={0.55}
            />
          </g>
          {/* Pearl beads along all curves */}
          {CURTAIN_ALL_BEADS.map(({ key, x, y }) => (
            <circle
              key={key}
              cx={x}
              cy={y}
              r={0.95}
              fill={CURTAIN_BEAD_FILL}
              stroke={CURTAIN_BEAD_STROKE}
              strokeWidth={0.22}
            />
          ))}
        </svg>
      </div>

      {/* Chandelier — out of document flow so moving it never shifts the name block; text uses higher z-index when they overlap */}
      <div
        className="pointer-events-none absolute left-1/2 z-[9] w-[152px] -translate-x-1/2 sm:w-[176px] md:w-[192px]"
        style={{ top: 'clamp(1.35rem, 9vh + 1.35rem, 3.75rem)' }}
        aria-hidden
      >
        <div className="am-animate-pendulum" style={{ transformOrigin: 'top center' }}>
        <svg viewBox="0 0 160 350" className="h-auto w-full scale-110" fill="none" aria-hidden>
          <defs>
            <filter id="hero-chandelier-shadow" x="-35%" y="-15%" width="170%" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#5C4A1E" floodOpacity="0.28" />
              <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#C8813A" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#hero-chandelier-shadow)">
            {/* Chain */}
            <line x1="80" y1="0" x2="80" y2="40" stroke="#A66A2E" strokeWidth="1.4" strokeLinecap="round" opacity="0.88" />
            {/* Top ornament */}
            <circle cx="80" cy="44" r="4.5" stroke="#B8742E" strokeWidth="1" fill="rgba(200,129,58,0.12)" opacity="0.92" />
            {/* Main body frame */}
            <path d="M50 60 Q55 50 80 48 Q105 50 110 60" stroke="#C4954A" strokeWidth="1.35" fill="none" opacity="0.88" />
            <path d="M40 80 Q45 65 80 60 Q115 65 120 80" stroke="#C8813A" strokeWidth="1.15" fill="none" opacity="0.82" />
            <path d="M35 100 Q40 85 80 78 Q120 85 125 100" stroke="#D4AF7A" strokeWidth="1.05" fill="none" opacity="0.78" />
            {/* Vertical arms */}
            {[50, 65, 80, 95, 110].map((x, i) => (
              <line key={i} x1={x} y1={60 - Math.abs(i - 2) * 3} x2={x - (i - 2) * 3} y2={100 - Math.abs(i - 2) * 4}
                stroke="#C8813A" strokeWidth="0.95" strokeLinecap="round" opacity="0.72" />
            ))}
            {/* Crystal drops */}
            {[35, 50, 65, 80, 95, 110, 125].map((x, i) => {
              const y = 100 - Math.abs(i - 3) * 5;
              return (
                <g key={i}>
                  <line x1={x} y1={y} x2={x} y2={y + 15 + i * 2} stroke="#B8893D" strokeWidth="0.65" strokeLinecap="round" opacity="0.75" />
                  <path d={`M${x - 3.5} ${y + 15 + i * 2} Q${x} ${y + 22 + i * 2} ${x + 3.5} ${y + 15 + i * 2}`}
                    fill="#C8813A" fillOpacity="0.38" stroke="#A66A2E" strokeWidth="0.55" opacity="0.9" />
                  <circle cx={x} cy={y + 24 + i * 2} r="1.6" fill="#E8C97A" fillOpacity="0.55" stroke="#C8813A" strokeWidth="0.35" />
                </g>
              );
            })}
            {/* Center large crystal */}
            <path d="M76 130 Q80 154 84 130" fill="#C8813A" fillOpacity="0.32" stroke="#A66A2E" strokeWidth="0.75" />
            <circle cx="80" cy="156" r="2.6" fill="#E8D5AE" fillOpacity="0.75" stroke="#C8813A" strokeWidth="0.5" />
            {/* Horizontal bead strings */}
            {[70, 85, 100].map((y, row) => (
              <g key={row}>
                {Array.from({ length: 8 }, (_, i) => {
                  const spread = 30 + row * 0.4;
                  const x = 80 + (i - 3.5) * (spread / 4);
                  return <circle key={i} cx={x} cy={y} r="1.05" fill="#D4AF7A" fillOpacity="0.55" stroke="#B8893D" strokeWidth="0.25" />;
                })}
              </g>
            ))}
          </g>
        </svg>
        </div>
      </div>

      {/* Moorish horseshoe arch frame */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[5] w-[340px] h-[500px] pointer-events-none">
        <svg viewBox="0 0 340 500" fill="none" className="w-full h-full" opacity="0.18">
          <path d="M10 500 Q10 60 170 40 Q330 60 330 500" stroke="#C8813A" strokeWidth="1.5" />
          <path d="M30 500 Q30 85 170 65 Q310 85 310 500" stroke="#C8813A" strokeWidth="0.8" />
          <path d="M50 500 Q50 105 170 90 Q290 105 290 500" stroke="#D4AF7A" strokeWidth="0.5" />
          {/* Keyhole detail */}
          <circle cx="170" cy="150" r="30" stroke="#C8813A" strokeWidth="0.7" />
          <path d="M155 150 L155 210 L185 210 L185 150" stroke="#C8813A" strokeWidth="0.5" />
          {/* Arabesque fill in arch spandrels */}
          <path d="M170 125L174 138L186 132L178 142L192 146L178 150L186 160L174 154L170 168L166 154L154 160L162 150L148 146L162 142L154 132L166 138Z"
            stroke="#C8813A" strokeWidth="0.4" opacity="0.5" />
        </svg>
      </div>

      {/* Palm frond accents */}
      <div className="absolute top-16 left-0 z-[5] opacity-[0.12]">
        <svg viewBox="0 0 60 300" width="40" fill="none">
          <path d="M30 0 Q25 50 18 100 Q10 160 14 220 Q16 260 12 300" stroke="#3D6B5E" strokeWidth="1" />
          {[40, 100, 160, 220].map((y, i) => (
            <path key={i} d={`M${18 - i * 2} ${y} Q${6} ${y - 15} ${8} ${y - 28} Q${14} ${y - 12} ${18 - i * 2} ${y}Z`}
              fill="#3D6B5E" fillOpacity={0.15 - i * 0.02} />
          ))}
        </svg>
      </div>
      <div className="absolute top-16 right-0 z-[5] opacity-[0.12]" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 60 300" width="40" fill="none">
          <path d="M30 0 Q25 50 18 100 Q10 160 14 220 Q16 260 12 300" stroke="#3D6B5E" strokeWidth="1" />
          {[40, 100, 160, 220].map((y, i) => (
            <path key={i} d={`M${18 - i * 2} ${y} Q${6} ${y - 15} ${8} ${y - 28} Q${14} ${y - 12} ${18 - i * 2} ${y}Z`}
              fill="#3D6B5E" fillOpacity={0.15 - i * 0.02} />
          ))}
        </svg>
      </div>

      <div className="relative z-20 flex max-w-sm flex-col items-center am-animate-fade-in-up">
        {/* Bismillah */}
        <p className="font-amiri text-[#1A1A2E]/30 text-sm mb-6 tracking-wide" dir="rtl">بسم الله الرحمن الرحيم</p>

        {/* Arabesque rosette */}
        <svg viewBox="0 0 80 80" className="mb-2 h-12 w-12 shrink-0 sm:mb-3 sm:h-14 sm:w-14" fill="none" opacity="0.55" aria-hidden>
          <path d="M40 4L44 26L58 10L50 28L76 32L50 38L60 56L44 46L40 76L36 46L20 56L30 38L4 32L30 28L20 10L36 26Z"
            stroke="#C8813A" strokeWidth="0.8" fill="rgba(200,129,58,0.06)" />
          <circle cx="40" cy="40" r="12" stroke="#C8813A" strokeWidth="0.6" />
          <circle cx="40" cy="40" r="6" stroke="#8B1A2E" strokeWidth="0.4" />
          <circle cx="40" cy="40" r="3" fill="#C8813A" fillOpacity="0.25" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 40 + Math.cos(rad) * 30;
            const cy = 40 + Math.sin(rad) * 30;
            return <circle key={i} cx={cx} cy={cy} r="1.3" fill="#C8813A" fillOpacity="0.3" />;
          })}
        </svg>

        {/* Invitation text */}
        <p className={`text-sm text-[#1A1A2E]/40 mb-8 tracking-[0.25em] uppercase text-center ${isArabic ? 'font-amiri text-base tracking-normal' : 'font-lato'}`}>
          {t('We joyfully invite you to our wedding', 'ندعوكم بفرح لحضور حفل زفافنا')}
        </p>

        {/* Groom name */}
        {isArabic ? (
          <h1 className="font-amiri text-[40px] md:text-5xl text-[#1A1A2E] tracking-wide text-center leading-tight" dir="rtl">
            {d.groomNameAr}
          </h1>
        ) : (
          <h1 className="font-playfair text-[38px] md:text-5xl text-[#1A1A2E] tracking-wide text-center leading-tight">
            {d.groomNameEn}
          </h1>
        )}

        {/* Decorative ampersand */}
        <div className="my-5 relative flex items-center gap-4">
          <div className="w-16 h-[0.5px] bg-gradient-to-r from-transparent to-[#C8813A]/30" />
          <span className={`text-5xl text-[#C8813A]/70 ${isArabic ? 'font-amiri' : 'font-playfair italic'}`}>
            {isArabic ? 'و' : '&'}
          </span>
          <div className="w-16 h-[0.5px] bg-gradient-to-l from-transparent to-[#C8813A]/30" />
        </div>

        {/* Bride name */}
        {isArabic ? (
          <h2 className="font-amiri text-[40px] md:text-5xl text-[#1A1A2E] tracking-wide text-center leading-tight" dir="rtl">
            {d.brideNameAr}
          </h2>
        ) : (
          <h2 className="font-playfair text-[38px] md:text-5xl text-[#1A1A2E] tracking-wide text-center leading-tight">
            {d.brideNameEn}
          </h2>
        )}
      </div>

      {/* Footer slice — nudged down; #FDF6EF at section bottom matches illustration paper */}
      <div className="absolute -bottom-1 left-0 right-0 z-[4] h-[min(24vh,280px)] pointer-events-none overflow-hidden">
        <div className="h-[calc(100%+2.5rem)] w-full translate-y-5">
          {/* // increase the height of the background to 100% */}
          <div className="h-[100%]">
            <WeddingHeroBackgroundNew
              className="block h-full w-full min-h-full"
              viewBox="0 905 1024 581"
              preserveAspectRatio="xMidYMax slice"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Scroll hint — high contrast on busy footer art */}
      <div className="absolute bottom-5 left-1/2 z-[12] flex -translate-x-1/2 flex-col items-center pointer-events-none">
        <span className="sr-only">{t('Scroll down', 'مرر للأسفل')}</span>
        <div className="am-animate-bounce-down rounded-full border border-[#C8813A]/45 bg-[#FDF6EF]/95 p-2.5 shadow-[0_2px_14px_rgba(60,48,20,0.14)] ring-2 ring-white/70 backdrop-blur-[1px]">
          <ChevronDown className="size-8 text-[#8B5A24]" strokeWidth={2.5} aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default HeroNames;
