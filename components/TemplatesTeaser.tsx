'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { TEMPLATES } from '@/lib/templates'
import TemplateCard from './TemplateCard'

export default function TemplatesTeaser() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  // Show only the real templates (not the coming-soon placeholder)
  const featuredTemplates = TEMPLATES.filter(t => t.id !== 'coming-soon').slice(0, 2)

  return (
    <section ref={ref} className="bg-lt-subtle py-14 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-lt-muted"
            >
              Templates
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="font-display text-3xl font-extrabold leading-tight tracking-tight text-lt-ink md:text-4xl"
            >
              Pick a style,
              <br />
              make it yours
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.14 }}
          >
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full border-2 border-lt-ink px-6 py-3 font-sans text-sm font-bold text-lt-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              See all templates
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-2 gap-5 lg:max-w-2xl">
          {featuredTemplates.map((t, i) => (
            <TemplateCard key={t.id} config={t} index={i} />
          ))}
        </div>

        {/* Footer nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 font-sans text-sm text-lt-muted"
        >
          Need something different?{' '}
          <Link href="/contact" className="font-semibold text-lt-ink underline underline-offset-2 hover:no-underline">
            Request a custom design →
          </Link>
        </motion.p>
      </div>
    </section>
  )
}
