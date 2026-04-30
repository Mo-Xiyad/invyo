'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import HeroScrollingCards from './HeroScrollingCards'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-lt-lime to-lt-lime-deep pb-16 pt-28 md:pb-20 md:pt-32">
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1.05fr)] lg:gap-10 xl:gap-16">
          {/* Copy — left on large screens (Linktree-style) */}
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-lg lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-lt-ink xl:text-[clamp(2.5rem,4.2vw,4rem)]"
            >
              Wedding invitations
              <br />
              can be easy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 font-sans text-base font-medium leading-relaxed text-lt-ink/85 md:text-lg"
            >
              Create your own sharable wedding invitation. Digital wedding invitations that work. No design
              skills needed. Track RSVPs in one place.
            </motion.p>

            <motion.div
              id="get-started"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch lg:max-w-none"
            >
              <label className="sr-only" htmlFor="invyo-url-preview">
                Your Invyo link
              </label>
              <div className="flex min-h-[52px] flex-1 items-center rounded-full border-2 border-lt-ink bg-lt-surface px-5 text-left shadow-sm">
                <span className="select-none font-sans text-sm font-semibold text-lt-muted">invyo.me/</span>
                <input
                  id="invyo-url-preview"
                  readOnly
                  tabIndex={-1}
                  defaultValue="your-names"
                  className="min-w-0 flex-1 bg-transparent font-sans text-sm font-semibold text-lt-ink outline-none"
                  aria-hidden
                />
              </div>
              <Link
                href="/contact"
                className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-full bg-lt-ink px-8 font-sans text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Contact
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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-3 font-sans text-xs font-medium text-lt-ink/55"
            >
              Free to start · No credit card required
            </motion.p>
          </div>

          {/* Scrolling invite cards — right (Linktree-style) */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <HeroScrollingCards />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
