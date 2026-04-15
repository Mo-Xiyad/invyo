// components/ScratchReveal.tsx
'use client'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import CornerOrnament from './CornerOrnament'

// Candle wick positions in the SVG's native 1054×1492 coordinate space.
// Derived from pixel analysis of the rendered artwork (orange-flame centroids + ~40 SVG units down).
const SVG_W = 1054
const SVG_H = 1492
const CANDLE_FLAMES: { svgX: number; svgY: number; scale: number; delay: number }[] = [
  { svgX:  212, svgY:  1065, scale: 0.85, delay: 0.55 }, // left group
  { svgX: 265, svgY:  1120, scale: 0.85, delay: 0.00 }, // back-tall candle
  { svgX: 313, svgY:  1325, scale: 1.00, delay: 0.30 }, // tallest candle
  { svgX: 230, svgY: 1385, scale: 0.85, delay: 0.90 }, // right-mid candle
  // { svgX: 340, svgY: 1255, scale: 0.65, delay: 1.20 }, // right small candle
]

/** Public asset — rasterized onto the scratch canvas (cover). */
const SCRATCH_TEXTURE_SRC = '/assets/scratch-to-reveal.svg'
/** Monogram on top of scratch layer (transparent PNG, no plate behind it). */
const SEAL_ART_SRC = '/assets/Elegant-gold-wax-seal-monogram.png'
/** Full scratch-card backdrop (replaces parchment + card-grid on #scratch-wrapper). */
const SCRATCH_CARD_BG_SRC = '/assets/Elegant-vintage-floral-stationery-design.png'

interface Props {
  onRevealed: () => void
  onOpen: () => void
}

/** Stable % layout for gold-dust sparkles — z above seal so they show through scratched canvas & on the monogram. */
const SCRATCH_DUST_SPECS = Array.from({ length: 36 }, (_, i) => {
  const left = ((i * 37 + 7) % 86) + 7
  const top = ((i * 29 + 13) % 80) + 10
  const s = 2.8 + (i % 5) * 0.75
  const delay = -((i * 0.31) % 4.2)
  const dur = 2.35 + (i % 7) * 0.26
  return { left, top, s, delay, dur }
})

function drawTextureCover(ctx: CanvasRenderingContext2D, W: number, H: number, img: HTMLImageElement) {
  // SVGs sometimes report 0×0 until decode; match asset viewBox 0 0 1054 1492.
  const iw = img.naturalWidth || img.width || 1054
  const ih = img.naturalHeight || img.height || 1492
  const scale = Math.max(W / iw, H / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (W - dw) / 2
  const dy = (H - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

export default function ScratchReveal({ onRevealed, onOpen }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const scratching   = useRef(false)
  const revealed     = useRef(false)
  const scratchCount = useRef(0)
  const [showHint,      setShowHint]      = useState(false)
  const [showOpen,      setShowOpen]      = useState(false)
  const [canvasVisible, setCanvasVisible] = useState(true)
  const [progress,      setProgress]      = useState(0)
  const [texture,      setTexture]       = useState<HTMLImageElement | null>(null)
  const [textureFailed, setTextureFailed] = useState(false)
  // Computed on-screen pixel positions of each candle flame, updated on resize.
  const [flamePositions, setFlamePositions] = useState<{ x: number; y: number; scale: number; delay: number }[]>([])
  /** Scratch cleared — seal becomes the tap target (canvas is inactive). */
  const [sealInteractive, setSealInteractive] = useState(false)
  /** Bumps on each seal tap so the one-shot `animate-sealTap` replays. */
  const [sealTapKey, setSealTapKey] = useState(0)

  useEffect(() => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => setTexture(img)
    img.onerror = () => setTextureFailed(true)
    img.src = SCRATCH_TEXTURE_SRC
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [])

  useEffect(() => {
    const seal = new Image()
    seal.src = SEAL_ART_SRC
    const cardBg = new Image()
    cardBg.src = SCRATCH_CARD_BG_SRC
  }, [])

  // Re-compute flame overlay positions whenever the canvas is resized.
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const compute = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      if (!W || !H) return
      // Same cover-scale logic as drawTextureCover
      const scale = Math.max(W / SVG_W, H / SVG_H)
      const dx = (W - SVG_W * scale) / 2
      const dy = (H - SVG_H * scale) / 2
      setFlamePositions(
        CANDLE_FLAMES.map((c) => ({
          x: dx + c.svgX * scale,
          y: dy + c.svgY * scale,
          scale: c.scale,
          delay: c.delay,
        }))
      )
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  const drawProceduralFallback = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0,   '#dfc898')
    grad.addColorStop(0.3, '#f0e0b0')
    grad.addColorStop(0.5, '#f8eecc')
    grad.addColorStop(0.7, '#f0e0b0')
    grad.addColorStop(1,   '#d8b880')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Diagonal shimmer lines
    ctx.save()
    ctx.globalAlpha = 0.11
    ctx.strokeStyle = '#fff8e0'
    ctx.lineWidth = 1
    for (let i = -H; i < W + H; i += 14) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke()
    }
    ctx.restore()

    // Fine crosshatch
    ctx.save()
    ctx.globalAlpha = 0.055
    ctx.strokeStyle = '#8a6020'
    ctx.lineWidth = 0.5
    for (let i = 0; i < W; i += 6) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke() }
    for (let j = 0; j < H; j += 6) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(W,j); ctx.stroke() }
    ctx.restore()

    // Vignette
    const vig = ctx.createRadialGradient(W/2, H/2, H*0.25, W/2, H/2, H*0.8)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(100,60,0,0.18)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)

    // Outer borders
    ctx.save()
    ctx.strokeStyle = 'rgba(180,130,50,0.5)'; ctx.lineWidth = 1.5
    ctx.strokeRect(10, 10, W - 20, H - 20)
    ctx.strokeStyle = 'rgba(180,130,50,0.25)'; ctx.lineWidth = 1
    ctx.strokeRect(14, 14, W - 28, H - 28)
    ctx.restore()

  }, [])

  const paintCoating = useCallback(
    (ctx: CanvasRenderingContext2D, W: number, H: number) => {
      if (texture && texture.complete) {
        drawTextureCover(ctx, W, H, texture)
        return
      }
      if (textureFailed) {
        drawProceduralFallback(ctx, W, H)
        return
      }
      // Texture still loading — opaque placeholder so nothing shows through early.
      ctx.fillStyle = '#dfc898'
      ctx.fillRect(0, 0, W, H)
    },
    [texture, textureFailed, drawProceduralFallback],
  )

  // After layout so offsetWidth/Height are non-zero; redraw if viewport resizes (coating resets — rare).
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const paint = () => {
      const dpr = window.devicePixelRatio || 1
      const W = Math.max(1, Math.round(canvas.offsetWidth))
      const H = Math.max(1, Math.round(canvas.offsetHeight))
      canvas.width = W * dpr
      canvas.height = H * dpr
      const ctx = canvas.getContext('2d')!
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      paintCoating(ctx, W, H)
    }

    paint()
    window.addEventListener('resize', paint)
    return () => window.removeEventListener('resize', paint)
  }, [paintCoating])

  const getPercent = useCallback((): number => {
    const canvas = canvasRef.current
    if (!canvas) return 0
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < data.length; i += 4) if (data[i] < 128) transparent++
    return (transparent / (canvas.width * canvas.height / dpr / dpr)) * 100
  }, [])

  const triggerReveal = useCallback(() => {
    if (revealed.current) return
    revealed.current = true
    setSealInteractive(true)
    setCanvasVisible(false)
    setProgress(100)
    setTimeout(() => {
      setShowHint(true)
      spawnSparkles()
      onRevealed()
    }, 800)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRevealed])

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    if (revealed.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const x = clientX - rect.left
    const y = clientY - rect.top
    const ctx = canvas.getContext('2d')!
    // Context is already scaled by dpr in paint(); scratch in CSS pixel space (same as drawCoating W/H).
    ctx.globalCompositeOperation = 'destination-out'
    const g = ctx.createRadialGradient(x, y, 0, x, y, 26)
    g.addColorStop(0, 'rgba(0,0,0,1)')
    g.addColorStop(0.6, 'rgba(0,0,0,0.9)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, 26, 0, Math.PI * 2)
    ctx.fill()

    scratchCount.current++
    if (scratchCount.current % 6 === 0) {
      const pct = getPercent()
      setProgress(Math.min(99, pct * 2.2))
      if (pct > 45) triggerReveal()
    }
  }, [getPercent, triggerReveal])

  function spawnSparkles(mode: 'reveal' | 'tap' = 'reveal') {
    if (
      mode === 'tap' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const seal    = document.getElementById('wax-seal')
    const wrapper = document.getElementById('scratch-wrapper')
    if (!seal || !wrapper) return
    const sr = seal.getBoundingClientRect()
    const wr = wrapper.getBoundingClientRect()
    const cx = sr.left - wr.left + sr.width  / 2
    const cy = sr.top  - wr.top  + sr.height / 2
    const colors = ['#c9a96e','#f5e6c8','#e0b860','#fff4aa']
    const count = mode === 'reveal' ? 18 : 10
    const distLo = mode === 'reveal' ? 50 : 28
    const distHi = mode === 'reveal' ? 110 : 72
    for (let i = 0; i < count; i++) {
      const sp    = document.createElement('div')
      const size  = mode === 'reveal' ? 3 + Math.random() * 5 : 2 + Math.random() * 4
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35
      const dist  = distLo + Math.random() * (distHi - distLo)
      const dur   = mode === 'reveal' ? 0.6 + Math.random() * 0.5 : 0.35 + Math.random() * 0.35
      sp.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${cx - size/2}px;top:${cy - size/2}px;
        background:${colors[i % colors.length]};
        --tx:${Math.cos(angle)*dist}px;--ty:${Math.sin(angle)*dist}px;
        animation:sparkleAnim ${dur}s ${Math.random()*0.12}s linear forwards;
      `
      wrapper.appendChild(sp)
      setTimeout(() => sp.remove(), Math.ceil(dur * 1000) + 400)
    }
  }

  const handleTapSeal = () => {
    setSealTapKey((k) => k + 1)
    spawnSparkles('tap')
    if (!revealed.current) {
      triggerReveal()
      return
    }
    setShowOpen(true)
    setTimeout(onOpen, 700)
  }

  const onMouseDown = (e: React.MouseEvent) => { scratching.current = true;  scratchAt(e.clientX, e.clientY) }
  const onMouseMove = (e: React.MouseEvent) => { if (scratching.current) scratchAt(e.clientX, e.clientY) }
  const onMouseUp   = () => { scratching.current = false }

  const onTouchStart = (e: React.TouchEvent) => { scratching.current = true;  scratchAt(e.touches[0].clientX, e.touches[0].clientY) }
  const onTouchMove  = (e: React.TouchEvent) => { if (scratching.current) scratchAt(e.touches[0].clientX, e.touches[0].clientY) }
  const onTouchEnd   = () => { scratching.current = false }

  return (
    <div
      id="scratch-wrapper"
      className="relative h-full w-full origin-center overflow-hidden bg-cover bg-center bg-no-repeat animate-scratchLive will-change-transform"
      style={{ backgroundImage: `url(${SCRATCH_CARD_BG_SRC})` }}
    >
      <div className="gold-border" />
      <div className="gold-border-inner" />

      <CornerOrnament className="top-2 left-2 z-[3]" />
      <CornerOrnament className="top-2 right-2 z-[3] scale-x-[-1]" />
      <CornerOrnament className="bottom-2 left-2 z-[3] scale-y-[-1]" />
      <CornerOrnament className="bottom-2 right-2 z-[3] [transform:scale(-1)]" />

      {/* Ambient motion (vignette + light sweep) — under canvas, like subtle video / lamp drift */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden
      >
        <div
          className="animate-scratchVignette absolute inset-0 mix-blend-multiply"
          style={{
            background:
              'radial-gradient(ellipse 78% 68% at 50% 44%, transparent 32%, rgba(42,24,8,0.22) 100%)',
          }}
        />
        <div className="absolute inset-y-[-8%] left-[-70%] w-[240%] animate-scratchSheen">
          <div
            className="h-full w-full"
            style={{
              background:
                'linear-gradient(102deg, transparent 0%, rgba(255,248,225,0) 44%, rgba(255,252,238,0.5) 50%, rgba(255,248,225,0) 56%, transparent 100%)',
              filter: 'blur(10px)',
            }}
          />
        </div>
      </div>

      {/* Gold-dust twinkle — z-[9] above seal z-[8] so sparkles show through scratch holes & on wax seal; still under canvas z-10 */}
      <div
        className="scratch-dust-layer pointer-events-none absolute inset-0 z-[9] overflow-hidden"
        aria-hidden
      >
        {SCRATCH_DUST_SPECS.map((p, i) => (
          <span
            key={i}
            className="scratch-dust-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              ['--dust-s' as string]: `${p.s}px`,
              ['--dust-delay' as string]: `${p.delay}s`,
              ['--dust-dur' as string]: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Monogram sits under the scratch canvas — visible through scratched-away coating */}
      <div className="pointer-events-none absolute inset-0 z-[8] flex flex-col items-center justify-center px-4">
        {/* Hint is position:absolute so it does not change vertical centering when it mounts after reveal */}
        <div className="relative w-[min(94vw,26rem)] max-h-[min(58vh,30rem)] shrink-0 animate-sealFloat">
          <button
            type="button"
            id="wax-seal"
            onClick={handleTapSeal}
            aria-label={sealInteractive ? 'Tap to open invitation' : 'Scratch the coating to reveal the seal'}
            className={`flex w-full flex-col items-center border-0 bg-transparent p-0 ${
              sealInteractive ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
            }`}
          >
            <span
              key={sealTapKey}
              className={`mx-auto inline-block origin-center will-change-transform ${sealTapKey > 0 ? 'animate-sealTap' : ''}`}
            >
              <img
                src={SEAL_ART_SRC}
                alt=""
                width={520}
                height={520}
                decoding="async"
                draggable={false}
                className="mx-auto h-auto max-h-[min(46vh,24rem)] w-full max-w-[min(94vw,24rem)] object-contain object-center select-none"
                style={{
                  filter:
                    'drop-shadow(0 10px 28px rgba(42,24,8,0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
                }}
              />
            </span>
          </button>
          {showHint && (
            <div className="pointer-events-none absolute left-0 right-0 top-full z-[1] mt-1.5 text-center animate-hintPulse">
              <p className="font-cinzel text-[8px] tracking-[4px] text-muted uppercase">Tap the seal to open</p>
              <span className="text-gold text-sm mt-0.5 block">✦</span>
            </div>
          )}
        </div>
      </div>

      {/* Animated candle flame overlays — only while scratch canvas is visible; fade out with it */}
      <div
        className="pointer-events-none absolute inset-0 z-[11] transition-opacity duration-700"
        style={{ opacity: canvasVisible ? 1 : 0 }}
        aria-hidden
      >
        {flamePositions.map((fp, i) => {
          const sz    = 22 * fp.scale   // outer flame width/height base
          const inner = 10 * fp.scale   // inner bright core size
          return (
            <span
              key={i}
              className="absolute"
              style={{
                left: fp.x,
                top:  fp.y,
                width:  sz,
                height: sz * 1.6,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {/* dark base — covers the static painted flame; anchored at wick, extends downward only */}
              <span
                className="absolute"
                style={{
                  top: '85%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width:  '220%',
                  height: '90%',
                  background: 'radial-gradient(ellipse 55% 60% at 50% 0%, rgba(18,8,2,0.92) 0%, transparent 100%)',
                  filter: 'blur(2.5px)',
                }}
              />
              {/* outer flame — glow baked in via large blur */}
              <span
                className="absolute inset-0 animate-flOut"
                style={{
                  animationDelay: `${fp.delay}s`,
                  transformOrigin: 'center 85%',
                  background: `radial-gradient(ellipse 55% 100% at 50% 85%,
                    rgba(255,252,200,0.95) 0%,
                    rgba(255,180,30,0.88) 38%,
                    rgba(220,80,10,0.65) 68%,
                    rgba(180,50,5,0.2)   86%,
                    transparent 100%)`,
                  borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
                  filter: `blur(1.5px) drop-shadow(0 0 ${sz * 0.5}px rgba(255,160,20,0.5))`,
                }}
              />
              {/* inner bright core */}
              <span
                className="absolute animate-flIn"
                style={{
                  animationDelay: `${fp.delay + 0.15}s`,
                  width:  inner,
                  height: inner * 1.4,
                  left: '28%',
                  bottom: '8%',
                  transform: 'translateX(-50%)',
                  transformOrigin: 'center bottom',
                  background: 'radial-gradient(ellipse 60% 100% at 50% 90%, #fffde0 0%, rgba(255,240,100,0.9) 45%, transparent 100%)',
                  borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
                }}
              />
            </span>
          )
        })}
      </div>

      {/* Scratch coating (SVG on canvas) — full surface, above seal */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 h-full w-full touch-none cursor-crosshair transition-opacity duration-700"
        style={{ opacity: canvasVisible ? 1 : 0, pointerEvents: revealed.current ? 'none' : 'auto' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Progress bar while scratching — no overlay copy until reveal */}
      {!revealed.current && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-[16] -translate-x-1/2 text-center">
          <div className="mx-auto mb-1 h-[3px] w-28 overflow-hidden rounded-full bg-gold/20">
            <div className="h-full rounded-full bg-gold transition-[width] duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Card-open flash overlay */}
      {showOpen && (
        <div className="absolute inset-0 bg-parchment z-20 animate-fadeIn" />
      )}
    </div>
  )
}
