// components/RSVPSection.tsx
'use client'
import { motion } from 'framer-motion'

const WA_URL =
  'https://wa.me/46724551114?text=Hi%2C%20I%20would%20like%20to%20RSVP%20for%20the%20Marriage%20Ceremony%20of%20Ibrahim%20Zimam%20%26%20Yanal%20Ahmed%20on%208th%20May%202026.'

export default function RSVPSection() {
  return (
    <section className="bg-parchment px-6 pt-9 pb-14 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-cinzel text-[7.5px] tracking-[5px] text-gold uppercase mb-2">RSVP</p>
        <h2 className="font-vibes text-[32px] text-ink mb-2">Will you join us?</h2>
        <p className="font-cormorant italic text-[12px] text-muted leading-relaxed mb-6">
          Please let us know if
          <br />
          you&apos;ll be attending.
        </p>

        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center mx-auto mb-3 font-cinzel text-[11px] tracking-[6px] uppercase text-champagne rounded-sm animate-rsvpPulse"
          style={{
            background: '#2a1808',
            border: '1px solid rgba(201,169,110,0.35)',
            padding: '15px 20px',
            maxWidth: '220px',
          }}
        >
          RSVP
        </a>

        <p className="font-cormorant italic text-[11px] text-[#b09070]">Kindly reply by 1st May 2026</p>
      </motion.div>

      <div className="mt-10">
        <p className="font-vibes text-[20px] text-gold">With love, Zimam &amp; Yanal</p>
      </div>
    </section>
  )
}
