'use client'

import Image from 'next/image'
import { useInvitationData } from './InvitationDataContext'
import { IvorySectionHeader } from './IvorySectionHeader'

export default function CoupleStorySection() {
  const data = useInvitationData()
  const groomInitial = data.groomNameEn?.charAt(0).toUpperCase() || 'A'
  const brideInitial = data.brideNameEn?.charAt(0).toUpperCase() || 'I'

  return (
    <section
      className="relative overflow-hidden bg-[#FAF8F5] px-5 py-20 text-[#2C2416] sm:px-8"
      style={{ fontFamily: "'Source Serif 4', serif" }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#C8B99A]/70 bg-[#F5F0EB] shadow-[0_14px_34px_rgba(156,139,120,0.1)]">
          <span
            className="text-[2rem] tracking-[0.08em] text-[#827B6F]"
            style={{ fontFamily: "'Carattere', cursive" }}
          >
            {groomInitial}{brideInitial}
          </span>
        </div>

        <IvorySectionHeader className="mt-8" eyebrow="Their journey" title="Two hearts, one story" />

        <p
          className="mt-6 text-base leading-[1.85] text-[#827B6F]/95"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          From quiet conversations to a grand promise beneath the ivory arches, {data.groomNameEn} and {data.brideNameEn} invite you to witness a chapter shaped by grace, laughter, and the timeless romance of {data.cityEn}. On {data.weddingDate}, our story gathers family and friends within {data.venueEn} to celebrate a love meant to endure.
        </p>

        <div className="mx-auto mt-12 h-28 w-44 overflow-hidden rounded-t-[5rem] rounded-b-[1.75rem] border border-[#E8DFD0] bg-[#F5F0EB] shadow-[0_16px_36px_rgba(156,139,120,0.1)]">
          <div className="relative h-full w-full scale-[1.55] translate-y-6">
            <Image src="/templates/ivory-pavilion/hero-frame.png" alt="Ivory rotunda" fill className="object-cover object-bottom" />
          </div>
        </div>

        {data.hashtag && (
          <p
            className="mt-8 text-lg text-[#827B6F]"
            style={{ fontFamily: "'Carattere', cursive" }}
          >
            {data.hashtag}
          </p>
        )}
      </div>
    </section>
  )
}
