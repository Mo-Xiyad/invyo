// components/VenueMap.tsx
'use client'
import { motion } from 'framer-motion'

const MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1563.8215046086982!2d73.50197245862587!3d4.175075788739645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b3f7f177cdaeed5%3A0xc64d6b60bacc23a3!2sPavilion%20by%20Gold!5e1!3m2!1sen!2sse!4v1776172404845!5m2!1sen!2sse'
const DIRECTIONS_URL = 'https://maps.app.goo.gl/ntVCs2GkrDmSJBRp6'
const CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ibrahim+Zimam+%26+Yanal+Ahmed+%E2%80%94+Marriage+Ceremony&dates=20260508T113000Z%2F20260508T143000Z&details=Marriage+Ceremony&location=Pavilion+by+Gold%2C+Mafannu%2C+Mal%C3%A9%2C+Maldives'

const cornerClasses = [
  'top-1.5 left-1.5 border-t border-l',
  'top-1.5 right-1.5 border-t border-r',
  'bottom-1.5 left-1.5 border-b border-l',
  'bottom-1.5 right-1.5 border-b border-r',
]

export default function VenueMap() {
  return (
    <section className="bg-parchment px-5 py-9">
      <motion.h2
        className="font-cormorant font-light text-[28px] text-ink text-center mb-1"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        The Venue
      </motion.h2>
      <p className="font-vibes text-[26px] text-ink text-center mb-1">Pavilion by Gold</p>
      <p className="font-cormorant italic text-[12px] text-muted text-center leading-relaxed mb-4">
        Mafannu, Malé
        <br />
        Maldives
      </p>

      <div
        className="relative rounded-[6px] overflow-hidden mb-3"
        style={{
          boxShadow:
            '0 0 0 1px rgba(201,169,110,0.35), 0 0 0 4px #fdf8f0, 0 0 0 5px rgba(201,169,110,0.2)',
        }}
      >
        {cornerClasses.map((cls) => (
          <div
            key={cls}
            className={`absolute w-4 h-4 z-10 pointer-events-none border-gold/70 ${cls}`}
          />
        ))}
        <iframe
          src={MAPS_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title="Pavilion by Gold map"
          className="block w-full h-[170px] border-0"
          style={{
            filter: 'sepia(0.55) saturate(0.65) brightness(0.97) contrast(1.08) hue-rotate(8deg)',
          }}
        />
      </div>

      <div className="flex gap-2">
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 border border-gold/40 text-muted font-cinzel text-[7.5px] tracking-[2px] uppercase py-2.5 rounded-sm"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#c9a96e', flexShrink: 0 }}>
            <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          Get Directions
        </a>
        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 border border-gold/40 text-muted font-cinzel text-[7.5px] tracking-[2px] uppercase py-2.5 rounded-sm"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#c9a96e', flexShrink: 0 }}>
            <rect x="3" y="4" width="18" height="17" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <line x1="9" y1="15" x2="9" y2="15" strokeWidth="2"/>
            <line x1="12" y1="15" x2="12" y2="15" strokeWidth="2"/>
            <line x1="15" y1="15" x2="15" y2="15" strokeWidth="2"/>
          </svg>
          Add to Calendar
        </a>
      </div>
    </section>
  )
}
