// components/HeroSection.tsx
'use client'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import HeroCandleFlames from './HeroCandleFlames'

/** Narrow no-break gaps so lines don’t split awkwardly between given + family parts. */
const NAME1 = 'Ibrahim Zimam Ahmed\u00A0Zahir'
const NAME2 = 'Yanal Ahmed\u00A0Wafee'
/** Slightly faster for longer names so the sequence still feels lively. */
const CHAR_DELAY = 48

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

const NAME_MAX_PX = 34
const NAME_MIN_PX = 9

/** Single-line fit: shrink font until the line fits the container (client wants no wrapping). */
function fitNameOneLine(el: HTMLElement | null, containerWidth: number) {
  if (!el || containerWidth <= 0) return
  el.style.whiteSpace = 'nowrap'
  el.style.transform = ''
  const text = el.textContent?.trim() ?? ''
  if (text.length === 0) {
    el.style.fontSize = `${NAME_MAX_PX}px`
    return
  }
  let lo = NAME_MIN_PX
  let hi = NAME_MAX_PX
  for (let k = 0; k < 18; k++) {
    const mid = (lo + hi) / 2
    el.style.fontSize = `${mid}px`
    if (el.scrollWidth <= containerWidth) lo = mid
    else hi = mid
  }
  el.style.fontSize = `${lo}px`
  if (el.scrollWidth > containerWidth) {
    el.style.fontSize = `${NAME_MIN_PX}px`
  }
}

export default function HeroSection() {
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [showCursor1, setShowCursor1] = useState(true)
  const [showCursor2, setShowCursor2] = useState(false)
  const [done, setDone] = useState(false)
  const [heroBgSrc, setHeroBgSrc] = useState(HERO_BG_DESKTOP)

  const namesWrapRef = useRef<HTMLDivElement>(null)
  const name1Ref = useRef<HTMLParagraphElement>(null)
  const name2Ref = useRef<HTMLParagraphElement>(null)
  const ampRef = useRef<HTMLParagraphElement>(null)

  const refitHeroNames = useCallback(() => {
    const wrap = namesWrapRef.current
    if (!wrap) return
    const w = wrap.clientWidth
    const secondActive = line2.length > 0 || showCursor2
    fitNameOneLine(name1Ref.current, w)
    if (secondActive) fitNameOneLine(name2Ref.current, w)
    else if (name2Ref.current) {
      name2Ref.current.style.whiteSpace = 'nowrap'
      name2Ref.current.style.fontSize = `${NAME_MAX_PX}px`
    }
    const fs1 = name1Ref.current ? parseFloat(getComputedStyle(name1Ref.current).fontSize) || NAME_MAX_PX : NAME_MAX_PX
    const fs2 =
      secondActive && name2Ref.current
        ? parseFloat(getComputedStyle(name2Ref.current).fontSize) || NAME_MAX_PX
        : NAME_MAX_PX
    const fsBoth = secondActive ? Math.min(fs1, fs2) : fs1
    if (name1Ref.current) name1Ref.current.style.fontSize = `${fsBoth}px`
    if (name2Ref.current && secondActive) name2Ref.current.style.fontSize = `${fsBoth}px`
    if (ampRef.current) {
      ampRef.current.style.fontSize = `${Math.max(15, Math.min(26, fsBoth * 0.58))}px`
    }
  }, [line1, line2, showCursor1, showCursor2])

  useLayoutEffect(() => {
    refitHeroNames()
    const wrap = namesWrapRef.current
    if (!wrap) return
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', refitHeroNames)
      return () => window.removeEventListener('resize', refitHeroNames)
    }
    const ro = new ResizeObserver(() => refitHeroNames())
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [refitHeroNames])

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

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col justify-center px-10 pt-[max(2.35rem,env(safe-area-inset-top,0px))] pb-[max(2.85rem,env(safe-area-inset-bottom,0px))] sm:px-10 translate-y-[min(5vh,2rem)]">
      <motion.p
        className="font-cinzel text-[9px] sm:text-[10px] tracking-[3px] text-muted uppercase mb-5 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Marriage Ceremony
      </motion.p>

      <div
        ref={namesWrapRef}
        className="relative mx-auto w-full max-w-[min(100%,22.5rem)] sm:max-w-[24rem]"
      >
        <p
          ref={name1Ref}
          className="font-cinzel font-medium text-ink tracking-tight leading-tight"
          style={{ fontSize: NAME_MAX_PX }}
        >
          {line1}
          {showCursor1 && (
            <span className="inline-block w-[2px] h-[0.9em] bg-gold ml-[1px] align-middle animate-blink" />
          )}
        </p>

        <motion.p
          ref={ampRef}
          className="font-cinzel text-gold my-1.5 leading-none tracking-tight"
          style={{ fontSize: 26 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: line1.length === NAME1.length ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          &amp;
        </motion.p>

        <p
          ref={name2Ref}
          className="font-cinzel font-medium text-ink tracking-tight leading-tight"
          style={{ fontSize: NAME_MAX_PX }}
        >
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
          className="pointer-events-none absolute inset-x-0 bottom-12 z-[2] flex justify-center px-10 pb-[max(1.35rem,env(safe-area-inset-bottom,0px))] pt-3 sm:px-10"
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
