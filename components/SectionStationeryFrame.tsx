'use client'
import type { CSSProperties, ReactNode } from 'react'

/**
 * Double-line stationery frame inspired by invitation art (gold #c9a96e, deep #8a6030, parchment).
 * Use tone="light" on parchment sections; tone="dark" on espresso panels.
 */
export default function SectionStationeryFrame({
  children,
  className = '',
  tone = 'light',
}: {
  children: ReactNode
  className?: string
  tone?: 'light' | 'dark'
}) {
  const outerStyle: CSSProperties =
    tone === 'light'
      ? {
          background:
            'linear-gradient(156deg, rgba(201,169,110,0.44) 0%, rgba(176,138,82,0.26) 42%, rgba(122,82,44,0.32) 100%)',
          boxShadow:
            '0 0 0 1px rgba(138,96,48,0.18), 0 10px 32px rgba(42,24,8,0.08), inset 0 1px 0 rgba(255,252,248,0.55)',
        }
      : {
          background:
            'linear-gradient(156deg, rgba(201,169,110,0.28) 0%, rgba(138,96,48,0.16) 48%, rgba(74,48,28,0.26) 100%)',
          boxShadow:
            '0 0 0 1px rgba(201,169,110,0.22), 0 14px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,248,240,0.08)',
        }

  const innerClass =
    tone === 'light'
      ? 'relative rounded-[3px] border border-[#e8d4bc] bg-parchment px-5 py-6 sm:px-6 sm:py-7 shadow-[inset_0_0_0_1px_rgba(255,250,240,0.95),inset_0_14px_28px_-10px_rgba(201,169,110,0.05)]'
      : 'relative rounded-[3px] border border-[rgba(201,169,110,0.26)] bg-[linear-gradient(178deg,rgba(48,28,14,0.72)_0%,rgba(26,14,6,0.52)_100%)] px-5 py-6 sm:px-6 sm:py-7 shadow-[inset_0_0_0_1px_rgba(201,169,110,0.12),inset_0_-24px_48px_-28px_rgba(0,0,0,0.35)]'

  const cornerBorder = tone === 'light' ? 'border-gold/40' : 'border-gold/35'

  const corners = [
    'top-2.5 left-2.5 rounded-tl-[2px] border-t border-l',
    'top-2.5 right-2.5 rounded-tr-[2px] border-t border-r',
    'bottom-2.5 left-2.5 rounded-bl-[2px] border-b border-l',
    'bottom-2.5 right-2.5 rounded-br-[2px] border-b border-r',
  ] as const

  return (
    <div className={`mx-auto w-full max-w-[320px] ${className}`}>
      <div className="rounded-[6px] p-[6px] sm:p-[7px]" style={outerStyle}>
        <div className={innerClass}>
          {corners.map((c) => (
            <span
              key={c}
              className={`pointer-events-none absolute z-[1] h-3.5 w-3.5 ${cornerBorder} ${c}`}
              aria-hidden
            />
          ))}
          <div className="relative z-[2]">{children}</div>
        </div>
      </div>
    </div>
  )
}
