/**
 * Original SVG dress icon used for the Riviera Dreams women's dress code card.
 * Saved here for potential reuse. Replaced by the photo illustration
 * public/icons/dress-code/women-dress-blue-bodice.png
 */
export default function WomenDressIconRiviera() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="h-16 w-auto" aria-hidden>
      {/* Head */}
      <circle cx="32" cy="10" r="8" fill="#C8A96E" opacity="0.4" />
      {/* Neck */}
      <rect x="29" y="17" width="6" height="5" rx="1" fill="#C8A96E" opacity="0.35" />
      {/* Bodice */}
      <path d="M24 22 Q32 26 40 22 L42 42 Q32 46 22 42 Z" fill="#6B8FBF" opacity="0.55" />
      {/* Left strap */}
      <path d="M26 22 L22 18 L24 22" fill="#6B8FBF" opacity="0.55" />
      {/* Right strap */}
      <path d="M38 22 L42 18 L40 22" fill="#6B8FBF" opacity="0.55" />
      {/* Skirt — A-line flare */}
      <path d="M22 42 Q10 56 8 72 L56 72 Q54 56 42 42 Q32 46 22 42 Z" fill="#BDD0E4" opacity="0.5" />
      {/* Skirt overlay shimmer */}
      <path d="M28 44 Q26 58 22 72 L30 72 Q30 56 32 44 Z" fill="white" opacity="0.15" />
    </svg>
  )
}
