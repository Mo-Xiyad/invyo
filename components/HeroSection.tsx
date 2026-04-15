// components/HeroSection.tsx
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Candelabra from './Candelabra'
import CornerOrnament from './CornerOrnament'

const NAME1 = 'Ibrahim Zimam'
const NAME2 = 'Yanal Ahmed'
const CHAR_DELAY = 60

const HERO_BG_SRC = '/assets/Elegant-floral-elegance-with-candlelight-glow.png'

export default function HeroSection() {
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [showCursor1, setShowCursor1] = useState(true)
  const [showCursor2, setShowCursor2] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    let iv2: ReturnType<typeof setInterval> | undefined
    let doneTimer: ReturnType<typeof setTimeout> | undefined
    let i = 0
    const iv1 = setInterval(() => {
      if (cancelled) return
      i++
      setLine1(NAME1.slice(0, i))
      if (i >= NAME1.length) {
        clearInterval(iv1)
        setShowCursor1(false)
        setShowCursor2(true)
        let j = 0
        iv2 = setInterval(() => {
          if (cancelled) return
          j++
          setLine2(NAME2.slice(0, j))
          if (j >= NAME2.length) {
            if (iv2) clearInterval(iv2)
            iv2 = undefined
            doneTimer = setTimeout(() => {
              if (!cancelled) {
                setShowCursor2(false)
                setDone(true)
              }
            }, 600)
          }
        }, CHAR_DELAY)
      }
    }, CHAR_DELAY)
    return () => {
      cancelled = true
      clearInterval(iv1)
      if (iv2) clearInterval(iv2)
      if (doneTimer) clearTimeout(doneTimer)
    }
  }, [])

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-parchment text-center">
      {/* Floral + candlelight art — full bleed; scrim keeps names readable */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG_SRC})` }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(253,248,240,0.9)_0%,rgba(253,248,240,0.7)_42%,rgba(253,248,240,0.78)_100%)]"
        />
        <div className="absolute inset-0 card-grid opacity-[0.35]" />
        <div
          className="absolute inset-0 mix-blend-multiply opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 95% 75% at 50% 48%, transparent 22%, rgba(42,24,8,0.14) 100%)',
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute top-0 left-1/2 z-[1] w-56 -translate-x-1/2 h-36 animate-ambPulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.14), transparent 65%)',
        }}
      />

      <div className="gold-border z-[1]" />
      <div className="gold-border-inner z-[1]" />

      <CornerOrnament className="top-1 left-1 z-[1]" />
      <CornerOrnament className="top-1 right-1 z-[1] scale-x-[-1]" />
      <CornerOrnament className="bottom-1 left-1 z-[1] scale-y-[-1]" />
      <CornerOrnament className="bottom-1 right-1 z-[1] [transform:scale(-1)]" />

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col justify-center px-5 pt-[max(2rem,env(safe-area-inset-top,0px))] pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
      <Candelabra className="w-36 mx-auto mb-5 relative" />

      <motion.p
        className="font-cinzel text-[7px] tracking-[6px] text-gold uppercase mb-3 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Marriage Ceremony
      </motion.p>

      <div className="relative">
        <p className="font-vibes text-[34px] text-ink leading-tight">
          {line1}
          {showCursor1 && (
            <span className="inline-block w-[2px] h-[0.9em] bg-gold ml-[1px] align-middle animate-blink" />
          )}
        </p>

        <motion.p
          className="font-vibes text-[26px] text-gold my-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: line1.length === NAME1.length ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          &amp;
        </motion.p>

        <p className="font-vibes text-[34px] text-ink leading-tight">
          {line2}
          {showCursor2 && (
            <span className="inline-block w-[2px] h-[0.9em] bg-gold ml-[1px] align-middle animate-blink" />
          )}
        </p>
      </div>

      {done && (
        <motion.div
          className="flex items-center gap-2 mx-auto my-4 max-w-[140px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.5))' }}
          />
          <span className="text-gold text-[8px]">✦</span>
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.5))' }}
          />
        </motion.div>
      )}

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="font-cinzel text-[10px] tracking-[3px] text-[#5a3a1a] mb-1">8th May · MMXXVI</p>
          <p className="font-cormorant italic text-[13px] text-muted">Pavilion by Gold, Maldives</p>
        </motion.div>
      )}

      </div>

      {done && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center px-5 pb-[max(1.35rem,env(safe-area-inset-bottom,0px))] pt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.55 }}
        >
          <p
            className="font-cinzel text-[10px] font-medium tracking-[0.32em] text-gold-deep uppercase shadow-[0_0_0_1px_rgba(201,169,110,0.35),0_2px_16px_rgba(253,248,240,0.85)] animate-hintPulse rounded-full bg-parchment/90 px-5 py-2.5 backdrop-blur-[2px]"
          >
            Scroll ↓
          </p>
        </motion.div>
      )}
    </section>
  )
}
