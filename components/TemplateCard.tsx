'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { TemplateConfig } from '@/lib/templates'

function ComingSoonPreview({ config }: { config: TemplateConfig }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6"
      style={{ background: `linear-gradient(135deg, ${config.bgFrom}, ${config.bgTo})` }}>
      <svg viewBox="0 0 40 40" className="h-10 w-10 opacity-30" fill="none">
        <circle cx="20" cy="20" r="18" stroke={config.accentColor} strokeWidth="1.5" />
        <path d="M13 20h14M20 13v14" stroke={config.accentColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="text-center text-xs font-semibold text-lt-ink/40">More templates coming soon</p>
    </div>
  )
}

interface TemplateCardProps {
  config: TemplateConfig
  index?: number
  animate?: boolean
  imageUrl?: string
}

export default function TemplateCard({ config, index = 0, animate = true, imageUrl }: TemplateCardProps) {
  const isComingSoon = config.id === 'coming-soon'
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [])

  const useThisHref = isLoggedIn
    ? `/dashboard/invitation?template=${config.id}`
    : `/auth/sign-up?template=${config.id}`

  const card = (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-[0_4px_24px_-6px_rgba(27,33,26,0.10)] transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(27,33,26,0.18)] hover:-translate-y-1">
      {/* Preview frame */}
      <div className="relative h-52 w-full overflow-hidden bg-lt-subtle">
        {isComingSoon ? (
          <ComingSoonPreview config={config} />
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={config.name} className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-lt-subtle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-lt-muted/50">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="font-sans text-xs text-lt-muted/60">Preview coming soon</span>
          </div>
        )}
        {config.badgeLabel && (
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white"
            style={{ background: config.accentColor }}>
            {config.badgeLabel}
          </span>
        )}
        {!isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'rgba(26,26,46,0.45)' }}>
            <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-lt-ink shadow-lg">
              Preview →
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-extrabold leading-tight tracking-tight text-lt-ink">
            {config.name}
          </h3>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {config.tags.map(tag => (
            <span key={tag} className="rounded-full border border-lt-border px-2 py-0.5 font-sans text-[10px] font-semibold text-lt-muted">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 font-sans text-xs leading-relaxed text-lt-muted line-clamp-3">
          {config.description}
        </p>

        <div className="mt-4 flex gap-2">
          {isComingSoon ? (
            <Link href="/contact"
              className="flex-1 rounded-full border border-lt-border py-2 text-center font-sans text-xs font-bold text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink">
              Request custom
            </Link>
          ) : (
            <>
              <Link href={config.previewPath}
                className="flex-1 rounded-full border border-lt-border py-2 text-center font-sans text-xs font-bold text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink">
                Preview
              </Link>
              <Link href={useThisHref}
                className="flex-1 rounded-full bg-lt-ink py-2 text-center font-sans text-xs font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Use this
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (!animate) return card

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      {card}
    </motion.div>
  )
}
