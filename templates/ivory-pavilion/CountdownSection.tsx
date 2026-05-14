'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInvitationData } from './InvitationDataContext'
import { IvorySectionHeader } from './IvorySectionHeader'

const serif   = { fontFamily: "'Source Serif 4', serif" as const }

// ── Countdown helpers ──────────────────────────────────────────────────────────
function getTargetDate(date: string, year: string, time: string) {
  return new Date(`${date}, ${year} ${time || '00:00'}`)
}

function getCountdown(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00', isPast: true }
  return {
    days:    String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
    hours:   String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
    minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0'),
    seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, '0'),
    isPast: false,
  }
}

// ── Scratch Circle ─────────────────────────────────────────────────────────────
function ScratchCircle({ value, onReveal }: { value: string; onReveal: () => void }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDrawing    = useRef(false)
  const hasRevealed  = useRef(false)
  const [revealed, setRevealed] = useState(false)

  function drawSurface(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    const grad = ctx.createRadialGradient(W * 0.4, H * 0.4, 0, W / 2, H / 2, W / 2)
    grad.addColorStop(0, '#DDD5C8')
    grad.addColorStop(1, '#C4B5A3')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    // Subtle grain
    for (let i = 0; i < 1800; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(80,55,35,${Math.random() * 0.14})`
      ctx.fill()
    }
  }

  useEffect(() => {
    const container = containerRef.current
    const canvas    = canvasRef.current
    if (!container || !canvas) return
    let initialised = false
    const resize = () => {
      const W = container.offsetWidth
      const H = container.offsetHeight
      if (W === 0 || H === 0) return
      if (!initialised) {
        canvas.width  = W
        canvas.height = H
        drawSurface(canvas)
        initialised = true
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    return () => ro.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top)  * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
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
    if (hasRevealed.current) return
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++
    }
    // Only auto-complete when ~80% is scratched (nearly the full circle)
    if (transparent / (canvas.width * canvas.height) > 0.8) {
      hasRevealed.current = true
      revealFully()
    }
  }

  function revealFully() {
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
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
    e.preventDefault()
    isDrawing.current = true
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
    <div
      ref={containerRef}
      className="relative h-[100px] w-[100px] min-h-[100px] min-w-[100px] overflow-hidden rounded-full border-[3px] border-[#C8B99A] bg-[#FAF8F5] shadow-[0_8px_32px_rgba(156,139,120,0.18)]"
    >
      {/* Value underneath */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[1.7rem] font-semibold leading-none text-[#2C2416]" style={serif}>
          {value}
        </span>
      </div>

      {/* Scratch canvas */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />
      )}
    </div>
  )
}

// ── Main section ───────────────────────────────────────────────────────────────
export default function CountdownSection() {
  const data       = useInvitationData()
  const targetDate = useMemo(
    () => getTargetDate(data.weddingDate, data.weddingYear, data.weddingTime),
    [data.weddingDate, data.weddingYear, data.weddingTime],
  )

  const [countdown, setCountdown]         = useState({ days: '00', hours: '00', minutes: '00', seconds: '00', isPast: false })
  const [revealedCount, setRevealedCount] = useState(0)
  const allRevealed = revealedCount >= 3

  useEffect(() => {
    const update = () => setCountdown(getCountdown(targetDate))
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [targetDate])

  const handleReveal = () => setRevealedCount(c => c + 1)

  // weddingDate is "September 14"
  const parts      = (data.weddingDate ?? '').split(' ')
  const monthShort = (parts[0] ?? '—').slice(0, 3).toUpperCase()
  const dayNum     = parts[1] ?? '—'
  const yearVal    = data.weddingYear ?? '—'

  const tiles = [
    { label: 'Days',    value: countdown.days    },
    { label: 'Hours',   value: countdown.hours   },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ]

  return (
    <section className="relative overflow-hidden bg-[#EDE9E3] px-5 py-20" style={serif}>
      <div className="relative mx-auto max-w-lg text-center">
        <IvorySectionHeader eyebrow="The big day" title="A date worth waiting for" />

        <p className="mt-8 text-[11px] uppercase tracking-[0.32em] text-[#827B6F]/70" style={serif}>
          ✦ scratch each circle to reveal ✦
        </p>

        {/* Three scratch circles */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <ScratchCircle value={dayNum}     onReveal={handleReveal} />
          <ScratchCircle value={monthShort} onReveal={handleReveal} />
          <ScratchCircle value={yearVal}    onReveal={handleReveal} />
        </div>

        {allRevealed && (
          <p className="mt-5 text-[10px] uppercase tracking-[0.38em] text-[#827B6F]/55" style={serif}>
            {data.weddingDay} · {data.weddingTime}
          </p>
        )}

        {/* Divider */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#C8B99A]/30" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#827B6F]/40" style={serif}>counting down</span>
          <div className="h-px flex-1 bg-[#C8B99A]/30" />
        </div>

        {/* Countdown — blurred until all circles revealed */}
        <div
          className="transition-all duration-700"
          style={{
            filter:        allRevealed ? 'none' : 'blur(8px)',
            opacity:       allRevealed ? 1 : 0.3,
            pointerEvents: allRevealed ? 'auto' : 'none',
            userSelect:    allRevealed ? 'auto' : 'none',
          }}
        >
          {countdown.isPast ? (
            <p className="text-[clamp(1.8rem,5vw,2.4rem)] text-[#827B6F]" style={serif}>
              The celebration has begun
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {tiles.map((tile) => (
                <div key={tile.label} className="flex flex-col items-center rounded-[1.5rem] border border-white/70 bg-[#FAF8F5] px-1 py-4 text-center shadow-[0_22px_60px_rgba(156,139,120,0.12)]">
                  <div
                    className="tabular-nums text-[clamp(1.5rem,4.5vw,2.4rem)] font-semibold leading-none text-[#2C2416]"
                    style={serif}
                    suppressHydrationWarning
                  >
                    {tile.value}
                  </div>
                  <span className="mt-2 block text-[8px] uppercase tracking-[0.3em] text-[#827B6F]/60" style={serif}>
                    {tile.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
