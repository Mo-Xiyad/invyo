'use client'

import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'

export type HeroCard = {
  src: string
  alt: string
  title: string
  slug: string
}

/** Hero carousel — screenshots from `public/assets`. */
export const HERO_CARD_IMAGES: HeroCard[] = [
  {
    src: '/assets/screen-1.png',
    alt: 'Example Wedvite invitation screen 1',
    title: 'Amelia & Noah',
    slug: 'amelia-noah',
  },
  {
    src: '/assets/screen-2.png',
    alt: 'Example Wedvite invitation screen 2',
    title: 'Sofia & Marco',
    slug: 'sofia-marco',
  },
  {
    src: '/assets/screen-3.png',
    alt: 'Example Wedvite invitation screen 3',
    title: 'Elena & James',
    slug: 'elena-james',
  },
  {
    src: '/assets/screen-4.png',
    alt: 'Example Wedvite invitation screen 4',
    title: 'Priya & Daniel',
    slug: 'priya-daniel',
  },
  {
    src: '/assets/screen-5.png',
    alt: 'Example Wedvite invitation screen 5',
    title: 'Hannah & Chris',
    slug: 'hannah-chris',
  },
  {
    src: '/assets/screen-6.png',
    alt: 'Example Wedvite invitation screen 6',
    title: 'Lucy & Tom',
    slug: 'lucy-tom',
  },
  {
    src: '/assets/screen-7.png',
    alt: 'Example Wedvite invitation screen 7',
    title: 'Maya & Jordan',
    slug: 'maya-jordan',
  },
]

function InviteCard({ card }: { card: HeroCard }) {
  return (
    <div className="w-[200px] shrink-0 overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-[0_12px_40px_-12px_rgba(27,33,26,0.18)] sm:w-[220px] md:w-[236px]">
      <div className="relative aspect-[3/4] w-full bg-lt-subtle">
        <Image
          src={card.src}
          alt={card.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 200px, 236px"
          priority={false}
        />
      </div>
      <div className="border-t border-lt-border px-3 py-2.5">
        <p className="truncate font-display text-sm font-extrabold tracking-tight text-lt-ink">{card.title}</p>
        <p className="truncate font-sans text-[11px] font-semibold text-lt-muted">wedvite.me/{card.slug}</p>
      </div>
    </div>
  )
}

function ScrollColumn({
  cards,
  direction,
  className,
}: {
  cards: HeroCard[]
  direction: 'up' | 'down'
  className?: string
}) {
  const doubled = [...cards, ...cards]

  return (
    <div
      className={`relative flex-1 overflow-hidden ${className ?? ''}`}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <div
        className={direction === 'up' ? 'hero-scroll-up flex flex-col gap-4' : 'hero-scroll-down flex flex-col gap-4'}
        style={{ willChange: 'transform' }}
      >
        {doubled.map((card, i) => (
          <InviteCard key={`${card.slug}-${i}`} card={card} />
        ))}
      </div>
    </div>
  )
}

function StaticHeroCards() {
  const picks = HERO_CARD_IMAGES.slice(0, 4)
  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4 sm:max-w-lg">
      {picks.map((card) => (
        <InviteCard key={card.slug} card={card} />
      ))}
    </div>
  )
}

export default function HeroScrollingCards() {
  const reduceMotion = useReducedMotion()
  const colA = HERO_CARD_IMAGES
  const colB = [...HERO_CARD_IMAGES.slice(4), ...HERO_CARD_IMAGES.slice(0, 4)]

  if (reduceMotion) {
    return (
      <div className="flex w-full justify-center lg:justify-end">
        <StaticHeroCards />
      </div>
    )
  }

  return (
    <div className="flex h-[min(72vh,640px)] w-full max-w-[520px] justify-center gap-4 sm:gap-5 md:h-[min(78vh,720px)] md:max-w-none lg:ml-auto lg:mr-0">
      <ScrollColumn cards={colA} direction="up" className="max-w-[240px]" />
      <ScrollColumn cards={colB} direction="down" className="hidden max-w-[240px] sm:flex" />
    </div>
  )
}
