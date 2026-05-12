'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInvitationData } from '../arabic-moorish/InvitationDataContext'
import { useRivieraLang } from './LanguageContext'

const sbs = { fontFamily: "'Caveat', cursive" }
const sat = { fontFamily: "'Satisfy', cursive" }

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

// ── Scratch card ──────────────────────────────────────────────────────────────
function ScratchCard({ dateString, onReveal }: { dateString: string; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDrawing = useRef(false)
  const hasStarted = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)

  function drawSurface(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#BDD0E4')
    grad.addColorStop(0.5, '#A8C0D8')
    grad.addColorStop(1, '#BDD0E4')
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = grad
    ctx.roundRect(0, 0, W, H, 12)
    ctx.fill()

    // Grain noise
    for (let i = 0; i < 2000; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 0.8, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(100,80,50,${Math.random() * 0.18})`
      ctx.fill()
    }

    // Hint text centred
    ctx.fillStyle = 'rgba(28,43,74,0.55)'
    ctx.font = `15px 'Caveat', cursive`
    ctx.textAlign = 'center'
    ctx.fillText('✦  scratch to reveal  ✦', W / 2, H / 2 + 5)
  }

  // Measure container and size canvas to match — runs after paint
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const resize = () => {
      const W = container.offsetWidth
      const H = container.offsetHeight
      if (W === 0 || H === 0) return
      canvas.width = W
      canvas.height = H
      drawSurface(canvas)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    return () => ro.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  function scratch(x: number, y: number) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 22, 0, Math.PI * 2)
    ctx.fill()
  }

  function checkReveal() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++
    }
    if (transparent / (canvas.width * canvas.height) > 0.5) revealFully()
  }

  function revealFully() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let opacity = 1
    const fade = () => {
      opacity -= 0.07
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (opacity > 0) {
        ctx.globalAlpha = opacity
        ctx.globalCompositeOperation = 'source-over'
        requestAnimationFrame(fade)
      } else {
        setRevealed(true)
        onReveal()
      }
    }
    requestAnimationFrame(fade)
  }

  function onStart(e: React.MouseEvent | React.TouchEvent) {
    if (revealed) return
    isDrawing.current = true
    if (!hasStarted.current) { hasStarted.current = true; setHintVisible(false) }
    const { x, y } = getPos(e)
    scratch(x, y)
  }
  function onMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current || revealed) return
    e.preventDefault()
    const { x, y } = getPos(e)
    scratch(x, y)
    checkReveal()
  }
  function onEnd() { isDrawing.current = false }

  return (
    <div ref={containerRef} className="relative mb-10 min-h-[72px] overflow-hidden rounded-xl">
      {/* Date text underneath the scratch surface */}
      <div className="flex h-full min-h-[72px] items-center justify-center px-4 py-5 text-center">
        <p className="text-[18px] font-light tracking-[0.15em] text-[#1C2B4A]" style={sbs}>
          {dateString || 'Saturday  ·  27 June 2026  ·  19:00'}
        </p>
      </div>

      {/* Canvas scratch overlay */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair rounded-xl"
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />
      )}

      {/* Ping ring hint */}
      {hintVisible && !revealed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="animate-ping absolute h-8 w-8 rounded-full bg-[#6B8FBF]/30" />
        </div>
      )}
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function EventDateSection() {
  const data = useInvitationData()
  const { t } = useRivieraLang()
  const targetTime = useMemo(
    () => getTargetTime(data.weddingDate, data.weddingYear, data.weddingTime),
    [data.weddingDate, data.weddingYear, data.weddingTime],
  )

  const [mounted, setMounted]     = useState(false)
  const [timeLeft, setTimeLeft]   = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [dateRevealed, setDateRevealed] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
      setTimeLeft(calculateTimeLeft(targetTime))
    })
    const interval = window.setInterval(() => setTimeLeft(calculateTimeLeft(targetTime)), 1000)
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(interval) }
  }, [targetTime])

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
    <section className="relative overflow-hidden bg-[#F5F7FA] px-6 py-16">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-72 bg-right bg-no-repeat opacity-[0.07]"
        style={{ backgroundImage: "url('/templates/riviera-dreams/frame-2.png')", backgroundSize: 'contain' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-lg">
        <p className="mb-8 text-center text-[10px] uppercase tracking-[0.5em] text-[#6B8FBF]" style={sbs}>
          our wedding day
        </p>

        <ScratchCard dateString={dateString} onReveal={() => setDateRevealed(true)} />

        {/* Divider + countdown — blurred until date is revealed */}
        <div
          className="transition-all duration-700"
          style={{
            filter: dateRevealed ? 'none' : 'blur(6px)',
            opacity: dateRevealed ? 1 : 0.35,
            pointerEvents: dateRevealed ? 'auto' : 'none',
            userSelect: dateRevealed ? 'auto' : 'none',
          }}
        >
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#6B8FBF]/20" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#6B8FBF]/50" style={sbs}>counting down</span>
            <div className="h-px flex-1 bg-[#6B8FBF]/20" />
          </div>

          <div className="flex items-end justify-center gap-0">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-end">
                <div className="flex flex-col items-center border-2 border-[#6B8FBF]/30 rounded-2xl px-4 py-3">
                  <span className="text-[48px] font-light leading-none text-[#1C2B4A]" style={sat} suppressHydrationWarning>
                    {mounted ? unit.value : '00'}
                  </span>
                  <span className="mt-1.5 text-[9px] uppercase tracking-[0.4em] text-[#6B8FBF]" style={sbs}>
                    {unit.label}
                  </span>
                </div>
                {i < units.length - 1 && (
                  <span className="mb-[14px] px-2 text-[24px] font-light leading-none text-[#6B8FBF]/35" style={sbs} aria-hidden>:</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
