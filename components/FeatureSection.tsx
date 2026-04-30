'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import MockupCard from './MockupCard'

interface FeatureSectionProps {
  variant: 'create' | 'share' | 'track'
  imagePosition: 'left' | 'right'
  title: string
  subtitle: string
  bgColor?: string
}

export default function FeatureSection({
  variant,
  imagePosition,
  title,
  subtitle,
  bgColor = 'bg-lt-surface',
}: FeatureSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const imageLeft = imagePosition === 'left'

  const mockup = (
    <motion.div
      initial={{ opacity: 0, x: imageLeft ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <MockupCard variant={variant} />
    </motion.div>
  )

  const text = (
    <motion.div
      initial={{ opacity: 0, x: imageLeft ? 40 : -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 md:gap-6"
    >
      <div className="h-1 w-14 rounded-full bg-lt-ink" aria-hidden />
      <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-lt-ink md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      <p className="max-w-xl font-sans text-base font-medium leading-relaxed text-lt-muted md:text-lg">
        {subtitle}
      </p>
      <Link
        href="/contact"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-lt-ink px-8 py-3.5 font-sans text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Contact
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </motion.div>
  )

  return (
    <section className={`${bgColor} py-20 md:py-28`} ref={ref}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {imageLeft ? mockup : text}
          {imageLeft ? text : mockup}
        </div>
      </div>
    </section>
  )
}
