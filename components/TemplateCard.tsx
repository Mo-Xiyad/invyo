'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { TemplateConfig } from '@/lib/templates'

function ArabicMoorishPreview() {
  // Curtain swag paths — same geometry as HeroNames.tsx, viewBox 0 0 400 182
  const SWAGS = [
    { x0: 46, y0: 1, cx: 200, cy: 44, x2: 354, y2: 1 },
    { x0: 50, y0: 9, cx: 200, cy: 54, x2: 350, y2: 9 },
    { x0: 54, y0: 17, cx: 200, cy: 64, x2: 346, y2: 17 },
    { x0: 58, y0: 25, cx: 200, cy: 74, x2: 342, y2: 25 },
  ]
  const LEFT_INNER  = { x0: 46,  y0: 28, cx: 92,  cy: 108, x2: 188, y2: 172 }
  const RIGHT_INNER = { x0: 354, y0: 28, cx: 308, cy: 108, x2: 212, y2: 172 }
  const LEFT_FOLD   = { x0: 24,  y0: 6,  cx: 68,  cy: 96,  x2: 162, y2: 158 }
  const RIGHT_FOLD  = { x0: 376, y0: 6,  cx: 332, cy: 96,  x2: 238, y2: 158 }
  const d = (q: { x0: number; y0: number; cx: number; cy: number; x2: number; y2: number }) =>
    `M ${q.x0} ${q.y0} Q ${q.cx} ${q.cy} ${q.x2} ${q.y2}`

  return (
    // Composite hero preview — 400 × 560 viewport (phone-ish ratio)
    <svg viewBox="0 0 400 560" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="am-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F5ECD7" />
          <stop offset="52%"  stopColor="#F3E9D8" />
          <stop offset="100%" stopColor="#FDF6EF" />
        </linearGradient>
        <linearGradient id="am-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#D4AF7A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#A07840" stopOpacity="0.38" />
        </linearGradient>
        <filter id="am-glow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#C8813A" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="560" fill="url(#am-bg)" />

      {/* Zellige dot grid */}
      {Array.from({ length: 110 }, (_, i) => (
        <circle key={i}
          cx={(i % 11) * 38 + 10} cy={Math.floor(i / 11) * 54 + 18}
          r="1.1" fill="#C8813A" fillOpacity="0.07" />
      ))}

      {/* ── Curtain swags (top, viewBox 400×182) ── */}
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Back ghost lines */}
        {SWAGS.map((q, i) => (
          <path key={`gs${i}`}
            d={`M ${q.x0 + 0.6} ${q.y0 + 0.4} Q ${q.cx} ${q.cy + 0.8} ${q.x2 - 0.6} ${q.y2 + 0.4}`}
            stroke="#C4B59A" strokeWidth={0.28} opacity={0.35} />
        ))}
        {/* Layered swags */}
        {SWAGS.map((q, i) => (
          <path key={`sw${i}`} d={d(q)}
            stroke="#A67C52" strokeWidth={0.42 + i * 0.04} opacity={0.88 - i * 0.06} />
        ))}
        {/* Side fold lines */}
        <path d={d(LEFT_FOLD)}  stroke="#C4B59A" strokeWidth={0.32} opacity={0.62} />
        <path d={d(LEFT_INNER)} stroke="#A67C52" strokeWidth={0.52} opacity={0.9} />
        <path d={d(RIGHT_FOLD)}  stroke="#C4B59A" strokeWidth={0.32} opacity={0.62} />
        <path d={d(RIGHT_INNER)} stroke="#A67C52" strokeWidth={0.52} opacity={0.9} />
        {/* Corner curls */}
        <path d="M 18 2 Q 8 14 14 24 Q 22 18 18 2"  stroke="#A67C52" strokeWidth={0.35} opacity={0.55} />
        <path d="M 382 2 Q 392 14 386 24 Q 378 18 382 2" stroke="#A67C52" strokeWidth={0.35} opacity={0.55} />
      </g>

      {/* ── Chandelier (centered, scaled from 160×350) ── */}
      {/* Translate to center x=200, top y=8, scale 0.82 */}
      <g transform="translate(200,8) scale(0.82) translate(-80,0)" filter="url(#am-glow)" opacity="0.92">
        <line x1="80" y1="0" x2="80" y2="40" stroke="#A66A2E" strokeWidth="1.4" strokeLinecap="round" opacity="0.88" />
        <circle cx="80" cy="44" r="4.5" stroke="#B8742E" strokeWidth="1" fill="rgba(200,129,58,0.12)" opacity="0.92" />
        <path d="M50 60 Q55 50 80 48 Q105 50 110 60" stroke="#C4954A" strokeWidth="1.35" fill="none" opacity="0.88" />
        <path d="M40 80 Q45 65 80 60 Q115 65 120 80" stroke="#C8813A" strokeWidth="1.15" fill="none" opacity="0.82" />
        <path d="M35 100 Q40 85 80 78 Q120 85 125 100" stroke="#D4AF7A" strokeWidth="1.05" fill="none" opacity="0.78" />
        {[50, 65, 80, 95, 110].map((x, i) => (
          <line key={i} x1={x} y1={60 - Math.abs(i - 2) * 3} x2={x - (i - 2) * 3} y2={100 - Math.abs(i - 2) * 4}
            stroke="#C8813A" strokeWidth="0.95" strokeLinecap="round" opacity="0.72" />
        ))}
        {[35, 50, 65, 80, 95, 110, 125].map((x, i) => {
          const y = 100 - Math.abs(i - 3) * 5
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x} y2={y + 15 + i * 2} stroke="#B8893D" strokeWidth="0.65" strokeLinecap="round" opacity="0.75" />
              <path d={`M${x - 3.5} ${y + 15 + i * 2} Q${x} ${y + 22 + i * 2} ${x + 3.5} ${y + 15 + i * 2}`}
                fill="#C8813A" fillOpacity="0.38" stroke="#A66A2E" strokeWidth="0.55" opacity="0.9" />
              <circle cx={x} cy={y + 24 + i * 2} r="1.6" fill="#E8C97A" fillOpacity="0.55" stroke="#C8813A" strokeWidth="0.35" />
            </g>
          )
        })}
        <path d="M76 130 Q80 154 84 130" fill="#C8813A" fillOpacity="0.32" stroke="#A66A2E" strokeWidth="0.75" />
        <circle cx="80" cy="156" r="2.6" fill="#E8D5AE" fillOpacity="0.75" stroke="#C8813A" strokeWidth="0.5" />
        {[70, 85, 100].map((y, row) => (
          <g key={row}>
            {Array.from({ length: 8 }, (_, i) => {
              const x = 80 + (i - 3.5) * ((30 + row * 0.4) / 4)
              return <circle key={i} cx={x} cy={y} r="1.05" fill="#D4AF7A" fillOpacity="0.55" stroke="#B8893D" strokeWidth="0.25" />
            })}
          </g>
        ))}
      </g>

      {/* ── Horseshoe arch (Moorish frame) ── */}
      <g opacity="0.16">
        <path d="M70 560 Q70 200 200 180 Q330 200 330 560" stroke="#C8813A" strokeWidth="1.5" />
        <path d="M90 560 Q90 220 200 200 Q310 220 310 560" stroke="#C8813A" strokeWidth="0.8" />
        <path d="M110 560 Q110 240 200 225 Q290 240 290 560" stroke="#D4AF7A" strokeWidth="0.5" />
      </g>

      {/* ── Centre content ── */}
      {/* Bismillah (small) */}
      <text x="200" y="205" textAnchor="middle" fill="#1A1A2E" fillOpacity="0.25" fontSize="9" fontFamily="serif">بسم الله الرحمن الرحيم</text>

      {/* Arabesque rosette */}
      <g transform="translate(200,240)" opacity="0.55" filter="url(#am-glow)">
        <path d="M0-36L4 -14L18-30L10-12L36-8L10-2L18 16L4 6L0 36L-4 6L-18 16L-10-2L-36-8L-10-12L-18-30L-4-14Z"
          stroke="#C8813A" strokeWidth="0.8" fill="rgba(200,129,58,0.06)" />
        <circle r="12" stroke="#C8813A" strokeWidth="0.6" />
        <circle r="6"  stroke="#8B1A2E" strokeWidth="0.4" />
        <circle r="3"  fill="#C8813A"   fillOpacity="0.25" />
        {[0,45,90,135,180,225,270,315].map((a, i) => (
          <circle key={i} cx={Math.cos(a * Math.PI / 180) * 30} cy={Math.sin(a * Math.PI / 180) * 30} r="1.3" fill="#C8813A" fillOpacity="0.3" />
        ))}
      </g>

      {/* Invite text */}
      <text x="200" y="292" textAnchor="middle" fill="#1A1A2E" fillOpacity="0.38" fontSize="7.5" fontFamily="sans-serif" letterSpacing="3">WE JOYFULLY INVITE YOU</text>

      {/* Groom name */}
      <text x="200" y="328" textAnchor="middle" fill="#1A1A2E" fontSize="28" fontFamily="Georgia, 'Times New Roman', serif" letterSpacing="1">Omar Mahmoud</text>

      {/* Ampersand with rule lines */}
      <line x1="108" y1="348" x2="168" y2="348" stroke="#C8813A" strokeWidth="0.5" opacity="0.35" />
      <text x="200" y="358" textAnchor="middle" fill="#C8813A" fillOpacity="0.7" fontSize="30" fontFamily="Georgia, serif" fontStyle="italic">&amp;</text>
      <line x1="232" y1="348" x2="292" y2="348" stroke="#C8813A" strokeWidth="0.5" opacity="0.35" />

      {/* Bride name */}
      <text x="200" y="392" textAnchor="middle" fill="#1A1A2E" fontSize="28" fontFamily="Georgia, 'Times New Roman', serif" letterSpacing="1">Layla Mansour</text>

      {/* Date pill */}
      <rect x="130" y="408" width="140" height="18" rx="9" fill="#C8813A" fillOpacity="0.1" stroke="#C8813A" strokeWidth="0.5" strokeOpacity="0.3" />
      <text x="200" y="421" textAnchor="middle" fill="#1A1A2E" fillOpacity="0.5" fontSize="7" fontFamily="sans-serif" letterSpacing="1.5">JUNE 27, 2026  ·  TUNIS</text>

      {/* ── Floral floor hint (simulated illustration) ── */}
      <rect x="0" y="460" width="400" height="100" fill="url(#am-floor)" />
      {/* Leaf arcs left */}
      {[0,1,2,3].map(i => (
        <path key={i}
          d={`M${i*22} 560 Q${i*22+18} ${520 - i*8} ${i*22+36} 560`}
          fill="#6B9E7A" fillOpacity={0.14 - i * 0.02} />
      ))}
      {/* Leaf arcs right */}
      {[0,1,2,3].map(i => (
        <path key={i}
          d={`M${400 - i*22} 560 Q${400 - i*22 - 18} ${520 - i*8} ${400 - i*22 - 36} 560`}
          fill="#6B9E7A" fillOpacity={0.14 - i * 0.02} />
      ))}
      {/* Center floral motif */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
        <path key={i}
          d={`M200 510 Q${200 + Math.cos(a * Math.PI / 180) * 28} ${510 + Math.sin(a * Math.PI / 180) * 28} ${200 + Math.cos(a * Math.PI / 180) * 48} ${510 + Math.sin(a * Math.PI / 180) * 48}`}
          stroke="#C8813A" strokeWidth="0.6" strokeOpacity="0.22" />
      ))}
      <circle cx="200" cy="510" r="8" fill="#C8813A" fillOpacity="0.12" stroke="#C8813A" strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
  )
}

function SidiBouSaidPreview() {
  return (
    <svg viewBox="0 0 400 560" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sbs-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7FAFE" />
          <stop offset="100%" stopColor="#E6EEF8" />
        </linearGradient>
        <linearGradient id="sbs-arch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F2F7FC" />
        </linearGradient>
      </defs>

      <rect width="400" height="560" fill="url(#sbs-bg)" />
      <path d="M84 560Q84 198 200 154Q316 198 316 560" fill="url(#sbs-arch)" stroke="#6B8FBF" strokeOpacity="0.34" strokeWidth="2" />
      <path d="M104 560Q104 220 200 184Q296 220 296 560" stroke="#C8A96E" strokeOpacity="0.32" strokeWidth="1.2" />

      {[
        { x: 78, y: 142, r: 26 },
        { x: 325, y: 165, r: 23 },
        { x: 86, y: 416, r: 22 },
        { x: 314, y: 430, r: 25 },
      ].map((shell, index) => (
        <g key={index} transform={`translate(${shell.x} ${shell.y})`} opacity="0.95">
          <path d={`M${-shell.r} ${shell.r * 0.8}C${-shell.r * 0.55} ${-shell.r * 0.4} ${shell.r * 0.55} ${-shell.r * 0.4} ${shell.r} ${shell.r * 0.8}C${shell.r * 0.22} ${shell.r} ${-shell.r * 0.22} ${shell.r} ${-shell.r} ${shell.r * 0.8}Z`} fill="#FFFFFF" stroke="#6B8FBF" strokeOpacity="0.35" />
          <path d={`M0 ${-shell.r * 0.2}V${shell.r * 0.82}M${-shell.r * 0.45} ${shell.r * 0.22}Q0 ${-shell.r * 0.06} ${shell.r * 0.45} ${shell.r * 0.22}M${-shell.r * 0.72} ${shell.r * 0.54}Q0 ${shell.r * 0.14} ${shell.r * 0.72} ${shell.r * 0.54}`} stroke="#C8A96E" strokeOpacity="0.6" strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}

      <g opacity="0.55">
        {[42, 92, 142, 192, 242, 292, 342].map(x => (
          <path key={x} d={`M${x - 24} 74Q${x} 56 ${x + 24} 74`} stroke="#6B8FBF" strokeOpacity="0.22" />
        ))}
      </g>

      <rect x="104" y="214" width="192" height="144" rx="28" fill="#FFFFFF" fillOpacity="0.84" stroke="#6B8FBF" strokeOpacity="0.18" />
      <text x="200" y="248" textAnchor="middle" fill="#6B8FBF" fontSize="10" fontFamily="sans-serif" letterSpacing="4">THE WEDDING OF</text>
      <text x="200" y="287" textAnchor="middle" fill="#1C2B4A" fontSize="26" fontFamily="Georgia, serif">Omar Mahmoud</text>
      <text x="200" y="318" textAnchor="middle" fill="#C8A96E" fontSize="28" fontFamily="Georgia, serif" fontStyle="italic">&amp;</text>
      <text x="200" y="351" textAnchor="middle" fill="#1C2B4A" fontSize="26" fontFamily="Georgia, serif">Layla Mansour</text>
      <path d="M138 378H178M222 378H262" stroke="#6B8FBF" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M182 378C188 366 194 361 200 361s12 5 18 17c-6 2-12 3-18 3s-12-1-18-3Z" fill="#FFFFFF" stroke="#C8A96E" strokeOpacity="0.75" />
      <text x="200" y="408" textAnchor="middle" fill="#1C2B4A" fillOpacity="0.58" fontSize="11" fontFamily="sans-serif" letterSpacing="3">JUNE 27, 2026 · TUNIS</text>
    </svg>
  )
}

function ComingSoonPreview({ config }: { config: TemplateConfig }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6"
      style={{ background: `linear-gradient(135deg, ${config.bgFrom}, ${config.bgTo})` }}>
      <svg viewBox="0 0 40 40" className="h-10 w-10 opacity-30" fill="none">
        <circle cx="20" cy="20" r="18" stroke={config.accentColor} strokeWidth="1.5" />
        <path d="M13 20h14M20 13v14" stroke={config.accentColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="text-center text-xs font-semibold text-lt-ink/40">More templates coming soon</p>
    </div>
  )
}

function TemplatePreview({ config }: { config: TemplateConfig }) {
  if (config.id === 'arabic-moorish') return <ArabicMoorishPreview />
  if (config.id === 'riviera-dreams') return <SidiBouSaidPreview />
  return <ComingSoonPreview config={config} />
}

interface TemplateCardProps {
  config: TemplateConfig
  index?: number
  animate?: boolean
}

export default function TemplateCard({ config, index = 0, animate = true }: TemplateCardProps) {
  const isComingSoon = config.id === 'coming-soon'
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [])

  const useThisHref = isLoggedIn
    ? `/dashboard/invitation?template=${config.id}`
    : `/auth/sign-up?template=${config.id}`

  const card = (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-[0_4px_24px_-6px_rgba(27,33,26,0.10)] transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(27,33,26,0.18)] hover:-translate-y-1">
      {/* Preview frame — fixed compact height */}
      <div className="relative h-52 w-full overflow-hidden bg-lt-subtle">
        <TemplatePreview config={config} />
        {config.badgeLabel && (
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white"
            style={{ background: config.accentColor }}>
            {config.badgeLabel}
          </span>
        )}
        {!isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'rgba(26,26,46,0.45)' }}>
            <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-lt-ink shadow-lg">
              Preview →
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-extrabold leading-tight tracking-tight text-lt-ink">
            {config.name}
          </h3>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {config.tags.map(tag => (
            <span key={tag} className="rounded-full border border-lt-border px-2 py-0.5 font-sans text-[10px] font-semibold text-lt-muted">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 font-sans text-xs leading-relaxed text-lt-muted line-clamp-3">
          {config.description}
        </p>

        <div className="mt-4 flex gap-2">
          {isComingSoon ? (
            <Link href="/contact"
              className="flex-1 rounded-full border border-lt-border py-2 text-center font-sans text-xs font-bold text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink">
              Request custom
            </Link>
          ) : (
            <>
              <Link href={config.previewPath}
                className="flex-1 rounded-full border border-lt-border py-2 text-center font-sans text-xs font-bold text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink">
                Preview
              </Link>
              <Link href={useThisHref}
                className="flex-1 rounded-full bg-lt-ink py-2 text-center font-sans text-xs font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Use this
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (!animate) return card

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      {card}
    </motion.div>
  )
}
