// components/HeroSection.tsx
'use client'
import { useEffect, useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HeroCandleFlames from './HeroCandleFlames'

const NAME1 = 'Ibrahim Zimam'
const NAME2 = 'Yanal Ahmed'
const CHAR_DELAY = 60

const HERO_BG_DESKTOP = '/assets/bg.png'
const HERO_BG_390 = '/assets/bg_mobile_390x844.png'
const HERO_BG_430 = '/assets/bg_mobile_430x932.png'

/** Larger phones / Pro Max class (~430×932). Checked first. */
function is430PortraitViewport(width: number, height: number): boolean {
  if (width < 412 || width > 438) return false
  if (height < 880) return false
  return true
}

/** Standard iPhone portrait class (~390×844, incl. 375–393 widths). */
function is390PortraitViewport(width: number, height: number): boolean {
  if (width < 360 || width > 411) return false
  if (height < 760 || height > 920) return false
  return true
}

function pickHeroBg(width: number, height: number): string {
  if (is430PortraitViewport(width, height)) return HERO_BG_430
  if (is390PortraitViewport(width, height)) return HERO_BG_390
  return HERO_BG_DESKTOP
}

export default function HeroSection() {
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [showCursor1, setShowCursor1] = useState(true)
  const [showCursor2, setShowCursor2] = useState(false)
  const [done, setDone] = useState(false)
  const [heroBgSrc, setHeroBgSrc] = useState(HERO_BG_DESKTOP)

  useLayoutEffect(() => {
    const sync = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setHeroBgSrc(pickHeroBg(w, h))
    }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

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
      {/* bg.png — lighter wash + weaker edge vignette so the art’s frame/border stays visible */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBgSrc})` }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(253,248,240,0.22)_0%,rgba(253,248,240,0.1)_48%,rgba(253,248,240,0.2)_100%)]"
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            background:
              'radial-gradient(ellipse 105% 92% at 50% 48%, transparent 58%, rgba(74,52,28,0.08) 100%)',
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute top-0 left-1/2 z-[1] w-56 -translate-x-1/2 h-36 animate-ambPulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.14), transparent 65%)',
        }}
      />

      {/* Live flames over the three candles in bg.png — same SVG motion as Candelabra */}
      {/* <div
        // className="pointer-events-none absolute left-1/2 z-[2] w-[min(92%,420px)] -translate-x-1/2 top-[max(3.25rem,min(11dvh,104px))]"
        aria-hidden
      >
        <HeroCandleFlames className="mx-auto h-auto w-full max-h-[min(14dvh,88px)] opacity-[0.94]" />
      </div> */}

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col justify-center px-5 pt-[max(2rem,env(safe-area-inset-top,0px))] pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] translate-y-[min(5vh,2rem)]">
      <motion.p
        className="font-cinzel text-[9px] sm:text-[10px] tracking-[3px] text-muted uppercase mb-5 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Marriage Ceremony
      </motion.p>

      <div className="relative">
        <p className="font-cinzel text-[34px] text-ink leading-tight">
          {line1}
          {showCursor1 && (
            <span className="inline-block w-[2px] h-[0.9em] bg-gold ml-[1px] align-middle animate-blink" />
          )}
        </p>

        <motion.p
          className="font-cinzel text-[26px] text-gold my-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: line1.length === NAME1.length ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          &amp;
        </motion.p>

        <p className="font-cinzel text-[34px] text-ink leading-tight">
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
          <p className="font-cinzel italic text-[13px] text-muted">Pavilion by Gold, Maldives</p>
        </motion.div>
      )}

      </div>

      {done && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-12 z-[2] flex justify-center px-5 pb-[max(1.35rem,env(safe-area-inset-bottom,0px))] pt-3"
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
