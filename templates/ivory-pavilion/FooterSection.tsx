'use client'

import { useInvitationData } from './InvitationDataContext'

function RoseGarland() {
  return (
    <svg viewBox="0 0 320 70" className="mx-auto h-14 w-full max-w-sm text-[#C8B99A]" fill="none" aria-hidden>
      <path d="M20 18c45 30 95 42 140 42s95-12 140-42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {[36, 72, 116, 160, 204, 248, 284].map((cx, index) => (
        <g key={cx} opacity={0.9 - index * 0.05}>
          <circle cx={cx} cy={index % 2 === 0 ? 26 : 34} r="6" fill="currentColor" fillOpacity="0.18" />
          <circle cx={cx} cy={index % 2 === 0 ? 26 : 34} r="3.2" fill="currentColor" />
        </g>
      ))}
    </svg>
  )
}

export default function FooterSection() {
  const data = useInvitationData()

  return (
    <footer
      className="bg-[#2C2416] px-5 py-14 text-center text-[#FAF8F5] sm:px-8"
      style={{ fontFamily: "'Source Serif 4', serif" }}
    >
      <RoseGarland />
      <h2
        className="mt-5 text-[clamp(2rem,5vw,2.65rem)] leading-tight text-[#F5F0EB]"
        style={{ fontFamily: "'Carattere', cursive" }}
      >
        {data.groomNameEn} &amp; {data.brideNameEn}
      </h2>
      <p
        className="mt-3 text-[10px] uppercase tracking-[0.35em] text-[#E8DFD0]/90"
        style={{ fontFamily: "'Source Serif 4', serif" }}
      >
        {data.weddingDate}, {data.weddingYear}
      </p>
      {data.hashtag && (
        <p
          className="mt-5 text-lg text-[#C8B99A]"
          style={{ fontFamily: "'Carattere', cursive" }}
        >
          {data.hashtag}
        </p>
      )}
      <p
        className="mt-6 text-xs italic tracking-[0.12em] text-[#C8B99A]"
        style={{ fontFamily: "'Source Serif 4', serif" }}
      >
        Crafted with love by Invyo
      </p>
    </footer>
  )
}
