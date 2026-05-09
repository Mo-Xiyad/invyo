'use client'

import { useLanguage } from './LanguageContext'
import { useInvitationData } from './InvitationDataContext'

const TimelineSection = () => {
  const { isArabic } = useLanguage()
  const data = useInvitationData()
  const items = data.timeline ?? []

  if (!items.length) return null

  return (
    <section
      className="relative px-6 py-14 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F0F6F2 0%, #FAF7F0 100%)' }}
    >
      <div className="absolute inset-0 am-am-am-zellige-bg-dense opacity-[0.04]" />
      <div className="relative z-10 max-w-sm mx-auto">
        <p className="font-lato text-[10px] uppercase tracking-[0.45em] text-[#3D6B5E]/70 text-center mb-10">
          {isArabic ? 'برنامج الاحتفال' : 'celebration schedule'}
        </p>

        <ol className="relative" dir={isArabic ? 'rtl' : 'ltr'}>
          {/* Vertical line */}
          <div
            className={`absolute top-2 bottom-2 w-px bg-[#3D6B5E]/20 ${isArabic ? 'right-[5px]' : 'left-[5px]'}`}
            aria-hidden
          />

          {items.map((item, i) => (
            <li key={i} className={`relative mb-9 last:mb-0 ${isArabic ? 'pr-9' : 'pl-9'}`}>
              {/* Dot */}
              <span
                className={`absolute top-[6px] h-[11px] w-[11px] rounded-full border-2 border-[#C8813A] bg-[#FAF7F0] ${
                  isArabic ? 'right-0' : 'left-0'
                }`}
                aria-hidden
              />
              {(item.time || item.venue) && (
                <p className="font-lato text-[10px] uppercase tracking-[0.25em] text-[#C8813A]/80 mb-1">
                  {[item.time, item.venue].filter(Boolean).join('  ·  ')}
                </p>
              )}
              <p className={`text-[22px] font-light leading-tight text-[#1A1A2E] ${isArabic ? 'font-amiri' : 'font-lato'}`}>
                {item.event}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default TimelineSection
