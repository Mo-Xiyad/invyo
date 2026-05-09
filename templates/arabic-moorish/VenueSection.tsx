'use client'

import { useLanguage } from './LanguageContext'
import { useInvitationData } from './InvitationDataContext'

function PinIcon({ color = '#3D6B5E' }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden style={{ color }}>
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

const VenueSection = () => {
  const { t, isArabic } = useLanguage()
  const data = useInvitationData()
  const hasReception = Boolean(data.receptionVenueEn)
  const ceremonyEmbed = toEmbedUrl(data.ceremonyMapsUrl)
  const receptionEmbed = toEmbedUrl(data.receptionMapsUrl)

  return (
    <section
      className="relative px-6 py-14 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FAF7F0 0%, #F4F0E8 100%)' }}
    >
      <div className="absolute inset-0 am-am-am-zellige-bg-dense opacity-[0.04]" />
      <div className="relative z-10 max-w-sm mx-auto text-center" dir={isArabic ? 'rtl' : 'ltr'}>

        <p className="font-lato text-[10px] uppercase tracking-[0.45em] text-[#3D6B5E]/70 mb-10">
          {t('where to find us', 'أين نلتقي')}
        </p>

        {/* Ceremony */}
        <div className="flex flex-col items-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#3D6B5E]/25 bg-white/60">
            <PinIcon />
          </div>
          <p className="font-lato text-[10px] uppercase tracking-[0.35em] text-[#C8813A]/80 mb-2">
            {t('the celebration will take place at', 'مكان الاحتفال')}
          </p>
          <p className="font-lato text-[22px] font-light text-[#1A1A2E]">
            {isArabic ? data.venueAr : data.venueEn}
          </p>
          <p className="mt-1 font-lato text-sm text-[#1A1A2E]/50 italic">
            {isArabic ? data.cityAr : data.cityEn}
          </p>

          {ceremonyEmbed && (
            <div className="mt-5 w-full overflow-hidden rounded-2xl border border-[#3D6B5E]/15 shadow-sm">
              <iframe
                src={ceremonyEmbed}
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${data.venueEn}`}
              />
              <a
                href={data.ceremonyMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-white/80 px-4 py-2.5 font-lato text-[10px] uppercase tracking-[0.3em] text-[#3D6B5E] hover:bg-white transition-colors"
              >
                {t('Open in Google Maps', 'فتح في خرائط جوجل')}
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 13L13 3M7 3h6v6" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Reception (optional) */}
        {hasReception && (
          <>
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#3D6B5E]/15" />
              <span className="font-lato text-[9px] uppercase tracking-[0.4em] text-[#C8813A]/60">
                {t('& then', 'ثم')}
              </span>
              <div className="h-px flex-1 bg-[#3D6B5E]/15" />
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#3D6B5E]/25 bg-white/60">
                <PinIcon />
              </div>
              <p className="font-lato text-[10px] uppercase tracking-[0.35em] text-[#C8813A]/80 mb-2">
                {t('the reception will take place at', 'مكان حفل الاستقبال')}
              </p>
              <p className="font-lato text-[22px] font-light text-[#1A1A2E]">{data.receptionVenueEn}</p>
              {data.receptionCityEn && (
                <p className="mt-1 font-lato text-sm text-[#1A1A2E]/50 italic">{data.receptionCityEn}</p>
              )}
              {receptionEmbed && (
                <div className="mt-5 w-full overflow-hidden rounded-2xl border border-[#3D6B5E]/15 shadow-sm">
                  <iframe
                    src={receptionEmbed}
                    width="100%"
                    height="180"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${data.receptionVenueEn}`}
                  />
                  <a
                    href={data.receptionMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-white/80 px-4 py-2.5 font-lato text-[10px] uppercase tracking-[0.3em] text-[#3D6B5E] hover:bg-white transition-colors"
                  >
                    {t('Open in Google Maps', 'فتح في خرائط جوجل')}
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 13L13 3M7 3h6v6" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default VenueSection
