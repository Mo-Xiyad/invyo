'use client'

import { useInvitationData } from '../arabic-moorish/InvitationDataContext'

const sbs = { fontFamily: "'Amarna', serif" }

export default function DetailsSection() {
  const data = useInvitationData()
  const items = data.timeline ?? []

  return (
    <section className="relative overflow-hidden bg-[#F5F7FA] px-8 py-16">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-64 bg-right bg-no-repeat opacity-[0.06]"
        style={{ backgroundImage: "url('/templates/riviera-dreams/frame-2.png')", backgroundSize: 'contain' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-sm">
        <p className="mb-12 text-center text-[10px] uppercase tracking-[0.5em] text-[#6B8FBF]" style={sbs}>
          our celebration
        </p>

        <ol className="relative">
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#6B8FBF]/20" aria-hidden />

          {items.map((item, i) => (
            <li key={i} className="relative mb-10 pl-9 last:mb-0">
              <span className="absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full border-2 border-[#6B8FBF] bg-[#F5F7FA]" aria-hidden />

              {(item.time || item.venue) && (
                <p className="mb-1 text-[11px] font-light tracking-[0.2em] text-[#6B8FBF]" style={sbs}>
                  {[item.time, item.venue].filter(Boolean).join('  ·  ')}
                </p>
              )}

              <p className="text-[26px] font-light leading-tight text-[#1C2B4A]" style={sbs}>
                {item.event}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
