'use client'

import { useMemo } from 'react'
import { useInvitationData } from './InvitationDataContext'
import { IvorySectionHeader } from './IvorySectionHeader'

function ArchCard({
  label,
  venue,
  city,
  time,
  mapsUrl,
}: {
  label: string
  venue: string
  city?: string
  time?: string
  mapsUrl?: string
}) {
  return (
    <article className="overflow-hidden rounded-b-[2rem] rounded-t-[4rem] border border-[#E8DFD0] bg-[#FAF8F5] px-7 pb-8 pt-12 text-center shadow-[0_24px_60px_rgba(156,139,120,0.12)] sm:rounded-t-[7rem]">
      <p
        className="text-[10px] uppercase tracking-[0.35em] text-[#827B6F]"
        style={{ fontFamily: "'Source Serif 4', serif" }}
      >
        {label}
      </p>
      <h3
        className="mt-5 text-[clamp(1.35rem,3.8vw,1.75rem)] font-semibold leading-snug tracking-[0.02em] text-[#5c5348]"
        style={{ fontFamily: "'Source Serif 4', serif" }}
      >
        {venue}
      </h3>
      {city && (
        <p className="mt-3 text-sm leading-relaxed text-[#827B6F]/90" style={{ fontFamily: "'Source Serif 4', serif" }}>
          {city}
        </p>
      )}
      {time && (
        <p
          className="mt-2 text-base text-[#827B6F]"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          {time}
        </p>
      )}
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#C8B99A]/80 bg-[#FAF8F5] px-5 py-2.5 text-[10px] uppercase tracking-[0.32em] text-[#5c5348] transition hover:border-[#C8B99A] hover:bg-[#E8DFD0]/60"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          Get Directions
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 13 13 3" />
            <path d="M7 3h6v6" />
          </svg>
        </a>
      )}
    </article>
  )
}

export default function VenueSection() {
  const data = useInvitationData()

  const receptionTime = useMemo(() => {
    const directMatch = data.timeline.find(item => item.venue === data.receptionVenueEn && item.time)
    if (directMatch?.time) return directMatch.time
    const fallback = data.timeline.find(item => item.event.toLowerCase().includes('dinner') || item.event.toLowerCase().includes('reception'))
    return fallback?.time ?? ''
  }, [data.receptionVenueEn, data.timeline])

  const cards = [
    {
      label: 'Ceremony',
      venue: data.venueEn,
      city: data.cityEn,
      time: data.weddingTime,
      mapsUrl: data.ceremonyMapsUrl,
    },
    data.receptionVenueEn
      ? {
          label: 'Reception',
          venue: data.receptionVenueEn,
          city: data.receptionCityEn,
          time: receptionTime,
          mapsUrl: data.receptionMapsUrl,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; venue: string; city?: string; time?: string; mapsUrl?: string }>

  return (
    <section
      className="overflow-hidden bg-[#F5F0EB] px-5 py-20 text-[#2C2416] sm:px-8"
      style={{ fontFamily: "'Source Serif 4', serif" }}
    >
      <div className="mx-auto max-w-5xl">
        <IvorySectionHeader eyebrow="Ceremony & celebration" title="Gather with us in Provence" />

        <div className={`mt-12 grid gap-6 md:mt-14 ${cards.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-md'}`}>
          {cards.map(card => (
            <ArchCard key={`${card.label}-${card.venue}`} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
