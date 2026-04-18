// components/PrivateNotice.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionStationeryFrame from './SectionStationeryFrame'

const CONTENT = {
  en: {
    heading: 'A Private Ceremony',
    body1: (
      <>
        This is an intimate,
        <br />
        invitation-only event.
      </>
    ),
    body2: (
      <>
        Your invitation is personal to you.
        <br />
        You are welcome to bring
        <br />
        one guest (+1).
        <br />
        <br />
        We kindly ask that no additional
        <br />
        family members attend.
      </>
    ),
    badge: 'Invitation Only · +1 Permitted',
    dir: 'ltr' as const,
  },
  dv: {
    heading: 'ޕްރައިވެޓް ރަސްމިއްޔާތެއް',
    body1: (
      <>
        ާއްޞަ ދައުވަތެއް
      </>
    ),
    body2: (
      <>
        މިއީ ހަމައެކަނި ދައުވަތު އެރުވޭ ފަރާތްތަކަށް ޚާއްޞަކޮށްގެން ބާއްވާ، މަދު ބަޔަކު ބައިވެރިވާ ޚާއްޞަ ހަފުލާއެކެވެ.
        <br />
        <br />
        މި ދައުވަތަކީ ތިޔަ ފަރާތަށް ވަކިން ޚާއްޞަކޮށް އެރުވޭ ދައުވަތެކެވެ. އެހެން ނަމަވެސް ތިޔަ ފަރާތާއެކު އިތުރު އެއް ބޭފުޅަކު (1+) ބައިވެރިކުރެއްވުމަކީ އަޅުގަނޑުމެން އުފަލާއެކު މަރުޙަބާ ކިޔާނެ ކަމެކެވެ.
        <br />
        <br />
        ނަމަވެސް، ހަފުލާގެ އިންތިޒާމުތައް ހަމަޖެހިފައިވާ ގޮތުން، މި ހަފުލާގައި އިތުރު އާއިލީ މެންބަރުން ބައިވެރިނުކުރެއްވުމަކީ އަޅުގަނޑުމެންގެ ވަރަށް ބޮޑު އެދުމެކެވެ.
        <br />
        <br />
        ނޯޓު: ދައުވަތު އެރުވޭ ފަރާތްތަކަށް އެކަނި - އިތުރު އެއް ބޭފުޅަކަށް ފުރުސަތު ދެވިދާނެ
      </>
    ),
    badge: 'ދައުވަތު ލިބިފައިވާ ފަރާތްތަކަށް · +1 ހުއްދަ',
    dir: 'rtl' as const,
  },
}

export default function PrivateNotice() {
  const [lang, setLang] = useState<'en' | 'dv'>('en')
  const c = CONTENT[lang]

  return (
    <section
      className="relative overflow-hidden px-6 py-9 text-center"
      style={{ background: 'linear-gradient(170deg, #2a1808, #1e1005)' }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 pointer-events-none animate-ambPulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,60,0.07), transparent 55%)',
        }}
      />

      <SectionStationeryFrame tone="dark" className="max-w-[340px]">
        <div className="relative mb-4 flex justify-center">
          <button
            type="button"
            onClick={() => setLang((l) => (l === 'en' ? 'dv' : 'en'))}
            className="flex items-center gap-0 overflow-hidden rounded-full border border-gold/30 font-cinzel text-[7px] uppercase tracking-[2px]"
            aria-label="Toggle language"
          >
            <span
              className={`px-3 py-1.5 transition-colors duration-200 ${lang === 'en' ? 'bg-gold/20 text-champagne' : 'text-gold/50'
                }`}
            >
              EN
            </span>
            <span className="h-4 w-px bg-gold/20" />
            <span
              className={`px-3 py-1.5 font-amiri text-[9px] transition-colors duration-200 ${lang === 'dv' ? 'bg-gold/20 text-champagne' : 'text-gold/50'
                }`}
            >
              ދިވެހި
            </span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 flex justify-center" aria-hidden>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer ring */}
              <circle cx="19" cy="19" r="17.5" stroke="#c9a96e" strokeWidth="0.7" opacity="0.5" />
              {/* Inner ring */}
              <circle cx="19" cy="19" r="14.5" stroke="#c9a96e" strokeWidth="0.5" opacity="0.3" />
              {/* Candle body */}
              <rect x="16" y="20" width="6" height="11" rx="0.8" stroke="#c9a96e" strokeWidth="1" fill="rgba(201,169,110,0.08)" />
              {/* Wax top ellipse */}
              <ellipse cx="19" cy="20" rx="3.5" ry="1.2" stroke="#c9a96e" strokeWidth="0.9" fill="rgba(201,169,110,0.12)" />
              {/* Candle base plate */}
              <rect x="14.5" y="31" width="9" height="1.4" rx="0.7" stroke="#c9a96e" strokeWidth="0.8" fill="rgba(201,169,110,0.1)" />
              {/* Wick */}
              <line x1="19" y1="18.8" x2="19" y2="20" stroke="#c9a96e" strokeWidth="0.8" strokeLinecap="round" />
              {/* Flame — teardrop */}
              <path
                d="M19 7.5 C19 7.5 22.5 11.5 22.5 14.5 C22.5 16.7 20.9 18.4 19 18.4 C17.1 18.4 15.5 16.7 15.5 14.5 C15.5 11.5 19 7.5 19 7.5 Z"
                stroke="#c9a96e" strokeWidth="0.9" fill="rgba(201,169,110,0.15)" strokeLinejoin="round"
              />
              {/* Flame inner highlight */}
              <path
                d="M19 11 C19 11 21 13.2 21 14.8 C21 16 20.1 17 19 17 C17.9 17 17 16 17 14.8 C17 13.2 19 11 19 11 Z"
                fill="rgba(201,169,110,0.25)" stroke="none"
              />
              {/* Four corner ornament dots */}
              <circle cx="19" cy="2" r="0.9" fill="#c9a96e" opacity="0.6" />
              <circle cx="19" cy="36" r="0.9" fill="#c9a96e" opacity="0.6" />
              <circle cx="2" cy="19" r="0.9" fill="#c9a96e" opacity="0.6" />
              <circle cx="36" cy="19" r="0.9" fill="#c9a96e" opacity="0.6" />
            </svg>
          </span>
          <h2
            className={`text-[24px] text-champagne mb-3 relative ${lang === 'dv' ? 'font-amiri' : 'font-cinzel'}`}
          >
            {c.heading}
          </h2>
          <div dir={c.dir}>
            <p
              className={`italic text-[12.5px] text-gold/80 leading-[1.9] relative ${lang === 'dv' ? 'font-amiri' : 'font-cinzel'}`}
            >
              {c.body1}
            </p>
            <div className="w-10 h-px mx-auto my-3" style={{ background: 'rgba(201,169,110,0.25)' }} />
            <p
              className={`italic text-[12.5px] text-gold/80 leading-[1.9] relative ${lang === 'dv' ? 'font-amiri' : 'font-cinzel'}`}
            >
              {c.body2}
            </p>
            <span
              className={`relative mt-3.5 inline-block border border-gold/30 px-3.5 py-1.5 text-[9px] uppercase tracking-[3px] text-champagne ${lang === 'dv' ? 'font-amiri normal-case tracking-normal' : 'font-cinzel'}`}
            >
              {c.badge}
            </span>
          </div>
        </motion.div>
      </SectionStationeryFrame>
    </section>
  )
}
