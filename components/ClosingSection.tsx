'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const tags = ['Simple', 'Fast', 'Just works']

export default function ClosingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="overflow-hidden bg-lt-footer py-24 md:py-32" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="font-display max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-lt-surface md:text-5xl lg:text-[3.25rem]"
        >
          The only Digital Wedding invitation you need.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mt-10 flex flex-wrap items-center gap-3 md:gap-4"
          aria-label="Product qualities"
        >
          {tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-3 md:gap-4">
              {i > 0 && (
                <span className="font-display text-lt-accent-soft/55 select-none text-xl font-light md:text-2xl" aria-hidden>
                  ·
                </span>
              )}
              <span className="rounded-full border border-white/25 bg-white/5 px-5 py-2.5 font-display text-sm font-bold tracking-wide text-lt-surface backdrop-blur-sm md:text-base">
                {tag}
              </span>
            </span>
          ))}
        </motion.div>

        <div className="mt-16 flex flex-col gap-10 border-t border-white/10 pt-14 md:flex-row md:items-end md:justify-between md:pt-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="max-w-md font-display text-xl font-semibold leading-snug text-white/70 md:text-2xl"
          >
            The fast, friendly and simple wedding invitation tool
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.3 }}
          >
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-full bg-lt-lime px-8 py-4 font-sans text-sm font-bold text-lt-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore options
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
