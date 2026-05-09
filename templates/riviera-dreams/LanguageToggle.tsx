'use client'

import { useRivieraLang } from './LanguageContext'
import { useInvitationData } from '../arabic-moorish/InvitationDataContext'
import { usePreviewMode } from '../arabic-moorish/InvitationDataContext'

const sbs = { fontFamily: "'Amarna', serif" }

export default function LanguageToggle() {
  const { activeLang, setActiveLang } = useRivieraLang()
  const data = useInvitationData()
  const isPreview = usePreviewMode()

  if (isPreview || !data.lang2Code || !data.lang2Label) return null

  return (
    <div
      className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
      style={sbs}
    >
      {/* Outer shell — frosted card matching the template palette */}
      <div className="flex overflow-hidden rounded-full border border-[#6B8FBF]/25 bg-white/60 shadow-[0_8px_32px_rgba(28,43,74,0.12)] backdrop-blur-md">
        {/* Thin gold accent line at top */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A96E]/40 to-transparent" />

        <button
          onClick={() => setActiveLang('lang1')}
          className={`relative px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
            activeLang === 'lang1'
              ? 'text-white'
              : 'text-[#1C2B4A]/45 hover:text-[#1C2B4A]'
          }`}
        >
          {activeLang === 'lang1' && (
            <span className="absolute inset-0 rounded-full bg-[#1C2B4A]" style={{ zIndex: -1 }} />
          )}
          EN
        </button>

        {/* Separator */}
        <div className="my-2 w-px bg-[#6B8FBF]/20" />

        <button
          onClick={() => setActiveLang('lang2')}
          className={`relative px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
            activeLang === 'lang2'
              ? 'text-white'
              : 'text-[#1C2B4A]/45 hover:text-[#1C2B4A]'
          }`}
        >
          {activeLang === 'lang2' && (
            <span className="absolute inset-0 rounded-full bg-[#1C2B4A]" style={{ zIndex: -1 }} />
          )}
          {data.lang2Label}
        </button>
      </div>
    </div>
  )
}
