'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

interface MusicToggleProps {
  isMuted: boolean
  onToggle: () => void
}

export default function MusicToggle({ isMuted, onToggle }: MusicToggleProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return createPortal(
    <button
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      className="fixed bottom-8 right-5 z-[9999] flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-transform hover:scale-105 active:scale-95"
      style={{
        background: 'rgba(253, 246, 239, 0.92)',
        borderColor: 'rgba(200, 129, 58, 0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {isMuted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8813A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8813A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>,
    document.body
  )
}
