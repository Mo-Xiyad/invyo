// components/Countdown.tsx
'use client'
import { useEffect, useMemo, useState } from 'react'

function getTarget(arrivalTime: string): Date {
  const [h, m] = arrivalTime.split(':').map(Number)
  return new Date(Date.UTC(2026, 4, 8, h - 5, m, 0))
}

function calcRemaining(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  }
}

export default function Countdown({ arrivalTime }: { arrivalTime: string }) {
  const target = useMemo(() => getTarget(arrivalTime), [arrivalTime])
  const [t, setT] = useState(() => calcRemaining(target))

  useEffect(() => {
    const iv = setInterval(() => setT(calcRemaining(target)), 1000)
    return () => clearInterval(iv)
  }, [target])

  const fmt = (n: number) => String(n).padStart(2, '0')
  const units = [
    { value: t.days, label: 'Days' },
    { value: t.hours, label: 'Hrs' },
    { value: t.mins, label: 'Min' },
    { value: t.secs, label: 'Sec' },
  ]

  return (
    <section className="bg-espresso py-7 px-4 text-center relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-28 pointer-events-none animate-ambPulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.08), transparent 65%)',
        }}
      />

      <p className="font-vibes text-gold text-[22px] relative">Countdown</p>
      <p className="font-cinzel text-[7px] tracking-[4px] text-[#6a4a2a] uppercase mb-5 relative">
        Until 8th May 2026
      </p>

      <div className="flex justify-center relative">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-start">
            <div className="text-center min-w-[44px]">
              <span className="font-cormorant font-light text-[38px] text-champagne leading-none block tabular-nums">
                {fmt(u.value)}
              </span>
              <span className="font-cinzel text-[6.5px] tracking-[2px] text-[#6a4a2a] uppercase mt-1 block">
                {u.label}
              </span>
            </div>
            {i < 3 && <span className="text-[22px] text-gold/20 leading-[38px] px-0.5">·</span>}
          </div>
        ))}
      </div>
    </section>
  )
}
