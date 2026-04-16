'use client'
import { useEffect, useRef } from 'react'

/** Three flames (center + sides) — same motion + shapes as `Candelabra`, sized for hero overlay */
const FLAMES = [
  { id: 'c', cx: 100, cy: 36, delay: 0 },
  { id: 'l', cx: 81, cy: 46, delay: 0.37 },
  { id: 'r', cx: 118, cy: 46, delay: 0.74 },
] as const

function flameSize(id: string) {
  if (id === 'c') return { outerR: 8, innerR: 5, glowR: 7 }
  return { outerR: 7, innerR: 4, glowR: 5.5 }
}

export default function HeroCandleFlames({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    FLAMES.forEach((c) => {
      svg.querySelectorAll(`[data-hero-flame="${c.id}"]`).forEach((el) => {
        ;(el as HTMLElement).style.animationDelay = `${c.delay}s`
      })
    })
  }, [])

  return (
    <svg ref={svgRef} viewBox="0 0 200 52" fill="none" className={className} aria-hidden>
      <defs>
        <filter id="heroCFlame">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="heroCGlow">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="heroFgC" x1="100" y1="14" x2="100" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffef5" />
          <stop offset="45%" stopColor="#fff3c8" />
          <stop offset="100%" stopColor="#ffd89a" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="heroFgM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffef5" />
          <stop offset="100%" stopColor="#ffe4a8" stopOpacity="0.68" />
        </linearGradient>
      </defs>

      {FLAMES.map((c) => {
        const { outerR, innerR, glowR } = flameSize(c.id)
        const grad = c.id === 'c' ? 'url(#heroFgC)' : 'url(#heroFgM)'
        const top = c.cy - outerR * 1.1
        return (
          <g key={c.id}>
            <circle
              data-hero-flame={c.id}
              className="animate-flGlow"
              cx={c.cx}
              cy={c.cy}
              r={glowR}
              fill="rgba(255,238,210,0.32)"
              filter="url(#heroCGlow)"
            />
            <path
              data-hero-flame={c.id}
              className="animate-flOut"
              filter="url(#heroCFlame)"
              style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              d={`M${c.cx} ${top} C${c.cx - outerR * 0.7} ${c.cy - outerR * 0.4} ${c.cx - outerR} ${c.cy} ${c.cx - outerR * 0.3} ${c.cy + outerR * 0.2} C${c.cx} ${c.cy + outerR * 0.4} ${c.cx} ${c.cy + outerR * 0.4} ${c.cx} ${c.cy + outerR * 0.4} C${c.cx} ${c.cy + outerR * 0.4} ${c.cx + outerR * 0.3} ${c.cy + outerR * 0.2} ${c.cx + outerR * 0.3} ${c.cy} C${c.cx + outerR} ${c.cy - outerR * 0.4} ${c.cx + outerR * 0.7} ${top} ${c.cx} ${top}Z`}
              fill={grad}
            />
            <path
              data-hero-flame={c.id}
              className="animate-flIn"
              filter="url(#heroCFlame)"
              style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              d={`M${c.cx} ${c.cy - innerR * 1.5} C${c.cx - innerR * 0.5} ${c.cy - innerR * 0.5} ${c.cx - innerR * 0.6} ${c.cy + innerR * 0.3} ${c.cx} ${c.cy + innerR * 0.5} C${c.cx + innerR * 0.6} ${c.cy + innerR * 0.3} ${c.cx + innerR * 0.5} ${c.cy - innerR * 0.5} ${c.cx} ${c.cy - innerR * 1.5}Z`}
              fill="rgba(255,252,245,0.98)"
            />
          </g>
        )
      })}
    </svg>
  )
}
