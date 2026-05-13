/**
 * Original SVG suit icon used for the Riviera Dreams men's dress code card.
 * Saved here for potential reuse. Replaced by the photo illustration
 * public/icons/dress-code/men-shirt-suspenders-bowtie.png
 */
export default function MenSuitIconRiviera() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="h-16 w-auto" aria-hidden>
      {/* Shirt/body */}
      <rect x="18" y="28" width="28" height="44" rx="3" fill="#BDD0E4" opacity="0.4" />
      {/* Left lapel */}
      <path d="M32 28 L20 18 L18 28 Z" fill="#6B8FBF" opacity="0.7" />
      {/* Right lapel */}
      <path d="M32 28 L44 18 L46 28 Z" fill="#6B8FBF" opacity="0.7" />
      {/* Tie */}
      <path d="M30 28 L32 24 L34 28 L33 44 L31 44 Z" fill="#1C2B4A" opacity="0.5" />
      {/* Left shoulder */}
      <path d="M18 28 L10 22 L8 44 L18 44 Z" fill="#6B8FBF" opacity="0.5" />
      {/* Right shoulder */}
      <path d="M46 28 L54 22 L56 44 L46 44 Z" fill="#6B8FBF" opacity="0.5" />
      {/* Head */}
      <circle cx="32" cy="10" r="8" fill="#C8A96E" opacity="0.4" />
      {/* Neck */}
      <rect x="29" y="17" width="6" height="5" rx="1" fill="#C8A96E" opacity="0.35" />
      {/* Pocket square */}
      <path d="M36 33 L40 33 L39 38 L37 36 L35 38 Z" fill="#6B8FBF" opacity="0.6" />
    </svg>
  )
}
