import type { ReactNode } from 'react'

const serif = { fontFamily: "'Source Serif 4', serif" as const }
const display = { fontFamily: "'Carattere', cursive" as const }

export function IvorySectionHeader({
  eyebrow,
  title,
  className = '',
}: {
  eyebrow: string
  title: ReactNode
  className?: string
}) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-[10px] uppercase tracking-[0.35em] text-[#827B6F]" style={serif}>
        {eyebrow}
      </p>
      <h2 className="mt-5 text-[clamp(2.1rem,5.5vw,2.95rem)] leading-[1.12] text-[#827B6F]" style={display}>
        {title}
      </h2>
    </div>
  )
}
