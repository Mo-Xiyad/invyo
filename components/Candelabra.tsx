// components/Candelabra.tsx
'use client'
import { useEffect, useRef } from 'react'

const CANDLES = [
  { id: 'c',  cx: 70,  cy: 17, candleH: 22, bocheRx: 9,   delay: 0    },
  { id: 'l',  cx: 40,  cy: 28, candleH: 18, bocheRx: 7,   delay: 0.37 },
  { id: 'r',  cx: 100, cy: 28, candleH: 18, bocheRx: 7,   delay: 0.74 },
  { id: 'fl', cx: 18,  cy: 46, candleH: 15, bocheRx: 6,   delay: 1.11 },
  { id: 'fr', cx: 122, cy: 46, candleH: 15, bocheRx: 6,   delay: 1.48 },
]

function flameSize(id: string) {
  if (id === 'c')              return { outerR: 8, innerR: 5, glowR: 7 }
  if (id === 'l' || id === 'r') return { outerR: 7, innerR: 4, glowR: 5.5 }
  return { outerR: 6, innerR: 3.5, glowR: 4.5 }
}

export default function Candelabra({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    CANDLES.forEach((c) => {
      svg.querySelectorAll(`[data-candle="${c.id}"]`).forEach((el) => {
        ;(el as HTMLElement).style.animationDelay = `${c.delay}s`
      })
    })
  }, [])

  return (
    <svg ref={svgRef} viewBox="0 0 140 170" fill="none" className={className}>
      <defs>
        <filter id="cFlame">
          <feGaussianBlur stdDeviation="1.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="cGlow">
          <feGaussianBlur stdDeviation="3.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="fgC" x1="70" y1="8"  x2="70" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#fff4aa"/>
          <stop offset="55%"  stopColor="#ffb830"/>
          <stop offset="100%" stopColor="#e05010" stopOpacity="0.6"/>
        </linearGradient>
        <linearGradient id="fgM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff4aa"/>
          <stop offset="100%" stopColor="#ffb830" stopOpacity="0.75"/>
        </linearGradient>
        <linearGradient id="fgS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff4aa"/>
          <stop offset="100%" stopColor="#ffa020" stopOpacity="0.55"/>
        </linearGradient>
      </defs>

      {CANDLES.map((c) => {
        const { outerR, innerR, glowR } = flameSize(c.id)
        const grad = c.id === 'c' ? 'url(#fgC)' : (c.id === 'l' || c.id === 'r') ? 'url(#fgM)' : 'url(#fgS)'
        const top = c.cy - outerR * 1.1
        return (
          <g key={c.id}>
            {/* glow halo */}
            <circle data-candle={c.id} className="animate-flGlow"
              cx={c.cx} cy={c.cy} r={glowR}
              fill="rgba(255,200,60,0.22)" filter="url(#cGlow)"/>
            {/* outer flame */}
            <path data-candle={c.id} className="animate-flOut" filter="url(#cFlame)"
              style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              d={`M${c.cx} ${top} C${c.cx-outerR*0.7} ${c.cy-outerR*0.4} ${c.cx-outerR} ${c.cy} ${c.cx-outerR*0.3} ${c.cy+outerR*0.2} C${c.cx} ${c.cy+outerR*0.4} ${c.cx} ${c.cy+outerR*0.4} ${c.cx} ${c.cy+outerR*0.4} C${c.cx} ${c.cy+outerR*0.4} ${c.cx+outerR*0.3} ${c.cy+outerR*0.2} ${c.cx+outerR*0.3} ${c.cy} C${c.cx+outerR} ${c.cy-outerR*0.4} ${c.cx+outerR*0.7} ${top} ${c.cx} ${top}Z`}
              fill={grad}/>
            {/* inner bright core */}
            <path data-candle={c.id} className="animate-flIn" filter="url(#cFlame)"
              style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              d={`M${c.cx} ${c.cy-innerR*1.5} C${c.cx-innerR*0.5} ${c.cy-innerR*0.5} ${c.cx-innerR*0.6} ${c.cy+innerR*0.3} ${c.cx} ${c.cy+innerR*0.5} C${c.cx+innerR*0.6} ${c.cy+innerR*0.3} ${c.cx+innerR*0.5} ${c.cy-innerR*0.5} ${c.cx} ${c.cy-innerR*1.5}Z`}
              fill="rgba(255,245,185,0.95)"/>
            {/* candle body */}
            <rect x={c.cx - 3} y={c.cy + outerR * 0.4}
              width="6" height={c.candleH} rx="1"
              fill="#f5e6c8" stroke="#c9a96e" strokeWidth="0.6"/>
            {/* bobeche */}
            <ellipse cx={c.cx} cy={c.cy + outerR * 0.4 + c.candleH}
              rx={c.bocheRx} ry="2.2"
              fill="#d4b896" stroke="#c9a96e" strokeWidth="0.65"/>
          </g>
        )
      })}

      {/* Arms */}
      <path d="M70 46 L70 80"            stroke="#8a6030" strokeWidth="2"   fill="none"/>
      <path d="M70 53 Q55 51 40 51.5"    stroke="#8a6030" strokeWidth="1.6" fill="none"/>
      <path d="M70 53 Q85 51 100 51.5"   stroke="#8a6030" strokeWidth="1.6" fill="none"/>
      <path d="M50 52 Q32 49 18 65"      stroke="#8a6030" strokeWidth="1.3" fill="none"/>
      <path d="M90 52 Q108 49 122 65"    stroke="#8a6030" strokeWidth="1.3" fill="none"/>

      {/* Stem nodes */}
      <ellipse cx="70" cy="88"  rx="5"  ry="3.5" stroke="#8a6030" strokeWidth="1" fill="#f5e6c8"/>
      <line x1="70" y1="91.5" x2="70" y2="104"  stroke="#8a6030" strokeWidth="2"/>
      <ellipse cx="70" cy="107" rx="4.5" ry="3"  stroke="#8a6030" strokeWidth="1" fill="#f5e6c8"/>
      <line x1="70" y1="110"  x2="70" y2="122"  stroke="#8a6030" strokeWidth="2"/>
      <ellipse cx="70" cy="125" rx="6"  ry="3.5" stroke="#8a6030" strokeWidth="1" fill="#f5e6c8"/>
      <line x1="70" y1="128.5" x2="70" y2="134" stroke="#8a6030" strokeWidth="2"/>

      {/* Base */}
      <ellipse cx="70" cy="138" rx="18" ry="5.5" stroke="#8a6030" strokeWidth="1.4" fill="#e8d0a0"/>
      <ellipse cx="70" cy="144" rx="26" ry="7"   stroke="#8a6030" strokeWidth="1.1" fill="#dfc090"/>
      <ellipse cx="70" cy="150" rx="30" ry="5"   stroke="#8a6030" strokeWidth="0.9" fill="#d8b880"/>
    </svg>
  )
}
