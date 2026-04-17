// components/RSVPSection.tsx
'use client'
import { useCallback, useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionStationeryFrame from './SectionStationeryFrame'
import OrnamentDivider from './OrnamentDivider'

// const WA_NUMBER = '46724551114'
const WA_NUMBER = '9609697543'

type GuestChoice = 'solo' | 'plusone'

function buildWhatsAppHref(choice: GuestChoice): string {
  const guestLine =
    choice === 'solo'
      ? 'I will attend on my own (no plus one).'
      : 'I will attend with a plus one (2 guests total, including myself).'
  const text = `Hi,

I would like to RSVP for the Marriage Ceremony of Ibrahim Zimam & Yanal Ahmed on 8th May 2026.

${guestLine}

Thank you!`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

export default function RSVPSection() {
  const dialogLabelId = useId()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [guestChoice, setGuestChoice] = useState<GuestChoice | null>(null)

  const closeSheet = useCallback(() => {
    setSheetOpen(false)
    setGuestChoice(null)
  }, [])

  useEffect(() => {
    if (!sheetOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [sheetOpen])

  useEffect(() => {
    if (!sheetOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sheetOpen, closeSheet])

  return (
    <section className="relative bg-parchment px-5 pt-10 pb-16 text-center">
      {/* <SectionStationeryFrame className="max-w-[300px]"> */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="font-cinzel text-[7.5px] tracking-[5px] text-gold uppercase mb-2 font-medium">RSVP</p>
          <h2 className="font-cinzel font-light text-[30px] leading-tight text-ink mb-7">Will you join us?</h2>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label="Reply to invitation"
            className="group relative mx-auto flex w-full max-w-[160px] items-center justify-center gap-2 overflow-hidden rounded-sm border border-gold/45 bg-espresso px-4 py-3 font-cinzel text-[11px] font-medium tracking-[0.32em] text-champagne uppercase shadow-[inset_0_1px_0_rgba(255,252,248,0.12),0_10px_28px_rgba(42,24,8,0.35)] transition-[transform,box-shadow,border-color] duration-300 animate-rsvpPulse hover:border-gold/70 active:scale-[0.98]"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
              style={{
                background:
                  'linear-gradient(105deg, transparent 0%, rgba(201,169,110,0.12) 45%, transparent 70%)',
              }}
            />
            <span className="relative">Reply</span>
          </button>

          <p className="mt-5 font-cinzel italic text-[11px] text-muted">Kindly reply by 22nd April 2026</p>
        </motion.div>
      {/* </SectionStationeryFrame> */}

      <div className="mx-auto mt-8 flex max-w-[300px] flex-col items-center text-center">
        <OrnamentDivider />
        <p className="mt-4 font-cinzel italic text-[19px] text-gold">With love, Zimam &amp; Yanal</p>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            key="rsvp-sheet"
            role="presentation"
            className="fixed inset-0 z-[95] flex items-end justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-espresso/55 backdrop-blur-[3px]"
              aria-label="Close RSVP"
              onClick={closeSheet}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogLabelId}
              className="relative z-[1] w-full max-w-[320px] rounded-[6px] border border-gold/35 bg-parchment p-[10px] shadow-[0_24px_60px_rgba(26,14,6,0.45),0_0_0_1px_rgba(255,252,248,0.6)_inset]"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            >
              <div className="rounded-[3px] border border-[#e8d4bc] bg-[linear-gradient(180deg,#fffefb_0%,#fdf8f0_100%)] px-4 py-5 sm:px-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="text-left">
                    <p id={dialogLabelId} className="font-cinzel text-[15px] font-light text-ink leading-snug">
                      Guest details
                    </p>
                    <p className="mt-1 font-cinzel italic text-[11.5px] text-muted leading-relaxed">
                      Will you bring a plus one?
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeSheet}
                    className="shrink-0 rounded-sm border border-gold/25 px-2 py-1 font-cinzel text-[9px] uppercase tracking-wider text-muted transition-colors hover:border-gold/45 hover:text-ink"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setGuestChoice('solo')}
                    className={`rounded-sm border px-3 py-3 text-left transition-[border-color,box-shadow,background] duration-200 ${
                      guestChoice === 'solo'
                        ? 'border-gold bg-[rgba(201,169,110,0.12)] shadow-[inset_0_0_0_1px_rgba(201,169,110,0.35)]'
                        : 'border-gold/20 bg-parchment hover:border-gold/40'
                    }`}
                  >
                    <p className="font-cinzel text-[10px] uppercase tracking-[2.5px] text-gold">Solo</p>
                    <p className="mt-1 font-cinzel text-[12px] text-ink leading-tight">Just me</p>
                    <p className="mt-0.5 font-cinzel italic text-[10px] text-muted">1 guest</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestChoice('plusone')}
                    className={`rounded-sm border px-3 py-3 text-left transition-[border-color,box-shadow,background] duration-200 ${
                      guestChoice === 'plusone'
                        ? 'border-gold bg-[rgba(201,169,110,0.12)] shadow-[inset_0_0_0_1px_rgba(201,169,110,0.35)]'
                        : 'border-gold/20 bg-parchment hover:border-gold/40'
                    }`}
                  >
                    <p className="font-cinzel text-[10px] uppercase tracking-[2.5px] text-gold">Plus one</p>
                    <p className="mt-1 font-cinzel text-[12px] text-ink leading-tight">Me + 1 guest</p>
                    <p className="mt-0.5 font-cinzel italic text-[10px] text-muted">2 guests total</p>
                  </button>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  {guestChoice ? (
                    <a
                      href={buildWhatsAppHref(guestChoice)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Send RSVP in WhatsApp"
                      onClick={() => {
                        setTimeout(closeSheet, 400)
                      }}
                      className="flex w-full items-center justify-center rounded-sm border border-gold/50 bg-espresso py-3.5 font-cinzel text-[10px] font-medium uppercase tracking-[0.22em] text-champagne shadow-[0_8px_22px_rgba(42,24,8,0.28)] transition-[transform,filter] active:scale-[0.99]"
                    >
                      RSVP
                    </a>
                  ) : (
                    <p className="py-3 font-cinzel italic text-[11px] text-muted/90">
                      Select how many will attend.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
