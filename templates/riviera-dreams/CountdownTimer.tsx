'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInvitationData } from '../arabic-moorish/InvitationDataContext'
import { useRivieraLang } from './LanguageContext'

const sbs = { fontFamily: "'Amarna', serif" }

function getTargetTime(weddingDate: string, weddingYear: string, weddingTime: string) {
  const parsed = new Date(`${weddingDate}, ${weddingYear} ${weddingTime || '19:00'}`)
  if (!Number.isNaN(parsed.getTime())) return parsed.getTime()
  return new Date('2026-06-27T19:00:00').getTime()
}

function calculateTimeLeft(targetTime: number) {
  const diff = targetTime - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function EventDateSection() {
  const data = useInvitationData()
  const { t } = useRivieraLang()
  const targetTime = useMemo(
    () => getTargetTime(data.weddingDate, data.weddingYear, data.weddingTime),
    [data.weddingDate, data.weddingYear, data.weddingTime],
  )

  const [mounted, setMounted]   = useState(false)
  const [swept, setSwept]       = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  // Start countdown
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
      setTimeLeft(calculateTimeLeft(targetTime))
    })
    const interval = window.setInterval(() => setTimeLeft(calculateTimeLeft(targetTime)), 1000)
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(interval) }
  }, [targetTime])

  // Sand sweep triggers when section enters viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSwept(true); observer.disconnect() } },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const units = [
    { label: 'Days',  value: String(timeLeft.days).padStart(2, '0') },
    { label: 'Hrs',   value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Min',   value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Sec',   value: String(timeLeft.seconds).padStart(2, '0') },
  ]

  const dateString = [data.weddingDay, t(data.weddingDate, data.lang2Date || undefined), data.weddingYear, data.weddingTime]
    .filter(Boolean)
    .join('  ·  ')

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F5F7FA] px-6 py-16"
    >
      {/* Subtle frame-2 background watermark */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-72 bg-right bg-no-repeat opacity-[0.07]"
        style={{ backgroundImage: "url('/templates/riviera-dreams/frame-2.png')", backgroundSize: 'contain' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-lg">

        {/* Label */}
        <p className="mb-8 text-center text-[10px] uppercase tracking-[0.5em] text-[#6B8FBF]" style={sbs}>
          our wedding day
        </p>

        {/* ── Date row with sand sweep reveal ── */}
        <div className="relative mb-10 overflow-hidden rounded-xl py-4 text-center">
          {/* The actual date text */}
          <p className="text-[18px] font-light tracking-[0.15em] text-[#1C2B4A]" style={sbs}>
            {dateString || 'Saturday  ·  27 June 2026  ·  19:00'}
          </p>

          {/* Sand overlay — sweeps right when triggered */}
          <div
            className={`absolute inset-0 rounded-xl transition-transform ease-in-out ${
              swept ? 'sbs-sand-swept' : ''
            }`}
            style={{
              background: 'linear-gradient(105deg, #BDD0E4 0%, #A8C0D8 45%, #BDD0E4 100%)',
              transitionDuration: '1.1s',
            }}
            aria-hidden
          />
          {/* Sand texture grain */}
          <div
            className={`absolute inset-0 rounded-xl opacity-40 transition-transform ease-in-out ${
              swept ? 'sbs-sand-swept' : ''
            }`}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'0.6\' fill=\'%23a09070\' opacity=\'0.4\'/%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'0.5\' fill=\'%23a09070\' opacity=\'0.3\'/%3E%3C/svg%3E")',
              transitionDuration: '1.1s',
              transitionDelay: '0.05s',
            }}
            aria-hidden
          />
        </div>

        {/* Thin divider */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#6B8FBF]/20" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#6B8FBF]/50" style={sbs}>counting down</span>
          <div className="h-px flex-1 bg-[#6B8FBF]/20" />
        </div>

        {/* ── Countdown row — typographic, no boxes ── */}
        <div className="flex items-end justify-center gap-0">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-end">
              <div className="flex flex-col items-center border-2 border-[#6B8FBF]/30 rounded-2xl px-4 py-3">
                <span
                  className="text-[48px] font-light leading-none text-[#1C2B4A]"
                  style={sbs}
                  suppressHydrationWarning
                >
                  {mounted ? unit.value : '00'}
                </span>
                <span
                  className="mt-1.5 text-[9px] uppercase tracking-[0.4em] text-[#6B8FBF]"
                  style={sbs}
                >
                  {unit.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span
                  className="mb-[14px] px-2 text-[24px] font-light leading-none text-[#6B8FBF]/35"
                  style={sbs}
                  aria-hidden
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
