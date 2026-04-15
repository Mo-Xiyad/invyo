// components/EventDetails.tsx
'use client'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

const rows = (arrivalTime: string) => [
  { glyph: '✦', label: 'Date', value: 'Thursday, 8th May 2026', pill: null as string | null },
  { glyph: '◷', label: 'Arrival · Ends', value: `${arrivalTime} — 19:30`, pill: 'Ends at 19:30' },
  { glyph: '⌖', label: 'Venue', value: 'Pavilion by Gold', pill: null as string | null },
]

export default function EventDetails({ arrivalTime }: { arrivalTime: string }) {
  return (
    <section className="bg-parchment px-6 py-10">
      <motion.h2
        className="font-cormorant font-light text-[28px] text-ink text-center mb-1"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        Event Details
      </motion.h2>
      <motion.p
        className="font-cormorant italic text-[13px] text-muted text-center mb-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          ...fadeUp,
          show: { ...fadeUp.show, transition: { delay: 0.1, duration: 0.55, ease: 'easeOut' as const } },
        }}
      >
        Everything you need to know
      </motion.p>

      <div className="max-w-[220px] mx-auto">
        {rows(arrivalTime).map((row, i) => (
          <motion.div
            key={row.label}
            className="flex items-start gap-3 py-2.5 border-b border-gold/10 last:border-b-0"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              ...fadeUp,
              show: { ...fadeUp.show, transition: { delay: i * 0.12, duration: 0.55, ease: 'easeOut' as const } },
            }}
          >
            <span className="text-gold text-[12px] w-4 text-center shrink-0 mt-0.5">{row.glyph}</span>
            <div>
              <p className="font-cinzel text-[7px] tracking-[2.5px] text-muted uppercase mb-0.5">{row.label}</p>
              <p className="font-cormorant italic text-[15px] text-ink">{row.value}</p>
              {row.pill && (
                <span className="inline-block bg-espresso text-champagne font-cinzel text-[7.5px] tracking-[1.5px] px-2 py-0.5 rounded-full mt-1">
                  {row.pill}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
