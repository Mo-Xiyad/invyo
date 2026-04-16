import confetti from 'canvas-confetti'

/** Gold / parchment palette from the invitation UI */
const COLORS = ['#c9a96e', '#f5e6c8', '#fffef8', '#8a6030', '#e8d4b8', '#efd9b8']

function originFromElement(el: HTMLElement | null): { x: number; y: number } {
  if (typeof window === 'undefined' || !el) return { x: 0.5, y: 0.42 }
  const r = el.getBoundingClientRect()
  return {
    x: (r.left + r.width / 2) / window.innerWidth,
    y: (r.top + r.height / 2) / window.innerHeight,
  }
}

/**
 * Short confetti sequence from the tap target (wedding-gold palette).
 * Honors `prefers-reduced-motion` via canvas-confetti.
 */
export function playInvitationOpenConfetti(triggerEl: HTMLElement | null) {
  const origin = originFromElement(triggerEl)

  void confetti({
    particleCount: 115,
    spread: 58,
    startVelocity: 36,
    origin,
    ticks: 210,
    gravity: 1,
    scalar: 0.92,
    colors: COLORS,
    disableForReducedMotion: true,
  })

  window.setTimeout(() => {
    void confetti({
      particleCount: 42,
      angle: 58,
      spread: 52,
      origin: { x: Math.max(0.04, origin.x - 0.28), y: Math.min(0.92, origin.y + 0.1) },
      startVelocity: 28,
      colors: COLORS,
      disableForReducedMotion: true,
    })
    void confetti({
      particleCount: 42,
      angle: 122,
      spread: 52,
      origin: { x: Math.min(0.96, origin.x + 0.28), y: Math.min(0.92, origin.y + 0.1) },
      startVelocity: 28,
      colors: COLORS,
      disableForReducedMotion: true,
    })
  }, 140)

  window.setTimeout(() => {
    void confetti({
      particleCount: 32,
      spread: 360,
      startVelocity: 16,
      origin,
      ticks: 110,
      scalar: 0.78,
      colors: COLORS,
      disableForReducedMotion: true,
    })
  }, 280)
}
