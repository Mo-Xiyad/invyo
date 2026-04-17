// components/DressCode.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const cards = [
  {
    role: 'Women',
    name: 'Champagne Gold',
    swatchStyle: { background: 'linear-gradient(145deg, #f5e6c8, #d4b896)' },
    swatchImage: '/assets/dress-code-w.jpeg',
    detail: 'Floor-length gown in champagne gold or ivory. Elegant and formal.',
  },
  {
    role: 'Men',
    name: 'White & Navy Blue',
    swatchStyle: { background: 'linear-gradient(145deg, #f0f0f0 0%, #f0f0f0 49%, #1a2a4a 50%)' },
    detail: 'White dress shirt with navy blue trousers. Formal attire.',
  },
]

export default function DressCode() {
  const [flipped, setFlipped] = useState<boolean[]>([false, false])

  const toggle = (i: number) =>
    setFlipped((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  return (
    <section className="bg-sand px-5 py-9">
      <motion.h2
        className="font-cormorant font-light text-[28px] text-ink text-center mb-1"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        Dress Code
      </motion.h2>
      <p className="font-cormorant italic text-[12px] text-muted text-center mb-5">Tap a card to see details</p>

      <div className="flex gap-3">
        {cards.map((card, i) => (
          <button
            key={card.role}
            type="button"
            onClick={() => toggle(i)}
            className="flex-1 relative border border-gold/20 rounded-sm overflow-hidden min-h-[140px] bg-parchment"
          >
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-3 transition-opacity duration-300 ${
                flipped[i] ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="relative h-11 w-11 overflow-hidden rounded-full mb-2.5 shadow-md" style={card.swatchStyle}>
                {card.swatchImage ? (
                  <img
                    src={card.swatchImage}
                    alt={`${card.role} dress code sample`}
                    className="h-full w-full object-cover"
                    decoding="async"
                    draggable={false}
                  />
                ) : null}
              </div>
              <p className="font-cinzel text-[7px] tracking-[3px] text-muted uppercase mb-1">{card.role}</p>
              <p className="font-cormorant italic text-[13px] text-ink leading-tight">{card.name}</p>
              <p className="font-cinzel text-[6.5px] tracking-[2px] text-gold mt-1.5 uppercase opacity-70">Tap ✦</p>
            </div>
            <div
              className={`absolute inset-0 flex items-center justify-center p-3 bg-espresso transition-opacity duration-300 ${
                flipped[i] ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="font-cormorant italic text-[12px] text-champagne leading-relaxed text-center">
                {card.detail}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
