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
  bgColor = 'bg-champagne',
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
      transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      <div className="w-12 h-0.5 bg-gold" />
      <h2 className="font-serif text-4xl lg:text-5xl text-espresso leading-tight">
        {title}
      </h2>
      <p className="font-sans text-lg text-muted leading-relaxed">
        {subtitle}
      </p>
      <Link
        href="/get-started"
        className="inline-flex items-center gap-2 text-sm font-sans font-bold text-espresso border-b border-espresso pb-0.5 hover:text-gold-deep hover:border-gold-deep transition-colors duration-200 self-start"
      >
        Get started for free
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </motion.div>
  )

  return (
    <section className={`${bgColor} py-24 overflow-hidden`} ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {imageLeft ? mockup : text}
          {imageLeft ? text : mockup}
        </div>
      </div>
    </section>
  )
}
