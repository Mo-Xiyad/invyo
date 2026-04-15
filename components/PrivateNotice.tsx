// components/PrivateNotice.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
        މިއީ ދައުވަތު ދެވިފައިވާ ބޭފުޅުންނަށް ހާއްސަ
        <br />
        ވަރަށް ގާތް ރަސްމިއްޔާތެކެވެ.
      </>
    ),
    body2: (
      <>
        ތިޔަ ބޭފުޅާ ލިބިވަޑައިގެންނެވި ދައުވަތަކީ ވަކިން ހާއްސަ
        <br />
        ގޮތެއްގައި ތިޔަ ބޭފުޅާ ލިބިވަޑައިގަތުމަށް ދެވިފައިވާ ދައުވަތެކެވެ.
        <br />
        ތިޔަ ބޭފުޅާ ވަޑައިގަތުމަށް +1 ހިމެނިދާނެ.
        <br />
        <br />
        ތިޔަ ބޭފުޅާ ނޫން ހާއްސަ ދައުވަތު ނެތް ފަރާތް ތަކުން
        <br />
        ބައިވެރި ނުވުން ވަރަށް ވެސް އިލްތިމާސް ކުރަމެވެ.
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

      <div className="relative flex justify-center mb-4">
        <button
          type="button"
          onClick={() => setLang((l) => (l === 'en' ? 'dv' : 'en'))}
          className="flex items-center gap-0 border border-gold/30 rounded-full overflow-hidden font-cinzel text-[7px] tracking-[2px] uppercase"
          aria-label="Toggle language"
        >
          <span
            className={`px-3 py-1.5 transition-colors duration-200 ${
              lang === 'en' ? 'bg-gold/20 text-champagne' : 'text-gold/50'
            }`}
          >
            EN
          </span>
          <span className="w-px h-4 bg-gold/20" />
          <span
            className={`px-3 py-1.5 transition-colors duration-200 font-sans text-[9px] ${
              lang === 'dv' ? 'bg-gold/20 text-champagne' : 'text-gold/50'
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
        <span className="text-[28px] block mb-3 relative">🕯</span>
        <h2 className="font-vibes text-[24px] text-champagne mb-3 relative">{c.heading}</h2>
        <div dir={c.dir}>
          <p className="font-cormorant italic text-[12.5px] text-gold/80 leading-[1.9] relative">{c.body1}</p>
          <div className="w-10 h-px mx-auto my-3" style={{ background: 'rgba(201,169,110,0.25)' }} />
          <p className="font-cormorant italic text-[12.5px] text-gold/80 leading-[1.9] relative">{c.body2}</p>
          <span className="inline-block border border-gold/30 text-champagne font-cinzel text-[7px] tracking-[3px] uppercase px-3.5 py-1.5 mt-3.5 relative">
            {c.badge}
          </span>
        </div>
      </motion.div>
    </section>
  )
}
