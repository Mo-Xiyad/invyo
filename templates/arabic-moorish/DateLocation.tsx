'use client';

import { useLanguage } from './LanguageContext';
import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';


const events = [
  {
    id: 'dinner',
    dateEn: 'June 24',
    dateAr: '24 جوان',
    dayEn: 'Wednesday',
    dayAr: 'الأربعاء',
    time: '19:00',
    titleEn: 'Family Dinner',
    titleAr: 'عشاء عائلي',
    descEn: 'Join us for an intimate dinner with family and loved ones as we begin the wedding celebrations.',
    descAr: 'انضموا إلينا لعشاء حميم مع العائلة والأحباء بينما نبدأ احتفالات الزفاف.',
    locationEn: 'Salle Des Fêtes El Bourak Bardo',
    locationAr: 'قاعة الأفراح إل بوراك، باردو',
    mapsUrl: 'https://share.google/zo0kDUwFPnRwfTah5',
    icon: 'dinner',
    accent: '#3D6B5E',
  },
  {
    id: 'henna',
    dateEn: 'June 24',
    dateAr: '24 جوان',
    dayEn: 'Wednesday',
    dayAr: 'الأربعاء',
    time: '20:00',
    titleEn: 'Henna Tea Party',
    titleAr: 'حفل الحناء والشاي',
    descEn:
      'Join us at Salle Des Fêtes El Bourak Bardo for an evening of henna art, tea, sweets, and celebration.',
    descAr:
      'انضموا إلينا في قاعة الأفراح إل بوراك، باردو لأمسية من فن الحناء والشاي والحلويات والاحتفال.',
    locationEn: 'Salle Des Fêtes El Bourak Bardo',
    locationAr: 'قاعة الأفراح إل بوراك، باردو',
    mapsUrl: 'https://share.google/zo0kDUwFPnRwfTah5',
    icon: 'henna',
    accent: '#8B1A2E',
  },
  {
    id: 'wedding',
    dateEn: 'June 27',
    dateAr: '27 جوان',
    dayEn: 'Saturday',
    dayAr: 'السبت',
    time: '20:00',
    titleEn: 'The Wedding',
    titleAr: 'حفل الزفاف',
    descEn: 'We joyfully invite you to celebrate our union at Salle Des Fêtes Dream Lac1.',
    descAr: 'ندعوكم بكل فرح للاحتفال بزواجنا في قاعة الأفراح دريم لاك 1.',
    icon: 'wedding',
    accent: '#C8813A',
  },
];

const DateLocation = ({ showOnly }: { showOnly?: string[] }) => {
  const filteredEvents = showOnly ? events.filter(e => showOnly.includes(e.id)) : events;
  const isSingle = filteredEvents.length === 1;
  const { t, isArabic } = useLanguage();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [ticketTop, setTicketTop] = useState(0);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateTicket = useCallback(() => {
    if (isSingle || !timelineRef.current || eventRefs.current.length === 0) return;
    const containerTop = timelineRef.current.getBoundingClientRect().top;
    let bestIdx = 0;
    let bestDist = Infinity;
    const viewCenter = window.innerHeight * 0.45;

    eventRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height * 0.3;
      const dist = Math.abs(elCenter - viewCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });

    setActiveIdx(bestIdx);
    const activeEl = eventRefs.current[bestIdx];
    if (activeEl) {
      const elRect = activeEl.getBoundingClientRect();
      setTicketTop(elRect.top - containerTop + 4);
    }
  }, [isSingle]);

  useEffect(() => {
    if (isSingle) return;
    updateTicket();
    window.addEventListener('scroll', updateTicket, { passive: true });
    return () => window.removeEventListener('scroll', updateTicket);
  }, [updateTicket, isSingle]);

  const renderIcon = (type: string) => {
    if (type === 'dinner') return (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M14 12v16M26 12v16M14 20h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="16" r="3" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
    if (type === 'henna') return (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M20 8Q18 16 14 22Q12 26 14 30Q16 34 20 36Q24 34 26 30Q28 26 26 22Q22 16 20 8Z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="20" cy="22" r="2" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="20" cy="28" r="1.2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    );
    return (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M14 28Q14 18 20 12Q26 18 26 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 28Q17 21 20 16Q23 21 23 28" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="20" cy="22" r="1.5" fill="currentColor" fillOpacity="0.4" />
      </svg>
    );
  };

  return (
    <section className="relative overflow-hidden">
      {/* Ripped paper edge — top */}
      <div className="relative w-full h-12 -mb-1" style={{ background: 'linear-gradient(180deg, transparent 0%, #F5ECD7 100%)' }}>
        <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="absolute bottom-0 w-full h-12" fill="#F5ECD7">
          <path d="M0 48 L0 28 Q30 18 60 26 Q90 34 120 22 Q150 12 180 24 Q210 36 240 20 Q270 8 300 22 Q330 34 360 18 Q390 6 420 20 Q450 32 480 16 Q510 4 540 18 Q570 30 600 14 Q630 2 660 16 Q690 28 720 12 Q750 0 780 14 Q810 26 840 10 Q870 0 900 14 Q930 26 960 12 Q990 2 1020 16 Q1050 28 1080 14 Q1110 4 1140 18 Q1170 30 1200 20 L1200 48Z" />
        </svg>
      </div>

      {/* Main content area */}
      <div className="relative px-6 py-16" style={{ background: '#F5ECD7' }}>
        <div className="absolute inset-0 am-zellige-bg opacity-[0.03]" />
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(200,129,58,0.3), transparent 60%)' }} />

        <div className="max-w-sm mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-14 am-animate-fade-in-up">
            <h2 className={`text-3xl md:text-4xl text-[#1A1A2E] mb-3 ${isArabic ? 'font-amiri' : 'font-playfair'}`}>
              {isSingle ? t('The Celebration', 'الاحتفال') : t('Celebration Journey', 'رحلة الاحتفال')}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-[1px] bg-[#C8813A]/40" />
              <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="#C8813A" fillOpacity="0.5">
                <path d="M7 0L8.3 4.7L13 5.5L9.1 8L10 13L7 10L4 13L4.9 8L1 5.5L5.7 4.7Z" />
              </svg>
              <div className="w-12 h-[1px] bg-[#C8813A]/40" />
            </div>
          </div>

          {isSingle ? (
            /* ── Single event: elegant centered card ── */
            (() => {
              const ev = filteredEvents[0];
              if (!ev) return null;
              return (
                <div className="text-center">
                  {/* Moorish arch icon */}
                  <div className="flex justify-center mb-6" style={{ color: ev.accent }}>
                    <svg viewBox="0 0 80 90" className="w-20 h-[90px]" fill="none">
                      {/* Outer arch */}
                      <path d="M8 88 L8 40 Q8 8 40 8 Q72 8 72 40 L72 88" stroke={ev.accent} strokeWidth="1.2" strokeOpacity="0.3" />
                      {/* Inner arch */}
                      <path d="M16 88 L16 42 Q16 16 40 16 Q64 16 64 42 L64 88" stroke={ev.accent} strokeWidth="0.7" strokeOpacity="0.2" />
                      {/* Keystone */}
                      <circle cx="40" cy="12" r="2.5" fill={ev.accent} fillOpacity="0.25" />
                      {/* Arch window icon */}
                      <path d="M28 70 Q28 45 40 35 Q52 45 52 70" stroke={ev.accent} strokeWidth="1" strokeOpacity="0.4" />
                      <path d="M34 70 Q34 50 40 42 Q46 50 46 70" stroke={ev.accent} strokeWidth="0.6" strokeOpacity="0.25" />
                      <circle cx="40" cy="52" r="2" fill={ev.accent} fillOpacity="0.3" />
                      {/* Base line */}
                      <line x1="8" y1="88" x2="72" y2="88" stroke={ev.accent} strokeWidth="0.8" strokeOpacity="0.2" />
                    </svg>
                  </div>

                  {/* Day label */}
                  <span className={`text-xs tracking-[0.25em] uppercase block mb-2 ${isArabic ? 'font-amiri text-sm' : 'font-lato'}`}
                    style={{ color: `${ev.accent}BB` }}>
                    {isArabic ? ev.dayAr : ev.dayEn}
                  </span>

                  {/* Date & time — large and prominent */}
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className={`text-4xl ${isArabic ? 'font-amiri' : 'font-playfair'}`}
                      style={{ color: '#1A1A2E' }}>
                      {isArabic ? ev.dateAr : ev.dateEn}
                    </span>
                  </div>
                  <div className="inline-block rounded-full border border-[#C8813A]/20 px-4 py-1 mb-6">
                    <span className="text-base font-lato tracking-wider" style={{ color: ev.accent }}>
                      {ev.time}
                    </span>
                  </div>

                  {/* Ornamental divider */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-14 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${ev.accent}40)` }} />
                    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
                      <path d="M10 2L12 7L17 8L13 11.5L14 17L10 14L6 17L7 11.5L3 8L8 7Z" fill={ev.accent} fillOpacity="0.35" />
                    </svg>
                    <div className="w-14 h-[1px]" style={{ background: `linear-gradient(90deg, ${ev.accent}40, transparent)` }} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl mb-4 ${isArabic ? 'font-amiri' : 'font-playfair'}`}
                    style={{ color: '#1A1A2E' }}>
                    {isArabic ? ev.titleAr : ev.titleEn}
                  </h3>

                  {/* Description */}
                  <p className={`text-base leading-relaxed mb-8 max-w-[300px] mx-auto ${isArabic ? 'font-amiri text-lg' : 'font-lato'}`}
                    style={{ color: '#1A1A2E77' }}>
                    {isArabic ? ev.descAr : ev.descEn}
                  </p>

                  {/* Map embed */}
                  <div className="rounded-2xl overflow-hidden border border-[#C8813A]/15 mb-4 relative"
                    style={{ boxShadow: '0 6px 30px rgba(200,129,58,0.08)' }}>
                    {/* Decorative top band */}
                    <div className="h-1" style={{ background: 'linear-gradient(90deg, #C8813A20, #C8813A60, #C8813A20)' }} />
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.8!2d10.2!3d36.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ4JzAwLjAiTiAxMMKwMTInMDAuMCJF!5e0!3m2!1sen!2s!4v1"
                      width="100%"
                      height="180"
                      style={{ border: 0, filter: 'sepia(15%) saturate(80%) hue-rotate(10deg)' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Wedding venue location"
                    />
                  </div>
                </div>
              );
            })()
          ) : (
            /* ── Multi-event timeline ── */
            <div className="relative" ref={timelineRef}>
              <div className={`absolute top-0 bottom-0 w-[2px] bg-[#C8813A]/20 ${isArabic ? 'right-[19px]' : 'left-[19px]'}`} />

              <div
                className={`absolute w-[40px] h-[40px] z-20 pointer-events-none ${isArabic ? 'right-0' : 'left-0'}`}
                style={{ top: `${ticketTop}px`, transition: 'top 0.4s ease-out' }}
              >
                <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-lg">
                  <circle cx="20" cy="20" r="18" fill={filteredEvents[activeIdx]?.accent || '#C8813A'} />
                  <circle cx="20" cy="20" r="14" fill="#F5ECD7" />
                  <text x="20" y="24" textAnchor="middle" fill={filteredEvents[activeIdx]?.accent || '#C8813A'} fontSize="12" fontWeight="bold">
                    {activeIdx + 1}
                  </text>
                </svg>
              </div>

              {filteredEvents.map((ev, i) => (
                <div
                  key={ev.id}
                  ref={(el) => { eventRefs.current[i] = el; }}
                  className={`relative ${isArabic ? 'pr-16 pl-0' : 'pl-16 pr-0'} pb-16 last:pb-0 transition-opacity duration-500 ${activeIdx === i ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div
                    className={`absolute top-3 w-[10px] h-[10px] rounded-full border-2 transition-all duration-500 ${isArabic ? 'right-[15px]' : 'left-[15px]'}`}
                    style={{
                      borderColor: ev.accent,
                      backgroundColor: activeIdx === i ? ev.accent : '#F5ECD7',
                    }}
                  />

                  <div className="mb-3">
                    <span className={`text-xs tracking-[0.15em] uppercase ${isArabic ? 'font-amiri text-sm' : 'font-lato'}`}
                      style={{ color: ev.accent }}>
                      {isArabic ? ev.dayAr : ev.dayEn}
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className={`text-2xl ${isArabic ? 'font-amiri' : 'font-playfair'}`}
                        style={{ color: '#1A1A2E' }}>
                        {isArabic ? ev.dateAr : ev.dateEn}
                      </span>
                      <span className="text-sm font-lato" style={{ color: `${ev.accent}CC` }}>
                        {ev.time}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`absolute top-0 ${isArabic ? '-right-6' : '-left-6'} h-full w-[2px] rounded-full`}
                      style={{ background: `linear-gradient(180deg, ${ev.accent}40, ${ev.accent}10)` }} />

                    <div className="flex items-start gap-3 mb-3" style={{ color: ev.accent }}>
                      {renderIcon(ev.icon)}
                      <div>
                        <h3 className={`text-xl ${isArabic ? 'font-amiri' : 'font-playfair'}`}
                          style={{ color: '#1A1A2E' }}>
                          {isArabic ? ev.titleAr : ev.titleEn}
                        </h3>
                        {'badgeEn' in ev && (ev as { badgeEn?: string }).badgeEn && (
                          <span className={`inline-block mt-1 text-xs px-3 py-0.5 rounded-full border ${isArabic ? 'font-amiri text-sm' : 'font-lato'}`}
                            style={{ borderColor: `${ev.accent}30`, color: ev.accent, backgroundColor: `${ev.accent}08` }}>
                            {String(isArabic ? (ev as { badgeAr?: string; badgeEn?: string }).badgeAr ?? (ev as { badgeEn?: string }).badgeEn : (ev as { badgeEn?: string }).badgeEn)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className={`text-sm leading-relaxed mb-3 ${isArabic ? 'font-amiri text-base' : 'font-lato'}`}
                      style={{ color: '#1A1A2E99' }}>
                      {isArabic ? ev.descAr : ev.descEn}
                    </p>

                    {ev.locationEn && (
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: `${ev.accent}BB` }}>
                        <MapPin className="w-3.5 h-3.5" />
                        <span className={isArabic ? 'font-amiri' : 'font-lato'}>
                          {isArabic ? ev.locationAr : ev.locationEn}
                        </span>
                      </div>
                    )}

                    {ev.id === 'wedding' && (
                      <div className="mt-4">
                        <div className="flex items-center gap-1.5 text-sm mb-3" style={{ color: '#C8813ABB' }}>
                          <MapPin className="w-3.5 h-3.5" />
                          <span className={isArabic ? 'font-amiri' : 'font-lato'}>
                            Salle Des Fêtes Dream Lac1
                          </span>
                        </div>
                        <a
                          href="https://share.google/MZbDL4qFGzL2l48BM"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-lato hover:bg-[#C8813A]/10 transition-all duration-300"
                          style={{ borderColor: '#C8813A40', color: '#C8813A' }}
                        >
                          <MapPin className="w-4 h-4" />
                          {t('Open in Google Maps', 'فتح في خرائط جوجل')}
                          <span>→</span>
                        </a>
                      </div>
                    )}

                    {(ev.id === 'dinner' || ev.id === 'henna') && 'mapsUrl' in ev && ev.mapsUrl && (
                      <div className="mt-4">
                        <a
                          href={ev.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-lato transition-all duration-300 hover:bg-black/[0.04]"
                          style={{ borderColor: `${ev.accent}55`, color: ev.accent }}
                        >
                          <MapPin className="h-4 w-4" />
                          {t('Open in Google Maps', 'فتح في خرائط جوجل')}
                          <span>→</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {i < filteredEvents.length - 1 && (
                    <div className="flex items-center justify-center mt-8 gap-2 opacity-30">
                      <div className="w-6 h-[0.5px] bg-[#C8813A]" />
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="#C8813A">
                        <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" />
                      </svg>
                      <div className="w-6 h-[0.5px] bg-[#C8813A]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Flower footer — joins this section to the next */}
      <div className="relative -mt-1" style={{ background: '#F5ECD7' }}>
        <img
          src="/templates/arabic-moorish/flowers-footer.png"
          alt=""
          loading="lazy"
          width={1200}
          height={512}
          className="w-full h-auto relative z-10"
          style={{ marginBottom: '-4px' }}
        />
      </div>
    </section>
  );
};

export default DateLocation;
