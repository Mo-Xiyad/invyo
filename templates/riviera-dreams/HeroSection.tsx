'use client'

import { useInvitationData, usePreviewMode } from '../arabic-moorish/InvitationDataContext'

const sbs = { fontFamily: "'Caveat', cursive" }
const sat = { fontFamily: "'Satisfy', cursive" }

export default function HeroSection() {
  const previewMode = usePreviewMode()
  const data = useInvitationData()

  return (
    <section
      className="relative isolate flex w-full flex-col overflow-hidden"
      style={{
        height: previewMode ? '760px' : '932px',
        backgroundColor: '#ECEEF3',
      }}
    >
      {/* Full frame image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/templates/riviera-dreams/frame-1.png')" }}
      />

      {/* Names — centred as before */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10 text-center">
        <p className="text-[10px] font-light uppercase tracking-[0.55em] text-[#6B8FBF]" style={sbs}>
          invite you to celebrate
        </p>

        <h1 className="mt-3 text-[38px] font-light leading-[1.1] text-[#1C2B4A]" style={sat}>
          {data.groomNameEn}{data.groomLastNameEn ? ` ${data.groomLastNameEn}` : ''}
        </h1>

        <p className="text-[22px] font-light italic leading-none text-[#6B8FBF]" style={sat}>
          &amp;
        </p>

        <h2 className="text-[38px] font-light leading-[1.1] text-[#1C2B4A]" style={sat}>
          {data.brideNameEn}{data.brideLastNameEn ? ` ${data.brideLastNameEn}` : ''}
        </h2>
      </div>

      {/* Scroll hint — moved up a bit */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-20">
        <p className="text-[10px] italic tracking-[0.15em] text-[#1C2B4A]/50" style={sbs}>
          a love story unfolds below
        </p>

        {/* Animated mouse scroll icon */}
        <div className="sbs-mouse">
          <span className="sbs-mouse-wheel" />
        </div>
      </div>
    </section>
  )
}
