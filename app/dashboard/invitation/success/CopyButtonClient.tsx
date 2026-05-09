'use client'

import { useState } from 'react'

export default function CopyButtonClient({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={() => void copy()}
      className={`w-full rounded-full border py-2.5 font-sans text-sm font-bold transition-colors ${
        copied
          ? 'border-green-500 text-green-600'
          : 'border-lt-border text-lt-muted hover:border-lt-ink hover:text-lt-ink'
      }`}
    >
      {copied ? '✓ Copied!' : 'Copy link'}
    </button>
  )
}
