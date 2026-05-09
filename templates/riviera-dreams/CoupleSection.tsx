'use client'

import Image from 'next/image'
import { useInvitationData } from '../arabic-moorish/InvitationDataContext'

export default function CoupleSection() {
  const data = useInvitationData()

  return (
    <section className="relative overflow-hidden bg-white px-6 py-0">
      <div className="mx-auto flex max-w-sm flex-col items-center">

        {/* Couple illustration — sits flush, fades into white at top */}
        <div className="relative w-full">
          <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-white to-transparent" />
          <Image
            src="/templates/riviera-dreams/frame-3.png"
            alt="Couple illustration"
            width={430}
            height={540}
            className="w-full object-contain"
            priority={false}
          />
          <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Names + quote overlay */}
        <div className="-mt-8 relative z-20 text-center pb-10">
          <p className="text-2xl italic text-[#1C2B4A]">
            {data.groomNameEn}
            <span className="mx-3 text-[#C8A96E]">&amp;</span>
            {data.brideNameEn}
          </p>
          <p className="mt-3 text-sm text-[#1C2B4A]/50 italic">
            Two souls, one love, one lifetime.
          </p>
          {data.hashtag && (
            <p className="mt-2 text-xs tracking-widest text-[#6B8FBF]">
              {data.hashtag}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
