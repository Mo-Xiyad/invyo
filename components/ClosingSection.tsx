'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const qualities = [
  { label: 'Simple.', note: 'No complexity, no overwhelm' },
  { label: 'Fast.', note: 'Set up in minutes' },
  { label: 'Just works.', note: 'Proven & reliable' },
]

export default function ClosingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-espresso py-32 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-8"
        >
          Everything you need
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl text-champagne leading-tight mb-16 max-w-2xl"
        >
          The only Digital Wedding invitation you need.
        </motion.h2>

        <div className="border-t border-champagne/10 mb-20">
          {qualities.map((q, i) => (
            <motion.div
              key={q.label}
              initial={{ opacity: 0, x: -32 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="border-b border-champagne/10 py-6 flex items-center justify-between group cursor-default"
            >
              <span className="font-serif text-5xl md:text-7xl text-champagne/20 group-hover:text-champagne/60 transition-colors duration-300">
                {q.label}
              </span>
              <span className="text-xs font-sans text-champagne/30 uppercase tracking-[0.15em] group-hover:text-gold transition-colors duration-300">
                {q.note}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="font-serif text-2xl md:text-3xl text-champagne/60 italic max-w-md"
          >
            The fast, friendly and simple wedding invitation tool
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-8 py-4 bg-champagne text-espresso font-sans font-bold text-sm tracking-wide rounded-full hover:bg-gold hover:text-white transition-all duration-200 hover:scale-105"
            >
              Explore options
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
