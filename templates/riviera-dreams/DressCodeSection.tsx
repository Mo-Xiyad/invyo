'use client'

import { useInvitationData } from '../arabic-moorish/InvitationDataContext'

const sbs = { fontFamily: "'Amarna', serif" }

function SuitIcon() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="h-16 w-auto" aria-hidden>
      {/* Shirt/body */}
      <rect x="18" y="28" width="28" height="44" rx="3" fill="#BDD0E4" opacity="0.4" />
      {/* Left lapel */}
      <path d="M32 28 L20 18 L18 28 Z" fill="#6B8FBF" opacity="0.7" />
      {/* Right lapel */}
      <path d="M32 28 L44 18 L46 28 Z" fill="#6B8FBF" opacity="0.7" />
      {/* Tie */}
      <path d="M30 28 L32 24 L34 28 L33 44 L31 44 Z" fill="#1C2B4A" opacity="0.5" />
      {/* Left shoulder */}
      <path d="M18 28 L10 22 L8 44 L18 44 Z" fill="#6B8FBF" opacity="0.5" />
      {/* Right shoulder */}
      <path d="M46 28 L54 22 L56 44 L46 44 Z" fill="#6B8FBF" opacity="0.5" />
      {/* Head */}
      <circle cx="32" cy="10" r="8" fill="#C8A96E" opacity="0.4" />
      {/* Neck */}
      <rect x="29" y="17" width="6" height="5" rx="1" fill="#C8A96E" opacity="0.35" />
      {/* Pocket square */}
      <path d="M36 33 L40 33 L39 38 L37 36 L35 38 Z" fill="#6B8FBF" opacity="0.6" />
    </svg>
  )
}

function DressIcon() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="h-16 w-auto" aria-hidden>
      {/* Head */}
      <circle cx="32" cy="10" r="8" fill="#C8A96E" opacity="0.4" />
      {/* Neck */}
      <rect x="29" y="17" width="6" height="5" rx="1" fill="#C8A96E" opacity="0.35" />
      {/* Bodice */}
      <path d="M24 22 Q32 26 40 22 L42 42 Q32 46 22 42 Z" fill="#6B8FBF" opacity="0.55" />
      {/* Left strap */}
      <path d="M26 22 L22 18 L24 22" fill="#6B8FBF" opacity="0.55" />
      {/* Right strap */}
      <path d="M38 22 L42 18 L40 22" fill="#6B8FBF" opacity="0.55" />
      {/* Skirt — A-line flare */}
      <path d="M22 42 Q10 56 8 72 L56 72 Q54 56 42 42 Q32 46 22 42 Z" fill="#BDD0E4" opacity="0.5" />
      {/* Skirt overlay shimmer */}
      <path d="M28 44 Q26 58 22 72 L30 72 Q30 56 32 44 Z" fill="white" opacity="0.15" />
    </svg>
  )
}

export default function DressCodeSection() {
  const data = useInvitationData()

  if (!data.dresscodeType && !data.dresscodeMen && !data.dresscodeWomen) return null

  return (
    <section className="relative overflow-hidden bg-[#ECEEF3] px-8 py-16">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(107,143,191,0.08),transparent_65%)]" />

      <div className="relative mx-auto max-w-sm">
        {/* Header */}
        <div className="mb-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#6B8FBF]" style={sbs}>
            dress code
          </p>
          {data.dresscodeType && (
            <p className="mt-3 text-[28px] font-light text-[#1C2B4A]" style={sbs}>
              {data.dresscodeType}
            </p>
          )}
        </div>

        {/* Men + Women cards */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          {/* Men */}
          <div className="flex flex-col items-center rounded-3xl border border-[#6B8FBF]/18 bg-white/70 px-5 py-8 text-center backdrop-blur-sm">
            <SuitIcon />
            <p className="mt-5 text-[10px] uppercase tracking-[0.45em] text-[#6B8FBF]" style={sbs}>
              Gentlemen
            </p>
            <p className="mt-2 text-[15px] font-light leading-snug text-[#1C2B4A]" style={sbs}>
              {data.dresscodeMen || 'Suit & Tie'}
            </p>
            {data.dresscodeMenColor && (
              <div className="mt-4 flex flex-col items-center gap-1.5">
                <div
                  className="h-8 w-8 rounded-full shadow-md ring-2 ring-white ring-offset-1"
                  style={{ backgroundColor: data.dresscodeMenColor }}
                />
                <span className="text-[10px] text-[#1C2B4A]/40" style={sbs}>
                  {data.dresscodeMenColor}
                </span>
              </div>
            )}
          </div>

          {/* Women */}
          <div className="flex flex-col items-center rounded-3xl border border-[#6B8FBF]/18 bg-white/70 px-5 py-8 text-center backdrop-blur-sm">
            <DressIcon />
            <p className="mt-5 text-[10px] uppercase tracking-[0.45em] text-[#6B8FBF]" style={sbs}>
              Ladies
            </p>
            <p className="mt-2 text-[15px] font-light leading-snug text-[#1C2B4A]" style={sbs}>
              {data.dresscodeWomen || 'Cocktail Dress or Gown'}
            </p>
            {data.dresscodeWomenColor && (
              <div className="mt-4 flex flex-col items-center gap-1.5">
                <div
                  className="h-8 w-8 rounded-full shadow-md ring-2 ring-white ring-offset-1"
                  style={{ backgroundColor: data.dresscodeWomenColor }}
                />
                <span className="text-[10px] text-[#1C2B4A]/40" style={sbs}>
                  {data.dresscodeWomenColor}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Note */}
        <p className="mt-8 text-center text-[13px] font-light italic leading-relaxed text-[#1C2B4A]/55" style={sbs}>
          We invite you to dress elegantly for this special celebration.
        </p>
      </div>
    </section>
  )
}
