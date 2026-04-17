'use client'
import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { playInvitationOpenConfetti } from '@/lib/celebrateOpen'

const ENTRY_BG_SRC = '/assets/front-page-bg.png'
const LOGO_SRC = '/assets/Z-y-logo.png'

interface Props {
  opening: boolean
  onOpen: () => void
}

export default function EnvelopeEntry({ opening, onOpen }: Props) {
  const reduceMotion = useReducedMotion()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleOpen = () => {
    if (opening) return
    if (!reduceMotion) {
      playInvitationOpenConfetti(triggerRef.current)
    }
    onOpen()
  }

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-parchment">
      {/* Background art — gentle breathing scale (respect reduced motion) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute inset-[-8%] bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ backgroundImage: `url(${ENTRY_BG_SRC})` }}
          initial={false}
          animate={
            opening
              ? { scale: 1.03, opacity: 0.88 }
              : reduceMotion
                ? { scale: 1.09, opacity: 1 }
                : { scale: [1.06, 1.12, 1.06], opacity: 1 }
          }
          transition={
            opening
              ? { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }
              : reduceMotion
                ? { duration: 0 }
                : { duration: 22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
          }
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(253,248,240,0.1)_0%,transparent_38%,rgba(253,248,240,0.16)_100%)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 72% 58% at 50% 48%, transparent 22%, rgba(42,24,8,0.07) 100%)',
          }}
        />
      </div>

      {/* Inset double frame — no text */}
      <div
        className="pointer-events-none absolute inset-3 border-2 border-gold/22 sm:inset-5 sm:border-gold/28"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-5 border border-gold/14 sm:inset-8 sm:border-gold/20"
        aria-hidden
      />

      {/* Warm bloom + ring behind monogram */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[min(72vw,280px)] w-[min(72vw,280px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: opening ? 0.35 : 0.85, scale: opening ? 1.05 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 0.88, 0.24, 1] }}
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(255,252,248,0.5) 0%, rgba(247,236,216,0.22) 42%, transparent 70%)',
          boxShadow:
            '0 0 80px 24px rgba(201,169,110,0.08), inset 0 0 0 1px rgba(201,169,110,0.14)',
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a96e]/20 sm:h-[240px] sm:w-[240px]"
        aria-hidden
      />

      <motion.div
        className="relative z-[2] flex items-center justify-center px-6"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 0.88, 0.24, 1], delay: 0.06 }}
      >
        <motion.button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          disabled={opening}
          aria-label="Open invitation"
          className="relative flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c79b63] focus-visible:ring-offset-4 focus-visible:ring-offset-parchment disabled:cursor-default"
          whileHover={opening ? undefined : { scale: 1.045 }}
          whileTap={opening ? undefined : { scale: 0.96 }}
          animate={
            opening
              ? { scale: 1.12, opacity: 0, filter: 'blur(12px)' }
              : { scale: 1, opacity: 1, filter: 'blur(0px)' }
          }
          transition={
            opening
              ? { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }
              : { type: 'spring', stiffness: 340, damping: 22 }
          }
        >
          <span className="relative flex h-[min(34vw,132px)] w-[min(34vw,132px)] items-center justify-center sm:h-[148px] sm:w-[148px]">
            <span
              className="absolute inset-[-6%] rounded-full opacity-90 blur-[1px]"
              aria-hidden
              // style={{
              //   boxShadow:
              //     '0 18px 40px rgba(62,42,20,0.2), 0 2px 0 rgba(255,252,248,0.35) inset, 0 0 0 1px rgba(201,169,110,0.25)',
              // }}
            />
            <span className="flex -rotate-[2deg] animate-sealFloat items-center justify-center transition-transform duration-500 ease-out hover:rotate-0">
              <img
                src={LOGO_SRC}
                alt=""
                width={256}
                height={256}
                className="relative z-[1] h-full w-full rounded-full object-contain object-center p-0.5 ring-2 ring-gold/35 ring-offset-2 ring-offset-parchment drop-shadow-[0_12px_32px_rgba(42,24,8,0.28),0_2px_8px_rgba(201,169,110,0.15)]"
                decoding="async"
                draggable={false}
              />
            </span>
          </span>
        </motion.button>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-[8] bg-[linear-gradient(to_bottom,#fdf8f0_0%,#faf6ee_55%,#fdf8f0_100%)]"
        aria-hidden
        initial={false}
        animate={{ opacity: opening ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: opening ? 0.1 : 0 }}
      />
    </section>
  )
}
