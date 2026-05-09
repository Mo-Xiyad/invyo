'use client'

import { useInvitationData } from '../arabic-moorish/InvitationDataContext'

export default function Footer() {
  const data = useInvitationData()

  return (
    <footer className="bg-white px-6 py-14 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-6 flex w-full max-w-xs items-center justify-center gap-4" aria-hidden>
          <div className="h-px flex-1 bg-[#6B8FBF]/25" />
          <svg viewBox="0 0 18 18" className="h-4 w-4 text-[#C8A96E]" fill="currentColor">
            <path d="M9 0l1.8 5.2L16 7l-4.2 3 1.5 5L9 12.2 4.7 15l1.5-5L2 7l5.2-1.8Z" />
          </svg>
          <div className="h-px flex-1 bg-[#6B8FBF]/25" />
        </div>
        <p className="text-4xl text-[#1C2B4A]">
          {data.groomNameEn} &amp; {data.brideNameEn}
        </p>
        {data.hashtag && (
          <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[#6B8FBF]">{data.hashtag}</p>
        )}
      </div>
    </footer>
  )
}
