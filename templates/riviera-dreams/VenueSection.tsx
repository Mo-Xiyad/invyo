'use client'

import { useInvitationData } from '../arabic-moorish/InvitationDataContext'
import { useRivieraLang } from './LanguageContext'

const sbs = { fontFamily: "'Amarna', serif" }

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#6B8FBF]" fill="none" aria-hidden>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function toEmbedUrl(mapsUrl: string): string {
  if (!mapsUrl) return ''
  try {
    const url = new URL(mapsUrl)
    const searchMatch = url.pathname.match(/\/maps\/search\/(.+)/)
    const placeMatch  = url.pathname.match(/\/maps\/place\/([^/]+)/)
    const query = searchMatch?.[1] ?? placeMatch?.[1] ?? null
    if (query) return `https://maps.google.com/maps?q=${query}&output=embed&z=15`
    return mapsUrl + (mapsUrl.includes('?') ? '&' : '?') + 'output=embed'
  } catch { return '' }
}

interface VenueBlockProps {
  label: string
  venue: string
  city: string
  mapsUrl: string
}

function VenueBlock({ label, venue, city, mapsUrl }: VenueBlockProps) {
  const embedUrl = toEmbedUrl(mapsUrl)

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#6B8FBF]/25 bg-white">
        <PinIcon />
      </div>
      <p className="text-[10px] uppercase tracking-[0.45em] text-[#6B8FBF]" style={sbs}>
        {label}
      </p>
      <p className="mt-2 text-[26px] font-light leading-tight text-[#1C2B4A]" style={sbs}>
        {venue}
      </p>
      {city && (
        <p className="mt-1 text-[13px] font-light italic text-[#1C2B4A]/50" style={sbs}>
          {city}
        </p>
      )}

      {/* Map preview card */}
      {embedUrl && (
        <div className="mt-5 w-full overflow-hidden rounded-2xl border border-[#6B8FBF]/15 shadow-sm">
          <iframe
            src={embedUrl}
            width="100%"
            height="180"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${venue}`}
          />
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-white px-4 py-2.5 text-[10px] uppercase tracking-[0.3em] text-[#6B8FBF] hover:bg-[#F5F7FA] transition-colors"
            style={sbs}
          >
            Open in Google Maps
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 13L13 3M7 3h6v6" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}

export default function VenueSection() {
  const data = useInvitationData()
  const hasReception = Boolean(data.receptionVenueEn)

  return (
    <section className="relative bg-white px-8 py-16">
      <div className="relative mx-auto max-w-sm">
        <p className="mb-10 text-center text-[10px] uppercase tracking-[0.5em] text-[#6B8FBF]" style={sbs}>
          where to find us
        </p>

        <div className={`flex flex-col gap-10 ${hasReception ? 'divide-y divide-[#6B8FBF]/15' : ''}`}>
          <VenueBlock
            label="the celebration will take place at"
            venue={data.venueEn}
            city={data.cityEn}
            mapsUrl={data.ceremonyMapsUrl}
          />

          {hasReception && (
            <div className="pt-10">
              <VenueBlock
                label="the reception will take place at"
                venue={data.receptionVenueEn}
                city={data.receptionCityEn}
                mapsUrl={data.receptionMapsUrl}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
