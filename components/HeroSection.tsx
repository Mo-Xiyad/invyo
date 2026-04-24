'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const HeroAnimation = dynamic(() => import('./HeroAnimation'), { ssr: false })

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-parchment pt-16">
      {/* Decorative background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div className="w-[600px] h-[600px] rounded-full border border-gold/10 absolute" />
        <div className="w-[950px] h-[950px] rounded-full border border-gold/5 absolute" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.2em] text-gold-deep font-sans font-bold mb-6"
        >
          Digital Wedding Invitations
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl text-espresso leading-[1.1] tracking-tight mb-6"
        >
          Wedding invitations
          <br />
          <em className="italic text-gold-deep">can be easy</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          className="font-sans text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10"
        >
          Create your own sharable wedding invitation. Digital wedding invitations
          that work. No design skills needed. Track RSVPs in one place.
        </motion.p>

        <motion.div
          id="get-started"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3 }}
        >
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-8 py-4 bg-espresso text-champagne font-sans font-bold text-sm tracking-wide rounded-full hover:bg-espresso-dk transition-all duration-200 hover:scale-105 shadow-lg shadow-espresso/20"
          >
            Get started for free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-4 text-xs text-muted font-sans"
        >
          Free to start · No credit card required
        </motion.p>
      </div>

      {/* Remotion animation player */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45 }}
        className="relative z-10 w-full max-w-2xl mx-auto px-6 mt-14 pb-24"
      >
        <HeroAnimation />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="text-[10px] text-muted font-sans tracking-widest uppercase">Scroll</span>
        <div className="w-px h-7 bg-gradient-to-b from-gold/50 to-transparent" />
      </motion.div>
    </section>
  )
}
