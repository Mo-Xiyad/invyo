'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useInvitationData } from './InvitationDataContext'
import { IvorySectionHeader } from './IvorySectionHeader'

const serif   = { fontFamily: "'Source Serif 4', serif" as const }
const display = { fontFamily: "'Carattere', cursive"   as const }

function DiamondNode({ revealed }: { revealed: boolean }) {
  return (
    <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center transition-all duration-500 ${revealed ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
      <div className="absolute h-full w-full rotate-45 rounded-sm border border-[#C8B99A] bg-[#FAF8F5] shadow-[0_4px_16px_rgba(156,139,120,0.2)]" />
      <div className="relative h-2 w-2 rotate-45 bg-[#C8B99A]" />
    </div>
  )
}

function TimelineItem({
  index,
  item,
  isLast,
}: {
  index: number
  item: { time?: string; venue?: string; event: string }
  isLast: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const isLeft = index % 2 === 0

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const card = (
    <div
      className={`transition-all duration-700 delay-150 ${
        visible
          ? 'translate-x-0 translate-y-0 opacity-100'
          : isLeft
          ? '-translate-x-6 opacity-0'
          : 'translate-x-6 opacity-0'
      }`}
    >
      <div className="ivory-card group relative overflow-hidden rounded-3xl border border-[#E8DFD0]/80 bg-white/60 px-4 py-4 backdrop-blur-sm shadow-[0_12px_40px_rgba(156,139,120,0.10)] sm:px-6 sm:py-6">
        {/* Accent stripe on the inner edge facing the centre line */}
        <div className={`absolute inset-y-0 ${isLeft ? 'right-0' : 'left-0'} w-[3px] rounded-full bg-gradient-to-b from-transparent via-[#C8B99A]/60 to-transparent`} />

        {item.time && (
          <p className="text-[2rem] leading-none text-[#827B6F]" style={display}>
            {item.time}
          </p>
        )}
        <h3 className="mt-2 text-[1.05rem] font-semibold leading-snug text-[#3a342c]" style={serif}>
          {item.event}
        </h3>
        {item.venue && (
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#827B6F]/70" style={serif}>
            {item.venue}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <div ref={ref} className="relative">
      {/* Mobile — node vertically centred with card */}
      <div className="flex items-center gap-4 md:hidden pb-8">
        <div className="flex-shrink-0">
          <DiamondNode revealed={visible} />
        </div>
        <div className="flex-1">{card}</div>
      </div>

      {/* Desktop — alternating, node centred in its own row */}
      <div className="hidden md:grid md:grid-cols-[1fr_56px_1fr] md:items-center md:gap-6">
        <div className={isLeft ? 'col-start-1' : 'col-start-3 row-start-1'}>{card}</div>
        <div className="col-start-2 row-start-1 flex justify-center">
          <DiamondNode revealed={visible} />
        </div>
        <div className={`row-start-1 ${isLeft ? 'col-start-3' : 'col-start-1'}`} />
      </div>
    </div>
  )
}

export default function TimelineSection() {
  const data = useInvitationData()
  if (!data.timeline?.length) return null

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] px-5 py-24 sm:px-8" style={serif}>
      {/* Soft corner ornament watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.045]">
        <Image src="/templates/ivory-pavilion/corner-ornament.jpeg" alt="" fill className="object-cover" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <IvorySectionHeader eyebrow="The order of the day" title="A day composed in elegance" />

        {/* Top ornament */}
        <div className="mx-auto mt-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8B99A]/50" />
          <span className="text-[#C8B99A]/80 text-lg">◆</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8B99A]/50" />
        </div>

        {/* Timeline */}
        <div className="relative mt-8">
          {/* Centre line — runs through the middle of the 56px node column */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#C8B99A]/50 to-transparent md:block" />

          <div className="space-y-4 md:space-y-6">
            {data.timeline.map((item, index) => (
              <TimelineItem
                key={`${item.event}-${index}`}
                index={index}
                item={item}
                isLast={index === data.timeline!.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Bottom ornament */}
        <div className="mx-auto mt-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8B99A]/50" />
          <span className="text-[#C8B99A]/80 text-lg">◆</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8B99A]/50" />
        </div>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          20%       { transform: rotate(-2deg) scale(1.02); }
          40%       { transform: rotate(2deg) scale(1.02); }
          60%       { transform: rotate(-1.5deg) scale(1.01); }
          80%       { transform: rotate(1.5deg) scale(1.01); }
        }
        :global(.ivory-card:hover) {
          animation: wiggle 0.55s ease-in-out;
        }
      `}</style>
    </section>
  )
}